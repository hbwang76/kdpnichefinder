'use client'

import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    priceUnit: 'forever',
    tagline: 'Try before you buy',
    cta: 'Start Finding Niches — Free Preview',
    ctaHref: '/tools/kdp-niche-finder',
    badge: null,
    features: [
      '1 data-only analysis per day',
      'No signup required to preview',
      'BSR + Trends data (no AI scoring)',
      '12 Amazon marketplaces',
      'Basic niche comparison (up to 3 niches)',
    ],
    limitations: [
      'No AI-powered recommendations',
      'No action plans',
      'No historical analysis',
    ],
    highlight: false,
    planId: 'free',
  },
  {
    name: 'Starter',
    price: { monthly: 9.99, annual: 79 },
    priceUnit: '/mo',
    annualNote: '$6.58/mo billed annually',
    badge: 'Save 34%',
    tagline: 'Perfect for new KDP authors',
    cta: 'Start With Starter — $9.99/mo',
    ctaHref: '/api/billing/checkout',
    features: [
      '3 AI analyses per day (80/month)',
      '5 ranked niche recommendations per analysis',
      'BSR + Trends + Reddit signals',
      '12 Amazon marketplaces',
      'Action plans (3-step)',
      'Email support (48h response)',
    ],
    limitations: [
      'No historical analysis tracking',
      'No CSV export',
    ],
    highlight: false,
    planId: 'starter',
  },
  {
    name: 'Pro',
    price: { monthly: 29.99, annual: 229 },
    priceUnit: '/mo',
    annualNote: '$19.08/mo billed annually',
    badge: 'Save 36%',
    tagline: 'For serious KDP publishers',
    cta: 'Get Pro — $29.99/mo',
    ctaHref: '/api/billing/checkout',
    features: [
      'Unlimited AI analyses per day',
      '5 ranked niche recommendations per analysis',
      'BSR + Trends + Reddit + KDP sales signals',
      '12 Amazon marketplaces',
      'Advanced action plans (5-step)',
      'Historical analysis tracking (30 days)',
      'CSV export',
      'Priority email support (24h)',
    ],
    limitations: [],
    highlight: true,
    planId: 'pro',
  },
]

const creditPacks = [
  { name: 'Credit Mini', credits: 35, price: 4.99, cta: 'Buy 35 Credits — $4.99' },
  { name: 'Credit Standard', credits: 80, price: 9.99, cta: 'Buy 80 Credits — $9.99' },
  { name: 'Credit Large', credits: 270, price: 29.99, cta: 'Buy 270 Credits — $29.99' },
]

async function handleCheckout(planId: string) {
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
      credentials: 'include',
    })
    const data = await res.json()
    if (data.checkout_url) window.location.href = data.checkout_url
  } catch {}
}

export function PricingClient() {
  return (
    <>
      {/* Plan cards */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {plans.map(plan => (
              <div
                key={plan.name}
                style={{
                  background: plan.highlight ? 'var(--color-ink)' : 'var(--color-surface)',
                  border: plan.highlight ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 16,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  position: 'relative',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--color-signal)', color: 'white', padding: '4px 14px', borderRadius: 999,
                    fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: plan.highlight ? 'white' : 'var(--color-ink)' }}>
                    {plan.name}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: plan.highlight ? '#A8A29E' : 'var(--color-ink-2)' }}>{plan.tagline}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: plan.highlight ? 'white' : 'var(--color-ink)' }}>
                      ${plan.price.monthly}
                    </span>
                    <span style={{ color: plan.highlight ? '#A8A29E' : 'var(--color-ink-2)', fontSize: '0.9375rem' }}>{plan.priceUnit}</span>
                  </div>
                  {plan.annualNote && (
                    <p style={{ fontSize: '0.8125rem', color: plan.highlight ? '#A8A29E' : 'var(--color-ink-2)', marginTop: 4 }}>{plan.annualNote}</p>
                  )}
                </div>

                {plan.name === 'Free' ? (
                  <Link href={plan.ctaHref} style={{
                    background: 'var(--color-signal)', color: 'white',
                    padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: '0.9375rem',
                    textDecoration: 'none', textAlign: 'center', display: 'block',
                  }}>
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.planId)}
                    style={{
                      background: 'var(--color-signal)', color: 'white', padding: '12px 20px', borderRadius: 10,
                      fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: 'pointer',
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    {plan.cta}
                  </button>
                )}

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="9" cy="9" r="8" fill={plan.highlight ? '#0F766E' : 'var(--color-pine-tint)'}/>
                        <path d="M5.5 9l2.5 2.5 4-4" stroke={plan.highlight ? 'white' : 'var(--color-pine)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: '0.875rem', color: plan.highlight ? 'white' : 'var(--color-ink-2)' }}>{f}</span>
                    </li>
                  ))}
                  {plan.limitations.map(l => (
                    <li key={l} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="9" cy="9" r="8" fill="#FEF2F2"/>
                        <path d="M11 7l-6 6M5 7l6 6" stroke="var(--color-rust)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span style={{ fontSize: '0.875rem', color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--color-ink-3)' }}>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit packs */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '64px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            Also Available: Credit Packs
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--color-ink-2)', marginBottom: 40 }}>
            One-time purchases. No subscription. Credits never expire.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {creditPacks.map(pack => (
              <div key={pack.name} style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{pack.name}</h3>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-signal)', marginBottom: 4 }}>
                  ${pack.price}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-2)', marginBottom: 16 }}>
                  {pack.credits} credits
                </div>
                <button
                  onClick={() => handleCheckout(pack.name.toLowerCase().replace(' ', '_'))}
                  style={{
                    width: '100%', background: 'var(--color-signal)', color: 'white',
                    padding: '10px 16px', borderRadius: 10, fontWeight: 700,
                    fontSize: '0.875rem', border: 'none', cursor: 'pointer',
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {pack.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--color-canvas)', padding: '64px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
            Pricing FAQ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your account page at any time. Your access continues until the end of your billing period. No cancellation fees.' },
              { q: 'Do unused analyses roll over?', a: 'No. Daily AI analysis limits reset at midnight UTC each day and do not roll over. Monthly credit packs are one-time purchases and never expire.' },
              { q: 'What is a "data-only" analysis?', a: 'Free users get 1 preview per day that shows estimated BSR ranges and seasonal trends without AI-generated recommendations or action plans.' },
              { q: 'How does the 7-day refund work?', a: 'Request a full refund within 7 days of purchase by contacting support. Credit card refunds are processed within 5-7 business days. Used credits are non-refundable.' },
              { q: 'Do I need a credit card to start?', a: 'No. The Free plan requires no credit card. Paid plans and credit packs require a credit card or debit card via our secure payment processor.' },
            ].map((item, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--color-border)', padding: '20px 0' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="var(--color-ink-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem', lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
