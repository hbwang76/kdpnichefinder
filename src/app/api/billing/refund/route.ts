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

  // Look up the credit pack
  const pack = await db.prepare(
    'SELECT id, credits, status, user_id FROM credit_packs WHERE creem_order_id = ? AND user_id = ?'
  ).bind(creemOrderId, session.user_id).first<{ id: string; credits: number; status: string; user_id: string }>()
  if (!pack) return NextResponse.json({ error: 'pack_not_found' }, { status: 404 })
  if (pack.status === 'refunded') return NextResponse.json({ error: 'already_refunded' }, { status: 409 })

  const creditsToRefund = pack.credits

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

  // Step 1: Get the order to find the payment/transaction ID
  const orderRes = await fetch(`${apiBase}/v1/orders/${encodeURIComponent(creemOrderId)}`, {
    method: 'GET',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
  })

  let paymentId: string | null = null
  let orderStatus = 0

  if (orderRes.ok) {
    const orderData = await orderRes.json() as Record<string, unknown>
    orderStatus = orderRes.status
    // Try various payment/transaction ID field names
    paymentId = (orderData.payment_id as string)
      ?? (orderData.transaction_id as string)
      ?? (orderData.last_transaction_id as string)
      ?? (orderData.id as string)
      ?? null
    console.log('REFUND_DEBUG order lookup', { status: orderRes.status, orderId: creemOrderId, paymentId, orderKeys: Object.keys(orderData) })
  } else {
    const errText = await orderRes.text().catch(() => '')
    console.log('REFUND_DEBUG order lookup failed', { status: orderRes.status, err: errText.slice(0, 100) })
  }

  // Step 2: Refund using payment ID (or order ID as fallback)
  const refundTransactionId = paymentId ?? creemOrderId
  const refundRes = await fetch(`${apiBase}/v1/refunds`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: refundTransactionId }),
  })

  const refundStatus = refundRes.status
  const refundBody = await refundRes.text().catch(() => '')
  console.log('REFUND_DEBUG refund response', { status: refundStatus, transactionId: refundTransactionId, body: refundBody.slice(0, 200) })

  if (refundRes.ok) {
    // Creem refunded — deduct credits locally
    const ts = now()
    const ledgerRow = await db.prepare(
      'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
    ).bind(session.user_id).first<{ balance: number }>()
    const newBalance = Math.max(0, (ledgerRow?.balance ?? 0) - creditsToRefund)
    await db.prepare(
      'INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(generateId('cl_'), session.user_id, -creditsToRefund, newBalance, `refund: ${reason ?? 'creem'}`, `creem_refund:${creemOrderId}`, ts).run()
    await db.prepare('UPDATE credit_packs SET status = ? WHERE id = ?').bind('refunded', pack.id).run()
    return NextResponse.json({ ok: true, creditsDeducted: creditsToRefund, refundedAt: ts })
  }

  // Refund failed — do NOT deduct credits locally
  const errData = await refundRes.json().catch(() => ({}))
  return NextResponse.json({ ok: false, error: 'creem_refund_failed', detail: errData }, { status: 502 })
}
