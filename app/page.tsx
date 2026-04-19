import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The Best AI Hardware<br />for Running AI Locally
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Expert reviews of GPUs, Mini PCs, and AI accessories — tested for LLM inference, Stable Diffusion, and local AI workloads in 2026.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          Browse All Products
        </Link>
      </section>

      {/* Category grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { slug: 'gpu', label: 'GPUs', description: 'Discrete graphics cards for maximum AI throughput' },
            { slug: 'mini-pc', label: 'Mini PCs', description: 'Compact all-in-one AI workstations' },
            { slug: 'ai-pc', label: 'AI PCs', description: 'Desktop PCs optimized for local AI' },
            { slug: 'accessory', label: 'Accessories', description: 'Cooling, cables, and AI peripherals' },
          ].map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900">{cat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor&apos;s Picks</h2>
        <p className="text-gray-600 mb-6">Hand-picked AI hardware for different budgets and use cases.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/products" className="text-blue-600 font-medium hover:underline">
            View all {allProducts.length} products →
          </Link>
        </div>
      </section>

      {/* GEO informational section */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How to Choose AI Hardware for Running LLMs Locally
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Start with VRAM or Unified Memory</h3>
            <p>The single most important spec for local AI is memory capacity. A 7B model needs ~4–8GB; 13B needs ~8–16GB; 70B needs ~40GB+. Unified memory (Apple Silicon) and VRAM (discrete GPUs) both count.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Memory Bandwidth Determines Speed</h3>
            <p>Tokens per second scales directly with memory bandwidth. The RTX 4090&apos;s 1,008 GB/s is ~8x faster than a budget mini PC&apos;s 68 GB/s for the same model.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">macOS vs Windows vs Linux</h3>
            <p>Apple Silicon on macOS has the best out-of-box experience via Ollama. NVIDIA GPUs on Windows/Linux offer the broadest software compatibility. AMD GPUs perform best on Linux with ROCm.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
