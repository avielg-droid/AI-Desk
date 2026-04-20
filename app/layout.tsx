import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import SchemaMarkup from '@/components/SchemaMarkup'
import CookieConsent from '@/components/CookieConsent'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema'

// Playfair Display — editorial serif, 900 Black for dramatic headlines
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Source Serif 4 — highly readable optical serif for body + UI prose
const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-body',
  display: 'swap',
})

// JetBrains Mono — specs, stats, labels, badges
const jetBrainsMono = JetBrains_Mono({
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
  openGraph: {
    siteName: 'The AI Desk',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'The AI Desk — Best AI Hardware for Running AI Locally' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Desk — Best AI Hardware for Running AI Locally',
    description: 'Expert reviews of GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally in 2026.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const NAV_LINKS = [
  { href: '/products',          label: 'Products'      },
  { href: '/categories/gpu',    label: 'GPUs'          },
  { href: '/categories/mini-pc',label: 'Mini PCs'      },
  { href: '/best',              label: 'Buying Guides' },
  { href: '/compare',           label: 'Compare'       },
  { href: '/about',             label: 'About'         },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${playfairDisplay.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable}`

  return (
    <html lang="en" className={fontVars}>
      <head>
        <SchemaMarkup schema={buildOrganizationSchema()} />
        <SchemaMarkup schema={buildWebSiteSchema()} />
      </head>
      <body className="font-sans">

        {/* Amazon Associates disclosure strip */}
        <div className="bg-ink-1 border-b border-edge">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex justify-center">
            <AffiliateDisclosure className="font-mono text-[10px] text-zinc-600" />
          </div>
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 bg-ink-0/95 border-b border-edge">
          {/* Ember top rule */}
          <div className="h-[2px] bg-ore" />
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">

            {/* Wordmark — Playfair Display italic for editorial signature feel */}
            <a
              href="/"
              className="shrink-0 font-display font-900 italic text-xl tracking-tight leading-none text-foreground hover:text-ore transition-colors"
            >
              The AI Desk
            </a>

            {/* Nav links — mono for precision/label feel */}
            <div className="hidden md:flex items-center gap-0">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="relative px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors group"
                >
                  {label}
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[1px] bg-ore scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </div>

          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-24 border-t-2 border-ore bg-ink-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-3 gap-10">

              {/* Brand */}
              <div>
                <p className="font-display font-900 italic text-2xl text-foreground mb-3">
                  The AI Desk
                </p>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed max-w-xs">
                  Independent hardware reviews for running large language models and Stable Diffusion locally. No sponsored rankings.
                </p>
              </div>

              {/* Navigate */}
              <div>
                <p className="text-label mb-4">Navigate</p>
                <ul className="space-y-2">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-ore transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="text-label mb-4">Legal</p>
                <ul className="space-y-2 mb-6">
                  {[
                    { href: '/privacy',       label: 'Privacy Policy'   },
                    { href: '/terms',         label: 'Terms of Service' },
                    { href: '/accessibility', label: 'Accessibility'    },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-ore transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <AffiliateDisclosure className="font-mono text-[10px] text-zinc-700 leading-relaxed" />
                <p className="font-mono text-[10px] text-zinc-800 mt-3">
                  © {new Date().getFullYear()} The AI Desk
                </p>
              </div>

            </div>
          </div>
        </footer>

        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
