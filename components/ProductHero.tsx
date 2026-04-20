import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function heroSpecs(product: Product) {
  const s = product.specs
  const items: { label: string; value: string }[] = []
  if (s.vram_gb)               items.push({ label: 'VRAM',      value: `${s.vram_gb} GB`            })
  if (s.unified_memory_gb)     items.push({ label: 'MEMORY',    value: `${s.unified_memory_gb} GB`  })
  if (s.memory_bandwidth_gbps) items.push({ label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` })
  if (s.tdp_watts)             items.push({ label: 'TDP',       value: `${s.tdp_watts}W`            })
  if (s.max_llm_size)          items.push({ label: 'MAX MODEL', value: s.max_llm_size               })
  return items.slice(0, 4)
}

export default function ProductHero({ product }: { product: Product }) {
  const specs = heroSpecs(product)

  return (
    <section className="border border-edge bg-ink-1 overflow-hidden">
      {/* Ember rule at top */}
      <div className="h-[2px] bg-ore" />

      <div className="flex flex-col md:flex-row">

        {/* Image panel — left column */}
        <div className="md:w-56 lg:w-64 shrink-0 bg-ink-2 border-b md:border-b-0 md:border-r border-edge flex items-center justify-center p-8">
          <AmazonImage
            asin={product.asin}
            name={product.name}
            size={300}
            className="w-full max-w-[180px] md:max-w-full h-auto"
          />
        </div>

        {/* Content — right column */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">

          {/* Category + Brand */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2">
              {product.category.replace('-', ' ')}
            </span>
            <span className="text-edge hi">·</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {product.brand}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-900 text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight uppercase text-foreground mb-5">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <StarRating rating={product.rating} />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
              Editorial rating
            </span>
          </div>

          {/* Description */}
          <p className="font-body text-base text-slate-400 leading-relaxed max-w-2xl mb-8">
            {product.shortDescription}
          </p>

          {/* Spec strip */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-edge mb-8 border border-edge">
              {specs.map(spec => (
                <div key={spec.label} className="bg-ink-1 px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-1">
                    {spec.label}
                  </p>
                  <p className="font-mono text-base font-500 text-ore">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <AffiliateButton href={product.affiliateUrl} />
          </div>
        </div>
      </div>
    </section>
  )
}
