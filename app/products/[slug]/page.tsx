import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { buildProductSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema'
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

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><a href="/" className="hover:text-gray-900">Home</a></li>
          <li>/</li>
          <li><a href="/products" className="hover:text-gray-900">Products</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="space-y-10">
        <ProductHero product={product} />

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Bottom Line: Is the {product.name} Good for Local AI?
          </h2>
          <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            What Can You Run on the {product.name}?
          </h2>
          <ul className="space-y-2">
            {product.useCases.map(uc => (
              <li key={uc} className="flex gap-2 text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {uc}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Full Specifications</h2>
          <ComparisonTable specs={product.specs} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pros &amp; Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-3">Pros</h3>
              <ul className="space-y-2">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-3">Cons</h3>
              <ul className="space-y-2">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-500 mt-0.5 shrink-0">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Verdict</h2>
          <p className="text-gray-700 leading-relaxed">{product.verdict}</p>
          <div className="mt-6">
            <AffiliateButton href={product.affiliateUrl} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {product.faq.map(item => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AffiliateDisclosure className="border-t border-gray-200 pt-6" />
      </div>
    </>
  )
}
