import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGuides } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Local AI Setup Guides — Run LLMs & Stable Diffusion on Your Hardware',
  description: 'Step-by-step guides for running Llama, DeepSeek, SDXL, and FLUX locally on Mac Mini, RTX GPUs, AMD, and mini PCs. Real benchmarks, no fluff.',
  alternates: { canonical: 'https://ai-desk.tech/guides' },
  openGraph: {
    title: 'Local AI Setup Guides',
    description: 'Run Llama, DeepSeek, SDXL and FLUX on your own hardware.',
  },
}

const MODEL_ICON: Record<string, string> = {
  llm: '◈',
  image: '◉',
  multimodal: '◎',
}

const MODEL_LABEL: Record<string, string> = {
  llm: 'Language Model',
  image: 'Image Generation',
  multimodal: 'Multimodal',
}

export default function GuidesIndexPage() {
  const guides = getAllGuides()
  const llmGuides = guides.filter(g => g.model.type === 'llm')
  const imageGuides = guides.filter(g => g.model.type === 'image')

  return (
    <div className="space-y-12">

      {/* Header */}
      <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
        <div className="absolute inset-0 bg-crosshatch" />
        <div className="relative px-8 py-12 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-3">
            How-To Guides
          </p>
          <h1 className="font-display font-700 text-4xl md:text-5xl text-foreground mb-4">
            Run AI Locally
          </h1>
          <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-xl">
            Step-by-step setup guides for running LLMs and image generators on real hardware — with exact commands, benchmarks, and optimization tips.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <nav aria-label="Guide categories" className="flex flex-wrap gap-2">
        <a href="#llm" className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-edge text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors">
          {MODEL_ICON.llm} Language Models
        </a>
        <a href="#image" className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-edge text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors">
          {MODEL_ICON.image} Image Generation
        </a>
      </nav>

      {/* LLM Guides */}
      {llmGuides.length > 0 && (
        <section id="llm">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display font-700 text-xl text-foreground whitespace-nowrap">
              Language Model Guides
            </h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {llmGuides.map(guide => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* Image Guides */}
      {imageGuides.length > 0 && (
        <section id="image">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display font-700 text-xl text-foreground whitespace-nowrap">
              Image Generation Guides
            </h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {imageGuides.map(guide => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border border-edge bg-ink-1 p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">Need the hardware first?</p>
        <h2 className="font-display font-700 text-2xl text-foreground mb-3">
          Find the Right Hardware for Your Use Case
        </h2>
        <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto">
          Every guide recommends specific hardware. Our buying guides match you to the right GPU or mini PC for your budget and workload.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/best" className="affiliate-btn inline-flex items-center gap-2 px-6 py-2.5 font-sans font-700 text-sm">
            Browse Buying Guides →
          </Link>
          <Link href="/products" className="nav-cta inline-flex items-center gap-2 px-6 py-2.5 border border-edge font-mono text-xs uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
            All Products
          </Link>
        </div>
      </section>

    </div>
  )
}

function GuideCard({ guide }: { guide: ReturnType<typeof getAllGuides>[0] }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col border border-edge bg-ink-1 p-5 hover:border-ore/30 aurora-glow-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ore border border-ore/30 px-1.5 py-0.5 shrink-0">
          {MODEL_LABEL[guide.model.type]}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          {guide.model.paramCount}
        </span>
      </div>
      <h3 className="font-mono font-500 text-sm text-foreground group-hover:text-ore transition-colors mb-2 leading-snug">
        {guide.title}
      </h3>
      <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-2 flex-1 mb-3">
        {guide.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {guide.benchmarkTps && (
            <span className="font-mono text-[9px] text-win bg-win/10 px-1.5 py-0.5">
              {guide.benchmarkTps}
            </span>
          )}
          {guide.benchmarkImageSecs && (
            <span className="font-mono text-[9px] text-win bg-win/10 px-1.5 py-0.5">
              {guide.benchmarkImageSecs}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-ore opacity-0 group-hover:opacity-100 transition-opacity">
          Read →
        </span>
      </div>
    </Link>
  )
}
