import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { buildProductSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema'
import { PRODUCT_PERSONA_MAP } from '@/lib/personaLinks'
import { getProductComparisonSlugs } from '@/lib/comparisons'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductHero from '@/components/ProductHero'
import ComparisonTable from '@/components/ComparisonTable'
import AffiliateButton from '@/components/AffiliateButton'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import AmazonImage from '@/components/AmazonImage'
import StickyAffiliateCta from '@/components/StickyAffiliateCta'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllProducts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  const tps = product.specs.tokens_per_second_7b
  const titleSuffix = tps ? `: ${tps} t/s on Llama 3` : ' — Best for Local AI?'
  return {
    title: `${product.name} Review${titleSuffix}`,
    description: product.shortDescription,
    alternates: {
      canonical: `https://ai-desk.tech/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} Review`,
      description: product.shortDescription,
    },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const comparisonSlugs = getProductComparisonSlugs(product.slug)
  const crossSellProducts = (product.crossSells ?? [])
    .map(slug => getProductBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductBySlug>>[]

  const schemas = [
    buildProductSchema(product),
    buildFAQSchema(product.faq),
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://ai-desk.tech' },
      { name: 'Products', url: 'https://ai-desk.tech/products' },
      { name: product.name, url: `https://ai-desk.tech/products/${product.slug}` },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema} />
      ))}

      <div className="mb-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
            <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
            <li className="text-edge">/</li>
            <li><a href="/products" className="hover:text-ore transition-colors">Products</a></li>
            <li className="text-edge">/</li>
            <li className="text-ore truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>
        <time
          dateTime={product.lastUpdated}
          className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mt-1 block"
        >
          Updated {new Date(product.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </time>
      </div>

      <div className="space-y-10">
        <ProductHero product={product} />

        {/* Entity headline — AI model context for GEO/AEO */}
        {product.entityHeadline && (
          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">
              {product.entityHeadline}
            </h2>
          </section>
        )}

        {/* Use cases */}
        <section>
          <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
            <span className="block w-0.5 h-5 bg-ore shrink-0" />
            What Can You Run on This?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {product.useCases.map(uc => (
              <li key={uc} className="flex items-start gap-3 bg-ink-1 border border-edge px-4 py-3">
                <svg className="w-4 h-4 text-win shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
                </svg>
                <span className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>{uc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Specs */}
        <section>
          <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
            <span className="block w-0.5 h-5 bg-ore shrink-0" />
            Full Specifications
          </h2>
          <ComparisonTable specs={product.specs} />
        </section>

        {/* Pros / Cons */}
        <section>
          <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
            <span className="block w-0.5 h-5 bg-ore shrink-0" />
            Pros &amp; Cons
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border-l-2 border-win bg-ink-1 border border-l-win/0 p-5" style={{ borderLeftColor: 'rgb(var(--color-win))' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-win mb-4">Pros</p>
              <ul className="space-y-3">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-3 text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4 text-win shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-loss bg-ink-1 p-5" style={{ borderLeftColor: 'rgb(var(--color-loss))' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-loss mb-4">Cons</p>
              <ul className="space-y-3">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-3 text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4 text-loss shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <AffiliateButton href={product.affiliateUrl} size="sm" />
            <span className="font-mono text-sm text-foreground">{product.priceDisplay}</span>
          </div>
        </section>

        {/* Anti-Sell */}
        {product.notFor && product.notFor.length > 0 && (
          <section className="border-l-2 border-loss bg-ink-1 p-6" style={{ borderLeftColor: 'rgb(var(--color-loss))' }}>
            <h2 className="font-display font-bold text-xl uppercase text-foreground mb-1">
              Who Should NOT Buy This
            </h2>
            <p className="text-[11px] uppercase tracking-widest text-loss mb-4 font-mono">
              Honest assessment
            </p>
            <ul className="space-y-2.5">
              {product.notFor.map(item => (
                <li key={item} className="flex gap-3 text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-4 h-4 text-loss shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Verdict */}
        <section id="verdict" className="border border-ore/20 bg-ink-1 p-6 relative overflow-hidden">
          <div className="h-[2px] rule-ember absolute top-0 left-0 right-0" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Our Verdict</p>
          <h2 className="font-display font-bold text-xl uppercase text-foreground mb-3">
            {product.name}
          </h2>
          <p className="leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{product.verdict}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <AffiliateButton href={product.affiliateUrl} />
            <span className="font-mono text-lg text-foreground">{product.priceDisplay}</span>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
            <span className="block w-0.5 h-5 bg-ore shrink-0" />
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-edge border border-edge">
            {product.faq.map((item, i) => (
              <div key={item.question} className="p-5 bg-ink-0 hover:bg-ink-1 transition-colors">
                <h3 className="font-semibold text-sm text-foreground mb-2 flex items-start gap-3">
                  <span className="font-mono text-[10px] text-ore bg-ore/10 px-1.5 py-0.5 shrink-0 mt-0.5">
                    Q{i + 1}
                  </span>
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed pl-8" style={{ color: 'var(--text-muted)' }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        {crossSellProducts.length > 0 && (
          <section className="border border-edge bg-ink-0 overflow-hidden">
            <div className="h-[2px] rule-ember" />
            <div className="px-6 py-4 border-b border-edge">
              <h2 className="font-display font-bold text-xl uppercase text-foreground">
                {(product.category === 'gpu' || product.category === 'mini-pc')
                  ? "Don't Bottleneck Your Rig"
                  : 'Complete Your Setup'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest mt-0.5 font-mono" style={{ color: 'var(--text-subtle)' }}>
                {(product.category === 'gpu' || product.category === 'mini-pc')
                  ? "Accessories that unlock this hardware's full potential"
                  : 'Recommended accessories'}
              </p>
            </div>
            <div className="divide-y divide-edge">
              {crossSellProducts.map(item => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-ink-1 transition-colors group"
                >
                  <div className="w-14 h-14 shrink-0 bg-white border border-edge flex items-center justify-center overflow-hidden">
                    <AmazonImage asin={item.asin} name={item.name} localSrc={item.image} size={56} compact className="w-full h-full p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-ore transition-colors truncate">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      {item.category} · {item.priceDisplay}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-ore shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Also featured in */}
        {PRODUCT_PERSONA_MAP[product.slug]?.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
              <span className="block w-0.5 h-5 bg-ore shrink-0" />
              Also Featured In
            </h2>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_PERSONA_MAP[product.slug].map(p => (
                <Link
                  key={p.slug}
                  href={`/best/${p.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-edge bg-ink-1 text-sm font-mono text-zinc-600 hover:border-ore/50 hover:text-ore transition-colors"
                >
                  {p.title} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compare with */}
        {comparisonSlugs.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-xl uppercase text-foreground mb-4 flex items-center gap-3">
              <span className="block w-0.5 h-5 bg-ore shrink-0" />
              Compare With
            </h2>
            <div className="flex flex-wrap gap-2">
              {comparisonSlugs.map(s => {
                const other = s.replace(`${product.slug}-vs-`, '').replace(`-vs-${product.slug}`, '')
                const label = other.replace(/-/g, ' ')
                return (
                  <Link
                    key={s}
                    href={`/compare/${s}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-edge bg-ink-1 text-sm font-mono text-zinc-600 hover:border-ore/50 hover:text-ore transition-colors"
                  >
                    vs {label} →
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <AffiliateDisclosure className="border-t border-edge pt-6 text-zinc-500" />
      </div>

      <StickyAffiliateCta
        href={product.affiliateUrl}
        productName={product.name}
        priceDisplay={product.priceDisplay}
      />
    </>
  )
}
