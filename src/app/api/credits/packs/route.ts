import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; all<T>(): Promise<T[]> } } }

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?').bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const packs = await db.prepare('SELECT * FROM credit_packs WHERE user_id = ? ORDER BY purchased_at DESC').bind(session.user_id).all<{ id: string; user_id: string; creem_order_id: string; credits: number; status: string; purchased_at: number }>()
  return NextResponse.json({ packs })
}
