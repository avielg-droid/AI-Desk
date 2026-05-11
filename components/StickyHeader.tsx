'use client'

import { useState, useEffect, type ReactNode } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

interface StickyHeaderProps {
  children?: ReactNode
}

export default function StickyHeader({ children }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll() // check initial position
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-[var(--bg)]/80 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
          : 'bg-transparent shadow-none'
      } border-b border-edge`}
    >
      {/* Aurora top rule — shrinks & fades on scroll */}
      <div
        className={`aurora-bar transition-all duration-300 ${
          scrolled ? 'h-[1px] opacity-40' : 'h-[2px] opacity-100'
        }`}
      />

      {children ?? (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">

          {/* Wordmark */}
          <a
            href="/"
            className="shrink-0 font-display font-600 text-xl tracking-tight leading-none text-foreground hover:text-ore transition-colors duration-200"
          >
            The AI Desk
          </a>

          {/* Nav (desktop) */}
          <div className="hidden md:flex items-center gap-0">
            <DesktopNav />
            <div className="ml-4 pl-4 border-l border-edge">
              <ThemeToggle />
            </div>
          </div>

          {/* Hamburger (mobile) */}
          <MobileNav />

        </nav>
      )}
    </header>
  )
}
