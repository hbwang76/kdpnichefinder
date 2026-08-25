'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

function InfoTip({ text }: { text: string }) {
  return (
    <span className="kdp-infotip" tabIndex={0} aria-label={text}>
      i
      <span className="kdp-tip" role="tooltip">{text}</span>
    </span>
  )
}

function NicheCard({ niche, showHints = false }: { niche: NicheResult; showHints?: boolean }) {
  const scoreColor = niche.score >= 75 ? 'var(--color-pine)' : niche.score >= 50 ? 'var(--color-amber)' : 'var(--color-rust)'
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: 'var(--color-signal-tint)', color: 'var(--color-signal)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace" }}>#{niche.rank}</span>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>{niche.niche}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showHints && <InfoTip text="Opportunity score (0-100). Combines demand, competition, and trend. 75+ is strong, 50-74 is workable, below 50 is risky." />}
          <ScoreRing score={niche.score} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'BSR Range', value: niche.bsrRange, tip: 'Best Sellers Rank on Amazon. Lower = more sales. A top book under ~100k BSR usually means real buyer demand.' },
          { label: 'Competition', value: niche.competition, color: scoreColor, tip: 'How crowded the niche is. Low means fewer established books to beat — best for a first title.' },
          { label: 'Est. Price', value: niche.priceRange, tip: 'Typical list price range for books in this niche.' },
          { label: 'Trend', value: niche.trend, color: scoreColor, tip: 'Whether search demand for this niche is growing, stable, or fading.' },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', fontFamily: "'IBM Plex Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
              {item.label}
              {showHints && <InfoTip text={item.tip} />}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: item.color || 'var(--color-ink)', textTransform: item.label === 'Competition' ? 'capitalize' : 'none', fontFamily: "'IBM Plex Mono', monospace" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          Action Plan
          {showHints && <InfoTip text="Start with step 1 today. Each step is ordered — validate demand before you design the book." />}
        </div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {niche.actionPlan.map((step, i) => (
            <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-2)', marginBottom: 8 }}>Title Ideas</div>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {niche.titles.map((t, i) => (
            <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', fontStyle: 'italic' }}>{t}</li>
          ))}
        </ul>
      </div>

      <div style={{ background: 'var(--color-canvas)', borderRadius: 8, padding: '10px 12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cover Style: </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink)' }}>{niche.coverStyle}</span>
      </div>

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

const STEPS = [
  { n: '1', label: 'Enter any book topic' },
  { n: '2', label: 'Click Find' },
  { n: '3', label: 'Get 5 niche ideas' },
]

function StepIndicators() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', margin: '20px auto 0' }}>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 999, padding: '4px 12px 4px 4px' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-signal)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{s.n}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink)', fontWeight: 500 }}>{s.label}</span>
          </span>
          {i < STEPS.length - 1 && <span style={{ color: 'var(--color-ink-3)', fontSize: '0.875rem' }} aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  )
}

const DEMO_TEXT = 'adhd planner for adults'
const DEMO_RESULTS = [
  { name: 'ADHD Daily Planner', score: 82, color: '#0F766E' },
  { name: 'ADHD Planner for Women', score: 76, color: '#0F766E' },
  { name: 'ADHD Cleaning Checklist', score: 61, color: '#D97706' },
]

function HowItWorksDemo() {
  // phase 0 = typing, 1 = click, 2 = loading skeletons, 3 = results
  const [phase, setPhase] = useState(0)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (phase === 0) {
      timer = typed < DEMO_TEXT.length
        ? setTimeout(() => setTyped(t => t + 1), 70)
        : setTimeout(() => setPhase(1), 600)
    } else if (phase === 1) {
      timer = setTimeout(() => setPhase(2), 550)
    } else if (phase === 2) {
      timer = setTimeout(() => setPhase(3), 2000)
    } else {
      timer = setTimeout(() => { setPhase(0); setTyped(0) }, 4500)
    }
    return () => clearTimeout(timer)
  }, [phase, typed])

  return (
    <div style={{ maxWidth: 460, margin: '28px auto 0', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 16, textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', marginBottom: 10 }}>
        Live demo — 10 seconds
      </div>
      {/* mini query bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', border: '2px solid', borderColor: phase <= 1 ? 'var(--color-signal)' : 'var(--color-border)', borderRadius: 10, height: 40, paddingLeft: 12, paddingRight: 4, background: 'var(--color-canvas)', transition: 'border-color 0.3s' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-ink)', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {DEMO_TEXT.slice(0, typed)}
          {phase === 0 && <span className="kdp-caret">|</span>}
        </span>
        <span style={{
          marginLeft: 'auto', padding: '5px 14px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
          background: 'var(--color-signal)', color: '#fff', whiteSpace: 'nowrap',
          transform: phase === 1 ? 'scale(0.92)' : 'scale(1)', transition: 'transform 0.2s',
        }}>
          Find
        </span>
      </div>
      {/* mini results area */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 108 }}>
        {phase === 2 && [0, 1, 2].map(i => (
          <div key={i} style={{ height: 30, borderRadius: 8, background: 'var(--color-canvas)', border: '1px solid var(--color-border)', animation: `pulse 1.2s infinite`, animationDelay: `${i * 0.2}s` }} />
        ))}
        {phase === 3 && DEMO_RESULTS.map((r, i) => (
          <div key={r.name} className="kdp-demo-row" style={{ animationDelay: `${i * 0.18}s`, display: 'flex', alignItems: 'center', gap: 10, height: 30, borderRadius: 8, background: 'var(--color-canvas)', border: '1px solid var(--color-border)', padding: '0 10px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-signal)' }}>#{i + 1}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
            <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: r.color }}>{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NicheAnalyzer() {
  const searchParams = useSearchParams()
  const initialNiche = searchParams.get('niche') || ''
  const [keyword, setKeyword] = useState(initialNiche)
  const [results, setResults] = useState<NicheResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('guest')
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) setUserPlan(data.user?.plan ?? 'free')
      })
      .catch(() => {})
  }, [])

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
        body: JSON.stringify({ query: keyword.trim() }),
      })

      if (res.status === 429) { setLimitReached(true); setLoading(false); return }
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
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes kdp-caret-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes kdp-row-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .kdp-caret { animation: kdp-caret-blink 0.9s infinite; color: var(--color-signal); }
        .kdp-demo-row { animation: kdp-row-in 0.4s both; }
        .kdp-infotip {
          position: relative; display: inline-flex; align-items: center; justify-content: center;
          width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
          background: var(--color-signal-tint); color: var(--color-signal);
          font-size: 0.625rem; font-weight: 700; font-style: italic; font-family: 'IBM Plex Mono', monospace;
          cursor: help;
        }
        .kdp-infotip .kdp-tip {
          display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          width: 220px; padding: 8px 10px; border-radius: 8px; z-index: 30;
          background: #1C1917; color: #FAFAF9; font-size: 0.75rem; font-weight: 400; font-style: normal;
          line-height: 1.45; text-transform: none; letter-spacing: normal; text-align: left;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18); pointer-events: none;
        }
        .kdp-infotip:hover .kdp-tip, .kdp-infotip:focus .kdp-tip { display: block; }
        @media (prefers-reduced-motion: reduce) {
          .kdp-caret, .kdp-demo-row { animation: none; }
        }
      `}</style>

      <section style={{ background: 'var(--color-canvas)', padding: '48px 48px 64px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-2)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <a href="/tools/kdp-niche-finder" style={{ color: 'var(--color-ink-2)', textDecoration: 'none' }}>Tools</a>
            <span>›</span>
            <span style={{ color: 'var(--color-ink)' }}>KDP Niche Finder</span>
          </nav>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 12, lineHeight: 1.2 }}>
            KDP Niche Finder
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-2)', marginBottom: 32, lineHeight: 1.6, maxWidth: 640, margin: '0 auto 32px' }}>
            Enter your book topic — we tell you how competitive the niche is, how many copies it sells, and the first thing you need to do.
          </p>

          {/* Query bar */}
          <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto 12px', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 16, color: 'var(--color-ink-3)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="Try: ADHD planner for adults, 5x8 inch journal, habit tracker for moms..."
              style={{
                width: '100%', height: 56, paddingLeft: 48, paddingRight: 160,
                border: '2px solid var(--color-border)', borderRadius: 12,
                fontSize: '1rem', fontFamily: "'Manrope', sans-serif",
                background: 'var(--color-surface)', color: 'var(--color-ink)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-signal)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
              style={{
                position: 'absolute', right: 4, top: 4, bottom: 4,
                padding: '0 20px', background: loading ? 'var(--color-ink-3)' : 'var(--color-signal)',
                color: 'white', border: 'none', borderRadius: 10, fontSize: '0.875rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', fontFamily: "'Manrope', sans-serif",
              }}
            >
              {loading ? 'Analyzing...' : userPlan === 'guest' ? 'Analyze Now — Free' : userPlan === 'free' ? 'Analyze Now' : 'Analyze Now'}
            </button>
          </div>

          {/* Example chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>Try:</span>
            {['ADHD planner for adults', '5x8 inch journal', 'habit tracker for moms'].map(ex => (
              <button
                key={ex}
                onClick={() => setKeyword(ex)}
                style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem', fontFamily: "'Manrope', sans-serif",
                  color: 'var(--color-ink)', cursor: 'pointer',
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* 3-step guidance */}
          <StepIndicators />

          {/* How-it-works micro demo — hidden once real analysis starts */}
          {!loading && !results && <HowItWorksDemo />}

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 16 }}>
            AI-generated recommendations are estimates based on publicly available data.
          </p>
        </div>
      </section>

      {limitReached && (
        <section style={{ background: 'var(--color-amber-tint)', borderTop: '1px solid #FCD34D', borderBottom: '1px solid #FCD34D', padding: '20px 48px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-amber)' }}>Free preview limit reached — 1 per day for guests</span>
            <Link href="/pricing" style={{ background: 'var(--color-signal)', color: 'white', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              Buy to continue →
            </Link>
          </div>
        </section>
      )}

      {error && (
        <section style={{ padding: '20px 48px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--color-rust-tint)', border: '1px solid #FCA5A5', borderRadius: 12, padding: '16px 20px', color: 'var(--color-rust)', fontWeight: 500 }}>
            Error: {error}
          </div>
        </section>
      )}

      {(loading || results) && (
        <section ref={resultsRef} style={{ background: 'var(--color-surface)', padding: '64px 48px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {loading ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Analyzing your topic...</h2>
                  <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>Generating 5 recommended niches, each with an action plan</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                  {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
                </div>
              </>
            ) : results && results.length > 0 ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                    {results.length} niches found for "{keyword}"
                  </h2>
                  <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem' }}>Sorted by opportunity score, includes BSR range, competition level, and action plan</p>
                </div>
                {/* First-time guidance: what the numbers mean */}
                <details open style={{ maxWidth: 800, margin: '0 auto 32px', background: 'var(--color-signal-tint)', border: '1px solid var(--color-signal)', borderRadius: 12, padding: '14px 20px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink)', fontFamily: "'Space Grotesk', sans-serif", listStylePosition: 'inside' }}>
                    What do these numbers mean?
                  </summary>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
                    {[
                      { term: 'Score', desc: '75+ = great opportunity, 50-74 = worth researching, below 50 = think twice' },
                      { term: 'BSR Range', desc: 'Amazon bestseller rank — lower = easier to sell. 8k-25k = steady demand' },
                      { term: 'Competition', desc: 'Low = low barrier, beginner-friendly; High = red ocean, needs differentiation' },
                      { term: 'Action Plan', desc: 'Follow in order — validate demand first, then design the cover' },
                    ].map(x => (
                      <div key={x.term} style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-signal)', marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{x.term}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>{x.desc}</div>
                      </div>
                    ))}
                  </div>
                </details>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                  {results.map(niche => <NicheCard key={niche.rank} niche={niche} showHints={niche.rank === 1} />)}
                </div>
                <div style={{ marginTop: 48, background: 'var(--color-signal-tint)', border: '1px solid var(--color-signal)', borderRadius: 16, padding: '32px 40px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Want unlimited analyses?</h3>
                  <p style={{ color: 'var(--color-ink-2)', marginBottom: 20 }}>Log in to save history and unlock unlimited analyses</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/login" style={{ background: 'var(--color-signal)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Log in to continue →</Link>
                    <Link href="/pricing" style={{ background: 'var(--color-surface)', color: 'var(--color-signal)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '2px solid var(--color-signal)' }}>Buy a plan</Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}
    </>
  )
}
