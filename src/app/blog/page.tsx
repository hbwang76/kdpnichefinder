import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'
import { BlogCardGrid } from '@/components/blog/BlogCardGrid'

export const metadata: Metadata = {
  title: 'KDP Blog — Niche Research Guides, Data & Alternatives | KDPNicheFinder',
  description:
    'In-depth KDP niche guides, BSR data, and tool comparisons for self-publishers. Updated monthly. Find profitable niches for your next book today.',
  openGraph: {
    title: 'KDP Blog — Niche Research Guides & Data',
    description: 'In-depth KDP niche guides, BSR data, and tool comparisons for self-publishers. Updated monthly with practical market research insights and ideas.',
    type: 'website',
    url: 'https://kdpnichefinder.net/blog',
    siteName: 'KDP Niche Finder',
  },
  alternates: {
    canonical: 'https://kdpnichefinder.net/blog',
  },
}

const typeOrder = ['T1.4', 'T2', 'T3']

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) => {
    const ai = typeOrder.indexOf(a.type)
    const bi = typeOrder.indexOf(b.type)
    return ai - bi
  })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 48px 96px' }}>
      {/* Header */}
      <header style={{ marginBottom: 56, maxWidth: 680 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-signal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          KDP Niche Finder Blog
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 16, color: 'var(--color-ink)' }}>
          Find Your Next Profitable KDP Niche
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
          Data-validated niche guides with BSR, competition scores, and trend analysis.
          Updated monthly on the first Monday.
        </p>
      </header>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
        {[
          { label: 'All posts', count: blogPosts.length },
          { label: 'T1.4 — Flagship', count: blogPosts.filter(p => p.type === 'T1.4').length },
          { label: 'T2 — Niche guides', count: blogPosts.filter(p => p.type === 'T2').length },
          { label: 'T3 — Tool alternatives', count: blogPosts.filter(p => p.type === 'T3').length },
        ].map(tab => (
          <div
            key={tab.label}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-ink-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.label}
            <span style={{
              background: 'var(--color-signal)',
              color: 'white',
              borderRadius: 100,
              padding: '1px 8px',
              fontSize: '0.6875rem',
              fontWeight: 700,
            }}>
              {tab.count}
            </span>
          </div>
        ))}
      </div>

      {/* Post grid — client component for interactivity */}
      <BlogCardGrid posts={sorted} />

      {/* Newsletter / CTA */}
      <div style={{
        background: 'var(--color-ink)',
        borderRadius: 20,
        padding: '56px 64px',
        marginTop: 72,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 40,
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            Get niche alerts before anyone else
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#A8A29E', lineHeight: 1.6 }}>
            Monthly BSR updates, new niche opportunities, and tool tips — straight to your inbox. No spam.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/tools/kdp-niche-finder" style={{ background: 'var(--color-signal)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>
            Try Free Tool →
          </Link>
          <Link href="/pricing" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
