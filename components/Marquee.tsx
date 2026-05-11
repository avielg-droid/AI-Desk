'use client'

const TICKER = [
  { tag: 'tok/s', name: 'RTX 5070 12 GB',        val: '142',   dir: 'up'   },
  { tag: 'tok/s', name: 'M4 Pro 24 GB',           val: '89.3',  dir: 'up'   },
  { tag: 'tok/s', name: 'RX 9060 XT 16 GB',       val: '78.1',  dir: 'flat' },
  { tag: 'bench', name: 'Llama 3 70B Q4 · M4P',   val: '14.2',  dir: 'up'   },
  { tag: 'tok/s', name: 'Mac Mini M4',             val: '34.7',  dir: 'up'   },
  { tag: 'load',  name: 'SD-XL · RTX 5070',        val: '2.1s',  dir: 'down' },
  { tag: 'tok/s', name: 'Zenbook S14 NPU',         val: '22.4',  dir: 'up'   },
  { tag: 'bench', name: 'DeepSeek R1 · M4 Pro',   val: '11.8',  dir: 'up'   },
]

const ARROW = { up: '▲', down: '▼', flat: '▬' } as const

export default function Marquee() {
  const items = [...TICKER, ...TICKER, ...TICKER]
  return (
    <div className="marquee-bar" role="marquee" aria-label="Live benchmarks">
      <div className="marquee-bar-label">LIVE · BENCH</div>
      <div className="marquee-bar-track">
        <div className="marquee-bar-inner">
          {items.map((t, i) => (
            <span className="marquee-tick" key={i}>
              <span className={`marquee-tick-arrow marquee-tick-${t.dir}`}>
                {ARROW[t.dir as keyof typeof ARROW]}
              </span>
              <span className="marquee-tick-tag">{t.tag}</span>
              <span className="marquee-tick-name">{t.name}</span>
              <span className="marquee-tick-val">{t.val}</span>
              <span className="marquee-tick-sep"> / </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
