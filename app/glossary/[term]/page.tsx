import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getGlossaryBySlug,
  getAllGlossarySlugs,
  GLOSSARY_ENTRIES,
  CATEGORY_LABELS,
} from '@/lib/glossary'
import { getProductBySlug } from '@/lib/products'
import SchemaMarkup from '@/components/SchemaMarkup'
import AffiliateButton from '@/components/AffiliateButton'

export const revalidate = 3600

export function generateStaticParams() {
  return getAllGlossarySlugs().map(term => ({ term }))
}

export async function generateMetadata({
  params,
}: {
  params: { term: string }
}): Promise<Metadata> {
  const entry = getGlossaryBySlug(params.term)
  if (!entry) return {}
  return {
    title: `What is ${entry.term}? — AI Hardware Glossary`,
    description: entry.shortDef.slice(0, 155),
    openGraph: {
      title: `What is ${entry.term}?`,
      description: entry.shortDef.slice(0, 155),
    },
  }
}

export default function GlossaryTermPage({ params }: { params: { term: string } }) {
  const entry = getGlossaryBySlug(params.term)
  if (!entry) notFound()

  const relatedTerms = entry.relatedTermSlugs
    .map(s => GLOSSARY_ENTRIES.find(e => e.slug === s))
    .filter(Boolean) as typeof GLOSSARY_ENTRIES

  const relatedProducts = entry.relatedProductSlugs
    .map(s => getProductBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductBySlug>>[]

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${entry.term}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.fullDef,
        },
      },
      {
        '@type': 'Question',
        name: `Why does ${entry.term} matter for local AI?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.whyItMatters,
        },
      },
    ],
  }

  // DefinedTerm schema
  const termSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.term,
    description: entry.shortDef,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'The AI Desk Glossary',
      url: 'https://theaidesk.com/glossary',
    },
  }

  return (
    <>
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={termSchema} />

      <div className="max-w-3xl space-y-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
            <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
            <li className="text-edge">/</li>
            <li><Link href="/glossary" className="hover:text-ore transition-colors">Glossary</Link></li>
            <li className="text-edge">/</li>
            <li className="text-ore">{entry.term}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
          <div className="px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-ore/30 text-ore">
                {CATEGORY_LABELS[entry.category]}
              </span>
            </div>
            <h1 className="font-display font-700 text-4xl md:text-5xl text-foreground mb-2">
              What is {entry.term}?
            </h1>
            <p className="font-sans text-lg text-zinc-600 leading-relaxed mt-4">
              {entry.shortDef}
            </p>
          </div>
        </section>

        {/* Full definition */}
        <section className="border border-edge bg-ink-1 p-7">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-4">
            Full Explanation
          </h2>
          <p className="font-sans text-base text-zinc-600 leading-relaxed">
            {entry.fullDef}
          </p>
        </section>

        {/* Why it matters */}
        <section className="border border-ore/20 bg-ore/5 p-7">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore/40 to-transparent" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-4">
            Why It Matters for Local AI
          </h2>
          <p className="font-sans text-base text-zinc-600 leading-relaxed">
            {entry.whyItMatters}
          </p>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-display font-700 text-xl text-foreground mb-4">
              Hardware Relevant to {entry.term}
            </h2>
            <div className="space-y-3">
              {relatedProducts.map(product => (
                <div
                  key={product.slug}
                  className="flex items-center gap-4 border border-edge bg-ink-1 p-5 hover:border-ore/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-sans font-600 text-sm text-foreground hover:text-ore transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">
                      {product.category} · {product.priceDisplay}
                      {product.specs.vram_gb && ` · ${product.specs.vram_gb} GB VRAM`}
                      {product.specs.unified_memory_gb && ` · ${product.specs.unified_memory_gb} GB Unified`}
                      {product.specs.memory_bandwidth_gbps && ` · ${product.specs.memory_bandwidth_gbps} GB/s`}
                    </p>
                  </div>
                  <AffiliateButton href={product.affiliateUrl} size="sm" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related terms */}
        {relatedTerms.length > 0 && (
          <section>
            <h2 className="font-display font-700 text-xl text-foreground mb-4">
              Related Terms
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedTerms.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/glossary/${rel.slug}`}
                  className="group border border-edge bg-ink-1 p-4 hover:border-ore/30 transition-all duration-200 aurora-glow-hover"
                >
                  <p className="font-mono text-sm text-ore mb-1 group-hover:text-ore">
                    {rel.term}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </p>
                  <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {rel.shortDef}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to glossary */}
        <div className="border-t border-edge pt-6 flex items-center justify-between">
          <Link
            href="/glossary"
            className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-ore transition-colors"
          >
            ← All Terms
          </Link>
          <Link
            href="/products"
            className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-ore transition-colors"
          >
            Browse Hardware →
          </Link>
        </div>

      </div>
    </>
  )
}
