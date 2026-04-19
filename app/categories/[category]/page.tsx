import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types/product'

export const revalidate = 3600

const CATEGORY_META: Record<Category, { title: string; description: string; h1: string }> = {
  'gpu': {
    title: 'Best GPUs for Local AI (2026)',
    description: 'Expert reviews of the best discrete GPUs for running LLMs and Stable Diffusion locally in 2026.',
    h1: 'Best GPUs for Running AI Locally (2026)',
  },
  'mini-pc': {
    title: 'Best Mini PCs for Local AI (2026)',
    description: 'Compact AI workstations reviewed for local LLM inference, Stable Diffusion, and home AI servers.',
    h1: 'Best Mini PCs for Local AI Inference (2026)',
  },
  'ai-pc': {
    title: 'Best AI PCs (2026)',
    description: 'Full desktop AI workstations reviewed for local LLM training and inference workloads.',
    h1: 'Best AI PCs for Local Machine Learning (2026)',
  },
  'accessory': {
    title: 'Best AI Accessories (2026)',
    description: 'Cooling solutions, cables, and peripherals for optimizing your local AI workstation.',
    h1: 'Best Accessories for Local AI Workstations (2026)',
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const meta = CATEGORY_META[params.category as Category]
  if (!meta) return {}
  return { title: meta.title, description: meta.description }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const products = getProductsByCategory(category)

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><a href="/" className="hover:text-gray-900">Home</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{meta.title}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{meta.h1}</h1>
      <p className="text-gray-600 mb-8">{meta.description}</p>

      {products.length === 0 ? (
        <p className="text-gray-500">No products in this category yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
