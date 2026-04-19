import { buildProductSchema, buildFAQSchema, buildOrganizationSchema, buildBreadcrumbSchema } from '../schema'
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
  it('returns valid JSON-LD with @context and @type Product', () => {
    const schema = buildProductSchema(mockProduct)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Product')
    expect(schema.name).toBe('Test GPU')
    expect(schema.brand.name).toBe('TestBrand')
  })

  it('includes Review with correct rating', () => {
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
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Yes.')
  })
})

describe('buildOrganizationSchema', () => {
  it('returns Organization schema with correct name', () => {
    const schema = buildOrganizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('The AI Desk')
  })
})

describe('buildBreadcrumbSchema', () => {
  it('returns BreadcrumbList with correct items', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Home', url: 'https://theaidesk.com' },
      { name: 'Products', url: 'https://theaidesk.com/products' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(2)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[1].name).toBe('Products')
  })
})
