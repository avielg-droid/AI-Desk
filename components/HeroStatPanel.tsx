'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const STATS = [
  { from: 300, to: 0,  prefix: '$', suffix: '',   finalVal: '$0',  unit: '/mo',    label: 'vs $50–300 cloud API bill',    delay: 300  },
  { from: 800, to: 5,  prefix: '',  suffix: '',    finalVal: '<5',  unit: 'ms',     label: 'time to first token, local',   delay: 600  },
  { from: 0,   to: 70, prefix: '',  suffix: 'B',   finalVal: '70B', unit: 'params', label: 'largest model run locally',    delay: 900  },
]

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useCountUp(from: number, to: number, duration: number, delay: number) {
  const [value, setValue] = useState(from)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      function tick(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOut(progress)
        const current = Math.round(from + (to - from) * eased)
        setValue(current)
        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          setDone(true)
        }
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [])

  return { value, done }
}

function StatRow({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { value, done } = useCountUp(stat.from, stat.to, 1200, stat.delay)
  const display = done ? stat.finalVal : `${stat.prefix}${Math.abs(value)}${stat.suffix}`

  return (
    <div className="px-6 py-7 flex flex-col gap-2 group hover:bg-ore/5 transition-colors cursor-default key-facts border-l-2 border-transparent hover:border-ore">
      <p
        className="font-display font-bold text-foreground leading-none tabular-nums"
        style={{ fontSize: 'clamp(2.8rem, 5vw, 3.75rem)', letterSpacing: '-0.04em' }}
      >
        {display}
        <span
          className="font-mono ml-1.5 text-ore"
          style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.05rem)', letterSpacing: '0.04em' }}
        >
          {stat.unit}
        </span>
      </p>
      <p
        className="font-mono text-[9px] uppercase tracking-widest group-hover:text-ore transition-colors"
        style={{ color: 'var(--text-subtle)' }}
      >
        {stat.label}
      </p>
    </div>
  )
}

export default function HeroStatPanel() {
  return (
    <div className="hidden lg:flex flex-col divide-y divide-edge" style={{ background: 'rgb(var(--color-ink-1))' }}>
      {/* Panel header */}
      <div className="px-6 py-3.5 flex items-center justify-between bg-ore/5 border-b border-ore/10">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ore">Why Go Local</span>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>2026</span>
      </div>

      {STATS.map((s, i) => (
        <StatRow key={s.finalVal} stat={s} index={i} />
      ))}

      {/* Bottom CTA */}
      <div className="px-6 py-4 mt-auto">
        <Link
          href="/compare"
          className="font-mono text-[10px] uppercase tracking-widest hover:text-ore transition-colors"
          style={{ color: 'var(--text-subtle)' }}
        >
          Compare all hardware →
        </Link>
      </div>
    </div>
  )
}
