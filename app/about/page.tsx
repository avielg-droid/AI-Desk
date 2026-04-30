import type { Metadata } from 'next'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const metadata: Metadata = {
  title: 'About The AI Desk',
  description: 'Learn about The AI Desk, our review methodology, and our Amazon Associates disclosure.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">About</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
          The AI Desk
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          Independent reviews of hardware for running AI locally — GPUs, Mini PCs, and AI accessories.
          We focus on real-world performance for LLM inference, Stable Diffusion, and home AI server workloads.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
          Review Methodology
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          We evaluate hardware on five criteria: memory capacity (VRAM or unified memory), memory bandwidth
          (tokens/second throughput), power efficiency (performance per watt), software ecosystem compatibility
          (CUDA, ROCm, Metal), and value for money relative to the use case.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Benchmark figures are based on publicly available data, manufacturer specs, and community-tested
          results from llama.cpp, Ollama, and ComfyUI benchmarking threads. We do not receive hardware from
          manufacturers for review.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          For the complete benchmark protocol, test conditions, and data sources, see our{' '}
          <a href="/how-we-test" className="text-ore hover:underline">full methodology page →</a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
          Affiliate Disclosure
        </h2>
        <div className="rounded-xl border border-cta/30 bg-cta/5 p-5">
          <AffiliateDisclosure className="font-mono text-xs text-cta" />
          <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
            We earn a commission when you click our product links and make a purchase on Amazon, at no
            additional cost to you. This commission funds our independent research. We are not paid by
            manufacturers for positive reviews — editorial opinions are our own.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
          Who Writes This
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Reviews and benchmarks are written by{' '}
          <a href="/about/author" className="text-ore hover:underline">Alex Voss</a>,
          an independent hardware reviewer specializing in local AI inference since 2022.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
          FTC Compliance
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          In compliance with FTC guidelines, all affiliate links are marked with{' '}
          <span className="font-mono text-xs text-slate-500">(paid link)</span> adjacent to the link.
          A site-wide disclosure banner appears on every page. See our{' '}
          <a href="/privacy" className="text-ore hover:underline">Privacy Policy</a> and{' '}
          <a href="/terms" className="text-ore hover:underline">Terms of Service</a> for full details.
        </p>
      </section>

    </div>
  )
}
