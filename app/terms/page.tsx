import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for The AI Desk — the rules governing your use of theaidesk.com.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  const updated = 'April 19, 2026'

  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Legal</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-slate-500">Last updated: {updated}</p>
      </div>

      <div className="rounded-xl border border-ore/20 bg-ore/5 p-5">
        <p className="text-sm text-zinc-700 leading-relaxed">
          By accessing <strong className="text-foreground">theaidesk.com</strong>, you agree to these terms.
          If you do not agree, please do not use the site.
        </p>
      </div>

      {[
        {
          heading: '1. About This Site',
          body: [
            'The AI Desk is an independent hardware review and comparison site. We participate in the Amazon Associates Program and earn commissions on qualifying purchases made through affiliate links. See our affiliate disclosure for details.',
            'We are not a retailer. We do not sell products, process payments, or fulfill orders. All purchases are made directly on Amazon or other third-party retailers.',
          ],
        },
        {
          heading: '2. Accuracy of Information',
          body: [
            'We make reasonable efforts to keep product specifications, prices, and availability accurate. However, specifications can change, products can be discontinued, and Amazon prices fluctuate in real time.',
            'All pricing information on this site is labeled "Check Price on Amazon" — we do not display static prices. Always verify current price and availability on Amazon before making a purchase decision.',
            'Benchmark figures and performance estimates are based on our research and analysis. Real-world performance varies based on your specific system, software version, model weights, quantization settings, and operating system.',
          ],
        },
        {
          heading: '3. Affiliate Disclosure',
          body: [
            'This site participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com.',
            'All affiliate links are clearly marked with "(paid link)" adjacent to the link. Clicking these links and making a purchase may result in us earning a commission at no additional cost to you.',
            'Our editorial recommendations are independent of affiliate relationships. We do not accept payment from manufacturers for positive reviews.',
          ],
        },
        {
          heading: '4. Intellectual Property',
          body: [
            'All written content, editorial analysis, and design on The AI Desk is our original work and protected by copyright. You may quote brief excerpts (under 100 words) with attribution and a link back to the source page.',
            'Product names, brand names, and logos belong to their respective owners. Their use on this site is for identification and review purposes only and does not imply endorsement.',
          ],
        },
        {
          heading: '5. Disclaimer of Warranties',
          body: [
            'This site and its content are provided "as is" without warranties of any kind, express or implied. We do not warrant that the site will be error-free, uninterrupted, or free of viruses.',
            'Hardware purchase decisions involve significant financial commitment. We strongly recommend verifying all specifications, reading multiple sources, and confirming compatibility with your specific use case before purchasing.',
          ],
        },
        {
          heading: '6. Limitation of Liability',
          body: [
            'To the fullest extent permitted by law, The AI Desk and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of this site or any products purchased based on our recommendations.',
            'Our maximum liability for any claim arising from use of this site shall not exceed the amount you paid to access it (which is zero, as this site is free).',
          ],
        },
        {
          heading: '7. Third-Party Links',
          body: [
            'This site links to Amazon and other third-party sites. We have no control over the content, policies, or practices of third-party sites. These links are provided for convenience only.',
            'Your interactions with Amazon are governed by Amazon\'s own Terms of Service and Privacy Policy.',
          ],
        },
        {
          heading: '8. Changes to These Terms',
          body: [
            'We may update these terms at any time. The "Last updated" date reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated terms.',
          ],
        },
        {
          heading: '9. Governing Law',
          body: [
            'These terms are governed by the laws of the jurisdiction in which the site operator resides, without regard to conflict of law provisions.',
          ],
        },
      ].map(section => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground border-b border-edge pb-2">
            {section.heading}
          </h2>
          {section.body.map((p, i) => (
            <p key={i} className="text-sm text-zinc-600 leading-relaxed">{p}</p>
          ))}
        </section>
      ))}

    </div>
  )
}
