import type { Metadata } from 'next'
import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import HardwareMatcher from '@/components/HardwareMatcher'
import WhyLocalAI from '@/components/WhyLocalAI'
import PersonaFunnels from '@/components/PersonaFunnels'
import CloudROICalculator from '@/components/CloudROICalculator'
import SchemaMarkup from '@/components/SchemaMarkup'
import { buildSpeakableSchema } from '@/lib/schema'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import Link from 'next/link'
import HeroTypewriter from '@/components/HeroTypewriter'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ai-desk.tech' },
}

const CATEGORIES = [
  {
    num: '01',
    slug: 'gpu', label: 'GPUs', sub: 'Discrete cards for max VRAM', stat: 'Up to 16 GB VRAM',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <rect x="2" y="7" width="20" height="10" rx="1" />
        <path d="M6 7V5M10 7V5M14 7V5M18 7V5M6 17v2M10 17v2M14 17v2M18 17v2" />
        <rect x="6" y="9" width="4" height="6" rx="0.5" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    num: '02',
    slug: 'mini-pc', label: 'Mini PCs', sub: 'Compact · always-on · quiet', stat: '70B model capable',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <rect x="3" y="4" width="18" height="13" rx="1" />
        <path d="M8 20h8M12 17v3" />
        <circle cx="12" cy="10.5" r="2.5" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 8v1M12 12v1M9.5 10.5H8.5M15.5 10.5H14.5" strokeWidth={1} />
      </svg>
    ),
  },
  {
    num: '03',
    slug: 'ai-pc', label: 'AI PCs', sub: 'Full desktop · max throughput', stat: 'Highest tokens/s',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <rect x="5" y="2" width="14" height="20" rx="1" />
        <rect x="7" y="5" width="10" height="6" rx="0.5" fill="currentColor" fillOpacity="0.18" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" fillOpacity="0.35" />
        <path d="M9 14h6M9 16h4" strokeWidth={1} />
      </svg>
    ),
  },
  {
    num: '04',
    slug: 'accessory', label: 'Accessories', sub: 'Cables, UPS & cooling', stat: 'From $12',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.18" />
      </svg>
    ),
  },
  {
    num: '05',
    slug: 'dock', label: 'Docks', sub: 'Thunderbolt 4 & USB4', stat: 'Single cable setup',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <rect x="2" y="9" width="20" height="9" rx="1" />
        <path d="M7 9V6M12 9V4M17 9V6" />
        <rect x="5" y="11" width="3" height="2" rx="0.3" fill="currentColor" fillOpacity="0.3" />
        <rect x="10" y="11" width="3" height="2" rx="0.3" fill="currentColor" fillOpacity="0.3" />
        <rect x="16" y="11" width="3" height="2" rx="0.3" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    num: '06',
    slug: 'nas', label: 'NAS', sub: 'AI model weight storage', stat: 'Centralize models',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <rect x="3" y="10" width="18" height="5" rx="1" />
        <rect x="3" y="16" width="18" height="5" rx="1" fill="currentColor" fillOpacity="0.12" />
        <circle cx="18" cy="6.5" r="0.8" fill="currentColor" fillOpacity="0.5" stroke="none" />
        <circle cx="18" cy="12.5" r="0.8" fill="currentColor" fillOpacity="0.5" stroke="none" />
        <circle cx="18" cy="18.5" r="0.8" fill="currentColor" fillOpacity="0.5" stroke="none" />
      </svg>
    ),
  },
  {
    num: '07',
    slug: 'npu-laptop', label: 'NPU Laptops', sub: 'Copilot+ on-device AI', stat: '45+ TOPS NPU',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-ore">
        <path d="M4 5h16a1 1 0 011 1v10H3V6a1 1 0 011-1z" />
        <path d="M1 16h22v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1z" />
        <rect x="9" y="8" width="6" height="5" rx="0.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M11 8V7M13 8V7M11 13v1M13 13v1M9 10H8M16 10h-1" strokeWidth={1} />
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
  { val: '$0',   unit: '/mo',    label: 'vs $50–300 cloud API bill' },
  { val: '<5',   unit: 'ms',     label: 'time to first token, local' },
  { val: '70B',  unit: 'params', label: 'largest model run locally'  },
]


export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-16">
      <SchemaMarkup schema={buildSpeakableSchema(['h1', '.hero-summary', '.key-facts'])} />

      {/* ── HERO ── */}
      <section className="border-b border-edge overflow-hidden">
        {/* Top accent bar */}
        <div className="h-[3px] rule-ember" />

        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px] min-h-0">

          {/* LEFT — Headline + CTAs */}
          <div className="px-6 md:px-10 lg:px-12 py-8 md:py-10 lg:py-14 border-r border-edge flex flex-col gap-8">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ore opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ore" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-subtle)' }}>
                Independent AI Hardware Reviews · {allProducts.length} Products Benchmarked
              </p>
            </div>

            {/* Headline block */}
            <div className="border-l-4 border-ore pl-5 md:pl-8">
              <h1
                className="font-display font-bold tracking-tight text-foreground hero-headline"
                style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}
              >
                The Hardware<br />
                That Runs <HeroTypewriter />
              </h1>
              <p className="text-base md:text-lg leading-relaxed mt-5 max-w-lg hero-summary" style={{ color: 'var(--text-muted)' }}>
                Benchmarked GPUs, Mini PCs, and accessories for LLM inference, Stable Diffusion, and local AI workloads.
              </p>
            </div>

            {/* Mobile-only stat chips */}
            <div className="flex flex-wrap gap-3 lg:hidden">
              {SIDE_STATS.map(s => (
                <div key={s.val} className="flex items-baseline gap-1.5 px-3 py-1.5 border border-ore/20 bg-ore/5">
                  <span className="font-mono font-semibold text-sm text-ore">{s.val}<span className="text-[10px] ml-0.5">{s.unit}</span></span>
                  <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>{s.label}</span>
                </div>
              ))}
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
          <div className="hidden lg:flex flex-col divide-y divide-edge" style={{ background: 'rgb(var(--color-ink-1))' }}>
            {/* Panel header */}
            <div className="px-6 py-3.5 flex items-center justify-between bg-ore/5 border-b border-ore/10">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ore">Why Go Local</span>
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>2026</span>
            </div>

            {/* Stats — large typographic display */}
            {SIDE_STATS.map((s) => (
              <div
                key={s.val}
                className="px-6 py-7 flex flex-col gap-2 group hover:bg-ore/5 transition-colors cursor-default key-facts border-l-2 border-transparent hover:border-ore"
              >
                <p
                  className="font-display font-bold text-foreground leading-none tabular-nums"
                  style={{ fontSize: 'clamp(2.8rem, 5vw, 3.75rem)', letterSpacing: '-0.04em' }}
                >
                  {s.val}
                  <span
                    className="font-mono ml-1.5 text-ore"
                    style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.05rem)', letterSpacing: '0.04em' }}
                  >
                    {s.unit}
                  </span>
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest group-hover:text-ore transition-colors" style={{ color: 'var(--text-subtle)' }}>
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
      <section className="border border-edge overflow-hidden">
        <div className="h-[3px] rule-ember" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-edge bg-ink-1">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">Browse</p>
            <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">
              Shop by Category
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
            {allProducts.length} products reviewed
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-edge">
          {CATEGORIES.map(cat => {
            const count = allProducts.filter(p => p.category === cat.slug).length
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-ink-0 p-7 md:p-8 flex flex-col relative overflow-hidden hover:bg-ore/5 transition-all duration-200 border-b-2 border-b-transparent hover:border-b-ore"
              >
                {/* Number watermark — large, bottom-right */}
                <span
                  className="absolute bottom-2 right-3 font-display font-bold leading-none select-none pointer-events-none"
                  style={{ fontSize: '5rem', color: 'rgb(var(--color-ore) / 0.05)', lineHeight: 1 }}
                >
                  {cat.num}
                </span>

                {/* Icon in bordered container */}
                <div className="w-14 h-14 flex items-center justify-center border border-ore/20 bg-ore/6 mb-5 group-hover:border-ore/40 group-hover:bg-ore/12 transition-all duration-200">
                  {cat.icon}
                </div>

                {/* Label */}
                <p className="font-display font-bold text-xl uppercase text-foreground mb-1.5 group-hover:text-ore transition-colors duration-200 leading-tight">
                  {cat.label}
                </p>

                {/* Sub */}
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-subtle)' }}>{cat.sub}</p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-ore/10 group-hover:bg-ore/20 transition-colors">
                    <span className="font-mono text-[10px] text-ore leading-none">{cat.stat}</span>
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: 'var(--text-subtle)' }}>
                    {count} reviews →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── EDITOR'S PICKS ── */}
      <section className="border border-edge overflow-hidden">
        <div className="h-[3px] rule-ember" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-edge bg-ink-1">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">Top Rated</p>
            <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">
              Editor&apos;s Picks
            </h2>
          </div>
          <Link
            href="/products"
            className="font-mono text-[10px] uppercase tracking-widest hover:text-ore transition-colors"
            style={{ color: 'var(--text-subtle)' }}
          >
            All {allProducts.length} products →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-edge">
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

      {/* ── FROM THE BLOG + GUIDES ── */}
      <section className="border border-edge overflow-hidden">
        <div className="h-[3px] rule-ember" />
        <div className="grid md:grid-cols-2 gap-px bg-edge">
          {/* Blog */}
          <div className="bg-ink-0">
            <div className="px-6 py-4 border-b border-edge bg-ink-1 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">Editorial</p>
                <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">From the Blog</h2>
              </div>
              <Link href="/blog" className="font-mono text-[10px] uppercase tracking-widest hover:text-ore transition-colors" style={{ color: 'var(--text-subtle)' }}>
                All posts →
              </Link>
            </div>
            <div className="divide-y divide-edge">
              {[
                { slug: 'apple-silicon-vs-nvidia-local-ai-2026', title: 'Apple Silicon vs NVIDIA for Local AI in 2026', label: 'Comparison' },
                { slug: 'how-much-vram-for-local-ai', title: 'How Much VRAM Do You Actually Need?', label: 'Guide' },
                { slug: 'local-ai-vs-cloud-ai-cost-2026', title: 'Local AI vs Cloud AI: The Real Cost Breakdown', label: 'Analysis' },
                { slug: 'ollama-vs-lm-studio-vs-jan-2026', title: 'Ollama vs LM Studio vs Jan — Which to Use?', label: 'Comparison' },
              ].map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center gap-4 px-6 py-4 hover:bg-ore/5 transition-colors group">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-ore/20 text-ore shrink-0">{post.label}</span>
                  <p className="font-sans font-semibold text-sm text-foreground group-hover:text-ore transition-colors leading-snug">{post.title}</p>
                  <span className="font-mono text-xs text-ore ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Setup Guides */}
          <div className="bg-ink-0">
            <div className="px-6 py-4 border-b border-edge bg-ink-1 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">Step-by-Step</p>
                <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">Setup Guides</h2>
              </div>
              <Link href="/guides" className="font-mono text-[10px] uppercase tracking-widest hover:text-ore transition-colors" style={{ color: 'var(--text-subtle)' }}>
                All guides →
              </Link>
            </div>
            <div className="divide-y divide-edge">
              {[
                { slug: 'run-llama-3-on-mac-mini-m4', title: 'Run Llama 3 on Mac Mini M4', label: 'macOS' },
                { slug: 'run-stable-diffusion-on-rtx-5070', title: 'Stable Diffusion on RTX 5070', label: 'Windows' },
                { slug: 'run-ollama-on-mini-pc', title: 'Run Ollama on Any Mini PC', label: 'Windows' },
                { slug: 'run-deepseek-r1-locally', title: 'Run DeepSeek R1 Locally', label: 'All OS' },
              ].map(guide => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="flex items-center gap-4 px-6 py-4 hover:bg-ore/5 transition-colors group">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-ore/20 text-ore shrink-0">{guide.label}</span>
                  <p className="font-sans font-semibold text-sm text-foreground group-hover:text-ore transition-colors leading-snug">{guide.title}</p>
                  <span className="font-mono text-xs text-ore ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUYING GUIDE ── */}
      <section className="border border-edge bg-ink-0 overflow-hidden">
        <div className="h-[3px] rule-ember" />
        <div className="border-b border-edge px-8 py-5 bg-ink-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-1">Before You Buy</p>
          <h2 className="font-display font-bold text-xl uppercase tracking-tight text-foreground">
            How to Choose AI Hardware
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>
            Three principles that determine local AI performance
          </p>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-edge">
          {GUIDE.map(item => (
            <div key={item.num} className="p-8 bg-ink-0 hover:bg-ore/4 transition-colors group">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-3">
                Step {item.num}
              </p>
              <h3 className="font-display font-bold text-lg uppercase text-foreground mb-3">
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
