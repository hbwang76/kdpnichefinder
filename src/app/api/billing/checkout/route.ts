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
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: Record<string, string | undefined> & { DB: DbClient } }
  const db = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const user = await getSessionUser(db, request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const plan = body.plan

  const productIdMap: Record<string, string | undefined> = {
    starter_monthly: env.CREEM_STARTER_MONTHLY_PRODUCT_ID,
    starter_yearly: env.CREEM_STARTER_YEARLY_PRODUCT_ID,
    pro_monthly: env.CREEM_PRO_MONTHLY_PRODUCT_ID,
    pro_yearly: env.CREEM_PRO_YEARLY_PRODUCT_ID,
    credit_mini: env.CREEM_CREDIT_MINI_PRODUCT_ID,
    credit_standard: env.CREEM_CREDIT_STANDARD_PRODUCT_ID,
    credit_large: env.CREEM_CREDIT_LARGER_PRODUCT_ID,
    // aliases for frontend
    starter_annual: env.CREEM_STARTER_YEARLY_PRODUCT_ID,
    pro_annual: env.CREEM_PRO_YEARLY_PRODUCT_ID,
  }
  const productId = productIdMap[plan]
  if (!productId) return NextResponse.json({ error: 'plan not configured' }, { status: 503 })

  const isTestMode = env.CREEM_TEST_MODE === 'true'
  const apiBase = isTestMode ? 'https://test-api.creem.io' : (env.CREEM_API_BASE || 'https://api.creem.io')
  const appOrigin = env.APP_ORIGIN || 'https://kdpnichefinder.net'
  const apiKey = env.CREEM_API_KEY

  if (!apiKey) return NextResponse.json({ error: 'creem_api_key_missing', env_test_mode: isTestMode, api_base: apiBase }, { status: 500 })

  const checkoutRes = await fetch(`${apiBase}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      metadata: { referenceId: user.user_id },
      success_url: `${appOrigin}/account?checkout=success`,
    }),
  })

  if (!checkoutRes.ok) {
    const errBody = await checkoutRes.text().catch(() => '')
    return NextResponse.json({ error: 'creem_checkout_failed', creem_status: checkoutRes.status, detail: errBody.slice(0, 300) }, { status: 502 })
  }
  const checkout = await checkoutRes.json() as { checkout_url?: string; id?: string }
  return NextResponse.json({ checkout_url: checkout.checkout_url, checkout_id: checkout.id })
}
