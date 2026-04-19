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
    <div className={`flex flex-col items-start gap-1 ${className ?? ''}`}>
      <span className="text-xs text-gray-400">(paid link)</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        {label}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}
