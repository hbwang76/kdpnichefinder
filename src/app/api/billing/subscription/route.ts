import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null> } } }

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?').bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await db.prepare(
    'SELECT id, plan, status, current_period_start, current_period_end, cancel_at_period_end, creem_subscription_id FROM subscriptions WHERE user_id = ? AND status != ? ORDER BY created_at DESC LIMIT 1'
  ).bind(session.user_id, 'free').first<{
    id: string; plan: string; status: string; current_period_start: string | null; current_period_end: string | null; cancel_at_period_end: number; creem_subscription_id: string
  }>()

  return NextResponse.json({ subscription })
}
