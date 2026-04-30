import type { Metadata } from 'next'
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'Alex Voss — Hardware Reviewer | The AI Desk',
  description: 'Alex Voss is the hardware reviewer behind The AI Desk. Independent benchmarks of GPUs, Mini PCs, and local AI inference hardware since 2022.',
  alternates: { canonical: 'https://ai-desk.tech/about/author' },
  openGraph: {
    title: 'Alex Voss — Hardware Reviewer | The AI Desk',
    description: 'Independent reviewer specializing in local AI hardware performance — GPU inference, memory bandwidth, and Ollama benchmarks.',
    url: 'https://ai-desk.tech/about/author',
    siteName: 'The AI Desk',
  },
}

const EXPERTISE = [
  ['GPU Architecture', 'CUDA, ROCm, Metal — how memory hierarchy and compute clusters translate to real inference throughput.'],
  ['LLM Inference', 'Tokens-per-second measurement methodology using Ollama and llama.cpp. Quantization tradeoffs (Q4_K_M vs Q8_0 vs fp16).'],
  ['Memory Bandwidth', 'Why GB/s matters more than FLOPS for LLM workloads. VRAM sizing for common model families.'],
  ['Apple Silicon', 'Unified memory architecture, Metal Performance Shaders, and how M-series chips compare to discrete GPUs for AI.'],
  ['Mini PC Ecosystem', 'AMD Ryzen AI, Intel Core Ultra, eGPU compatibility, and thermal limits for always-on inference servers.'],
  ['Image Generation', 'Stable Diffusion XL, FLUX, and ComfyUI pipeline benchmarks. VRAM minimums per resolution.'],
]

const RECENT_POSTS = [
  { slug: 'apple-mac-mini-m4-pro-local-llm-review', title: 'Apple Mac Mini M4 Pro for Local LLM Review 2026: 70B Models at 30W', date: '2026-04-29' },
  { slug: 'apple-silicon-vs-nvidia-local-ai-2026', title: 'Apple Silicon vs NVIDIA for Local AI 2026: M4 Pro vs RTX 5070', date: '2026-04-29' },
  { slug: 'best-ai-pc-under-1000-2026', title: 'Best AI PC Under $1,000 in 2026', date: '2026-04-28' },
  { slug: 'how-to-run-stable-diffusion-locally-2026', title: 'How to Run Stable Diffusion Locally in 2026: Complete Setup Guide', date: '2026-04-28' },
  { slug: 'best-gpu-stable-diffusion-flux-2026', title: 'Best GPU for Stable Diffusion and FLUX in 2026', date: '2026-04-26' },
  { slug: 'best-local-ai-hardware-under-500', title: 'Best Local AI Hardware Under $500 in 2026', date: '2026-04-26' },
]

const BASE = 'https://ai-desk.tech'

export default function AuthorPage() {
  const schemas = [
    buildPersonSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'About', url: `${BASE}/about` },
      { name: 'Alex Voss', url: `${BASE}/about/author` },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      <div className="max-w-2xl mx-auto space-y-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
            <li className="text-edge">/</li>
            <li><a href="/about" className="hover:text-ore transition-colors">About</a></li>
            <li className="text-edge">/</li>
            <li className="text-zinc-600">Alex Voss</li>
          </ol>
        </nav>

        {/* Header */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Author</p>
          <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-1">
            Alex Voss
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-4">
            Hardware Reviewer · The AI Desk
          </p>
          <p className="text-base text-zinc-600 leading-relaxed">
            Independent hardware reviewer focused on local AI inference — GPUs, Mini PCs, and the
            software stack that ties them together. Writing about what actually runs, at what speed,
            and whether it&apos;s worth the money.
          </p>
        </div>

        {/* Bio */}
        <section className="space-y-4">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Background
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Alex has been building and benchmarking local AI hardware since 2022, when running a
            7B model locally still required a dedicated workstation. The goal then — and now — is
            the same: find out what ordinary consumer hardware can actually do, without relying on
            manufacturer benchmarks or cloud-hosted demos.
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Background in software infrastructure led to a deep interest in the systems layer:
            memory hierarchies, driver stacks, compute scheduling. When LLMs started demanding the
            same understanding of hardware that distributed systems engineers apply to servers,
            the overlap became obvious.
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Every review on The AI Desk follows a fixed benchmark protocol — same models, same
            quantization, same tools as our readers use. No manufacturer samples. No cherry-picked
            runs. Results are cross-referenced against community benchmarks from r/LocalLLaMA and
            llama.cpp before publishing.
          </p>
        </section>

        {/* Expertise */}
        <section className="space-y-3">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Areas of Expertise
          </h2>
          <ul className="space-y-3">
            {EXPERTISE.map(([area, desc]) => (
              <li key={area} className="flex gap-4 border border-edge bg-ink-1 px-5 py-4">
                <span className="text-ore font-mono mt-0.5 shrink-0">→</span>
                <div>
                  <p className="font-sans font-600 text-sm text-foreground">{area}</p>
                  <p className="text-sm text-zinc-600 mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Methodology callout */}
        <section className="border border-ore/25 bg-ore/5 p-6 space-y-2">
          <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground">
            Review Methodology
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            All benchmarks use a fixed protocol: Ollama latest stable, Llama 3.1 8B Q4_K_M, 500-token
            seed prompt, 3 runs with median reported. Image generation tested via ComfyUI with SDXL
            and FLUX.1-dev at 1024×1024. Full details on the{' '}
            <a href="/how-we-test" className="text-ore hover:underline">methodology page →</a>
          </p>
        </section>

        {/* Recent posts */}
        <section className="space-y-4">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Recent Articles
          </h2>
          <ul className="space-y-2">
            {RECENT_POSTS.map(post => (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}`}
                  className="flex items-start gap-3 border border-edge bg-ink-1 px-5 py-4 hover:border-ore/50 transition-colors group"
                >
                  <span className="text-ore font-mono mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
                  <div className="min-w-0">
                    <p className="text-sm font-500 text-foreground leading-snug">{post.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <a href="/blog" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ore hover:underline">
            All articles →
          </a>
        </section>

        {/* Products reviewed */}
        <section className="space-y-3">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Products Reviewed
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            The AI Desk catalog covers{' '}
            <a href="/products?category=gpu" className="text-ore hover:underline">GPUs</a>,{' '}
            <a href="/products?category=mini-pc" className="text-ore hover:underline">Mini PCs</a>, and{' '}
            <a href="/products?category=accessory" className="text-ore hover:underline">AI accessories</a> — 27 products benchmarked to date.
            Every product page includes tokens-per-second data, VRAM or unified memory specs,
            power draw, and a verdict on the specific use case it best serves.
          </p>
          <a href="/products" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ore hover:underline">
            Browse all products →
          </a>
        </section>

      </div>
    </>
  )
}
