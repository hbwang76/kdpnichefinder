import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NicheAnalyzer } from '@/components/NicheAnalyzer'

export const metadata: Metadata = {
  title: 'KDP Niche Finder — AI-Powered Amazon KDP Niche Research',
  description:
    'Type a niche and get AI-scored opportunities with BSR, competition ratings, and action plans. Free niche analyzer for KDP authors.',
  openGraph: {
    title: 'KDP Niche Finder — AI-Powered Amazon KDP Niche Research',
    description: 'AI-powered niche research for KDP authors. Get BSR, competition scores, and action plans in seconds.',
    type: 'website',
    url: 'https://kdpnichefinder.net',
    siteName: 'KDP Niche Finder',
  },
  alternates: { canonical: 'https://kdpnichefinder.net' },
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
          Type a niche. Get a 5-step action plan — not just a data dump. We tell you what book to write, how to position it, and where to launch it.
        </p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ flex: 1, height: 56, background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 12 }} />
          <div style={{ height: 56, padding: '0 28px', background: 'var(--color-signal)', borderRadius: 12, opacity: 0.6 }} />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<LoadingAnalyzer />}>
        <NicheAnalyzer />
      </Suspense>

      {/* How it works */}
      <section id="how-it-works" style={{ background: 'var(--color-canvas)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
            How KDP Niche Finder Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Enter Your Idea', desc: 'Type any niche idea — from "keto cookbooks" to "adult coloring books" — and hit Analyze.' },
              { step: '02', title: 'AI Scores 5 Niches', desc: 'Our AI analyzes BSR, competition, seasonality, and pricing to rank 5 opportunities.' },
              { step: '03', title: 'Get Action Plans', desc: 'Each result includes title ideas, cover style, pricing advice, and a 3-step launch plan.' },
              { step: '04', title: 'Validate & Publish', desc: 'Use the data to decide your next book. No guesswork — just actionable insights.' },
            ].map(item => (
              <div key={item.step}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-signal)', marginBottom: 12 }}>{item.step}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
            Everything You Need to Find Profitable Niches
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: '📊', title: 'BSR Analysis', desc: 'Estimated bestseller rank ranges to gauge market demand and competition level.' },
              { icon: '🎯', title: 'Competition Scoring', desc: 'Low/Medium/High ratings based on saturation, keyword difficulty, and title overlap.' },
              { icon: '📅', title: 'Seasonality Signals', desc: 'Spot seasonal niches before they peak. Plan ahead for Q4 holiday rushes.' },
              { icon: '💰', title: 'Pricing Advice', desc: 'Optimal price ranges for each niche based on market data and margin goals.' },
              { icon: '📝', title: 'Title Ideas', desc: '3 book title options per niche so you are not staring at a blank page.' },
              { icon: '🎨', title: 'Cover Recommendations', desc: "Cover style suggestions that match each niche's reader expectations." },
              { icon: '⚠️', title: 'Risk Factors', desc: 'Honest risk flags — seasonal dips, market saturation, IP issues — before you invest time.' },
              { icon: '📋', title: 'Action Plans', desc: 'Step-by-step 3-5 action items to take your niche from idea to published book.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'var(--color-canvas)', borderRadius: 12, padding: '24px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'var(--color-ink)', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: 16 }}>
            Ready to Find Your Next Bestseller?
          </h2>
          <p style={{ color: '#A8A29E', fontSize: '1.0625rem', marginBottom: 32 }}>
            Join thousands of KDP authors who use KDP Niche Finder to validate ideas before they write.
          </p>
          <a href="/tools/kdp-niche-finder" style={{ background: 'var(--color-signal)', color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Find My First Niche — Free →
          </a>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          section { padding: 48px 16px !important; }
          h1 { font-size: 1.75rem !important; }
        }
      `}</style>
    </>
  )
}
