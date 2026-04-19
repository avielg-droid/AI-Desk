'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, [])

  function dismiss(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-edge bg-ink-1/95 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-1">Cookie Notice</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            This site uses no first-party cookies. Third-party services (Amazon affiliate links, Google Fonts)
            may set cookies per their own policies.{' '}
            <Link href="/privacy" className="text-ore hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => dismiss('declined')}
            className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors px-3 py-2"
          >
            Decline
          </button>
          <button
            onClick={() => dismiss('accepted')}
            className="font-mono text-[11px] uppercase tracking-widest bg-cta text-ink-0 font-medium px-4 py-2 rounded-[4px] hover:bg-yellow-300 transition-colors"
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  )
}
