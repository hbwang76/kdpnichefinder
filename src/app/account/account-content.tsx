'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  plan: string
}

interface CreditPack {
  id: string
  creem_order_id: string
  credits: number
  status: string
  purchased_at: number
}

interface Subscription {
  id: string
  plan: string
  status: string
  current_period_end: string | null
  cancel_at_period_end: number
  creem_subscription_id: string
}

export default function AccountContent() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundPack, setRefundPack] = useState<CreditPack | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [showSubRefundModal, setShowSubRefundModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/credits/balance').then(r => r.json()),
    ]).then(([userData, creditsData]) => {
      if (userData.authenticated) {
        setUser(userData.user)
        // Fetch credit packs and subscription
        Promise.all([
          fetch('/api/credits/packs').then(r => r.json()).catch(() => ({ packs: [] })),
          fetch('/api/billing/subscription').then(r => r.json()).catch(() => ({ subscription: null })),
        ]).then(([packsData, subData]) => {
          setCreditPacks(packsData.packs ?? [])
          setSubscription(subData.subscription ?? null)
        })
      }
      if (creditsData.balance !== undefined) setCredits(creditsData.balance)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will keep access until the end of your billing period.')) return
    setActionLoading(true)
    try {
      const r = await fetch('/api/billing/cancel', { method: 'POST' })
      const data = await r.json()
      if (data.ok) {
        setSubscription(s => s ? { ...s, status: 'canceled', cancel_at_period_end: 1 } : null)
      } else {
        alert('Failed to cancel: ' + (data.error ?? 'Unknown error'))
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRefund() {
    if (!refundPack) return
    setActionLoading(true)
    try {
      const r = await fetch('/api/billing/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creemOrderId: refundPack.creem_order_id, reason: refundReason }),
      })
      const data = await r.json()
      if (data.ok) {
        setCreditPacks(packs => packs.map(p => p.id === refundPack.id ? { ...p, status: 'refunded' } : p))
        setCredits(c => (c ?? 0) - (data.creditsDeducted ?? refundPack.credits))
        setShowRefundModal(false)
        setRefundPack(null)
        setRefundReason('')
      } else if (data.error === 'refund_via_dashboard') {
        alert('Refunds must be requested through Creem directly. Please visit your Creem customer portal or email support@kdpnichefinder.net. Your credits will be restored automatically once the refund is processed.')
      } else {
        alert('Refund failed: ' + (data.detail ?? data.error ?? 'Unknown error'))
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSubscriptionRefund() {
    setActionLoading(true)
    try {
      const r = await fetch('/api/billing/subscription-refund', { method: 'POST' })
      const data = await r.json()
      if (data.ok) {
        setUser(u => u ? { ...u, plan: 'free' } : null)
        setSubscription(null)
        setCredits(c => (c ?? 0) - (data.creditsReclaimed ?? 0))
        setShowSubRefundModal(false)
      } else if (data.error === 'subscription_used') {
        alert('Subscription refunds are only available if you have not used your subscription. Please contact support@kdpnichefinder.net for assistance.')
      } else {
        alert('Refund failed: ' + (data.detail ?? data.error ?? 'Unknown error'))
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <section style={{ background: 'var(--color-canvas)', padding: '64px 48px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-ink-2)' }}>Loading...</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section style={{ background: 'var(--color-canvas)', padding: '64px 48px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Your Account</h1>
          <p style={{ color: 'var(--color-ink-2)', marginBottom: 24 }}>Please sign in to view your account.</p>
          <Link href="/api/auth/google" style={{
            display: 'inline-block', background: 'var(--color-signal)', color: 'white',
            padding: '12px 24px', borderRadius: 10, fontWeight: 700,
            textDecoration: 'none', fontSize: '0.9375rem',
          }}>
            Sign in with Google
          </Link>
        </div>
      </section>
    )
  }

  const isFree = user.plan === 'free'
  const isStarter = user.plan === 'starter'
  const isPro = user.plan === 'pro'
  const isCanceled = subscription?.status === 'canceled'
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : null

  const planLabel = isPro ? 'Pro' : isStarter ? 'Starter' : 'Free'
  const planBadgeBg = isPro ? 'var(--color-signal)' : isStarter ? '#8b5cf6' : 'var(--color-ink)'

  const planDescription = isFree
    ? '1 preview per 24 hours'
    : isCanceled
    ? `Active until ${periodEnd} (canceling)`
    : isStarter
    ? '5 AI analyses per month'
    : 'Unlimited AI analyses, action plans & historical tracking'

  return (
    <>
      {showSubRefundModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Refund Subscription</h2>
            <p style={{ color: 'var(--color-ink-2)', fontSize: '0.875rem', marginBottom: 20 }}>
              Your subscription will be canceled and you will be downgraded to the free plan. Credits remaining will be removed. This cannot be undone.
            </p>
            <p style={{ color: 'var(--color-ink-2)', fontSize: '0.8rem', marginBottom: 20 }}>
              <strong>Note:</strong> Subscriptions that have been used are not eligible for refunds.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowSubRefundModal(false)}
                disabled={actionLoading}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-ink)', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubscriptionRefund}
                disabled={actionLoading}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                {actionLoading ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && refundPack && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Refund Credit Pack</h2>
            <p style={{ color: 'var(--color-ink-2)', fontSize: '0.875rem', marginBottom: 20 }}>
              Refund <strong>{refundPack.credits} credits</strong> for ${(refundPack.credits / 10).toFixed(2)}? This cannot be undone.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Reason (optional)</label>
              <input
                type="text"
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="e.g. Accidental purchase"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-canvas)', color: 'var(--color-ink)', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setShowRefundModal(false); setRefundPack(null) }}
                disabled={actionLoading}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-ink)', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={actionLoading}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                {actionLoading ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      <section style={{ background: 'var(--color-canvas)', padding: '64px 48px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Your Account</h1>
            {user.name && (
              <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>· {user.name}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {/* Plan card */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Current Plan</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ background: planBadgeBg, color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{planLabel}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>{planDescription}</span>
              </div>
              {isFree && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 20 }}>
                  Upgrade to unlock unlimited AI analyses, action plans, and historical tracking.
                </p>
              )}
              {isFree && (
                <Link href="/pricing" style={{
                  display: 'block', background: 'var(--color-signal)', color: 'white',
                  padding: '12px 20px', borderRadius: 10, fontWeight: 700,
                  textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem',
                }}>
                  Upgrade Plan →
                </Link>
              )}
              {(isStarter || isPro) && !isCanceled && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  style={{
                    display: 'block', width: '100%', background: 'var(--color-surface)', color: '#ef4444',
                    padding: '10px 20px', borderRadius: 10, fontWeight: 600,
                    textDecoration: 'none', textAlign: 'center', fontSize: '0.875rem',
                    border: '2px solid #ef4444', cursor: 'pointer',
                  }}
                >
                  {actionLoading ? 'Processing...' : 'Cancel Subscription'}
                </button>
              )}
              {(isStarter || isPro) && !isCanceled && (
                <button
                  onClick={() => setShowSubRefundModal(true)}
                  disabled={actionLoading}
                  style={{
                    display: 'block', marginTop: 8, width: '100%', background: 'var(--color-surface)', color: '#ef4444',
                    padding: '10px 20px', borderRadius: 10, fontWeight: 600,
                    textDecoration: 'none', textAlign: 'center', fontSize: '0.875rem',
                    border: '2px solid #ef4444', cursor: 'pointer',
                  }}
                >
                  Refund Subscription
                </button>
              )}
              {isCanceled && periodEnd && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>
                  Your subscription has been canceled. Access expires on {periodEnd}.
                </p>
              )}
              {(isStarter || isPro) && !isCanceled && (
                <Link href="/pricing" style={{
                  display: 'block', marginTop: 8, background: 'var(--color-surface)', color: 'var(--color-signal)',
                  padding: '10px 20px', borderRadius: 10, fontWeight: 600,
                  textDecoration: 'none', textAlign: 'center', fontSize: '0.875rem',
                  border: '2px solid var(--color-signal)',
                }}>
                  Upgrade to Pro →
                </Link>
              )}
            </div>

            {/* Credits card */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Credit Balance</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '3rem', fontWeight: 700, color: 'var(--color-ink)' }}>{credits ?? '—'}</span>
              </div>
              {creditPacks.filter(p => p.status === 'active').length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchased Packs</p>
                  {creditPacks.filter(p => p.status === 'active').map(pack => (
                    <div key={pack.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.875rem' }}>{pack.credits} credits</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setRefundPack(pack); setShowRefundModal(true) }}
                          style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        >
                          Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 20 }}>
                Purchase credit packs for one-time analyses without a subscription.
              </p>
              <Link href="/pricing" style={{
                display: 'block', background: 'var(--color-surface)', color: 'var(--color-signal)',
                padding: '12px 20px', borderRadius: 10, fontWeight: 700,
                textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem',
                border: '2px solid var(--color-signal)',
              }}>
                Buy Credits
              </Link>
            </div>
          </div>

          {/* Recent analyses */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Recent Analyses</h2>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <p style={{ color: 'var(--color-ink-2)', marginBottom: 16 }}>No analyses yet — run your first one!</p>
              <Link href="/tools/kdp-niche-finder" style={{
                display: 'inline-block', background: 'var(--color-signal)', color: 'white',
                padding: '12px 24px', borderRadius: 10, fontWeight: 700,
                textDecoration: 'none', fontSize: '0.9375rem',
              }}>
                Run your first analysis →
              </Link>
            </div>
          </div>

          {/* Sign out */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <a href="/api/auth/logout" style={{ fontSize: '0.875rem', color: 'var(--color-ink-3)', textDecoration: 'underline' }}>Sign out</a>
          </div>
        </div>
      </section>
    </>
  )
}
