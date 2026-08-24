import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null> } } }
interface SessionUser { id: string; user_id: string; email: string; name: string; plan: string; google_sub: string }

async function getSessionUser(db: DbClient, request: NextRequest): Promise<SessionUser | null> {
  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return null
  const session = await db
    .prepare('SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?')
    .bind(sessionId, now())
    .first<SessionUser>()
  return session || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const analysis = await db
    .prepare('SELECT * FROM analyses WHERE id = ? AND user_id = ?')
    .bind(id, user.user_id)
    .first<Record<string, unknown>>()

  if (!analysis) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({ ...analysis, result: JSON.parse(analysis.result as string) })
}
