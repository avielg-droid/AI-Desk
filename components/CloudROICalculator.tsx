'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIERS = [
  {
    name: 'Budget Mini PC',
    example: 'KAMRUI Pinova P1',
    slug: 'kamrui-pinova-p1',
    price: 230,
    color: 'text-foreground/60',
    barColor: 'bg-edge',
  },
  {
    name: 'Mid-Range Mini PC',
    example: 'GEEKOM IT12',
    slug: 'geekom-it12',
    price: 380,
    color: 'text-data',
    barColor: 'bg-data',
  },
  {
    name: 'Mac Mini M4',
    example: 'Apple M4 · 16GB',
    slug: 'apple-mac-mini-m4',
    price: 599,
    color: 'text-ore',
    barColor: 'bg-ore',
  },
  {
    name: 'Custom GPU Build',
    example: 'RTX 5070 + PC',
    slug: 'gigabyte-rtx-5070-windforce',
    price: 1200,
    color: 'text-win',
    barColor: 'bg-win',
  },
]

const MAX_MONTHS = 36

export default function CloudROICalculator() {
  const [monthly, setMonthly] = useState(50)

  const yearOneCost = monthly * 12
  const yearThreeCost = monthly * 36

  return (
    <section className="border border-edge bg-ink-0 overflow-hidden">
      <div className="h-[3px] rule-ember" />

      {/* Header */}
      <div className="border-b border-edge px-8 py-5 bg-ink-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-0.5">ROI Calculator</p>
        <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-foreground">
          Cloud vs. Local: The Real Cost
        </h2>
        <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-subtle)' }}>
          See how fast local hardware pays for itself vs. monthly API subscriptions.
        </p>
      </div>

      <div className="p-8 space-y-8">

        {/* Slider */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-4">
            <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
              Monthly cloud AI spend
            </label>
            <span className="font-display font-bold text-2xl text-ore leading-none">
              ${monthly}
              <span className="font-mono text-sm ml-1" style={{ color: 'var(--text-subtle)' }}>/mo</span>
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={monthly}
            onChange={e => setMonthly(Number(e.target.value))}
            className="w-full h-1 appearance-none cursor-pointer bg-edge
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ore
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-ore [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>$10/mo</span>
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>$500/mo</span>
          </div>
        </div>

        {/* Cloud cost summary */}
        <div className="grid grid-cols-2 gap-px bg-edge border border-edge">
          <div className="bg-ink-1 px-6 py-5">
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Cloud cost · Year 1</p>
            <p className="font-display font-bold text-2xl text-loss leading-none">${yearOneCost.toLocaleString()}</p>
            <p className="font-mono text-[9px] mt-1.5" style={{ color: 'var(--text-subtle)' }}>nothing to show for it</p>
          </div>
          <div className="bg-ink-1 px-6 py-5">
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Cloud cost · 3 Years</p>
            <p className="font-display font-bold text-2xl text-loss leading-none">${yearThreeCost.toLocaleString()}</p>
            <p className="font-mono text-[9px] mt-1.5" style={{ color: 'var(--text-subtle)' }}>still renting, still paying</p>
          </div>
        </div>

        {/* Hardware break-even */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: 'var(--text-subtle)' }}>
            Hardware break-even timeline
          </p>
          <div className="space-y-5">
            {TIERS.map(tier => {
              const months = Math.ceil(tier.price / monthly)
              const barPct = Math.min(100, (months / MAX_MONTHS) * 100)
              const paid = months <= MAX_MONTHS

              return (
                <div key={tier.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${tier.slug}`}
                        className={`font-sans font-semibold text-sm ${tier.color} hover:opacity-70 transition-opacity`}
                      >
                        {tier.name}
                      </Link>
                      <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>{tier.example}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-semibold ${tier.color}`}>
                        ~${tier.price.toLocaleString()}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-edge" style={{ color: 'var(--text-subtle)' }}>
                        {paid ? `${months}mo payback` : `>${MAX_MONTHS}mo`}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar — sharp, editorial */}
                  <div className="relative h-2 bg-edge overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${tier.barColor}`}
                      style={{ width: `${barPct}%` }}
                    />
                    {paid && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-background/60"
                        style={{ left: `${barPct}%` }}
                      />
                    )}
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[8px]" style={{ color: 'var(--text-subtle)' }}>Now</span>
                    <span className="font-mono text-[8px]" style={{ color: 'var(--text-subtle)' }}>Month {MAX_MONTHS}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footnote */}
        <p className="font-mono text-[9px] border-t border-edge pt-4" style={{ color: 'var(--text-subtle)' }}>
          One-time hardware cost vs. constant monthly spend. Hardware runs free indefinitely after break-even.
        </p>
      </div>
    </section>
  )
}
