import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import SchemaMarkup from '@/components/SchemaMarkup'
import { buildOrganizationSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'] })

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
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup schema={buildOrganizationSchema()} />
      </head>
      <body className={inter.className}>
        {/* Site-wide Amazon Associates disclosure — required on every page */}
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <AffiliateDisclosure className="text-center text-amber-800" />
          </div>
        </div>

        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gray-900">
              The AI Desk
            </a>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <a href="/products" className="hover:text-gray-900">All Products</a>
              <a href="/categories/gpu" className="hover:text-gray-900">GPUs</a>
              <a href="/categories/mini-pc" className="hover:text-gray-900">Mini PCs</a>
              <a href="/about" className="hover:text-gray-900">About</a>
            </div>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <AffiliateDisclosure className="mb-2" />
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} The AI Desk. All product links are affiliate links.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
