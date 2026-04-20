import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Accessibility commitment and known limitations for The AI Desk (theaidesk.com).',
  robots: { index: false, follow: false },
}

export default function AccessibilityPage() {
  const updated = 'April 19, 2026'

  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Legal</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
          Accessibility Statement
        </h1>
        <p className="font-mono text-xs text-slate-500">Last updated: {updated}</p>
      </div>

      <div className="rounded-xl border border-ore/20 bg-ore/5 p-5">
        <p className="text-sm text-zinc-700 leading-relaxed">
          The AI Desk is committed to making our content accessible to all users, including those who rely on
          assistive technologies. We aim to conform to the{' '}
          <strong className="text-foreground">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
        </p>
      </div>

      {[
        {
          heading: 'Our Commitments',
          items: [
            {
              name: 'Semantic HTML',
              detail: 'We use proper heading hierarchy (H1 → H2 → H3), landmark elements (<nav>, <main>, <footer>), and semantic list structures so screen readers can navigate content logically.',
            },
            {
              name: 'Keyboard Navigation',
              detail: 'All interactive elements — navigation links, affiliate buttons, the Hardware Matcher — are reachable and operable via keyboard alone. Focus states are visible.',
            },
            {
              name: 'Color Contrast',
              detail: 'Primary text (#F1F5F9 on #0F172A) achieves a contrast ratio above 13:1, exceeding WCAG AA requirements (4.5:1 for normal text). Accent color (#14B8A6) on dark backgrounds meets AA for large text.',
            },
            {
              name: 'Alt Text',
              detail: 'Product images include descriptive alt text. Decorative elements use empty alt attributes (alt="") or are hidden from assistive technologies (aria-hidden="true").',
            },
            {
              name: 'Structured Data',
              detail: 'All product pages include JSON-LD structured data (Product, FAQPage, BreadcrumbList) which helps assistive technologies and search engines understand page content.',
            },
            {
              name: 'No Motion Required',
              detail: 'Animations and transitions are subtle and non-essential. Users with prefers-reduced-motion enabled will experience a static layout. No content is hidden behind animations.',
            },
            {
              name: 'ARIA Labels',
              detail: 'Navigation landmarks include aria-label attributes. The breadcrumb navigation uses aria-label="Breadcrumb". Interactive components use appropriate ARIA roles.',
            },
          ],
        },
        {
          heading: 'Known Limitations',
          items: [
            {
              name: 'Hardware Matcher',
              detail: 'The interactive Hardware Matcher component (\'Can I Run It?\') uses client-side JavaScript. Users with JavaScript disabled will see a static fallback but cannot interact with the task selector.',
            },
            {
              name: 'External Links',
              detail: 'Affiliate links open in a new tab (_blank). Each link includes rel="noopener noreferrer" for security. We are reviewing whether to add explicit "opens in new tab" announcements for screen reader users.',
            },
            {
              name: 'Third-Party Content',
              detail: 'We cannot guarantee the accessibility of Amazon product pages or other external sites we link to. Those sites are governed by their own accessibility policies.',
            },
          ],
        },
        {
          heading: 'Feedback and Contact',
          body: [
            'If you encounter an accessibility barrier on The AI Desk, please contact us via the About page. Include a description of the barrier, the page URL, and the assistive technology you are using.',
            'We aim to respond to accessibility feedback within 5 business days and to address confirmed barriers in the next site update.',
          ],
        },
        {
          heading: 'Technical Specification',
          body: [
            'This site is built with Next.js 14 (React), served over HTTPS, and rendered with full server-side HTML for core content. JavaScript enhances interactive features but is not required to read reviews and specifications.',
            'We test with VoiceOver (macOS/iOS) and keyboard-only navigation during development.',
          ],
        },
      ].map(section => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
            {section.heading}
          </h2>
          {'items' in section && (
            <ul className="space-y-3">
              {section.items?.map(item => (
                <li key={item.name} className="rounded-lg border border-edge bg-ink-1 px-4 py-3">
                  <p className="font-mono text-xs text-ore mb-1">{item.name}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          )}
          {'body' in section && section.body?.map((p, i) => (
            <p key={i} className="text-sm text-zinc-600 leading-relaxed">{p}</p>
          ))}
        </section>
      ))}

    </div>
  )
}
