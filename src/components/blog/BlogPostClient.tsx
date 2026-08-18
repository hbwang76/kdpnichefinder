'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { BlogPost } from '@/lib/blog-data'

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

function TableOfContents({ post }: { post: BlogPost }) {
  const tocItems = [
    ...post.sections.map(s => ({ id: s.id, heading: s.heading })),
    ...post.faqs.map((_, i) => ({ id: `faq-${i}`, heading: 'FAQ' })),
  ]

  return (
    <nav style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '20px 24px',
      position: 'sticky',
      top: 88,
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', marginBottom: 12 }}>
        Table of Contents
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tocItems.map((item, i) => (
          <li key={i}>
            <a
              href={`#${item.id}`}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-ink-2)',
                textDecoration: 'none',
                lineHeight: 1.4,
                display: 'block',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-signal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink-2)')}
            >
              {item.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '32px 0' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-mono)',
      }}>
        <thead>
          <tr style={{ background: 'var(--color-ink)', color: 'white' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-surface)' : 'var(--color-canvas)', borderBottom: '1px solid var(--color-border)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '10px 14px', color: 'var(--color-ink-2)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          padding: '16px 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>{q}</span>
        <span style={{ color: 'var(--color-signal)', fontSize: '1.25rem', flexShrink: 0 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ padding: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-ink-2)', lineHeight: 1.7 }}>
          {a}
        </p>
      )}
    </div>
  )
}

function CrossLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--color-signal)',
        textDecoration: 'none',
        fontSize: '0.8125rem',
        fontWeight: 500,
        background: 'var(--color-signal-tint)',
        padding: '2px 8px',
        borderRadius: 6,
        transition: 'background 0.15s',
      }}
    >
      {children}
    </Link>
  )
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px 96px' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '24px 0 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--color-ink-3)' }}>
        <Link href="/" style={{ color: 'var(--color-ink-3)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/blog" style={{ color: 'var(--color-ink-3)', textDecoration: 'none' }}>Blog</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-2)' }}>{post.h1}</span>
      </div>

      {/* Disclaimer banner for T3 */}
      {post.disclaimerBanner && (
        <div style={{
          background: 'var(--color-amber-tint)',
          border: '1px solid var(--color-amber)',
          borderRadius: 10,
          padding: '12px 20px',
          marginTop: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', lineHeight: 1.5, margin: 0 }}>
            <strong>Disclosure:</strong> This article compares KDPNicheFinder with other KDP research tools. KDPNicheFinder is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the tools referenced. All data is sourced from publicly available information and may change. See our <Link href="/disclaimer" style={{ color: 'var(--color-signal)' }}>Disclaimer</Link>.
          </p>
        </div>
      )}

      {/* Article header */}
      <header style={{ paddingTop: 32, maxWidth: 800 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-3)', marginBottom: 12 }}>
          Last updated: {post.lastUpdated} · {post.readingTime} read · By KDPNicheFinder Team
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, fontFamily: 'var(--font-display)' }}>
          {post.h1}
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-2)', lineHeight: 1.6, margin: 0 }}>
          {post.heroSub}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, marginTop: 48, alignItems: 'start' }}>
        {/* Main content */}
        <article>
          {/* Quick Answer */}
          <section id="quick-answer" style={{
            background: 'var(--color-pine-tint)',
            border: '1px solid var(--color-pine)',
            borderRadius: 12,
            padding: '24px 28px',
            marginBottom: 48,
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-pine)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
              Quick Answer: {post.mainKeyword}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink)', lineHeight: 1.7, margin: 0 }}>
              {post.quickAnswer}
            </p>
          </section>

          {/* Sections */}
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--color-border)', paddingBottom: 12 }}>
                {section.heading}
              </h2>

              {section.isMethodology && (
                <div style={{ background: 'var(--color-signal-tint)', border: '1px solid var(--color-signal)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-signal)', fontWeight: 600, marginBottom: 4 }}>METHODOLOGY</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', lineHeight: 1.6, margin: 0 }}>
                    Every niche was scored across three signals: Amazon BSR (40%), Google Trends 12-month interest (30%), and competition density (30%). Only niches scoring above 70/100 are listed.
                  </p>
                </div>
              )}

              {section.content && (
                <div style={{ fontSize: '0.9375rem', color: 'var(--color-ink-2)', lineHeight: 1.75, marginBottom: section.listItems ? 24 : 0 }}>
                  {section.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('1.') || para.startsWith('2.') || para.startsWith('3.') || para.startsWith('4.')) {
                      const items = para.split('\n').filter(Boolean)
                      return (
                        <ol key={i} style={{ paddingLeft: 20, marginBottom: 16 }}>
                          {items.map((item, j) => {
                            const boldMatch = item.match(/^\d+\.\s\*\*(.+?)\*\*/)
                            if (boldMatch) {
                              const rest = item.replace(/^\d+\.\s\*\*.+?\*\*/, '')
                              return (
                                <li key={j} style={{ marginBottom: 8 }}>
                                  <strong style={{ color: 'var(--color-ink)' }}>{boldMatch[1]}</strong>{rest}
                                </li>
                              )
                            }
                            return <li key={j} style={{ marginBottom: 4 }}>{item.replace(/^\d+\.\s/, '')}</li>
                          })}
                        </ol>
                      )
                    }
                    return <p key={i} style={{ marginBottom: 16 }}>{para}</p>
                  })}
                </div>
              )}

              {section.listItems && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {section.listItems.map((item, i) => (
                    <div key={i} style={{ borderLeft: '3px solid var(--color-signal)', paddingLeft: 20 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-2)', lineHeight: 1.65, margin: 0 }}>
                        {item.body}
                      </p>
                      {item.link && (
                        <div style={{ marginTop: 8 }}>
                          <CrossLink href={item.link}>→ Related guide</CrossLink>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Data table */}
          <section id="data-table" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--color-border)', paddingBottom: 12 }}>
              Quick comparison
            </h2>
            <DataTable headers={post.tableHeaders} rows={post.tableRows} />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)', fontStyle: 'italic' }}>
              Data source: Amazon BSR via scraping proxy, Google Trends 12-month average. Last refreshed {post.lastUpdated}.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--color-border)', paddingBottom: 12 }}>
              Frequently Asked Questions
            </h2>
            <div>
              {post.faqs.map((faq, i) => (
                <FAQ key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{
            background: 'var(--color-ink)',
            borderRadius: 16,
            padding: '40px 48px',
            marginBottom: 48,
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
              Try these niches with our free tool
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#A8A29E', marginBottom: 24 }}>
              Type any niche from this list into KDPNicheFinder to get fresh BSR, Trends, and AI scoring. Free preview — no signup.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/tools/kdp-niche-finder" style={{ background: 'var(--color-signal)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
                Try Free →
              </Link>
              <Link href="/pricing" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
                View Pricing
              </Link>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center', fontSize: '0.8125rem', color: '#A8A29E' }}>
              <Link href="/refund-policy" style={{ color: '#A8A29E', textDecoration: 'none' }}>Refund Policy</Link>
              <span>·</span>
              <Link href="/privacy" style={{ color: '#A8A29E', textDecoration: 'none' }}>Privacy Policy</Link>
            </div>
          </section>

          {/* Why this article matters for SEO */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 32, marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              Why this article matters for SEO
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', lineHeight: 1.7 }}>
              {post.whySeo}
            </p>
          </section>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 32 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, fontFamily: 'var(--font-display)' }}>
                Related Guides
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {relatedPosts.map(rp => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 10,
                      padding: '16px 20px',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {rp.type}
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.4 }}>
                      {rp.h1}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Footer compliance block */}
          <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: 24, marginTop: 48 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-3)', marginBottom: 8 }}>
              © 2026 KDP Niche Finder. All rights reserved.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-3)', lineHeight: 1.6 }}>
              KDP Niche Finder is an independent tool and is not affiliated with, endorsed by, or sponsored by Amazon.com, Inc., Kindle Direct Publishing (KDP), or any of the third-party tools referenced on this site. "Amazon", "KDP", "Kindle Direct Publishing" are trademarks of Amazon.com, Inc., used here for informational and comparison purposes only.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '0.8125rem', flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Privacy</Link>
              <Link href="/terms" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Terms</Link>
              <Link href="/cookie-policy" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Cookies</Link>
              <Link href="/refund-policy" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Refund</Link>
              <Link href="/disclaimer" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Disclaimer</Link>
              <Link href="/contact" style={{ color: 'var(--color-signal)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <TableOfContents post={post} />

          {/* Sidebar CTA */}
          <div style={{
            background: 'var(--color-signal)',
            borderRadius: 12,
            padding: '24px',
            color: 'white',
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
              Find your niche in 30 seconds
            </p>
            <p style={{ fontSize: '0.8125rem', opacity: 0.9, marginBottom: 16, lineHeight: 1.5 }}>
              KDPNicheFinder gives you BSR, competition scores, and AI recommendations.
            </p>
            <Link href="/tools/kdp-niche-finder" style={{ background: 'white', color: 'var(--color-signal)', padding: '10px 20px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', display: 'block', textAlign: 'center' }}>
              Try Free →
            </Link>
          </div>

          {/* Sidebar pricing */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            padding: '20px 24px',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-3)', marginBottom: 12 }}>Pricing</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Free', '$0/mo', 'Basic previews'], ['Starter', '$9.99/mo', 'AI scoring'], ['Pro', '$29.99/mo', 'Unlimited']].map(([plan, price, desc]) => (
                <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)' }}>{plan}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: plan === 'Pro' ? 'var(--color-signal)' : 'var(--color-ink)' }}>{price}</span>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-3)', margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/pricing" style={{ display: 'block', marginTop: 16, textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-signal)', fontWeight: 600, textDecoration: 'none' }}>
              View all plans →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
