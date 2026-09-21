import type { Metadata } from 'next'
import TermsOfServicePage from '../terms-of-service/page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using KDP Niche Finder. Governed by the laws of the Republic of Estonia. Read our complete terms of service right now.',
  openGraph: {
    url: 'https://kdpnichefinder.net/terms',
    type: 'website',
    siteName: 'KDP Niche Finder',
    images: [{ url: '/assets/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/terms' },
}

export default TermsOfServicePage
