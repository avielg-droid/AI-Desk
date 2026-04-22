'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
    const resolved = stored ?? 'light'
    setTheme(resolved)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  // Avoid hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return <div className="w-16 h-7" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="
        relative flex items-center gap-1.5
        px-2.5 py-1.5
        border border-edge
        font-mono text-[10px] uppercase tracking-widest
        text-zinc-600 hover:text-ore hover:border-ore/30
        transition-all duration-200
        group
      "
    >
      {isDark ? (
        /* Sun icon */
        <svg className="w-3.5 h-3.5 text-ore" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon icon */
        <svg className="w-3.5 h-3.5 text-ore" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
