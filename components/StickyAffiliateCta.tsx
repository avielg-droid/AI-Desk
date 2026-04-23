'use client'

import { useState, useEffect } from 'react'

export default function StickyAffiliateCta({
  href,
  productName,
  priceDisplay,
}: {
  href: string
  productName: string
  priceDisplay: string
}) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    function onScroll() {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-edge bg-ink-1/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Name + price */}
        <div className="flex items-center gap-4 min-w-0">
          <p className="font-sans font-600 text-sm text-foreground truncate">{productName}</p>
          <span className="font-mono text-sm text-ore shrink-0">{priceDisplay}</span>
        </div>

        {/* CTA + dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="view-deal-btn inline-flex items-center gap-2 px-5 py-2 font-sans font-700 text-sm"
          >
            View Deal
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <button
            onClick={() => { setDismissed(true); setVisible(false) }}
            aria-label="Dismiss deal bar"
            className="font-mono text-zinc-500 hover:text-foreground transition-colors text-xl leading-none px-1 py-0.5"
          >
            ×
          </button>
        </div>

      </div>
    </div>
  )
}
