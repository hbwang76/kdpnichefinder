import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'KDP Niche Finder — AI-Powered Niche Research Tool',
  description: 'Find profitable KDP niches with AI scoring, estimated BSR, competition analysis, and action plans. Free preview available.',
  alternates: { canonical: '/tools/kdp-niche-finder' },
}

export default function ToolPage() {
  return <HomePage />
}
