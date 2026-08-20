import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const db = (request as any).env?.DB
  if (!db) return NextResponse.json({ authenticated: false })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ authenticated: false })

  const session = await db
    .prepare(
      'SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?'
    )
    .bind(sessionId, now())
    .first()

  if (!session) return NextResponse.json({ authenticated: false })

  return NextResponse.json({
    authenticated: true,
    user: { id: (session as any).id, email: (session as any).email, name: (session as any).name, plan: (session as any).plan },
  })
}
