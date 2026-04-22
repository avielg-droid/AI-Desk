'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Product } from '@/types/product'

// ── Helpers ────────────────────────────────────────────────────────────────────

function effectiveMemory(p: Product): number {
  return p.specs.vram_gb ?? p.specs.unified_memory_gb ?? 0
}

function memLabel(p: Product): string {
  if (p.specs.vram_gb) return `${p.specs.vram_gb} GB VRAM`
  if (p.specs.unified_memory_gb) return `${p.specs.unified_memory_gb} GB Unified`
  return '—'
}

function winnerIdx(nums: (number | null)[], higherBetter = true): number | null {
  const valid = nums.map((v, i) => ({ v, i })).filter(x => x.v !== null) as { v: number; i: number }[]
  if (valid.length < 2) return null
  const sorted = [...valid].sort((a, b) => higherBetter ? b.v - a.v : a.v - b.v)
  if (sorted[0].v === sorted[1].v) return null
  return sorted[0].i
}

// ── Row definitions ────────────────────────────────────────────────────────────

type RowDef = {
  label: string
  isAI?: boolean
  higherBetter?: boolean
  getValue: (p: Product) => { display: string; num: number | null }
}

const ROWS: RowDef[] = [
  {
    label: 'VRAM / Unified Memory',
    isAI: true,
    getValue: p => ({ display: memLabel(p), num: effectiveMemory(p) }),
  },
  {
    label: 'Architecture',
    isAI: true,
    getValue: p => ({ display: p.specs.architecture ?? '—', num: null }),
  },
  {
    label: 'Max LLM Model Size',
    isAI: true,
    getValue: p => ({ display: p.specs.max_llm_size ?? '—', num: null }),
  },
  {
    label: 'Memory Bandwidth',
    getValue: p => ({
      display: p.specs.memory_bandwidth_gbps ? `${p.specs.memory_bandwidth_gbps} GB/s` : '—',
      num: p.specs.memory_bandwidth_gbps ?? null,
    }),
  },
  {
    label: 'LLM Speed (7B)',
    isAI: true,
    getValue: p => ({
      display: p.specs.tokens_per_second_7b ? `${p.specs.tokens_per_second_7b} t/s` : '—',
      num: p.specs.tokens_per_second_7b ?? null,
    }),
  },
  {
    label: 'LLM Speed (13B)',
    isAI: true,
    getValue: p => ({
      display: p.specs.tokens_per_second_13b ? `${p.specs.tokens_per_second_13b} t/s` : '—',
      num: p.specs.tokens_per_second_13b ?? null,
    }),
  },
  {
    label: 'TDP / Power Draw',
    higherBetter: false,
    getValue: p => ({
      display: p.specs.tdp_watts ? `${p.specs.tdp_watts}W` : '—',
      num: p.specs.tdp_watts ?? null,
    }),
  },
  {
    label: 'Thermal / Cooling',
    isAI: true,
    getValue: p => ({ display: p.specs.cooling ?? '—', num: null }),
  },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function CompareSelector({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<string[]>([])

  const comparableProducts = useMemo(
    () => products.filter(p => p.category !== 'accessory'),
    [products]
  )

  const selectedProducts = useMemo(
    () => selected.map(s => comparableProducts.find(p => p.slug === s)!).filter(Boolean),
    [selected, comparableProducts]
  )

  const toggle = (slug: string) => {
    setSelected(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug)
      if (prev.length >= 3) return prev
      return [...prev, slug]
    })
  }

  const seoSlug = selected.length === 2
    ? [...selected].sort().join('-vs-')
    : null

  const cols = selectedProducts.length

  return (
    <div className="space-y-8">

      {/* ── Product picker ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore">
            Select up to 3 products to compare
          </p>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-loss transition-colors"
            >
              Clear all ×
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {comparableProducts.map(p => {
            const isSelected = selected.includes(p.slug)
            const isDisabled = !isSelected && selected.length >= 3
            return (
              <button
                key={p.slug}
                onClick={() => !isDisabled && toggle(p.slug)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                className={`
                  text-left p-3 border transition-all duration-150
                  ${isSelected
                    ? 'border-ore bg-ore/10'
                    : isDisabled
                      ? 'border-edge opacity-40 cursor-not-allowed'
                      : 'border-edge bg-ink-1 hover:border-ore/40 hover:bg-ink-2'
                  }
                `}
              >
                <p className={`font-mono text-[9px] uppercase tracking-widest mb-1 ${isSelected ? 'text-ore' : 'text-zinc-600'}`}>
                  {p.category.replace('-', ' ')}
                </p>
                <p className={`font-sans font-600 text-xs leading-snug ${isSelected ? 'text-ore' : 'text-foreground'}`}>
                  {p.name}
                </p>
                {isSelected && (
                  <span className="inline-block mt-1.5 font-mono text-[8px] uppercase tracking-widest text-ore/70">
                    ✓ Added
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Prompt when only 1 selected ── */}
      {selected.length === 1 && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center py-4 border border-dashed border-edge">
          Select at least 1 more product to compare
        </p>
      )}

      {/* ── Comparison table ── */}
      {cols >= 2 && (
        <div>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-800 text-xl uppercase tracking-tight text-foreground whitespace-nowrap">
              Side-by-Side
            </h2>
            <span className="h-px flex-1 bg-edge" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ore">
              {cols} products
            </span>
          </div>

          {/* Frosted glass table */}
          <div className="glass border border-edge overflow-x-auto">
            {/* Header row */}
            <div
              className="grid border-b border-edge"
              style={{ gridTemplateColumns: `180px repeat(${cols}, 1fr)`, minWidth: '500px' }}
            >
              <div className="px-4 py-3" style={{ background: 'var(--glass-bg)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Spec</span>
              </div>
              {selectedProducts.map((p, i) => (
                <div key={p.slug} className="px-4 py-3 border-l border-edge" style={{ background: 'var(--glass-bg)' }}>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-ore mb-0.5">
                        Option {String.fromCharCode(65 + i)}
                      </p>
                      <p className="font-sans font-700 text-sm text-foreground leading-snug">{p.name}</p>
                    </div>
                    <button
                      onClick={() => toggle(p.slug)}
                      aria-label={`Remove ${p.name}`}
                      className="font-mono text-[10px] text-zinc-600 hover:text-loss transition-colors shrink-0 mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI metrics section header */}
            <div
              className="grid px-4 py-1.5 border-b border-edge bg-ore/5"
              style={{ gridTemplateColumns: `180px repeat(${cols}, 1fr)`, minWidth: '500px' }}
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-ore flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ore inline-block" />
                AI-Specific Metrics
              </p>
              {selectedProducts.map((_, i) => (
                <div key={i} className="border-l border-edge/30" />
              ))}
            </div>

            {/* Data rows */}
            {ROWS.map((row, rowIdx) => {
              const vals = selectedProducts.map(p => row.getValue(p))
              const nums = vals.map(v => v.num)
              const winIdx = winnerIdx(nums, row.higherBetter !== false)

              return (
                <div
                  key={row.label}
                  className={`grid border-b border-edge/40 spec-row ${rowIdx % 2 === 0 ? 'bg-ink-1/40' : ''}`}
                  style={{ gridTemplateColumns: `180px repeat(${cols}, 1fr)`, minWidth: '500px' }}
                >
                  <div className="px-4 py-3 flex items-center gap-2">
                    {row.isAI && (
                      <span className="shrink-0 w-1 h-1 rounded-full bg-ore/50" />
                    )}
                    <span className="font-mono text-[10px] text-zinc-600">{row.label}</span>
                  </div>
                  {vals.map((val, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-l border-edge/40 flex items-center justify-center ${
                        winIdx === i ? 'bg-win/10' : ''
                      }`}
                    >
                      <span className={`font-mono text-sm text-center ${
                        winIdx === i ? 'text-win font-600' : 'text-zinc-600'
                      }`}>
                        {val.display}
                        {winIdx === i && <span className="ml-1 text-[10px] text-win">▲</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Deep-dive link for 2-product compare */}
          {seoSlug && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/compare/${seoSlug}`}
                className="affiliate-btn inline-flex items-center gap-2 px-5 py-2.5 font-sans font-700 text-sm"
              >
                Full In-Depth Comparison
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                Includes verdict, FAQ &amp; buy recommendations
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
