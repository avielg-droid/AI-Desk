interface AffiliateButtonProps {
  href: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export default function AffiliateButton({
  href,
  label = 'Check Price on Amazon',
  className,
  size = 'md',
}: AffiliateButtonProps) {
  const padCls = size === 'sm'
    ? 'px-4 py-2 text-xs gap-2'
    : 'px-6 py-3 text-sm gap-3'

  return (
    <div className={`inline-flex flex-col items-start gap-1.5 ${className ?? ''}`}>
      {/* Aurora border wrapper */}
      <div className="aurora-cta-wrap group">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`
            relative inline-flex items-center ${padCls}
            font-mono font-500 uppercase tracking-widest
            bg-foreground text-ink-0
            transition-all duration-200
            group-hover:opacity-85
          `}
        >
          {label}
          {/* Arrow */}
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
        (paid link)
      </span>
    </div>
  )
}
