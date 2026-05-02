import type { Metadata } from 'next'
import Link from 'next/link'
import { getGlossaryByCategory, CATEGORY_LABELS, type GlossaryCategory } from '@/lib/glossary'

export const metadata: Metadata = {
  title: 'AI Hardware Glossary — Every Local AI Term Explained',
  description: 'Plain-English definitions of every AI hardware term: VRAM, quantization, tokens per second, CUDA, ROCm, Ollama, and more. Built for local AI beginners.',
  alternates: { canonical: 'https://ai-desk.tech/glossary' },
  openGraph: {
    title: 'AI Hardware Glossary',
    description: 'Every local AI and hardware term explained in plain English.',
  },
}

const CATEGORY_ORDER: GlossaryCategory[] = [
  'memory', 'performance', 'software', 'hardware', 'connectivity',
]

export default function GlossaryIndexPage() {
  const byCategory = getGlossaryByCategory()

  return (
    <div className="space-y-12">

      {/* Header */}
      <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
        <div className="absolute inset-0 bg-crosshatch" />
        <div className="relative px-8 py-12 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-3">
            Reference
          </p>
          <h1 className="font-display font-700 text-4xl md:text-5xl text-foreground mb-4">
            AI Hardware Glossary
          </h1>
          <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-xl">
            Every term you&apos;ll encounter when running LLMs and Stable Diffusion locally — explained without jargon, with real hardware context.
          </p>
        </div>
      </section>

      {/* Quick jump */}
      <nav aria-label="Glossary categories" className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map(cat => (
          <a
            key={cat}
            href={`#${cat}`}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-edge text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
          >
            {CATEGORY_LABELS[cat]}
          </a>
        ))}
      </nav>

      {/* Terms by category */}
      {CATEGORY_ORDER.filter(cat => byCategory[cat]?.length).map(cat => (
        <section key={cat} id={cat}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display font-700 text-xl text-foreground whitespace-nowrap">
              {CATEGORY_LABELS[cat]}
            </h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {byCategory[cat].map(entry => (
              <Link
                key={entry.slug}
                href={`/glossary/${entry.slug}`}
                className="group flex flex-col border border-edge bg-ink-1 p-5 hover:border-ore/30 aurora-glow-hover transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-mono font-500 text-sm text-ore group-hover:text-ore transition-colors">
                    {entry.term}
                  </h3>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-600 border border-edge px-1.5 py-0.5 shrink-0">
                    {cat}
                  </span>
                </div>
                <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-2 flex-1">
                  {entry.shortDef}
                </p>
                <span className="font-mono text-[10px] text-ore mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border border-edge bg-ink-1 p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">Ready to buy?</p>
        <h2 className="font-display font-700 text-2xl text-foreground mb-3">
          See the Hardware That Uses These Specs
        </h2>
        <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto">
          Every product page shows benchmarks and specs with inline definitions — hover any term to see what it means.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/products" className="affiliate-btn inline-flex items-center gap-2 px-6 py-2.5 font-sans font-700 text-sm">
            Browse All Products →
          </Link>
          <Link href="/compare" className="nav-cta inline-flex items-center gap-2 px-6 py-2.5 border border-edge font-mono text-xs uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
            Compare Hardware
          </Link>
        </div>
      </section>

    </div>
  )
}
