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
    a: 'Yes — 1 data-only analysis per day, no signup needed. Starter gives you 80 AI analyses/month (~$3/day). Pro gives you 270/month (~$1/day) with full scoring, action plans, and history. See our pricing.',
  },
  {
    q: 'How accurate are the niche recommendations?',
    a: 'Scores come from Amazon BSR, Google Trends, and Reddit signals — updated every 24-72 hours. BSR data reflects what titles are selling now, not tomorrow. No niche score is a guarantee; actual results depend on your cover, pricing, and launch timing.',
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
    a: 'Publisher Rocket ($199 one-time) is excellent for keyword and category research, but you have to interpret the data yourself — no niche recommendations, no action plans. Book Beam ($69 one-time) adds niche scoring but no execution path. Book Bolt ($9.99/mo) focuses on puzzle book creation. KDP Niche Finder combines BSR + Trends + Reddit signals with AI-written action plans: cover style, title ideas, pricing range, and 3-step launch plan for every niche.',
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

function NicheCard({ niche, offset }: { niche: typeof SAMPLE_NICHES[0]; offset: number }) {
  const offsets = [
    '',
    '-mt-4 md:-mt-6 ml-3 md:ml-4',
    '-mt-4 md:-mt-8 ml-6 md:ml-8',
  ]
  const opacities = ['', 'opacity-90', 'opacity-80']
  const zIndices = ['z-10', 'z-10', 'z-10']

  return (
    <div
      className={`bg-white rounded-card border border-border p-4 flex flex-col gap-3 relative ${offsets[offset]} ${opacities[offset]} ${zIndices[offset]} transition-transform hover:-translate-y-1 card-shadow`}
    >
      <div className="flex justify-between items-start border-b border-border pb-3">
        <div>
          <span className="font-mono text-[13px] text-ink-3 uppercase tracking-widest block mb-1">
            Niche #{niche.id}
          </span>
          <h3 className="font-display text-[1.125rem] font-bold text-ink leading-tight">
            {niche.name}
          </h3>
        </div>
        <ScoreBadge score={niche.score} color={niche.scoreColor} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-3 uppercase tracking-widest">Competition</span>
          <span className="font-mono text-base font-semibold" style={{ color: niche.scoreColor }}>
            {niche.competition}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-3 uppercase tracking-widest">BSR</span>
          <span className="font-mono text-base font-semibold text-ink">{niche.bsr}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-3 uppercase tracking-widest">Est. Price</span>
          <span className="font-mono text-sm text-ink">{niche.priceRange}</span>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-card border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex justify-between items-center gap-4 cursor-pointer bg-transparent border-none"
      >
        <span className="font-body text-base font-semibold text-ink">{q}</span>
        <span className="font-mono text-xl text-signal flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="font-body text-sm text-ink/70 leading-relaxed">{a}</p>
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
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="px-4 md:px-12 pt-10 pb-24 max-w-7xl mx-auto relative">
        {/* Contour map bg */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            backgroundImage: "url('/assets/hero-contour-map.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start relative z-10">
          {/* Left col */}
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-4xl md:text-[3.5rem] font-bold text-ink leading-[1.05] tracking-tight">
              Find your next profitable KDP niche in almost 30 seconds.
            </h1>
            <p className="font-body text-lg text-ink/75 leading-relaxed">
              Niche research that actually tells you what to write next. Free to try.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="bg-white rounded-card border border-border flex items-center gap-2 px-4 py-1 card-shadow focus-within:border-signal focus-within:outline focus-within:outline-2 focus-within:outline-signal focus-within:outline-offset-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-ink-3 flex-shrink-0">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. adhd planner, low content journal, children's coloring book"
                  className="w-full h-14 bg-transparent text-ink placeholder:text-ink-3 font-body text-base border-none outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-signal text-white rounded-btn px-6 py-4 font-body text-base font-semibold hover:opacity-85 transition-opacity text-center card-shadow"
              >
                Try the Niche Finder — Free Preview
              </button>
            </form>
            <p className="font-body text-sm text-ink/70">
              No signup needed · 1 analysis/day · Cancel anytime
            </p>
            <p className="font-mono text-[11px] text-ink-3 uppercase tracking-widest">
              AI-generated recommendations are estimates based on publicly available data.
            </p>
            <p className="font-body text-[13px] text-ink/60 leading-relaxed">
              Publisher Rocket charges $199 one-time. Helium 10 starts at $37/mo and was built for Amazon FBA, not KDP. KDP Niche Finder is free to try — Starter starts at $9.99/mo, Pro at $29.99/mo.
            </p>
            <div className="flex flex-wrap gap-2">
              {['12 MARKETPLACES', '5 RANKED NICHES', '3-STEP ACTION PLAN'].map((b) => (
                <span key={b} className="font-mono text-[11px] text-ink/70 bg-white border border-border rounded-sm px-2 py-1 uppercase tracking-widest card-shadow">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right col — illustration + floating cards */}
          <div className="flex flex-col gap-4 relative">
            <div className="rounded-card overflow-hidden border border-border bg-white relative z-20 card-shadow">
              <img
                src="/assets/hero-illustration.webp"
                alt="KDP niche research — books with signal radar and data gauges"
                className="w-full h-auto block"
                style={{ height: '240px', objectFit: 'cover' }}
              />
            </div>
            <NicheCard niche={SAMPLE_NICHES[0]} offset={0} />
          </div>
        </div>
      </section>

      {/* ── RESULT PREVIEW STRIP (S2) ───────────────────── */}
      <section className="px-4 md:px-12 pt-8 pb-0 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <NicheCard niche={SAMPLE_NICHES[1]} offset={1} />
          <NicheCard niche={SAMPLE_NICHES[2]} offset={2} />
          <div className="rounded-card border-2 border-dashed border-signal/50 p-6 flex flex-col items-center justify-center gap-3 text-center relative z-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-signal">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="font-display text-[1.125rem] font-bold text-ink">Your niche could be next</h3>
            <p className="font-body text-sm text-ink/70 leading-relaxed">
              Type one niche. Get five ranked niches with a full action plan.
            </p>
            <button
              onClick={() => router.push('/tools/kdp-niche-finder')}
              className="bg-signal text-white rounded-btn px-5 py-2.5 font-body text-sm font-semibold hover:opacity-85 transition-opacity mt-1"
            >
              Try the Niche Finder — Free Preview
            </button>
          </div>
        </div>
      </section>

      {/* ── § Definition / GEO block (S3) ───────────────── */}
      <section className="px-4 md:px-12 pt-24 pb-0 max-w-7xl mx-auto">
        <div className="bg-white rounded-card border border-border p-6 md:p-8 max-w-3xl border-l-4 border-l-signal">
          <span className="font-mono text-[11px] text-signal uppercase tracking-widest block mb-2">
            § Definition
          </span>
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink mb-3">
            What is a KDP niche finder?
          </h2>
          <p className="font-body text-base text-ink/80 leading-relaxed">
            A KDP niche finder shows you which book niches have real demand and low competition on Amazon. We pull Amazon BSR, Google Trends, and Reddit discussion data, then return 5 ranked niches with an action plan in almost 30 seconds.
          </p>
        </div>
      </section>

      {/* ── DATA TABLE (S4) ─────────────────────────────── */}
      <section className="px-4 md:px-12 pt-24 max-w-7xl mx-auto">
        <div className="bg-white rounded-card border border-border overflow-hidden max-w-3xl">
          <div className="p-4 border-b border-border bg-surface">
            <h2 className="font-display text-xl font-bold text-ink">What you get with every analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-white border-b border-border">
                  {['Output', 'What it shows', 'Data source', 'Last updated'].map((h) => (
                    <th key={h} className="py-3 px-4 font-mono text-[11px] text-ink-3 uppercase tracking-widest font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body text-sm text-ink">
                {DATA_TABLE.map((row, i) => (
                  <tr key={i} className={`border-b border-border ${i < DATA_TABLE.length - 1 ? '' : 'border-b-0'}`}>
                    <td className="py-4 px-4 font-mono text-sm font-semibold">{row.output}</td>
                    <td className="py-4 px-4">{row.what}</td>
                    <td className="py-4 px-4">{row.source}</td>
                    <td className="py-4 px-4 font-mono text-sm text-ink-3">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── WHY-US (S5) ─────────────────────────────────── */}
      <section className="px-4 md:px-12 pt-24 pb-0 max-w-7xl mx-auto">
        <div className="mb-6 max-w-2xl">
          <span className="font-mono text-[11px] text-signal uppercase tracking-widest block mb-1">
            § Field comparison
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight tracking-tight">
            Why KDP Niche Finder
          </h2>
          <p className="font-body text-base text-ink/70 mt-2">
            Data without a plan is just a spreadsheet.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Card 01 */}
          <div className="bg-white rounded-card border border-border p-6 border-l-4 border-l-ink/15">
            <span className="font-mono text-[13px] text-ink-3 block mb-3">01</span>
            <h3 className="font-display text-lg font-bold text-ink mb-2">Traditional research tools</h3>
            <p className="font-body text-sm text-ink/70 leading-relaxed">
              Publisher Rocket and Helium 10 give you keyword data. You interpret the numbers yourself.
            </p>
          </div>
          {/* Card 02 — staggered down */}
          <div className="bg-white rounded-card border border-border p-6 border-l-4 border-l-ink/15 md:translate-y-6">
            <span className="font-mono text-[13px] text-ink-3 block mb-3">02</span>
            <h3 className="font-display text-lg font-bold text-ink mb-2">Niche-only tools</h3>
            <p className="font-body text-sm text-ink/70 leading-relaxed">
              Book Bolt and Book Beam give you scores. No next step included.
            </p>
          </div>
          {/* Card 03 — highlighted, staggered up */}
          <div className="bg-signal-tint rounded-card border-2 border-signal p-6 relative md:-translate-y-2">
            <span className="absolute -top-3 right-4 bg-signal text-white font-mono text-[11px] uppercase tracking-wider px-2 py-1 rounded-full"
              style={{ transform: 'rotate(2.5deg)' }}>
              Data + Plan ✳
            </span>
            <span className="font-mono text-[13px] text-signal block mb-3">03</span>
            <h3 className="font-display text-lg font-bold text-signal mb-2">KDP Niche Finder</h3>
            <p className="font-body text-sm text-ink/80 leading-relaxed">
              Every result comes with BSR sweet spot, competition score, cover style, title ideas, pricing range, and a 3-step launch plan.
            </p>
          </div>
        </div>
        <p className="font-mono text-[11px] text-ink-3 uppercase tracking-widest mt-6 text-center">
          Pricing: Publisher Rocket $199 one-time · Book Beam $69 · Book Bolt $9.99/mo · KDP Niche Finder Free to try, Pro $29.99/mo.
        </p>
        <p className="font-body text-xs text-ink/50 mt-1 text-center">
          Prices from public pricing pages, checked 2026-08-17. No brand partnerships.
        </p>
      </section>

      {/* ── HOW IT WORKS (S6) ──────────────────────────── */}
      <section className="px-4 md:px-12 pt-24 pb-0 max-w-7xl mx-auto">
        <div className="mb-6 max-w-2xl">
          <span className="font-mono text-[11px] text-signal uppercase tracking-widest block mb-1">
            § Pipeline
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight tracking-tight">
            How KDP Niche Finder works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {[
            {
              num: '01',
              title: 'Type any niche idea',
              body: 'Enter a topic, audience, or format — "adhd planner", "low content journal", "children\'s coloring book". One line is enough.',
            },
            {
              num: '02',
              title: 'We analyze Amazon BSR, Google Trends, and Reddit signals',
              body: 'We pull Amazon BSR, 12-month Google Trends, and Reddit discussion volume. BSR data is 24-72 hours old.',
            },
            {
              num: '03',
              title: 'Get 5 ranked niches + a written action plan',
              body: 'Each result includes BSR sweet spot, competition score, cover style, title ideas, pricing range, and a 3-step launch plan.',
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col gap-3 border-t-2 border-dashed border-signal/40 pt-5 ${i === 1 ? 'md:mt-8' : i === 2 ? 'md:mt-16' : ''}`}
            >
              <span className="font-mono text-[2rem] font-semibold text-signal leading-none">
                {step.num}
              </span>
              <h3 className="font-display text-lg font-bold text-ink leading-tight">{step.title}</h3>
              <p className="font-body text-sm text-ink/70 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ (S7) ──────────────────────────────────── */}
      <section className="px-4 md:px-12 pt-24 pb-0 max-w-3xl mx-auto w-full">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA (S8) ─────────────────────────────── */}
      <section className="px-4 md:px-12 pt-16 pb-16 max-w-7xl mx-auto">
        <div
          className="rounded-card p-8 md:p-12 text-center flex flex-col items-center gap-4 relative overflow-hidden"
          style={{ background: '#EA580C' }}
        >
          {/* hero-contour-map texture overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              backgroundImage: "url('/assets/hero-contour-map.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.12,
              mixBlendMode: 'luminosity',
            }}
          />
          <span className="font-mono text-[11px] text-white/70 uppercase tracking-widest relative z-10">
            Free preview · No signup
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white relative z-10 leading-tight tracking-tight">
            Stop guessing. Find your niche in 30 seconds.
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <button
              onClick={() => router.push('/tools/kdp-niche-finder')}
              className="bg-transparent text-white border-2 border-white rounded-btn px-6 py-3.5 font-body text-base font-semibold hover:bg-white/10 transition-colors"
            >
              Try the Niche Finder — Free Preview
            </button>
            <Link
              href="/pricing"
              className="font-body text-base text-white/90 underline underline-offset-4 hover:text-white"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
