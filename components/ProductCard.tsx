import Link from 'next/link'
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function keySpec(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.vram_gb) return { label: 'VRAM', value: `${s.vram_gb} GB` }
  if (s.unified_memory_gb) return { label: 'UNIFIED MEM', value: `${s.unified_memory_gb} GB` }
  if (s.memory_bandwidth_gbps) return { label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` }
  return null
}

export default function ProductCard({ product }: { product: Product }) {
  const spec = keySpec(product)

  return (
    <article className="card-glow group relative flex flex-col rounded-xl border border-edge bg-ink-1 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore/40 to-transparent" />

      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block bg-ink-2/60 border-b border-edge/60 p-5 flex items-center justify-center min-h-[160px]">
        <AmazonImage
          asin={product.asin}
          name={product.name}
          size={200}
          className="max-h-[140px] w-auto mx-auto transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ore/70 border border-ore/20 bg-ore/5 rounded px-2 py-0.5">
            {product.category.replace('-', ' ')}
          </span>
          {spec && (
            <span className="font-mono text-[11px] text-data/80">
              {spec.label}: <span className="text-data font-medium">{spec.value}</span>
            </span>
          )}
        </div>

        <h3 className="font-display font-800 text-lg leading-tight text-foreground mb-1 group-hover:text-ore transition-colors">
          <Link href={`/products/${product.slug}`} className="block">
            {product.name}
          </Link>
        </h3>

        <StarRating rating={product.rating} className="mb-3" />

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {product.shortDescription}
        </p>

        <AffiliateButton href={product.affiliateUrl} />
      </div>
    </article>
  )
}
