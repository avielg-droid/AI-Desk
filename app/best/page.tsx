import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPersonas } from '@/lib/personas'
import { buildBreadcrumbSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'AI Hardware Buying Guides (2026)',
  description: 'Expert buying guides for local AI hardware — best GPUs for Stable Diffusion, best Mini PCs for Ollama, best hardware for Llama 3 70B, and more.',
}

const TASK_LABELS: Record<string, string> = {
  'gpu-for-stable-diffusion': 'Image Generation',
  'gpu-for-local-llm': 'LLM Inference',
  'mini-pc-for-ollama': 'Ollama / Mini PC',
  'hardware-for-llama-3-70b': '70B Models',
  'gpu-for-comfyui': 'ComfyUI Workflows',
  'budget-ai-hardware': 'Budget Builds',
}

export default function BestHubPage() {
  const personas = getAllPersonas()

  const schema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://ai-desk.tech' },
    { name: 'Buying Guides', url: 'https://ai-desk.tech/best' },
  ])

  return (
    <>
      <SchemaMarkup schema={schema} />

      {/* Header */}
      <section className="relative border border-edge overflow-hidden mb-8" style={{ background: 'var(--glass-bg)' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
        <div className="absolute inset-0 bg-crosshatch" />
        <div className="relative px-8 py-12 max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
              <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
              <li className="text-edge">/</li>
              <li className="text-ore">Buying Guides</li>
            </ol>
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-3">Buying Guides</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-foreground mb-4">
            Best Hardware For…
          </h1>
          <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-xl">
            Use-case ranked picks — every guide covers exactly what to buy for your specific AI workload, with ranked options, requirements, and FAQs.
          </p>
        </div>
      </section>

      {/* Guide grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map(persona => (
          <Link
            key={persona.slug}
            href={`/best/${persona.slug}`}
            className="group border border-edge bg-ink-1 p-6 flex flex-col hover:border-ore/30 aurora-glow-hover transition-all duration-200"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2 mb-4 self-start">
              {TASK_LABELS[persona.slug] ?? 'Guide'}
            </span>

            <h2 className="font-display font-800 text-xl uppercase leading-tight text-foreground mb-2 group-hover:text-ore transition-colors">
              {persona.h1}
            </h2>

            <p className="font-sans text-sm text-zinc-600 leading-relaxed flex-1 line-clamp-3">
              {persona.intro.slice(0, 120)}…
            </p>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-edge/60">
              <span className="font-mono text-[10px] text-zinc-600">
                {persona.productSlugs.length} products ranked
              </span>
              <span className="font-mono text-[10px] text-ore opacity-0 group-hover:opacity-100 transition-opacity">
                Read guide →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
