'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#EA580C"/>
            <path d="M7 8h14M7 14h10M7 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="4" fill="#0F766E"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)' }}>
            KDP Niche Finder
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <Link href="/tools/kdp-niche-finder" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none' }}>Tool</Link>
          <Link href="/pricing" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none' }}>Pricing</Link>
          <Link href="/blog" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none' }}>Blog</Link>
          <Link href="/about" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none' }}>About</Link>
        </div>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
          <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none', padding: '8px 12px' }}>Sign in</Link>
          <Link href="/pricing" style={{ background: 'var(--color-signal)', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            Buy Credits
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {mobileMenuOpen
              ? <path d="M18 6L6 18M6 6l12 12" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M4 6h16M4 12h16M4 18h16" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link href="/tools/kdp-niche-finder" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none', padding: '8px 0' }}>Tool</Link>
          <Link href="/pricing" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none', padding: '8px 0' }}>Pricing</Link>
          <Link href="/blog" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none', padding: '8px 0' }}>Blog</Link>
          <Link href="/about" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none', padding: '8px 0' }}>About</Link>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/login" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink-2)', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/pricing" style={{ background: 'var(--color-signal)', color: 'white', padding: '12px 16px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Buy Credits</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
