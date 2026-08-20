'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SAMPLE_NICHES = [
  {
    id: 1,
    name: 'ADHD Daily Planner',
    score: 82,
    scoreColor: '#0F766E',
    competition: 'LOW',
    bsr: '8k–25k',
    priceRange: '$9.99–$14.99',
  },
  {
    id: 2,
    name: 'Shadow Work Journal',
    score: 65,
    scoreColor: '#D97706',
    competition: 'MED',
    bsr: '15k–40k',
    priceRange: '$12.99–$16.99',
  },
  {
    id: 3,
    name: 'Mushroom Foraging',
    score: 42,
    scoreColor: '#B91C1C',
    competition: 'HIGH',
    bsr: '40k+',
    priceRange: '$6.99–$9.99',
  },
]

const DATA_TABLE = [
  {
    output: '5 ranked niche recommendations',
    what: 'Niche name, category, estimated monthly searches',
    source: 'Amazon autocomplete + Google Trends (12m avg)',
    updated: '2026-08-17',
  },
  {
    output: 'BSR sweet spot range',
    what: 'Best Sellers Rank top-10 range for the niche',
    source: 'Amazon BSR (public pages, 24-72h delay)',
    updated: '2026-08-17',
  },
  {
    output: 'Competition score (0–100)',
    what: 'Reviews count + rating distribution of top 10 books',
    source: 'Amazon search results',
    updated: '2026-08-17',
  },
  {
    output: 'Action plan (3–5 steps)',
    what: 'Cover style, title ideas, pricing range, launch channels',
    source: 'OpenAI GPT-4o-mini + Anthropic Claude',
    updated: '2026-08-17',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Is this KDP niche finder really free?',
    a: 'Yes. The Free tier gives 1 data-only analysis per day with no signup required. Starter ($9.99/mo) adds 80 AI analyses per month (about 3 per day), and Pro ($29.99/mo) is 270 AI analyses per month (about 9 per day) with scoring, action plans, and history. See our pricing.',
  },
  {
    q: 'How accurate are the niche recommendations?',
    a: "Our scores are estimates based on publicly available Amazon BSR, Google Trends, and Reddit signals. Data may be delayed 24-72 hours and may differ from actual Amazon performance. AI-generated recommendations are for informational purposes only and do not constitute financial or business advice.",
  },
  {
    q: 'Do I need an Amazon account to use the tool?',
    a: 'No. KDP Niche Finder is an independent third-party tool. We are not affiliated with, endorsed by, or sponsored by Amazon.com, Inc., Kindle Direct Publishing (KDP), or any of the third-party tools referenced on this site.',
  },
  {
    q: 'What categories does the tool support?',
    a: 'All KDP categories — paperbacks, Kindle eBooks, low-content books (coloring, journals, puzzle, planners, workbooks), and high-content fiction/nonfiction. We support niche validation in 12 Amazon marketplaces.',
  },
  {
    q: 'How long does an analysis take?',
    a: 'Most analyses complete in 25–35 seconds. During peak hours, analyses may take up to 60 seconds.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. You can cancel from your account page at any time. We also offer a 7-day refund window for new subscriptions — see our refund policy.',
  },
  {
    q: 'Is my niche data private?',
    a: 'Yes. Your niche queries and results are private to your account. We do not share analysis data with third parties. See our privacy policy for full details.',
  },
  {
    q: 'How is this different from Publisher Rocket or Book Beam?',
    a: "Publisher Rocket ($199 one-time) is excellent for keyword and category research, but you have to interpret the data yourself — no niche recommendations, no action plans. Book Beam ($69 one-time) adds niche scoring but no execution path. Book Bolt ($9.99/mo) focuses on puzzle book creation. KDP Niche Finder combines BSR + Trends + Reddit signals with AI-written action plans: cover style, title ideas, pricing range, and 3-step launch plan for every niche.",
  },
]

function ScoreBadge({ score, color }: { score: number; color: string }) {
  return (
    <span
      style={{
        background: color + '15',
        color,
        fontFamily: 'var(--font-mono)',
        fontSize: '1rem',
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-block',
      }}
    >
      {score}
    </span>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-ink)',
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            color: 'var(--color-signal)',
            flexShrink: 0,
          }}
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(28,25,23,0.7)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  )
}

export function HomeClient() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim()) {
      router.push(`/tools/kdp-niche-finder?niche=${encodeURIComponent(keyword.trim())}`)
    } else {
      router.push('/tools/kdp-niche-finder')
    }
  }

  return (
    <>
      {/* ── S1: Hero — 2-column grid matching design truth ─── */}
      <section
        style={{
          padding: '40px 24px 0',
          maxWidth: 1280,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Contour map background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: "url('/assets/hero-contour-map.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />

        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 48,
            alignItems: 'start',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* ── Left col: copy + form + badges ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Find your next profitable KDP niche in ~30 seconds.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'rgba(28,25,23,0.75)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Niche research that actually tells you what to write next. Free to try.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 12px',
                  transition: 'border-color 0.15s',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: 'var(--color-ink-3)', flexShrink: 0 }}
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M20 20l-3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. adhd planner, low content journal, children's coloring book"
                  style={{
                    width: '100%',
                    height: 48,
                    background: 'transparent',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    padding: '12px 0',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--color-signal)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
                }}
              >
                Try the Niche Finder — Free Preview
              </button>
            </form>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(28,25,23,0.7)',
                margin: 0,
              }}
            >
              Preview without signing in · 1 free analysis every 24 hours · Cancel
              anytime
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-ink-3)',
                letterSpacing: '0.04em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              AI-generated recommendations are estimates based on publicly available
              data.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'rgba(28,25,23,0.6)',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              Publisher Rocket charges $199 one-time. Helium 10 starts at $37/mo and
              was built for Amazon FBA, not KDP. KDP Niche Finder is free to try —
              Starter starts at $9.99/mo, Pro at $29.99/mo.
            </p>

            {/* Feature badges — matching design truth */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-ink)',
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                12 MARKETPLACES
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-ink)',
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                5 RANKED NICHES
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-ink)',
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                3-STEP ACTION PLAN
              </span>
            </div>
          </div>

          {/* ── Right col: illustration + niche cards (stacked/floating) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            {/* Hero illustration */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: '#fff',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <img
                src="/assets/hero-illustration.webp"
                alt="KDP niche research — books with signal radar and data gauges"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Niche result cards — floating stack with negative margin */}
            {SAMPLE_NICHES.map((niche, i) => (
              <div
                key={niche.id}
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative',
                  zIndex: 1,
                  marginTop: i === 1 ? '-16px' : i === 2 ? '-16px' : 0,
                  marginLeft: i === 1 ? '12px' : i === 2 ? '24px' : 0,
                  opacity: i === 1 ? 0.9 : i === 2 ? 0.8 : 1,
                  transform: i > 0 ? 'translateY(-4px)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-ink-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Niche #{niche.id}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {niche.name}
                    </h3>
                  </div>
                  <ScoreBadge score={niche.score} color={niche.scoreColor} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-ink-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Competition
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: niche.scoreColor,
                      }}
                    >
                      {niche.competition}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-ink-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      BSR
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-ink)',
                      }}
                    >
                      {niche.bsr}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-ink-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Est. Price
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        color: 'var(--color-ink)',
                      }}
                    >
                      {niche.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S2: Result Preview Strip — 3 niche cards + dashed CTA ─── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          alignItems: 'stretch',
        }}
      >
        {SAMPLE_NICHES.map((niche, i) => (
          <div
            key={`strip-${niche.id}`}
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: i === 0 ? '-24px' : i === 1 ? '-24px' : '-24px',
              marginLeft: i === 1 ? '8px' : i === 2 ? '16px' : 0,
              opacity: i === 1 ? 0.9 : i === 2 ? 0.8 : 1,
              transform: 'translateY(-4px)',
              transition: 'transform 0.15s',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: 12,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Niche #{niche.id}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {niche.name}
                </h3>
              </div>
              <ScoreBadge score={niche.score} color={niche.scoreColor} />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Competition
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: niche.scoreColor,
                  }}
                >
                  {niche.competition}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  BSR
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                  }}
                >
                  {niche.bsr}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Est. Price
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: 'var(--color-ink)',
                  }}
                >
                  {niche.priceRange}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Dashed CTA card */}
        <div
          style={{
            background: '#fff',
            border: '2px dashed var(--color-signal)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            textAlign: 'center',
            marginTop: '-24px',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: 'var(--color-signal)' }}
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            Your niche could be next
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(28,25,23,0.7)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            One line of input. Five ranked niches with a written action plan.
          </p>
          <Link
            href="/tools/kdp-niche-finder"
            style={{
              background: 'var(--color-signal)',
              color: '#fff',
              borderRadius: '4px',
              padding: '10px 20px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            Try the Niche Finder — Free Preview
          </Link>
        </div>
      </section>

      {/* ── S3: GEO — What is a KDP niche finder? ──── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1024,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-pine)',
            padding: 32,
            borderRadius: '4px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: 16,
            }}
          >
            What is a KDP niche finder?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--color-ink)',
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            A KDP niche finder is a tool that identifies profitable, low-competition
            niches for Amazon Kindle Direct Publishing (KDP) books. It analyzes Amazon
            BSR (Best Sellers Rank), Google Trends data, and community signals to
            recommend specific niches with action plans. We give 5 ranked niches
            in ~30 seconds based on the category and audience you want.
          </p>
        </div>
      </section>

      {/* ── S4: Data Table ──────────────────────────── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            overflow: 'hidden',
            maxWidth: 1024,
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: 0,
              }}
            >
              What you get with every analysis
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                textAlign: 'left',
                borderCollapse: 'collapse',
                minWidth: 560,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#fff',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {['Output', 'What it shows', 'Data source', 'Last updated'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color: 'var(--color-ink-3)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-ink)' }}>
                {DATA_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < DATA_TABLE.length - 1
                          ? '1px solid var(--color-border)'
                          : 'none',
                    }}
                  >
                    <td
                      style={{
                        padding: '16px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {row.output}
                    </td>
                    <td style={{ padding: '16px 16px' }}>{row.what}</td>
                    <td style={{ padding: '16px 16px' }}>{row.source}</td>
                    <td
                      style={{
                        padding: '16px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        color: 'var(--color-ink-3)',
                      }}
                    >
                      {row.updated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── S5: Why KDP Niche Finder ───────────────── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: '0 0 8px',
            }}
          >
            Why KDP Niche Finder
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'rgba(28,25,23,0.7)',
              margin: 0,
            }}
          >
            Data without a plan is just a spreadsheet.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {/* Traditional */}
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                marginBottom: 8,
              }}
            >
              Traditional research tools
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(28,25,23,0.7)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Publisher Rocket, Helium 10, and similar tools give you keyword and
              category data. You still have to interpret the numbers and decide what
              to do.
            </p>
          </div>

          {/* Niche-only */}
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                marginBottom: 8,
              }}
            >
              Niche-only tools
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(28,25,23,0.7)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Book Bolt and Book Beam give you niche lists and scores, but no
              execution path. You still write the action plan yourself.
            </p>
          </div>

          {/* KDP Niche Finder — highlighted */}
          <div
            style={{
              background: '#FFF1E8',
              border: '2px solid var(--color-signal)',
              borderRadius: '4px',
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-signal)',
                marginBottom: 8,
              }}
            >
              KDP Niche Finder
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(28,25,23,0.8)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Data + niche + AI-written action plan. Every recommendation comes with
              BSR sweet spot, competition score, cover style, title ideas, pricing
              range, and a 3-step launch plan.
            </p>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-ink-3)',
            letterSpacing: '0.04em',
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          Pricing comparison: Publisher Rocket $199 one-time (research only) · Book Beam
          $69 one-time (scores only) · Book Bolt $9.99/mo (puzzle focus) · KDP Niche
          Finder Free preview, Pro $29.99/mo (data + AI plan).
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'rgba(28,25,23,0.5)',
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Pricing and feature comparison based on each provider's public website as of
          2026-08-17. Features may change without notice. We are not affiliated with any
          brand listed above.
        </p>
      </section>

      {/* ── S6: How it works ─────────────────────────── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          How KDP Niche Finder works
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
          }}
        >
          {[
            {
              num: '1',
              title: 'Type any niche idea',
              body: 'Enter a topic, audience, or format — "adhd planner", "low content journal", "children\'s coloring book". One line is enough.',
            },
            {
              num: '2',
              title: 'We analyze Amazon BSR, Google Trends, and Reddit signals',
              body: 'We pull Amazon BSR, 12-month Google Trends, and Reddit discussion volume. BSR data is 24-72 hours old.',
            },
            {
              num: '3',
              title: 'Get 5 ranked niches + a written action plan',
              body: 'Each result includes BSR sweet spot, competition score, cover style, title ideas, pricing range, and a 3-step launch plan.',
            },
          ].map((step) => (
            <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: 'var(--color-signal)',
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'rgba(28,25,23,0.7)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── S7: FAQ ─────────────────────────────────── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Frequently asked questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── S8: Final CTA ───────────────────────────── */}
      <section
        style={{
          padding: '0 24px 96px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'var(--color-signal)',
            borderRadius: '4px',
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}
          >
            Ready to find your niche?
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/tools/kdp-niche-finder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '4px',
                padding: '14px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              Try the Niche Finder — Free Preview
            </Link>
            <Link
              href="/pricing"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              }}
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section > div[style*="gridTemplateColumns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="gap: 48px"] {
            gap: 24px !important;
          }
          section > div[style*="gap: 24px"][style*="alignItems: stretch"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
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
