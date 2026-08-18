'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Types
interface NicheResult {
  rank: number
  niche: string
  bsrRange: string
  competition: 'low' | 'medium' | 'high'
  seasonality: string
  priceRange: string
  trend: string
  score: number
  titles: string[]
  coverStyle: string
  pricingAdvice: string
  actionPlan: string[]
  risks: string[]
}

// Score ring component
function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#0F766E' : score >= 50 ? '#D97706' : '#B91C1C'
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (score / 100) * circumference
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="18" fill="none" stroke="#E5E0D5" strokeWidth="4"/>
      <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 22 22)"/>
      <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="600" fill={color} fontFamily="'Space Grotesk', sans-serif">{score}</text>
    </svg>
  )
}

// Niche card component
function NicheCard({ niche }: { niche: NicheResult }) {
  const scoreColor = niche.score >= 75 ? 'var(--color-pine)' : niche.score >= 50 ? 'var(--color-amber)' : 'var(--color-rust)'
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: 'var(--color-signal-tint)', color: 'var(--color-signal)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace" }}>#{niche.rank}</span>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>{niche.niche}</h3>
        </div>
        <ScoreRing score={niche.score} />
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', fontFamily: "'IBM Plex Mono', monospace" }}>BSR Range</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: "'IBM Plex Mono', monospace" }}>{niche.bsrRange}</div>
        </div>
        <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', fontFamily: "'IBM Plex Mono', monospace" }}>Competition</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: scoreColor, textTransform: 'capitalize' }}>{niche.competition}</div>
        </div>
        <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', fontFamily: "'IBM Plex Mono', monospace" }}>Est. Price</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: "'IBM Plex Mono', monospace" }}>{niche.priceRange}</div>
        </div>
        <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', fontFamily: "'IBM Plex Mono', monospace" }}>Trend</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: scoreColor }}>{niche.trend}</div>
        </div>
      </div>

      {/* Action plan */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-2)', marginBottom: 8 }}>Action Plan</div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {niche.actionPlan.map((step, i) => (
            <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Book title suggestions */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-2)', marginBottom: 8 }}>Title Ideas</div>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {niche.titles.map((t, i) => (
            <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', fontStyle: 'italic' }}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Cover style */}
      <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '10px 12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cover Style: </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink)' }}>{niche.coverStyle}</span>
      </div>

      {/* Risks */}
      {niche.risks.length > 0 && (
        <div style={{ background: 'var(--color-rust-tint)', borderRadius: 8, padding: '10px 12px', border: '1px solid #FCA5A5' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-rust)', marginBottom: 4 }}>⚠️ Risk Factors</div>
          {niche.risks.map((r, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: 'var(--color-rust)' }}>{r}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// Loading skeleton card
function SkeletonCard() {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 80, height: 24, background: 'var(--color-canvas)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
        <div style={{ width: 44, height: 44, background: 'var(--color-canvas)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: 50, background: 'var(--color-canvas)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />)}
      </div>
      <div style={{ height: 80, background: 'var(--color-canvas)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
    </div>
  )
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const initialNiche = searchParams.get('niche') || ''
  const [keyword, setKeyword] = useState(initialNiche)
  const [results, setResults] = useState<NicheResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleAnalyze = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    setLimitReached(false)

    try {
      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim() }),
      })

      if (res.status === 429) {
        setLimitReached(true)
        setLoading(false)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const data = await res.json()
      setResults(data.niches || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }

    // Scroll to results
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Hero Section */}
      <section style={{ background: 'var(--color-canvas)', padding: '80px 48px 64px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
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

          {/* Search box */}
          <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto 16px' }}>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g., keto diet journals, adult coloring books..."
              style={{
                flex: 1, height: 56, padding: '0 20px', border: '2px solid var(--color-border)',
                borderRadius: 12, fontSize: '1rem', fontFamily: "'Manrope', sans-serif",
                background: 'var(--color-surface)', color: 'var(--color-ink)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-signal)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
              style={{
                height: 56, padding: '0 28px', background: loading ? 'var(--color-ink-3)' : 'var(--color-signal)',
                color: 'white', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', fontFamily: "'Manrope', sans-serif",
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10"/>
                  </svg>
                  Analyzing...
                </>
              ) : 'Analyze Niche'}
            </button>
          </div>

          {/* AI disclaimer */}
          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)', marginBottom: 0 }}>
            AI-generated recommendations are estimates based on publicly available data. All BSR and revenue figures are estimated.
          </p>

          {/* Secondary CTA */}
          <div style={{ marginTop: 16 }}>
            <a href="#how-it-works" style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Limit reached banner */}
      {limitReached && (
        <section style={{ background: 'var(--color-amber-tint)', borderTop: '1px solid #FCD34D', borderBottom: '1px solid #FCD34D', padding: '20px 48px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-amber)' }}>Free preview limit reached — 1 analysis per 24 hours for anonymous users.</span>
            <Link href="/pricing" style={{ background: 'var(--color-signal)', color: 'white', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              Buy Credits to Continue →
            </Link>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section style={{ padding: '20px 48px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--color-rust-tint)', border: '1px solid #FCA5A5', borderRadius: 12, padding: '16px 20px', color: 'var(--color-rust)', fontWeight: 500 }}>
            Error: {error}
          </div>
        </section>
      )}

      {/* Results */}
      {(loading || results) && (
        <section ref={resultsRef} style={{ background: 'var(--color-surface)', padding: '64px 48px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {loading ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Analyzing your niche...</h2>
                  <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>Generating 5 ranked niche recommendations with action plans</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                  {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
                </div>
              </>
            ) : results && results.length > 0 ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                    {results.length} Niche{results.length !== 1 ? 's' : ''} Found for "{keyword}"
                  </h2>
                  <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>
                    Ranked by opportunity score — estimated BSR, competition, and action plans
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                  {results.map(niche => <NicheCard key={niche.rank} niche={niche} />)}
                </div>

                {/* Post-analysis CTA */}
                <div style={{ marginTop: 48, background: 'var(--color-signal-tint)', border: '1px solid var(--color-signal)', borderRadius: 16, padding: '32px 40px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Want unlimited niche analyses?</h3>
                  <p style={{ color: 'var(--color-ink-2)', marginBottom: 20 }}>Sign up to save your history and run unlimited analyses.</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/login" style={{ background: 'var(--color-signal)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
                      Sign in to Continue →
                    </Link>
                    <Link href="/pricing" style={{ background: 'var(--color-surface)', color: 'var(--color-signal)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', border: '2px solid var(--color-signal)' }}>
                      Buy Credits
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}

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
              { icon: '🎨', title: 'Cover Recommendations', desc: 'Cover style suggestions that match each niche\'s reader expectations.' },
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
          <Link href="/tools/kdp-niche-finder" style={{ background: 'var(--color-signal)', color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Find My First Niche — Free →
          </Link>
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
