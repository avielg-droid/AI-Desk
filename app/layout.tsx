import type { Metadata } from 'next'
import { Barlow_Condensed, Barlow, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import SchemaMarkup from '@/components/SchemaMarkup'
import { buildOrganizationSchema } from '@/lib/schema'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The AI Desk — Best AI Hardware for Running AI Locally',
    template: '%s | The AI Desk',
  },
  description: 'Expert reviews of GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally in 2026.',
  metadataBase: new URL('https://theaidesk.com'),
  openGraph: { siteName: 'The AI Desk', type: 'website' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${barlowCondensed.variable} ${barlow.variable} ${jetbrainsMono.variable}`

  return (
    <html lang="en" className={fontVars}>
      <head>
        <SchemaMarkup schema={buildOrganizationSchema()} />
      </head>
      <body className="font-sans">

        {/* Compliance strip — Amazon Associates required disclosure */}
        <div className="bg-ink-1 border-b border-edge/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex justify-center">
            <AffiliateDisclosure className="text-xs text-slate-500" />
          </div>
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 bg-ink-0/90 backdrop-blur-md border-b border-edge/70">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ore to-transparent opacity-60" />
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-display font-800 text-xl tracking-tight text-foreground hover:text-ore transition-colors">
              <span className="text-ore">THE</span> AI DESK
            </a>
            <div className="flex items-center gap-1">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/categories/gpu', label: 'GPUs' },
                { href: '/categories/mini-pc', label: 'Mini PCs' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-foreground hover:bg-ink-2/60 rounded-md transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-24 border-t border-edge/60 bg-ink-1/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <p className="font-display font-800 text-lg text-foreground">
                  <span className="text-ore">THE</span> AI DESK
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Independent reviews of AI hardware for running LLMs and Stable Diffusion locally.
                </p>
              </div>
              <div className="text-right">
                <AffiliateDisclosure className="text-xs text-slate-500" />
                <p className="text-xs text-slate-600 mt-1">
                  © {new Date().getFullYear()} The AI Desk
                </p>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
