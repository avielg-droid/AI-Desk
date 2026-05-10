import type { Metadata } from 'next'
import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import HardwareMatcher from '@/components/HardwareMatcher'
import WhyLocalAI from '@/components/WhyLocalAI'
import PersonaFunnels from '@/components/PersonaFunnels'
import CloudROICalculator from '@/components/CloudROICalculator'
import SchemaMarkup from '@/components/SchemaMarkup'
import { buildSpeakableSchema } from '@/lib/schema'
import Link from 'next/link'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ai-desk.tech' },
}

const CATEGORIES = [
  {
    slug: 'gpu', label: 'GPUs', sub: 'Discrete cards', stat: '16 GB VRAM max',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-ore opacity-70 mb-3">
        <rect x="2" y="7" width="20" height="10" rx="1" />
        <path d="M6 7V5M10 7V5M14 7V5M18 7V5M6 17v2M10 17v2M14 17v2M18 17v2" />
        <rect x="6" y="9" width="4" height="6" rx="0.5" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    slug: 'mini-pc', label: 'Mini PCs', sub: 'Compact workstations', stat: '70B capable',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-ore opacity-70 mb-3">
        <rect x="3" y="4" width="18" height="13" rx="1" />
        <path d="M8 20h8M12 17v3" />
        <circle cx="12" cy="10.5" r="2.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 8v1M12 12v1M9.5 10.5H8.5M15.5 10.5H14.5" strokeWidth={1} />
      </svg>
    ),
  },
  {
    slug: 'ai-pc', label: 'AI PCs', sub: 'Full desktop rigs', stat: 'Max throughput',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-ore opacity-70 mb-3">
        <rect x="5" y="2" width="14" height="20" rx="1" />
        <rect x="7" y="5" width="10" height="6" rx="0.5" fill="currentColor" fillOpacity="0.12" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" fillOpacity="0.3" />
        <path d="M9 14h6M9 16h4" strokeWidth={1} />
      </svg>
    ),
  },
  {
    slug: 'accessory', label: 'Accessories', sub: 'Cables, UPS & more', stat: 'Protect your rig',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-ore opacity-70 mb-3">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.12" />
      </svg>
    ),
  },
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
    <div className="space-y-16">
      <SchemaMarkup schema={buildSpeakableSchema(['h1', '.hero-summary', '.key-facts'])} />

      {/* ── HERO ── */}
      <section className="border-b border-edge overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px] min-h-0">

          {/* LEFT — Headline + CTAs */}
          <div className="px-6 md:px-10 lg:px-12 py-8 md:py-10 lg:py-14 border-r border-edge flex flex-col justify-between gap-10">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ore opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ore" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-subtle)' }}>
                Independent AI Hardware Reviews · {allProducts.length} Products Benchmarked
              </p>
            </div>

            {/* Headline block */}
            <div className="border-l-2 border-ore pl-5 md:pl-7">
              <h1
                className="font-display font-bold tracking-tight text-foreground hero-headline"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}
              >
                The Hardware<br />
                <span className="text-ore">That Runs</span><br />
                AI.
              </h1>
              <p className="text-base md:text-lg leading-relaxed mt-5 max-w-xl hero-summary" style={{ color: 'var(--text-muted)' }}>
                Benchmarked GPUs, Mini PCs, and accessories for LLM inference, Stable Diffusion, and local AI workloads.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="forge-btn inline-flex items-center gap-3 px-7 py-3.5 font-sans font-semibold text-sm"
              >
                Browse Hardware
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/best"
                className="font-mono text-sm transition-colors duration-150 hover:text-ore"
                style={{ color: 'var(--text-muted)' }}
              >
                Find your setup →
              </Link>
            </div>

          </div>

          {/* RIGHT — Benchmark data panel */}
          <div className="hidden lg:flex flex-col divide-y divide-edge bg-ink-1">
            {/* Panel header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-subtle)' }}>Key Benchmarks</span>
              <span className="font-mono text-[9px] text-ore uppercase tracking-widest">2026</span>
            </div>

            {/* Stats — large typographic display */}
            {SIDE_STATS.map((s) => (
              <div key={s.val} className="px-6 py-6 flex flex-col gap-1 hover:bg-ink-2 transition-colors key-facts">
                <p
                  className="font-display font-bold text-foreground leading-none tabular-nums"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}
                >
                  {s.val}
                  <span
                    className="font-mono ml-2 text-ore"
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)', letterSpacing: '0.05em' }}
                  >
                    {s.unit}
                  </span>
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                  {s.label}
                </p>
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="px-6 py-4 mt-auto">
              <Link
                href="/compare"
                className="font-mono text-[10px] uppercase tracking-widest hover:text-ore transition-colors"
                style={{ color: 'var(--text-subtle)' }}
              >
                Compare all hardware →
              </Link>
            </div>
          </div>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-edge border border-edge">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-ink-0 p-6 flex flex-col hover:bg-ink-1 transition-colors duration-200 border-t-2 border-t-transparent hover:border-t-ore"
            >
              {cat.icon}
              <p className="font-display font-bold text-lg uppercase text-foreground mb-1 group-hover:text-ore transition-colors duration-200">
                {cat.label}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-subtle)' }}>{cat.sub}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3 md:gap-px md:bg-ink-3 border border-edge">
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
      <section className="border border-edge bg-ink-0 overflow-hidden">
        <div className="h-[2px] rule-ember" />
        <div className="border-b border-edge px-8 py-5">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-foreground">
            How to Choose AI Hardware
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>
            Three principles that determine local AI performance
          </p>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
          {GUIDE.map(item => (
            <div key={item.num} className="p-8 bg-ink-0 hover:bg-ink-1 transition-colors">
              <p className="font-mono text-5xl font-semibold text-ore/10 mb-4 leading-none select-none">
                {item.num}
              </p>
              <h3 className="font-display font-bold text-lg uppercase text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
