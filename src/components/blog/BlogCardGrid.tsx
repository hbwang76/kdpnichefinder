'use client'

import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-data'

interface BlogCardGridProps {
  posts: BlogPost[]
}

export function BlogCardGrid({ posts }: BlogCardGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
      {posts.map(post => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: '28px 28px 24px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-signal)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(234,88,12,0.12)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
          }}
        >
          {/* Type badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: post.type === 'T1.4' ? 'var(--color-pine)'
                : post.type === 'T2' ? 'var(--color-signal)'
                : 'var(--color-amber)',
              background: post.type === 'T1.4' ? 'var(--color-pine-tint)'
                : post.type === 'T2' ? 'var(--color-signal-tint)'
                : 'var(--color-amber-tint)',
              padding: '3px 10px',
              borderRadius: 100,
            }}>
              {post.type === 'T1.4' ? '⭐ Flagship' : post.type === 'T2' ? 'Niche Guide' : 'Tool Alternative'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>{post.readingTime || post.readTime} read</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--color-ink)',
            lineHeight: 1.3,
            marginBottom: 10,
          }}>
            {post.h1}
          </h2>

          {/* Meta description */}
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-ink-2)',
            lineHeight: 1.6,
            flex: 1,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.meta}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>
              Updated {post.lastUpdated}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-signal)' }}>
              Read →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
