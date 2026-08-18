import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getAllSlugs, getRelatedPosts, blogPosts } from '@/lib/blog-data'
import { BlogPostClient } from '@/components/blog/BlogPostClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.meta,
    keywords: [post.mainKeyword],
    openGraph: {
      title: post.h1,
      description: post.meta,
      type: 'article',
      url: post.canonical,
      siteName: 'KDP Niche Finder',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.h1,
      description: post.meta,
    },
    alternates: {
      canonical: post.canonical,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(slug, 3)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.h1,
    description: post.meta,
    dateModified: post.lastUpdated,
    author: { '@type': 'Organization', name: 'KDPNicheFinder Team' },
    publisher: { '@type': 'Organization', name: 'KDPNicheFinder', url: 'https://kdpnichefinder.net' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.canonical },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  )
}
