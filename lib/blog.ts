import fs from 'fs'
import path from 'path'
import type { BlogPost, BlogCategory } from '@/types/blog'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8')) as BlogPost)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as BlogPost
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map(p => p.slug)
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  const all = getAllBlogPosts()
  const featured = all.filter(p => p.featured)
  return featured.length >= limit ? featured.slice(0, limit) : all.slice(0, limit)
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllBlogPosts().filter(p => p.category === category)
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPost(slug)
  if (!post) return []
  const all = getAllBlogPosts().filter(p => p.slug !== slug)
  // Prefer same category, then same tags
  const sameCategory = all.filter(p => p.category === post.category)
  const sameTags = all.filter(p =>
    p.tags.some(t => post.tags.includes(t)) && p.category !== post.category
  )
  return [...sameCategory, ...sameTags].slice(0, limit)
}

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  'buying-guide': 'Buying Guide',
  'benchmarks':   'Benchmarks',
  'how-to':       'How-To',
  'analysis':     'Analysis',
  'news':         'News',
}
