import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'
import { getAllPersonas } from '@/lib/personas'
import { getAllGlossarySlugs } from '@/lib/glossary'
import { getAllGuideSlugs } from '@/lib/guides'
import { getAllBlogSlugs } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts()
  const personas = getAllPersonas()
  const BASE = 'https://ai-desk.tech'

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: now,                    changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/products`,              lastModified: now,                    changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/best`,                  lastModified: now,                    changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/compare`,               lastModified: now,                    changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/categories/gpu`,        lastModified: now,                    changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/categories/mini-pc`,    lastModified: now,                    changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/categories/ai-pc`,      lastModified: now,                    changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/categories/accessory`,  lastModified: now,                    changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,                 lastModified: new Date('2026-05-02'), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/about/author`,          lastModified: new Date('2026-05-02'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/how-we-test`,           lastModified: new Date('2026-04-24'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const personaPages: MetadataRoute.Sitemap = personas.map(p => ({
    url: `${BASE}/best/${p.slug}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const glossarySlugs = getAllGlossarySlugs()
  const glossaryIndex: MetadataRoute.Sitemap = glossarySlugs.length > 0
    ? [{ url: `${BASE}/glossary`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 }]
    : []

  const glossaryPages: MetadataRoute.Sitemap = glossarySlugs.map(slug => ({
    url: `${BASE}/glossary/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const guideSlugs = getAllGuideSlugs()
  const guidesIndex: MetadataRoute.Sitemap = guideSlugs.length > 0
    ? [{ url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 }]
    : []

  const guidePages: MetadataRoute.Sitemap = guideSlugs.map(slug => ({
    url: `${BASE}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
  ]

  const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map(slug => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...personaPages, ...glossaryIndex, ...glossaryPages, ...guidesIndex, ...guidePages, ...blogIndex, ...blogPages]
}
