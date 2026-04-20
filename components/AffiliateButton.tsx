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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`group inline-flex items-center ${padCls} font-display font-800 uppercase tracking-widest text-ink-0 bg-ore hover:bg-[#c74f14] transition-colors`}
      >
        {label}
        {/* Arrow — shifts right on hover */}
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="square" strokeLinejoin="miter" d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
        (paid link)
      </span>
    </div>
  )
}
