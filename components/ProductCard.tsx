import Link from 'next/link'
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function keySpec(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.vram_gb)              return { label: 'VRAM',      value: `${s.vram_gb} GB`               }
  if (s.unified_memory_gb)    return { label: 'MEMORY',    value: `${s.unified_memory_gb} GB`      }
  if (s.memory_bandwidth_gbps) return { label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` }
  return null
}

export default function ProductCard({ product }: { product: Product }) {
  const spec = keySpec(product)

  return (
    <article className="group flex flex-col border border-edge bg-ink-1 overflow-hidden transition-colors hover:border-ore/40">
      {/* Ember top bar */}
      <div className="h-[2px] bg-edge group-hover:bg-ore transition-colors" />

      {/* Product image */}
      <Link
        href={`/products/${product.slug}`}
        className="block bg-ink-2 border-b border-edge p-6 flex items-center justify-center min-h-[160px]"
      >
        <AmazonImage
          asin={product.asin}
          name={product.name}
          localSrc={product.image}
          size={200}
          className="max-h-[140px] w-auto mx-auto transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2">
            {product.category.replace('-', ' ')}
          </span>
          {spec && (
            <span className="font-mono text-[10px] text-slate-500">
              {spec.label} <span className="text-ore font-500">{spec.value}</span>
            </span>
          )}
        </div>

        <h3 className="font-display font-800 text-xl uppercase leading-tight text-foreground mb-2 group-hover:text-ore transition-colors">
          <Link href={`/products/${product.slug}`} className="block">
            {product.name}
          </Link>
        </h3>

        <StarRating rating={product.rating} className="mb-3" />

        <p className="font-body text-sm text-zinc-600 leading-relaxed line-clamp-3 mb-5 flex-1">
          {product.shortDescription}
        </p>

        <AffiliateButton href={product.affiliateUrl} size="sm" />
      </div>
    </article>
  )
}
