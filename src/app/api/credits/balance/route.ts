import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null> } } }
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db
    .prepare('SELECT s.id, s.user_id FROM sessions s WHERE s.id = ? AND s.expires_at > ?')
    .bind(sessionId, now())
    .first()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session as any).user_id
  const row = await db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?').bind(userId).first<{ balance: number }>()
  return NextResponse.json({ balance: row?.balance ?? 0 })
}
