'use client'

import Link from 'next/link'
import AmazonImage from './AmazonImage'

const PERSONAS = [
  {
    id: 'plug-and-play',
    badge: 'Plug-and-Play AI',
    headline: 'Just Works.',
    subheadline: 'No drivers. No CUDA. No config.',
    body: 'Download Ollama, open the app, run a model. Apple Silicon handles the rest — CPU, GPU, and RAM unified in one chip, tuned for exactly this. If you want private local AI running in under 10 minutes, this is your path.',
    href: '/categories/mini-pc',
    cta: 'Browse Mac Minis',
    tags: ['macOS Native', 'Ollama Ready', 'Zero Config'],
    products: [
      { name: 'Mac Mini M4', sub: '16GB · 120 GB/s', href: '/products/apple-mac-mini-m4', asin: 'B0DLBX4B1K', image: '/products/apple-mac-mini-m4.jpg' },
      { name: 'Mac Mini M4 Pro', sub: '24GB · 273 GB/s', href: '/products/apple-mac-mini-m4-pro', asin: 'B0DLBVHSLD', image: '/products/apple-mac-mini-m4-pro.jpg' },
    ],
    accent: 'text-ore',
    border: 'border-ore/20',
    bg: 'bg-ore/5',
    topBar: 'bg-ore',
  },
  {
    id: 'budget-always-on',
    badge: 'Always-On Assistant',
    headline: 'Private. 24/7.',
    subheadline: 'Low cost. Runs while you sleep.',
    body: 'A compact Windows mini PC drawing 20–55W — quiet enough for a home office, cheap enough to leave on permanently. Run a private chatbot or automation server without a cloud subscription eating into your margin every month.',
    href: '/categories/mini-pc',
    cta: 'Browse Mini PCs',
    tags: ['Windows 11 Pro', 'Ollama + LM Studio', '24/7 Capable'],
    products: [
      { name: 'KAMRUI Hyper H2', sub: '16GB · Intel 14450HX', href: '/products/kamrui-hyper-h2', asin: 'B0G488CW54', image: '/products/kamrui-hyper-h2.jpg' },
      { name: 'GEEKOM IT12', sub: '16GB · i5-12450H', href: '/products/geekom-it12', asin: 'B0C85YVQLW', image: '/products/geekom-it12.jpg' },
    ],
    accent: 'text-data',
    border: 'border-data/20',
    bg: 'bg-data/5',
    topBar: 'bg-data',
  },
  {
    id: 'custom-builder',
    badge: 'The Custom Builder',
    headline: 'Maximum Power.',
    subheadline: 'Your hardware. Your rules.',
    body: 'A discrete GPU in a custom build gives you CUDA/ROCm acceleration, more VRAM headroom, and performance that no mini PC can match. Higher setup complexity, but if you\'re running Stable Diffusion, training LoRAs, or pushing 13B+ models — this is the ceiling.',
    href: '/categories/gpu',
    cta: 'Browse GPUs',
    tags: ['CUDA / ROCm', 'Stable Diffusion', 'Max VRAM'],
    products: [
      { name: 'RTX 5070 WINDFORCE', sub: '12GB GDDR7 · 672 GB/s', href: '/products/gigabyte-rtx-5070-windforce', asin: 'B0DTQMLX4F', image: '/products/gigabyte-rtx-5070-windforce.jpg' },
      { name: 'RX 9060 XT 16G', sub: '16GB GDDR6 · RDNA 4', href: '/products/gigabyte-rx-9060-xt-gaming', asin: 'B0F91KM1CK', image: '/products/gigabyte-rx-9060-xt-gaming.jpg' },
    ],
    accent: 'text-win',
    border: 'border-win/20',
    bg: 'bg-win/5',
    topBar: 'bg-win',
  },
]

export default function PersonaFunnels() {
  return (
    <section className="border border-edge overflow-hidden">
      <div className="h-[3px] rule-ember" />
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-edge bg-ink-1">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">Find Your Path</p>
          <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">
            Which Setup Is Right For You?
          </h2>
        </div>
        <span className="h-px flex-1 bg-edge" />
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-edge">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className="relative flex flex-col overflow-hidden bg-ink-0"
          >
            {/* Top accent bar */}
            <div className={`h-[3px] ${p.topBar}`} />

            <div className="p-6 flex flex-col flex-1">
              {/* Badge */}
              <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${p.accent} mb-3`}>
                {p.badge}
              </span>

              {/* Headline */}
              <h3 className="font-display font-black text-3xl uppercase text-foreground leading-tight mb-1">
                {p.headline}
              </h3>
              <p className={`font-mono text-[10px] uppercase tracking-widest ${p.accent} mb-4`}>
                {p.subheadline}
              </p>

              {/* Body */}
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {p.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tags.map(tag => (
                  <span
                    key={tag}
                    className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${p.border} ${p.accent}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Featured products — 2-column card grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {p.products.map(prod => (
                  <Link
                    key={prod.href}
                    href={prod.href}
                    className={`group flex flex-col border ${p.border} bg-background hover:bg-ink-1 transition-colors overflow-hidden`}
                  >
                    {/* Image area — square, white bg */}
                    <div className="relative w-full aspect-square bg-white overflow-hidden">
                      <AmazonImage
                        asin={prod.asin}
                        name={prod.name}
                        localSrc={prod.image}
                        size={160}
                        compact
                        className="w-full h-full p-3 object-contain"
                      />
                    </div>
                    {/* Info below image */}
                    <div className="px-2.5 py-2 border-t border-edge/40">
                      <p className={`font-sans font-semibold text-[11px] text-foreground group-hover:${p.accent.replace('text-', 'text-')} transition-colors leading-snug truncate`}>
                        {prod.name}
                      </p>
                      <p className="font-mono text-[9px] mt-0.5 leading-none" style={{ color: 'var(--text-subtle)' }}>
                        {prod.sub}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={p.href}
                className={`mt-auto inline-flex items-center gap-2 px-4 py-2.5 border ${p.border} rounded-lg text-sm font-medium ${p.accent} hover:opacity-80 transition-opacity`}
              >
                {p.cta}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="square" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
