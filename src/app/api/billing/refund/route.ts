import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient {
  prepare(sql: string): {
    bind(...vals: unknown[]): {
      first<T>(): Promise<T | null>
      run(): Promise<{ meta: { changes: number } }>
    }
  }
}

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as {
    env: { DB: DbClient; CREEM_API_KEY: string; CREEM_API_BASE?: string; CREEM_TEST_MODE?: string }
  }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?')
    .bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { creemOrderId, reason } = body as { creemOrderId?: string; reason?: string }

  if (!creemOrderId) return NextResponse.json({ error: 'order_id_required' }, { status: 400 })

  const packRow = await db.prepare(
    'SELECT id, credits, status, user_id, gateway_checkout_id, creem_order_id FROM credit_packs WHERE creem_order_id = ? AND user_id = ?'
  ).bind(creemOrderId, session.user_id).first<{ id: string; credits: number; status: string; user_id: string; gateway_checkout_id: string | null; creem_order_id: string }>()
  if (!packRow) return NextResponse.json({ error: 'pack_not_found' }, { status: 404 })
  if (packRow.status === 'refunded') return NextResponse.json({ error: 'already_refunded' }, { status: 409 })

  const creditsToRefund = packRow.credits

  // creemOrderId is stored as gateway_payment_id — use it directly as transaction_id
  // For old packs it may be ord_... which is not a refundable transaction ID
  // Try checkout API first to resolve real transaction_id from checkout_id or order_id
  const apiKey = env.CREEM_API_KEY ?? ''
  const isTestMode = env.CREEM_TEST_MODE === 'true'
  const apiBase = isTestMode ? 'https://test-api.creem.io' : (env.CREEM_API_BASE ?? 'https://api.creem.io')

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      error: 'refund_via_dashboard',
      message: 'Please request your refund through the Creem customer portal.',
    }, { status: 503 })
  }

  // Use creem_order_id (stored as tran_xxx from webhookTransactionId) as the refund transaction ID.
  // gateway_checkout_id (ch_xxx) is NOT a valid Creem refund transaction identifier.
  const refundTransactionId = packRow.creem_order_id

  const refundRes = await fetch(`${apiBase}/v1/refunds`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: refundTransactionId }),
  })

  const refundBody = await (refundRes?.text().catch(() => '') ?? Promise.resolve(''))

  if (refundRes?.ok) {
    const ts = now()
    const ledgerRow = await db.prepare(
      'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
    ).bind(session.user_id).first<{ balance: number }>()
    const newBalance = Math.max(0, (ledgerRow?.balance ?? 0) - creditsToRefund)
    await db.prepare(
      'INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(generateId('cl_'), session.user_id, -creditsToRefund, newBalance, `refund: ${reason ?? 'creem'}`, `creem_refund:${creemOrderId}`, ts).run()
    await db.prepare('UPDATE credit_packs SET status = ? WHERE id = ?').bind('refunded', packRow.id).run()
    return NextResponse.json({ ok: true, creditsDeducted: creditsToRefund, refundedAt: ts })
  }

  const errData = await (refundRes?.json().catch(() => ({})) ?? Promise.resolve({}))
  const creemError = (errData as { message?: string[] })?.message
  const errorMsg = Array.isArray(creemError) ? creemError[0] : (errData as { message?: string })?.message ?? refundBody
  return NextResponse.json({ ok: false, error: 'creem_refund_failed', detail: errorMsg }, { status: 200 })
}
