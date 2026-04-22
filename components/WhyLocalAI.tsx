const PILLARS = [
  {
    id: '01',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Complete Data Privacy',
    body: 'Your prompts, documents, and model outputs never leave your machine. No cloud provider storing your conversations. No risk of training on your proprietary data. What runs locally stays local — always.',
    stat: '0 bytes',
    statLabel: 'sent to cloud',
  },
  {
    id: '02',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Zero API Costs',
    body: 'Cloud AI APIs bill per token. At $0.01–$0.06 per 1K tokens, a moderately active team hits $50–$300/month easily. Local inference has zero marginal cost — run 10 million tokens or 10 billion, your electricity bill barely moves.',
    stat: '$0',
    statLabel: 'per token',
  },
  {
    id: '03',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Zero Latency',
    body: 'Cloud inference adds 100–800ms of network round-trip before the first token. Local models start generating instantly. For real-time applications, coding assistants, or agentic workflows that chain dozens of calls, that latency compounds into seconds of dead time per interaction.',
    stat: '<5ms',
    statLabel: 'time to first token',
  },
]

export default function WhyLocalAI() {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-1">The Case For Local</p>
          <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
            Why Run AI Locally?
          </h2>
        </div>
        <span className="h-px flex-1 bg-edge" />
      </div>

      {/* Pillars */}
      <div className="grid md:grid-cols-3 gap-px bg-edge border border-edge">
        {PILLARS.map((p) => (
          <div key={p.id} className="relative bg-ink-1 p-8 flex flex-col group">
            {/* Number watermark */}
            <span className="absolute top-6 right-6 font-mono text-4xl font-500 text-ore/10 select-none leading-none">
              {p.id}
            </span>

            {/* Icon */}
            <div className="text-ore mb-5">{p.icon}</div>

            {/* Title */}
            <h3 className="font-display font-800 text-lg uppercase text-foreground mb-3">
              {p.title}
            </h3>

            {/* Body */}
            <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6 flex-1">
              {p.body}
            </p>

            {/* Stat */}
            <div className="border-t border-edge pt-5">
              <p className="font-mono font-500 text-2xl text-ore leading-none">
                {p.stat}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">
                {p.statLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
