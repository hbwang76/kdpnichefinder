import type { Metadata } from 'next'
import TermsOfServicePage from '../terms-of-service/page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using KDP Niche Finder. Governed by the laws of the Republic of Estonia.',
  alternates: { canonical: '/terms' },
}

export default TermsOfServicePage
