import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/products'
import { buildBreadcrumbSchema, buildItemListSchema, buildFAQSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types/product'

export const revalidate = 3600

const CATEGORY_META: Record<Category, { title: string; description: string; h1: string; lede: string; stats: { val: string; label: string }[]; pick: { label: string; reason: string }; faq: { q: string; a: string }[] }> = {
  'gpu': {
    title: 'Best GPUs for Local AI (2026)',
    description: 'Expert reviews of the best discrete GPUs for running LLMs and Stable Diffusion locally in 2026. Benchmarked tokens-per-second, VRAM, and power draw on real hardware.',
    h1: 'Best GPUs for Local AI',
    lede: 'Memory bandwidth matters more than CUDA cores. More GB/s = more tokens per second.',
    stats: [
      { val: '672 GB/s', label: 'RTX 5070 bandwidth' },
      { val: '~120 t/s', label: 'Llama 3.1 8B speed' },
      { val: '12–16 GB', label: 'VRAM sweet spot' },
    ],
    pick: { label: 'Top Pick: RTX 5070', reason: '672 GB/s · 120 t/s · $549' },
    faq: [
      { q: 'What is the best GPU for running local AI in 2026?', a: 'The RTX 5070 is the best GPU for local AI in 2026. It has 12 GB GDDR7 memory at 672 GB/s bandwidth — the highest bandwidth-per-dollar on the market — and achieves ~120 tokens per second on Llama 3.1 8B.' },
      { q: 'How much VRAM do I need for local AI?', a: 'You need at least 8 GB VRAM for 7B models (Q4 quantized), 12–16 GB for 13B models, and 40+ GB for 70B models. Memory bandwidth matters as much as capacity — more GB/s means faster token generation.' },
      { q: 'Is AMD or NVIDIA better for local AI?', a: 'NVIDIA is better for Windows users due to broader software support. AMD GPUs (RX 9060 XT, RX 7900 XTX) work well on Linux with ROCm but have limited Windows compatibility for AI workloads.' },
    ],
  },
  'mini-pc': {
    title: 'Best Mini PCs for Local AI (2026)',
    description: 'Compact AI workstations reviewed for local LLM inference, Stable Diffusion, and home AI servers. Real tokens-per-second benchmarks on every device.',
    h1: 'Best Mini PCs for Local AI',
    lede: 'Silent, always-on, and powerful enough for 70B models. The most practical local AI setup.',
    stats: [
      { val: '273 GB/s', label: 'M4 Pro bandwidth' },
      { val: '65 t/s', label: 'Llama 3.1 8B speed' },
      { val: '20–35 W', label: 'idle power draw' },
    ],
    pick: { label: 'Top Pick: Mac Mini M4 Pro', reason: '273 GB/s · 65 t/s · runs 70B' },
    faq: [
      { q: 'What is the best mini PC for running local AI?', a: 'The Mac Mini M4 Pro (24 GB) is the best mini PC for local AI. It delivers 273 GB/s unified memory bandwidth and 65 tokens per second on Llama 3.1 8B — fast enough for real-time conversation — while drawing only 30W and running 70B models.' },
      { q: 'Can a mini PC run 70B language models?', a: 'Yes. The Mac Mini M4 Pro with 24 GB unified memory can run 70B Q4 quantized models at around 8–12 tokens per second. Windows mini PCs with DDR5 RAM can also run 70B models via CPU inference, but significantly slower.' },
      { q: 'How does Apple Silicon compare to Windows mini PCs for AI?', a: 'Apple Silicon (M4 Pro) has 273 GB/s unified memory bandwidth vs ~68 GB/s for Windows DDR5 mini PCs — roughly 4× faster for LLM inference. However, Windows mini PCs support external NVIDIA GPUs for those who want discrete GPU performance.' },
    ],
  },
  'ai-pc': {
    title: 'Best AI PCs (2026)',
    description: 'Full desktop AI workstations reviewed for local LLM training and inference workloads.',
    h1: 'Best AI PCs for Local Machine Learning',
    lede: 'GPU upgradability and PCIe bandwidth for workloads that Mini PCs cannot handle.',
    stats: [
      { val: '2×', label: 'multi-GPU support' },
      { val: '70B+', label: 'models with CPU offload' },
      { val: 'PCIe 5', label: 'GPU bandwidth' },
    ],
    pick: { label: 'Best use case: multi-GPU rigs', reason: 'Upgradable · PCIe bandwidth · CPU offload' },
    faq: [
      { q: 'When does a full AI PC make more sense than a mini PC?', a: 'A full AI PC makes sense when you need GPU upgradability, multiple GPUs, or maximum throughput. If you plan to run multiple models simultaneously or need more than 24 GB VRAM, a full tower with discrete GPU is the better choice over a mini PC.' },
    ],
  },
  'accessory': {
    title: 'Best AI Accessories (2026)',
    description: 'Cooling solutions, cables, and peripherals for optimizing your local AI workstation.',
    h1: 'Best Accessories for AI Workstations',
    lede: 'AI inference runs at 100% GPU utilization for minutes. Thermal throttling kills tokens per second.',
    stats: [
      { val: '−20%', label: 'tokens/s when throttled' },
      { val: '40 GB', label: '70B model file size' },
      { val: '$12+', label: 'starting price' },
    ],
    pick: { label: 'Priority: UPS + GPU brace', reason: 'Protect uptime · prevent PCIe sag' },
    faq: [
      { q: 'What accessories do I need for a local AI workstation?', a: 'The most important accessories are a UPS (uninterruptible power supply) to protect against outages during long inference runs, a GPU brace to prevent PCIe slot sag on heavy cards, and fast NVMe storage for quick model loading. A 70B model is ~40 GB — a slow drive adds 30–60 seconds to load time.' },
      { q: 'Does cooling affect AI inference performance?', a: 'Yes. A GPU running at thermal throttle loses 15–20% tokens per second compared to a properly cooled card at the same power limit. AI inference runs at 80–100% GPU utilization continuously — unlike gaming which spikes and relaxes — making cooling critical.' },
    ],
  },
  'dock': {
    title: 'Best Thunderbolt Docks for AI Workstations (2026)',
    description: 'Thunderbolt 4 and USB4 docking stations for Mac Mini, mini PCs, and AI workstations. Single-cable docking with dual 4K, fast Ethernet, and up to 100W charging.',
    h1: 'Best Thunderbolt 4 Docks',
    lede: 'One cable: power, dual 4K, and Ethernet. Essential for Mac Mini and mini PC setups.',
    stats: [
      { val: '2.5GbE', label: 'for fast NAS loading' },
      { val: '98–100 W', label: 'laptop charging' },
      { val: 'TB4', label: 'protocol' },
    ],
    pick: { label: 'Top Pick: CalDigit TS4', reason: '18 ports · 98W · 2.5GbE · $299' },
    faq: [
      { q: 'What is the best Thunderbolt 4 dock for Mac Mini M4 Pro?', a: 'The CalDigit TS4 is the best Thunderbolt 4 dock for Mac Mini M4 Pro. It provides 18 ports including 2.5GbE networking, 98W charging, and dual 6K display support over a single cable. At $299 it is the most capable dock for a Mac Mini AI workstation.' },
      { q: 'Why does Ethernet speed matter for a Thunderbolt dock?', a: '2.5GbE Ethernet (available on CalDigit TS4 and Kensington SD5700T) loads AI model weights from a NAS roughly 3× faster than Gigabit Ethernet. For a 40 GB 70B model, 2.5GbE saves ~2 minutes per load compared to Gigabit.' },
      { q: 'Do Thunderbolt 4 docks work with Windows mini PCs?', a: 'Yes, with caveats. Windows mini PCs with certified Thunderbolt 4 ports (like GEEKOM AI A7 Max) get full compatibility. Mini PCs with USB4 but not certified TB4 may have reduced display or charging performance — check your mini PC spec sheet before buying.' },
    ],
  },
  'nas': {
    title: 'Best NAS for Local AI Model Storage (2026)',
    description: 'Network-attached storage devices for housing LLM model weights and AI datasets locally. Reviewed for storage bays, Ethernet speed, and AI inference capability.',
    h1: 'Best NAS for AI Model Storage',
    lede: 'Store model weights once, load from any machine on your network. No duplication.',
    stats: [
      { val: '10GbE', label: 'fastest model delivery' },
      { val: '4-bay', label: 'recommended config' },
      { val: '12 TB', label: 'usable in RAID 5' },
    ],
    pick: { label: 'Top Pick: Synology DS925+', reason: '4-bay · 2.5GbE · best software · $500' },
    faq: [
      { q: 'What is the best NAS for storing local AI models?', a: 'The Synology DS925+ is the best NAS for local AI model storage. It offers 4 bays (12 TB usable in RAID 5 with 4×4TB drives), dual 2.5GbE networking, and DSM software that is the most reliable in the category. For faster loading, the UGREEN DXP4800 Plus adds 10GbE.' },
      { q: 'Does NAS Ethernet speed affect AI model loading?', a: 'Yes significantly. A 40 GB 70B model takes ~2 minutes to load over Gigabit Ethernet, ~45 seconds over 2.5GbE, and ~18 seconds over 10GbE. If you frequently switch between large models, 10GbE is worth the premium.' },
      { q: 'How much storage do I need on a NAS for AI models?', a: 'Plan for 1–2 TB per dozen models you want to store. A 70B Q4 model is ~40 GB, a 13B model is ~8 GB, and a 7B model is ~5 GB. A 4-bay NAS with 4×4TB drives gives 12 TB usable in RAID 5 — enough for 300+ 7B models or 30 70B models.' },
    ],
  },
  'npu-laptop': {
    title: 'Best NPU Laptops (Copilot+ PCs) for On-Device AI (2026)',
    description: 'Copilot+ PCs with dedicated NPUs for on-device AI inference — 40+ TOPS, no cloud required. Reviewed for NPU performance, RAM, and local LLM compatibility.',
    h1: 'Best NPU Laptops for On-Device AI',
    lede: 'On-device AI with no cloud, no API costs, no privacy concerns. 45+ TOPS handles 7–13B models.',
    stats: [
      { val: '45+ TOPS', label: 'NPU performance' },
      { val: '32 GB', label: 'RAM for 13B models' },
      { val: '20 hr', label: 'Surface Laptop 7 battery' },
    ],
    pick: { label: 'Top Pick: Surface Laptop 7 (13.8")', reason: '45 TOPS · 20hr battery · $1,099' },
    faq: [
      { q: 'What is the best Copilot+ PC for running local AI?', a: 'The Microsoft Surface Laptop 7 (13.8") is the best Copilot+ PC overall — 45 TOPS NPU, 20-hour battery, and the most polished Copilot+ experience. For 13B model inference, the ASUS Zenbook S14 with 32 GB RAM is the better choice as 16 GB limits you to 7B models.' },
      { q: 'Can Copilot+ PCs run Ollama and local LLMs?', a: 'Yes. Ollama runs on ARM Windows (Snapdragon X Elite) and x86 (Intel Core Ultra). With 16 GB RAM you can run 7B models at 15–25 tokens per second via the NPU or CPU. With 32 GB RAM, 13B models are viable. 70B models are not practical on any Copilot+ PC.' },
      { q: 'What is the difference between NPU and GPU for local AI?', a: 'NPUs (Neural Processing Units) are optimized for transformer inference and use very little power — ideal for sustained on-device AI without fan noise or battery drain. GPUs have higher peak performance but consume more power. For 7–13B models on a laptop, NPU inference is the better tradeoff.' },
    ],
  },
}

const ACTIVE_CATEGORIES = ['gpu', 'mini-pc', 'npu-laptop', 'dock', 'accessory', 'nas'] as const

export async function generateStaticParams() {
  return ACTIVE_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const meta = CATEGORY_META[params.category as Category]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://ai-desk.tech/categories/${params.category}` },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const products = getProductsByCategory(category)
  const BASE = 'https://ai-desk.tech'

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: meta.title, url: `${BASE}/categories/${category}` },
    ]),
    buildItemListSchema(
      meta.h1,
      products.map(p => ({ name: p.name, url: `${BASE}/products/${p.slug}` }))
    ),
    ...(meta.faq.length > 0 ? [buildFAQSchema(meta.faq.map(f => ({ question: f.q, answer: f.a })))] : []),
  ]

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      <div>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
            <li className="text-edge">/</li>
            <li className="text-zinc-600">{meta.title}</li>
          </ol>
        </nav>

        <div className="mb-10 border border-edge overflow-hidden">
          <div className="h-[3px] rule-ember" />

          {/* Header */}
          <div className="px-6 py-6 border-b border-edge bg-ink-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">Category</p>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-foreground leading-none mb-3">
                {meta.h1}
              </h1>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>{meta.lede}</p>
            </div>

            {/* Our pick badge */}
            <div className="border border-ore/30 bg-ore/5 px-4 py-3 shrink-0">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ore mb-1">Our Pick</p>
              <p className="font-sans font-semibold text-sm text-foreground">{meta.pick.label}</p>
              <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-subtle)' }}>{meta.pick.reason}</p>
            </div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 divide-x divide-edge bg-ink-0">
            {meta.stats.map(s => (
              <div key={s.label} className="px-5 py-4">
                <p className="font-display font-bold text-xl text-ore leading-none mb-1">{s.val}</p>
                <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-edge/60 py-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">Coming soon</p>
            <p className="text-sm text-slate-600">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
