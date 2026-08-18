import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How KDP Niche Finder uses cookies and similar technologies. Strictly necessary, analytics, and marketing cookies explained.',
  alternates: { canonical: '/cookie-policy' },
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: '3rem' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--color-ink)',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-display)',
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--color-ink)',
      marginTop: '1.5rem',
      marginBottom: '0.5rem',
    }}>
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-2)', lineHeight: 1.7, marginBottom: '0.75rem' }}>{children}</p>
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '0.9375rem', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>{item}</li>
      ))}
    </ul>
  )
}

function DocTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', background: 'var(--color-canvas)', borderBottom: '2px solid var(--color-border)', fontWeight: 600, color: 'var(--color-ink)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.5rem 0.75rem', color: 'var(--color-ink-2)', verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CookiePolicyPage() {
  return (
    <div style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '64px 48px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--color-signal)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>← Back to KDP Niche Finder</Link>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>
            Cookie Policy
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-ink-2)' }}>
            <span><strong>Last updated:</strong> 2026-08-17</span>
            <span><strong>Effective date:</strong> 2026-08-17</span>
            <span><strong>Contact:</strong> privacy@kdpnichefinder.net</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '56px 48px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          <Section id="what-are" title="1. What Are Cookies">
            <P>
              Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to site operators.
            </P>
            <P>
              This Cookie Policy explains how <strong>kdpnichefinder.net</strong> (the &quot;Site&quot;) uses cookies and similar technologies. It should be read alongside our <Link href="/privacy-policy" style={{ color: 'var(--color-signal)' }}>Privacy Policy</Link>.
            </P>
          </Section>

          <Section id="cookies-we-use" title="2. Cookies We Use">
            <P>
              We use the following categories of cookies, classified per the <strong>ePrivacy Directive 2002/58/EC</strong> and aligned with the categorization used by our payment processor:
            </P>

            <H3>2.1 Strictly necessary cookies (no consent required)</H3>
            <DocTable
              headers={['Cookie', 'Purpose', 'Provider', 'Duration']}
              rows={[
                ['__cf_bm', 'Bot management (Cloudflare) — distinguishes humans from bots', 'Cloudflare, Inc. (1st-party via Cloudflare)', '30 minutes'],
                ['__cfuvid', 'Cloudflare session security', 'Cloudflare, Inc.', 'Session'],
                ['Authentication session cookie', 'Maintains your login state after Google Sign-In', 'kdpnichefinder', 'Session'],
                ['Creem Checkout session', 'Required for payment processing', 'Creem (creem.io)', 'Session'],
              ]}
            />
            <P>
              These cookies are essential for the Site to function (security, fraud prevention, authentication, payment). By law, we have the right to use them without your prior consent.
            </P>

            <H3>2.2 Analytics cookies (consent required)</H3>
            <DocTable
              headers={['Cookie', 'Purpose', 'Provider', 'Duration']}
              rows={[
                ['_ga (if GA4 is enabled)', 'Distinguishes users for Google Analytics 4', 'Google LLC (3rd-party)', '2 months'],
                ['_ga_<container-id> (if GA4 is enabled)', 'Stores session state for GA4', 'Google LLC (3rd-party)', '2 months'],
                ['Plausible cookie (if Plausible is enabled)', 'Plausible Analytics is cookie-less by default', 'Plausible (3rd-party)', 'None'],
              ]}
            />
            <P>
              <strong>Analytics cookies are disabled by default</strong> in the EU. You will be asked for consent via a cookie banner before they are loaded. You may change your preference at any time.
            </P>

            <H3>2.3 Marketing cookies</H3>
            <P>
              <strong>We do not use marketing or advertising cookies</strong> (e.g., Facebook Pixel, Google Ads conversion tags, TikTok Pixel). None are set on this Site at this time.
            </P>
          </Section>

          <Section id="third-party-cookies" title="3. Third-Party Cookies">
            <P>
              Cookies may be set by third-party services that we use. Each provider has its own cookie and privacy practices:
            </P>
            <DocTable
              headers={['Service', 'Privacy Policy']}
              rows={[
                ['Cloudflare, Inc.', <a href="https://www.cloudflare.com/privacypolicy/" style={{ color: 'var(--color-signal)' }}>cloudflare.com/privacypolicy</a>],
                ['Google LLC (Sign-In, Analytics)', <a href="https://policies.google.com/privacy" style={{ color: 'var(--color-signal)' }}>policies.google.com/privacy</a>],
                ['Creem (Armitage Labs OÜ)', <a href="https://www.creem.io/privacy" style={{ color: 'var(--color-signal)' }}>creem.io/privacy</a>],
                ['Plausible Analytics (if enabled)', <a href="https://plausible.io/data-policy" style={{ color: 'var(--color-signal)' }}>plausible.io/data-policy</a>],
              ]}
            />
            <P>
              When you consent to analytics cookies, you also consent to the corresponding third-party processing.
            </P>
          </Section>

          <Section id="your-choices" title="4. Your Choices">
            <H3>4.1 Consent management</H3>
            <P>
              When you first visit the Site, you will see a cookie banner asking you to accept or reject <strong>analytics</strong> cookies. Strictly necessary cookies cannot be rejected as they are required for the Site to function.
            </P>
            <P>
              You can change your preferences at any time by clicking &quot;Cookie settings&quot; in the page footer.
            </P>

            <H3>4.2 Browser controls</H3>
            <P>
              You can also block or delete cookies via your browser settings. Note that blocking strictly necessary cookies will break authentication and payment functionality.
            </P>

            <H3>4.3 Do Not Track</H3>
            <P>
              We respect browser &quot;Do Not Track&quot; signals for analytics cookies.
            </P>
          </Section>

          <Section id="legal-bases" title="5. Legal Bases (GDPR + ePrivacy)">
            <DocTable
              headers={['Cookie category', 'Legal basis']}
              rows={[
                ['Strictly necessary', 'ePrivacy Directive Art. 5(3) — exemption from consent'],
                ['Analytics', 'GDPR Art. 6(1)(a) — your consent'],
                ['Marketing', 'Not used'],
              ]}
            />
          </Section>

          <Section id="updates" title="6. Updates to This Policy">
            <P>
              We may update this Cookie Policy to reflect changes in our use of cookies or applicable law. The &quot;Last updated&quot; date at the top will reflect the change. Material changes will be notified by Site banner.
            </P>
          </Section>

          <Section id="contact" title="7. Contact">
            <Ul items={[
              <><strong>Email:</strong> privacy@kdpnichefinder.net</>,
              <><strong>Operator:</strong> kdpnichefinder (operated as kdpnichefinder)</>,
            ]} />
          </Section>

          {/* Source references */}
          <section style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Source References</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {([
                ['Creem Privacy Notice V2.0 §7 (Cookies)', 'creem.io/privacy'],
                ['ePrivacy Directive 2002/58/EC', 'eur-lex.europa.eu/eli/dir/2002/58/oj'],
                ['GDPR Art. 6 (lawful bases)', 'gdpr-info.eu/art-6-gdpr'],
              ] as [string, string][]).map(([label, url]) => (
                <li key={label} style={{ fontSize: '0.8125rem' }}>
                  <a href={`https://${url}`} style={{ color: 'var(--color-signal)' }} target="_blank" rel="noopener noreferrer">{label}</a>
                  <span style={{ color: 'var(--color-ink-3)', marginLeft: '0.375rem' }}>— {url}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--color-ink-3)', fontStyle: 'italic' }}>
              This is a draft legal page for compliance review. Final wording must be approved by a licensed attorney before production deployment.
            </p>
          </section>

        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section[style*="padding: 56px"] { padding: 32px 16px 48px !important; }
          section[style*="padding: 64px 48px"] { padding: 40px 16px 32px !important; }
        }
        h2 { scroll-margin-top: 80px; }
        h3 { scroll-margin-top: 80px; }
        a { word-break: break-word; }
      `}</style>
    </div>
  )
}
