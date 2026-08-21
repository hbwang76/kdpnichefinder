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

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient } }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const plan = body.plan
  const validPlans = ['starter_monthly', 'starter_yearly', 'pro_monthly', 'pro_yearly', 'credit_mini', 'credit_standard', 'credit_large']
  if (!plan || !validPlans.includes(plan)) {
    return NextResponse.json({ error: 'invalid plan' }, { status: 400 })
  }

  const priceIdMap: Record<string, string | undefined> = {
    starter_monthly: process.env.CREEM_STARTER_MONTHLY_PRICE_ID,
    starter_yearly: process.env.CREEM_STARTER_YEARLY_PRICE_ID,
    pro_monthly: process.env.CREEM_PRO_MONTHLY_PRICE_ID,
    pro_yearly: process.env.CREEM_PRO_YEARLY_PRICE_ID,
    credit_mini: process.env.CREEM_CREDIT_MINI_PRICE_ID,
    credit_standard: process.env.CREEM_CREDIT_STANDARD_PRICE_ID,
  }
  const priceId = priceIdMap[plan]
  if (!priceId) return NextResponse.json({ error: 'plan not configured' }, { status: 503 })

  const apiBase = process.env.CREEM_API_BASE || 'https://api.creem.io'
  const appOrigin = process.env.APP_ORIGIN || 'https://kdpnichefinder.net'

  const checkoutRes = await fetch(`${apiBase}/v1/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CREEM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: priceId,
      customer_email: user.email,
      metadata: { referenceId: user.user_id },
      success_url: `${appOrigin}/account?checkout=success`,
      cancel_url: `${appOrigin}/pricing?checkout=cancelled`,
    }),
  })

  if (!checkoutRes.ok) return NextResponse.json({ error: 'creem_checkout_failed' }, { status: 502 })
  const checkout = await checkoutRes.json() as { url?: string; id?: string }
  return NextResponse.json({ checkout_url: checkout.url, checkout_id: checkout.id })
}
