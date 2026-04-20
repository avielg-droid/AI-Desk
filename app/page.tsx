import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import HardwareMatcher from '@/components/HardwareMatcher'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { slug: 'gpu',       label: 'GPUs',        sub: 'Discrete cards',       stat: '24 GB VRAM max'  },
  { slug: 'mini-pc',  label: 'Mini PCs',     sub: 'Compact workstations', stat: '70B capable'     },
  { slug: 'ai-pc',    label: 'AI PCs',       sub: 'Full desktop rigs',    stat: 'Max throughput'  },
  { slug: 'accessory',label: 'Accessories',  sub: 'Cooling & peripherals', stat: 'Thermal control' },
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

const SIDE_STATS = [
  { val: '273',  unit: 'GB/s',   label: 'M4 Pro bandwidth'  },
  { val: '70B',  unit: 'params', label: 'Max local model'   },
  { val: '20W',  unit: 'TDP',    label: 'M4 idle draw'      },
]

const HERO_GRID = [
  { src: '/products/apple-mac-mini-m4-pro.jpg',  alt: 'Apple Mac Mini M4 Pro',     href: '/products/apple-mac-mini-m4-pro'  },
  { src: '/products/kamrui-hyper-h2.jpg',        alt: 'KAMRUI Hyper H2',           href: '/products/kamrui-hyper-h2'        },
  { src: '/products/geekom-it12.jpg',            alt: 'GEEKOM IT12',               href: '/products/geekom-it12'            },
  { src: '/products/gmktec-nucbox-m5-pro.webp',  alt: 'GMKtec NucBox M5 Pro',      href: '/products/gmktec-nucbox-m5-pro'   },
]

export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-20">

      {/* ── HERO ── */}
      <section className="relative border border-edge bg-ink-1 overflow-hidden">
        {/* Ember top rule */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-ore" />
        {/* Crosshatch grid */}
        <div className="absolute inset-0 bg-crosshatch" />

        <div className="relative flex flex-col lg:flex-row lg:items-stretch">

          {/* ── Left: text ── */}
          <div className="flex-1 px-8 md:px-14 py-16 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore">Est. 2026</span>
              <span className="h-px w-12 bg-ore" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {allProducts.length} Products Reviewed
              </span>
            </div>

            <h1 className="font-display font-900 text-5xl md:text-7xl leading-[1.05] tracking-tight text-foreground mb-6">
              Hardware<br />
              <em className="text-ore not-italic">for the</em><br />
              AI Age
            </h1>

            <p className="font-sans text-base md:text-lg text-zinc-600 max-w-xl leading-relaxed mb-8">
              Independent reviews of Mini PCs and AI accessories — benchmarked for LLM inference and local AI workloads.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-7 py-3 bg-ore font-display font-800 text-sm uppercase tracking-widest text-ink-0 hover:bg-[#c74f14] transition-colors"
              >
                Browse All Products
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/categories/mini-pc"
                className="inline-flex items-center gap-2 px-7 py-3 border border-edge font-mono text-xs uppercase tracking-widest text-zinc-600 hover:border-ore hover:text-ore transition-colors"
              >
                Mini PC Reviews
              </Link>
            </div>

            {/* Inline stats */}
            <div className="flex items-center gap-8 border-t border-edge pt-6">
              {SIDE_STATS.map(s => (
                <div key={s.val}>
                  <p className="font-mono font-500 text-xl text-ore leading-none">
                    {s.val}<span className="text-xs text-slate-500 ml-1">{s.unit}</span>
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 2×2 product grid ── */}
          <div className="lg:w-[420px] xl:w-[480px] shrink-0 border-t lg:border-t-0 lg:border-l border-edge">
            <div className="grid grid-cols-2 h-full">
              {HERO_GRID.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative bg-ink-1 flex items-center justify-center p-6 aspect-square overflow-hidden
                    hover:bg-ink-2 transition-colors
                    ${i % 2 === 0 ? 'border-r border-edge' : ''}
                    ${i < 2 ? 'border-b border-edge' : ''}
                  `}
                >
                  {/* Corner label */}
                  <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-widest text-ore opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

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
              className="group bg-ink-1 p-6 flex flex-col hover:bg-ink-2 transition-colors"
            >
              <p className="font-display font-800 text-xl uppercase text-foreground mb-1 group-hover:text-ore transition-colors">
                {cat.label}
              </p>
              <p className="font-body text-xs text-slate-500 mb-4">{cat.sub}</p>
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
        <div className="grid md:grid-cols-3 gap-px bg-edge border border-edge">
          {featured.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ── HARDWARE MATCHER ── */}
      <HardwareMatcher products={allProducts} />

      {/* ── BUYING GUIDE ── */}
      <section className="border border-edge bg-ink-1 overflow-hidden">
        {/* Ember top rule */}
        <div className="h-[2px] bg-ore" />
        <div className="border-b border-edge px-8 py-5">
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            How to Choose AI Hardware
          </h2>
          <p className="font-body text-sm text-slate-500 mt-1">
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
              <p className="font-body text-sm text-zinc-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
