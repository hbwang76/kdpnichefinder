import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient {
  prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; all<T>(): Promise<{ results: T[] }> } }
}

async function getSessionUser(db: DbClient, request: NextRequest) {
  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return null
  return db.prepare(
    'SELECT s.id, s.user_id, u.email, u.name, u.plan FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?'
  ).bind(sessionId, now()).first()
}

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ts = now()
  const dayStart = ts - (ts % 86400)

  const todayCount = await db.prepare(
    'SELECT COUNT(*) as cnt FROM analyses WHERE user_id = ? AND created_at >= ?'
  ).bind(user.user_id, dayStart).first<{ cnt: number }>()

  const creditBalance = await db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?"
  ).bind(user.user_id).first<{ balance: number }>()

  const subscription = await db.prepare(
    'SELECT status, cancel_at_period_end, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(user.user_id).first()

  return NextResponse.json({
    plan: user.plan,
    today_analyses: todayCount?.cnt ?? 0,
    free_limit: 1,
    credit_balance: creditBalance?.balance ?? 0,
    subscription: subscription ?? null,
  })
}
