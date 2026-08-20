import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }

interface MeSessionUser { id: string; user_id: string; email: string; name: string; plan: string; google_sub: string }

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db: DbClient = env.DB
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
