import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — KDP Niche Finder',
  description: 'Answers to common questions about KDP Niche Finder: pricing, data sources, AI accuracy, refunds, and account access.',
  alternates: { canonical: '/faq' },
  openGraph: { url: 'https://kdpnichefinder.net/faq' },
}

const faqs = [
  { q: 'How accurate is the niche data?', a: 'All data is estimated based on publicly available information. BSR figures, revenue estimates, and competition ratings are approximations — not exact figures. We clearly label everything as "estimated." We do not have access to Amazon internal sales data.' },
  { q: 'Do I need an Amazon account to use this?', a: 'No. KDP Niche Finder is completely independent of Amazon. You do not need a KDP account to use the tool, though having one makes it easier to act on the recommendations.' },
  { q: 'How does the free preview work?', a: 'Free users get 1 data-only analysis per 24 hours without creating an account. This preview shows estimated BSR ranges and seasonal trends. AI-powered recommendations and action plans require a paid subscription.' },
  { q: 'What is the difference between Starter and Pro?', a: 'Starter includes 80 AI analyses per month with basic action plans. Pro adds unlimited daily analyses, advanced 5-step action plans, historical tracking (30 days), CSV export, and priority email support.' },
  { q: 'Are credit packs separate from subscriptions?', a: 'Yes. Credit packs are one-time purchases that do not expire. They are for users who prefer pay-as-you-go without a monthly subscription. Credits can be purchased alongside a subscription or independently.' },
  { q: 'What marketplaces are supported?', a: 'KDP Niche Finder covers 12 Amazon marketplaces including US, UK, CA, AU, DE, FR, IT, ES, NL, JP, MX, and BR.' },
  { q: 'Is my data private?', a: 'Yes. We do not sell or share your data. Your analyses are stored securely and are only accessible to you. See our Privacy Policy for full details.' },
  { q: 'How do refunds work?', a: 'Request a net refund (actual paid amount minus platform/payment-processor fees retained by Creem) within 7 days of purchase by emailing transaction@kdpnichefinder.net. Card refunds are processed within 5–10 business days. Used credits are non-refundable. Unused credit packs qualify for a refund within 7 days of purchase. See the full Refund Policy for details.' },
]

export default function FAQPage() {
  return (
    <section style={{ background: 'var(--color-canvas)', padding: '64px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: 40, textAlign: 'center' }}>Frequently Asked Questions</h1>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((item, i) => (
            <details key={i} style={{ borderBottom: '1px solid var(--color-border)', padding: '24px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                {item.q}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M5 8l5 5 5-5" stroke="var(--color-ink-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </summary>
              <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.7, marginTop: 16, fontSize: '0.9375rem', marginBottom: 0 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
