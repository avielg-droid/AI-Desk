import type { Metadata } from 'next'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const metadata: Metadata = {
  title: 'About The AI Desk',
  description: 'Learn about The AI Desk, our review methodology, and our Amazon Associates disclosure.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">About The AI Desk</h1>
      <p className="text-gray-700 leading-relaxed">
        The AI Desk publishes expert reviews of hardware for running AI locally — GPUs, Mini PCs, and AI accessories. We focus on real-world performance for LLM inference, Stable Diffusion, and home AI server use cases.
      </p>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our Review Methodology</h2>
        <p className="text-gray-700 leading-relaxed">
          We evaluate hardware based on: memory capacity (VRAM/unified), memory bandwidth (tokens/second throughput), power efficiency (performance per watt), software ecosystem compatibility, and value for money.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Affiliate Disclosure</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AffiliateDisclosure className="font-medium text-amber-900" />
          <p className="text-sm text-amber-800 mt-2">
            This means we may earn a commission when you click our product links and make a purchase on Amazon, at no additional cost to you. This commission helps fund our independent research and review process.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">FTC Disclosure</h2>
        <p className="text-gray-700 leading-relaxed">
          In compliance with FTC guidelines, all affiliate links on this site are marked with &quot;(paid link)&quot; immediately adjacent to the link. We are not paid by manufacturers to produce reviews — our editorial opinions are independent.
        </p>
      </section>
    </div>
  )
}
