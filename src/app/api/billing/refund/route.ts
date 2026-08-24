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

  // Look up the credit pack to get credits amount and validate
  const pack = await db.prepare(
    'SELECT id, credits, status, user_id FROM credit_packs WHERE creem_order_id = ? AND user_id = ?'
  ).bind(creemOrderId, session.user_id).first<{ id: string; credits: number; status: string; user_id: string }>()
  if (!pack) return NextResponse.json({ error: 'pack_not_found' }, { status: 404 })
  if (pack.status === 'refunded') return NextResponse.json({ error: 'already_refunded' }, { status: 409 })

  const creditsToRefund = pack.credits

  // Get Creem API key (use TEST mode base if starts with creem_test_)
  const apiKey = env.CREEM_API_KEY ?? ''
  const isTestMode = env.CREEM_TEST_MODE === 'true'
  const apiBase = isTestMode ? 'https://test-api.creem.io' : (env.CREEM_API_BASE ?? 'https://api.creem.io')
  console.log('REFUND_DEBUG', JSON.stringify({ isTestMode, apiBase, apiKeyPrefix: apiKey.slice(0, 12), creemOrderId }))

  // Call Creem refund API — POST /v1/refunds with transaction_id
  // Only deduct credits AFTER Creem succeeds; otherwise user must go to Creem Dashboard
  if (apiKey) {
    const refundUrl = `${apiBase}/v1/refunds`
    console.log('REFUND_DEBUG fetch', refundUrl, { transaction_id: creemOrderId })
    const refundRes = await fetch(refundUrl, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: creemOrderId }),
    })
    const status = refundRes.status
    const bodyText = await refundRes.text().catch(() => '')
    console.log('REFUND_DEBUG response', status, bodyText.slice(0, 200))

    if (refundRes.ok) {
      // Creem refunded successfully — now deduct credits locally
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
    } else {
      // Creem refund failed — do NOT deduct credits locally
      const errData = await refundRes.json().catch(() => ({}))
      return NextResponse.json({ ok: false, error: 'creem_refund_failed', detail: errData }, { status: 502 })
    }
  }

  // No Creem API key configured — user must request refund via Creem Dashboard
  return NextResponse.json({
    ok: false,
    error: 'refund_via_dashboard',
    message: 'Please request your refund directly through the Creem customer portal or contact support@kdpnichefinder.net. Credits will be restored automatically once Creem processes the refund.',
  }, { status: 503 })
}
