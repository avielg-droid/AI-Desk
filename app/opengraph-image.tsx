import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Dot grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Cyan accent bar */}
        <div style={{ width: 64, height: 4, background: '#0891B2', marginBottom: 44, flexShrink: 0 }} />

        {/* Headline */}
        <div style={{
          fontSize: 80, fontWeight: 800, color: '#F8FAFC',
          lineHeight: 1, letterSpacing: '-3px', marginBottom: 28,
        }}>
          The Hardware That Runs{' '}
          <span style={{ color: '#0891B2' }}>AI.</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: '#94A3B8', marginBottom: 'auto', letterSpacing: '-0.3px' }}>
          Independent reviews of GPUs, Mini PCs & accessories for local AI inference
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 56, marginTop: 48 }}>
          {[
            { val: '$0', unit: '/mo', label: 'vs cloud API' },
            { val: '<5', unit: 'ms', label: 'first token' },
            { val: '70B', unit: 'params', label: 'run locally' },
          ].map(s => (
            <div key={s.val} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ color: '#F8FAFC', fontSize: 44, fontWeight: 800, letterSpacing: '-1px', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                {s.val}
                <span style={{ color: '#0891B2', fontSize: 20, fontWeight: 600, letterSpacing: '1px' }}>{s.unit}</span>
              </div>
              <div style={{ color: '#475569', fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div style={{
          position: 'absolute', top: 44, right: 80,
          color: '#334155', fontSize: 15, letterSpacing: '1px',
        }}>
          ai-desk.tech
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
