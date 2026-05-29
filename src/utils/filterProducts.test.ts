import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { DEFAULT_FILTERS } from '../types/product'
import {
  filterProducts,
  getActiveFilterChips,
  getUniqueProductTypes,
} from './filterProducts'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    brand: 'Maybelline',
    name: 'Test Product',
    price: 8.99,
    imageUrl: null,
    productLink: null,
    websiteLink: null,
    description: null,
    rating: 4.2,
    category: 'lipstick',
    productType: 'lipstick',
    colors: [{ hex_value: 'ff0000', colour_name: 'Ruby Red' }],
    ...overrides,
  }
}

describe('filterProducts', () => {
  const products = [
    makeProduct({ id: 1, price: 4.99, productType: 'lipstick', rating: 4.5 }),
    makeProduct({ id: 2, price: 12.99, productType: 'mascara', rating: 3.1 }),
    makeProduct({ id: 3, price: null, productType: 'foundation', rating: null }),
  ]

  it('returns all products when filters are empty', () => {
    expect(filterProducts(products, DEFAULT_FILTERS)).toHaveLength(3)
  })

  it('ORs selections within a price range group', () => {
    const filtered = filterProducts(products, {
      ...DEFAULT_FILTERS,
      priceRanges: ['under-5', '10-15'],
    })
    expect(filtered.map((p) => p.id)).toEqual([1, 2])
  })

  it('ANDs selections across filter groups', () => {
    const filtered = filterProducts(products, {
      ...DEFAULT_FILTERS,
      priceRanges: ['under-5'],
      productTypes: ['mascara'],
    })
    expect(filtered).toHaveLength(0)
  })

  it('excludes products without a price when price filters are active', () => {
    const filtered = filterProducts(products, {
      ...DEFAULT_FILTERS,
      priceRanges: ['under-5'],
    })
    expect(filtered.some((p) => p.id === 3)).toBe(false)
  })

  it('matches unrated products with the unrated filter', () => {
    const filtered = filterProducts(products, {
      ...DEFAULT_FILTERS,
      ratings: ['unrated'],
    })
    expect(filtered.map((p) => p.id)).toEqual([3])
  })

  it('matches products by normalized color label', () => {
    const filtered = filterProducts(products, {
      ...DEFAULT_FILTERS,
      colors: ['Ruby Red'],
    })
    expect(filtered).toHaveLength(3)
  })
})

describe('getActiveFilterChips', () => {
  it('builds chips for each active filter group', () => {
    const chips = getActiveFilterChips({
      priceRanges: ['under-5'],
      productTypes: ['lipstick'],
      ratings: ['4-plus'],
      colors: ['Ruby Red'],
    })

    expect(chips).toHaveLength(4)
    expect(chips.map((chip) => chip.label)).toContain('Under $5')
    expect(chips.map((chip) => chip.label)).toContain('Lipstick')
  })
})

describe('getUniqueProductTypes', () => {
  it('returns sorted unique product types with Other fallback', () => {
    const types = getUniqueProductTypes([
      makeProduct({ productType: 'mascara' }),
      makeProduct({ id: 2, productType: 'lipstick' }),
      makeProduct({ id: 3, productType: null }),
    ])

    expect(types).toEqual(['lipstick', 'mascara', 'Other'])
  })
})
