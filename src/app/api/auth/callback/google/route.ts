import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now, setCookie } from '@/lib/api-helpers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const appOrigin = process.env.APP_ORIGIN || 'https://kdpnichefinder.net'

  if (error) {
    return NextResponse.redirect(`${appOrigin}/login?error=${encodeURIComponent(error)}`)
  }

  const storedState = cookie(request, 'oauth_state')
  const storedVerifier = cookie(request, 'oauth_verifier')

  if (!code || !state || !storedState || state !== storedState || !storedVerifier) {
    return NextResponse.json({ error: 'invalid_oauth_state' }, { status: 400 })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId || '',
      client_secret: clientSecret || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri || '',
      code_verifier: storedVerifier,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'google_token_exchange_failed' }, { status: 502 })
  }

  const tokens = await tokenRes.json() as { access_token: string }

  // Fetch Google user info
  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userInfoRes.ok) {
    return NextResponse.json({ error: 'google_userinfo_failed' }, { status: 502 })
  }

  const googleUser = await userInfoRes.json() as { sub: string; email: string; name: string; picture: string }
  const ts = now()

  interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  }

  // Upsert user in D1
  await db
    .prepare(`
      INSERT INTO users (id, google_sub, email, name, profile_image_url, plan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'free', ?, ?)
      ON CONFLICT(google_sub) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        profile_image_url = excluded.profile_image_url,
        updated_at = excluded.updated_at
    `)
    .bind(generateId('u_'), googleUser.sub, googleUser.email, googleUser.name, googleUser.picture, ts, ts)
    .run()

  const existingUser = await db
    .prepare('SELECT id FROM users WHERE google_sub = ?')
    .bind(googleUser.sub)
    .first<{ id: string }>()

  const userId = existingUser!.id

  // Create session (30 days)
  const sessionId = generateId('s_')
  const expiresAt = ts + 30 * 86400
  await db
    .prepare('INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(sessionId, userId, ts, expiresAt)
    .run()

  const cookies = [
    setCookie('session_id', sessionId, 30 * 86400),
    `oauth_state=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    `oauth_verifier=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  ]

  return new NextResponse(null, {
    status: 302,
    headers: {
      location: `${appOrigin}/account`,
      'Set-Cookie': cookies.join(', '),
    },
  })
}
