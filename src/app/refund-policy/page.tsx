import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'KDP Niche Finder refund policy. Net refund (actual paid amount after platform fees) within 7 days for first-time monthly subscribers, 14-day pro-rata for annual plans, unused credit refund within 7 days.',
  alternates: { canonical: '/refund-policy' },
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

function Ol({ items }: { items: React.ReactNode[] }) {
  return (
    <ol style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '0.9375rem', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>{item}</li>
      ))}
    </ol>
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

export default function RefundPolicyPage() {
  return (
    <div style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '64px 48px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--color-signal)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>← Back to KDP Niche Finder</Link>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>
            Refund Policy
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-ink-2)' }}>
            <span><strong>Last updated:</strong> 2026-08-25</span>
            <span><strong>Effective date:</strong> 2026-08-25</span>
            <span><strong>Refund Contact:</strong> transaction@kdpnichefinder.net</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '56px 48px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          <Section id="overview" title="1. Overview">
            <P>
              This Refund Policy applies to purchases of KDP Niche Finder (&quot;the Service&quot;) made through <strong>Creem</strong> (Armitage Labs OÜ), our Merchant of Record.
            </P>
            <P>
              Because Creem is the <strong>merchant of record</strong>, your payment transaction is with Creem, not directly with kdpnichefinder. However, <strong>kdpnichefinder</strong> handles all customer-service interactions regarding refunds, in coordination with Creem.
            </P>
            <P>
              To request a refund, email <strong>transaction@kdpnichefinder.net</strong> with your order ID (visible in your Creem Customer Portal receipt).
            </P>
          </Section>

          <Section id="windows" title="2. Refund Windows by Plan">
            <DocTable
              headers={['Plan', 'Initial Charge Refund', 'Renewal Refund', 'Notes']}
              rows={[
                ['Free ($0)', 'N/A', 'N/A', 'No charge'],
                ['Starter Monthly ($9.99/mo)', '7 days, net refund (first-time subscribers)', 'Non-refundable after 7 days', 'See §3.1'],
                ['Starter Annual ($79/yr)', '14 days, pro-rata refund (first-time, <100 AI runs)', 'Non-refundable after 14 days', 'See §3.4'],
                ['Pro Monthly ($29.99/mo)', '7 days, net refund (first-time subscribers)', 'Non-refundable after 7 days', 'See §3.1'],
                ['Pro Annual ($229/yr)', '14 days, pro-rata refund (first-time, <100 AI runs)', 'Non-refundable after 14 days', 'See §3.4'],
                ['Credit Mini ($4.99)', '7 days, net refund (if unused)', 'Non-refundable', 'See §3.5'],
                ['Credit Standard ($9.99)', '7 days, net refund (if unused)', 'Non-refundable', 'See §3.5'],
              ]}
            />
            <P>
              <strong>Why these terms exist:</strong> Subscription products provide ongoing access to AI tooling that consumes compute cost with each use. The refund windows balance consumer protection with the irreversible AI compute consumption. EU/EEA consumers retain additional statutory rights under §3.3 below.
            </P>
          </Section>

          <Section id="rules" title="3. Detailed Refund Rules">
            <H3>3.1 First-time monthly subscribers — 7-day net refund</H3>
            <P>
              If you are a <strong>first-time</strong> monthly subscriber (Starter or Pro) and you request a refund <strong>within 7 days of the initial charge</strong>, we will issue a <strong>net refund</strong> to your original payment method.
            </P>
            <P>
              <strong>Refund amount = the actual payment amount you paid, minus any platform / payment-processor fees retained by Creem and/or the card network.</strong> In practice, this means you receive back the net amount that was actually received by us after platform fees, not the gross charge shown on your card statement. Because Creem is our Merchant of Record, the exact refund amount depends on the platform fees deducted at the time of the original transaction; we do not refund fees that were retained by the payment platform.
            </P>
            <P>
              The refund will be processed via Creem within 5–10 business days. Creem will remit the net refund to your original payment method.
            </P>

            <H3>3.2 Subsequent renewals — non-refundable</H3>
            <P>
              After the initial 7-day window, <strong>monthly subscription renewals are non-refundable</strong>. You may cancel at any time to prevent future charges, but the current billing period is not refunded. Cancellation takes effect at the end of the current billing cycle.
            </P>

            <H3>3.3 EU / EEA consumers — statutory withdrawal right</H3>
            <P>
              If you are an <strong>EU/EEA consumer</strong>, the <strong>EU Consumer Rights Directive 2011/83/EU</strong> normally grants you a 14-day right of withdrawal from a digital service contract.
            </P>
            <P>
              <strong>However</strong>, under <strong>CRD Art. 16(m)</strong>, you <strong>lose this withdrawal right</strong> once the digital content/service has been <strong>fully performed</strong> with your <strong>express consent</strong> and <strong>acknowledgement</strong> that you thereby waive your withdrawal right.
            </P>
            <P>
              By purchasing a subscription and using the AI features during the withdrawal period, you expressly consent to immediate performance and acknowledge that you waive your 14-day withdrawal right once the AI service has been delivered to you.
            </P>
            <P>
              <strong>Exception for annual plans:</strong> If you have <strong>not</strong> used any AI features during the first 14 days of an annual subscription, you may still exercise your EU withdrawal right within those 14 days. Contact transaction@kdpnichefinder.net to exercise this right.
            </P>

            <H3>3.4 Annual subscribers — 14-day pro-rata refund</H3>
            <P>
              First-time <strong>annual subscribers</strong> (Starter or Pro) may request a <strong>pro-rata refund</strong> within <strong>14 days of the initial charge</strong>, subject to:
            </P>
            <Ul items={[
              'You have <strong>not exceeded 100 AI runs</strong> during those 14 days',
              <>The refund amount = (net annual fee received, after platform fees) × (unused full months remaining / 12). Platform / payment-processor fees retained by Creem and/or the card network at the time of the original transaction are <strong>not refunded</strong>.</>,
            ]} />
            <P>
              After the 14-day window, annual renewals are non-refundable.
            </P>

            <H3>3.5 Credit Packs — unused-credit refund within 7 days</H3>
            <P>
              Credit Pack purchases (Credit Mini / Credit Standard) are <strong>one-time purchases, not subscriptions</strong>. If <strong>no credits have been used</strong> within 7 days of purchase, you may request a <strong>net refund</strong> — that is, the actual payment amount you paid minus any platform / payment-processor fees retained by Creem and/or the card network at the time of the original transaction. Once any credit is consumed, the pack is non-refundable (except as required by mandatory consumer protection law).
            </P>
          </Section>

          <Section id="how-to" title="4. How to Cancel or Request a Refund">
            <H3>4.1 Cancel a subscription</H3>
            <P>
              You can cancel your subscription at any time through the <strong>Creem Customer Portal</strong> (you will receive a link via email after purchase).
            </P>
            <P>
              Cancellation stops future renewals but does not refund the current period (see §3.2, §3.4).
            </P>

            <H3>4.2 Request a refund</H3>
            <P>
              Email <strong>transaction@kdpnichefinder.net</strong> with:
            </P>
            <Ol items={[
              'The email address on your account',
              'Your Creem order ID (found in your purchase receipt)',
              'The plan and reason for the refund request',
            ]} />
            <P>
              We will respond within <strong>5 business days</strong> and process approved refunds via Creem within <strong>5–10 business days</strong> to your original payment method.
            </P>
          </Section>

          <Section id="chargebacks" title="5. Chargebacks and Disputes">
            <P>
              If you have an issue with your purchase, please contact us first at <strong>transaction@kdpnichefinder.net</strong> so we can resolve it. Filing a chargeback without contacting us may result in account suspension while we investigate.
            </P>
            <P>
              For purchases made via Creem, you may also contact Creem directly at <strong>support@creem.io</strong>.
            </P>
          </Section>

          <Section id="consumer-rights" title="6. Consumer Rights (Non-Waivable)">
            <P>
              Nothing in this policy is intended to <strong>waive any non-waivable consumer rights</strong> you have under the laws of your jurisdiction, including:
            </P>
            <Ul items={[
              <><strong>EU Consumer Rights Directive 2011/83/EU</strong> (right of withdrawal, subject to §3.3)</>,
              <><strong>UK Consumer Rights Act 2015</strong></>,
              <><strong>California consumer protection laws</strong></>,
              'Any other applicable mandatory local consumer protection law',
            ]} />
            <P>
              If a court or competent authority finds that any provision of this Refund Policy conflicts with a non-waivable consumer right, that consumer right shall prevail.
            </P>
          </Section>

          <Section id="contact" title="7. Contact">
            <Ul items={[
              <><strong>Refund / Cancellation Requests:</strong> transaction@kdpnichefinder.net</>,
              <><strong>General Support:</strong> privacy@kdpnichefinder.net</>,
              <><strong>Payment Processor:</strong> Creem — Armitage Labs OÜ, Rotermanni 14, Tallinn 10111, Estonia — support@creem.io</>,
            ]} />
          </Section>

          {/* Source references */}
          <section style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Source References</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {([
                ['Creem Merchant Terms of Service V2.0', 'creem.io/terms'],
                ['Creem Buyer Terms of Service V2.0', 'creem.io/buyer-terms'],
                ['EU Consumer Rights Directive 2011/83/EU', 'eur-lex.europa.eu/eli/dir/2011/83/oj'],
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
