import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Result = { results: any[]; success: boolean }

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as any
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?').bind(sessionId, now()).first()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result: D1Result = await db.prepare('SELECT * FROM credit_packs WHERE user_id = ? ORDER BY purchased_at DESC').bind(session.user_id).all()
  return NextResponse.json({ packs: result.results ?? [] })
}
