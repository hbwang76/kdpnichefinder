import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now, setCookie, sha256 } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 503 })
  }

  const db = (request as any).env?.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const state = generateId('st_')
  const verifier = generateId('vr_')
  const challenge = await sha256(verifier)

  await db
    .prepare('INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
    .bind(state, `oauth_state:${verifier}`, now() + 600)
    .run()

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')

  const cookies = [
    setCookie('oauth_state', state, 600),
    setCookie('oauth_verifier', verifier, 600),
  ]

  return new NextResponse(null, {
    status: 302,
    headers: {
      location: url.toString(),
      'Set-Cookie': cookies.join(', '),
    },
  })
}
