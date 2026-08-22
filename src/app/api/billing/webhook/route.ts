import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { generateId, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'


export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  // Creem uses 'creem-signature' header (no x- prefix)
  const signature = request.headers.get('creem-signature') ?? ''

  if (!process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'webhook not configured' }, { status: 503 })
  }

  // Verify HMAC-SHA256 using Node.js crypto (more reliable in CF Workers than Web Crypto API)
  const hex = signature.replace(/^sha256=/, '').trim()
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    return NextResponse.json({ error: 'invalid signature format' }, { status: 401 })
  }
  const expected = createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET!).update(rawBody, 'utf8').digest('hex')
  const expectedBuf = Buffer.from(expected, 'hex')
  const receivedBuf = Buffer.from(hex, 'hex')
  if (!timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }
  interface WebhookEvent { id: string }
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  let event: { id?: string; eventType?: string; object?: Record<string, unknown>; metadata?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const eventId = event.id ?? generateId('evt_')
  const eventType = event.eventType ?? 'unknown'
  const existing = await db.prepare('SELECT id FROM webhook_events WHERE id = ?').bind(eventId).first<WebhookEvent>()
  if (existing) return NextResponse.json({ ok: true, message: 'already processed' })

  const ts = now()
  const obj = (event.object ?? {}) as Record<string, unknown> & { metadata?: Record<string, unknown> }

  if (eventType === 'checkout.completed') {
    const userId = (event.metadata?.referenceId ?? obj.metadata?.referenceId) as string | undefined
    const productId = obj.product_id as string | undefined
    const credits =
      productId === process.env.CREEM_CREDIT_MINI_PRICE_ID ? 35
      : productId === process.env.CREEM_CREDIT_STANDARD_PRICE_ID ? 80
      : productId === process.env.CREEM_CREDIT_LARGE_PRICE_ID ? 270
      : 0

    if (userId && credits > 0) {
      await db.prepare('INSERT INTO credit_packs (id, user_id, creem_order_id, credits, status, purchased_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(generateId('cp_'), userId, eventId, credits, 'active', ts).run()
      const balanceRow = await db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?').bind(userId).first<{ balance: number }>()
      const newBalance = (balanceRow?.balance ?? 0) + credits
      await db.prepare('INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(generateId('cl_'), userId, credits, newBalance, 'purchase', eventId, ts).run()
    }
  } else if (eventType === 'subscription.active' || eventType === 'subscription.paid') {
    const userId = (event.metadata?.referenceId ?? obj.metadata?.referenceId) as string | undefined
    const subscriptionId = obj.subscription_id as string | undefined
    const productId = obj.product_id as string | undefined
    const plan = productId === process.env.CREEM_PRO_MONTHLY_PRICE_ID || productId === process.env.CREEM_PRO_YEARLY_PRICE_ID ? 'pro' : 'starter'
    const periodEnd = (obj.current_period_end as number) ?? ts

    if (userId && subscriptionId) {
      await db.prepare(`
        INSERT INTO subscriptions (id, user_id, plan, creem_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'active', ?, ?, 0, ?, ?)
        ON CONFLICT(creem_subscription_id) DO UPDATE SET
          status = excluded.status, plan = excluded.plan, current_period_end = excluded.current_period_end, updated_at = excluded.updated_at
      `).bind(generateId('sub_'), userId, plan, subscriptionId, ts, periodEnd, ts, ts).run()
      await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?').bind(plan, ts, userId).run()
    }
  } else if (eventType === 'subscription.expired' || eventType === 'subscription.paused' || eventType === 'subscription.canceled') {
    const subscriptionId = obj.subscription_id as string | undefined
    if (subscriptionId) {
      const newPlan = eventType === 'subscription.canceled' ? 'free' : 'free'
      await db.prepare('UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE creem_subscription_id = ?')
        .bind(eventType === 'subscription.canceled' ? 'cancelled' : eventType === 'subscription.paused' ? 'paused' : 'expired', ts, subscriptionId).run()
      await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = (SELECT user_id FROM subscriptions WHERE creem_subscription_id = ?)')
        .bind(newPlan, ts, subscriptionId).run()
    }
  }

  await db.prepare('INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
    .bind(eventId, eventType, ts).run()

  return NextResponse.json({ ok: true })
}
