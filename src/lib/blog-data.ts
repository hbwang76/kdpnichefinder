export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  type: 'T1.4' | 'T2' | 'T3'
  tools?: string
}

export const blogPosts: BlogPost[] = [
  // T1.4 - Flagship
  { slug: 'best-kdp-niches-2026', title: 'Best KDP Niches 2026', description: 'Top profitable KDP niches for 2026 with estimated data.', date: '2026-01-15', readTime: '12 min', category: 'Niche Research', type: 'T1.4' },
  { slug: 'low-content-niches-2026', title: 'Low Content Niches 2026', description: 'Top low content book niches for KDP authors in 2026.', date: '2026-01-10', readTime: '10 min', category: 'Niche Research', type: 'T1.4' },
  // T2 - Niche guides
  { slug: 'coloring-book-niches', title: 'Coloring Book Niches', description: 'Best coloring book niches for KDP in 2026.', date: '2026-01-08', readTime: '8 min', category: 'Niche Research', type: 'T2' },
  { slug: 'journal-niches', title: 'Journal Niches', description: 'Top journal and diary niches for KDP authors.', date: '2026-01-06', readTime: '8 min', category: 'Niche Research', type: 'T2' },
  { slug: 'puzzle-book-niches', title: 'Puzzle Book Niches', description: 'Best puzzle book niches for KDP.', date: '2026-01-04', readTime: '7 min', category: 'Niche Research', type: 'T2' },
  { slug: 'workbook-niches', title: 'Workbook Niches', description: 'Top workbook niches for educational KDP books.', date: '2026-01-02', readTime: '8 min', category: 'Niche Research', type: 'T2' },
  { slug: 'planner-niches', title: 'Planner Niches', description: 'Best planner and organization book niches for KDP.', date: '2025-12-28', readTime: '9 min', category: 'Niche Research', type: 'T2' },
  { slug: 'cookbook-niches', title: 'Cookbook Niches', description: 'Top cookbook and recipe book niches for KDP.', date: '2025-12-20', readTime: '10 min', category: 'Niche Research', type: 'T2' },
  { slug: 'fiction-niches', title: 'Fiction Niches', description: 'Most profitable fiction book niches for KDP self-publishers.', date: '2025-12-15', readTime: '11 min', category: 'Niche Research', type: 'T2' },
  { slug: 'nonfiction-niches', title: 'Nonfiction Niches', description: 'Top nonfiction niches for KDP authors.', date: '2025-12-10', readTime: '10 min', category: 'Niche Research', type: 'T2' },
  // T3 - Tool alternatives
  { slug: 'publisher-rocket-alternative', title: 'Publisher Rocket Alternative', description: 'Best Publisher Rocket alternatives for KDP niche research.', date: '2025-12-05', readTime: '9 min', category: 'Alternatives', type: 'T3', tools: 'Publisher Rocket' },
  { slug: 'book-bolt-alternative', title: 'Book Bolt Alternative', description: 'Top Book Bolt alternatives for KDP niche research.', date: '2025-11-28', readTime: '8 min', category: 'Alternatives', type: 'T3', tools: 'Book Bolt' },
  { slug: 'helium-10-alternative-kdp', title: 'Helium 10 Alternative for KDP', description: 'Best Helium 10 alternatives specifically for KDP niche research.', date: '2025-11-20', readTime: '9 min', category: 'Alternatives', type: 'T3', tools: 'Helium 10' },
  { slug: 'bookbeam-alternative', title: 'Book Beam Alternative', description: 'Top BookBeam alternatives for KDP authors.', date: '2025-11-15', readTime: '8 min', category: 'Alternatives', type: 'T3', tools: 'BookBeam' },
  { slug: 'free-publisher-rocket', title: 'Free Publisher Rocket Alternatives', description: 'Best free Publisher Rocket alternatives for KDP niche research.', date: '2025-11-10', readTime: '7 min', category: 'Alternatives', type: 'T3' },
]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return blogPosts.map(p => p.slug)
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = blogPosts.find(p => p.slug === currentSlug)
  if (!current) return []
  return blogPosts
    .filter(p => p.slug !== currentSlug && (p.category === current.category || p.type === current.type))
    .slice(0, count)
}
