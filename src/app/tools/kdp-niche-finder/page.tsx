import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NicheAnalyzer } from '@/components/NicheAnalyzer'

export const metadata: Metadata = {
  title: 'KDP Niche Finder — AI-Powered Niche Research Tool',
  description: 'Find profitable KDP niches with AI scoring, estimated BSR, competition analysis, and action plans. Free preview available.',
  alternates: { canonical: '/tools/kdp-niche-finder' },
}

function LoadingAnalyzer() {
  return (
    <div style={{ background: 'var(--color-canvas)', padding: '80px 48px', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--color-signal-tint)', color: 'var(--color-signal)', padding: '6px 14px', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 600, marginBottom: 24 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1L1 5.3l4.2-.7z" fill="currentColor"/></svg>
          AI-Powered Niche Research for KDP Authors
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 16, lineHeight: 1.15 }}>
          KDP Niche Finder — AI-Powered Amazon KDP Niche Research
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-2)', marginBottom: 40, lineHeight: 1.6 }}>
          Type a niche. Get a 5-step action plan — not just a data dump.
        </p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ flex: 1, height: 56, background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 0 }} />
          <div style={{ height: 56, padding: '0 28px', background: 'var(--color-signal)', borderRadius: 0, opacity: 0.6 }} />
        </div>
      </div>
    </div>
  )
}

export default function ToolPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KDP Niche Finder — AI-Powered Niche Research Tool',
    description: 'Find profitable KDP niches with AI scoring, estimated BSR, competition analysis, and action plans. Free preview available.',
    url: 'https://kdpnichefinder.net/tools/kdp-niche-finder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free preview — 1 analysis per day',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<LoadingAnalyzer />}>
        <NicheAnalyzer />
      </Suspense>
    </>
  )
}
