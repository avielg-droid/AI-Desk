import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-3xl">
        <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-medium text-blue-300 mb-4">
          {product.category.replace('-', ' ').toUpperCase()}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">{product.shortDescription}</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-amber-400 text-xl">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-gray-300">{product.rating} / 5.0</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">Brand: {product.brand}</span>
        </div>
        <AffiliateButton href={product.affiliateUrl} />
      </div>
    </section>
  )
}
