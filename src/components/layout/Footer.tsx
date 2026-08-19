import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-footer)',
        color: 'white',
        padding: '64px 48px 32px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#EA580C" />
                <path
                  d="M7 8h14M7 14h10M7 20h12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="20" r="4" fill="#0F766E" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                }}
              >
                KDP Niche Finder
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#A8A29E', lineHeight: 1.6 }}>
              AI-powered niche research for KDP authors. Find your next bestseller in
              almost 30 seconds.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#A8A29E',
                marginBottom: 16,
              }}
            >
              Product
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <li>
                <Link
                  href="/tools/kdp-niche-finder"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Niche Finder Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/niche-score-checker"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Niche Score Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#A8A29E',
                marginBottom: 16,
              }}
            >
              Resources
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <li>
                <Link
                  href="/about"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#A8A29E',
                marginBottom: 16,
              }}
            >
              Legal
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <li>
                <Link
                  href="/privacy"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: '#A8A29E' }}>
            © 2026 KDP Niche Finder. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#A8A29E' }}>
            Amazon KDP is a trademark of Amazon.com, Inc. Not affiliated.
          </p>
        </div>

        {/* §11.3 compliance block — exact text from COMPLIANCE.md */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: 24,
            paddingTop: 16,
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            lineHeight: 1.7,
            color: '#A8A29E',
            maxWidth: '80rem',
          }}
        >
          <p style={{ margin: '0 0 12px' }}>
            KDP Niche Finder is an independent tool and is not affiliated with, endorsed
            by, or sponsored by Amazon.com, Inc., Kindle Direct Publishing (KDP), or any
            of the third-party tools referenced on this site. &quot;Amazon&quot;, &quot;KDP&quot;, and
            &quot;Kindle Direct Publishing&quot; are trademarks of Amazon.com, Inc., used here for
            informational and comparison purposes only.
          </p>
          <p style={{ margin: '0 0 12px' }}>
            All niche recommendations, scores, and action plans are generated by
            artificial intelligence (OpenAI / Anthropic) and are provided for
            informational purposes only. They do not constitute financial, legal, or
            business advice. Actual Amazon sales performance depends on many factors and
            may differ significantly from our estimates.
          </p>
          <p style={{ margin: 0 }}>
            BSR (Best Sellers Rank) and sales estimate data are sourced from publicly
            available Amazon pages via third-party scraping proxies. Data may be delayed
            by 24-72 hours and is not guaranteed to be accurate.
          </p>
        </div>
      </div>
    </footer>
  )
}
