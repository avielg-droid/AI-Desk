import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'All AI Hardware Products',
  description: 'Browse all expert-reviewed GPUs, Mini PCs, and AI accessories for running AI locally in 2026.',
}

export default function ProductsPage() {
  const products = getAllProducts()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All AI Hardware</h1>
        <p className="text-gray-600">{products.length} products reviewed for local AI inference</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}
