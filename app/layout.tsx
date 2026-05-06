import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import SchemaMarkup from '@/components/SchemaMarkup'
import CookieConsent from '@/components/CookieConsent'
import ThemeToggle from '@/components/ThemeToggle'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'
import BackToTop from '@/components/BackToTop'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: {
    default: 'The AI Desk — Best AI Hardware for Running AI Locally',
    template: '%s | The AI Desk',
  },
  description: 'Expert reviews of GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally in 2026.',
  metadataBase: new URL('https://ai-desk.tech'),
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
  other: { 'msvalidate.01': '96851A4CB49BB6869C9BFDABAAA7AAE1' },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${plusJakarta.variable} ${dmMono.variable}`}>
      <head>
        <SchemaMarkup schema={buildOrganizationSchema()} />
        <SchemaMarkup schema={buildWebSiteSchema()} />
        {/* Anti-FOUC: apply stored theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script defer src="https://cloud.umami.is/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} />
        )}
      </head>
      <body className="font-sans">

        {/* Nav */}
        <header className="sticky top-0 z-40 bg-ink-0/90 backdrop-blur-md border-b border-edge">
          {/* Aurora top rule */}
          <div className="h-[2px] aurora-bar" />
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
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 border-t border-edge bg-ink-0">
          <div className="h-[2px] rule-ember" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid md:grid-cols-4 gap-10">

              {/* Brand */}
              <div className="md:col-span-2">
                <p className="font-display font-bold text-xl text-foreground mb-3">
                  The AI Desk
                </p>
                <p className="text-sm leading-relaxed max-w-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Independent hardware reviews for running large language models and Stable Diffusion locally. No sponsored rankings.
                </p>
                <AffiliateDisclosure className="text-xs text-zinc-500" />
              </div>

              {/* Explore */}
              <div>
                <p className="text-label mb-4">Explore</p>
                <ul className="space-y-2.5">
                  {[
                    { href: '/products',   label: 'All Products'   },
                    { href: '/best',       label: 'Buying Guides'  },
                    { href: '/guides',     label: 'Setup Guides'   },
                    { href: '/blog',       label: 'Blog'           },
                    { href: '/glossary',   label: 'Glossary'       },
                    { href: '/compare',    label: 'Compare'        },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="text-sm hover:text-ore transition-colors duration-150" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="text-label mb-4">Legal</p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    { href: '/privacy',       label: 'Privacy Policy'   },
                    { href: '/terms',         label: 'Terms of Service' },
                    { href: '/about',         label: 'About'            },
                    { href: '/how-we-test',   label: 'How We Test'      },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="text-sm hover:text-ore transition-colors duration-150" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-[10px] mt-4" style={{ color: 'var(--text-subtle)' }}>
                  © {new Date().getFullYear()} The AI Desk
                </p>
              </div>

            </div>
          </div>
        </footer>

        <BackToTop />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
