import type { Metadata } from 'next'
import { HomeClient } from '@/components/HomeClient'

export const metadata: Metadata = {
  title: 'KDP Niche Finder — Find Profitable Amazon KDP Niches with AI',
  description:
    'AI-powered niche research for KDP authors. Find low-competition, high-demand book ideas with estimated BSR, competition scores, and action plans — free preview, no signup required.',
  alternates: { canonical: 'https://kdpnichefinder.net' },
  openGraph: {
    title: 'KDP Niche Finder — Find Profitable Amazon KDP Niches with AI',
    description: 'AI-powered niche research for KDP authors. Free preview, no signup required.',
    type: 'website',
    url: 'https://kdpnichefinder.net',
    siteName: 'KDP Niche Finder',
  },
}

export default function HomePage() {
  return <HomeClient />
}
