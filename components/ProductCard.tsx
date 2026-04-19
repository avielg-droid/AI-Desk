import Link from 'next/link'
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
            {product.category.replace('-', ' ').toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.shortDescription}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-500">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-sm text-gray-500">{product.rating}/5</span>
          </div>
        </div>
        <AffiliateButton href={product.affiliateUrl} />
      </div>
    </article>
  )
}
