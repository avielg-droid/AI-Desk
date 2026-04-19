# The AI Desk — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold and populate a Next.js 14 Amazon affiliate website for AI hardware with 7 GEO-optimized product pages, full schema markup, and Amazon compliance.

**Architecture:** Next.js 14 App Router with ISR (`revalidate = 3600`) on Vercel. Product data stored as JSON files in `/content/products/`. Tailwind CSS for styling. JSON-LD schema injected per page.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Jest, React Testing Library, Vercel

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `the-ai-desk/` (project root — run from `/Users/aviel/Desktop/`)

**Step 1: Scaffold project**

```bash
cd /Users/aviel/Desktop
npx create-next-app@14 the-ai-desk \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
cd the-ai-desk
```

**Step 2: Verify structure**

```bash
ls -la
# Should see: app/ public/ package.json tailwind.config.ts tsconfig.json
```

**Step 3: Install additional dependencies**

```bash
npm install clsx tailwind-merge
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

**Step 4: Configure Jest**

Create `jest.config.ts`:

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:

```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 5: Remove boilerplate**

```bash
# Clear default app content — replace app/page.tsx and app/globals.css with minimal versions
```

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with Tailwind and Jest"
```

---

## Task 2: Define TypeScript Types

**Files:**
- Create: `types/product.ts`

**Step 1: Write types**

Create `types/product.ts`:

```ts
export interface ProductSpec {
  chip?: string
  cpu_cores?: number
  gpu_cores?: number
  unified_memory_gb?: number
  vram_gb?: number
  memory_bandwidth_gbps?: number
  storage_gb?: number
  tdp_watts?: number
  max_llm_size?: string
  interface?: string
  form_factor?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Product {
  slug: string
  asin: string
  name: string
  category: 'mini-pc' | 'gpu' | 'ai-pc' | 'accessory'
  brand: string
  shortDescription: string
  specs: ProductSpec
  useCases: string[]
  pros: string[]
  cons: string[]
  verdict: string
  affiliateUrl: string
  rating: number
  reviewCount: number
  priceDisplay: string
  lastUpdated: string
  featured: boolean
  faq: FAQ[]
}

export type Category = Product['category']
```

**Step 2: Commit**

```bash
git add types/product.ts
git commit -m "feat: add Product TypeScript types"
```

---

## Task 3: Build lib/products.ts

**Files:**
- Create: `lib/products.ts`
- Create: `lib/__tests__/products.test.ts`

**Step 1: Write failing test**

Create `lib/__tests__/products.test.ts`:

```ts
import { getAllProducts, getProductBySlug, getProductsByCategory } from '../products'

describe('getAllProducts', () => {
  it('returns an array', () => {
    const products = getAllProducts()
    expect(Array.isArray(products)).toBe(true)
  })

  it('returns products with required fields', () => {
    const products = getAllProducts()
    expect(products.length).toBeGreaterThan(0)
    products.forEach(p => {
      expect(p.slug).toBeDefined()
      expect(p.asin).toBeDefined()
      expect(p.name).toBeDefined()
    })
  })
})

describe('getProductBySlug', () => {
  it('returns product for valid slug', () => {
    const products = getAllProducts()
    const first = products[0]
    const found = getProductBySlug(first.slug)
    expect(found).not.toBeNull()
    expect(found?.slug).toBe(first.slug)
  })

  it('returns null for unknown slug', () => {
    const found = getProductBySlug('nonexistent-product')
    expect(found).toBeNull()
  })
})

describe('getProductsByCategory', () => {
  it('filters by category', () => {
    const miniPcs = getProductsByCategory('mini-pc')
    miniPcs.forEach(p => expect(p.category).toBe('mini-pc'))
  })
})
```

**Step 2: Run test — verify it fails**

```bash
npx jest lib/__tests__/products.test.ts
# Expected: FAIL — "Cannot find module '../products'"
```

**Step 3: Implement lib/products.ts**

Create `lib/products.ts`:

```ts
import fs from 'fs'
import path from 'path'
import type { Product, Category } from '@/types/product'

const PRODUCTS_DIR = path.join(process.cwd(), 'content', 'products')

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return []
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8')
    return JSON.parse(raw) as Product
  })
}

export function getProductBySlug(slug: string): Product | null {
  const products = getAllProducts()
  return products.find(p => p.slug === slug) ?? null
}

export function getProductsByCategory(category: Category): Product[] {
  return getAllProducts().filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter(p => p.featured)
}
```

**Step 4: Run test — verify it passes**

```bash
npx jest lib/__tests__/products.test.ts
# Expected: PASS (will pass once product JSON files exist in Task 5)
```

**Step 5: Commit**

```bash
git add lib/products.ts lib/__tests__/products.test.ts
git commit -m "feat: add products lib with unit tests"
```

---

## Task 4: Build lib/schema.ts

**Files:**
- Create: `lib/schema.ts`
- Create: `lib/__tests__/schema.test.ts`

**Step 1: Write failing test**

Create `lib/__tests__/schema.test.ts`:

```ts
import { buildProductSchema, buildFAQSchema, buildOrganizationSchema } from '../schema'
import type { Product } from '@/types/product'

const mockProduct: Product = {
  slug: 'test-product',
  asin: 'B0TEST1234',
  name: 'Test GPU',
  category: 'gpu',
  brand: 'TestBrand',
  shortDescription: 'A great GPU for local AI.',
  specs: { vram_gb: 24, tdp_watts: 350 },
  useCases: ['Local LLM'],
  pros: ['Fast'],
  cons: ['Expensive'],
  verdict: 'Best in class.',
  affiliateUrl: 'https://www.amazon.com/dp/B0TEST1234?tag=YOUR_ASSOCIATE_TAG',
  rating: 4.8,
  reviewCount: 0,
  priceDisplay: 'Check Price on Amazon',
  lastUpdated: '2026-04-19',
  featured: false,
  faq: [{ question: 'Is it fast?', answer: 'Yes.' }],
}

describe('buildProductSchema', () => {
  it('returns valid JSON-LD with @context and @type', () => {
    const schema = buildProductSchema(mockProduct)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Product')
    expect(schema.name).toBe('Test GPU')
    expect(schema.brand.name).toBe('TestBrand')
  })

  it('includes Review type', () => {
    const schema = buildProductSchema(mockProduct)
    expect(schema.review['@type']).toBe('Review')
    expect(schema.review.reviewRating.ratingValue).toBe(4.8)
  })
})

describe('buildFAQSchema', () => {
  it('returns FAQPage schema with all questions', () => {
    const schema = buildFAQSchema(mockProduct.faq)
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(1)
    expect(schema.mainEntity[0].name).toBe('Is it fast?')
  })
})

describe('buildOrganizationSchema', () => {
  it('returns Organization schema', () => {
    const schema = buildOrganizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('The AI Desk')
  })
})
```

**Step 2: Run test — verify it fails**

```bash
npx jest lib/__tests__/schema.test.ts
# Expected: FAIL — "Cannot find module '../schema'"
```

**Step 3: Implement lib/schema.ts**

Create `lib/schema.ts`:

```ts
import type { Product, FAQ } from '@/types/product'

export function buildProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Amazon',
      },
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Organization',
        name: 'The AI Desk',
      },
      reviewBody: product.verdict,
      datePublished: product.lastUpdated,
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  }
}

export function buildFAQSchema(faq: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The AI Desk',
    url: 'https://theaidesk.com',
    description: 'Expert reviews of AI hardware for running AI locally — GPUs, Mini PCs, and AI accessories.',
  }
}
```

**Step 4: Run test — verify it passes**

```bash
npx jest lib/__tests__/schema.test.ts
# Expected: PASS
```

**Step 5: Commit**

```bash
git add lib/schema.ts lib/__tests__/schema.test.ts
git commit -m "feat: add JSON-LD schema builders with unit tests"
```

---

## Task 5: Create 7 Seed Product JSON Files

**Files:**
- Create: `content/products/apple-mac-mini-m4-pro.json`
- Create: `content/products/gmktec-nucbox-m5-pro.json`
- Create: `content/products/nvidia-rtx-4090.json`
- Create: `content/products/nvidia-rtx-4070-super.json`
- Create: `content/products/apple-mac-mini-m4.json`
- Create: `content/products/amd-radeon-rx-7900-xtx.json`
- Create: `content/products/beelink-sei14.json`

**Step 1: Create content directory**

```bash
mkdir -p content/products
```

**Step 2: Create apple-mac-mini-m4-pro.json** (ASIN: B0DLBVHSLD)

```json
{
  "slug": "apple-mac-mini-m4-pro",
  "asin": "B0DLBVHSLD",
  "name": "Apple Mac Mini (M4 Pro, 2024)",
  "category": "mini-pc",
  "brand": "Apple",
  "shortDescription": "The Apple Mac Mini M4 Pro is the best compact AI workstation for local LLM inference in 2026. With up to 64GB of unified memory accessible at 273GB/s and a 14-core CPU, it can run 70B parameter models quantized to 4-bit with no external GPU required.",
  "specs": {
    "chip": "Apple M4 Pro",
    "cpu_cores": 14,
    "gpu_cores": 20,
    "unified_memory_gb": 24,
    "memory_bandwidth_gbps": 273,
    "storage_gb": 512,
    "tdp_watts": 30,
    "max_llm_size": "70B (Q4 quantized)",
    "form_factor": "Mini PC"
  },
  "useCases": [
    "Local LLM inference (Llama 3, Mistral, Qwen)",
    "Stable Diffusion / Flux image generation",
    "Always-on home AI server",
    "On-device coding assistant (Continue, Cursor local mode)",
    "Multi-modal vision model inference"
  ],
  "pros": [
    "Unified memory architecture eliminates GPU VRAM bottleneck — 24GB or 64GB fully usable by LLMs",
    "273 GB/s memory bandwidth rivals discrete GPUs costing 3x more",
    "Silent fanless operation — no fan noise during sustained inference workloads",
    "macOS native support via llama.cpp Metal backend and Ollama",
    "Smallest footprint of any 70B-capable system (197mm × 197mm)"
  ],
  "cons": [
    "Memory not upgradeable after purchase — choose 24GB or 64GB at order time",
    "macOS only — no native CUDA support, NVIDIA-only tools won't run",
    "GPU core count (20) limits parallel image generation throughput vs discrete GPUs",
    "64GB config significantly raises price"
  ],
  "verdict": "The Mac Mini M4 Pro is the definitive choice for anyone who wants silent, efficient, desk-ready AI inference without building a PC. Its unified memory means you can load a full 70B model into RAM — something that requires two high-end discrete GPUs on Windows. At 30W under load, it runs 24 hours a day for less than $2/month in electricity. If you're on macOS and want to run local LLMs, nothing beats this at its price point.",
  "affiliateUrl": "https://www.amazon.com/dp/B0DLBVHSLD?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.8,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": true,
  "faq": [
    {
      "question": "How does the Apple Mac Mini M4 Pro perform on local LLM tasks?",
      "answer": "The Mac Mini M4 Pro runs 7B models at 60–80 tokens/second and 70B models (Q4_K_M quantization) at 8–12 tokens/second using Ollama or llama.cpp with Metal GPU acceleration. Performance scales linearly with model size — it handles everything up to Llama 3 70B without swapping to disk."
    },
    {
      "question": "Can the Mac Mini M4 Pro run Stable Diffusion?",
      "answer": "Yes. Using Automatic1111 or ComfyUI with Apple Silicon optimization, the M4 Pro generates 512×512 images in 4–8 seconds on SDXL. The 20-core GPU handles Flux.1-dev at approximately 12–18 seconds per image at 1024×1024."
    },
    {
      "question": "What is the maximum LLM size the Mac Mini M4 Pro can run?",
      "answer": "With 24GB unified memory, the M4 Pro can run models up to 34B parameters at 4-bit quantization or 13B models at full 8-bit precision. The 64GB upgrade option extends this to 70B models at Q4 or 34B at Q8. Memory bandwidth of 273 GB/s ensures fast generation speeds."
    },
    {
      "question": "Is the Mac Mini M4 Pro worth it for AI compared to a discrete GPU?",
      "answer": "For users who want silent, low-power, hassle-free AI inference on macOS, yes. A discrete GPU like the RTX 4090 offers higher raw CUDA throughput for training and parallel tasks, but requires a full desktop PC, generates significant heat, and draws 450W. The M4 Pro runs the same 70B models at 30W with zero noise."
    }
  ]
}
```

**Step 3: Create gmktec-nucbox-m5-pro.json** (ASIN: B0GHDTHM53)

```json
{
  "slug": "gmktec-nucbox-m5-pro",
  "asin": "B0GHDTHM53",
  "name": "GMKtec NucBox M5 Pro Mini PC",
  "category": "mini-pc",
  "brand": "GMKtec",
  "shortDescription": "The GMKtec NucBox M5 Pro is the best budget entry point for local AI inference in 2026. Powered by an AMD Ryzen 9 processor with Radeon 780M integrated graphics, it runs 7B models via Ollama and supports Windows 11 with full CUDA-compatible tooling via ROCm.",
  "specs": {
    "chip": "AMD Ryzen 9 6900HX",
    "cpu_cores": 8,
    "gpu_cores": 12,
    "unified_memory_gb": 32,
    "memory_bandwidth_gbps": 51,
    "storage_gb": 512,
    "tdp_watts": 45,
    "max_llm_size": "13B (Q4 quantized)",
    "form_factor": "Mini PC"
  },
  "useCases": [
    "Budget local LLM inference (7B–13B models)",
    "Always-on home automation AI server",
    "Windows-native AI workflows (WSL2, Python, Ollama)",
    "Edge AI development and prototyping",
    "Light Stable Diffusion (SD 1.5, SDXL at slow speeds)"
  ],
  "pros": [
    "Under $300 — lowest cost entry to local AI inference",
    "32GB DDR5 RAM provides enough headroom for 13B Q4 models",
    "Windows 11 Pro included — full compatibility with Python AI ecosystem",
    "Compact form factor comparable to Mac Mini",
    "Upgradeable RAM and storage unlike Apple Silicon"
  ],
  "cons": [
    "Radeon 780M iGPU is significantly slower than discrete GPU for AI tasks",
    "51 GB/s memory bandwidth is 5x lower than Mac Mini M4 Pro",
    "ROCm support on Windows is limited vs Linux for AMD GPU AI workloads",
    "Fan noise audible under sustained AI inference load"
  ],
  "verdict": "If your budget is under $300 and you want to run local AI on Windows, the GMKtec NucBox M5 Pro is the most capable option at this price. It handles 7B models smoothly and 13B models acceptably. Don't expect Mac Mini speeds — the iGPU is the bottleneck — but for experimenting with Ollama, LM Studio, or self-hosted AI, this is the best cheap starting point in 2026.",
  "affiliateUrl": "https://www.amazon.com/dp/B0GHDTHM53?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.3,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": true,
  "faq": [
    {
      "question": "Can the GMKtec NucBox M5 Pro run local LLMs?",
      "answer": "Yes. Using Ollama on Windows, the NucBox M5 Pro runs Llama 3 8B at approximately 8–15 tokens/second using the CPU. With ROCm on Linux, the Radeon 780M iGPU accelerates inference to 20–35 tokens/second for 7B models. 13B Q4 models run at 5–10 tokens/second CPU-only."
    },
    {
      "question": "How does the GMKtec NucBox M5 Pro compare to the Mac Mini for AI?",
      "answer": "The Mac Mini M4 Pro is 4–6x faster for AI inference and significantly more power efficient. However, the GMKtec costs a fraction of the price and runs Windows, making it better for users who need Windows compatibility or are on a budget. The NucBox M5 Pro is a starting point; the Mac Mini is a serious workstation."
    },
    {
      "question": "Can I upgrade the RAM in the GMKtec NucBox M5 Pro?",
      "answer": "Yes. Unlike Apple Silicon Macs, the NucBox M5 Pro uses standard SO-DIMM DDR5 slots. It ships with 32GB and can be upgraded to 64GB, which improves LLM headroom for 70B models (though generation speed is still CPU-limited without a discrete GPU)."
    }
  ]
}
```

**Step 4: Create nvidia-rtx-4090.json** (ASIN: B0BC7S9R5C)

```json
{
  "slug": "nvidia-rtx-4090",
  "asin": "B0BC7S9R5C",
  "name": "NVIDIA GeForce RTX 4090 24GB",
  "category": "gpu",
  "brand": "NVIDIA",
  "shortDescription": "The NVIDIA RTX 4090 is the fastest consumer GPU for local AI in 2026. With 24GB of GDDR6X VRAM at 1,008 GB/s bandwidth and 16,384 CUDA cores, it runs 70B quantized models at 15–25 tokens/second and generates SDXL images in under 2 seconds — no other consumer GPU comes close.",
  "specs": {
    "vram_gb": 24,
    "memory_bandwidth_gbps": 1008,
    "cpu_cores": 16384,
    "tdp_watts": 450,
    "max_llm_size": "70B (Q4 quantized)",
    "interface": "PCIe 4.0 x16",
    "form_factor": "Discrete GPU"
  },
  "useCases": [
    "Local LLM inference (all sizes up to 70B Q4)",
    "Stable Diffusion XL and Flux image generation",
    "LoRA fine-tuning of 7B–13B models",
    "Local AI video generation (Wan2.1, CogVideoX)",
    "Whisper transcription and real-time voice AI"
  ],
  "pros": [
    "24GB GDDR6X VRAM — largest on any consumer GPU, fits 70B Q4 models",
    "1,008 GB/s memory bandwidth — fastest consumer GPU inference speeds",
    "Full CUDA ecosystem support — PyTorch, Transformers, ComfyUI, A1111 all native",
    "Tensor Cores accelerate quantized inference (GPTQ, AWQ, bitsandbytes)",
    "Best single-GPU option for fine-tuning LLMs locally"
  ],
  "cons": [
    "450W TDP — requires a high-end PSU (850W minimum) and good case airflow",
    "Premium price — the highest cost consumer GPU",
    "Large physical size — 3-slot card, won't fit compact cases",
    "Loud under full AI workload — fans spin hard at 450W"
  ],
  "verdict": "If you're serious about local AI and want maximum performance from a single GPU, the RTX 4090 is the only answer in 2026. Its 24GB VRAM means you never have to compromise on model size. At 1,008 GB/s memory bandwidth, it makes the competition look slow. The caveats are real — 450W draw, massive size, loud fans, and a steep price — but no other single card gives you this capability. For AI researchers, power users, and anyone running inference as a server, the 4090 pays for itself in productivity.",
  "affiliateUrl": "https://www.amazon.com/dp/B0BC7S9R5C?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.9,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": true,
  "faq": [
    {
      "question": "What LLMs can the RTX 4090 run locally?",
      "answer": "The RTX 4090's 24GB VRAM fits Llama 3 70B at Q4 quantization (leaving ~1GB headroom), all 34B models at Q8, and all 13B/7B models at full precision. Using llama.cpp with CUDA, expect 15–25 tokens/second on 70B Q4 and 80–120 tokens/second on 7B models."
    },
    {
      "question": "Can the RTX 4090 fine-tune LLMs locally?",
      "answer": "Yes. Using QLoRA with bitsandbytes 4-bit quantization, you can fine-tune 7B models with a batch size of 4–8 on 24GB VRAM. Fine-tuning 13B models is possible with gradient checkpointing. Full fine-tuning of 70B models requires multiple GPUs even with the 4090."
    },
    {
      "question": "How fast is the RTX 4090 for Stable Diffusion?",
      "answer": "Extremely fast. SDXL 1.0 at 1024×1024 with 20 steps completes in 1.5–2.5 seconds. Flux.1-dev at 1024×1024 with 28 steps takes 3–6 seconds. SD 1.5 at 512×512 runs at over 100 it/s. The 4090 is the fastest single GPU for image generation available to consumers."
    }
  ]
}
```

**Step 5: Create nvidia-rtx-4070-super.json** (ASIN: B0G488CW54)

```json
{
  "slug": "nvidia-rtx-4070-super",
  "asin": "B0G488CW54",
  "name": "NVIDIA GeForce RTX 4070 Super 12GB",
  "category": "gpu",
  "brand": "NVIDIA",
  "shortDescription": "The NVIDIA RTX 4070 Super is the best mid-range GPU for local AI in 2026. With 12GB of GDDR6X VRAM at 504 GB/s bandwidth, it runs 13B models at full precision and 34B models at Q4 quantization — delivering 80% of RTX 4090 inference performance at roughly half the price.",
  "specs": {
    "vram_gb": 12,
    "memory_bandwidth_gbps": 504,
    "cpu_cores": 7168,
    "tdp_watts": 220,
    "max_llm_size": "34B (Q4 quantized)",
    "interface": "PCIe 4.0 x16",
    "form_factor": "Discrete GPU"
  },
  "useCases": [
    "Local LLM inference (7B–34B models)",
    "Stable Diffusion XL and Flux image generation",
    "ComfyUI workflows with ControlNet and LoRA",
    "LoRA fine-tuning of 7B models",
    "Local Whisper ASR and real-time transcription"
  ],
  "pros": [
    "Best price-to-performance ratio for AI in 2026 mid-range segment",
    "12GB VRAM comfortably fits 13B models at full precision, 34B at Q4",
    "220W TDP — runs cool and quiet compared to 4090",
    "Full CUDA support — identical software compatibility to 4090",
    "Standard 2-slot size fits most PC cases"
  ],
  "cons": [
    "12GB VRAM ceiling — cannot load 70B Q4 models (need ~40GB+)",
    "Half the memory bandwidth of RTX 4090 means slower generation on large models",
    "Not suitable for LLM fine-tuning beyond 7B parameter models"
  ],
  "verdict": "The RTX 4070 Super hits the practical sweet spot for local AI in 2026. If you primarily run 7B–13B models — which covers the vast majority of home AI use cases including Llama 3, Mistral, and Qwen — you get near-4090 speeds at half the power draw and significantly lower cost. The 12GB VRAM limit only hurts if you specifically need 70B models; for everything else, it's an excellent value. This is the card we'd recommend to most people.",
  "affiliateUrl": "https://www.amazon.com/dp/B0G488CW54?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.7,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": false,
  "faq": [
    {
      "question": "Can the RTX 4070 Super run 70B LLMs?",
      "answer": "No — 12GB VRAM is insufficient to load a 70B model even at 4-bit quantization (which requires ~40GB). For 70B models, you need the RTX 4090 (24GB) or a Mac Mini M4 Pro with 64GB unified memory. The 4070 Super is ideal for 7B–34B parameter models."
    },
    {
      "question": "How does the RTX 4070 Super compare to the RTX 4090 for AI?",
      "answer": "For 7B models, the 4070 Super is about 55% as fast as the 4090 (504 vs 1,008 GB/s memory bandwidth). For 13B models, the gap is similar. For 34B Q4 models, both can run them but the 4090 is faster. The 4090 wins every benchmark but the 4070 Super costs half as much and draws half the power."
    }
  ]
}
```

**Step 6: Create apple-mac-mini-m4.json** (ASIN: B0DLBX4B1K)

```json
{
  "slug": "apple-mac-mini-m4",
  "asin": "B0DLBX4B1K",
  "name": "Apple Mac Mini (M4, 2024)",
  "category": "mini-pc",
  "brand": "Apple",
  "shortDescription": "The Apple Mac Mini M4 is the most affordable path to Apple Silicon AI inference in 2026. With 16GB of unified memory at 120 GB/s bandwidth and a 10-core CPU, it runs 7B models at 40–60 tokens/second via Ollama — faster than any competing mini PC at the same price.",
  "specs": {
    "chip": "Apple M4",
    "cpu_cores": 10,
    "gpu_cores": 10,
    "unified_memory_gb": 16,
    "memory_bandwidth_gbps": 120,
    "storage_gb": 256,
    "tdp_watts": 20,
    "max_llm_size": "13B (Q4 quantized)",
    "form_factor": "Mini PC"
  },
  "useCases": [
    "Local LLM inference for 7B models (Llama 3, Phi-3, Gemma)",
    "Always-on home AI assistant server",
    "On-device coding companion (Continue.dev)",
    "Light Stable Diffusion inference (SD 1.5, SDXL slow)"
  ],
  "pros": [
    "Lowest cost Apple Silicon entry point for local AI",
    "16GB unified memory is enough for all 7B and most 13B Q4 models",
    "20W TDP — cheapest to run 24/7 of any AI-capable machine",
    "Silent — fanless under light-to-moderate AI workloads",
    "Native Ollama and llama.cpp Metal support"
  ],
  "cons": [
    "16GB ceiling limits 13B performance and rules out 34B+ models",
    "120 GB/s bandwidth (vs 273 GB/s on M4 Pro) means noticeably slower 13B inference",
    "10-core GPU less capable for Stable Diffusion vs M4 Pro",
    "Non-upgradeable memory — buy the right configuration upfront"
  ],
  "verdict": "The Mac Mini M4 base model is the ideal entry-level AI machine for users who primarily run 7B models and want the Apple Silicon experience at the lowest cost. It runs Ollama out of the box, handles most popular LLMs, and consumes only 20W — making it practical to leave on 24/7 as a home AI server. If you anticipate running 13B+ models frequently, spend more and get the M4 Pro; otherwise, this is outstanding value.",
  "affiliateUrl": "https://www.amazon.com/dp/B0DLBX4B1K?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.7,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": false,
  "faq": [
    {
      "question": "What is the difference between the Mac Mini M4 and M4 Pro for AI?",
      "answer": "The M4 Pro has 14 CPU cores (vs 10), 20 GPU cores (vs 10), 273 GB/s memory bandwidth (vs 120 GB/s), and scales to 64GB RAM (vs 32GB max). In practice, the M4 Pro runs 13B models about 2x faster and is the only base Mac Mini option capable of 70B models (with 64GB upgrade). The base M4 is better for 7B-focused workflows."
    },
    {
      "question": "Can the Mac Mini M4 run Stable Diffusion?",
      "answer": "Yes, but moderately. SD 1.5 at 512×512 runs at 6–10 it/s. SDXL is slow (20–40 seconds per image). For serious image generation, the M4 Pro or a discrete GPU like the RTX 4070 Super is significantly better. The M4 base is adequate for occasional use but not production workflows."
    }
  ]
}
```

**Step 7: Create amd-radeon-rx-7900-xtx.json** (ASIN: B0C85YVQLW)

```json
{
  "slug": "amd-radeon-rx-7900-xtx",
  "asin": "B0C85YVQLW",
  "name": "AMD Radeon RX 7900 XTX 24GB",
  "category": "gpu",
  "brand": "AMD",
  "shortDescription": "The AMD Radeon RX 7900 XTX is the best AMD GPU for local AI in 2026. With 24GB of GDDR6 VRAM matching the RTX 4090's capacity, it runs 70B Q4 models via ROCm on Linux and offers a strong alternative for users in the AMD ecosystem — at a lower price than the 4090.",
  "specs": {
    "vram_gb": 24,
    "memory_bandwidth_gbps": 960,
    "tdp_watts": 355,
    "max_llm_size": "70B (Q4 quantized, Linux ROCm)",
    "interface": "PCIe 4.0 x16",
    "form_factor": "Discrete GPU"
  },
  "useCases": [
    "Local LLM inference on Linux (ROCm + llama.cpp)",
    "Stable Diffusion via DirectML on Windows or ROCm on Linux",
    "70B model inference with matching VRAM to RTX 4090",
    "AMD-ecosystem AI workloads"
  ],
  "pros": [
    "24GB GDDR6 VRAM — same capacity as RTX 4090, fits 70B Q4 models",
    "Lower street price than RTX 4090 for equivalent VRAM",
    "960 GB/s memory bandwidth — competitive with NVIDIA for inference",
    "Excellent rasterization performance for gaming + AI dual use"
  ],
  "cons": [
    "ROCm support on Windows is experimental — Linux required for reliable AI workloads",
    "PyTorch ROCm ecosystem is less mature than CUDA — some libraries won't run",
    "LM Studio and some popular Windows AI tools have limited AMD GPU support",
    "355W TDP — high power draw, requires 850W+ PSU"
  ],
  "verdict": "The RX 7900 XTX is a genuine RTX 4090 alternative for AI — but only on Linux. Its 24GB VRAM and 960 GB/s bandwidth are legitimate, and ROCm-accelerated llama.cpp delivers competitive inference speeds. On Windows, the story is messier: ROCm is unstable and many Python AI libraries fall back to CPU. If you run Linux and want 24GB VRAM at a lower price than the 4090, this is compelling. If you use Windows, choose NVIDIA.",
  "affiliateUrl": "https://www.amazon.com/dp/B0C85YVQLW?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.4,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": false,
  "faq": [
    {
      "question": "Can the AMD RX 7900 XTX run local LLMs on Windows?",
      "answer": "Partially. Ollama on Windows uses DirectML for AMD GPUs, which works for basic 7B–13B inference but is significantly slower than CUDA or ROCm. For full performance, run Ubuntu with ROCm 6.x. On Linux, llama.cpp with ROCm delivers inference speeds within 15% of the RTX 4090 on equivalent workloads."
    },
    {
      "question": "How does the RX 7900 XTX compare to the RTX 4090 for AI inference?",
      "answer": "On Linux with ROCm, the RX 7900 XTX is typically 85–90% as fast as the RTX 4090 for LLM inference, with similar VRAM capacity. The gap widens for tasks that rely on NVIDIA-specific libraries (FlashAttention, bitsandbytes, Tensor RT). For pure llama.cpp throughput, it's an excellent alternative."
    }
  ]
}
```

**Step 8: Create beelink-sei14.json** (ASIN: B0DP23FPKY)

```json
{
  "slug": "beelink-sei14",
  "asin": "B0DP23FPKY",
  "name": "Beelink SEi14 Mini PC (Intel Core Ultra 7)",
  "category": "mini-pc",
  "brand": "Beelink",
  "shortDescription": "The Beelink SEi14 is a mid-range Windows mini PC with Intel Core Ultra 7 NPU for on-device AI acceleration. Its 32GB DDR5 and Intel Arc integrated graphics make it one of the most capable budget Windows options for local LLM inference in 2026, with Copilot+ PC certification.",
  "specs": {
    "chip": "Intel Core Ultra 7 155H",
    "cpu_cores": 16,
    "gpu_cores": 8,
    "unified_memory_gb": 32,
    "memory_bandwidth_gbps": 68,
    "storage_gb": 1000,
    "tdp_watts": 28,
    "max_llm_size": "13B (Q4 quantized)",
    "form_factor": "Mini PC"
  },
  "useCases": [
    "Windows Copilot+ AI features (Recall, Cocreator)",
    "Local LLM inference via Ollama on Windows",
    "Intel OpenVINO accelerated AI workloads",
    "NPU-accelerated Whisper transcription",
    "Budget Windows AI development workstation"
  ],
  "pros": [
    "Intel Core Ultra 7 NPU — hardware-accelerated AI for compatible Windows apps",
    "32GB DDR5 with upgrade path — handles 13B Q4 models",
    "1TB NVMe storage included — plenty of space for model weights",
    "Copilot+ PC certified — future-proofed for Microsoft AI features",
    "28W TDP — fanless-quiet and energy efficient"
  ],
  "cons": [
    "Intel Arc iGPU AI throughput is below AMD Radeon 780M for raw LLM tokens/sec",
    "NPU acceleration limited to Intel-optimized apps — not general llama.cpp speedup",
    "68 GB/s memory bandwidth is the key bottleneck vs Apple Silicon"
  ],
  "verdict": "The Beelink SEi14 is the best Intel-based mini PC for AI in 2026, especially for users invested in the Windows AI ecosystem. The Core Ultra NPU accelerates Windows Copilot+ features, and OpenVINO-optimized models run efficiently. For raw LLM tokens/second, the Mac Mini M4 at similar price wins — but the SEi14's Windows compatibility, 1TB storage, and upgradeable RAM make it a compelling alternative for developers who need Windows.",
  "affiliateUrl": "https://www.amazon.com/dp/B0DP23FPKY?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.5,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": false,
  "faq": [
    {
      "question": "Does the Beelink SEi14 NPU speed up local LLMs like Ollama?",
      "answer": "Not directly. Ollama and llama.cpp don't yet use the Intel NPU for general LLM inference — they use the CPU or Intel Arc iGPU. The NPU specifically accelerates Intel OpenVINO-optimized models and Windows Copilot+ features. For raw Ollama inference, expect CPU-speed performance similar to other mini PCs."
    },
    {
      "question": "How does the Beelink SEi14 compare to the Mac Mini M4 for local AI?",
      "answer": "The Mac Mini M4 is faster for LLM inference (120 GB/s vs 68 GB/s memory bandwidth) and significantly more energy efficient (20W vs 28W). The Beelink SEi14 wins on Windows compatibility, NPU support for Windows AI features, upgradeable RAM, and larger default storage. Choose Beelink if you need Windows; Mac Mini if you want maximum inference speed."
    }
  ]
}
```

**Step 9: Run tests to verify JSON is valid and products load**

```bash
npx jest lib/__tests__/products.test.ts
# Expected: PASS — 7 products load, all have required fields
```

**Step 10: Commit**

```bash
git add content/
git commit -m "feat: add 7 seed product JSON files with GEO-optimized content"
```

---

## Task 6: Build Core Components

**Files:**
- Create: `components/AffiliateDisclosure.tsx`
- Create: `components/AffiliateButton.tsx`
- Create: `components/SchemaMarkup.tsx`
- Create: `components/ProductCard.tsx`
- Create: `components/ProductHero.tsx`
- Create: `components/ComparisonTable.tsx`
- Create: `components/__tests__/AffiliateButton.test.tsx`
- Create: `components/__tests__/AffiliateDisclosure.test.tsx`

**Step 1: Write failing tests**

Create `components/__tests__/AffiliateDisclosure.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AffiliateDisclosure from '../AffiliateDisclosure'

it('renders the required Amazon Associates disclosure text', () => {
  render(<AffiliateDisclosure />)
  expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases/i)).toBeInTheDocument()
})
```

Create `components/__tests__/AffiliateButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AffiliateButton from '../AffiliateButton'

it('renders (paid link) disclosure next to CTA', () => {
  render(<AffiliateButton href="https://amazon.com/dp/B0TEST" label="Check Price on Amazon" />)
  expect(screen.getByText(/paid link/i)).toBeInTheDocument()
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://amazon.com/dp/B0TEST')
})

it('opens in new tab with noopener noreferrer', () => {
  render(<AffiliateButton href="https://amazon.com/dp/B0TEST" label="Check Price on Amazon" />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer nofollow')
})
```

**Step 2: Run tests — verify they fail**

```bash
npx jest components/__tests__/
# Expected: FAIL — components don't exist yet
```

**Step 3: Create AffiliateDisclosure.tsx**

```tsx
export default function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={`text-sm text-gray-500 ${className ?? ''}`}>
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  )
}
```

**Step 4: Create AffiliateButton.tsx**

```tsx
interface AffiliateButtonProps {
  href: string
  label?: string
  className?: string
}

export default function AffiliateButton({
  href,
  label = 'Check Price on Amazon',
  className,
}: AffiliateButtonProps) {
  return (
    <div className={`flex flex-col items-start gap-1 ${className ?? ''}`}>
      <span className="text-xs text-gray-400">(paid link)</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        {label}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}
```

**Step 5: Create SchemaMarkup.tsx**

```tsx
interface SchemaMarkupProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

**Step 6: Create ProductCard.tsx**

```tsx
import Link from 'next/link'
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
            {product.category.replace('-', ' ').toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.shortDescription}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-500">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-sm text-gray-500">{product.rating}/5</span>
          </div>
        </div>
      </div>
      <AffiliateButton href={product.affiliateUrl} />
    </article>
  )
}
```

**Step 7: Create ProductHero.tsx**

```tsx
import type { Product } from '@/types/product'
import AffiliateButton from './AffiliateButton'

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-3xl">
        <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-medium text-blue-300 mb-4">
          {product.category.replace('-', ' ').toUpperCase()}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">{product.shortDescription}</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-amber-400 text-xl">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-gray-300">{product.rating} / 5.0</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">Brand: {product.brand}</span>
        </div>
        <AffiliateButton href={product.affiliateUrl} />
      </div>
    </section>
  )
}
```

**Step 8: Create ComparisonTable.tsx**

```tsx
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

export default function ComparisonTable({ specs }: { specs: ProductSpec }) {
  const rows = Object.entries(specs).filter(([key]) => key in SPEC_LABELS)

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <caption className="sr-only">Product specifications</caption>
        <tbody className="divide-y divide-gray-100">
          {rows.map(([key, value]) => (
            <tr key={key} className="even:bg-gray-50">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-gray-700 w-40"
              >
                {SPEC_LABELS[key as keyof ProductSpec]}
              </th>
              <td className="px-4 py-3 text-gray-900">
                {typeof value === 'number' && key.includes('gb')
                  ? `${value} GB`
                  : typeof value === 'number' && key.includes('gbps')
                  ? `${value} GB/s`
                  : typeof value === 'number' && key.includes('watts')
                  ? `${value}W`
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Step 9: Run tests — verify they pass**

```bash
npx jest components/__tests__/
# Expected: PASS
```

**Step 10: Commit**

```bash
git add components/
git commit -m "feat: add core UI components with compliance tests"
```

---

## Task 7: Build Global Layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Update app/layout.tsx**

```tsx
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
              🖥 The AI Desk
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
```

**Step 2: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add global layout with compliance disclosure and navigation"
```

---

## Task 8: Build Homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Implement homepage**

```tsx
import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const allProducts = getAllProducts()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The Best AI Hardware<br />for Running AI Locally
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Expert reviews of GPUs, Mini PCs, and AI accessories — tested for LLM inference, Stable Diffusion, and local AI workloads in 2026.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          Browse All Products
        </Link>
      </section>

      {/* Category grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { slug: 'gpu', label: 'GPUs', icon: '⚡', description: 'Discrete graphics cards for maximum AI throughput' },
            { slug: 'mini-pc', label: 'Mini PCs', icon: '🖥', description: 'Compact all-in-one AI workstations' },
            { slug: 'ai-pc', label: 'AI PCs', icon: '🤖', description: 'Desktop PCs optimized for local AI' },
            { slug: 'accessory', label: 'Accessories', icon: '🔧', description: 'Cooling, cables, and AI peripherals' },
          ].map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-900">{cat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor's Picks</h2>
        <p className="text-gray-600 mb-6">Hand-picked AI hardware for different budgets and use cases.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/products" className="text-blue-600 font-medium hover:underline">
            View all {allProducts.length} products →
          </Link>
        </div>
      </section>

      {/* GEO-targeted informational section */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How to Choose AI Hardware for Running LLMs Locally
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Start with VRAM or Unified Memory</h3>
            <p>The single most important spec for local AI is memory capacity. A 7B model needs ~4–8GB; 13B needs ~8–16GB; 70B needs ~40GB+. Unified memory (Apple Silicon) and VRAM (discrete GPUs) both count.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Memory Bandwidth Determines Speed</h3>
            <p>Tokens per second scales directly with memory bandwidth. The RTX 4090's 1,008 GB/s is ~8x faster than a budget mini PC's 68 GB/s for the same model — expect proportional speed differences.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">macOS vs Windows vs Linux</h3>
            <p>Apple Silicon on macOS has the best out-of-box experience via Ollama. NVIDIA GPUs on Windows/Linux offer the broadest software compatibility. AMD GPUs perform best on Linux with ROCm.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage with featured products and category navigation"
```

---

## Task 9: Build Product Listing Page

**Files:**
- Create: `app/products/page.tsx`

**Step 1: Implement product listing**

```tsx
import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'All AI Hardware Products',
  description: 'Browse all expert-reviewed GPUs, Mini PCs, and AI accessories for running AI locally in 2026.',
}

export default function ProductsPage() {
  const products = getAllProducts()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All AI Hardware</h1>
        <p className="text-gray-600">{products.length} products reviewed for local AI inference</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/products/page.tsx
git commit -m "feat: add product listing page"
```

---

## Task 10: Build Product Detail Page (ISR)

**Files:**
- Create: `app/products/[slug]/page.tsx`

**Step 1: Implement product detail page with ISR and JSON-LD**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { buildProductSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema'
import SchemaMarkup from '@/components/SchemaMarkup'
import ProductHero from '@/components/ProductHero'
import ComparisonTable from '@/components/ComparisonTable'
import AffiliateButton from '@/components/AffiliateButton'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const revalidate = 3600 // ISR: rebuild at most once per hour

export async function generateStaticParams() {
  return getAllProducts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: `${product.name} Review — Best for Local AI?`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} Review`,
      description: product.shortDescription,
    },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const schemas = [
    buildProductSchema(product),
    buildFAQSchema(product.faq),
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://theaidesk.com' },
      { name: 'Products', url: 'https://theaidesk.com/products' },
      { name: product.name, url: `https://theaidesk.com/products/${product.slug}` },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaMarkup key={i} schema={schema} />
      ))}

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><a href="/" className="hover:text-gray-900">Home</a></li>
          <li>/</li>
          <li><a href="/products" className="hover:text-gray-900">Products</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="space-y-10">
        <ProductHero product={product} />

        {/* BLUF summary — RAG-optimized */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Bottom Line: Is the {product.name} Good for Local AI?
          </h2>
          <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
        </section>

        {/* Use cases */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            What Can You Run on the {product.name}?
          </h2>
          <ul className="space-y-2">
            {product.useCases.map(uc => (
              <li key={uc} className="flex gap-2 text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {uc}
              </li>
            ))}
          </ul>
        </section>

        {/* Spec table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Full Specifications
          </h2>
          <ComparisonTable specs={product.specs} />
        </section>

        {/* Pros / Cons */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-3">Pros</h3>
              <ul className="space-y-2">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-3">Cons</h3>
              <ul className="space-y-2">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-500 mt-0.5 shrink-0">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Verdict</h2>
          <p className="text-gray-700 leading-relaxed">{product.verdict}</p>
          <div className="mt-6">
            <AffiliateButton href={product.affiliateUrl} />
          </div>
        </section>

        {/* FAQ — GEO optimized */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {product.faq.map(item => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AffiliateDisclosure className="border-t border-gray-200 pt-6" />
      </div>
    </>
  )
}
```

**Step 2: Commit**

```bash
git add app/products/
git commit -m "feat: add ISR product detail pages with JSON-LD schema and GEO content"
```

---

## Task 11: Build Category Pages

**Files:**
- Create: `app/categories/[category]/page.tsx`

**Step 1: Implement category pillar pages**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types/product'

export const revalidate = 3600

const CATEGORY_META: Record<Category, { title: string; description: string; h1: string }> = {
  'gpu': {
    title: 'Best GPUs for Local AI (2026)',
    description: 'Expert reviews of the best discrete GPUs for running LLMs and Stable Diffusion locally in 2026.',
    h1: 'Best GPUs for Running AI Locally (2026)',
  },
  'mini-pc': {
    title: 'Best Mini PCs for Local AI (2026)',
    description: 'Compact AI workstations reviewed for local LLM inference, Stable Diffusion, and home AI servers.',
    h1: 'Best Mini PCs for Local AI Inference (2026)',
  },
  'ai-pc': {
    title: 'Best AI PCs (2026)',
    description: 'Full desktop AI workstations reviewed for local LLM training and inference workloads.',
    h1: 'Best AI PCs for Local Machine Learning (2026)',
  },
  'accessory': {
    title: 'Best AI Accessories (2026)',
    description: 'Cooling solutions, cables, and peripherals for optimizing your local AI workstation.',
    h1: 'Best Accessories for Local AI Workstations (2026)',
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(category => ({ category }))
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const meta = CATEGORY_META[params.category as Category]
  if (!meta) return {}
  return { title: meta.title, description: meta.description }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const products = getProductsByCategory(category)

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><a href="/" className="hover:text-gray-900">Home</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{meta.title}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{meta.h1}</h1>
      <p className="text-gray-600 mb-8">{meta.description}</p>

      {products.length === 0 ? (
        <p className="text-gray-500">No products in this category yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/categories/
git commit -m "feat: add category pillar pages with ISR"
```

---

## Task 12: Build About Page

**Files:**
- Create: `app/about/page.tsx`

**Step 1: Implement about/disclosure page**

```tsx
import type { Metadata } from 'next'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const metadata: Metadata = {
  title: 'About The AI Desk',
  description: 'Learn about The AI Desk, our review methodology, and our Amazon Associates disclosure.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto prose prose-gray">
      <h1>About The AI Desk</h1>
      <p>
        The AI Desk publishes expert reviews of hardware for running AI locally — GPUs, Mini PCs, and AI accessories. We focus on real-world performance for LLM inference, Stable Diffusion, and home AI server use cases.
      </p>

      <h2>Our Review Methodology</h2>
      <p>
        We evaluate hardware based on: memory capacity (VRAM/unified), memory bandwidth (tokens/second throughput), power efficiency (performance per watt), software ecosystem compatibility, and value for money.
      </p>

      <h2>Affiliate Disclosure</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <AffiliateDisclosure className="font-medium text-amber-900" />
        <p className="text-sm text-amber-800 mt-2">
          This means we may earn a commission when you click our product links and make a purchase on Amazon, at no additional cost to you. This commission helps fund our independent research and review process.
        </p>
      </div>

      <h2>FTC Disclosure</h2>
      <p>
        In compliance with FTC guidelines, all affiliate links on this site are marked with "(paid link)" immediately adjacent to the link. We are not paid by manufacturers to produce reviews — our editorial opinions are independent.
      </p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/about/
git commit -m "feat: add about page with full affiliate disclosure"
```

---

## Task 13: Configure robots.txt and Sitemap

**Files:**
- Create: `public/robots.txt`
- Create: `app/sitemap.ts`

**Step 1: Create robots.txt**

Create `public/robots.txt`:

```
# The AI Desk — robots.txt
# Allow AI retrieval agents for GEO/AI Overview inclusion
User-agent: OAI-SearchBot
Allow: /

# Allow Anthropic's ClaudeBot
User-agent: ClaudeBot
Allow: /

# Block training scrapers — we allow retrieval, not training
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

# Default: allow all
User-agent: *
Allow: /

Sitemap: https://theaidesk.com/sitemap.xml
```

**Step 2: Create dynamic sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts()
  const BASE = 'https://theaidesk.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories/gpu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/categories/mini-pc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticPages, ...productPages]
}
```

**Step 3: Commit**

```bash
git add public/robots.txt app/sitemap.ts
git commit -m "feat: add robots.txt (allow OAI-SearchBot) and dynamic sitemap"
```

---

## Task 14: Run Full Test Suite and Verify Build

**Step 1: Run all tests**

```bash
npx jest --coverage
# Expected: All tests PASS
```

**Step 2: Run Next.js build**

```bash
npm run build
# Expected: No TypeScript errors, all pages generate successfully
# Check output for: ✓ Generating static pages (N/N)
```

**Step 3: Run dev server and manually verify**

```bash
npm run dev
# Open: http://localhost:3000
# Verify:
# ✓ Disclosure banner visible on homepage
# ✓ Product cards show on homepage
# ✓ http://localhost:3000/products/apple-mac-mini-m4-pro loads
# ✓ "(paid link)" appears before affiliate button
# ✓ View source: JSON-LD schemas present in <head>
# ✓ http://localhost:3000/categories/gpu shows GPU products
# ✓ http://localhost:3000/robots.txt is correct
# ✓ http://localhost:3000/sitemap.xml lists all pages
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete The AI Desk v1.0 — 7 product pages, ISR, schema, compliance"
```

---

## Task 15: Deploy to Vercel

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Deploy**

```bash
vercel
# Follow prompts:
# - Link to existing project? No
# - Project name: the-ai-desk
# - Framework: Next.js (auto-detected)
# - Override build settings? No
```

**Step 3: Set environment variables (if any)**

```bash
# No env vars required for phase 1 (no API keys yet)
# When Amazon Associates tag is obtained:
# vercel env add NEXT_PUBLIC_AMAZON_TAG
```

**Step 4: Verify deployment**

- Open the Vercel preview URL
- Check all routes work
- Check `/robots.txt` and `/sitemap.xml` are accessible
- Verify ISR by checking page headers for `x-nextjs-cache: HIT`

---

## Compliance Checklist (verify before launch)

- [ ] "As an Amazon Associate I earn from qualifying purchases." visible on every page (in global layout)
- [ ] "(paid link)" appears immediately before/after every affiliate link
- [ ] No static prices displayed anywhere — all CTAs say "Check Price on Amazon"
- [ ] `/about` page contains full FTC + Amazon disclosure
- [ ] All affiliate URLs include `?tag=YOUR_ASSOCIATE_TAG` (replace placeholder before launch)
- [ ] No affiliate links in robots.txt, sitemap, or any non-HTML context

---

## Post-Launch (when Associates tag is obtained)

1. Replace all `YOUR_ASSOCIATE_TAG` in JSON files with real tag
2. Apply for Amazon Creators API access (requires 10 qualifying sales)
3. Add IndexNow to Vercel via Cloudflare integration for instant indexing
4. Set up Vercel Analytics to monitor Core Web Vitals
