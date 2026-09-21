import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'Niche Research Tool — Deep KDP Market Research',
  description: 'Deep KDP niche research combining multiple data signals for comprehensive market analysis. BSR, competition, and trend data all in one place.',
  openGraph: {
    url: 'https://kdpnichefinder.net/tools/niche-research',
    type: 'website',
    siteName: 'KDP Niche Finder',
    images: [{ url: '/assets/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/tools/niche-research' },
}

export default function Page() { return <HomePage /> }
