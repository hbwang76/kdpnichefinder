import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'Niche Research Tool — Deep KDP Market Research',
  description: 'Deep KDP niche research combining multiple data signals for comprehensive market analysis.',
  alternates: { canonical: '/tools/niche-research' },
}

export default function Page() { return <HomePage /> }
