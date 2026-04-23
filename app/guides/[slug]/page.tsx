import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getGuideBySlug,
  getAllGuideSlugs,
  GUIDE_ENTRIES,
} from '@/lib/guides'
import { getProductBySlug } from '@/lib/products'
import { buildBreadcrumbSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import AffiliateButton from '@/components/AffiliateButton'
import AmazonImage from '@/components/AmazonImage'

export const revalidate = 3600

export function generateStaticParams() {
  return getAllGuideSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug)
  if (!guide) return {}
  return {
    title: `${guide.title} — Local AI Setup Guide`,
    description: guide.description,
    alternates: {
      canonical: `https://theaidesk.com/guides/${params.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
    },
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) notFound()

  const product = getProductBySlug(guide.productSlug)

  const relatedGuides = guide.relatedGuideSlugs
    .map(s => GUIDE_ENTRIES.find(g => g.slug === s))
    .filter(Boolean) as typeof GUIDE_ENTRIES

  const relatedProducts = guide.relatedProductSlugs
    .map(s => getProductBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductBySlug>>[]

  // HowTo schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    tool: guide.softwareRequired.map(s => ({ '@type': 'HowToTool', name: s })),
    step: guide.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.body,
      ...(step.code ? { itemListElement: [{ '@type': 'HowToDirection', text: step.code }] } : {}),
    })),
  }

  // FAQ schema from tips
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How fast does ${guide.model.name} run on ${product?.name ?? 'this hardware'}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: guide.benchmarkTps
            ? `${guide.model.name} runs at ${guide.benchmarkTps} on ${product?.name ?? 'this hardware'}.`
            : guide.benchmarkImageSecs
            ? `${guide.model.name} generates a 1024×1024 image in ${guide.benchmarkImageSecs} on ${product?.name ?? 'this hardware'}.`
            : `Performance depends on quantization and system RAM.`,
        },
      },
      {
        '@type': 'Question',
        name: `What software do I need to run ${guide.model.name} locally?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You need: ${guide.softwareRequired.join(', ')}.`,
        },
      },
    ],
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://theaidesk.com' },
    { name: 'Setup Guides', url: 'https://theaidesk.com/guides' },
    { name: guide.title, url: `https://theaidesk.com/guides/${guide.slug}` },
  ])

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={howToSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-3xl space-y-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
            <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
            <li className="text-edge">/</li>
            <li><Link href="/guides" className="hover:text-ore transition-colors">Guides</Link></li>
            <li className="text-edge">/</li>
            <li className="text-ore truncate max-w-[200px]">{guide.title}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
          <div className="px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-ore/30 text-ore">
                {guide.model.type === 'llm' ? 'Language Model' : 'Image Generation'}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                {guide.model.paramCount}
              </span>
            </div>
            <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground mb-4">
              {guide.title}
            </h1>
            <p className="font-sans text-base text-zinc-600 leading-relaxed">
              {guide.description}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-edge">
              {guide.benchmarkTps && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">Speed</p>
                  <p className="font-mono text-sm text-win">{guide.benchmarkTps}</p>
                </div>
              )}
              {guide.benchmarkImageSecs && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">Generation Time</p>
                  <p className="font-mono text-sm text-win">{guide.benchmarkImageSecs}</p>
                </div>
              )}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">Min Memory</p>
                <p className="font-mono text-sm text-foreground">{guide.minMemoryGb} GB</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">Software</p>
                <p className="font-mono text-sm text-foreground">{guide.softwareRequired.join(', ')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured hardware */}
        {product && (
          <section className="border border-edge bg-ink-1 p-5">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-3">
              Hardware Used in This Guide
            </p>
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border border-edge flex items-center justify-center">
                <AmazonImage
                  asin={product.asin}
                  name={product.name}
                  size={64}
                  compact
                  className="w-full h-full p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-sans font-600 text-sm text-foreground hover:text-ore transition-colors"
                >
                  {product.name}
                </Link>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">
                  {product.category} · {product.priceDisplay}
                </p>
              </div>
              <AffiliateButton href={product.affiliateUrl} size="sm" />
            </div>
          </section>
        )}

        {/* Steps */}
        <section>
          <h2 className="font-display font-700 text-2xl text-foreground mb-6">
            Step-by-Step Setup
          </h2>
          <ol className="space-y-6">
            {guide.steps.map((step, i) => (
              <li key={i} className="border border-edge bg-ink-1">
                <div className="flex items-start gap-4 p-5 pb-0">
                  <span className="shrink-0 font-mono font-700 text-2xl text-ore/40 leading-none mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-mono font-600 text-sm text-ore mb-2">
                      {step.title}
                    </h3>
                    <p className="font-sans text-sm text-zinc-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
                {step.code && (
                  <div className="mt-4 mx-5 mb-5 bg-ink-0 border border-edge p-4 overflow-x-auto">
                    <pre className="font-mono text-xs text-zinc-400 leading-relaxed whitespace-pre">
                      {step.code}
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Tips */}
        <section className="border border-ore/20 bg-ore/5 p-7">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-4">
            Optimization Tips
          </h2>
          <ul className="space-y-3">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-ore mt-0.5 shrink-0">›</span>
                <p className="font-sans text-sm text-zinc-600 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Related products */}
        {relatedProducts.length > 1 && (
          <section>
            <h2 className="font-display font-700 text-xl text-foreground mb-4">
              Other Hardware for {guide.model.name}
            </h2>
            <div className="space-y-3">
              {relatedProducts
                .filter(p => p.slug !== guide.productSlug)
                .map(p => (
                  <div
                    key={p.slug}
                    className="flex items-center gap-4 border border-edge bg-ink-1 p-5 hover:border-ore/30 transition-colors"
                  >
                    <div className="shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border border-edge flex items-center justify-center">
                      <AmazonImage
                        asin={p.asin}
                        name={p.name}
                        size={64}
                        className="w-full h-full p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-sans font-600 text-sm text-foreground hover:text-ore transition-colors"
                      >
                        {p.name}
                      </Link>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-0.5">
                        {p.category} · {p.priceDisplay}
                        {p.specs.vram_gb && ` · ${p.specs.vram_gb} GB VRAM`}
                        {p.specs.unified_memory_gb && ` · ${p.specs.unified_memory_gb} GB Unified`}
                      </p>
                    </div>
                    <AffiliateButton href={p.affiliateUrl} size="sm" />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Related guides */}
        {relatedGuides.length > 0 && (
          <section>
            <h2 className="font-display font-700 text-xl text-foreground mb-4">
              Related Guides
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedGuides.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="group border border-edge bg-ink-1 p-4 hover:border-ore/30 transition-all duration-200 aurora-glow-hover"
                >
                  <p className="font-mono text-sm text-ore mb-1 group-hover:text-ore">
                    {rel.title}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </p>
                  <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back nav */}
        <div className="border-t border-edge pt-6 flex items-center justify-between">
          <Link
            href="/guides"
            className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-ore transition-colors"
          >
            ← All Guides
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
