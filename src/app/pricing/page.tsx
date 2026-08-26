import type { Metadata } from 'next'
import { PricingClient } from '@/components/pricing/PricingClient'

export const metadata: Metadata = {
  title: 'Pricing — KDP Niche Finder Plans from $9.99/mo',
  description: 'Simple pricing for AI-powered KDP niche research. Free preview available. Starter $9.99/mo, Pro $29.99/mo. Cancel anytime, 7-day refund.',
  alternates: { canonical: '/pricing' },
  openGraph: { url: 'https://kdpnichefinder.net/pricing' },
}

export default function PricingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'KDP Niche Finder Pricing',
    description: 'Simple pricing for AI-powered KDP niche research. Free preview, Starter $9.99/mo, Pro $29.99/mo.',
    url: 'https://kdpnichefinder.net/pricing',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Preview',
        price: '0',
        priceCurrency: 'USD',
        description: '1 niche analysis per day, no signup required',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '9.99',
        priceCurrency: 'USD',
        description: '$9.99/month — unlimited analyses, history, action plans',
        availability: 'https://schema.org/InStock',
        url: 'https://kdpnichefinder.net/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '29.99',
        priceCurrency: 'USD',
        description: '$29.99/month — everything in Starter plus priority AI and advanced data',
        availability: 'https://schema.org/InStock',
        url: 'https://kdpnichefinder.net/pricing',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section style={{ background: 'var(--color-canvas)', padding: '80px 48px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 16 }}>
            Pick a plan. Start free. Go further when you're ready.
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-2)' }}>
            Monthly subscriptions only. No hidden fees. Cancel anytime. 7-day refund window on all paid plans.
          </p>
        </div>
      </section>

      <PricingClient />

      <style>{`
        @media (max-width: 768px) {
          section { padding: 48px 16px !important; }
          h1 { font-size: 1.5rem !important; }
        }
      `}</style>
    </>
  )
}
