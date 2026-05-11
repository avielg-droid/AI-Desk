'use client'

import Link from 'next/link'
import type { Product } from '@/types/product'
import AmazonImage from './AmazonImage'
import StarRating from './StarRating'

/* ── helpers ─────────────────────────────────────────────── */

function displaySpecs(product: Product): { key: string; value: string }[] {
  const s = product.specs
  const out: { key: string; value: string }[] = []
  if (s.vram_gb)               out.push({ key: 'VRAM',      value: `${s.vram_gb} GB` })
  if (s.unified_memory_gb)     out.push({ key: 'MEMORY',    value: `${s.unified_memory_gb} GB` })
  if (s.memory_bandwidth_gbps) out.push({ key: 'BANDWIDTH', value: `${s.memory_bandwidth_gbps} GB/s` })
  if (s.tdp_watts)             out.push({ key: 'TDP',       value: `${s.tdp_watts}W` })
  if (s.max_llm_size)          out.push({ key: 'MAX MODEL', value: s.max_llm_size })
  if (s.npu_tops)              out.push({ key: 'NPU',       value: `${s.npu_tops} TOPS` })
  if (s.ports_count)           out.push({ key: 'PORTS',     value: `${s.ports_count}` })
  if (s.charging_watts)        out.push({ key: 'CHARGE',    value: `${s.charging_watts}W` })
  if (s.storage_bays)          out.push({ key: 'BAYS',      value: `${s.storage_bays}` })
  if (s.ethernet_speed)        out.push({ key: 'ETHERNET',  value: s.ethernet_speed })
  return out.slice(0, 4)
}

function keyBenchmark(product: Product): { value: string; raw: number } | null {
  const tps = product.specs.tokens_per_second_7b
  if (tps) return { value: `${tps}`, raw: tps }
  return null
}

/* ── main card ───────────────────────────────────────────── */

export default function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const specs = displaySpecs(product)
  const bench = keyBenchmark(product)

  return (
    <article
      className="group relative flex flex-col bg-ink-0 border border-edge overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Rank badge */}
      {rank != null && (
        <div
          className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-widest px-2 py-1 border border-edge backdrop-blur-sm"
          style={{ background: 'rgb(var(--color-ink-0) / 0.85)', color: 'var(--text-subtle)' }}
        >
          {String(rank).padStart(2, '0')}
        </div>
      )}

      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block bg-white overflow-hidden border-b border-edge"
        style={{ aspectRatio: '4/3' }}
        aria-label={`View ${product.name}`}
      >
        {/* Brand badge */}
        <div
          className="absolute bottom-3 right-3 z-10 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 backdrop-blur-sm"
          style={{ background: 'rgb(var(--color-ink-0) / 0.82)', color: 'var(--text-muted)' }}
        >
          {product.brand}
        </div>
        <AmazonImage
          asin={product.asin}
          name={product.name}
          localSrc={product.image}
          size={240}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Rating */}
        <StarRating rating={product.rating} />

        {/* Name */}
        <h3 className="font-display font-bold text-xl leading-tight tracking-tight text-foreground" style={{ letterSpacing: '-0.02em' }}>
          <Link href={`/products/${product.slug}`} className="hover:text-ore transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {product.shortDescription}
        </p>

        {/* Specs grid */}
        {specs.length > 0 && (
          <div
            className="grid grid-cols-2 gap-px border border-edge"
            style={{ background: 'rgb(var(--color-edge))' }}
          >
            {specs.map(s => (
              <div key={s.key} className="bg-ink-0 p-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                  {s.key}
                </span>
                <span className="font-mono font-semibold text-sm text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bench stat + bar */}
        {bench && (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                Llama 3 7B Q4
              </span>
              <span className="font-display font-bold text-xl text-ore leading-none" style={{ letterSpacing: '-0.02em' }}>
                {bench.value}
                <em className="font-mono text-[9px] not-italic ml-1" style={{ color: 'var(--text-subtle)' }}>tok/s</em>
              </span>
            </div>
            <div className="pc-bench-bar">
              <span style={{ width: `${Math.min(100, (bench.raw / 150) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* Footer: price + CTA */}
        <div className="mt-auto pt-4 border-t border-edge flex items-center justify-between gap-4">
          <span
            className="font-display font-bold text-2xl leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            {product.priceDisplay}
          </span>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="forge-btn inline-flex items-center gap-2 px-5 py-2.5 font-sans font-semibold text-sm"
          >
            Check Amazon
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>

      </div>
    </article>
  )
}
