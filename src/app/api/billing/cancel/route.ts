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
    id: string; creem_subscription_id: string; plan: string; status: string; current_period_end: string | null
  }>()
  if (!subscription) return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })

  // Call Creem API to cancel subscription (non-fatal: local update even if Creem fails)
  const apiKey = env.CREEM_API_KEY ?? ''
  const apiBase = env.CREEM_API_BASE ?? 'https://test-api.creem.io/v1'
  let creemCanceled = false
  try {
    const cancelRes = await fetch(`${apiBase}/subscriptions/${subscription.creem_subscription_id}/cancel`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    })
    creemCanceled = cancelRes.ok
  } catch { /* ignore network errors */ }

  const ts = now()
  await db.prepare('UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE id = ?')
    .bind('canceled', ts, subscription.id).run()
  // NOTE: user plan stays unchanged — downgrade happens only on subscription.expired or user-initiated refund

  return NextResponse.json({ ok: true, creemCanceled, canceledAt: ts, periodEnd: subscription.current_period_end })
}
