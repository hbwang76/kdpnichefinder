import type { Metadata } from 'next'
import Link from 'next/link'
import AccountContent from './account-content'

export const metadata: Metadata = {
  title: 'Your Account — KDP Niche Finder',
  description: 'Manage your KDP Niche Finder account, view your subscription, and purchase credits.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: true },
  openGraph: { url: 'https://kdpnichefinder.net/account' },
}

export default function AccountPage() {
  return <AccountContent />
}
