import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About KDP Niche Finder',
  description: 'Learn about KDP Niche Finder — AI-powered niche research tool for KDP authors.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <section style={{ background: 'var(--color-canvas)', padding: '64px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.25rem', fontWeight: 700, marginBottom: 24 }}>About KDP Niche Finder</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--color-ink-2)' }}>
          <p>
            KDP Niche Finder is an independent tool built for KDP (Kindle Direct Publishing) authors who want to validate book ideas before they invest time writing. We analyze market data to surface opportunities — not promises of overnight success.
          </p>
          <p>
            The tool was born from a simple frustration: most niche research tools either cost too much, require too much setup, or give you raw data without context. We wanted something fast, honest, and actionable.
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 16 }}>How It Works</h2>
          <p>
            Input any niche idea — "adult coloring books," "keto meal plans," "travel journals" — and our AI analyzes it against publicly available market signals to surface 5 ranked opportunities with actionable next steps.
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-ink)' }}>Our Approach</h2>
          <p>
            We are transparent about what we do and do not know. All data is clearly labeled as estimated. We do not claim to have real-time Amazon sales data, and we never will — no tool outside of Amazon actually has that. What we do provide is the best available estimate based on publicly known signals.
          </p>
          <p>
            We do not sell your data. We do not run ads. We are funded by subscriptions from authors who find the tool useful.
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-ink)' }}>Get in Touch</h2>
          <p>
            Questions, feedback, or partnership inquiries? <Link href="/contact" style={{ color: 'var(--color-signal)', textDecoration: 'underline' }}>Contact us →</Link>
          </p>
          <p>
            Ready to find your next niche? <Link href="/tools/kdp-niche-finder" style={{ color: 'var(--color-signal)', textDecoration: 'underline' }}>Try it free →</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
