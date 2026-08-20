import { NextRequest, NextResponse } from 'next/server'
import { cookie, clearCookie } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> }; all<T>(): Promise<{ results: T[] }> } }

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (sessionId) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': clearCookie('session_id'),
      },
    }
  )
}
