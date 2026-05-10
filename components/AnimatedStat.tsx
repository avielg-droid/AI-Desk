'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatProps {
  prefix?: string
  from: number
  to: number
  suffix: string
  finalLabel: string // e.g. "0 bytes" or "<5ms" — shown after animation
  className?: string
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function AnimatedStat({ prefix = '', from, to, suffix, finalLabel, className = '' }: AnimatedStatProps) {
  const [display, setDisplay] = useState<string>(finalLabel)
  const [animating, setAnimating] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          runAnimation()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function runAnimation() {
    const duration = 1400
    const start = performance.now()
    setAnimating(true)

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOut(progress)
      const current = Math.round(from + (to - from) * eased)

      if (progress < 1) {
        setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)
        requestAnimationFrame(tick)
      } else {
        setDisplay(finalLabel)
        setAnimating(false)
      }
    }

    requestAnimationFrame(tick)
  }

  return (
    <span
      ref={ref}
      className={`tabular-nums transition-opacity ${animating ? 'opacity-90' : 'opacity-100'} ${className}`}
    >
      {display}
    </span>
  )
}
