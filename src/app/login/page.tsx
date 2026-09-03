import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In to KDP Niche Finder',
  description: 'Sign in with Google to access your saved niche analyses, view your subscription plan, and unlock unlimited KDP niche searches on KDP Niche Finder.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
  openGraph: { url: 'https://kdpnichefinder.net/login' },
}

export default function LoginPage() {
  return (
    <section style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas)', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#EA580C"/>
              <path d="M7 8h14M7 14h10M7 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="4" fill="#0F766E"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)' }}>KDP Niche Finder</span>
          </Link>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>Sign in to access your saved analyses</p>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 32 }}>
          <a
            href="/api/auth/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: 'white', border: '1px solid var(--color-border)', borderRadius: 10,
              padding: '12px 20px', fontWeight: 600, fontSize: '0.9375rem',
              color: 'var(--color-ink)', textDecoration: 'none', cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-ink-3)', margin: '20px 0' }}>
            By continuing, you agree to our <Link href="/terms" style={{ color: 'var(--color-ink-2)', textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--color-ink-2)', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>
          Do not have an account? <Link href="/tools/kdp-niche-finder" style={{ color: 'var(--color-signal)', fontWeight: 600, textDecoration: 'none' }}>Try free first →</Link>
        </p>
      </div>
    </section>
  )
}
