'use client'

import Link from 'next/link'

const SAMPLE_NICHES = [
  {
    id: 1,
    name: 'Shadow Work Journal',
    demand: 'High Demand',
    trend: 'trending_up',
    trendColor: 'var(--pine)',
    bsr: '15,402',
    score: '42/100',
    scoreColor: 'var(--amber)',
    priceRange: '$12.99–$16.99',
    tip: 'Target millennials seeking self-guided therapy tools. Differentiate with prompted daily exercises rather than blank pages.',
  },
  {
    id: 2,
    name: 'Adult ADHD Planner',
    demand: 'Rising',
    trend: 'trending_up',
    trendColor: 'var(--pine)',
    bsr: '22,105',
    score: '38/100',
    scoreColor: 'var(--amber)',
    priceRange: '$14.99–$19.99',
    tip: 'Focus on non-linear planning layouts. Avoid standard calendar grids; use undated brain-dump sections.',
  },
  {
    id: 3,
    name: 'Stoic Daily Devotional',
    demand: 'Stable',
    trend: 'trending_flat',
    trendColor: 'var(--ink-3)',
    bsr: '45,800',
    score: '25/100',
    scoreColor: 'var(--pine)',
    priceRange: '$9.99–$14.99',
    tip: 'Low competition space. Combine short daily quotes with lined reflection space for modern men.',
  },
  {
    id: 4,
    name: 'Toddler Scissor Skills',
    demand: 'High Demand',
    trend: 'trending_up',
    trendColor: 'var(--pine)',
    bsr: '8,200',
    score: '65/100',
    scoreColor: 'var(--amber)',
    priceRange: '$6.99–$8.99',
    tip: 'High volume but competitive. Niche down into specific themes (e.g., dinosaurs, construction vehicles).',
  },
  {
    id: 5,
    name: 'Cryptogram Puzzles',
    demand: 'Rising',
    trend: 'trending_up',
    trendColor: 'var(--pine)',
    bsr: '32,450',
    score: '18/100',
    scoreColor: 'var(--pine)',
    priceRange: '$8.99–$12.99',
    tip: 'Very low competition. Target seniors with large print editions featuring historical quotes.',
  },
]

function TrendIcon({ name, color }: { name: string; color: string }) {
  if (name === 'trending_up') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color }}>
        <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 7h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color }}>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function HomeClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto',
          padding: '48px 48px 96px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 24,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Find your next profitable KDP niche in 30 seconds
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'var(--ink-2)',
            marginBottom: 48,
            maxWidth: 680,
            margin: '0 auto 48px',
            lineHeight: 1.6,
          }}
        >
          AI-powered niche research for Amazon KDP authors. Free preview, no signup.
        </p>

        {/* Search box */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 32,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexDirection: 'row', alignItems: 'stretch' }}>
            {/* Input */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-3)',
                  pointerEvents: 'none',
                }}
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="e.g. adhd planner, low content journal, children's coloring book"
                style={{
                  width: '100%',
                  height: 56,
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  padding: '0 16px 0 48px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  borderRadius: 0,
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--pine)' }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
              />
            </div>

            {/* CTA button */}
            <Link
              href="/tools/kdp-niche-finder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--signal)',
                color: 'white',
                padding: '0 32px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderRadius: 0,
                minHeight: 56,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              Analyze Niche
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.75rem',
            color: 'var(--ink-3)',
            letterSpacing: '0.04em',
          }}
        >
          Preview without signing in · 1 free analysis every 24 hours · Cancel anytime.
        </p>
      </section>

      {/* ── Live Niche Trends ─────────────────────────────────── */}
      <section style={{ padding: '0 48px 96px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            Live Niche Trends
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: '0.75rem',
              color: 'var(--pine)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Updated 1h ago
          </span>
        </div>

        {/* Niche cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {SAMPLE_NICHES.map((niche) => (
            <article
              key={niche.id}
              style={{
                background: '#F7F3EA',
                border: '1px solid var(--border)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'transform 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              {/* Niche label + title */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: '0.6875rem',
                    color: 'var(--ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Niche #{niche.id}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {niche.name}
                </h3>
                {/* Demand badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendIcon name={niche.trend} color={niche.trendColor} />
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.75rem',
                      color: niche.trendColor,
                    }}
                  >
                    {niche.demand}
                  </span>
                </div>
              </div>

              {/* Data grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px 16px',
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.6875rem',
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4,
                    }}
                  >
                    Est. BSR
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {niche.bsr}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.6875rem',
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4,
                    }}
                  >
                    Comp Score
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: niche.scoreColor,
                    }}
                  >
                    {niche.score}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.6875rem',
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4,
                    }}
                  >
                    Price Range
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.875rem',
                      color: 'var(--ink)',
                    }}
                  >
                    {niche.priceRange}
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 'auto' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--ink-2)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {niche.tip}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── What is a KDP niche finder? ─────────────────────── */}
      <section
        style={{
          padding: '0 48px 96px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 24,
          }}
        >
          What is a KDP niche finder?
        </h2>
        <div
          style={{
            background: '#F7F3EA',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--pine)',
            padding: 32,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'var(--ink)',
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            A KDP niche finder is an analytical tool designed to uncover low-competition, high-demand book ideas for Amazon Kindle Direct Publishing. It aggregates real-time Amazon search data, BSR (Best Sellers Rank) metrics, and keyword volume to identify profitable segments before you write or design your book.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'var(--ink)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Instead of guessing what readers want, our AI analyzes thousands of data points to provide actionable insights, ensuring your time is spent creating books that actually sell.
          </p>
        </div>
      </section>

      {/* AI disclaimer */}
      <div
        style={{
          textAlign: 'center',
          padding: '0 48px 48px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--ink-3)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          AI-generated recommendations are estimates based on publicly available data.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section,
          section > * {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </>
  )
}
