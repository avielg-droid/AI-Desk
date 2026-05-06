import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function heroSpecs(product: Product) {
  const s = product.specs
  const items: { label: string; value: string }[] = []
  if (s.vram_gb)               items.push({ label: 'VRAM',       value: `${s.vram_gb} GB`                })
  if (s.unified_memory_gb)     items.push({ label: 'MEMORY',     value: `${s.unified_memory_gb} GB`       })
  if (s.memory_bandwidth_gbps) items.push({ label: 'BANDWIDTH',  value: `${s.memory_bandwidth_gbps} GB/s` })
  if (s.tdp_watts)             items.push({ label: 'TDP',        value: `${s.tdp_watts}W`                })
  if (s.max_llm_size)          items.push({ label: 'MAX MODEL',  value: s.max_llm_size                   })
  if (s.tokens_per_second_7b)  items.push({ label: '7B SPEED',   value: `${s.tokens_per_second_7b} t/s`  })
  return items.slice(0, 4)
}

export default function ProductHero({ product }: { product: Product }) {
  const specs = heroSpecs(product)

  return (
    <section className="border border-edge overflow-hidden bg-ink-0">
      {/* Amber top rule */}
      <div className="h-[2px] rule-ember" />

      <div className="flex flex-col md:flex-row">

        {/* Image panel — white box creates strong contrast on void */}
        <div className="md:w-56 lg:w-64 shrink-0 bg-white border-b md:border-b-0 md:border-r border-edge flex items-center justify-center p-8">
          <AmazonImage
            asin={product.asin}
            name={product.name}
            localSrc={product.image}
            size={300}
            className="w-full max-w-[180px] md:max-w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">

          {/* Category + Brand */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2">
              {product.category.replace('-', ' ')}
            </span>
            <span className="font-mono text-[10px] text-zinc-600">·</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {product.brand}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-700 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.0] tracking-tight text-foreground mb-5">
            {product.name}
          </h1>

          {/* Rating + Price */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                Our Score
              </span>
            </div>
            <span className="font-mono text-xl font-600 text-foreground">
              {product.priceDisplay}
            </span>
          </div>

          {/* Description */}
          <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-2xl mb-8">
            {product.shortDescription}
          </p>

          {/* Spec strip */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-edge border border-edge mb-8">
              {specs.map(spec => (
                <div key={spec.label} className="bg-ink-1 px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                    {spec.label}
                  </p>
                  <p className="font-mono text-base font-semibold text-ore">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-5 flex-wrap">
            <AffiliateButton href={product.affiliateUrl} />
            <a
              href="#verdict"
              className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-ore transition-colors"
            >
              Skip to verdict ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
