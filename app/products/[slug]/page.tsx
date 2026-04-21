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
  return {
    title: `${product.name} Review — Best for Local AI?`,
    description: product.shortDescription,
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
      { name: 'Home', url: 'https://theaidesk.com' },
      { name: 'Products', url: 'https://theaidesk.com/products' },
      { name: product.name, url: `https://theaidesk.com/products/${product.slug}` },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema} />
      ))}

      <div className="flex items-center justify-between mb-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
            <li className="text-edge">/</li>
            <li><a href="/products" className="hover:text-ore transition-colors">Products</a></li>
            <li className="text-edge">/</li>
            <li className="text-zinc-600">{product.name}</li>
          </ol>
        </nav>
        <time
          dateTime={product.lastUpdated}
          className="font-mono text-[10px] uppercase tracking-widest text-slate-600"
        >
          Updated {new Date(product.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </time>
      </div>

      <div className="space-y-10">
        <ProductHero product={product} />

        {/* Bottom line */}
        <section className="rounded-xl border border-edge bg-ink-1 p-6">
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-3">
            Bottom Line
          </h2>
          <p className="text-zinc-700 leading-relaxed">{product.shortDescription}</p>
        </section>

        {/* Use cases */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">
            What Can You Run on This?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {product.useCases.map(uc => (
              <li key={uc} className="flex items-start gap-3 rounded-lg border border-edge/60 bg-ink-1 px-4 py-3">
                <span className="text-win font-mono mt-0.5 shrink-0 text-sm">✓</span>
                <span className="text-sm text-zinc-700">{uc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Specs */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">
            Full Specifications
          </h2>
          <ComparisonTable specs={product.specs} />
        </section>

        {/* Pros / Cons */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">Pros &amp; Cons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-win/20 bg-win/5 p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-win mb-4">Pros</h3>
              <ul className="space-y-2.5">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-3 text-sm text-zinc-700">
                    <span className="text-win shrink-0 mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-loss/20 bg-loss/5 p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-loss mb-4">Cons</h3>
              <ul className="space-y-2.5">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-3 text-sm text-zinc-700">
                    <span className="text-loss shrink-0 mt-0.5">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="rounded-xl border border-ore/25 bg-ore/5 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore/60 to-transparent" />
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-3">Our Verdict</h2>
          <p className="text-zinc-700 leading-relaxed mb-6">{product.verdict}</p>
          <AffiliateButton href={product.affiliateUrl} />
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-1">
            {product.faq.map((item, i) => (
              <div key={item.question} className="rounded-xl border border-edge bg-ink-1 p-5">
                <h3 className="font-sans font-600 text-sm text-foreground mb-2 flex items-start gap-2">
                  <span className="font-mono text-[10px] text-ore mt-0.5 shrink-0">Q{i + 1}</span>
                  {item.question}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed pl-6">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-sell: Don't Bottleneck Your Rig (GPU/PC) or Complete Your Setup (accessory) */}
        {crossSellProducts.length > 0 && (
          <section className="border border-edge bg-ink-1 overflow-hidden">
            <div className="h-[2px] bg-ore" />
            <div className="px-6 py-4 border-b border-edge">
              <h2 className="font-display font-800 text-xl uppercase text-foreground">
                {(product.category === 'gpu' || product.category === 'mini-pc')
                  ? "Don't Bottleneck Your Rig"
                  : 'Complete Your Setup'}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
                {(product.category === 'gpu' || product.category === 'mini-pc')
                  ? 'Accessories that unlock this hardware\'s full potential'
                  : 'Recommended accessories'}
              </p>
            </div>
            <div className="divide-y divide-edge">
              {crossSellProducts.map(item => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-ink-2 transition-colors group"
                >
                  <div className="w-14 h-14 shrink-0 bg-white border border-edge flex items-center justify-center overflow-hidden">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-600 text-sm text-foreground group-hover:text-ore transition-colors truncate">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
                      {item.category} · {item.priceDisplay}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-ore shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Also featured in */}
        {PRODUCT_PERSONA_MAP[product.slug]?.length > 0 && (
          <section>
            <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">
              Also Featured In
            </h2>
            <div className="flex flex-wrap gap-3">
              {PRODUCT_PERSONA_MAP[product.slug].map(p => (
                <Link
                  key={p.slug}
                  href={`/best/${p.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-edge bg-ink-1 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
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
            <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">
              Compare With
            </h2>
            <div className="flex flex-wrap gap-3">
              {comparisonSlugs.map(s => {
                const other = s.replace(`${product.slug}-vs-`, '').replace(`-vs-${product.slug}`, '')
                const label = other.replace(/-/g, ' ')
                return (
                  <Link
                    key={s}
                    href={`/compare/${s}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-edge bg-ink-1 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
                  >
                    vs {label} →
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <AffiliateDisclosure className="border-t border-edge pt-6 text-slate-500" />
      </div>
    </>
  )
}
