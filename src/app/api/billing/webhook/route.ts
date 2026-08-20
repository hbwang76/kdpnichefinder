import { NextRequest, NextResponse } from 'next/server'
import { generateId, now } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-creem-signature') ?? ''

  if (!process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'webhook not configured' }, { status: 503 })
  }

  // Verify HMAC
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.CREEM_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const hex = signature.replace(/^sha256=/, '')
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  const sigBytes = new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
  const bodyBytes = encoder.encode(rawBody)
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, bodyBytes)
  if (!valid) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  let event: { id?: string; type?: string; data?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const eventId = event.id ?? generateId('evt_')
  const eventType = event.type ?? 'unknown'
  const existing = await db.prepare('SELECT id FROM webhook_events WHERE id = ?').bind(eventId).first()
  if (existing) return NextResponse.json({ ok: true, message: 'already processed' })

  const ts = now()
  const d = event.data ?? {}

  if (eventType === 'order.completed') {
    const customerId = d.customer_id as string
    const orderId = d.order_id as string
    const priceId = d.price_id as string
    const credits = priceId === process.env.CREEM_CREDIT_MINI_PRICE_ID ? 15 : 35

    if (customerId && orderId) {
      await db.prepare('INSERT INTO credit_packs (id, user_id, creem_order_id, credits, status, purchased_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(generateId('cp_'), customerId, orderId, credits, 'active', ts).run()
      const balanceRow = await db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?').bind(customerId).first<{ balance: number }>()
      await db.prepare('INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(generateId('cl_'), customerId, credits, (balanceRow?.balance ?? 0) + credits, 'purchase', orderId, ts).run()
    }
  } else if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    const customerId = d.customer_id as string
    const subscriptionId = d.subscription_id as string
    const planStr = ((d.plan as string) ?? '').toLowerCase()
    const plan = planStr.includes('pro') ? 'pro' : 'starter'
    const status = (d.status as string) ?? 'active'
    const periodEnd = (d.current_period_end as number) ?? ts
    if (customerId && subscriptionId) {
      await db.prepare(`
        INSERT INTO subscriptions (id, user_id, plan, creem_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        ON CONFLICT(creem_subscription_id) DO UPDATE SET
          status = excluded.status, plan = excluded.plan, current_period_end = excluded.current_period_end, updated_at = excluded.updated_at
      `).bind(generateId('sub_'), customerId, plan, subscriptionId, status, ts, periodEnd, ts, ts).run()
      if (status === 'active') {
        await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?').bind(plan, ts, customerId).run()
      }
    }
  } else if (eventType === 'subscription.cancelled') {
    const subscriptionId = d.subscription_id as string
    if (subscriptionId) {
      await db.prepare('UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE creem_subscription_id = ?')
        .bind('cancelled', ts, subscriptionId).run()
    }
  }

  await db.prepare('INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
    .bind(eventId, eventType, ts).run()

  return NextResponse.json({ ok: true })
}
