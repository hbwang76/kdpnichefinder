import { NextRequest, NextResponse } from 'next/server'
import { cookie, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }

interface CheckoutSessionUser { id: string; user_id: string; email: string; name: string; plan: string }

async function getSessionUser(db: DbClient, request: NextRequest): Promise<CheckoutSessionUser | null> {
  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return null
  const session = await db
    .prepare('SELECT s.id, s.user_id, u.email, u.name, u.plan FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?')
    .bind(sessionId, now())
    .first<CheckoutSessionUser>()
  return session || null
}

function getDb(): DbClient {
  const ctx = getCloudflareContext() as unknown as { env: { DB: DbClient } }
  if (!ctx.env.DB) throw new Error('DB not bound')
  return ctx.env.DB
}

export async function POST(request: NextRequest) {
  let db: DbClient
  try {
    db = getDb()
  } catch (e) {
    return NextResponse.json({ error: 'context_error', detail: String(e) }, { status: 500 })
  }
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const plan = body.plan

  const priceIdMap: Record<string, string | undefined> = {
    starter_monthly: process.env.CREEM_STARTER_MONTHLY_PRICE_ID,
    starter_yearly: process.env.CREEM_STARTER_YEARLY_PRICE_ID,
    pro_monthly: process.env.CREEM_PRO_MONTHLY_PRICE_ID,
    pro_yearly: process.env.CREEM_PRO_YEARLY_PRICE_ID,
    credit_mini: process.env.CREEM_CREDIT_MINI_PRICE_ID,
    credit_standard: process.env.CREEM_CREDIT_STANDARD_PRICE_ID,
    credit_large: process.env.CREEM_CREDIT_LARGE_PRICE_ID,
  }
  const validPlans = Object.keys(priceIdMap)
  const priceId = priceIdMap[plan]
  if (!priceId) return NextResponse.json({ error: 'plan not configured' }, { status: 503 })

  const isTestMode = process.env.CREEM_TEST_MODE === 'true'
  const apiBase = isTestMode ? 'https://test-api.creem.io' : (process.env.CREEM_API_BASE || 'https://api.creem.io')
  const appOrigin = process.env.APP_ORIGIN || 'https://kdpnichefinder.net'
  const apiKey = process.env.CREEM_API_KEY

  if (!apiKey) return NextResponse.json({ error: 'creem_api_key_missing', env_test_mode: isTestMode, api_base: apiBase }, { status: 500 })

  const checkoutRes = await fetch(`${apiBase}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CREEM_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: priceId,
      metadata: { referenceId: user.user_id },
      success_url: `${appOrigin}/account?checkout=success`,
      cancel_url: `${appOrigin}/pricing?checkout=cancelled`,
    }),
  })

  if (!checkoutRes.ok) return NextResponse.json({ error: 'creem_checkout_failed' }, { status: 502 })
  const checkout = await checkoutRes.json() as { url?: string; id?: string }
  return NextResponse.json({ checkout_url: checkout.url, checkout_id: checkout.id })
}
