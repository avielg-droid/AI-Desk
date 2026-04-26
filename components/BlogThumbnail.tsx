import type { BlogCategory } from '@/types/blog'

const CATEGORY_CONFIG: Record<BlogCategory, {
  accent: string
  bg: string
  label: string
  glyph: string
  lines: string[]
}> = {
  'buying-guide': {
    accent: '#00B4D8',
    bg: 'linear-gradient(135deg, #0a0f1a 0%, #0d1a2e 100%)',
    label: 'Buying Guide',
    glyph: '◈',
    lines: ['HARDWARE', 'REVIEWED'],
  },
  'benchmarks': {
    accent: '#7C3AED',
    bg: 'linear-gradient(135deg, #0d0814 0%, #150d28 100%)',
    label: 'Benchmarks',
    glyph: '▲',
    lines: ['REAL-WORLD', 'PERF DATA'],
  },
  'how-to': {
    accent: '#16A34A',
    bg: 'linear-gradient(135deg, #071410 0%, #0d201a 100%)',
    label: 'How-To',
    glyph: '→',
    lines: ['STEP-BY-STEP', 'GUIDE'],
  },
  'analysis': {
    accent: '#EA580C',
    bg: 'linear-gradient(135deg, #140a05 0%, #201208 100%)',
    label: 'Analysis',
    glyph: '◆',
    lines: ['DEEP DIVE', 'ANALYSIS'],
  },
  'news': {
    accent: '#DC2626',
    bg: 'linear-gradient(135deg, #140505 0%, #200a0a 100%)',
    label: 'News',
    glyph: '◉',
    lines: ['LATEST', 'AI HARDWARE'],
  },
}

interface Props {
  category: BlogCategory
  tags?: string[]
  className?: string
  compact?: boolean
}

export default function BlogThumbnail({ category, tags = [], className = '', compact = false }: Props) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG['analysis']
  const tag = tags[0]?.toUpperCase().replace(/-/g, ' ') ?? ''

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ background: cfg.bg }}
      aria-hidden="true"
    >
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${category}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={cfg.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 20% 50%, ${cfg.accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Diagonal accent bar */}
      <div
        className="absolute -left-4 top-0 bottom-0 w-1 opacity-60"
        style={{ background: cfg.accent, boxShadow: `0 0 12px ${cfg.accent}` }}
      />

      {/* Content */}
      <div className={`relative flex flex-col justify-between h-full ${compact ? 'p-3' : 'p-5'}`}>

        {/* Top: glyph + label */}
        <div className="flex items-center justify-between">
          <span
            className={`font-mono font-bold leading-none ${compact ? 'text-lg' : 'text-2xl'}`}
            style={{ color: cfg.accent, textShadow: `0 0 8px ${cfg.accent}` }}
          >
            {cfg.glyph}
          </span>
          <span
            className="font-mono uppercase tracking-widest opacity-60"
            style={{ fontSize: compact ? '7px' : '8px', color: cfg.accent }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Center: big lines */}
        {!compact && (
          <div className="flex-1 flex flex-col justify-center py-2">
            {cfg.lines.map((line, i) => (
              <p
                key={i}
                className="font-mono font-bold leading-none tracking-widest"
                style={{
                  fontSize: 'clamp(13px, 2.5vw, 18px)',
                  color: i === 0 ? '#ffffff' : cfg.accent,
                  opacity: i === 0 ? 0.9 : 0.5,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Bottom: tag */}
        {tag && (
          <p
            className="font-mono uppercase tracking-widest opacity-40 truncate"
            style={{ fontSize: '7px', color: '#ffffff' }}
          >
            {tag}
          </p>
        )}
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 opacity-15"
        style={{
          width: compact ? 40 : 60,
          height: compact ? 40 : 60,
          background: `conic-gradient(from 225deg, ${cfg.accent}, transparent 60%)`,
        }}
      />
    </div>
  )
}
