import type { Metadata } from 'next'
import { HomeClient } from '@/components/HomeClient'

export const metadata: Metadata = {
  title: 'KDP Niche Finder — Find Profitable Amazon KDP Niches with AI',
  description:
    'AI-powered niche research for KDP authors. Find low-competition, high-demand book ideas with estimated BSR, competition scores, and action plans.',
  alternates: { canonical: 'https://kdpnichefinder.net' },
  openGraph: {
    title: 'KDP Niche Finder — Find Profitable Amazon KDP Niches with AI',
    description: 'AI-powered niche research for KDP authors. Find low-competition book ideas, compare demand signals, and get practical next steps with a free preview.',
    type: 'website',
    url: 'https://kdpnichefinder.net',
    siteName: 'KDP Niche Finder',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KDP Niche Finder',
    description: 'AI-powered niche research tool for KDP self-publishers. Input a book idea, get 5 ranked niches with BSR, competition scores, and action plans in 30 seconds.',
    url: 'https://kdpnichefinder.net',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free preview — 1 analysis per day without signup',
    },
    provider: {
      '@type': 'Organization',
      name: 'KDP Niche Finder',
      url: 'https://kdpnichefinder.net',
    },
  }

  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KDP Niche Finder',
    description: 'AI-powered niche research tool for KDP self-publishers. Input a book idea, get 5 ranked niches with BSR, competition scores, and action plans in 30 seconds.',
    url: 'https://kdpnichefinder.net',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '29.99',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    provider: {
      '@type': 'Organization',
      name: 'KDP Niche Finder',
      url: 'https://kdpnichefinder.net',
    },
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KDP Niche Finder',
    url: 'https://kdpnichefinder.net',
    description: 'AI-powered niche research for KDP authors',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kdpnichefinder.net/tools/kdp-niche-finder?query={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <HomeClient />
    </>
  )
}
