import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now } from '@/lib/api-helpers'

export const runtime = 'edge'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown>; all<T>(): Promise<{ results: T[] }> } } }

async function getSessionUser(db: DbClient, request: NextRequest) {
  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return null
  const session = await db
    .prepare('SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?')
    .bind(sessionId, now())
    .first()
  return session || null
}

export async function POST(request: NextRequest) {
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  const ip = request.headers.get('cf-connecting-ip') ?? 'anonymous'
  const ts = now()
  const tier = user?.plan ?? 'free'

  let body: { query?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const query = body.query?.trim()
  if (!query) return NextResponse.json({ error: 'query is required' }, { status: 400 })

  // Free tier limit
  if (!user || tier === 'free') {
    const dayStart = ts - (ts % 86400)
    const uid = (user as any).user_id
    const existing = uid
      ? await db.prepare('SELECT id FROM analyses WHERE user_id = ? AND created_at >= ? LIMIT 1').bind(uid, dayStart).first()
      : await db.prepare('SELECT id FROM analyses WHERE query = ? AND created_at >= ? AND tier = ?').bind(`free_ip_${ip}_${dayStart}`, dayStart, 'free').first()
    if (existing) {
      return NextResponse.json({ error: 'Free daily limit reached. Login to check your plan or purchase credits.', code: 'FREE_LIMIT_REACHED' }, { status: 429 })
    }
  }

  // Placeholder analysis (replace with real AI call)
  const analysis = {
    niches: [{
      rank: 1,
      niche: query,
      bsrRange: '10,000–40,000',
      competition: 'medium',
      seasonality: 'stable',
      priceRange: '$9.99–$12.99',
      trend: 'rising (+8% 12m)',
      score: 72,
      titles: [
        `Ultimate ${query} Guide: The Complete Step-by-Step System`,
        `The ${query} Handbook: From Idea to Profitable KDP Book in 30 Days`,
        `${query} Mastery: A Proven Roadmap for Self-Publishers`,
      ],
      coverStyle: 'Bold sans-serif title on solid background with high-contrast accent color. Professional but approachable.',
      actionPlan: [
        'Week 1-2: Conduct keyword research using Helium 10 or Publisher Rocket. Optimize book metadata.',
        'Week 3-4: Launch with 2-3 day Countdown Deal at $0.99–$2.99. Run Facebook ads ($5-10/day).',
        'Week 5+: Implement follow-up email sequence asking for reviews.',
      ],
      risks: ['Seasonal variation may affect Q4 sales.', 'Competition is increasing — differentiate with unique angle.'],
    }],
    query,
    analyzed_at: new Date().toISOString(),
  }

  const analysisId = generateId('a_')
  const storedQuery = (user as any)?.user_id ? query : `free_ip_${ip}_${ts - (ts % 86400)}`
  await db.prepare('INSERT INTO analyses (id, user_id, query, result, tier, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(analysisId, (user as any)?.user_id ?? null, storedQuery, JSON.stringify(analysis), tier, ts)
    .run()

  return NextResponse.json({ id: analysisId, ...analysis })
}

export async function GET(request: NextRequest) {
  const db: DbClient = (request as NextRequest & { env: { DB: DbClient } }).env?.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '30'), 100)

  const { results } = await db
    .prepare('SELECT id, query, tier, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
    .bind((user as any).user_id, limit)
    .all()

  return NextResponse.json({ analyses: results ?? [] })
}
