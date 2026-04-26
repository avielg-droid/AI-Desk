import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts, CATEGORY_LABEL } from '@/lib/blog'
import { buildBreadcrumbSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Local AI Blog — Hardware Guides, Benchmarks & Analysis (2026)',
  description: 'In-depth articles on running AI locally: GPU comparisons, VRAM guides, Ollama setup, Stable Diffusion hardware, and real benchmark data for 2026.',
  openGraph: {
    title: 'Local AI Hardware Blog — The AI Desk',
    description: 'Hardware guides, benchmarks, and analysis for running AI locally in 2026.',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'buying-guide': 'text-ore border-ore/30',
  'benchmarks':   'text-data border-data/30',
  'how-to':       'text-win border-win/30',
  'analysis':     'text-ore border-ore/30',
  'news':         'text-loss border-loss/30',
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()
  const featured = posts.filter(p => p.featured)
  const rest = posts.filter(p => !p.featured)

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://ai-desk.tech' },
    { name: 'Blog', url: 'https://ai-desk.tech/blog' },
  ])

  return (
    <>
      <SchemaMarkup schema={breadcrumb} />

      <div className="space-y-12">

        {/* Header */}
        <section className="relative border border-edge overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
          <div className="absolute inset-0 bg-crosshatch" />
          <div className="relative px-8 py-12 max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-3">
              The AI Desk Blog
            </p>
            <h1 className="font-display font-700 text-4xl md:text-5xl text-foreground mb-4">
              Local AI Hardware<br />Guides & Analysis
            </h1>
            <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-xl">
              GPU benchmarks, VRAM guides, Ollama setup, Stable Diffusion hardware requirements, and cost comparisons — everything you need to choose and run local AI.
            </p>
          </div>
        </section>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display font-800 text-xl uppercase tracking-tight text-foreground whitespace-nowrap">
                Featured
              </h2>
              <span className="h-px flex-1 bg-edge" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featured.map(post => (
                <PostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All posts */}
        {rest.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display font-800 text-xl uppercase tracking-tight text-foreground whitespace-nowrap">
                All Articles
              </h2>
              <span className="h-px flex-1 bg-edge" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                {posts.length} articles
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {rest.map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border border-edge bg-ink-1 p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-2">Ready to buy?</p>
          <h2 className="font-display font-700 text-2xl text-foreground mb-3">
            Find the Right Hardware
          </h2>
          <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto">
            Every article links to our reviewed products. Browse all hardware or use the compare tool to find your match.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="affiliate-btn inline-flex items-center gap-2 px-6 py-2.5 font-sans font-700 text-sm">
              Browse All Hardware →
            </Link>
            <Link href="/compare" className="nav-cta inline-flex items-center gap-2 px-6 py-2.5 border border-edge font-mono text-xs uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore">
              Compare Tool
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}

function PostCard({ post, featured }: { post: ReturnType<typeof getAllBlogPosts>[0]; featured?: boolean }) {
  const catColor = CATEGORY_COLORS[post.category] ?? 'text-ore border-ore/30'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col border border-edge bg-ink-1 p-5 hover:border-ore/30 aurora-glow-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`font-mono text-[9px] uppercase tracking-widest border px-1.5 py-0.5 shrink-0 ${catColor}`}>
          {CATEGORY_LABEL[post.category]}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 shrink-0">
          {post.readingTimeMinutes} min read
        </span>
      </div>

      <h3 className={`font-mono font-600 leading-snug group-hover:text-ore transition-colors mb-2 ${featured ? 'text-base' : 'text-sm'} text-foreground`}>
        {post.headline}
      </h3>

      <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-2 flex-1 mb-4">
        {post.description}
      </p>

      <div className="flex items-center justify-between border-t border-edge/60 pt-3">
        <span className="font-mono text-[9px] text-zinc-600">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="font-mono text-[10px] text-ore opacity-0 group-hover:opacity-100 transition-opacity">
          Read →
        </span>
      </div>
    </Link>
  )
}
