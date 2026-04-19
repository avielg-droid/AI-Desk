import fs from 'fs'
import path from 'path'
import type { Product, Category } from '@/types/product'

const PRODUCTS_DIR = path.join(process.cwd(), 'content', 'products')

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return []
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8')
    return JSON.parse(raw) as Product
  })
}

export function getProductBySlug(slug: string): Product | null {
  const products = getAllProducts()
  return products.find(p => p.slug === slug) ?? null
}

export function getProductsByCategory(category: Category): Product[] {
  return getAllProducts().filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter(p => p.featured)
}
