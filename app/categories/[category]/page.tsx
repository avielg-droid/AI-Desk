import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/products'
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
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
  const BASE = 'https://theaidesk.com'

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: meta.title, url: `${BASE}/categories/${category}` },
    ]),
    buildItemListSchema(
      meta.h1,
      products.map(p => ({ name: p.name, url: `${BASE}/products/${p.slug}` }))
    ),
  ]

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      <div>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
            <li className="text-edge">/</li>
            <li className="text-slate-400">{meta.title}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Category</p>
          <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
            {meta.h1}
          </h1>
          <p className="text-slate-400">{meta.description}</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-edge/60 py-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">Coming soon</p>
            <p className="text-sm text-slate-600">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
