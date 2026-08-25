import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsScripts } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://kdpnichefinder.net'),
  title: {
    default: 'KDP Niche Finder — Find Profitable KDP Niches in 30 Seconds',
    template: '%s | KDP Niche Finder',
  },
  description:
    'AI-powered niche research tool for KDP authors. Input an idea, get 5 ranked niches with BSR, competition scores, and action plans in 30 seconds.',
  keywords: ['KDP niche finder', 'Kindle niche research', 'KDP Amazon research tool', 'book niche finder'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kdpnichefinder.net',
    siteName: 'KDP Niche Finder',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kdpnichefinder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <AnalyticsScripts />
      </body>
    </html>
  )
}
