import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'AI KDP Niche Finder — GPT-Powered Niche Research',
  description: 'AI-powered niche research for KDP authors. Get GPT-scored niches with BSR, competition analysis, and step-by-step action plans in 30 seconds.',
  alternates: { canonical: '/tools/ai-kdp-niche-finder' },
}

export default function Page() { return <HomePage /> }
