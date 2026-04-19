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
