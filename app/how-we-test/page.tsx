import type { Metadata } from 'next'
import { buildBreadcrumbSchema, buildHowToSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'How We Test AI Hardware — Review Methodology | The AI Desk',
  description: 'Our benchmark methodology for testing GPUs, Mini PCs, and AI accessories. Real tokens-per-second measurements on Llama 3.1 8B, SDXL, and FLUX using Ollama, llama.cpp, and ComfyUI.',
  alternates: { canonical: 'https://ai-desk.tech/how-we-test' },
}

const BENCHMARKS = [
  {
    model: 'Llama 3.1 8B (Q4_K_M)',
    tool: 'Ollama 0.3+',
    metric: 'tokens/second (t/s)',
    method: 'Run `ollama run llama3.1:8b` with a 500-token prompt, measure generation speed via `ollama ps` throughput. 3 runs, median reported.',
  },
  {
    model: 'Llama 3.1 13B (Q4_K_M)',
    tool: 'Ollama 0.3+',
    metric: 'tokens/second (t/s)',
    method: 'Same method as 8B. Only reported for hardware with sufficient VRAM/RAM to load the model fully without CPU offload.',
  },
  {
    model: 'Stable Diffusion XL (SDXL)',
    tool: 'ComfyUI',
    metric: 'seconds per image (1024×1024)',
    method: '20-step DPM++ 2M Karras, 1024×1024, no ControlNet. 3 runs, median reported. GPU-accelerated path only.',
  },
  {
    model: 'FLUX.1-dev',
    tool: 'ComfyUI',
    metric: 'seconds per image (1024×1024)',
    method: '20 steps, 1024×1024, fp8 checkpoint. Reported only where VRAM ≥ 12GB. 3 runs, median.',
  },
]

export default function HowWeTestPage() {
  const BASE = 'https://ai-desk.tech'

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'How We Test', url: `${BASE}/how-we-test` },
    ]),
    buildHowToSchema({
      name: 'How We Benchmark AI Hardware',
      description: 'Our process for measuring tokens-per-second, image generation speed, and memory capacity on GPUs and Mini PCs.',
      slug: 'how-we-test',
      steps: [
        { name: 'Configure hardware', text: 'Install OS, update drivers (CUDA, ROCm, or Metal). No BIOS overclocking. Stock thermal paste and cooler. System idle for 10 minutes before testing.' },
        { name: 'Install inference software', text: 'Ollama latest stable release. llama.cpp compiled from source for CPU tests. ComfyUI latest for image generation. No custom forks.' },
        { name: 'Run benchmark protocol', text: 'Pull standardized model (Llama 3.1 8B Q4_K_M). Run 3 identical inference passes with a 500-token seed prompt. Record median tokens/second.' },
        { name: 'Record and verify results', text: 'Cross-reference against community benchmarks from r/LocalLLaMA and official llama.cpp benchmark threads. Outliers investigated before publishing.' },
        { name: 'Publish with version tags', text: 'All results tagged with model name, quantization, tool version, and test date. Updated when new driver or tool versions significantly change results.' },
      ],
    }),
  ]

  return (
    <>
      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      <div className="max-w-2xl mx-auto space-y-10">

        <div>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              <li><a href="/" className="hover:text-ore transition-colors">Home</a></li>
              <li className="text-edge">/</li>
              <li className="text-zinc-600">How We Test</li>
            </ol>
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ore mb-2">Methodology</p>
          <h1 className="font-display font-800 text-4xl uppercase tracking-tight text-foreground mb-4">
            How We Test AI Hardware
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Every benchmark on The AI Desk follows a fixed protocol. We test on real consumer hardware
            using the same software and settings as our readers — no special drivers, no manufacturer
            samples, no cherry-picked runs.
          </p>
        </div>

        {/* Core principles */}
        <section className="space-y-3">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Testing Principles
          </h2>
          <ul className="space-y-3">
            {[
              ['Stock configuration', 'No overclocking, no custom BIOS settings, no power limit unlocks. We test what you get out of the box.'],
              ['Real workloads', 'We use the same tools our readers use: Ollama, llama.cpp, ComfyUI. Not synthetic GPU benchmarks.'],
              ['Consistent environment', 'Tests run with background apps closed. System idle for 10 minutes before benchmarking. 3 runs, median reported.'],
              ['Cross-referenced results', 'Our numbers are validated against community benchmarks from r/LocalLLaMA and llama.cpp issue threads. Outliers are investigated, not published.'],
              ['Version transparency', 'Every result is tagged with the model, quantization format, tool version, and test date.'],
            ].map(([title, desc]) => (
              <li key={title as string} className="flex gap-4 border border-edge bg-ink-1 px-5 py-4">
                <span className="text-win font-mono mt-0.5 shrink-0">✓</span>
                <div>
                  <p className="font-sans font-600 text-sm text-foreground">{title as string}</p>
                  <p className="text-sm text-zinc-600 mt-0.5">{desc as string}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Benchmark specs */}
        <section className="space-y-4">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Benchmark Definitions
          </h2>
          <div className="space-y-3">
            {BENCHMARKS.map(b => (
              <div key={b.model} className="border border-edge bg-ink-1 p-5">
                <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                  <p className="font-sans font-600 text-sm text-foreground">{b.model}</p>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ore shrink-0">{b.metric}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tool: {b.tool}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{b.method}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we don't test */}
        <section className="space-y-3">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            What We Don&apos;t Test
          </h2>
          <ul className="space-y-2.5">
            {[
              'Training performance — all results are inference only. Training requires different hardware priorities.',
              'Multi-GPU setups — all benchmarks are single-GPU or single-system. No NVLink, no tensor parallelism.',
              'CPU-only inference for GPU products — if a GPU is reviewed, we only report GPU-accelerated inference.',
              'API-based models — no cloud inference times. Local hardware only.',
            ].map(item => (
              <li key={item} className="flex gap-3 text-sm text-zinc-600">
                <span className="text-loss font-mono shrink-0 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Data sources */}
        <section className="space-y-3">
          <h2 className="font-display font-700 text-xl uppercase tracking-tight text-foreground border-b border-edge pb-2">
            Data Sources
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Some products are benchmarked by us directly. Others use verified community data from:
          </p>
          <ul className="space-y-2">
            {[
              ['r/LocalLLaMA', 'Community benchmark megathreads for new hardware launches'],
              ['llama.cpp GitHub Issues', 'Official performance tracking and regression tests'],
              ['Simon Willison\'s Weblog', 'Independent Apple Silicon AI benchmarks'],
              ['Manufacturer spec sheets', 'Memory bandwidth, TDP, and core count — taken as given, not independently verified'],
            ].map(([src, desc]) => (
              <li key={src as string} className="flex gap-3 text-sm">
                <span className="font-mono text-[10px] text-ore shrink-0 mt-0.5 uppercase tracking-widest">→</span>
                <span className="text-zinc-600"><strong className="text-foreground">{src as string}:</strong> {desc as string}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Update policy */}
        <section className="border border-ore/25 bg-ore/5 p-6">
          <h2 className="font-display font-700 text-lg uppercase tracking-tight text-foreground mb-2">Update Policy</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Benchmark results are updated when a new driver or software version causes a meaningful performance change
            (≥10%). Each product page shows a &quot;Last Updated&quot; date. If you notice a benchmark that no longer matches
            your real-world results, the most likely explanation is a driver update — check the date and compare
            to your software version.
          </p>
        </section>

      </div>
    </>
  )
}
