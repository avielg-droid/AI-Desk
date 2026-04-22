import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { buildItemListSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types/product'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Best AI Hardware Reviews (2026) — GPUs, Mini PCs & More',
  description: 'Browse all expert-reviewed GPUs, Mini PCs, and AI accessories for running AI locally in 2026. Benchmarked for LLM inference and Stable Diffusion.',
}

const FILTERS: { label: string; value: Category | 'all' }[] = [
  { label: 'All',         value: 'all'       },
  { label: 'GPUs',        value: 'gpu'       },
  { label: 'Mini PCs',    value: 'mini-pc'   },
  { label: 'AI PCs',      value: 'ai-pc'     },
  { label: 'Accessories', value: 'accessory' },
]

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const allProducts = getAllProducts()
  const active = (searchParams.category ?? 'all') as Category | 'all'
  const products = active === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === active)

  const schema = buildItemListSchema(
    'AI Hardware Products',
    products.map(p => ({ name: p.name, url: `https://theaidesk.com/products/${p.slug}` }))
  )

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="space-y-6">

        {/* Hero */}
        <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
          <div className="absolute inset-0 bg-crosshatch" />
          <div className="relative px-8 py-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">All Reviews</p>
              <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
                AI Hardware
              </h1>
              <p className="font-sans text-sm text-zinc-600">
                {products.length} product{products.length !== 1 ? 's' : ''} reviewed for LLM inference &amp; Stable Diffusion
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { val: `${allProducts.length}`, label: 'Total Reviews'    },
                { val: '16 GB',                 label: 'Max VRAM tracked' },
                { val: '70B',                   label: 'Largest model run' },
              ].map(s => (
                <div key={s.label} className="text-right">
                  <p className="font-mono font-600 text-xl text-ore leading-none">{s.val}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {FILTERS.map(f => {
            const isActive = active === f.value
            const href = f.value === 'all' ? '/products' : `/products?category=${f.value}`
            return (
              <Link
                key={f.value}
                href={href}
                className={`font-mono text-[11px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                  isActive
                    ? 'border-ore text-ore bg-ore/10'
                    : 'border-edge text-zinc-600 hover:border-ore/40 hover:text-ore'
                }`}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1.5 opacity-50">
                    {allProducts.filter(p => p.category === f.value).length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-edge bg-ink-1 py-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">No results</p>
            <p className="text-sm text-zinc-600">No products in this category yet.</p>
          </div>
        )}

      </div>
    </>
  )
}
