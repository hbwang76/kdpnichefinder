import type { Metadata } from 'next'
import HomePage from '../../page'

export const metadata: Metadata = {
  title: 'Free KDP Niche Finder — No Sign-up Required',
  description: 'Free KDP niche finder with no sign-up required. Get data-only niche previews instantly with BSR estimates and competition scores for each niche.',
  alternates: { canonical: '/tools/free-kdp-niche-finder' },
}

export default function Page() { return <HomePage /> }
