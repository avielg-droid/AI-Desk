import { getAllProducts, getProductBySlug, getProductsByCategory, getFeaturedProducts } from '../products'

describe('getAllProducts', () => {
  it('returns an array', () => {
    const products = getAllProducts()
    expect(Array.isArray(products)).toBe(true)
  })
})

describe('getProductBySlug', () => {
  it('returns null for unknown slug', () => {
    const found = getProductBySlug('nonexistent-product-xyz')
    expect(found).toBeNull()
  })
})

describe('getProductsByCategory', () => {
  it('returns an array', () => {
    const result = getProductsByCategory('gpu')
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('getFeaturedProducts', () => {
  it('returns an array', () => {
    const result = getFeaturedProducts()
    expect(Array.isArray(result)).toBe(true)
  })
})
