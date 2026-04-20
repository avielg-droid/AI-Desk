import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'
import { getAllPersonas } from '@/lib/personas'
import { getAllComparisonSlugs } from '@/lib/comparisons'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts()
  const personas = getAllPersonas()
  const BASE = 'https://theaidesk.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: new Date('2026-04-19'), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/products`,              lastModified: new Date('2026-04-19'), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/best`,                  lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/compare`,               lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/categories/gpu`,        lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/categories/mini-pc`,    lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/categories/ai-pc`,      lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/categories/accessory`,  lastModified: new Date('2026-04-19'), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,                 lastModified: new Date('2026-04-19'), changeFrequency: 'monthly', priority: 0.3 },
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

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map(s => ({
    url: `${BASE}/compare/${s}`,
    lastModified: new Date('2026-04-19'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...personaPages, ...comparisonPages]
}
