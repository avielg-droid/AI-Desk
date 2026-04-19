import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'gpu', label: 'GPUs', sub: 'Discrete cards', stat: '24 GB VRAM max' },
  { slug: 'mini-pc', label: 'Mini PCs', sub: 'Compact workstations', stat: '70B capable' },
  { slug: 'ai-pc', label: 'AI PCs', sub: 'Full desktop rigs', stat: 'Max throughput' },
  { slug: 'accessory', label: 'Accessories', sub: 'Cooling & peripherals', stat: 'Thermal control' },
]

const GUIDE = [
  {
    num: '01',
    title: 'Memory Capacity First',
    body: 'VRAM or unified memory determines which models you can run. 7B needs ~4–8 GB; 13B needs ~8–16 GB; 70B needs ~40 GB+.',
  },
  {
    num: '02',
    title: 'Bandwidth = Speed',
    body: 'Tokens/second scales with memory bandwidth. RTX 4090 at 1,008 GB/s runs 70B roughly 15× faster than a budget mini PC at 68 GB/s.',
  },
  {
    num: '03',
    title: 'Pick Your OS First',
    body: 'macOS + Ollama is zero-friction. NVIDIA on Windows/Linux has the broadest software support. AMD GPU = Linux + ROCm only.',
  },
]

export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-20">

      {/* ── HERO ── */}
      <section className="relative rounded-2xl overflow-hidden border border-edge bg-ink-1 min-h-[420px] flex items-center">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dot-grid opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-1 via-ink-1/90 to-ore/8" />
        {/* Top + bottom accent lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ore to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-edge to-transparent" />

        <div className="relative px-8 md:px-14 py-16 max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore">
              Est. 2026
            </span>
            <span className="h-px w-12 bg-ore/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {allProducts.length} Products Reviewed
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display font-900 text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight text-foreground uppercase mb-6">
            Hardware<br />
            <span className="text-ore">for the</span><br />
            AI Age
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed mb-10">
            Independent reviews of GPUs, Mini PCs, and AI accessories — benchmarked for LLM inference, Stable Diffusion, and local AI workloads.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="btn-shimmer inline-flex items-center gap-2 px-7 py-3 rounded-lg font-display font-700 text-sm uppercase tracking-widest text-white shadow-lg shadow-ore/20"
            >
              Browse All Products
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/categories/gpu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-edge font-mono text-xs uppercase tracking-widest text-slate-400 hover:border-ore/40 hover:text-ore transition-colors"
            >
              GPU Reviews
            </Link>
          </div>
        </div>

        {/* Side stat */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-6">
          {[
            { val: '1008', unit: 'GB/s', label: 'RTX 4090 bandwidth' },
            { val: '70B', unit: 'params', label: 'Max local model' },
            { val: '20W', unit: 'TDP', label: 'M4 idle draw' },
          ].map(s => (
            <div key={s.val} className="text-right">
              <p className="font-mono font-medium text-2xl text-data leading-none">
                {s.val}<span className="text-sm text-slate-500 ml-1">{s.unit}</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            Shop by Category
          </h2>
          <span className="h-px flex-1 bg-edge/60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="card-glow group relative rounded-xl border border-edge bg-ink-1 p-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="font-display font-800 text-xl uppercase text-foreground mb-1">{cat.label}</p>
              <p className="text-xs text-slate-500 mb-3">{cat.sub}</p>
              <p className="font-mono text-[10px] text-data">{cat.stat}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── EDITOR'S PICKS ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
              Editor&apos;s Picks
            </h2>
            <span className="h-px w-16 bg-edge/60" />
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-widest text-ore/70 hover:text-ore transition-colors"
          >
            All {allProducts.length} products →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ── BUYING GUIDE ── */}
      <section className="rounded-2xl border border-edge bg-ink-1 overflow-hidden">
        <div className="border-b border-edge px-8 py-5">
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            How to Choose AI Hardware
          </h2>
          <p className="text-sm text-slate-500 mt-1">Three principles that determine local AI performance</p>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
          {GUIDE.map(item => (
            <div key={item.num} className="p-8">
              <p className="font-mono text-4xl font-medium text-ore/20 mb-4 leading-none">{item.num}</p>
              <h3 className="font-display font-700 text-lg uppercase text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
