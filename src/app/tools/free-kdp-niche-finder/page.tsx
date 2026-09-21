import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'Free KDP Niche Finder — No Sign-up Required',
  description: 'Free KDP niche finder with no sign-up required. Get data-only niche previews instantly with BSR estimates and competition scores for each niche.',
  openGraph: {
    url: 'https://kdpnichefinder.net/tools/free-kdp-niche-finder',
    type: 'website',
    siteName: 'KDP Niche Finder',
    images: [{ url: '/assets/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/tools/free-kdp-niche-finder' },
}

export default function Page() { return <HomePage /> }
