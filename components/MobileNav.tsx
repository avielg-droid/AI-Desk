'use client'

import { useState, useEffect } from 'react'
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

  // Close on route change / ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] group"
      >
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center
          ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200
          ${open ? 'opacity-0 scale-x-0' : ''}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center
          ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-0/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 bottom-0 z-40 w-72 md:hidden
        bg-ink-0 border-l border-edge
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Drawer header */}
        <div className="h-[2px] aurora-bar" />
        <div className="flex items-center justify-between px-6 h-14 border-b border-edge">
          <span className="font-display font-600 text-base text-foreground">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-8 h-8 text-zinc-600 hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-6 py-3.5 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-ore hover:bg-ore/5 transition-colors border-b border-edge/40 last:border-0"
            >
              <span className="text-ore opacity-40">›</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Footer: theme toggle */}
        <div className="px-6 py-4 border-t border-edge flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}
