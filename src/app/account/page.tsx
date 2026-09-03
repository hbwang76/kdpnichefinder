import type { Metadata } from 'next'
import Link from 'next/link'
import AccountContent from './account-content'

export const metadata: Metadata = {
  title: 'Your Account — KDP Niche Finder',
  description: 'Manage your KDP Niche Finder account, view your subscription plan, purchase credits, and access your full niche analysis history in one place.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: true },
  openGraph: { url: 'https://kdpnichefinder.net/account' },
}

export default function AccountPage() {
  return <AccountContent />
}
