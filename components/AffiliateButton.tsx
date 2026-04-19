interface AffiliateButtonProps {
  href: string
  label?: string
  className?: string
}

export default function AffiliateButton({
  href,
  label = 'Check Price on Amazon',
  className,
}: AffiliateButtonProps) {
  return (
    <div className={`flex flex-col items-start gap-1.5 ${className ?? ''}`}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">(paid link)</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group inline-flex items-center gap-2.5 rounded-lg btn-shimmer px-6 py-3 font-display font-700 text-sm uppercase tracking-widest text-white shadow-lg shadow-ore/20 hover:shadow-ore/40 transition-shadow"
      >
        {label}
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}
