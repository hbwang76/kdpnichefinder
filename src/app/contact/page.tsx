import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — KDP Niche Finder',
  description: 'Get in touch with the KDP Niche Finder team. We respond within 48 hours on business days.',
  alternates: { canonical: '/contact' },
  openGraph: { url: 'https://kdpnichefinder.net/contact' },
}

export default function ContactPage() {
  return (
    <section style={{ background: 'var(--color-canvas)', padding: '64px 48px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Get in Touch</h1>
        <p style={{ textAlign: 'center', color: 'var(--color-ink-2)', fontSize: '1.0625rem', marginBottom: 40 }}>
          Questions, feedback, or support requests — we respond within 48 hours on business days.
        </p>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 32 }}>
          <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}>
            Email: <strong>support@kdpnichefinder.net</strong>
          </p>
          <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.6, marginTop: 12 }}>
            We typically respond within 48 hours on business days (Monday–Friday, UTC).
          </p>
          <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.6, marginTop: 12 }}>
            For billing and subscription inquiries, please include your account email address.
          </p>
        </div>
      </div>
    </section>
  )
}
