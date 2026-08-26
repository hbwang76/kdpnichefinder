import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — KDP Niche Finder',
  description: 'How KDP Niche Finder collects, uses, and protects your personal information. GDPR and CCPA compliant.',
  alternates: { canonical: '/privacy-policy' },
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

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 500, color: 'var(--color-ink)', fontSize: '0.875rem', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{label}</td>
      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-ink-2)', fontSize: '0.875rem' }}>{value}</td>
    </tr>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '64px 48px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--color-signal)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>← Back to KDP Niche Finder</Link>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>
            Privacy Policy
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

          <Section id="intro" title="1. Introduction">
            <P>
              This Privacy Policy describes how kdpnichefinder (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects your personal information when you visit <strong>kdpnichefinder.net</strong> (the &quot;Site&quot;) or use our niche analysis tools (the &quot;Service&quot;).
            </P>
            <P>
              For the purposes of GDPR and equivalent data protection laws, <strong>kdpnichefinder is the data controller</strong> for personal data described in this Policy. We determine the purposes and means of processing your personal data.
            </P>
            <P>
              By using the Service, you agree to the practices described in this Policy.
            </P>
          </Section>

          <Section id="info-collected" title="2. Information We Collect">
            <H3>2.1 Information you provide directly</H3>
            <Ul items={[
              <><strong>Account information:</strong> email address, password (stored hashed via bcrypt) — only required if you create an account</>,
              <><strong>Niche analysis inputs:</strong> publication type, target price, monthly sales goal, topic interests (entered into the tool)</>,
              <><strong>Communications:</strong> when you email customer support</>,
            ]} />

            <H3>2.2 Information collected automatically</H3>
            <Ul items={[
              <><strong>Log data:</strong> IP address (truncated), browser type, device type, referring page, pages visited, timestamps</>,
              <><strong>Cookies:</strong> see our Cookie Policy for the full list and consent management</>,
              <><strong>Usage events:</strong> tool runs, button clicks, page scrolls (via analytics, if enabled)</>,
            ]} />

            <H3>2.3 Information handled by third-party services on our behalf</H3>
            <P>
              We use the following third-party services to operate the Service. Each service is a <strong>data processor</strong> acting under contract with us:
            </P>
            <DocTable
              headers={['Service', 'Role', 'Data shared', 'Retention']}
              rows={[
                ['Cloudflare, Inc. (Pages / Workers)', 'Hosting, edge compute, security', 'Request logs (IP, UA, path)', 'Cloudflare default (up to 30 days)'],
                ['Google LLC (Google Sign-In / OAuth)', 'Authentication provider for paid tier', 'Email, name, profile ID, OAuth token (used only to verify paying-user status; we do not store, profile, or analyze this data)', "Per Google's policies; Google is independent controller for its own data"],
                ['Creem (Armitage Labs OÜ, Estonia — Merchant of Record)', 'Payment processing and tax collection', 'Buyer name, email, billing address, payment details, transaction metadata. We never see your full card number.', 'Per Creem Privacy Notice'],
                ['Resend or SendGrid (TBD)', 'Transactional email', 'Email address', 'Until unsubscribed'],
              ]}
            />
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Information">
            <P>We use your information to:</P>
            <Ul items={[
              'Provide, maintain, and improve the Service',
              'Authenticate paying users (via Google Sign-In)',
              'Process payments via our Merchant of Record (Creem)',
              'Generate AI-powered niche recommendations (only when you actively use the AI feature)',
              'Send transactional emails (receipts, account notifications)',
              'Detect fraud, abuse, and violations of our Terms of Service',
              'Comply with legal obligations (tax, accounting, law enforcement requests)',
            ]} />
            <H3>Legal bases under GDPR</H3>
            <Ul items={[
              <><strong>Contract performance</strong> (Art. 6(1)(b)): providing the Service you signed up for, processing payments</>,
              <><strong>Legitimate interests</strong> (Art. 6(1)(f)): fraud prevention, security, service improvement</>,
              <><strong>Consent</strong> (Art. 6(1)(a)): analytics cookies, marketing emails</>,
              <><strong>Legal obligation</strong> (Art. 6(1)(c)): tax, accounting, law enforcement requests</>,
            ]} />
          </Section>

          <Section id="third-party" title="4. Third-Party Services — Detailed Disclosures">
            <H3>4.1 Cloudflare (Hosting / Edge Compute)</H3>
            <Ul items={[
              <><strong>Purpose:</strong> Serve the Site, run API requests, protect against abuse</>,
              <><strong>Privacy policy:</strong> <a href="https://www.cloudflare.com/privacypolicy/" style={{ color: 'var(--color-signal)' }}>cloudflare.com/privacypolicy</a></>,
            ]} />

            <H3>4.2 Creem (Merchant of Record — Payments and Tax)</H3>
            <Ul items={[
              <><strong>Identity:</strong> Armitage Labs OÜ (registry code 16977866), Rotermanni 14, Tallinn 10111, Estonia</>,
              <><strong>Role:</strong> Creem is the <strong>merchant of record</strong>. Creem is the legal seller of your purchase and independently handles billing data, VAT/sales tax, and invoicing</>,
              <><strong>Buyer data Creem collects:</strong> name, email, billing address, payment details, order details, device ID, IP address</>,
              <><strong>We receive from Creem:</strong> transaction IDs, product IDs, subscription status, payout amounts. We do not receive your full card number.</>,
              <><strong>Creem Privacy Notice:</strong> <a href="https://www.creem.io/privacy" style={{ color: 'var(--color-signal)' }}>creem.io/privacy</a></>,
              <><strong>Creem support:</strong> support@creem.io</>,
            ]} />

            <H3>4.3 Google Sign-In (Authentication)</H3>
            <Ul items={[
              <><strong>Purpose:</strong> Verify your identity so we can confirm you are a paying user. We use Google OAuth only as a login credential — <strong>we do not store, analyze, or use Google user data for any other purpose</strong>.</>,
              <><strong>Data we receive:</strong> your email address, display name, and a unique Google account ID, used solely to create or sign you into your kdpnichefinder account</>,
              <><strong>Data we do NOT use Google for:</strong> advertising, marketing, user profiling, training of any model, syncing with other Google services, or sharing with any third party</>,
              <><strong>Compliance:</strong> Our use of Google user data complies with the <strong>Google API Services User Data Policy</strong>, including the <strong>Limited Use Requirements</strong></>,
              <><strong>Google OAuth Scopes Used:</strong> <code>openid email profile</code> (the minimum necessary to identify you as a paying user)</>,
            ]} />
          </Section>

          <Section id="cookies" title="5. Cookies and Tracking">
            <P>We use the following categories of cookies:</P>
            <Ul items={[
              <><strong>Strictly necessary:</strong> session security, CSRF protection, Cloudflare edge cookies (no consent required under ePrivacy Directive)</>,
              <><strong>Analytics</strong> (optional, only if enabled): Google Analytics 4 or Plausible — consent required, default off in EU</>,
              <><strong>No marketing or advertising cookies</strong> at this time</>,
            ]} />
            <P>See our <Link href="/cookie-policy" style={{ color: 'var(--color-signal)' }}>Cookie Policy</Link> for details and consent management.</P>
          </Section>

          <Section id="international-transfers" title="6. International Data Transfers">
            <P>We are operated from outside the European Union. Your data may be transferred to and processed in:</P>
            <Ul items={[
              <><strong>United States</strong> (Cloudflare infrastructure, Google LLC, our hosting)</>,
              <><strong>Estonia / European Union</strong> (Creem — Armitage Labs OÜ, for payment data)</>,
              <><strong>European Union</strong> (where Cloudflare edge nodes process requests)</>,
            ]} />
            <P>
              For European users, we rely on <strong>Standard Contractual Clauses (SCCs)</strong> and the <strong>EU-US Data Privacy Framework</strong> (where applicable) for transfers to the United States.
            </P>
          </Section>

          <Section id="retention" title="7. Data Retention">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Data', 'Retention'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', background: 'var(--color-canvas)', borderBottom: '2px solid var(--color-border)', fontWeight: 600, color: 'var(--color-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Account information', 'Until you delete your account + 30 days'],
                  ['Google OAuth profile data', 'Not retained beyond active session — we verify your identity and do not profile'],
                  ['AI analysis history', 'Until you delete your account or the record'],
                  ['Payment / billing data', 'Held by Creem per Creem Privacy Notice'],
                  ['Server logs (Cloudflare)', 'Per Cloudflare default (typically up to 30 days)'],
                  ['Analytics data', 'GA4: 2 months; Plausible: no persistent storage'],
                ].map(([label, value]) => (
                  <TableRow key={label} label={label} value={value} />
                ))}
              </tbody>
            </table>
          </Section>

          <Section id="rights" title="8. Your Rights">
            <H3>8.1 All users</H3>
            <Ul items={[
              <><strong>Access:</strong> request a copy of your personal data</>,
              <><strong>Correction:</strong> update inaccurate data via account settings</>,
              <><strong>Deletion:</strong> delete your account and data</>,
              <><strong>Export:</strong> download your AI analysis history as JSON</>,
            ]} />

            <H3>8.2 European users (GDPR)</H3>
            <Ul items={[
              'Right to restrict processing (Art. 18)',
              'Right to object to processing (Art. 21)',
              'Right to lodge a complaint with your supervisory authority',
            ]} />

            <H3>8.3 California users (CCPA / CPRA)</H3>
            <Ul items={[
              'Right to know what personal information is collected',
              'Right to delete personal information',
              'Right to opt out of &quot;sale or sharing&quot; (<strong>we do not sell your data</strong>)',
              'Right to limit use of sensitive personal information (not applicable — we do not collect sensitive PI)',
            ]} />
            <P>To exercise any of these rights, email <strong>privacy@kdpnichefinder.net</strong>. We respond within 30 days (45 days for CCPA).</P>
          </Section>

          <Section id="children" title="9. Children's Privacy">
            <P>
              The Service is not intended for users under 16 (or older age where your jurisdiction requires). We do not knowingly collect data from children. If you believe we have collected data from a minor, contact <strong>privacy@kdpnichefinder.net</strong> for immediate deletion.
            </P>
          </Section>

          <Section id="security" title="10. Security">
            <P>We implement industry-standard security measures:</P>
            <Ul items={[
              'TLS 1.3 for all data in transit',
              'bcrypt password hashing (for any account credentials we hold)',
              'Cloudflare edge security (DDoS, bot detection)',
              'Principle of least privilege for staff access',
              "Reliance on Creem's PCI-DSS Level 1 payment infrastructure for billing data",
            ]} />
            <P>However, no system is 100% secure. Use a strong, unique password and protect your Google account.</P>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <P>
              We may update this Privacy Policy. We will notify you of material changes by email and/or prominent banner on the Site. Continued use after changes constitutes acceptance.
            </P>
          </Section>

          <Section id="contact" title="12. Contact">
            <Ul items={[
              <><strong>Privacy / General Contact:</strong> privacy@kdpnichefinder.net</>,
              <><strong>Transactions / Refunds:</strong> transaction@kdpnichefinder.net</>,
              <><strong>Payment Processor (Merchant of Record):</strong> Creem — Armitage Labs OÜ, registry code 16977866, Rotermanni 14, Tallinn 10111, Estonia — support@creem.io</>,
            ]} />
            <P>
              For European users: we have not appointed a GDPR Art. 27 EU representative as kdpnichefinder is not systematically targeting EU users. If you are an EU user and require EU-representative contact, write to <strong>privacy@kdpnichefinder.net</strong> and we will respond via the same channel.
            </P>
          </Section>

          <Section id="disclaimer" title="Disclaimer">
            <P>
              KDP Niche Finder is an independent tool. We are <strong>not affiliated with Amazon.com, Inc., Kindle Direct Publishing (KDP), or any third-party tools referenced on the Service</strong>. All trademarks belong to their respective owners.
            </P>
            <P>
              Our AI analysis is provided for <strong>informational purposes only</strong> and does not constitute financial, legal, or business advice.
            </P>
            <P>
              BSR (Best Sellers Rank) and sales estimate data are sourced from publicly available Amazon pages via third-party scraping proxies. Data may be delayed by 24–72 hours and is not guaranteed to be accurate.
            </P>
          </Section>

          {/* Source references */}
          <section style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Source References</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {([
                ['Creem Privacy Notice V2.0', 'creem.io/privacy'],
                ['Creem Merchant Terms of Service V2.0', 'creem.io/terms'],
                ['Creem Buyer Terms of Service V2.0', 'creem.io/buyer-terms'],
                ['Google API Services User Data Policy', 'developers.google.com/terms/api-services-user-data-policy'],
                ['Cloudflare Privacy Policy', 'cloudflare.com/privacypolicy'],
                ['GDPR (EU 2016/679)', 'gdpr-info.eu'],
              ] as [string, string][]).map(([label, url]) => (
                <li key={label} style={{ fontSize: '0.8125rem' }}>
                  <a href={`https://${url}`} style={{ color: 'var(--color-signal)' }} target="_blank" rel="noopener noreferrer">{label}</a>
                  <span style={{ color: 'var(--color-ink-3)', marginLeft: '0.375rem' }}>— {url}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--color-ink-3)', fontStyle: 'italic' }}>
              This policy complies with GDPR, CCPA/CPRA, and Google API Services User Data Policy including Limited Use Requirements. Final wording should be reviewed by a licensed attorney before production deployment.
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
