import { NextRequest, NextResponse } from 'next/server'
import { generateId, now, json } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// ─── Billing plan definitions (must match Creem product IDs in env) ─────────
type BillingPlan = 'starter_monthly' | 'starter_yearly' | 'pro_monthly' | 'pro_yearly' | 'credit_mini' | 'credit_standard' | 'credit_larger'
type AccountPlan = 'free' | 'starter' | 'pro'
type BillingInterval = 'month' | 'year' | null

interface BillingPlanConfig {
  productEnvs: string[]
  plan: AccountPlan
  billingInterval: BillingInterval
  pricingModel: 'subscription' | 'one_time_credits'
  creditsGranted?: number
}

const BILLING_PLANS: Record<BillingPlan, BillingPlanConfig> = {
  starter_monthly:  { productEnvs: ['CREEM_STARTER_MONTHLY_PRODUCT_ID'],  plan: 'starter', billingInterval: 'month',  pricingModel: 'subscription' },
  starter_yearly:   { productEnvs: ['CREEM_STARTER_YEARLY_PRODUCT_ID'],   plan: 'starter', billingInterval: 'year',   pricingModel: 'subscription' },
  pro_monthly:      { productEnvs: ['CREEM_PRO_MONTHLY_PRODUCT_ID'],     plan: 'pro',     billingInterval: 'month',  pricingModel: 'subscription' },
  pro_yearly:       { productEnvs: ['CREEM_PRO_YEARLY_PRODUCT_ID'],      plan: 'pro',     billingInterval: 'year',   pricingModel: 'subscription' },
  credit_mini:      { productEnvs: ['CREEM_CREDIT_MINI_PRODUCT_ID'],      plan: 'free',    billingInterval: null,    pricingModel: 'one_time_credits', creditsGranted: 35 },
  credit_standard:  { productEnvs: ['CREEM_CREDIT_STANDARD_PRODUCT_ID'],  plan: 'free',    billingInterval: null,    pricingModel: 'one_time_credits', creditsGranted: 80 },
  credit_larger:    { productEnvs: ['CREEM_CREDIT_LARGER_PRODUCT_ID'],    plan: 'free',    billingInterval: null,    pricingModel: 'one_time_credits', creditsGranted: 270 },
}

const GRANT_EVENTS   = new Set(['checkout.completed', 'subscription.paid'])
const REVOKE_EVENTS  = new Set(['subscription.canceled', 'subscription.expired', 'subscription.paused', 'refund.created', 'refund.completed'])
const REFUND_EVENTS  = new Set(['refund.created', 'refund.completed'])

// ─── Helpers ──────────────────────────────────────────────────────────────────
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
function id(): string { return generateId('id_') }
function normalizePlan(value: unknown): BillingPlan | null {
  return typeof value === 'string' && value in BILLING_PLANS ? value as BillingPlan : null
}
function accountPlan(value: unknown): AccountPlan {
  return value === 'pro' || value === 'starter' ? value as AccountPlan : 'free'
}

// Creem webhook payload shape
interface CreemWebhookPayload {
  id?: string
  eventType?: string
  type?: string
  object?: unknown
  data?: unknown
  metadata?: Record<string, unknown>
}

// Extract the checkout/subscription object from the payload
function webhookObject(payload: CreemWebhookPayload): Record<string, unknown> {
  const obj = asRecord(payload.object || payload.data)
  // Also try top-level for test mode webhooks that flatten the structure
  if (obj && Object.keys(obj).length === 0) {
    return payload as Record<string, unknown>
  }
  return obj
}

// Merge metadata from all possible locations (Creem nests it in different places)
function webhookMetadata(object: Record<string, unknown>): Record<string, unknown> {
  const order        = asRecord(object.order)
  const subscription = asRecord(object.subscription)
  const checkout     = asRecord(object.checkout)
  const customer     = asRecord(object.customer)
  return {
    ...asRecord(checkout?.metadata),
    ...asRecord(customer?.metadata),
    ...asRecord(order?.metadata),
    ...asRecord(subscription?.metadata),
    ...asRecord(object.metadata),
  }
}

// Get userId from metadata.referenceId (set at checkout creation)
function webhookUserId(object: Record<string, unknown>): string | undefined {
  const metadata = webhookMetadata(object)
  return asString(metadata.referenceId)
    || asString(metadata.user_id)
    || asString(object.user_id)
    || asString(asRecord(object.customer)?.id) // fallback: use customer ID as user ID
}

// Get product ID from various possible locations
function webhookProductId(object: Record<string, unknown>): string | undefined {
  const product = asRecord(object.product)
  if (product?.id) return asString(product.id)

  const subscription = asRecord(object.subscription)
  // subscription.product can be a string (subscription.* events) or object
  const subProduct = subscription?.product
  if (typeof subProduct === 'string') return subProduct
  if (subProduct && typeof subProduct === 'object') return asString((subProduct as Record<string, unknown>).id)

  // Fallback to flat fields — common in test mode webhooks
  return asString(object.product_id)
    ?? asString(object.productId)
    ?? asString((object as Record<string, unknown>).product_id)
    ?? asString(asRecord(object.checkout)?.product_id)
    ?? asString(asRecord(object.order)?.product_id)
    ?? (subscription as Record<string, unknown>)?.product_id as string | undefined
    ?? (subscription?.items as Array<{ product_id?: string }>)?.[0]?.product_id
    ?? asString((object.metadata as Record<string, unknown>)?.product_id)
}

// Determine the billing plan from metadata or product object
function webhookPlan(object: Record<string, unknown>, env: Record<string, string | undefined>): BillingPlan | null {
  const metadata = webhookMetadata(object)
  const checkoutPlan = normalizePlan(asString(metadata.checkout_plan))
  if (checkoutPlan) return checkoutPlan

  const productId = webhookProductId(object)

  if (productId) {
    for (const [plan, config] of Object.entries(BILLING_PLANS)) {
      for (const envKey of config.productEnvs) {
        const envVal = env[envKey]
        if (envVal && productId === envVal) return plan as BillingPlan
      }
      // Fallback: also check PRICE_ID variants if nothing matched yet
      for (const envKey of config.productEnvs) {
        const priceKey = envKey.replace('_PRODUCT_ID', '_PRICE_ID')
        const priceVal = env[priceKey]
        if (priceVal && productId === priceVal) return plan as BillingPlan
      }
    }
  }

  return null
}

// Extract transaction/payment ID for idempotency
function webhookTransactionId(object: Record<string, unknown>): string {
  const order = asRecord(object.order)
  const transaction = asRecord(object.last_transaction)
  const paymentTransactions = Array.isArray(order?.payment_transactions) ? order.payment_transactions : []
  // Prefer actual payment transaction (tran_...) — required for refund API
  // Order ID (ord_...) is NOT a refundable transaction identifier
  return asString(order.transaction)    // tran_... — the actual payment transaction (MOST IMPORTANT)
    ?? asString(object.transaction_id)
    ?? asString(object.payment_id)
    ?? asString(object.last_transaction_id)
    ?? asString(order.transaction_id)
    ?? asString(transaction.id)
    ?? (paymentTransactions[0] as Record<string, unknown>)?.id as string | undefined
    ?? asString(object.id)      // event ID (evt_...) — last resort, not useful for refund
    ?? id()
}

// Get amount from various possible locations
function webhookAmount(object: Record<string, unknown>): number {
  const order = asRecord(object.order)
  const transaction = asRecord(object.last_transaction)
  return Number(
    object.amount ?? object.amount_total
    ?? transaction.amount_paid ?? transaction.amount
    ?? order.amount_paid ?? order.amount
    ?? 0
  )
}

// Creem processing fee in cents. Creem keeps this fee even on refunds,
// so the net received amount is gross - fee. Defaults match Creem's
// standard rate (3.9% + $0.40); override via env if the rate changes.
function creemFeeCents(amountCents: number, env: Record<string, string | undefined>): number {
  if (!amountCents || amountCents <= 0) return 0
  const percent = Number(env.CREEM_FEE_PERCENT ?? '3.9')
  const fixed = Number(env.CREEM_FEE_FIXED_CENTS ?? '40')
  return Math.round(amountCents * (percent / 100) + fixed)
}

function webhookCurrency(object: Record<string, unknown>): string {
  const order = asRecord(object.order)
  const transaction = asRecord(object.last_transaction)
  return asString(object.currency)
    ?? asString(transaction.currency)
    ?? asString(order.currency)
    ?? 'USD'
}

// ─── Signature verification ───────────────────────────────────────────────────
function timingSafeEqualHex(a: string, b: string): boolean {
  const left = a.startsWith('sha256=') ? a.slice(7) : a
  const right = b.startsWith('sha256=') ? b.slice(7) : b
  if (left.length !== right.length) return false
  let result = 0
  for (let i = 0; i < left.length; i += 1) result |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return result === 0
}

async function verifyWebhook(request: Request, env: Record<string, string | undefined>, raw: string): Promise<boolean> {
  const secret = (env as Record<string, string | undefined>).CREEM_WEBHOOK_SECRET
  if (!secret) return false
  const sig = request.headers.get('creem-signature') || request.headers.get('x-creem-signature') || ''
  if (!sig) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(raw))
  const expected = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return timingSafeEqualHex(sig, expected)
}

// ─── DB helpers ────────────────────────────────────────────────────────────────
type DbClient = {
  prepare(sql: string): {
    bind(...vals: unknown[]): {
      first<T>(): Promise<T | null>
      run(): Promise<{ meta: { changes: number } }>
      all<T>(): Promise<{ results: T[] }>
    }
  }
}

// ─── Record a credit pack purchase ───────────────────────────────────────────
async function recordPurchase(
  db: DbClient,
  userId: string,
  object: Record<string, unknown>,
  eventType: string,
  env: Record<string, string | undefined>
) {
  if (eventType !== 'checkout.completed' && eventType !== 'subscription.paid') return

  const plan = webhookPlan(object, env)
  if (!plan) return

  const config = BILLING_PLANS[plan]
  const creditsGranted = config.creditsGranted ?? 0
  const purchaseId = webhookTransactionId(object)
  const order = asRecord(object.order)
  console.log('CREDIT_PACK_PURCHASE', JSON.stringify({
    eventType,
    plan,
    creditsGranted,
    transactionId: purchaseId,
    orderId: order?.id,
    orderTransaction: order?.transaction,
    orderPaymentTransactions: order?.payment_transactions,
    objectKeys: Object.keys(object),
  }))
  const customerId = asString((object.customer as Record<string, unknown>)?.id)
  const checkoutId = asString((object.checkout as Record<string, unknown>)?.id)
    ?? asString((object as Record<string, unknown>).checkout_id)
    ?? asString(object.id)
  const amount = webhookAmount(object)
  const currency = webhookCurrency(object)
  const ts = now()
  const feeCents = creemFeeCents(amount, env)
  const netCents = amount > 0 ? amount - feeCents : null
  console.log('CREDIT_PACK_AMOUNTS', JSON.stringify({ eventType, plan, amountCents: amount, feeCents, netCents, currency }))

  // ── checkout.completed → one-time credit packs only, no subscription record ──
  // ── subscription.paid    → subscription record + optional credit pack ───────

  if (eventType === 'subscription.paid') {
    const sub = asRecord(object.subscription ?? object)
    const subscriptionId = asString(sub.id) ?? asString((object as Record<string, unknown>).subscription_id)
    const periodStart = asString(sub.current_period_start_date) ?? asString(sub.current_period_start) ?? null
    const periodEnd   = asString(sub.current_period_end_date)   ?? asString(sub.current_period_end)   ?? null

    if (subscriptionId) {
      await db.prepare(`
        INSERT INTO subscriptions (id, user_id, plan, creem_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, raw_json, last_payment_amount_cents, last_payment_fee_cents, last_payment_net_cents, last_payment_currency, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'active', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(creem_subscription_id) DO UPDATE SET
          plan = excluded.plan, status = excluded.status,
          current_period_end = excluded.current_period_end,
          raw_json = excluded.raw_json,
          last_payment_amount_cents = excluded.last_payment_amount_cents,
          last_payment_fee_cents = excluded.last_payment_fee_cents,
          last_payment_net_cents = excluded.last_payment_net_cents,
          last_payment_currency = excluded.last_payment_currency,
          updated_at = excluded.updated_at
      `).bind(
        id(), userId, config.plan,
        subscriptionId,
        periodStart,
        periodEnd,
        JSON.stringify(object),
        amount > 0 ? amount : null,
        amount > 0 ? feeCents : null,
        netCents,
        amount > 0 ? currency : null,
        ts, ts
      ).run()
    }

    // subscription.paid may unlock subscription plan access
    if (config.pricingModel === 'subscription') {
      await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?')
        .bind(config.plan, ts, userId).run()
    }

    // subscription.paid may also grant credits on some plans
    // For subscription.paid: keyed by subscription_id, stores tran_ in creem_transaction_id
    if (subscriptionId && creditsGranted > 0) {
      // purchaseId is the tran_... transaction ID (webhookTransactionId already picks order.transaction first)
      await db.prepare(`
        INSERT INTO credit_packs (id, user_id, creem_order_id, creem_transaction_id, credits, status, purchased_at, amount_cents, fee_cents, net_cents, currency)
        VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)
        ON CONFLICT(creem_order_id) DO NOTHING
      `).bind(id(), userId, subscriptionId, purchaseId, creditsGranted, ts,
        amount > 0 ? amount : null, amount > 0 ? feeCents : null, netCents, amount > 0 ? currency : null).run()

      const ledgerRow = await db.prepare(
        'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
      ).bind(userId).first<{ balance: number }>()
      const newBalance = (ledgerRow?.balance ?? 0) + creditsGranted
      await db.prepare(`
        INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at)
        VALUES (?, ?, ?, ?, 'purchase', ?, ?)
      `).bind(id(), userId, creditsGranted, newBalance, subscriptionId, ts).run()
    }

    return
  }

  // checkout.completed → one-time credit packs only
  if (config.pricingModel === 'one_time_credits' && creditsGranted > 0) {
    await db.prepare(`
      INSERT INTO credit_packs (id, user_id, creem_order_id, gateway_checkout_id, credits, status, purchased_at, amount_cents, fee_cents, net_cents, currency)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)
      ON CONFLICT(creem_order_id) DO NOTHING
    `).bind(id(), userId, purchaseId, checkoutId, creditsGranted, ts,
      amount > 0 ? amount : null, amount > 0 ? feeCents : null, netCents, amount > 0 ? currency : null).run()

    // Update ledger
    const ledgerRow = await db.prepare(
      'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
    ).bind(userId).first<{ balance: number }>()
    const newBalance = (ledgerRow?.balance ?? 0) + creditsGranted
    await db.prepare(`
      INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at)
      VALUES (?, ?, ?, ?, 'purchase', ?, ?)
    `).bind(id(), userId, creditsGranted, newBalance, purchaseId, ts).run()
  }
}

// ─── Handle refund ─────────────────────────────────────────────────────────────
async function handleRefund(
  db: DbClient,
  userId: string,
  object: Record<string, unknown>,
  eventType: string
) {
  if (!REFUND_EVENTS.has(eventType)) return
  // Also look up by subscription_id (for subscription refund)
  const subscriptionId = asString((object as Record<string, unknown>).subscription_id)
    ?? asString(asRecord(object.subscription)?.id)
  const refundId = asString(object.id) ?? asString((object as Record<string, unknown>).refund_id)
  const orderId = asString((object as Record<string, unknown>).order_id)
    ?? asString(asRecord(object.order)?.id)

  if (!orderId && !subscriptionId) return

  // Find the original credit pack — creem_order_id may be tran_... (new) or ord_... (old)
  // Also check gateway_checkout_id as fallback, and subscription_id for subscription refunds
  const pack = await db.prepare(`
    SELECT id, user_id, credits, status FROM credit_packs
    WHERE creem_order_id = ? OR gateway_checkout_id = ? OR creem_order_id = ?
  `).bind(orderId ?? '', orderId ?? '', subscriptionId ?? '').first<{ id: string; user_id: string; credits: number; status: string }>()

  if (!pack || pack.status === 'refunded') return

  const ts = now()
  // Actual refunded amount from Creem (refund_amount is in cents on RefundEntity).
  // For partial refunds this is less than the original gross amount.
  const refundAmountCents = Number(object.refund_amount ?? 0) || null

  // Deduct from ledger
  const ledgerRow = await db.prepare(
    'SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?'
  ).bind(pack.user_id).first<{ balance: number }>()
  const newBalance = Math.max(0, (ledgerRow?.balance ?? 0) - pack.credits)
  await db.prepare(`
    INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at)
    VALUES (?, ?, ?, ?, 'refund', ?, ?)
  `).bind(id(), pack.user_id, -pack.credits, newBalance, orderId, ts).run()

  // Mark pack as refunded and record the actual refunded amount
  await db.prepare('UPDATE credit_packs SET status = ?, refund_amount_cents = COALESCE(?, refund_amount_cents) WHERE id = ?')
    .bind('refunded', refundAmountCents, pack.id).run()
}

// ─── Revoke subscription access ───────────────────────────────────────────────
// subscription.canceled/subscription.paused: only mark cancel_at_period_end=1 (access continues until period end)
// subscription.expired/refund: actually downgrade to free and deduct credits
async function revokeAccess(
  db: DbClient,
  userId: string,
  object: Record<string, unknown>,
  eventType: string
) {
  if (!REVOKE_EVENTS.has(eventType)) return
  const subscriptionId = asString((object.subscription as Record<string, unknown>)?.id)
    ?? asString((object as Record<string, unknown>).subscription_id)
  const ts = now()

  if (subscriptionId) {
    await db.prepare(
      'UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE creem_subscription_id = ?'
    ).bind('canceled', ts, subscriptionId).run()
  }

  // subscription.canceled / subscription.paused: user keeps access until period end
  // subscription.expired / refund events: actually downgrade
  if (eventType === 'subscription.expired' || eventType === 'refund.created' || eventType === 'refund.completed') {
    await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?').bind('free', ts, userId).run()
    // Also update subscription status to refunded
    if (subscriptionId) {
      await db.prepare(
        'UPDATE subscriptions SET status = ?, updated_at = ? WHERE creem_subscription_id = ?'
      ).bind('refunded', ts, subscriptionId).run()
    }
  }

  // For refund events, deduct credits is handled by handleRefund — no double deduction here
}

// ─── Webhook debug ──────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  if (!eventId) return json({ error: 'eventId required' }, 400)
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: Record<string, string | undefined> & { DB: DbClient } }
  const db = env.DB
  if (!db) return json({ error: 'DB not configured' }, 500)

  // Try to read raw payload stored for this event
  const row = await db.prepare(
    'SELECT event_type, payload FROM webhook_debug WHERE event_id = ?'
  ).bind(eventId).first<{ event_type: string; payload: string }>()
  if (!row) return json({ error: 'not_found' }, 404)

  const payload = JSON.parse(row.payload)
  const object = webhookObject(payload)
  const productId = webhookProductId(object)
  const userId = webhookUserId(object)
  const plan = webhookPlan(object, env as Record<string, string | undefined>)
  const transactionId = webhookTransactionId(object)

  return json({ eventId, eventType: row.event_type, productId, userId, plan, transactionId, objectKeys: Object.keys(object) })
}

// ─── Main webhook handler ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text()
    const { env } = await getCloudflareContext({ async: true }) as unknown as { env: Record<string, string | undefined> & { DB: DbClient } }
    const db = env.DB
    if (!db) return json({ error: 'DB not configured' }, 500)

    const valid = await verifyWebhook(request, env, raw)
    if (!valid) return json({ error: 'invalid_signature' }, 401)

    let payload: CreemWebhookPayload
    try {
      payload = JSON.parse(raw) as CreemWebhookPayload
    } catch {
      return json({ error: 'invalid_json' }, 400)
    }

    const eventType = payload.eventType || payload.type || 'unknown'
    const eventId = payload.id ?? `${eventType}:${generateId('evt_')}`

    // Idempotency: skip already-processed events
    const existing = await db.prepare(
      'SELECT processed_at FROM webhook_events WHERE id = ?'
    ).bind(eventId).first<{ processed_at: number }>()
    if (existing?.processed_at) {
      return json({ ok: true, duplicate: true })
    }

    // Mark as processing (in case of crash mid-handler)
    await db.prepare(
      'INSERT OR IGNORE INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)'
    ).bind(eventId, eventType, 0).run()

    const object = webhookObject(payload)
    const userId = webhookUserId(object)
    const productId = webhookProductId(object)
    const plan = webhookPlan(object, env as Record<string, string | undefined>)
    const productIdEnvCheck = productId ? {
      productId,
      CREDIT_STANDARD_PRODUCT_ID: env.CREEM_CREDIT_STANDARD_PRODUCT_ID,
      CREDIT_MINI_PRODUCT_ID: env.CREEM_CREDIT_MINI_PRODUCT_ID,
      CREDIT_LARGER_PRODUCT_ID: env.CREEM_CREDIT_LARGER_PRODUCT_ID,
    } : null
    console.log('WEBHOOK_DEBUG', JSON.stringify({ eventId, eventType, userId, productId, plan, productIdEnvCheck, objectKeys: Object.keys(object) }))

    if (userId) {
      await recordPurchase(db, userId, object, eventType, env)
      await handleRefund(db, userId, object, eventType)
      await revokeAccess(db, userId, object, eventType)
    }

    // Mark processed
    await db.prepare('UPDATE webhook_events SET processed_at = ? WHERE id = ?').bind(now(), eventId).run()

    return json({
      ok: true,
      eventType,
      userId,
      productId,
      plan,
      productIdEnvCheck: productId ? {
        productId,
        CREDIT_STANDARD_PRODUCT_ID: env.CREEM_CREDIT_STANDARD_PRODUCT_ID,
        CREDIT_MINI_PRODUCT_ID: env.CREEM_CREDIT_MINI_PRODUCT_ID,
        CREDIT_LARGER_PRODUCT_ID: env.CREEM_CREDIT_LARGER_PRODUCT_ID,
        PRO_MONTHLY_PRODUCT_ID: env.CREEM_PRO_MONTHLY_PRODUCT_ID,
      } : null,
    })
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Return 200 so Creem doesn't retry
    return json({ ok: false, error: String(err) }, 200)
  }
}
