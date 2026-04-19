import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

function heroSpecs(product: Product) {
  const s = product.specs
  const items: { label: string; value: string }[] = []
  if (s.vram_gb) items.push({ label: 'VRAM', value: `${s.vram_gb} GB` })
  if (s.unified_memory_gb) items.push({ label: 'MEMORY', value: `${s.unified_memory_gb} GB` })
  if (s.memory_bandwidth_gbps) items.push({ label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` })
  if (s.tdp_watts) items.push({ label: 'TDP', value: `${s.tdp_watts}W` })
  if (s.max_llm_size) items.push({ label: 'MAX LLM', value: s.max_llm_size })
  return items.slice(0, 4)
}

export default function ProductHero({ product }: { product: Product }) {
  const specs = heroSpecs(product)

  return (
    <section className="relative rounded-2xl overflow-hidden bg-ink-2 border border-edge">
      {/* Background dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-2 via-ink-2/95 to-ore/5" />
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ore to-transparent" />

      <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-start">

        {/* Image panel */}
        <div className="shrink-0 w-full md:w-48 lg:w-56 flex items-center justify-center rounded-xl bg-ink-1/60 border border-edge/60 p-6 self-start">
          <AmazonImage
            asin={product.asin}
            name={product.name}
            size={300}
            className="w-full max-w-[180px] md:max-w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ore border border-ore/30 bg-ore/8 rounded px-2.5 py-1">
              {product.category.replace('-', ' ')}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {product.brand}
            </span>
          </div>

          <h1 className="font-display font-900 text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight text-foreground mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={product.rating} />
            <span className="font-mono text-xs text-slate-500">Editorial rating</span>
          </div>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
            {product.shortDescription}
          </p>

          {/* Key specs row */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {specs.map(spec => (
                <div key={spec.label} className="bg-ink-1/80 border border-edge rounded-lg px-4 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">{spec.label}</p>
                  <p className="font-mono text-base font-medium text-data">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          <AffiliateButton href={product.affiliateUrl} />
        </div>
      </div>
    </section>
  )
}
