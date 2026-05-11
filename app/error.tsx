'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-4">Error</p>
      <h1 className="font-display font-bold text-3xl text-foreground mb-3" style={{ letterSpacing: '-0.03em' }}>
        Something went wrong
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        An unexpected error occurred. Try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="forge-btn px-6 py-3 font-sans font-semibold text-sm"
      >
        Try again
      </button>
    </div>
  )
}
