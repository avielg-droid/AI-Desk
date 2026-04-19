import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPersonas, getPersonaBySlug } from '@/lib/personas'
import { getProductBySlug } from '@/lib/products'
import SchemaMarkup from '@/components/SchemaMarkup'
import AffiliateButton from '@/components/AffiliateButton'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import type { Product } from '@/types/product'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllPersonas().map(p => ({ persona: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { persona: string }
}): Promise<Metadata> {
  const persona = getPersonaBySlug(params.persona)
  if (!persona) return {}
  return {
    title: persona.title,
    description: persona.metaDescription,
    openGraph: {
      title: persona.title,
      description: persona.metaDescription,
    },
  }
}

function buildItemListSchema(persona: ReturnType<typeof getPersonaBySlug>, products: Product[]) {
  if (!persona) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: persona.title,
    description: persona.metaDescription,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://theaidesk.com/products/${p.slug}`,
    })),
  }
}

function buildFAQSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function buildBreadcrumbSchema(persona: { slug: string; title: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theaidesk.com' },
      { '@type': 'ListItem', position: 2, name: 'Best For', item: 'https://theaidesk.com/best' },
      { '@type': 'ListItem', position: 3, name: persona.title, item: `https://theaidesk.com/best/${persona.slug}` },
    ],
  }
}

function keySpec(product: Product): string {
  const s = product.specs
  if (s.vram_gb) return `${s.vram_gb} GB VRAM`
  if (s.unified_memory_gb) return `${s.unified_memory_gb} GB Unified`
  return '—'
}

export default function PersonaPage({ params }: { params: { persona: string } }) {
  const persona = getPersonaBySlug(params.persona)
  if (!persona) notFound()

  const products = persona.productSlugs
    .map(slug => getProductBySlug(slug))
    .filter((p): p is Product => p !== null)

  const schemas = [
    buildItemListSchema(persona, products),
    buildFAQSchema(persona.faq),
    buildBreadcrumbSchema(persona),
  ].filter(Boolean)

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema!} />
      ))}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
          <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
          <li className="text-edge">/</li>
          <li className="text-slate-400">{persona.h1}</li>
        </ol>
      </nav>

      <div className="space-y-12">

        {/* ── HERO ── */}
        <section className="relative rounded-2xl overflow-hidden border border-edge bg-ink-1 py-12 px-8 md:px-14">
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink-1 via-ink-1/90 to-ore/5" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ore to-transparent" />

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore">
                Buyers Guide
              </span>
              <span className="h-px w-12 bg-ore/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Updated {new Date(persona.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 className="font-display font-900 text-4xl md:text-5xl lg:text-6xl uppercase leading-none tracking-tight text-foreground mb-6">
              {persona.h1}
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              {persona.intro}
            </p>
          </div>
        </section>

        {/* ── RANKED LIST ── */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
              Ranked Picks
            </h2>
            <span className="h-px flex-1 bg-edge/60" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {products.length} reviewed
            </span>
          </div>

          <div className="space-y-4">
            {products.map((product, i) => {
              const isTop = product.slug === persona.topPickSlug
              const note = persona.productNotes[product.slug]

              return (
                <div
                  key={product.slug}
                  className={`relative rounded-xl border overflow-hidden transition-all duration-200
                    ${isTop
                      ? 'border-ore/40 bg-ore/5 shadow-[0_0_0_1px_rgba(249,115,22,0.15),0_4px_32px_rgba(249,115,22,0.08)]'
                      : 'border-edge bg-ink-1 hover:border-edge-hi'
                    }`}
                >
                  {/* Top bar for #1 */}
                  {isTop && (
                    <div className="h-px bg-gradient-to-r from-transparent via-ore to-transparent" />
                  )}

                  <div className="p-6 flex flex-col md:flex-row md:items-start gap-5">
                    {/* Rank */}
                    <div className="shrink-0 w-12 text-center">
                      <p className={`font-mono font-medium text-3xl leading-none
                        ${isTop ? 'text-ore' : 'text-slate-700'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      {isTop && (
                        <p className="font-mono text-[8px] uppercase tracking-widest text-ore/60 mt-1">
                          Top Pick
                        </p>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border border-edge rounded px-2 py-0.5">
                          {product.category.replace('-', ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600">{product.brand}</span>
                      </div>

                      <h3 className="font-display font-800 text-xl uppercase leading-tight text-foreground mb-1">
                        <Link href={`/products/${product.slug}`} className="hover:text-ore transition-colors">
                          {product.name}
                        </Link>
                      </h3>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-mono text-sm text-data">{keySpec(product)}</span>
                        <span className="font-mono text-[11px] text-ore">{product.rating}/5.0</span>
                      </div>

                      {note && (
                        <p className="text-sm text-slate-400 leading-relaxed">{note}</p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="shrink-0">
                      <AffiliateButton href={product.affiliateUrl} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── REQUIREMENTS ── */}
        <section className="rounded-xl border border-data/20 bg-data/5 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-data/40 to-transparent" />
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-3">
            Hardware Requirements
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{persona.requirements}</p>
        </section>

        {/* ── WHY THIS MATTERS ── */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-3">
            Why This Matters
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">{persona.whyThisMatters}</p>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-1">
            {persona.faq.map((item, i) => (
              <div key={item.question} className="rounded-xl border border-edge bg-ink-1 p-5">
                <h3 className="font-sans font-600 text-sm text-foreground mb-2 flex items-start gap-2">
                  <span className="font-mono text-[10px] text-ore mt-0.5 shrink-0">Q{i + 1}</span>
                  {item.question}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed pl-6">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AffiliateDisclosure className="border-t border-edge pt-6 text-slate-500" />
      </div>
    </>
  )
}
