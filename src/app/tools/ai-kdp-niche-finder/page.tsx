import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'AI KDP Niche Finder — Fast Rankings',
  description: 'Find KDP niches ranked by BSR, competition, and demand signals. Get 5 ranked niches with step-by-step action plans. Free preview, no signup needed.',
  openGraph: { url: 'https://kdpnichefinder.net/tools/ai-kdp-niche-finder' },
  alternates: { canonical: '/tools/ai-kdp-niche-finder' },
}

export default function Page() { return <HomePage /> }
