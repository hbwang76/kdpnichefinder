import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient {
  prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; all<T>(): Promise<{ results: T[] }> } }
}

interface SessionUser {
  id: string
  user_id: string
  email: string
  name: string | null
  plan: string
  google_sub: string | null
}

async function getSessionUser(db: DbClient, request: NextRequest) {
  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return null
  return db.prepare(
    'SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?'
  ).bind(sessionId, now()).first<SessionUser>()
}

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    id: user.user_id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  })
}
