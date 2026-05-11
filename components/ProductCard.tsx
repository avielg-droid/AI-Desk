'use client'

import Link from 'next/link'
import type { Product } from '@/types/product'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

/* ── helpers ─────────────────────────────────────────────── */

function keySpec(product: Product): { label: string; value: string } | null {
  const s = product.specs
  if (s.vram_gb)               return { label: 'VRAM',      value: `${s.vram_gb} GB`                }
  if (s.unified_memory_gb)     return { label: 'MEMORY',    value: `${s.unified_memory_gb} GB`       }
  if (s.memory_bandwidth_gbps) return { label: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` }
  return null
}

function keyBenchmark(product: Product): { label: string; value: string; raw: number } | null {
  const s = product.specs
  if (s.tokens_per_second_7b) return { label: '7B t/s', value: `${s.tokens_per_second_7b}`, raw: s.tokens_per_second_7b }
  return null
}

/* ── badges ──────────────────────────────────────────────── */

function Badges({ product, benchRaw }: { product: Product; benchRaw?: number }) {
  const badges: { text: string; bg: string; text_color: string }[] = []

  if (product.rating >= 4.7) {
    badges.push({ text: "EDITOR'S PICK", bg: 'bg-emerald-500/15', text_color: 'text-emerald-400' })
  }
  if (benchRaw && benchRaw > 100) {
    badges.push({ text: 'HIGH PERF', bg: 'bg-amber-500/15', text_color: 'text-amber-400' })
  }

  if (badges.length === 0) return null

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1">
      {badges.map((b) => (
        <span
          key={b.text}
          className={`${b.bg} ${b.text_color} font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm backdrop-blur-sm`}
        >
          {b.text}
        </span>
      ))}
    </div>
  )
}

/* ── main card ───────────────────────────────────────────── */

export default function ProductCard({ product }: { product: Product }) {
  const spec = keySpec(product)
  const bench = keyBenchmark(product)

  return (
    <article
      className="
        group relative flex flex-col overflow-hidden
        bg-ink-0 border border-edge rounded-lg
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-black/25
        hover:-translate-y-[6px]
        focus-within:ring-2 focus-within:ring-ore/50 focus-within:ring-offset-1 focus-within:ring-offset-transparent
      "
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: 'transparent',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-left-color 0.3s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = 'var(--ore)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = 'transparent' }}
    >
      {/* ── category tag (top-left) + spec (top-right) ──── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{ color: 'var(--text-subtle)' }}
        >
          {product.category.replace('-', ' ')}
        </span>
        {spec && (
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>
            {spec.label} <span className="text-foreground font-medium">{spec.value}</span>
          </span>
        )}
      </div>

      {/* ── badges (top-right overlay) ────────────────────── */}
      <Badges product={product} benchRaw={bench?.raw} />

      {/* ── product image with hover scale ────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block bg-white p-6 flex items-center justify-center min-h-[180px] md:min-h-[200px] overflow-hidden border-b border-edge mx-3 mt-2 rounded-md"
        aria-label={`View ${product.name} details`}
      >
        {/* gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-md"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.06) 100%)',
          }}
        />
        <AmazonImage
          asin={product.asin}
          name={product.name}
          localSrc={product.image}
          size={200}
          className="max-h-[150px] w-auto mx-auto transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      {/* ── card body ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 pb-4">

        {/* title */}
        <h3 className="font-display font-bold text-lg leading-tight text-foreground mb-2">
          <Link
            href={`/products/${product.slug}`}
            className="block hover:underline underline-offset-2 decoration-ore/40 focus:outline-none focus:underline"
          >
            {product.name}
          </Link>
        </h3>

        {/* star rating */}
        <StarRating rating={product.rating} className="mb-3" />

        {/* one-line description */}
        <p
          className="text-sm leading-relaxed line-clamp-1 mb-4 flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {product.shortDescription}
        </p>

        {/* benchmark stat + bar */}
        {bench && (
          <div className="mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-xl text-win leading-none">{bench.value}</span>
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: 'var(--text-subtle)' }}
              >
                t/s · Llama 8B
              </span>
            </div>
            <div className="pc-bench-bar">
              <span style={{ width: `${Math.min(100, (bench.raw / 150) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* ── CTA button — full-width, large, with glow on hover */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="
            forge-btn relative inline-flex items-center justify-center gap-2
            w-full px-6 py-4
            font-sans font-bold text-base tracking-tight
            rounded-md
            transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-ore/60 focus:ring-offset-1
            mt-auto
          "
          style={{
            boxShadow: '0 0 0 0 var(--ore)',
            animation: 'cta-glow 2.5s ease-in-out infinite',
          }}
        >
          View Deal
          <svg
            className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>

      {/* ── keyframes for the subtle CTA glow pulse ──────── */}
      <style jsx>{`
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 0 8px 0 rgba(var(--ore-rgb, 217 119 6), 0); }
          50%      { box-shadow: 0 0 16px 2px rgba(var(--ore-rgb, 217 119 6), 0.25); }
        }
      `}</style>
    </article>
  )
}
