import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'Niche Score Checker — Validate KDP Niche Viability',
  description: 'Check your KDP niche viability score. Instant feedback on competition, demand, and trend stability with a detailed 0-100 score breakdown report.',
  alternates: { canonical: '/tools/niche-score-checker' },
}

export default function Page() { return <HomePage /> }
