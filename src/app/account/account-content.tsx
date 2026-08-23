'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  plan: string
}

export default function AccountContent() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/credits/balance').then(r => r.json()),
    ]).then(([userData, creditsData]) => {
      if (userData.authenticated) setUser(userData.user)
      if (creditsData.balance !== undefined) setCredits(creditsData.balance)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

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

  const planLabel = isPro ? 'Pro' : isStarter ? 'Starter' : 'Free'
  const planBadgeBg = isPro ? 'var(--color-signal)' : isStarter ? '#8b5cf6' : 'var(--color-ink)'

  const planDescription = isFree
    ? '1 preview per 24 hours'
    : isStarter
    ? '5 AI analyses per month'
    : 'Unlimited AI analyses, action plans & historical tracking'

  return (
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
            {isStarter && (
              <Link href="/pricing" style={{
                display: 'block', background: 'var(--color-surface)', color: 'var(--color-signal)',
                padding: '12px 20px', borderRadius: 10, fontWeight: 700,
                textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem',
                border: '2px solid var(--color-signal)',
              }}>
                Upgrade to Pro →
              </Link>
            )}
            {isPro && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>
                You&apos;re on the Pro plan. Thank you for your support!
              </p>
            )}
          </div>

          {/* Credits card */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Credit Balance</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '3rem', fontWeight: 700, color: 'var(--color-ink)' }}>{credits ?? '—'}</span>
            </div>
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
  )
}
