import type { Metadata } from 'next'
import PrivacyPolicyPage from '../privacy-policy/page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How KDP Niche Finder collects, uses, and protects your personal information. GDPR and CCPA compliant. Read our full privacy policy here today.',
  openGraph: {
    url: 'https://kdpnichefinder.net/privacy',
    type: 'website',
    siteName: 'KDP Niche Finder',
    images: [{ url: '/assets/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/privacy' },
}

export default PrivacyPolicyPage
