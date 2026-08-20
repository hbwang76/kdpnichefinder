import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null> } } }
  interface MeSessionUser { id: string; user_id: string; email: string; name: string; plan: string; google_sub: string }
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) return NextResponse.json({ authenticated: false })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ authenticated: false })

  const session = await db
    .prepare(
      'SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?'
    )
    .bind(sessionId, now())
    .first<MeSessionUser>()

  if (!session) return NextResponse.json({ authenticated: false })

  return NextResponse.json({
    authenticated: true,
    user: { id: session.id, email: session.email, name: session.name, plan: session.plan },
  })
}
