import { NextRequest, NextResponse } from 'next/server'
import { cookie, clearCookie } from '@/lib/api-helpers'

export const runtime = 'edge'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> }; all<T>(): Promise<{ results: T[] }> } }

export async function POST(request: NextRequest) {
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
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
