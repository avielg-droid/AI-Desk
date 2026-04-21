interface TooltipProps {
  label: string
  tip: string
  className?: string
}

export default function Tooltip({ label, tip, className = '' }: TooltipProps) {
  return (
    <span className={`relative inline-flex items-center gap-1 group/tip ${className}`}>
      {label}
      {/* Info icon */}
      <span className="shrink-0 inline-flex items-center justify-center w-3.5 h-3.5 border border-ore/30 text-ore font-mono text-[8px] leading-none select-none cursor-help">
        ?
      </span>
      {/* Tooltip bubble */}
      <span
        role="tooltip"
        className="
          pointer-events-none
          absolute bottom-full left-0 mb-2 z-50
          w-64 p-3
          border border-edge
          font-sans text-[11px] leading-relaxed text-zinc-600
          opacity-0 invisible
          group-hover/tip:opacity-100 group-hover/tip:visible
          transition-opacity duration-150
        "
        style={{
          background: 'rgba(15,15,18,0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(0,229,255,0.08), 0 8px 32px rgba(0,0,0,0.8)',
        }}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-ore block mb-1">
          {label}
        </span>
        {tip}
        {/* Arrow */}
        <span
          className="absolute top-full left-4 -mt-px w-2 h-2 border-b border-r border-edge rotate-45"
          style={{ background: 'rgba(15,15,18,0.95)' }}
        />
      </span>
    </span>
  )
}
