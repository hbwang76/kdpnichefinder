import type { Metadata } from 'next'
import PrivacyPolicyPage from '../privacy-policy/page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How KDP Niche Finder collects, uses, and protects your personal information. GDPR and CCPA compliant.',
  alternates: { canonical: '/privacy' },
}

export default PrivacyPolicyPage
