export interface ProductSpec {
  chip?: string
  architecture?: string          // e.g. 'NVIDIA Blackwell', 'AMD RDNA 4', 'Apple Silicon M4 Pro'
  cooling?: string               // e.g. 'Triple-fan active', 'Single blower', 'Fanless + blower'
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
  tokens_per_second_7b?: number
  tokens_per_second_13b?: number
  image_gen_sdxl_seconds?: number
}

export interface FAQ {
  question: string
  answer: string
}

export interface Product {
  slug: string
  asin: string
  image?: string   // optional local image path, e.g. "/products/beelink-sei14.jpg"
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
  price?: number
  priceDisplay: string
  lastUpdated: string
  featured: boolean
  faq: FAQ[]
  crossSells?: string[]
  notFor?: string[]
  entityHeadline?: string
}

export type Category = Product['category']
