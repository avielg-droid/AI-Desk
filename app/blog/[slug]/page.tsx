import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllBlogSlugs, getBlogPost, getRelatedBlogPosts, CATEGORY_LABEL } from '@/lib/blog'
import { getProductBySlug } from '@/lib/products'
import { buildBreadcrumbSchema, buildFAQSchema, buildBlogPostingSchema, buildSpeakableSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import AffiliateButton from '@/components/AffiliateButton'
import BlogContent from '@/components/BlogContent'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://ai-desk.tech/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const relatedPosts = getRelatedBlogPosts(params.slug)
  const relatedProducts = post.relatedProductSlugs
    .map(s => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== null)

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://ai-desk.tech' },
      { name: 'Blog', url: 'https://ai-desk.tech/blog' },
      { name: post.title, url: `https://ai-desk.tech/blog/${post.slug}` },
    ]),
    buildBlogPostingSchema({
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      slug: post.slug,
    }),
    buildSpeakableSchema(['h1', '.blog-intro', '.blog-verdict']),
    ...(post.faq.length > 0 ? [buildFAQSchema(post.faq)] : []),
  ]

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
          <li><Link href="/" className="hover:text-ore transition-colors">Home</Link></li>
          <li className="text-edge">/</li>
          <li><Link href="/blog" className="hover:text-ore transition-colors">Blog</Link></li>
          <li className="text-edge">/</li>
          <li className="text-zinc-600 truncate max-w-[200px]">{CATEGORY_LABEL[post.category]}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">

        {/* Main content */}
        <article>

          {/* Hero */}
          <header className="relative border border-edge overflow-hidden mb-10" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] aurora-bar" />
            <div className="absolute inset-0 bg-crosshatch" />
            <div className="relative px-6 md:px-10 py-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-ore border border-ore/30 px-1.5 py-0.5">
                  {CATEGORY_LABEL[post.category]}
                </span>
                <span className="font-mono text-[9px] text-zinc-600">{post.readingTimeMinutes} min read</span>
                <span className="font-mono text-[9px] text-zinc-600">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="font-display font-800 text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-4 leading-[1.1]">
                {post.headline}
              </h1>
              <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-2xl">
                {post.intro}
              </p>
            </div>
          </header>

          {/* Body */}
          <BlogContent blocks={post.content} />

          {/* FAQ */}
          {post.faq.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-display font-800 text-xl uppercase text-foreground">
                  Frequently Asked Questions
                </h2>
                <span className="h-px flex-1 bg-edge" />
              </div>
              <div className="space-y-1">
                {post.faq.map((item, i) => (
                  <div key={i} className="border border-edge bg-ink-1 p-5">
                    <h3 className="font-sans font-600 text-sm text-foreground mb-2 flex items-start gap-2">
                      <span className="font-mono text-[10px] text-ore mt-0.5 shrink-0">Q{i + 1}</span>
                      {item.question}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed pl-6">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-display font-800 text-xl uppercase text-foreground">Related Articles</h2>
                <span className="h-px flex-1 bg-edge" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedPosts.map(p => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group border border-edge bg-ink-1 p-4 hover:border-ore/30 transition-colors"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ore mb-1">{CATEGORY_LABEL[p.category]}</p>
                    <p className="font-mono text-sm text-foreground group-hover:text-ore transition-colors leading-snug">{p.headline}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24">

          {/* Recommended products */}
          {relatedProducts.length > 0 && (
            <div className="border border-edge bg-ink-1 overflow-hidden">
              <div className="h-[2px] bg-ore" />
              <div className="p-4 border-b border-edge">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ore">Mentioned Hardware</p>
              </div>
              <div className="divide-y divide-edge">
                {relatedProducts.map(product => (
                  <div key={product.slug} className="p-4">
                    <p className="font-sans font-600 text-sm text-foreground mb-1 leading-snug">{product.name}</p>
                    <p className="font-mono text-[9px] text-zinc-600 mb-3">{product.shortDescription}</p>
                    <AffiliateButton href={product.affiliateUrl} size="sm" label="View Deal" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compare CTA */}
          <div className="border border-edge bg-ink-1 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Not sure which to pick?</p>
            <p className="font-sans text-xs text-zinc-600 mb-3 leading-relaxed">Compare up to 3 products side-by-side with AI-native metrics.</p>
            <Link href="/compare" className="affiliate-btn inline-flex items-center gap-2 px-4 py-2 font-sans font-700 text-sm w-full justify-center">
              Compare Hardware →
            </Link>
          </div>

          {/* Back to blog */}
          <Link href="/blog" className="nav-cta flex items-center justify-center gap-2 px-4 py-2.5 border border-edge font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:border-ore/40 hover:text-ore transition-colors">
            ← All Articles
          </Link>
        </aside>

      </div>
    </>
  )
}
