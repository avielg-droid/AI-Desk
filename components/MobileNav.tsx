'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '/products',                label: 'Products'      },
  { href: '/categories/gpu',          label: 'GPUs'          },
  { href: '/categories/mini-pc',      label: 'Mini PCs'      },
  { href: '/categories/accessory',    label: 'Accessories'   },
  { href: '/best',                    label: 'Buying Guides' },
  { href: '/guides',                  label: 'Setup Guides'  },
  { href: '/glossary',                label: 'Glossary'      },
  { href: '/compare',                 label: 'Compare'       },
  { href: '/about',                   label: 'About'         },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const overlay = (
    <>
      {/* Backdrop — separate from header stacking context */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '280px', zIndex: 9999,
          background: 'var(--bg, #09090b)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Aurora top bar */}
        <div className="h-[2px] aurora-bar flex-shrink-0" />

        {/* Header row */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: '56px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="font-display font-600 text-base text-foreground">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{ padding: '8px', color: '#71717a', lineHeight: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-ore hover:bg-ore/5 transition-colors"
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}
            >
              <span style={{ color: 'rgb(var(--color-ore))', opacity: 0.4 }}>›</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Theme toggle footer */}
        <div
          style={{
            padding: '16px 24px', flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Hamburger button — stays inside header */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
      >
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center
          ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200
          ${open ? 'opacity-0 scale-x-0' : ''}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center
          ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Portal: escape backdrop-filter containing block of the sticky header */}
      {mounted && createPortal(overlay, document.body)}
    </>
  )
}
