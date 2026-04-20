import { getAllProducts, getProductBySlug } from './products'
import type { Product } from '@/types/product'

// ── Helpers ───────────────────────────────────────────────────────────────────

export function effectiveMemory(p: Product): number {
  return p.specs.vram_gb ?? p.specs.unified_memory_gb ?? 0
}

export function memLabel(p: Product): string {
  if (p.specs.vram_gb) return `${p.specs.vram_gb} GB VRAM`
  if (p.specs.unified_memory_gb) return `${p.specs.unified_memory_gb} GB Unified`
  return '—'
}

function bw(p: Product): number { return p.specs.memory_bandwidth_gbps ?? 0 }
function tdp(p: Product): number { return p.specs.tdp_watts ?? 999 }
export type Winner = 'a' | 'b' | 'tie'
function win(aVal: number, bVal: number, higherBetter = true): Winner {
  if (aVal === bVal) return 'tie'
  return higherBetter ? (aVal > bVal ? 'a' : 'b') : (aVal < bVal ? 'a' : 'b')
}
function pct(a: number, b: number): string {
  if (b === 0) return '—'
  const ratio = a / b
  if (ratio > 1) return `${Math.round((ratio - 1) * 100)}% more`
  return `${Math.round((1 - ratio) * 100)}% less`
}
function x(a: number, b: number): string {
  if (b === 0) return '—'
  return `${(a / b).toFixed(1)}×`
}

// ── Slug helpers ──────────────────────────────────────────────────────────────

export function buildComparisonSlug(sA: string, sB: string): string {
  const [a, b] = [sA, sB].sort()
  return `${a}-vs-${b}`
}

export function parseComparisonSlug(slug: string): [string, string] | null {
  const allSlugs = getAllProducts().map(p => p.slug)
  for (const sA of allSlugs) {
    const prefix = `${sA}-vs-`
    if (slug.startsWith(prefix)) {
      const sB = slug.slice(prefix.length)
      if (allSlugs.includes(sB)) return [sA, sB]
    }
  }
  return null
}

export function getAllComparisonSlugs(): string[] {
  const slugs = getAllProducts().map(p => p.slug).sort()
  const pairs: string[] = []
  for (let i = 0; i < slugs.length; i++)
    for (let j = i + 1; j < slugs.length; j++)
      pairs.push(`${slugs[i]}-vs-${slugs[j]}`)
  return pairs
}

export function getProductComparisonSlugs(productSlug: string): string[] {
  return getAllComparisonSlugs().filter(s => {
    const parsed = parseComparisonSlug(s)
    return parsed && (parsed[0] === productSlug || parsed[1] === productSlug)
  })
}

// ── Text generators ───────────────────────────────────────────────────────────

function bluf(a: Product, b: Product): string {
  const aMem = effectiveMemory(a); const bMem = effectiveMemory(b)
  const aBw = bw(a); const bBw = bw(b)

  const gpuA = a.category === 'gpu', gpuB = b.category === 'gpu'

  if (gpuA && gpuB) {
    const memW = aMem >= bMem ? a : b; const memL = memW === a ? b : a
    const bwW = aBw >= bBw ? a : b
    if (memW.slug === bwW.slug) {
      return `${memW.name} wins on both VRAM (${effectiveMemory(memW)} GB vs ${effectiveMemory(memL)} GB) and memory bandwidth (${bw(memW).toLocaleString()} GB/s vs ${bw(memL).toLocaleString()} GB/s). The ${memL.name} is worth considering only if budget is the deciding factor.`
    }
    return `Split decision: ${memW.name} has more VRAM (${effectiveMemory(memW)} GB vs ${effectiveMemory(memL)} GB) while ${bwW.name} has higher bandwidth (${bw(bwW).toLocaleString()} GB/s vs ${bw(memW === bwW ? memL : memW).toLocaleString()} GB/s). Your workload determines the winner.`
  }

  if (!gpuA && !gpuB) {
    const memW = aMem >= bMem ? a : b; const memL = memW === a ? b : a
    const bwW = aBw >= bBw ? a : b
    return `${bwW.name} leads in memory bandwidth (${bw(bwW).toLocaleString()} GB/s vs ${bw(bwW === a ? b : a).toLocaleString()} GB/s), making it faster for LLM token generation. ${memW.name} has ${pct(effectiveMemory(memW), effectiveMemory(memL))} memory (${effectiveMemory(memW)} GB vs ${effectiveMemory(memL)} GB).`
  }

  // GPU vs Mini PC
  const gpu = gpuA ? a : b; const mini = gpuA ? b : a
  return `${gpu.name} delivers ${x(bw(gpu), bw(mini))} the memory bandwidth (${bw(gpu).toLocaleString()} GB/s vs ${bw(mini).toLocaleString()} GB/s) but requires a full desktop PC and draws ${tdp(gpu)}W. The ${mini.name} is a complete workstation at ${tdp(mini)}W — plug-in-and-go with no additional hardware needed.`
}

function llmVerdict(a: Product, b: Product): { winner: Winner; explanation: string } {
  const aMem = effectiveMemory(a); const bMem = effectiveMemory(b)
  const aBw = bw(a); const bBw = bw(b)
  const w = win(aMem, bMem) !== 'tie' ? win(aMem, bMem) : win(aBw, bBw)
  const winner = w === 'a' ? a : b; const loser = w === 'a' ? b : a
  const memDelta = effectiveMemory(winner) - effectiveMemory(loser)

  if (memDelta > 16) {
    return {
      winner: w,
      explanation: `${winner.name} wins clearly — ${effectiveMemory(winner)} GB vs ${effectiveMemory(loser)} GB means it can fit larger models entirely in memory. ${loser.name} requires CPU offloading for models above ${effectiveMemory(loser)} GB, which drops throughput significantly.`,
    }
  }
  if (memDelta > 0) {
    return {
      winner: w,
      explanation: `${winner.name} edges ahead with ${effectiveMemory(winner)} GB vs ${effectiveMemory(loser)} GB — enough headroom to run larger quantized models without offloading. ${winner.name}'s ${bw(winner).toLocaleString()} GB/s bandwidth also generates tokens faster.`,
    }
  }
  // Equal memory — bandwidth decides
  const bwW = win(aBw, bBw)
  const bwWinner = bwW === 'a' ? a : b
  return {
    winner: bwW,
    explanation: `Both have ${aMem} GB memory, so bandwidth decides. ${bwWinner.name}'s ${bw(bwWinner).toLocaleString()} GB/s vs ${bw(bwW === 'a' ? b : a).toLocaleString()} GB/s translates directly to more tokens per second at equivalent model sizes.`,
  }
}

function imageGenVerdict(a: Product, b: Product): { winner: Winner; explanation: string } {
  const gpuA = a.category === 'gpu'; const gpuB = b.category === 'gpu'
  const aBw = bw(a); const bBw = bw(b)

  if (gpuA && !gpuB) {
    return {
      winner: 'a',
      explanation: `${a.name} wins for image generation. Discrete CUDA GPUs have mature support across ComfyUI, A1111, and InvokeAI. ${a.specs.vram_gb} GB VRAM handles SDXL, Flux.1-dev, and ControlNet stacks natively. ${b.name} can run Stable Diffusion via MPS/ROCm but at slower speeds.`,
    }
  }
  if (!gpuA && gpuB) {
    return {
      winner: 'b',
      explanation: `${b.name} wins for image generation. Discrete CUDA GPUs have mature support across ComfyUI, A1111, and InvokeAI. ${b.specs.vram_gb} GB VRAM handles SDXL, Flux.1-dev, and ControlNet stacks natively. ${a.name} can run Stable Diffusion via MPS/ROCm but at slower speeds.`,
    }
  }
  if (!gpuA && !gpuB) {
    const bwW = win(aBw, bBw)
    const winner = bwW === 'a' ? a : b
    return {
      winner: bwW,
      explanation: `Neither is optimised for image generation, but ${winner.name}'s ${bw(winner).toLocaleString()} GB/s bandwidth makes generation faster. Both run SDXL via Metal (macOS) or ROCm (Linux). Expect slower generation times than a discrete GPU.`,
    }
  }
  // GPU vs GPU
  const bwW = win(aBw, bBw)
  const winner = bwW === 'a' ? a : b; const loser = bwW === 'a' ? b : a
  return {
    winner: bwW,
    explanation: `${winner.name} is faster for image generation — ${bw(winner).toLocaleString()} GB/s vs ${bw(loser).toLocaleString()} GB/s means SDXL steps complete ${x(bw(winner), bw(loser))} faster. Both handle SDXL, Flux, and ControlNet; ${winner.name} generates Flux.1-dev images in less time.`,
  }
}

function powerVerdict(a: Product, b: Product): { winner: Winner; explanation: string } {
  const aTdp = tdp(a); const bTdp = tdp(b)
  if (aTdp === bTdp) return { winner: 'tie', explanation: `Both draw around ${aTdp}W at peak load.` }
  const w = win(aTdp, bTdp, false)
  const winner = w === 'a' ? a : b; const loser = w === 'a' ? b : a
  const annualKwh = Math.round(((tdp(loser) - tdp(winner)) / 1000) * 8760 * 0.5)
  return {
    winner: w,
    explanation: `${winner.name} draws ${tdp(winner)}W at peak vs ${tdp(loser)}W — a ${tdp(loser) - tdp(winner)}W difference. Running AI workloads 12 hours/day, that's roughly ${annualKwh} kWh saved per year. For always-on inference, ${winner.name} has meaningfully lower operating costs.`,
  }
}

function overallVerdict(a: Product, b: Product): { winner: Winner; explanation: string } {
  const aMem = effectiveMemory(a); const bMem = effectiveMemory(b)
  const aBw = bw(a); const bBw = bw(b)
  const gpuA = a.category === 'gpu'; const gpuB = b.category === 'gpu'

  if (gpuA && !gpuB) {
    const memW = win(aMem, bMem); const bwW = win(aBw, bBw)
    if (memW === 'a' && bwW === 'a') {
      return { winner: 'a', explanation: `${a.name} is the better AI accelerator — more VRAM and ${x(aBw, bBw)} the bandwidth. But it requires a desktop system and draws ${tdp(a)}W. Choose ${b.name} for a complete, low-power workstation; ${a.name} for maximum AI throughput.` }
    }
    return { winner: 'b', explanation: `${b.name} is a better overall choice for most users — it's a complete system, draws only ${tdp(b)}W, and its ${bBw.toLocaleString()} GB/s unified memory bandwidth handles LLMs efficiently. ${a.name} needs a desktop system but adds CUDA ecosystem advantages.` }
  }
  if (!gpuA && gpuB) {
    const memW = win(aMem, bMem); const bwW = win(aBw, bBw)
    if (memW === 'b' && bwW === 'b') {
      return { winner: 'b', explanation: `${b.name} is the better AI accelerator — more VRAM and ${x(bBw, aBw)} the bandwidth. But it requires a desktop system and draws ${tdp(b)}W. Choose ${a.name} for a complete, low-power workstation; ${b.name} for maximum AI throughput.` }
    }
    return { winner: 'a', explanation: `${a.name} is a better overall choice for most users — it's a complete system, draws only ${tdp(a)}W, and its ${aBw.toLocaleString()} GB/s unified memory bandwidth handles LLMs efficiently. ${b.name} needs a desktop system but adds CUDA ecosystem advantages.` }
  }

  // Same category
  const points = { a: 0, b: 0 }
  if (win(aMem, bMem) === 'a') points.a++ ; else if (win(aMem, bMem) === 'b') points.b++
  if (win(aBw, bBw) === 'a') points.a++ ; else if (win(aBw, bBw) === 'b') points.b++
  if (a.rating > b.rating) points.a++ ; else if (b.rating > a.rating) points.b++
  const w: Winner = points.a > points.b ? 'a' : points.b > points.a ? 'b' : 'tie'
  const winner = w === 'a' ? a : w === 'b' ? b : null
  return {
    winner: w,
    explanation: winner
      ? `${winner.name} edges ahead overall — better memory, bandwidth, and user ratings for local AI workloads. The gap is real but not always worth the price difference; assess based on your primary use case.`
      : `Both products are closely matched. Your choice should come down to price, ecosystem preference, and the specific models you plan to run.`,
  }
}

function buyRecommendations(a: Product, b: Product): { buyA: string; buyB: string } {
  const aMem = effectiveMemory(a); const bMem = effectiveMemory(b)
  const gpuA = a.category === 'gpu'; const gpuB = b.category === 'gpu'

  if (gpuA && !gpuB) {
    return {
      buyA: `Buy the ${a.name} if you already have a compatible desktop PC, need maximum inference speed, work with Stable Diffusion or CUDA-only tools, or run batch AI workloads where tokens/second matters more than power draw.`,
      buyB: `Buy the ${b.name} if you want a complete plug-and-play AI workstation, prefer low power consumption (${tdp(b)}W), are on macOS with Ollama, or need a quiet always-on inference machine.`,
    }
  }
  if (!gpuA && gpuB) {
    return {
      buyA: `Buy the ${a.name} if you want a complete plug-and-play AI workstation, prefer low power consumption (${tdp(a)}W), are on macOS with Ollama, or need a quiet always-on inference machine.`,
      buyB: `Buy the ${b.name} if you already have a compatible desktop PC, need maximum inference speed, work with Stable Diffusion or CUDA-only tools, or run batch AI workloads where tokens/second matters.`,
    }
  }
  if (!gpuA && !gpuB) {
    const bwW = bw(a) >= bw(b) ? a : b
    return {
      buyA: bwW === a
        ? `Buy the ${a.name} if LLM inference speed is your priority — its ${bw(a).toLocaleString()} GB/s bandwidth delivers faster token generation. Also choose it for ${a.brand} ecosystem or macOS advantages.`
        : `Buy the ${a.name} if budget is your primary constraint or if you need ${aMem} GB of memory at a lower price point. Good for 7B–13B model inference.`,
      buyB: bwW === b
        ? `Buy the ${b.name} if LLM inference speed is your priority — its ${bw(b).toLocaleString()} GB/s bandwidth delivers faster token generation. Also choose it for ${b.brand} ecosystem advantages.`
        : `Buy the ${b.name} if budget is your primary constraint or if you need ${bMem} GB of memory at a lower price point. Good for 7B–13B model inference.`,
    }
  }
  // GPU vs GPU
  const memW = aMem >= bMem ? a : b
  return {
    buyA: aMem >= bMem
      ? `Buy the ${a.name} if you need ${aMem} GB VRAM to run larger models (34B–70B), work with Flux.1-dev at full precision, or want the widest headroom for future models.`
      : `Buy the ${a.name} if you primarily run 7B–13B models and want the best performance-per-dollar. The ${aMem} GB VRAM handles most popular checkpoints without compromise.`,
    buyB: memW === b
      ? `Buy the ${b.name} if you need ${bMem} GB VRAM to run larger models (34B–70B), work with Flux.1-dev at full precision, or want the widest headroom for future models.`
      : `Buy the ${b.name} if you primarily run 7B–13B models and want the best performance-per-dollar. The ${bMem} GB VRAM handles most popular checkpoints without compromise.`,
  }
}

function buildFAQ(a: Product, b: Product): { question: string; answer: string }[] {
  const gpuA = a.category === 'gpu'; const gpuB = b.category === 'gpu'
  const aMem = effectiveMemory(a); const bMem = effectiveMemory(b)
  const aBw = bw(a); const bBw = bw(b)

  if (gpuA && gpuB) {
    const faster = aBw >= bBw ? a : b
    const slower = faster === a ? b : a
    const bigger = aMem >= bMem ? a : b
    const smaller = bigger === a ? b : a
    return [
      {
        question: `Which is faster for LLM inference — ${a.name} or ${b.name}?`,
        answer: `${faster.name} is faster for LLM inference due to its higher memory bandwidth (${bw(faster).toLocaleString()} GB/s vs ${bw(slower).toLocaleString()} GB/s). Tokens per second scales almost linearly with bandwidth at equivalent model sizes. On Llama 3.1 8B, expect roughly ${x(bw(faster), bw(slower))} more tokens/second on ${faster.name}.`,
      },
      {
        question: `Can the ${smaller.name} run models that need more than ${aMem < bMem ? aMem : bMem} GB?`,
        answer: `Not fully in VRAM. Models exceeding ${effectiveMemory(smaller)} GB at the target quantization level will need CPU offloading via llama.cpp, which drops performance significantly — typically 5–20× slower depending on how many layers overflow to system RAM. The ${bigger.name}'s ${effectiveMemory(bigger)} GB handles these models natively.`,
      },
      {
        question: `Is the ${bigger.name} worth the premium over the ${smaller.name}?`,
        answer: `It depends on your use case. If you primarily run 7B–13B models: the ${smaller.name}'s ${effectiveMemory(smaller)} GB is sufficient and you save money. If you run 34B+ models, do batch image generation with Flux.1-dev, or train LoRAs: the ${bigger.name}'s extra VRAM pays off. The performance gap is roughly ${x(bw(faster), bw(slower))} on equivalent tasks.`,
      },
      {
        question: `Which has better software compatibility?`,
        answer: `${a.brand === 'NVIDIA' ? a.name : b.brand === 'NVIDIA' ? b.name : faster.name} has the broadest compatibility — CUDA is the standard for PyTorch, Transformers, ComfyUI, A1111, bitsandbytes, and flash-attention. ${a.brand === 'AMD' || b.brand === 'AMD' ? `${a.brand === 'AMD' ? a.name : b.name} works well via ROCm on Linux but some libraries lack ROCm support.` : 'Both have strong ecosystem support.'}`,
      },
    ]
  }

  if (!gpuA && !gpuB) {
    const faster = aBw >= bBw ? a : b
    const slower = faster === a ? b : a
    const bigger = aMem >= bMem ? a : b
    return [
      {
        question: `Which runs Ollama faster — ${a.name} or ${b.name}?`,
        answer: `${faster.name} runs Ollama faster. Its ${bw(faster).toLocaleString()} GB/s memory bandwidth vs ${bw(slower).toLocaleString()} GB/s means faster token generation — roughly ${x(bw(faster), bw(slower))} more tokens/second on the same model. On Llama 3.1 8B, expect around ${Math.round(bw(faster) / 30)} tok/s vs ${Math.round(bw(slower) / 30)} tok/s.`,
      },
      {
        question: `Can either mini PC run Llama 3 70B?`,
        answer: `${aMem >= 40 || bMem >= 40 ? `${bigger.name} with ${effectiveMemory(bigger)} GB can run Llama 3 70B at Q4_K_M quantization (~39 GB). ${effectiveMemory(a) < 40 && effectiveMemory(b) < 40 ? 'Neither has' : effectiveMemory(bigger) === aMem && bMem < 40 ? `${b.name} does not have` : `${a.name} does not have`} enough memory without heavy CPU offloading, which makes it impractical.` : 'Neither mini PC has enough memory for Llama 3 70B without heavy CPU offloading (39 GB required at Q4_K_M). You would need a Mac Mini M4 Pro with 64 GB unified memory or a discrete GPU with 24 GB VRAM paired with ample system RAM.'}`,
      },
      {
        question: `Which is better value for local AI in 2026?`,
        answer: `${faster.name} offers better performance-per-dollar for AI workloads due to its ${bw(faster).toLocaleString()} GB/s bandwidth advantage. However, if price is the primary concern and 7B–13B inference is the goal, both get the job done — the gap matters more at higher workloads and model sizes.`,
      },
      {
        question: `Which has better software support for local AI?`,
        answer: `${a.brand === 'Apple' || b.brand === 'Apple' ? `${a.brand === 'Apple' ? a.name : b.name} on macOS benefits from the best Ollama experience — zero configuration, Metal backend, and seamless model management. ${a.brand !== 'Apple' ? a.name : b.name} on Windows has broader x86 compatibility but less mature iGPU AI acceleration.` : 'Both run Ollama well. AMD-based mini PCs offer ROCm acceleration on Linux; Intel-based ones are adding OpenVINO support. macOS Apple Silicon has the most polished Ollama experience.'}`,
      },
    ]
  }

  // GPU vs Mini PC
  const gpu = gpuA ? a : b; const mini = gpuA ? b : a
  return [
    {
      question: `Do I need a full desktop PC to use the ${gpu.name}?`,
      answer: `Yes. The ${gpu.name} is a discrete GPU that requires a compatible desktop PC with a PCIe ${gpu.specs.interface?.replace('PCIe ', '') ?? '4.0'} slot, a ${gpu.specs.tdp_watts ? `${gpu.specs.tdp_watts + 100}W+` : '750W+'} power supply, and adequate case airflow. The ${mini.name} is a complete, self-contained workstation — no additional hardware required.`,
    },
    {
      question: `Which is better for running LLMs at home?`,
      answer: `It depends on your setup. The ${gpu.name} delivers ${x(bw(gpu), bw(mini))} the memory bandwidth (${bw(gpu).toLocaleString()} GB/s vs ${bw(mini).toLocaleString()} GB/s), meaning faster inference. But the ${mini.name} is a complete system with zero setup friction on macOS with Ollama. For pure LLM speed: ${gpu.name}. For ease of use: ${mini.name}.`,
    },
    {
      question: `How do operating costs compare?`,
      answer: `The ${mini.name} draws ${tdp(mini)}W at peak vs ${tdp(gpu)}W for the ${gpu.name} alone (plus desktop system overhead). Running 12 hours/day, the ${mini.name} uses roughly ${Math.round((tdp(mini) / 1000) * 12 * 365)} kWh/year vs ${Math.round((tdp(gpu) / 1000) * 12 * 365)} kWh/year for the GPU — a ${Math.round(((tdp(gpu) - tdp(mini)) / 1000) * 12 * 365 * 0.15)} USD/year difference at $0.15/kWh.`,
    },
    {
      question: `Which is easier to set up for local AI?`,
      answer: `The ${mini.name} is dramatically easier. On macOS, install Ollama, run \`ollama pull llama3\`, done. The ${gpu.name} requires a full desktop build, driver installation, and CUDA/ROCm setup — rewarding but not beginner-friendly. For non-technical users: ${mini.name} wins without question.`,
    },
  ]
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface ComparisonData {
  slug: string
  slugA: string
  slugB: string
  productA: Product
  productB: Product
  title: string
  metaDescription: string
  h1: string
  blufText: string
  specs: { label: string; aVal: string; bVal: string; winner: Winner }[]
  verdicts: {
    llm: { winner: Winner; explanation: string }
    imageGen: { winner: Winner; explanation: string }
    power: { winner: Winner; explanation: string }
    overall: { winner: Winner; explanation: string }
  }
  buyA: string
  buyB: string
  faq: { question: string; answer: string }[]
}

export function getComparisonData(slug: string): ComparisonData | null {
  const parsed = parseComparisonSlug(slug)
  if (!parsed) return null
  const [sA, sB] = parsed
  const a = getProductBySlug(sA)
  const b = getProductBySlug(sB)
  if (!a || !b) return null

  const title = `${a.name} vs ${b.name} — Best for Local AI in 2026?`
  const metaDescription = `${a.name} vs ${b.name}: spec-by-spec comparison for local LLM inference and Stable Diffusion. Memory, bandwidth, power, and verdict.`
  const h1 = `${a.name} vs ${b.name}`

  const specs: ComparisonData['specs'] = []
  if (a.specs.vram_gb || b.specs.vram_gb || a.specs.unified_memory_gb || b.specs.unified_memory_gb) {
    specs.push({ label: 'Memory', aVal: memLabel(a), bVal: memLabel(b), winner: win(effectiveMemory(a), effectiveMemory(b)) })
  }
  if (bw(a) || bw(b)) {
    specs.push({ label: 'Memory Bandwidth', aVal: bw(a) ? `${bw(a).toLocaleString()} GB/s` : '—', bVal: bw(b) ? `${bw(b).toLocaleString()} GB/s` : '—', winner: win(bw(a), bw(b)) })
  }
  if (tdp(a) < 999 || tdp(b) < 999) {
    specs.push({ label: 'TDP (Power Draw)', aVal: tdp(a) < 999 ? `${tdp(a)}W` : '—', bVal: tdp(b) < 999 ? `${tdp(b)}W` : '—', winner: win(tdp(a), tdp(b), false) })
  }
  specs.push({ label: 'Editorial Rating', aVal: `${a.rating}/5`, bVal: `${b.rating}/5`, winner: win(a.rating, b.rating) })
  if (a.specs.max_llm_size || b.specs.max_llm_size) {
    specs.push({ label: 'Max LLM Size', aVal: a.specs.max_llm_size ?? '—', bVal: b.specs.max_llm_size ?? '—', winner: 'tie' })
  }
  if (a.specs.form_factor || b.specs.form_factor) {
    specs.push({ label: 'Form Factor', aVal: a.specs.form_factor ?? '—', bVal: b.specs.form_factor ?? '—', winner: 'tie' })
  }

  return {
    slug, slugA: sA, slugB: sB,
    productA: a, productB: b,
    title, metaDescription, h1,
    blufText: bluf(a, b),
    specs,
    verdicts: {
      llm: llmVerdict(a, b),
      imageGen: imageGenVerdict(a, b),
      power: powerVerdict(a, b),
      overall: overallVerdict(a, b),
    },
    buyA: buyRecommendations(a, b).buyA,
    buyB: buyRecommendations(a, b).buyB,
    faq: buildFAQ(a, b),
  }
}
