import Link from 'next/link'
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'

function keySpec(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.vram_gb) return { label: 'VRAM', value: `${s.vram_gb} GB` }
  if (s.unified_memory_gb) return { label: 'UNIFIED MEM', value: `${s.unified_memory_gb} GB` }
  if (s.memory_bandwidth_gbps) return { label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` }
  return null
}

export default function ProductCard({ product }: { product: Product }) {
  const spec = keySpec(product)
  const ratingPct = (product.rating / 5) * 100

  return (
    <article className="card-glow group relative flex flex-col rounded-xl border border-edge bg-ink-1 p-5 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore/40 to-transparent" />

      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ore/70 border border-ore/20 bg-ore/5 rounded px-2 py-0.5">
          {product.category.replace('-', ' ')}
        </span>
        {spec && (
          <span className="font-mono text-[11px] text-data/80">
            {spec.label}: <span className="text-data font-medium">{spec.value}</span>
          </span>
        )}
      </div>

      <h3 className="font-display font-800 text-lg leading-tight text-foreground mb-2 group-hover:text-ore transition-colors">
        <Link href={`/products/${product.slug}`} className="block">
          {product.name}
        </Link>
      </h3>

      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
        {product.shortDescription}
      </p>

      {/* Rating bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Rating</span>
          <span className="font-mono text-xs text-ore">{product.rating}/5</span>
        </div>
        <div className="h-1 rounded-full bg-edge overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ore to-ore/60"
            style={{ width: `${ratingPct}%` }}
          />
        </div>
      </div>

      <AffiliateButton href={product.affiliateUrl} />
    </article>
  )
}
