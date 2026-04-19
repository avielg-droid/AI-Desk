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
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <caption className="sr-only">Product specifications</caption>
        <tbody className="divide-y divide-gray-100">
          {rows.map(([key, value]) => (
            <tr key={key} className="even:bg-gray-50">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-gray-700 w-48"
              >
                {SPEC_LABELS[key]}
              </th>
              <td className="px-4 py-3 text-gray-900">
                {formatValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
