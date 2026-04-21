'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIERS = [
  {
    name: 'Budget Mini PC',
    example: 'KAMRUI Pinova P1',
    slug: 'kamrui-pinova-p1',
    price: 230,
    color: 'text-slate-600',
    barColor: 'bg-slate-400',
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
    <section className="border border-edge bg-ink-1 overflow-hidden">
      <div className="h-[2px] bg-ore" />

      {/* Header */}
      <div className="border-b border-edge px-8 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-1">ROI Calculator</p>
        <h2 className="font-display font-800 text-2xl uppercase tracking-tight text-foreground">
          Cloud vs. Local: The Real Cost
        </h2>
        <p className="font-sans text-sm text-zinc-600 mt-1">
          See how fast local hardware pays for itself compared to monthly API subscriptions.
        </p>
      </div>

      <div className="p-8 space-y-8">

        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Monthly cloud AI spend
            </label>
            <span className="font-mono font-500 text-2xl text-ore">
              ${monthly}
              <span className="text-sm text-slate-500 ml-1">/mo</span>
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={monthly}
            onChange={e => setMonthly(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-edge
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ore
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-ore [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-1.5">
            <span className="font-mono text-[9px] text-slate-600">$10/mo</span>
            <span className="font-mono text-[9px] text-slate-600">$500/mo</span>
          </div>
        </div>

        {/* Cloud cost summary */}
        <div className="grid grid-cols-2 gap-px bg-edge border border-edge">
          <div className="bg-ink-1 px-6 py-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mb-1">Cloud cost · Year 1</p>
            <p className="font-mono font-500 text-2xl text-loss">${yearOneCost.toLocaleString()}</p>
            <p className="font-mono text-[9px] text-slate-600 mt-0.5">and nothing to show for it</p>
          </div>
          <div className="bg-ink-1 px-6 py-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mb-1">Cloud cost · 3 Years</p>
            <p className="font-mono font-500 text-2xl text-loss">${yearThreeCost.toLocaleString()}</p>
            <p className="font-mono text-[9px] text-slate-600 mt-0.5">still renting, still paying</p>
          </div>
        </div>

        {/* Hardware break-even */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-4">
            Hardware break-even timeline
          </p>
          <div className="space-y-4">
            {TIERS.map(tier => {
              const months = Math.ceil(tier.price / monthly)
              const barPct = Math.min(100, (months / MAX_MONTHS) * 100)
              const paid = months <= MAX_MONTHS

              return (
                <div key={tier.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <Link
                        href={`/products/${tier.slug}`}
                        className={`font-sans font-600 text-sm ${tier.color} hover:opacity-70 transition-opacity`}
                      >
                        {tier.name}
                      </Link>
                      <span className="font-mono text-[9px] text-slate-500 ml-2">{tier.example}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-xs font-500 ${tier.color}`}>
                        ~${tier.price.toLocaleString()}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500 ml-2">
                        {paid ? `↩ ${months}mo` : `>${MAX_MONTHS}mo`}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-1.5 bg-edge rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${tier.barColor}`}
                      style={{ width: `${barPct}%` }}
                    />
                    {/* Break-even marker */}
                    {paid && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-background/80"
                        style={{ left: `${barPct}%` }}
                      />
                    )}
                  </div>

                  {/* Month labels */}
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[8px] text-slate-700">Month 0</span>
                    {paid && months <= 24 && (
                      <span
                        className={`font-mono text-[8px] ${tier.color} font-500`}
                        style={{ marginLeft: `${barPct - 10}%` }}
                      >
                        ↑ Break even
                      </span>
                    )}
                    <span className="font-mono text-[8px] text-slate-700">Month {MAX_MONTHS}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footnote */}
        <p className="font-mono text-[9px] text-slate-500 border-t border-edge pt-4">
          Assumes constant monthly spend vs. one-time hardware purchase at approximate retail prices.
          Hardware then runs free indefinitely. Cloud costs compound — hardware depreciates slowly.
        </p>
      </div>
    </section>
  )
}
