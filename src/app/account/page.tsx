import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Account — KDP Niche Finder',
  description: 'Manage your KDP Niche Finder account, view your subscription, and purchase credits.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: true },
  openGraph: { url: 'https://kdpnichefinder.net/account' },
}

export default function AccountPage() {
  return (
    <section style={{ background: 'var(--color-canvas)', padding: '64px 48px', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: 32 }}>Your Account</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Plan card */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Current Plan</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ background: 'var(--color-ink)', color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>Free</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>1 preview per 24 hours</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 20 }}>
              Upgrade to unlock unlimited AI analyses, action plans, and historical tracking.
            </p>
            <Link href="/pricing" style={{
              display: 'block', background: 'var(--color-signal)', color: 'white',
              padding: '12px 20px', borderRadius: 10, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem',
            }}>
              Upgrade Plan →
            </Link>
          </div>

          {/* Credits card */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Credit Balance</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '3rem', fontWeight: 700, color: 'var(--color-ink)' }}>0</span>
              <span style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>credits available</span>
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
