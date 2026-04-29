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
      transition-all duration-300
      border border-edge
      bg-ink-1
      hover:border-ore/30
      hover:shadow-aurora-sm
      aurora-glow-hover
    ">
      {/* Aurora top bar — animated on hover */}
      <div className="h-[2px] bg-edge group-hover:aurora-bar transition-colors duration-300 aurora-bar" />

      {/* Product image — white panel pops on void */}
      <Link
        href={`/products/${product.slug}`}
        className="block bg-white border-b border-edge p-4 flex items-center justify-center min-h-[120px] md:min-h-[160px] max-h-[180px] md:max-h-none overflow-hidden"
      >
        <AmazonImage
          asin={product.asin}
          name={product.name}
          localSrc={product.image}
          size={200}
          className="max-h-[140px] w-auto mx-auto transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5 glass">

        {/* Category badge + key spec */}
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2">
            {product.category.replace('-', ' ')}
          </span>
          {spec && (
            <span className="font-mono text-[10px] text-zinc-600">
              {spec.label} <span className="text-ore font-500">{spec.value}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-700 text-xl leading-tight text-foreground mb-2 group-hover:text-ore transition-colors duration-200">
          <Link href={`/products/${product.slug}`} className="block">
            {product.name}
          </Link>
        </h3>

        <StarRating rating={product.rating} className="mb-3" />

        <p className="font-sans text-sm text-zinc-600 leading-relaxed line-clamp-3 mb-4 flex-1">
          {product.shortDescription}
        </p>

        {/* Benchmark — hero stat */}
        {bench && (
          <div className="flex items-end gap-1.5 mb-4 border-l-2 border-win/40 pl-3">
            <span className="font-mono font-700 text-2xl leading-none text-win">{bench.value}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">t/s · Llama 8B</span>
          </div>
        )}

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="view-deal-btn inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 font-sans font-700 text-sm"
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
