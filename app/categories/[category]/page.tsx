import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/products'
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types/product'

export const revalidate = 3600

const CATEGORY_META: Record<Category, { title: string; description: string; h1: string; lede: string; pick: { label: string; reason: string } }> = {
  'gpu': {
    title: 'Best GPUs for Local AI (2026)',
    description: 'Expert reviews of the best discrete GPUs for running LLMs and Stable Diffusion locally in 2026. Benchmarked tokens-per-second, VRAM, and power draw on real hardware.',
    h1: 'Best GPUs for Running AI Locally (2026)',
    lede: 'Choosing a GPU for local AI is nothing like choosing one for gaming. The spec that matters most is memory bandwidth — not CUDA cores, not boost clock, not ray tracing performance. A GPU with 12 GB of GDDR7 at 672 GB/s will outperform a 16 GB card at 400 GB/s on every LLM inference workload. VRAM capacity sets the ceiling on which models you can load: 12 GB fits a 13B Q4 model, 16 GB fits a 13B at higher quality, and 40 GB+ is required for 70B models without CPU offloading. Our top pick for 2026 is the RTX 5070 — 12 GB GDDR7, 672 GB/s, ~120 t/s on Llama 3.1 8B — the highest bandwidth-per-dollar card on the market. For Linux users on a budget, the RX 9060 XT offers 16 GB GDDR6 with ROCm support.',
    pick: { label: 'Top Pick: RTX 5070', reason: '672 GB/s · 120 t/s on 8B · $549' },
  },
  'mini-pc': {
    title: 'Best Mini PCs for Local AI (2026)',
    description: 'Compact AI workstations reviewed for local LLM inference, Stable Diffusion, and home AI servers. Real tokens-per-second benchmarks on every device.',
    h1: 'Best Mini PCs for Local AI Inference (2026)',
    lede: 'Mini PCs have become the most practical local AI setup for most people. They are silent, draw 20–35W at idle, and fit under a monitor — yet the Mac Mini M4 Pro with 24 GB unified memory can run 70B Q4 models that a discrete GPU with only 12 GB VRAM cannot. The key metric for Mini PCs is unified memory bandwidth: Apple Silicon shares memory between CPU and GPU at up to 273 GB/s on the M4 Pro chip, which translates to 65 t/s on Llama 3.1 8B without any discrete GPU. Windows-based Mini PCs use conventional DDR5 with ~68 GB/s bandwidth — fast enough for 7B and 13B models but not competitive with Apple Silicon for larger workloads. If you want the simplest, most capable local AI setup with zero driver headaches, the Mac Mini M4 Pro is the benchmark.',
    pick: { label: 'Top Pick: Mac Mini M4 Pro', reason: '273 GB/s · 65 t/s on 8B · runs 70B' },
  },
  'ai-pc': {
    title: 'Best AI PCs (2026)',
    description: 'Full desktop AI workstations reviewed for local LLM training and inference workloads.',
    h1: 'Best AI PCs for Local Machine Learning (2026)',
    lede: 'A full AI PC combines a powerful host CPU with a discrete GPU — or multiple GPUs — to tackle workloads that Mini PCs and single cards cannot. The advantage over a Mini PC is GPU upgradability and PCIe bandwidth: you can slot in an RTX 5070 today and upgrade to a higher-VRAM card when needed. The advantage over a single GPU is that AI PCs can use system RAM as a secondary VRAM pool through CPU offloading — a 32 GB DDR5 system with an RTX 5070 can technically run 70B models by offloading layers to RAM, though throughput drops significantly compared to running fully in VRAM. For most local AI workloads, a Mini PC or GPU upgrade is the smarter purchase. AI PCs make sense when you need maximum throughput, GPU flexibility, or plan to run multiple models simultaneously.',
    pick: { label: 'Best use case: multi-GPU or max throughput', reason: 'Upgradable · PCIe bandwidth · CPU offload' },
  },
  'accessory': {
    title: 'Best AI Accessories (2026)',
    description: 'Cooling solutions, cables, and peripherals for optimizing your local AI workstation.',
    h1: 'Best Accessories for Local AI Workstations (2026)',
    lede: 'Local AI workloads are sustained, not bursty — a GPU inferencing tokens runs at 80–100% utilization for minutes at a time, unlike gaming which spikes and relaxes. That sustained load makes cooling and power quality the most important accessories you can buy. A GPU running thermally throttled will lose 15–20% of its tokens-per-second compared to a well-cooled card at the same power limit. A GPU brace eliminates sag on heavy triple-fan cards and prevents PCIe slot stress over time. For storage, NVMe bandwidth matters when loading large model weights: a 70B Q4 model is ~40 GB and a slow drive adds 30–60 seconds to load time. The right cables — Thunderbolt 5 for external GPU enclosures, DisplayPort 2.1 for high-resolution monitoring — complete a well-built local AI workstation.',
    pick: { label: 'Priority buy: UPS + GPU brace', reason: 'Protect uptime · prevent sag on long inference runs' },
  },
  'dock': {
    title: 'Best Thunderbolt Docks for AI Workstations (2026)',
    description: 'Thunderbolt 4 and USB4 docking stations for Mac Mini, mini PCs, and AI workstations. Single-cable docking with dual 4K, fast Ethernet, and up to 100W charging.',
    h1: 'Best Thunderbolt 4 Docks for AI Workstations (2026)',
    lede: 'A Thunderbolt 4 dock turns a Mac Mini or mini PC into a full workstation via a single cable — delivering power, dual 4K displays, USB peripherals, and Ethernet simultaneously. For AI workflows, the key specs are Ethernet speed (2.5GbE enables faster NAS model loading vs Gigabit) and charging wattage (98W–100W for large laptops). The CalDigit TS4 is the best dock for Mac Mini M4 Pro users who want maximum ports and 2.5GbE. The Anker 777 is the best value for Windows mini PC users who need triple 4K display support at $199.',
    pick: { label: 'Top Pick: CalDigit TS4', reason: '18 ports · 98W charging · 2.5GbE · $299' },
  },
  'nas': {
    title: 'Best NAS for Local AI Model Storage (2026)',
    description: 'Network-attached storage devices for housing LLM model weights and AI datasets locally. Reviewed for storage bays, Ethernet speed, and AI inference capability.',
    h1: 'Best NAS Devices for Local AI Model Storage (2026)',
    lede: 'A NAS (Network-Attached Storage) centralizes model weight storage across your entire local network — instead of duplicating 40 GB 70B model files on every machine, one NAS holds the library and all machines load from it. The key specs for AI use are Ethernet speed (2.5GbE vs 10GbE determines model load time) and storage bays (4-bay with 4×4TB drives = 12TB usable in RAID 5). The Synology DS925+ is the best home AI NAS for software reliability and ecosystem. The UGREEN DXP4800 Plus offers 10GbE at a lower price for users who need faster model delivery.',
    pick: { label: 'Top Pick: Synology DS925+', reason: '4-bay · dual 2.5GbE · best software · $500' },
  },
  'npu-laptop': {
    title: 'Best NPU Laptops (Copilot+ PCs) for On-Device AI (2026)',
    description: 'Copilot+ PCs with dedicated NPUs for on-device AI inference — 40+ TOPS, no cloud required. Reviewed for NPU performance, RAM, and local LLM compatibility.',
    h1: 'Best NPU Laptops for On-Device AI Inference (2026)',
    lede: 'Copilot+ PCs with dedicated NPUs run AI models locally without sending data to the cloud — no API costs, no internet dependency, no privacy concerns. The minimum bar is 45 TOPS, which every laptop in this category meets. What differentiates them is RAM (16 GB limits you to 7B models; 32 GB enables 13B models), display quality, and platform — Snapdragon X Elite for best battery life and Copilot+ integration, Intel Core Ultra 7 Series 2 for x64 compatibility and higher RAM options. The Microsoft Surface Laptop 7 is the top-rated Copilot+ PC overall. The ASUS Zenbook S14 is the best for 13B model inference thanks to its 32 GB configuration.',
    pick: { label: 'Top Pick: Surface Laptop 7 (13.8")', reason: '45 TOPS · 20hr battery · best Copilot+ · $1,099' },
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(category => ({ category }))
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

        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Category</p>
          <h1 className="font-display font-extrabold text-4xl uppercase tracking-tight text-foreground mb-4">
            {meta.h1}
          </h1>

          {/* Our pick badge — all categories */}
          <div className="inline-flex items-center gap-3 border border-ore/30 bg-ore/5 px-4 py-2 mb-5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ore">Our Pick</span>
            <span className="font-sans font-semibold text-sm text-foreground">{meta.pick.label}</span>
            <span className="font-mono text-[10px] text-zinc-600">{meta.pick.reason}</span>
          </div>

          {/* Editorial lede */}
          <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">{meta.lede}</p>
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
