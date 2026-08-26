import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now, setCookie } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient {
  prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } }
}

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await request.json().catch(() => ({}))
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password
  const name = (body.name || '').trim()

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 })
  }

  // Check if user exists
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return NextResponse.json({ error: 'email already registered' }, { status: 409 })
  }

  // Hash password with Web Crypto PBKDF2
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, ['deriveBits'])
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256
  )
  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)))
  const saltB64 = btoa(String.fromCharCode(...salt))
  const passwordHash = saltB64 + ':' + hash

  const userId = generateId('u_')
  const sessionId = generateId('s_')
  const ts = now()

  await db.prepare(
    'INSERT INTO users (id, email, name, password_hash, plan, google_sub, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(userId, email, name || null, passwordHash, 'free', null, ts).run()

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(sessionId, userId, ts + 30 * 86400, ts).run()

  const sessionCookie = setCookie('session_id', sessionId, 30 * 86400)
  return new NextResponse(JSON.stringify({ ok: true, user: { id: userId, email, name } }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie },
  })
}
