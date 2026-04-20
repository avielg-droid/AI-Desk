import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllComparisonSlugs,
  getComparisonData,
  getProductComparisonSlugs,
  type Winner,
} from '@/lib/comparisons'
import { buildBreadcrumbSchema, buildFAQSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import AffiliateButton from '@/components/AffiliateButton'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllComparisonSlugs().map(comparison => ({ comparison }))
}

export async function generateMetadata({
  params,
}: {
  params: { comparison: string }
}): Promise<Metadata> {
  const data = getComparisonData(params.comparison)
  if (!data) return {}
  return {
    title: data.title,
    description: data.metaDescription,
    openGraph: { title: data.title, description: data.metaDescription },
  }
}

function VerdictCard({
  label,
  winner,
  nameA,
  nameB,
  explanation,
}: {
  label: string
  winner: Winner
  nameA: string
  nameB: string
  explanation: string
}) {
  const winnerName =
    winner === 'a' ? nameA : winner === 'b' ? nameB : null

  return (
    <div className="rounded-xl border border-edge bg-ink-1 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</h3>
        {winnerName ? (
          <span className="font-mono text-[10px] text-win border border-win/30 bg-win/10 rounded px-2 py-0.5">
            {winnerName} wins
          </span>
        ) : (
          <span className="font-mono text-[10px] text-slate-500 border border-edge rounded px-2 py-0.5">
            tie
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-700 leading-relaxed">{explanation}</p>
    </div>
  )
}

export default function ComparisonPage({ params }: { params: { comparison: string } }) {
  const data = getComparisonData(params.comparison)
  if (!data) notFound()

  const { productA: a, productB: b } = data

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://theaidesk.com' },
      { name: 'Compare', url: 'https://theaidesk.com/compare' },
      { name: data.h1, url: `https://theaidesk.com/compare/${data.slug}` },
    ]),
    buildFAQSchema(data.faq),
  ]

  // Other comparisons for each product (for "also compared" section)
  const otherA = getProductComparisonSlugs(data.slugA)
    .filter(s => s !== data.slug)
    .slice(0, 4)
  const otherB = getProductComparisonSlugs(data.slugB)
    .filter(s => s !== data.slug)
    .slice(0, 4)

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema} />
      ))}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
          <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
          <li className="text-edge">/</li>
          <li><Link href="/compare" className="hover:text-ore transition-colors">Compare</Link></li>
          <li className="text-edge">/</li>
          <li className="text-zinc-600 truncate max-w-[200px]">{data.h1}</li>
        </ol>
      </nav>

      <div className="space-y-10">

        {/* Hero */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">Head-to-Head</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-6">
            {data.h1}
          </h1>

          {/* Product name cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { product: a, side: 'A' },
              { product: b, side: 'B' },
            ].map(({ product, side }) => (
              <div
                key={product.slug}
                className="rounded-xl border border-edge bg-ink-1 p-5 flex flex-col"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-ore mb-2">
                  Option {side}
                </span>
                <p className="font-display font-800 text-lg uppercase text-foreground leading-tight mb-1">
                  {product.name}
                </p>
                <p className="font-mono text-[10px] text-slate-500 capitalize mb-3">
                  {product.brand} · {product.category.replace('-', ' ')}
                </p>
                <div className="mt-auto">
                  <AffiliateButton href={product.affiliateUrl} size="sm" />
                </div>
              </div>
            ))}
          </div>

          {/* BLUF */}
          <div className="rounded-xl border border-ore/20 bg-ore/5 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Bottom Line Up Front</p>
            <p className="text-zinc-800 leading-relaxed">{data.blufText}</p>
          </div>
        </div>

        {/* Spec table */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">Spec Comparison</h2>
          <div className="rounded-xl border border-edge overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr] bg-ink-2 border-b border-edge px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Spec</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">{a.name.split(' ').slice(-2).join(' ')}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">{b.name.split(' ').slice(-2).join(' ')}</span>
            </div>
            {data.specs.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1fr_1fr_1fr] px-4 py-3 items-center ${
                  i % 2 === 0 ? 'bg-ink-1' : 'bg-ink-0'
                } ${i < data.specs.length - 1 ? 'border-b border-edge/50' : ''}`}
              >
                <span className="font-mono text-[10px] text-slate-500">{row.label}</span>
                <span
                  className={`text-sm text-center font-mono ${
                    row.winner === 'a' ? 'text-win font-600' : 'text-zinc-700'
                  }`}
                >
                  {row.aVal}
                  {row.winner === 'a' && (
                    <span className="ml-1 text-win text-[10px]">▲</span>
                  )}
                </span>
                <span
                  className={`text-sm text-center font-mono ${
                    row.winner === 'b' ? 'text-win font-600' : 'text-zinc-700'
                  }`}
                >
                  {row.bVal}
                  {row.winner === 'b' && (
                    <span className="ml-1 text-win text-[10px]">▲</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Category verdicts */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">Performance Verdicts</h2>
          <div className="space-y-3">
            <VerdictCard
              label="LLM Inference"
              winner={data.verdicts.llm.winner}
              nameA={a.name}
              nameB={b.name}
              explanation={data.verdicts.llm.explanation}
            />
            <VerdictCard
              label="Image Generation"
              winner={data.verdicts.imageGen.winner}
              nameA={a.name}
              nameB={b.name}
              explanation={data.verdicts.imageGen.explanation}
            />
            <VerdictCard
              label="Power Efficiency"
              winner={data.verdicts.power.winner}
              nameA={a.name}
              nameB={b.name}
              explanation={data.verdicts.power.explanation}
            />
            <VerdictCard
              label="Overall Winner"
              winner={data.verdicts.overall.winner}
              nameA={a.name}
              nameB={b.name}
              explanation={data.verdicts.overall.explanation}
            />
          </div>
        </section>

        {/* Buy recommendations */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">Who Should Buy Which?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-edge bg-ink-1 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">
                Buy the {a.name.split(' ').slice(-2).join(' ')} if…
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">{data.buyA}</p>
              <AffiliateButton href={a.affiliateUrl} size="sm" />
            </div>
            <div className="rounded-xl border border-edge bg-ink-1 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">
                Buy the {b.name.split(' ').slice(-2).join(' ')} if…
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">{data.buyB}</p>
              <AffiliateButton href={b.affiliateUrl} size="sm" />
            </div>
          </div>
        </section>

        {/* Also compared */}
        {(otherA.length > 0 || otherB.length > 0) && (
          <section>
            <h2 className="font-display font-800 text-xl uppercase text-foreground mb-4">Related Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...otherA, ...otherB])).map(s => {
                return (
                  <Link
                    key={s}
                    href={`/compare/${s}`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-edge bg-ink-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
                  >
                    {s.replace('-vs-', ' vs ').replace(/-/g, ' ')} →
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="font-display font-800 text-xl uppercase text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-1">
            {data.faq.map((item, i) => (
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

        {/* Product review links */}
        <section className="rounded-xl border border-edge bg-ink-1 p-6">
          <h2 className="font-display font-800 text-lg uppercase text-foreground mb-4">
            Full Reviews
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/products/${a.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
            >
              {a.name} Review →
            </Link>
            <Link
              href={`/products/${b.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
            >
              {b.name} Review →
            </Link>
          </div>
        </section>

        <AffiliateDisclosure className="border-t border-edge pt-6 text-slate-500" />
      </div>
    </>
  )
}
