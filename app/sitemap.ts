import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'
import { getAllPersonas } from '@/lib/personas'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts()
  const personas = getAllPersonas()
  const BASE = 'https://theaidesk.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories/gpu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/categories/mini-pc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
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

  return [...staticPages, ...productPages, ...personaPages]
}
