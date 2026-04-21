import type { ProductSpec } from '@/types/product'
import Tooltip from '@/components/Tooltip'
import { getGlossaryEntry } from '@/lib/glossary'

const SPEC_LABELS: Partial<Record<keyof ProductSpec, string>> = {
  chip:                      'Chip / Processor',
  cpu_cores:                 'CPU Cores',
  gpu_cores:                 'GPU Cores',
  unified_memory_gb:         'Unified Memory',
  vram_gb:                   'VRAM',
  memory_bandwidth_gbps:     'Memory Bandwidth',
  storage_gb:                'Storage',
  tdp_watts:                 'TDP (Power Draw)',
  max_llm_size:              'Max LLM Size',
  interface:                 'Interface',
  form_factor:               'Form Factor',
  tokens_per_second_7b:      'Tokens Per Second (7B)',
  tokens_per_second_13b:     'Tokens Per Second (13B)',
  image_gen_sdxl_seconds:    'SDXL Generation Time',
}

const DATA_KEYS = new Set([
  'vram_gb', 'unified_memory_gb', 'memory_bandwidth_gbps', 'max_llm_size',
  'tokens_per_second_7b', 'tokens_per_second_13b', 'image_gen_sdxl_seconds',
])

const BENCHMARK_KEYS = new Set([
  'tokens_per_second_7b', 'tokens_per_second_13b', 'image_gen_sdxl_seconds',
])

function formatValue(key: string, value: unknown): string {
  if (typeof value !== 'number') return String(value)
  if (key === 'tokens_per_second_7b' || key === 'tokens_per_second_13b') return `${value} t/s`
  if (key === 'image_gen_sdxl_seconds') return `${value}s`
  if (key.includes('_gb') && !key.includes('gbps')) return `${value} GB`
  if (key.includes('gbps')) return `${value} GB/s`
  if (key.includes('watts')) return `${value}W`
  return String(value)
}

export default function ComparisonTable({ specs }: { specs: ProductSpec }) {
  const rows = (Object.entries(specs) as [keyof ProductSpec, unknown][]).filter(
    ([key]) => key in SPEC_LABELS
  )

  // Separate hardware specs from benchmark rows
  const specRows = rows.filter(([key]) => !BENCHMARK_KEYS.has(key))
  const benchmarkRows = rows.filter(([key]) => BENCHMARK_KEYS.has(key))

  const allRows = [...specRows, ...benchmarkRows]
  const benchmarkStart = specRows.length

  return (
    <div className="overflow-x-auto border border-edge">
      <table className="w-full text-sm">
        <caption className="sr-only">Product specifications</caption>
        <tbody>
          {/* Benchmark section header */}
          {benchmarkRows.length > 0 && (
            <>
              {allRows.slice(0, benchmarkStart).map(([key, value], i) => (
                <SpecRow key={key} specKey={key} value={value} i={i} />
              ))}
              <tr className="border-b border-edge bg-ore/5">
                <th
                  colSpan={2}
                  className="px-5 py-2 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-ore"
                >
                  AI Performance Benchmarks
                </th>
              </tr>
              {benchmarkRows.map(([key, value], i) => (
                <SpecRow key={key} specKey={key} value={value} i={benchmarkStart + i} />
              ))}
            </>
          )}
          {/* No benchmarks — render all rows normally */}
          {benchmarkRows.length === 0 && allRows.map(([key, value], i) => (
            <SpecRow key={key} specKey={key} value={value} i={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SpecRow({ specKey, value, i }: { specKey: keyof ProductSpec; value: unknown; i: number }) {
  const label = SPEC_LABELS[specKey]!
  const tip = getGlossaryEntry(label)
  const isBenchmark = BENCHMARK_KEYS.has(specKey)

  return (
    <tr
      className={`spec-row border-b border-edge/60 last:border-b-0 ${
        i % 2 === 0 ? 'bg-ink-1' : 'bg-ink-0'
      }`}
    >
      <th
        scope="row"
        className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500 w-52 whitespace-nowrap border-r border-edge/50"
      >
        {tip ? <Tooltip label={label} tip={tip} /> : label}
      </th>
      <td className={`px-5 py-3.5 font-mono text-sm font-500 ${
        isBenchmark ? 'text-win' : DATA_KEYS.has(specKey) ? 'text-ore' : 'text-foreground'
      }`}>
        {formatValue(specKey, value)}
      </td>
    </tr>
  )
}
