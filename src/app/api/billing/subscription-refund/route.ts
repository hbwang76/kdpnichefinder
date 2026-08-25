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
    env: {
      DB: DbClient
      CREEM_API_KEY: string
      CREEM_API_BASE?: string
      CREEM_TEST_MODE?: string
    }
  }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare(
    'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
  ).bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user_id

  // 1. Check if user has used any analyses — no refund if used
  const analysisCount = await db.prepare(
    'SELECT COUNT(*) as cnt FROM analyses WHERE user_id = ?'
  ).bind(userId).first<{ cnt: number }>()
  if ((analysisCount?.cnt ?? 0) > 0) {
    return NextResponse.json({
      error: 'subscription_used',
      message: 'Refunds are only available if you have not used your subscription. Please contact support.',
    }, { status: 409 })
  }

  // 2. Find active subscription
  const subscription = await db.prepare(
    'SELECT id, plan, status, creem_subscription_id FROM subscriptions WHERE user_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(userId, 'active').first<{
    id: string; plan: string; status: string; creem_subscription_id: string
  }>()
  if (!subscription) {
    return NextResponse.json({ error: 'no_active_subscription' }, { status: 404 })
  }

  // 3. Find credits to reclaim — credits were issued on subscription.paid, stored in credit_packs with creem_order_id = subscriptionId
  const pack = await db.prepare(
    'SELECT id, credits FROM credit_packs WHERE creem_order_id = ? AND user_id = ? AND status = ?'
  ).bind(subscription.creem_subscription_id, userId, 'active').first<{ id: string; credits: number }>()

  const creditsToReclaim = pack?.credits ?? 0

  // 4. Call Creem refund — find the payment transaction from subscription
  const apiKey = env.CREEM_API_KEY ?? ''
  const isTestMode = env.CREEM_TEST_MODE === 'true'
  const apiBase = isTestMode ? 'https://test-api.creem.io' : (env.CREEM_API_BASE ?? 'https://api.creem.io')

  if (!apiKey) {
    return NextResponse.json({ error: 'refund_service_unavailable', message: 'Please request refund through Creem dashboard.' }, { status: 503 })
  }

  // Step 3: resolve real transaction_id from Creem Checkout API via subscription's checkout history
  let resolvedTransactionId: string | null = null
  try {
    const checkoutRes = await fetch(`${apiBase}/v1/checkouts`, {
      headers: { 'x-api-key': apiKey }
    })
    if (checkoutRes.ok) {
      const checkoutsData = await checkoutRes.json() as { checkouts?: Array<{ id: string; subscription?: string; order?: { transaction?: string } }> }
      const matching = checkoutsData.checkouts?.find(c => c.subscription === subscription.creem_subscription_id)
      resolvedTransactionId = matching?.order?.transaction ?? null
    }
  } catch { /* ignore */ }

  // Step 4: attempt refund with resolved transaction_id, then subscription_id as fallback
  const refundTransactionId = resolvedTransactionId ?? subscription.creem_subscription_id

  const refundRes = await fetch(`${apiBase}/v1/refunds`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: refundTransactionId }),
  })

  let refundBody = ''
  refundBody = await refundRes.text().catch(() => '')

  if (!refundRes.ok) {
    const errData = await refundRes.json().catch(() => ({}))
    const creemError = (errData as { message?: unknown })?.message
    const errorMsg = Array.isArray(creemError) ? creemError[0] : (errData as { message?: string })?.message ?? refundBody
    return NextResponse.json({ error: 'creem_refund_failed', detail: errorMsg }, { status: 200 })
  }

  // 5. Refund succeeded — update DB
  const ts = now()

  // Downgrade user
  await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?')
    .bind('free', ts, userId).run()

  // Update subscription
  await db.prepare('UPDATE subscriptions SET status = ?, updated_at = ? WHERE id = ?')
    .bind('refunded', ts, subscription.id).run()

  // Mark credit pack as refunded and deduct from ledger
  if (pack) {
    await db.prepare('UPDATE credit_packs SET status = ? WHERE id = ?')
      .bind('refunded', pack.id).run()

    if (creditsToReclaim > 0) {
      const ledgerRow = await db.prepare(
        'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
      ).bind(userId).first<{ balance: number }>()
      const newBalance = Math.max(0, (ledgerRow?.balance ?? 0) - creditsToReclaim)
      await db.prepare(`
        INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at)
        VALUES (?, ?, ?, ?, 'subscription_refund', ?, ?)
      `).bind(generateId('cl_'), userId, -creditsToReclaim, newBalance, `refund:${subscription.creem_subscription_id}`, ts).run()
    }
  }

  return NextResponse.json({
    ok: true,
    creditsReclaimed: creditsToReclaim,
    refundedAt: ts,
    message: 'Subscription refunded. You have been downgraded to the free plan.',
  })
}
