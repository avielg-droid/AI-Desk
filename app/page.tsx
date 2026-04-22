import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import HardwareMatcher from '@/components/HardwareMatcher'
import WhyLocalAI from '@/components/WhyLocalAI'
import PersonaFunnels from '@/components/PersonaFunnels'
import CloudROICalculator from '@/components/CloudROICalculator'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'gpu',       label: 'GPUs',        sub: 'Discrete cards',       stat: '16 GB VRAM max'  },
  { slug: 'mini-pc',  label: 'Mini PCs',     sub: 'Compact workstations', stat: '70B capable'     },
  { slug: 'ai-pc',    label: 'AI PCs',       sub: 'Full desktop rigs',    stat: 'Max throughput'  },
  { slug: 'accessory',label: 'Accessories',  sub: 'Cables, UPS & more',   stat: 'Protect your rig'},
]

const GUIDE = [
  {
    num: '01',
    title: 'Memory Capacity First',
    body: 'VRAM or unified memory determines which models you can run. 7B needs ~8 GB; 13B needs ~16 GB; 70B needs ~40 GB+.',
  },
  {
    num: '02',
    title: 'Bandwidth = Speed',
    body: 'Tokens/second scales with memory bandwidth. 672 GB/s GDDR7 (RTX 5070) generates roughly 8× more tokens per second than a budget mini PC at 68 GB/s.',
  },
  {
    num: '03',
    title: 'Pick Your OS First',
    body: 'macOS + Ollama is zero-friction. NVIDIA on Windows/Linux has the broadest software support. AMD GPU requires Linux + ROCm for best results.',
  },
]

const SIDE_STATS = [
  { val: '672',  unit: 'GB/s',   label: 'RTX 5070 bandwidth' },
  { val: '70B',  unit: 'params', label: 'Max local model'    },
  { val: '20W',  unit: 'TDP',    label: 'M4 idle draw'       },
]

export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-20">

      {/* ── HERO ── */}
      <section className="relative border border-edge min-h-[480px] flex items-center overflow-hidden" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}>
        {/* Aurora top rule */}
        <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
        {/* Crosshatch — white lines on void */}
        <div className="absolute inset-0 bg-crosshatch" />
        {/* Radial glow behind title */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)' }} />

        <div className="relative px-8 md:px-14 py-16 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore">Est. 2026</span>
            <span className="h-px w-12" style={{ background: 'var(--aurora-gradient)' }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              {allProducts.length} Products Reviewed
            </span>
          </div>

          <h1 className="font-display font-700 text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-foreground mb-6">
            Hardware<br />
            <span className="text-ore">for the</span><br />
            AI Age
          </h1>

          <p className="font-sans text-base md:text-lg text-zinc-600 max-w-xl leading-relaxed mb-10">
            Independent reviews of GPUs, Mini PCs, and AI accessories — benchmarked for LLM inference, Stable Diffusion, and local AI workloads.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Primary CTA — aurora bordered */}
            <Link
              href="/products"
              className="affiliate-btn inline-flex items-center gap-3 px-7 py-3.5 font-sans font-700 text-base tracking-tight"
            >
              Browse All Products
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="/categories/mini-pc"
              className="nav-cta inline-flex items-center gap-2 px-7 py-3 border border-edge font-mono text-xs uppercase tracking-widest text-zinc-600 hover:border-ore/50 hover:text-ore"
            >
              Mini PC Reviews
            </Link>
          </div>
        </div>

        {/* Side stats */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-6">
          {SIDE_STATS.map(s => (
            <div key={s.val} className="text-right">
              <p className="font-mono font-500 text-2xl text-ore leading-none">
                {s.val}
                <span className="text-sm text-zinc-600 ml-1">{s.unit}</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY LOCAL AI ── */}
      <WhyLocalAI />

      {/* ── CATEGORIES ── */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            Shop by Category
          </h2>
          <span className="h-px flex-1 bg-edge" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-3 border border-edge">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-ink-1 p-6 flex flex-col hover:bg-ink-2 transition-colors"
            >
              <p className="font-display font-800 text-xl uppercase text-foreground mb-1 group-hover:text-ore transition-colors">
                {cat.label}
              </p>
              <p className="font-sans text-xs text-slate-500 mb-4">{cat.sub}</p>
              <p className="font-mono text-[10px] text-ore mt-auto">{cat.stat}</p>
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
            <span className="h-px w-16 bg-edge" />
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-ore transition-colors"
          >
            All {allProducts.length} products →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-ink-3 border border-edge">
          {featured.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ── PERSONA FUNNELS ── */}
      <PersonaFunnels />

      {/* ── CLOUD vs LOCAL ROI ── */}
      <CloudROICalculator />

      {/* ── CAN I RUN IT? ── */}
      <HardwareMatcher products={allProducts} />

      {/* ── BUYING GUIDE ── */}
      <section className="border border-edge bg-ink-1 overflow-hidden">
        <div className="h-[2px] bg-ore" />
        <div className="border-b border-edge px-8 py-5">
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            How to Choose AI Hardware
          </h2>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Three principles that determine local AI performance
          </p>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
          {GUIDE.map(item => (
            <div key={item.num} className="p-8">
              <p className="font-mono text-5xl font-500 text-ore/15 mb-4 leading-none select-none">
                {item.num}
              </p>
              <h3 className="font-display font-800 text-xl uppercase text-foreground mb-2">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-zinc-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
