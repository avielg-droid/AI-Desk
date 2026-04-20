import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import { buildItemListSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductCard from '@/components/ProductCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Best AI Hardware Reviews (2026) — GPUs, Mini PCs & More',
  description: 'Browse all expert-reviewed GPUs, Mini PCs, and AI accessories for running AI locally in 2026. Benchmarked for LLM inference and Stable Diffusion.',
}

export default function ProductsPage() {
  const products = getAllProducts()

  const schema = buildItemListSchema(
    'AI Hardware Products',
    products.map(p => ({ name: p.name, url: `https://theaidesk.com/products/${p.slug}` }))
  )

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div>
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">All Reviews</p>
          <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
            AI Hardware
          </h1>
          <p className="text-zinc-600">{products.length} products reviewed for local AI inference</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}
