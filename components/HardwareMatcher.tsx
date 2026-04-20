'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AffiliateButton from './AffiliateButton'
import type { Product } from '@/types/product'

// ── Task definitions ─────────────────────────────────────────────────────────

const TASKS = [
  {
    id: 'llm-7b',
    label: 'Run a 7B/8B LLM',
    sub: 'Llama 3.1 8B · Mistral 7B · Phi-3.5',
    minGb: 8,
    note: 'Minimum 8 GB memory required',
  },
  {
    id: 'llm-13b',
    label: 'Run a 13B LLM',
    sub: 'Llama 2 13B · Vicuna 13B · Gemma 12B',
    minGb: 16,
    note: 'Minimum 16 GB memory required',
  },
  {
    id: 'llm-70b',
    label: 'Run a 70B LLM',
    sub: 'Llama 3 70B · Qwen 72B · DeepSeek 67B',
    minGb: 40,
    note: 'Minimum 40 GB memory required',
  },
  {
    id: 'image-gen',
    label: 'Stable Diffusion / Flux',
    sub: 'SDXL · Flux.1-dev · SD 3.5 Large',
    minGb: 8,
    note: 'Minimum 8 GB VRAM or unified memory',
  },
] as const

type TaskId = (typeof TASKS)[number]['id']

// ── Memory helpers ────────────────────────────────────────────────────────────

function effectiveMemory(product: Product): number {
  const s = product.specs
  return s.vram_gb ?? s.unified_memory_gb ?? 0
}

function memoryLabel(product: Product): string {
  const s = product.specs
  if (s.vram_gb) return `${s.vram_gb} GB VRAM`
  if (s.unified_memory_gb) return `${s.unified_memory_gb} GB Unified`
  return '—'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TaskCard({
  task,
  selected,
  onClick,
}: {
  task: (typeof TASKS)[number]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-xl border p-5 transition-all duration-200 w-full group
        ${selected
          ? 'border-ore bg-ore/8 shadow-[0_0_0_1px_rgba(249,115,22,0.3),0_4px_24px_rgba(249,115,22,0.12)]'
          : 'border-edge bg-ink-1 hover:border-ore/40 hover:bg-ink-2'
        }`}
    >
      {/* Selected top-line */}
      {selected && (
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-ore to-transparent" />
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`font-display font-800 text-base uppercase leading-tight transition-colors
          ${selected ? 'text-ore' : 'text-foreground group-hover:text-ore/80'}`}>
          {task.label}
        </p>
        <span className={`font-mono text-[9px] uppercase tracking-widest shrink-0 mt-0.5 px-1.5 py-0.5 rounded border transition-colors
          ${selected
            ? 'text-ore border-ore/40 bg-ore/10'
            : 'text-slate-500 border-edge'
          }`}>
          ≥{task.minGb} GB
        </span>
      </div>

      <p className="font-mono text-[10px] text-slate-500 leading-relaxed">{task.sub}</p>

      {selected && (
        <p className="font-mono text-[9px] uppercase tracking-widest text-ore/60 mt-3">
          ▶ Scanning hardware…
        </p>
      )}
    </button>
  )
}

function MatchCard({ product, memGb }: { product: Product; memGb: number }) {
  const mem = effectiveMemory(product)
  const headroom = mem - memGb
  const headroomPct = Math.min(100, (mem / (memGb * 2)) * 100)

  return (
    <div className="relative rounded-xl border border-win/30 bg-win/5 overflow-hidden
      hover:border-win/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.08)] transition-all duration-200">

      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-win/50 to-transparent" />

      <div className="p-5">
        {/* Status badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-win border border-win/30 bg-win/8 rounded px-2 py-0.5">
            ✓ Compatible
          </span>
          <span className="font-mono text-[10px] text-data">{memoryLabel(product)}</span>
        </div>

        {/* Product name */}
        <h3 className="font-display font-800 text-base uppercase leading-tight text-foreground mb-1">
          <Link href={`/products/${product.slug}`} className="hover:text-ore transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-4">
          {product.brand} · {product.category.replace('-', ' ')}
        </p>

        {/* Headroom bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Memory headroom</span>
            <span className="font-mono text-[10px] text-win">+{headroom} GB spare</span>
          </div>
          <div className="h-1 rounded-full bg-edge overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-win/60 to-win transition-all duration-500"
              style={{ width: `${headroomPct}%` }}
            />
          </div>
        </div>

        <AffiliateButton href={product.affiliateUrl} />
      </div>
    </div>
  )
}

function IncompatibleCard({ product }: { product: Product }) {
  return (
    <div className="relative rounded-xl border border-edge/40 bg-ink-1/50 overflow-hidden opacity-50">
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-loss/70 border border-loss/20 bg-loss/5 rounded px-2 py-0.5">
            ✗ Insufficient
          </span>
          <span className="font-mono text-[10px] text-slate-600">{memoryLabel(product)}</span>
        </div>
        <h3 className="font-display font-800 text-base uppercase leading-tight text-slate-600">
          {product.name}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-700 mt-1">
          {product.brand} · {product.category.replace('-', ' ')}
        </p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HardwareMatcher({ products }: { products: Product[] }) {
  const [activeId, setActiveId] = useState<TaskId | null>(null)
  const [visible, setVisible] = useState(false)

  const activeTask = TASKS.find(t => t.id === activeId)

  // Fade results in/out on task change
  useEffect(() => {
    if (!activeId) return
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [activeId])

  const compatible = activeTask
    ? products.filter(p => effectiveMemory(p) >= activeTask.minGb)
    : []
  const incompatible = activeTask
    ? products.filter(p => effectiveMemory(p) > 0 && effectiveMemory(p) < activeTask.minGb)
    : []

  return (
    <section className="rounded-2xl border border-edge bg-ink-1 overflow-hidden">

      {/* Header */}
      <div className="relative border-b border-edge px-8 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-15" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-data/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-data">
              Compatibility Checker
            </span>
            <span className="h-px w-8 bg-data/30" />
            <span className="font-mono text-[10px] text-slate-600">{products.length} products indexed</span>
          </div>
          <h2 className="font-display font-900 text-3xl md:text-4xl uppercase text-foreground">
            Can I Run It?
          </h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-lg">
            Select an AI workload to instantly see which hardware can handle it.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* Task selector */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3">
            01 — Select Your Workload
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASKS.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                selected={activeId === task.id}
                onClick={() => setActiveId(task.id)}
              />
            ))}
          </div>
        </div>

        {/* Results */}
        {!activeTask && (
          <div className="rounded-xl border border-dashed border-edge/60 py-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">
              Awaiting input
            </p>
            <p className="text-sm text-slate-600">Select a workload above to scan compatible hardware</p>
          </div>
        )}

        {activeTask && (
          <div
            className="space-y-6 transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">
                  02 — Compatible Hardware
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="text-win font-medium">{compatible.length}</span> of {products.filter(p => effectiveMemory(p) > 0).length} products meet the{' '}
                  <span className="font-mono text-data">{activeTask.minGb} GB</span> requirement
                </p>
              </div>
              {compatible.length > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-win border border-win/30 bg-win/8 rounded px-2 py-1">
                  {compatible.length} compatible
                </span>
              )}
            </div>

            {/* Compatible grid */}
            {compatible.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatible.map(product => (
                  <MatchCard key={product.slug} product={product} memGb={activeTask.minGb} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-loss/20 bg-loss/5 p-6 text-center">
                <p className="font-display font-800 text-lg uppercase text-loss mb-1">No matches found</p>
                <p className="text-sm text-zinc-600 mb-4">
                  This workload requires ≥{activeTask.minGb} GB — none of our current seed products qualify.
                </p>
                <Link
                  href="/products"
                  className="font-mono text-xs uppercase tracking-widest text-ore hover:text-ore/80 transition-colors"
                >
                  Browse all products →
                </Link>
              </div>
            )}

            {/* Incompatible section — collapsed/dimmed */}
            {incompatible.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-3">
                  Insufficient memory for this workload ({incompatible.length})
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {incompatible.map(product => (
                    <IncompatibleCard key={product.slug} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Spec note */}
            <p className="font-mono text-[10px] text-slate-600 border-t border-edge/50 pt-4">
              Note: {activeTask.note}. Actual performance depends on quantization, OS, and software stack.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
