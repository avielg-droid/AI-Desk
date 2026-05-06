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
  alternates: { canonical: 'https://ai-desk.tech/products' },
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
    products.map(p => ({ name: p.name, url: `https://ai-desk.tech/products/${p.slug}` }))
  )

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="space-y-6">

        {/* Hero */}
        <section className="border border-edge bg-ink-0 overflow-hidden">
          <div className="h-[2px] rule-ember" />
          <div className="px-8 py-8 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">All Reviews</p>
              <h1 className="font-display font-bold text-4xl uppercase tracking-tight text-foreground mb-1">
                AI Hardware
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} reviewed for LLM inference &amp; Stable Diffusion
              </p>
            </div>
            <div className="flex gap-8">
              {[
                { val: `${allProducts.length}`, label: 'Total Reviews'    },
                { val: '16 GB',                 label: 'Max VRAM tracked' },
                { val: '70B',                   label: 'Largest model run' },
              ].map(s => (
                <div key={s.label} className="text-right">
                  <p className="font-mono font-semibold text-xl text-ore leading-none">{s.val}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-subtle)' }}>{s.label}</p>
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
                className={`text-sm px-4 py-2 border rounded-full transition-colors duration-150 ${
                  isActive
                    ? 'border-ore text-ore bg-ore/8 font-semibold'
                    : 'border-edge font-medium hover:border-ore/50 hover:text-ore'
                }`}
                style={!isActive ? { color: 'var(--text-muted)' } : undefined}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1.5 font-mono text-[11px] opacity-50">
                    {allProducts.filter(p => p.category === f.value).length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-edge border border-edge">
            {products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-edge bg-ink-1 py-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>No results</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No products in this category yet.</p>
          </div>
        )}

      </div>
    </>
  )
}
