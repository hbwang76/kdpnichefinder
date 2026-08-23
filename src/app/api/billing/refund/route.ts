import { NextRequest, NextResponse } from 'next/server'
import { cookie, generateId, now } from '@/lib/api-helpers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface DbClient { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB: DbClient; CREEM_API_KEY: string; CREEM_API_BASE: string } }
  const db: DbClient = env.DB
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const sessionId = cookie(request, 'session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await db.prepare('SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?').bind(sessionId, now()).first<{ user_id: string }>()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { creemOrderId, amount, reason } = body as { creemOrderId?: string; amount?: number; reason?: string }

  // If creemOrderId provided, try to refund via Creem API
  if (creemOrderId) {
    const apiKey = env.CREEM_API_KEY ?? ''
    const apiBase = env.CREEM_API_BASE ?? 'https://test-api.creem.io/v1'
    const refundRes = await fetch(`${apiBase}/orders/${creemOrderId}/refund`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    })
    if (!refundRes.ok) {
      const err = await refundRes.text()
      return NextResponse.json({ error: 'Refund failed', details: err }, { status: 500 })
    }
  }

  const ts = now()

  // Reverse credits if amount provided
  if (amount !== undefined && amount > 0) {
    const row = await db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?').bind(session.user_id).first<{ balance: number }>()
    const newBalance = Math.max(0, (row?.balance ?? 0) - amount)
    await db.prepare('INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(generateId('cl_'), session.user_id, -amount, newBalance, `refund: ${reason ?? 'manual'}`, creemOrderId ?? 'manual', ts).run()
    await db.prepare('UPDATE credit_packs SET status = ? WHERE creem_order_id = ? AND user_id = ?').bind('refunded', creemOrderId, session.user_id).run()
  }

  return NextResponse.json({ ok: true, refundedAt: ts })
}
