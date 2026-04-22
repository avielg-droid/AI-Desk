interface AffiliateButtonProps {
  href: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export default function AffiliateButton({
  href,
  label = 'Buy on Amazon',
  className,
  size = 'md',
}: AffiliateButtonProps) {
  const isMd = size === 'md'

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className ?? ''}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`
          view-deal-btn
          inline-flex items-center gap-2
          font-sans font-700 tracking-tight
          ${isMd
            ? 'px-7 py-3.5 text-base'
            : 'px-4 py-2.5 text-sm'
          }
        `}
      >
        {/* Amazon icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`shrink-0 opacity-80 ${isMd ? 'w-4 h-4' : 'w-3.5 h-3.5'}`}
          aria-hidden="true"
        >
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.076-1.045-.869-1.234-1.271-1.808-2.099-1.73 1.764-2.954 2.292-5.194 2.292-2.652 0-4.714-1.638-4.714-4.912 0-2.557 1.385-4.297 3.358-5.148 1.71-.754 4.097-.891 5.924-1.099v-.41c0-.753.06-1.642-.384-2.294-.385-.586-1.124-.828-1.776-.828-1.206 0-2.282.619-2.545 1.9-.054.285-.263.567-.55.582l-3.088-.333c-.259-.056-.548-.266-.473-.66C5.7 2.507 8.95 1.5 11.85 1.5c1.474 0 3.4.393 4.561 1.508C17.878 4.21 17.721 6.09 17.721 7.8v4.77c0 1.434.592 2.065 1.151 2.838.196.278.24.608-.01.814l-1.718 1.573zM20.936 19.12C18.836 20.919 15.848 22 13.054 22c-3.867 0-7.348-1.429-9.985-3.802-.207-.187-.023-.443.226-.298 2.844 1.656 6.358 2.653 9.989 2.653 2.449 0 5.143-.507 7.621-1.557.374-.161.688.245.031.124zm.738-1.631c-.284-.364-1.875-.172-2.591-.087-.218.026-.251-.164-.055-.302 1.27-.893 3.353-.635 3.597-.336.244.3-.063 2.386-1.254 3.382-.184.155-.358.072-.276-.13.268-.67.867-2.164.579-2.527z"/>
        </svg>
        {label}
        <svg
          className={`shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${isMd ? 'w-4 h-4' : 'w-3.5 h-3.5'}`}
          fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
      <span className="font-mono text-[9px] text-zinc-600 pl-0.5">
        Affiliate link — no extra cost to you
      </span>
    </div>
  )
}
