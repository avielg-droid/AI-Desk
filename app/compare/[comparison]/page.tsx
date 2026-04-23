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
    alternates: {
      canonical: `https://theaidesk.com/compare/${params.comparison}`,
    },
    openGraph: { title: data.title, description: data.metaDescription },
  }
}

// ── Verdict badge (BLUF row) ───────────────────────────────────────────────────

function VerdictBadge({
  useCase,
  winner,
  nameA,
  nameB,
}: {
  useCase: string
  winner: Winner
  nameA: string
  nameB: string
}) {
  const shortA = nameA.split(' ').slice(-2).join(' ')
  const shortB = nameB.split(' ').slice(-2).join(' ')
  const winnerShort = winner === 'a' ? shortA : winner === 'b' ? shortB : null

  return (
    <div className="flex flex-col gap-1.5 p-4 border-r border-edge last:border-r-0">
      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">{useCase}</p>
      {winnerShort ? (
        <div className="flex items-center gap-1.5">
          <span className="text-win text-[10px]">▲</span>
          <span className="font-sans font-700 text-sm text-foreground">{winnerShort}</span>
        </div>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Tie</span>
      )}
    </div>
  )
}

// ── Verdict card (detailed) ────────────────────────────────────────────────────

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
  const winnerName = winner === 'a' ? nameA : winner === 'b' ? nameB : null
  return (
    <div className="border border-edge bg-ink-1 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</h3>
        {winnerName ? (
          <span className="font-mono text-[10px] text-win border border-win/30 bg-win/10 px-2 py-0.5">
            {winnerName.split(' ').slice(-2).join(' ')} wins
          </span>
        ) : (
          <span className="font-mono text-[10px] text-zinc-600 border border-edge px-2 py-0.5">tie</span>
        )}
      </div>
      <p className="text-sm text-zinc-600 leading-relaxed">{explanation}</p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

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

  const otherA = getProductComparisonSlugs(data.slugA).filter(s => s !== data.slug).slice(0, 4)
  const otherB = getProductComparisonSlugs(data.slugB).filter(s => s !== data.slug).slice(0, 4)

  const overallWinnerName = data.verdicts.overall.winner === 'a'
    ? a.name.split(' ').slice(-2).join(' ')
    : data.verdicts.overall.winner === 'b'
    ? b.name.split(' ').slice(-2).join(' ')
    : null

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

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

        {/* ── Hero ── */}
        <div className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
          <div className="absolute inset-0 bg-crosshatch" />
          <div className="relative px-6 md:px-10 py-8 space-y-8">

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">Head-to-Head</p>
              <h1 className="font-display font-800 text-3xl md:text-4xl uppercase tracking-tight text-foreground">
                {data.h1}
              </h1>
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-2 gap-4">
              {[{ product: a, side: 'A' }, { product: b, side: 'B' }].map(({ product, side }) => (
                <div key={product.slug} className="border border-edge bg-ink-1 p-5 flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ore mb-2">Option {side}</span>
                  <p className="font-display font-800 text-lg uppercase text-foreground leading-tight mb-1">
                    {product.name}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-600 capitalize mb-4">
                    {product.brand} · {product.category.replace('-', ' ')}
                  </p>
                  <div className="mt-auto">
                    <AffiliateButton href={product.affiliateUrl} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* ── BLUF Verdict Module ── */}
            <div className="border border-ore/30 overflow-hidden">
              {/* Header bar */}
              <div className="bg-ore/10 border-b border-ore/20 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ore">◈ BLUF Verdict</span>
                  <span className="font-mono text-[9px] text-zinc-600">Bottom Line Up Front</span>
                </div>
                {overallWinnerName && (
                  <span className="font-mono text-[9px] text-win border border-win/30 bg-win/10 px-2 py-0.5 uppercase tracking-widest">
                    Overall winner: {overallWinnerName}
                  </span>
                )}
              </div>

              {/* Winner badges — 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 bg-ink-1">
                <VerdictBadge useCase="Winner for LLMs" winner={data.verdicts.llm.winner} nameA={a.name} nameB={b.name} />
                <VerdictBadge useCase="Winner for Stable Diffusion" winner={data.verdicts.imageGen.winner} nameA={a.name} nameB={b.name} />
                <VerdictBadge useCase="Winner for Power Efficiency" winner={data.verdicts.power.winner} nameA={a.name} nameB={b.name} />
                <VerdictBadge useCase="Overall Winner" winner={data.verdicts.overall.winner} nameA={a.name} nameB={b.name} />
              </div>

              {/* Bottom line text */}
              <div className="px-5 py-4 border-t border-ore/20 bg-ore/5">
                <p className="text-sm text-zinc-600 leading-relaxed">{data.blufText}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Spec table ── */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-800 text-xl uppercase text-foreground">Spec Comparison</h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="border border-edge overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr] bg-ink-2 border-b border-edge px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Spec</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">{a.name.split(' ').slice(-2).join(' ')}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">{b.name.split(' ').slice(-2).join(' ')}</span>
            </div>
            {data.specs.map((row, i) => (
              <div
                key={row.label}
                className={`spec-row grid grid-cols-[1fr_1fr_1fr] px-4 py-3 items-center ${
                  i % 2 === 0 ? 'bg-ink-1' : 'bg-ink-0'
                } ${i < data.specs.length - 1 ? 'border-b border-edge/50' : ''}`}
              >
                <span className="font-mono text-[10px] text-zinc-600">{row.label}</span>
                <span className={`text-sm text-center font-mono ${row.winner === 'a' ? 'text-win font-600' : 'text-zinc-600'}`}>
                  {row.aVal}{row.winner === 'a' && <span className="ml-1 text-win text-[10px]">▲</span>}
                </span>
                <span className={`text-sm text-center font-mono ${row.winner === 'b' ? 'text-win font-600' : 'text-zinc-600'}`}>
                  {row.bVal}{row.winner === 'b' && <span className="ml-1 text-win text-[10px]">▲</span>}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Performance verdicts ── */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-800 text-xl uppercase text-foreground">Performance Verdicts</h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="space-y-2">
            <VerdictCard label="Winner for LLM Inference" winner={data.verdicts.llm.winner} nameA={a.name} nameB={b.name} explanation={data.verdicts.llm.explanation} />
            <VerdictCard label="Winner for Stable Diffusion / Image Generation" winner={data.verdicts.imageGen.winner} nameA={a.name} nameB={b.name} explanation={data.verdicts.imageGen.explanation} />
            <VerdictCard label="Winner for Power Efficiency" winner={data.verdicts.power.winner} nameA={a.name} nameB={b.name} explanation={data.verdicts.power.explanation} />
            <VerdictCard label="Overall Winner" winner={data.verdicts.overall.winner} nameA={a.name} nameB={b.name} explanation={data.verdicts.overall.explanation} />
          </div>
        </section>

        {/* ── Buy recommendations ── */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-800 text-xl uppercase text-foreground">Who Should Buy Which?</h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-edge bg-ink-1 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">
                Buy the {a.name.split(' ').slice(-2).join(' ')} if…
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">{data.buyA}</p>
              <AffiliateButton href={a.affiliateUrl} size="sm" />
            </div>
            <div className="border border-edge bg-ink-1 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-3">
                Buy the {b.name.split(' ').slice(-2).join(' ')} if…
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">{data.buyB}</p>
              <AffiliateButton href={b.affiliateUrl} size="sm" />
            </div>
          </div>
        </section>

        {/* ── Related comparisons ── */}
        {(otherA.length > 0 || otherB.length > 0) && (
          <section>
            <div className="flex items-center gap-4 mb-5">
              <h2 className="font-display font-800 text-xl uppercase text-foreground">Related Comparisons</h2>
              <span className="h-px flex-1 bg-edge" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...otherA, ...otherB])).map(s => (
                <Link
                  key={s}
                  href={`/compare/${s}`}
                  className="nav-cta inline-flex items-center gap-1 px-3 py-2 border border-edge bg-ink-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors"
                >
                  {s.replace('-vs-', ' vs ').replace(/-/g, ' ')} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display font-800 text-xl uppercase text-foreground">Frequently Asked Questions</h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="space-y-1">
            {data.faq.map((item, i) => (
              <div key={item.question} className="border border-edge bg-ink-1 p-5">
                <h3 className="font-sans font-600 text-sm text-foreground mb-2 flex items-start gap-2">
                  <span className="font-mono text-[10px] text-ore mt-0.5 shrink-0">Q{i + 1}</span>
                  {item.question}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed pl-6">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Full review links ── */}
        <section className="border border-edge bg-ink-1 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-display font-800 text-lg uppercase text-foreground">Full Reviews</h2>
            <span className="h-px flex-1 bg-edge" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/products/${a.slug}`} className="nav-cta inline-flex items-center gap-2 px-4 py-2 border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
              {a.name} Review →
            </Link>
            <Link href={`/products/${b.slug}`} className="nav-cta inline-flex items-center gap-2 px-4 py-2 border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
              {b.name} Review →
            </Link>
            <Link href="/compare" className="nav-cta inline-flex items-center gap-2 px-4 py-2 border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
              ← All Comparisons
            </Link>
          </div>
        </section>

        <AffiliateDisclosure className="border-t border-edge pt-6 text-zinc-600" />
      </div>
    </>
  )
}
