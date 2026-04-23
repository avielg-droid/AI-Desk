import type { ContentBlock } from '@/types/blog'

const CALLOUT_STYLES = {
  info:    'border-ore/30 bg-ore/5 text-zinc-600',
  tip:     'border-win/30 bg-win/5 text-zinc-600',
  warning: 'border-loss/30 bg-loss/5 text-zinc-600',
  verdict: 'border-ore/40 bg-ore/8 text-foreground',
}

const CALLOUT_ICON = {
  info:    '◈',
  tip:     '▲',
  warning: '⚠',
  verdict: '◆',
}

export default function BlogContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="font-display font-800 text-2xl uppercase tracking-tight text-foreground mt-10 mb-4 pt-6 border-t border-edge first:border-t-0 first:pt-0 first:mt-0">
                {block.text}
              </h2>
            )

          case 'h3':
            return (
              <h3 key={i} className="font-display font-700 text-lg uppercase tracking-tight text-foreground mt-6 mb-3">
                {block.text}
              </h3>
            )

          case 'p':
            return (
              <p key={i} className="text-zinc-600 leading-relaxed text-[15px]"
                dangerouslySetInnerHTML={{ __html: block.html }} />
            )

          case 'ul':
            return (
              <ul key={i} className="space-y-2 pl-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[15px] text-zinc-600 leading-relaxed">
                    <span className="text-ore mt-1 shrink-0 text-[10px]">▸</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            )

          case 'ol':
            return (
              <ol key={i} className="space-y-2 pl-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[15px] text-zinc-600 leading-relaxed">
                    <span className="font-mono text-ore shrink-0 text-[10px] mt-1 min-w-[1.2rem]">{j + 1}.</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ol>
            )

          case 'callout': {
            const variant = block.variant ?? 'info'
            return (
              <div key={i} className={`border px-5 py-4 flex gap-3 ${CALLOUT_STYLES[variant]}`}>
                <span className="font-mono text-[11px] shrink-0 mt-0.5">
                  {CALLOUT_ICON[variant]}
                </span>
                <div className="text-[14px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.html }} />
              </div>
            )
          }

          case 'table':
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full border border-edge text-sm">
                  <thead>
                    <tr className="bg-ink-2 border-b border-edge">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-600 border-r border-edge last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={`border-b border-edge/50 spec-row ${j % 2 === 0 ? 'bg-ink-1' : 'bg-ink-0'}`}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2.5 font-mono text-[12px] text-zinc-600 border-r border-edge/40 last:border-r-0"
                            dangerouslySetInnerHTML={{ __html: cell }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'code':
            return (
              <div key={i} className="border border-edge overflow-hidden">
                <div className="bg-ink-2 px-4 py-1.5 border-b border-edge flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ore">{block.lang}</span>
                </div>
                <pre className="bg-ink-1 px-4 py-4 overflow-x-auto text-[12px] font-mono text-zinc-600 leading-relaxed">
                  <code>{block.text}</code>
                </pre>
              </div>
            )

          case 'divider':
            return <hr key={i} className="rule-ember border-0 my-8" />

          default:
            return null
        }
      })}
    </div>
  )
}
