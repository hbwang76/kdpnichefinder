import { NextRequest, NextResponse } from 'next/server'
import { generateId, now, setCookie } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient {
  prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } }
}

interface LoginUser {
  id: string
  email: string
  name: string | null
  password_hash: string
  plan: string
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltB64, hash] = storedHash.split(':')
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const key = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, ['deriveBits'])
    const derivedBits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      key,
      256
    )
    const derivedHash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)))
    return derivedHash === hash
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await request.json().catch(() => ({}))
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  const user = await db.prepare('SELECT id, email, name, password_hash, plan FROM users WHERE email = ?').bind(email).first<LoginUser>()
  if (!user) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
  }

  const sessionId = generateId('s_')
  const ts = now()
  await db.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').bind(sessionId, user.id, ts + 30 * 86400, ts).run()

  const sessionCookie = setCookie('session_id', sessionId, 30 * 86400)
  return new NextResponse(JSON.stringify({ ok: true, user: { id: user.id, email: user.email, name: user.name } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie },
  })
}

// Keep GET for OAuth redirect
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 503 })
  }
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const { generateId, sha256 } = await import('@/lib/api-helpers')
  const state = generateId('st_')
  const verifier = generateId('vr_')
  const challenge = await sha256(verifier)
  const { now } = await import('@/lib/api-helpers')

  await db.prepare('INSERT INTO oauth_states (id, verifier, expires_at) VALUES (?, ?, ?)').bind(state, verifier, now() + 600).run()

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')

  const { setCookie } = await import('@/lib/api-helpers')
  const cookies = [
    setCookie('oauth_state', state, 600),
    setCookie('oauth_verifier', verifier, 600),
  ]
  return new NextResponse(null, {
    status: 302,
    headers: { location: url.toString(), 'Set-Cookie': cookies.join(', ') },
  })
}
