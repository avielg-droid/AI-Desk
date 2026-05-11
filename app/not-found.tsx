import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ore mb-4">404</p>
      <h1 className="font-display font-bold text-3xl text-foreground mb-3" style={{ letterSpacing: '-0.03em' }}>
        Page not found
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        This page doesn&apos;t exist. Try browsing hardware reviews instead.
      </p>
      <Link href="/" className="forge-btn px-6 py-3 font-sans font-semibold text-sm">
        Back to home
      </Link>
    </div>
  )
}
