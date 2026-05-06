import Link from 'next/link'
import type { Product } from '@/types/product'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function keySpec(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.vram_gb)               return { label: 'VRAM',      value: `${s.vram_gb} GB`                }
  if (s.unified_memory_gb)     return { label: 'MEMORY',    value: `${s.unified_memory_gb} GB`       }
  if (s.memory_bandwidth_gbps) return { label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` }
  return null
}

function keyBenchmark(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.tokens_per_second_7b)  return { label: '7B t/s', value: `${s.tokens_per_second_7b}` }
  return null
}

export default function ProductCard({ product }: { product: Product }) {
  const spec = keySpec(product)
  const bench = keyBenchmark(product)

  return (
    <article className="
      group flex flex-col overflow-hidden
      bg-ink-0 border border-edge
      transition-shadow duration-300
      hover:shadow-lg
    ">
      {/* Product image */}
      <Link
        href={`/products/${product.slug}`}
        className="block bg-white p-6 flex items-center justify-center min-h-[180px] md:min-h-[200px] overflow-hidden border-b border-edge"
      >
        <AmazonImage
          asin={product.asin}
          name={product.name}
          localSrc={product.image}
          size={200}
          className="max-h-[150px] w-auto mx-auto transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">

        {/* Category + key spec */}
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
            {product.category.replace('-', ' ')}
          </span>
          {spec && (
            <span className="font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>
              {spec.label} <span className="text-foreground font-medium">{spec.value}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg leading-tight text-foreground mb-2">
          <Link href={`/products/${product.slug}`} className="block hover:underline underline-offset-2">
            {product.name}
          </Link>
        </h3>

        <StarRating rating={product.rating} className="mb-3" />

        <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
          {product.shortDescription}
        </p>

        {/* Benchmark stat */}
        {bench && (
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="font-mono font-bold text-xl text-win leading-none">{bench.value}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>t/s · Llama 8B</span>
          </div>
        )}

        {/* CTA */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="forge-btn inline-flex items-center justify-center gap-2 w-full px-4 py-3 font-sans font-semibold text-sm"
        >
          View Deal
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>
    </article>
  )
}
