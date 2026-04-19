import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for The AI Desk — how we collect, use, and protect your information.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  const updated = 'April 19, 2026'

  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Legal</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-slate-500">Last updated: {updated}</p>
      </div>

      <div className="rounded-xl border border-ore/20 bg-ore/5 p-5">
        <p className="text-sm text-slate-300 leading-relaxed">
          The AI Desk (<strong className="text-foreground">theaidesk.com</strong>) is an affiliate review site.
          We do not sell products, process payments, or store accounts. This policy explains what limited data
          we collect and why.
        </p>
      </div>

      {[
        {
          heading: '1. Information We Collect',
          body: [
            'We do not collect personal information directly. We have no user accounts, no contact forms that store data, and no newsletter subscriptions.',
            'Third-party services embedded on this site may collect data as described below.',
          ],
        },
        {
          heading: '2. Third-Party Services',
          items: [
            {
              name: 'Vercel Analytics',
              detail: 'We use Vercel Analytics to measure page views and referral sources. Vercel Analytics is privacy-first — it does not use cookies and does not collect personally identifiable information. Data is aggregated.',
            },
            {
              name: 'Amazon Associates',
              detail: 'When you click an affiliate link to Amazon, you are subject to Amazon\'s Privacy Policy (amazon.com/privacy). Amazon may set cookies on your browser. We receive aggregate commission data but no personal information about you.',
            },
            {
              name: 'Google Fonts',
              detail: 'We load Inter and Fira Code from Google Fonts. Google may log font requests — see Google\'s Privacy Policy for details. Fonts are loaded over HTTPS.',
            },
          ],
        },
        {
          heading: '3. Cookies',
          body: [
            'The AI Desk itself sets no cookies. Third-party services (Amazon, Google Fonts) may set cookies according to their own policies. We have no control over those cookies.',
            'You can block third-party cookies in your browser settings without affecting your ability to read this site.',
          ],
        },
        {
          heading: '4. Analytics Data',
          body: [
            'Vercel Analytics collects: page URL, referrer URL, device type (desktop/mobile/tablet), and country-level location. No IP addresses are stored. No cross-site tracking occurs.',
            'We use this data solely to understand which content is useful and to improve the site.',
          ],
        },
        {
          heading: '5. Children\'s Privacy',
          body: [
            'This site is not directed at children under 13. We do not knowingly collect any information from children.',
          ],
        },
        {
          heading: '6. Links to External Sites',
          body: [
            'This site contains links to Amazon and other external sites. We are not responsible for the privacy practices of those sites. Review their privacy policies before providing personal information.',
          ],
        },
        {
          heading: '7. Changes to This Policy',
          body: [
            'We may update this policy as our practices change. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.',
          ],
        },
        {
          heading: '8. Contact',
          body: [
            'Questions about this policy can be directed to the site owner via the contact information on the About page.',
          ],
        },
      ].map(section => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
            {section.heading}
          </h2>
          {'body' in section && section.body?.map((p, i) => (
            <p key={i} className="text-sm text-slate-400 leading-relaxed">{p}</p>
          ))}
          {'items' in section && (
            <ul className="space-y-3">
              {section.items?.map(item => (
                <li key={item.name} className="rounded-lg border border-edge bg-ink-1 px-4 py-3">
                  <p className="font-mono text-xs text-ore mb-1">{item.name}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

    </div>
  )
}
