import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { getAllComparisonSlugs, parseComparisonSlug, memLabel } from '@/lib/comparisons'
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'AI Hardware Comparisons (2026) — Head-to-Head Reviews',
  description:
    'Side-by-side comparisons of the best AI hardware: GPUs vs GPUs, GPUs vs Mini PCs, and Mini PCs vs Mini PCs. Memory, bandwidth, power, and verdict for every pair.',
}

export default function CompareHubPage() {
  const products = getAllProducts()
  const allSlugs = getAllComparisonSlugs()

  // Build list of pairs with metadata
  const pairs = allSlugs.map(s => {
    const parsed = parseComparisonSlug(s)
    if (!parsed) return null
    const [sA, sB] = parsed
    const pA = products.find(p => p.slug === sA)!
    const pB = products.find(p => p.slug === sB)!
    const gpuA = pA?.category === 'gpu'
    const gpuB = pB?.category === 'gpu'
    const type =
      gpuA && gpuB ? 'GPU vs GPU'
      : !gpuA && !gpuB ? 'Mini PC vs Mini PC'
      : 'GPU vs Mini PC'
    return { slug: s, pA, pB, type }
  }).filter((p): p is NonNullable<typeof p> => p !== null && !!p.pA && !!p.pB)

  const gpuVsGpu = pairs.filter(p => p.type === 'GPU vs GPU')
  const gpuVsMini = pairs.filter(p => p.type === 'GPU vs Mini PC')
  const miniVsMini = pairs.filter(p => p.type === 'Mini PC vs Mini PC')

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://theaidesk.com' },
    { name: 'Compare', url: 'https://theaidesk.com/compare' },
  ])

  const itemList = buildItemListSchema(
    'AI Hardware Comparisons',
    allSlugs.map(s => ({
      name: s.replace(/-vs-/g, ' vs ').replace(/-/g, ' '),
      url: `https://theaidesk.com/compare/${s}`,
    }))
  )

  return (
    <>
      <SchemaMarkup schema={breadcrumb} />
      <SchemaMarkup schema={itemList} />

      {/* Header */}
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
            <li className="text-edge">/</li>
            <li className="text-zinc-600">Compare</li>
          </ol>
        </nav>

        <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Head-to-Head</p>
        <h1 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-4">
          AI Hardware Comparisons
        </h1>
        <p className="text-zinc-600 max-w-xl leading-relaxed">
          Spec-by-spec comparisons across all {allSlugs.length} hardware pairs — memory, bandwidth, power draw, and a clear verdict for every use case.
        </p>
      </div>

      {/* Grouped sections */}
      {[
        { label: 'GPU vs GPU', items: gpuVsGpu, badge: 'Max Performance' },
        { label: 'GPU vs Mini PC', items: gpuVsMini, badge: 'Power vs Simplicity' },
        { label: 'Mini PC vs Mini PC', items: miniVsMini, badge: 'All-in-One Systems' },
      ].map(group => (
        <section key={group.label} className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display font-800 text-xl uppercase text-foreground">{group.label}</h2>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ore border-l-2 border-ore pl-2">
              {group.badge}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-edge border border-edge">
            {group.items.map(({ slug, pA, pB }) => (
              <Link
                key={slug}
                href={`/compare/${slug}`}
                className="group bg-ink-1 p-5 flex flex-col hover:bg-ink-2 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-800 text-base uppercase text-foreground group-hover:text-ore transition-colors leading-tight truncate">
                      {pA.name}
                    </p>
                    <p className="font-mono text-[9px] text-slate-500">{memLabel(pA)}</p>
                  </div>
                  <span className="font-mono text-[10px] text-ore shrink-0 font-700">VS</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-800 text-base uppercase text-foreground group-hover:text-ore transition-colors leading-tight truncate">
                      {pB.name}
                    </p>
                    <p className="font-mono text-[9px] text-slate-500">{memLabel(pB)}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-edge/60 pt-3">
                  <div className="flex gap-3">
                    <span className="font-mono text-[9px] text-slate-600">
                      {pA.specs.memory_bandwidth_gbps ? `${pA.specs.memory_bandwidth_gbps} GB/s` : ''}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">
                      {pB.specs.memory_bandwidth_gbps ? `${pB.specs.memory_bandwidth_gbps} GB/s` : ''}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-ore">Compare →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
