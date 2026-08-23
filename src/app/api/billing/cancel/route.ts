import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient; CREEM_API_KEY: string; CREEM_API_BASE: string } }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT s.user_id FROM sessions s WHERE s.id = ? AND s.expires_at > ?').bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await db.prepare('SELECT * FROM subscriptions WHERE user_id = ? AND status = ?').bind(session.user_id, 'active').first<{
    id: string; creem_subscription_id: string; plan: string; status: string; current_period_end: number
  }>()
  if (!subscription) return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })

  // Call Creem API to cancel subscription
  const apiKey = env.CREEM_API_KEY ?? ''
  const apiBase = env.CREEM_API_BASE ?? 'https://test-api.creem.io/v1'
  const cancelRes = await fetch(`${apiBase}/subscriptions/${subscription.creem_subscription_id}/cancel`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
  })

  if (!cancelRes.ok) {
    const err = await cancelRes.text()
    return NextResponse.json({ error: 'Failed to cancel subscription', details: err }, { status: 500 })
  }

  const ts = now()
  await db.prepare('UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE id = ?')
    .bind('canceled', ts, subscription.id).run()
  await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?')
    .bind('free', ts, session.user_id).run()

  return NextResponse.json({ ok: true, canceledAt: ts, periodEnd: subscription.current_period_end })
}
