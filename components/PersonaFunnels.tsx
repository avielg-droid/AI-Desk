import Link from 'next/link'

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
      { name: 'Mac Mini M4', sub: '16GB · 120 GB/s', href: '/products/apple-mac-mini-m4' },
      { name: 'Mac Mini M4 Pro', sub: '24GB · 273 GB/s', href: '/products/apple-mac-mini-m4-pro' },
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
      { name: 'KAMRUI Hyper H2', sub: '16GB · Intel 14450HX', href: '/products/kamrui-hyper-h2' },
      { name: 'GEEKOM IT12', sub: '16GB · i5-12450H', href: '/products/geekom-it12' },
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
      { name: 'RTX 5070 WINDFORCE', sub: '12GB GDDR7 · 672 GB/s', href: '/products/gigabyte-rtx-5070-windforce' },
      { name: 'RX 9060 XT 16G', sub: '16GB GDDR6 · RDNA 4', href: '/products/gigabyte-rx-9060-xt-gaming' },
    ],
    accent: 'text-win',
    border: 'border-win/20',
    bg: 'bg-win/5',
    topBar: 'bg-win',
  },
]

export default function PersonaFunnels() {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-1">Find Your Path</p>
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            Which Setup Is Right For You?
          </h2>
        </div>
        <span className="h-px flex-1 bg-edge" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className={`relative border ${p.border} ${p.bg} flex flex-col overflow-hidden`}
          >
            {/* Top accent bar */}
            <div className={`h-[3px] ${p.topBar}`} />

            <div className="p-7 flex flex-col flex-1">
              {/* Badge */}
              <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${p.accent} mb-4`}>
                {p.badge}
              </span>

              {/* Headline */}
              <h3 className="font-display font-900 text-3xl uppercase text-foreground leading-tight mb-1">
                {p.headline}
              </h3>
              <p className={`font-mono text-[10px] uppercase tracking-widest ${p.accent} mb-5`}>
                {p.subheadline}
              </p>

              {/* Body */}
              <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6">
                {p.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.tags.map(tag => (
                  <span
                    key={tag}
                    className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${p.border} ${p.accent}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Featured products */}
              <div className="space-y-2 mb-6">
                {p.products.map(prod => (
                  <Link
                    key={prod.href}
                    href={prod.href}
                    className="flex items-center justify-between p-3 bg-background border border-edge/60 hover:border-edge transition-colors group"
                  >
                    <div>
                      <p className="font-sans font-600 text-xs text-foreground group-hover:text-ore transition-colors">
                        {prod.name}
                      </p>
                      <p className="font-mono text-[9px] text-slate-500 mt-0.5">{prod.sub}</p>
                    </div>
                    <span className={`font-mono text-xs ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      →
                    </span>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={p.href}
                className={`mt-auto inline-flex items-center gap-2 px-4 py-2.5 border ${p.border} font-mono text-[11px] uppercase tracking-widest ${p.accent} hover:opacity-80 transition-opacity`}
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
