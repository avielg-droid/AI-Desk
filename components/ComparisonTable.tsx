import type { ProductSpec } from '@/types/product'

const SPEC_LABELS: Partial<Record<keyof ProductSpec, string>> = {
  chip: 'Chip / Processor',
  cpu_cores: 'CPU Cores',
  gpu_cores: 'GPU Cores',
  unified_memory_gb: 'Unified Memory',
  vram_gb: 'VRAM',
  memory_bandwidth_gbps: 'Memory Bandwidth',
  storage_gb: 'Storage',
  tdp_watts: 'TDP (Power Draw)',
  max_llm_size: 'Max LLM Size',
  interface: 'Interface',
  form_factor: 'Form Factor',
}

// Keys where the value is a key data point — rendered in data color
const DATA_KEYS = new Set(['vram_gb', 'unified_memory_gb', 'memory_bandwidth_gbps', 'max_llm_size'])

function formatValue(key: string, value: unknown): string {
  if (typeof value !== 'number') return String(value)
  if (key.includes('_gb') && !key.includes('gbps')) return `${value} GB`
  if (key.includes('gbps')) return `${value} GB/s`
  if (key.includes('watts')) return `${value}W`
  return String(value)
}

export default function ComparisonTable({ specs }: { specs: ProductSpec }) {
  const rows = (Object.entries(specs) as [keyof ProductSpec, unknown][]).filter(
    ([key]) => key in SPEC_LABELS
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-edge bg-ink-1">
      <table className="w-full text-sm">
        <caption className="sr-only">Product specifications</caption>
        <tbody className="divide-y divide-edge/60">
          {rows.map(([key, value]) => (
            <tr key={key} className="group hover:bg-ink-2/50 transition-colors">
              <th
                scope="row"
                className="px-5 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-slate-500 w-52 whitespace-nowrap"
              >
                {SPEC_LABELS[key]}
              </th>
              <td className={`px-5 py-3.5 font-mono text-sm font-medium ${
                DATA_KEYS.has(key) ? 'text-data' : 'text-foreground'
              }`}>
                {formatValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
