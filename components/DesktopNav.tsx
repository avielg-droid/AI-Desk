'use client'

import { useState, useRef, useEffect } from 'react'

interface NavItem {
  href?: string
  label: string
  children?: { href: string; label: string; sub?: string }[]
}

const NAV: NavItem[] = [
  {
    label: 'Shop',
    children: [
      { href: '/products',             label: 'All Products',  sub: 'Full catalog'          },
      { href: '/categories/gpu',       label: 'GPUs',          sub: 'Discrete graphics cards' },
      { href: '/categories/mini-pc',   label: 'Mini PCs',      sub: 'Compact AI machines'   },
      { href: '/categories/accessory', label: 'Accessories',   sub: 'Cables, UPS, mounts'   },
    ],
  },
  {
    label: 'Guides',
    children: [
      { href: '/best',   label: 'Buying Guides', sub: 'Best picks by use case' },
      { href: '/guides', label: 'Setup Guides',  sub: 'Run AI on your hardware' },
    ],
  },
  { href: '/compare',  label: 'Compare'  },
  { href: '/glossary', label: 'Glossary' },
  { href: '/about',    label: 'About'    },
]

function DropdownMenu({ items }: { items: NonNullable<NavItem['children']> }) {
  return (
    <div className="absolute top-full left-0 pt-2 z-50 min-w-[220px]">
      <div
        className="border border-edge bg-ink-0/95 backdrop-blur-md py-1"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,255,0.06)' }}
      >
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col px-4 py-2.5 hover:bg-ore/5 transition-colors group"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground group-hover:text-ore transition-colors">
              {item.label}
            </span>
            {item.sub && (
              <span className="font-mono text-[9px] text-zinc-600 mt-0.5">{item.sub}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        className="relative px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-foreground transition-colors duration-150 flex items-center gap-1 group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <svg
          width="8" height="8" viewBox="0 0 8 8" fill="none"
          className={`text-zinc-600 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span className="absolute bottom-0 left-3.5 right-3.5 h-px aurora-bar scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </button>
      {open && item.children && <DropdownMenu items={item.children} />}
    </div>
  )
}

export default function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-0">
      {NAV.map(item =>
        item.children ? (
          <NavDropdown key={item.label} item={item} />
        ) : (
          <a
            key={item.href}
            href={item.href}
            className="relative px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-foreground transition-colors duration-150 group"
          >
            {item.label}
            <span className="absolute bottom-0 left-3.5 right-3.5 h-px aurora-bar scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>
        )
      )}
    </div>
  )
}
