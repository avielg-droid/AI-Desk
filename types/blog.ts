export type ContentBlock =
  | { type: 'p';       html: string }
  | { type: 'h2';      text: string }
  | { type: 'h3';      text: string }
  | { type: 'ul';      items: string[] }
  | { type: 'ol';      items: string[] }
  | { type: 'callout'; html: string; variant?: 'info' | 'tip' | 'warning' | 'verdict' }
  | { type: 'table';   headers: string[]; rows: string[][] }
  | { type: 'code';    lang: string; text: string }
  | { type: 'divider' }

export type BlogCategory =
  | 'buying-guide'
  | 'benchmarks'
  | 'how-to'
  | 'analysis'
  | 'news'

export interface BlogFAQ {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  headline: string
  description: string
  publishedAt: string
  updatedAt: string
  category: BlogCategory
  tags: string[]
  featured: boolean
  readingTimeMinutes: number
  intro: string
  content: ContentBlock[]
  relatedProductSlugs: string[]
  relatedGuideSlugs?: string[]
  faq: BlogFAQ[]
}
