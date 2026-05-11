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
import SchemaMarkup from '@/components/SchemaMarkup'
import CookieConsent from '@/components/CookieConsent'
import StickyHeader from '@/components/StickyHeader'
import BackToTop from '@/components/BackToTop'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: {
    default: 'The AI Desk — Best AI Hardware for Running AI Locally',
    template: '%s | The AI Desk',
  },
  description: 'Independent reviews of GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally in 2026. Real benchmark numbers — no fluff.',
  metadataBase: new URL('https://ai-desk.tech'),
  openGraph: {
    siteName: 'The AI Desk',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'The AI Desk — Best AI Hardware for Running AI Locally' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Desk — Best AI Hardware for Running AI Locally',
    description: 'Independent reviews of GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally in 2026. Real benchmark numbers — no fluff.',
    images: ['/opengraph-image'],
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
        <StickyHeader />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 border-t border-edge" style={{ background: 'rgb(var(--color-ink-1))' }}>
          <div className="h-[2px] rule-ember" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-6">

            {/* Main grid: brand left, 3-col links right */}
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 mb-12">

              {/* Brand */}
              <div>
                {/* Wordmark */}
                <div className="inline-flex items-baseline gap-2.5 font-display font-bold tracking-tight mb-6" style={{ fontSize: '22px' }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ore pt-1">01</span>
                  <span className="text-foreground">The <em className="not-italic text-ore">AI</em> Desk</span>
                </div>
                <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  Independent hardware reviews for running large language models on your own machine.
                </p>
                {/* Affiliate disclosure box */}
                <div
                  className="font-mono text-[10px] leading-relaxed p-4"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid rgb(var(--color-edge))',
                    borderLeft: '2px solid rgb(var(--color-ore))',
                    background: 'rgb(var(--color-ink-0))',
                  }}
                >
                  <strong>Amazon Associates disclosure.</strong> As an Amazon Associate, The AI Desk earns from qualifying purchases. This funds testing — never editorial direction.
                </div>
              </div>

              {/* 3-col links */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-subtle)' }}>Hardware</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { href: '/categories/gpu',        label: 'GPUs'        },
                      { href: '/categories/mini-pc',    label: 'Mini PCs'    },
                      { href: '/categories/ai-pc',      label: 'AI PCs'      },
                      { href: '/categories/accessory',  label: 'Accessories' },
                      { href: '/categories/dock',       label: 'Docks'       },
                      { href: '/categories/nas',        label: 'NAS'         },
                      { href: '/categories/npu-laptop', label: 'NPU Laptops' },
                    ].map(({ href, label }) => (
                      <a key={href} href={href} className="text-sm py-1.5 hover:text-ore transition-colors" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-subtle)' }}>Guides</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { href: '/best',               label: 'Buying Guides' },
                      { href: '/guides',             label: 'Setup Guides'  },
                      { href: '/blog',               label: 'Blog'          },
                      { href: '/glossary',           label: 'Glossary'      },
                      { href: '/compare',            label: 'Compare'       },
                    ].map(({ href, label }) => (
                      <a key={href} href={href} className="text-sm py-1.5 hover:text-ore transition-colors" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-subtle)' }}>Desk</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { href: '/about',       label: 'About'       },
                      { href: '/how-we-test', label: 'Methodology' },
                      { href: '/privacy',     label: 'Privacy'     },
                      { href: '/terms',       label: 'Terms'       },
                    ].map(({ href, label }) => (
                      <a key={href} href={href} className="text-sm py-1.5 hover:text-ore transition-colors" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer bottom */}
            <div className="flex justify-between items-center pt-6 border-t border-edge">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-subtle)' }}>
                © {new Date().getFullYear()} The AI Desk
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-subtle)' }}>
                v1.0 · Built in public · Hand-benchmarked
              </span>
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
