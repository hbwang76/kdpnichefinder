'use client'

import Link from 'next/link'

async function handleCheckout(planId: string) {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: planId }),
    credentials: 'include',
  })
  if (res.status === 401) {
    window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname)
    return
  }
  const data = await res.json()
  if (data.checkout_url) {
    window.location.href = data.checkout_url
  } else {
    alert(data.error || 'Checkout failed. Please try again.')
  }
}

export function PricingClient() {
  return (
    <>
      {/* Billing selector */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
          <button style={{
            background: 'var(--color-surface)', border: '2px solid var(--color-signal)', borderRadius: 12,
            padding: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
          }}>
            <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Monthly — Pay as you go</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="var(--color-signal)"/>
              <path d="M6.5 10l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12,
            padding: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Annual — Save up to 36%</span>
              <span style={{ background: 'rgba(15,118,110,0.1)', color: 'var(--color-pine)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best value</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="var(--color-border)" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 64 }}>

            {/* Free */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--color-ink)' }}>Free</h3>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>$0 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-2)' }}>forever</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 16, flexGrow: 1 }}>Preview the data before you upgrade.</p>
              <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }}></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                {['1 data-only analysis per day','No signup required to preview','BSR + Trends data (no AI scoring)','12 Amazon marketplaces','Basic niche comparison (up to 3 niches)'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="var(--color-ink-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: 'var(--color-ink-2)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/tools/kdp-niche-finder" style={{
                width: '100%', background: 'transparent', border: '1px solid var(--color-ink)', color: 'var(--color-ink)',
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                textDecoration: 'none', textAlign: 'center', display: 'block', fontFamily: "'Manrope', sans-serif",
              }}>
                Start Finding Niches — Free Preview
              </Link>
            </div>

            {/* Starter */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--color-ink)' }}>Starter</h3>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>$9.99<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-2)' }}>/mo</span></div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: 'var(--color-ink-2)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                or $79/yr ($6.58/mo) <span style={{ background: 'rgba(15,118,110,0.1)', color: 'var(--color-pine)', padding: '2px 6px', borderRadius: 4 }}>Save 34%</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 16, flexGrow: 1 }}>See what to write before you write it.</p>
              <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }}></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                {['3 AI analyses per day (80/month)','5 ranked niche recommendations per analysis','BSR + Trends + Reddit signals','Action plans (3-step)','Email support (48h response)'].map((f, i) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="8" cy="8" r="7" fill="rgba(234,88,12,0.1)"/>
                      <path d="M4.5 8l2.5 2.5 4-4" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: 'var(--color-ink-2)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('starter_monthly')} style={{
                width: '100%', background: 'transparent', border: '2px solid var(--color-signal)', color: 'var(--color-signal)',
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
              }}>
                Start With Starter — $9.99/mo
              </button>
            </div>

            {/* Pro */}
            <div style={{ background: '#FFF1E8', border: '2px solid var(--color-signal)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-signal)', color: 'white', padding: '4px 12px', borderRadius: '0 10px 0 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Recommended</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--color-signal)' }}>Pro</h3>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>$29.99<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-2)' }}>/mo</span></div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: 'var(--color-ink-2)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                or $229/yr ($19.08/mo) <span style={{ background: 'rgba(15,118,110,0.1)', color: 'var(--color-pine)', padding: '2px 6px', borderRadius: 4 }}>Save 36%</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 16, flexGrow: 1 }}>For KDP authors running this like a business.</p>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', margin: '16px 0', opacity: 0.5 }}></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                {[
                  '9 AI analyses per day (270/month)',
                  '5 ranked niche recommendations per analysis',
                  'Historical analysis tracking',
                  'Priority email support (24h response)',
                  'Action plans (5-step, detailed)',
                  'CSV export',
                  'Niche comparison (up to 50 niches per analysis)',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4l-3.6 1.9.7-4L2.2 6.2l4-.6z" fill="var(--color-signal)"/>
                    </svg>
                    <span style={{ color: 'var(--color-ink-2)', fontWeight: 500 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('pro_monthly')} style={{
                width: '100%', background: 'var(--color-signal)', color: 'white',
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                border: 'none', cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
              }}>
                Get Pro — $29.99/mo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packs */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 80px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>Ran out of daily analyses? Grab a credit pack.</h2>
            <p style={{ color: 'var(--color-ink-2)', fontSize: '1rem' }}>Credit Packs never expire. Use them to top up Starter or Pro when you run out of daily analyses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 700, margin: '0 auto' }}>

            {/* Credit Mini */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-ink)' }}>Credit Mini</h3>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-signal)' }}>
                $4.99 <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-ink-2)' }}>35 credits · $0.14 per analysis</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>35 credits · ~$0.14 per analysis · Expires in 6 months</p>
              <button onClick={() => handleCheckout('credit_mini')} style={{
                width: '100%', background: 'transparent', border: '1px solid var(--color-ink)', color: 'var(--color-ink)',
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif", marginTop: 'auto',
              }}>
                Buy 35 Credits — $4.99
              </button>
            </div>

            {/* Credit Standard */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-ink)' }}>Credit Standard</h3>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-signal)' }}>
                $9.99 <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-ink-2)' }}>80 credits · $0.125 per analysis</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)' }}>80 credits · ~$0.12 per analysis · Expires in 12 months</p>
              <button onClick={() => handleCheckout('credit_standard')} style={{
                width: '100%', background: 'transparent', border: '1px solid var(--color-ink)', color: 'var(--color-ink)',
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif", marginTop: 'auto',
              }}>
                Buy 80 Credits — $9.99
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: 'var(--color-surface)', padding: '0 48px 80px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 24 }}>Compare plans</h2>
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Feature','Free','Starter','Pro','Credit Mini','Credit Standard'].map((h, i) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 16px 8px 0', fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-2)',
                      fontWeight: 500, background: i === 3 ? '#FFF1E8' : 'transparent',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {[
                  ['Monthly price', '$0', '$9.99/mo or $79/yr', '$29.99/mo or $229/yr', '$4.99 one-time', '$9.99 one-time'],
                  ['AI analyses per day', '0', '3', '9', '—', '—'],
                  ['Data-only analyses per day', '1', '—', '—', '—', '—'],
                  ['Credits included', '—', '—', '—', '35', '80'],
                  ['Action plans', '—', '3-step', '5-step detailed', '—', '—'],
                  ['Historical tracking', '—', '—', '✓', '—', '—'],
                  ['CSV export', '—', '—', '✓', '—', '—'],
                  ['Niche comparison', '3 niches', '10 niches', '50 per analysis', '—', '—'],
                  ['Amazon marketplaces', '12', '12', '12', '12', '12'],
                  ['Support', 'Docs + Community', 'Email (48h)', 'Priority email (24h)', '—', '—'],
                  ['Refund window', '—', '7 days', '7 days', '—', '—'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 10 ? '1px solid var(--color-border)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '12px 16px 12px 0', color: 'var(--color-ink-2)', fontWeight: j === 0 ? 400 : 600,
                        background: j === 3 ? '#FFF1E8' : 'transparent',
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Pro */}
      <section style={{ background: 'var(--color-surface)', padding: '0 48px 80px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 24 }}>Why Pro over free KDP tools</h2>
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Tool','Price','KDP focus','AI action plan'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 16px 8px 0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-2)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Helium 10','$37+/mo','FBA first, KDP secondary','—'],
                  ['Publisher Rocket','$199 one-time','KDP-only, research only','—'],
                  ['Book Beam','$69 one-time','KDP + niche scoring','—'],
                  ['Book Bolt','$9.99/mo','Puzzle book focus','—'],
                  ['Free KDP tools (KDPEasy, KDPTools.io)','Free','Basic calculators','—'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {row.map((cell, j) => <td key={j} style={{ padding: '12px 16px 12px 0', color: 'var(--color-ink-2)', fontFamily: j === 1 ? "'IBM Plex Mono', monospace" : "'Manrope', sans-serif", fontSize: '0.875rem' }}>{cell}</td>)}
                  </tr>
                ))}
                <tr style={{ background: '#FFF1E8' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem' }}>KDP Niche Finder Pro</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.875rem', fontWeight: 600 }}>$29.99/mo</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem' }}>KDP-first</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-pine)', fontWeight: 600, fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem' }}>✓ 5-step plan per niche</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginTop: 16 }}>Prices from public pricing pages, checked 2026-08-17. No brand partnerships.</p>
          </div>
        </div>
      </section>

      {/* Refund + AI */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 16 }}>Refund & cancellation</h2>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 20, listStyle: 'disc' }}>
              <li><strong>7-day refund window.</strong> New Starter and Pro subscriptions can be canceled within 7 days for a full refund. See our refund policy.</li>
              <li><strong>Cancel anytime.</strong> Cancel from your account page — no email or phone call required. Your subscription stays active until the end of the current billing period.</li>
              <li><strong>Credit Packs are non-refundable once any credits have been used.</strong> Unused Credit Packs can be refunded within 14 days of purchase.</li>
              <li><strong>30-day notice for price changes.</strong> If we change pricing, we'll email you at least 30 days before the change applies to your subscription.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 16 }}>About AI-generated content</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', marginBottom: 12, lineHeight: 1.6 }}>All niche recommendations, scores, and action plans on KDP Niche Finder are generated by artificial intelligence (OpenAI's GPT models and Anthropic's Claude). AI outputs may contain errors and are provided for informational purposes only. They do not constitute financial, legal, tax, or business advice.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>Revenue estimates and sales projections are based on historical Best Sellers Rank data and statistical modeling. Actual Amazon sales performance depends on many factors outside our control and may differ significantly from our estimates — including the possibility of zero revenue. We do not guarantee any specific earnings.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--color-canvas)', padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 40, textAlign: 'center' }}>Pricing FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { q: 'Can I try KDP Niche Finder before paying?', a: 'Yes. The Free tier gives 1 data-only analysis per day with no signup required. You can preview the tool, see how scoring works, and decide whether Starter or Pro is right for you.' },
              { q: 'What happens if I exceed my daily analysis limit?', a: 'Starter users can buy Credit Mini ($4.99 / 35 credits) or Credit Standard ($9.99 / 80 credits) to keep going without waiting for the next day\'s reset. Unused daily analyses do not roll over.' },
              { q: 'Can I switch between Monthly and Annual?', a: 'Yes. You can switch at any time. If you switch from Monthly to Annual, the change applies at the start of your next billing cycle. Annual plans are billed once and renew automatically — we\'ll email you 7 days before renewal.' },
              { q: 'Do Credit Packs expire?', a: 'Credit Mini expires 6 months from purchase. Credit Standard expires 12 months from purchase.' },
              { q: 'Can I get a refund?', a: 'New Starter and Pro subscriptions can be canceled within 7 days for a full refund. See our refund policy for details.' },
            ].map((item, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--color-border)', padding: '20px 0' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-ink)' }}>
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="var(--color-ink-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <p style={{ color: 'var(--color-ink-2)', fontSize: '0.9375rem', lineHeight: 1.6, marginTop: 12, marginBottom: 0, fontFamily: "'Manrope', sans-serif" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
