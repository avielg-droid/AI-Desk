export interface ProductSpec {
  chip?: string
  architecture?: string
  cooling?: string
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
  npu_tops?: number
  storage_bays?: number
  charging_watts?: number
  ports_count?: number
  ethernet_speed?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Product {
  slug: string
  asin: string
  image?: string
  name: string
  category: 'mini-pc' | 'gpu' | 'ai-pc' | 'accessory' | 'dock' | 'nas' | 'npu-laptop'
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
