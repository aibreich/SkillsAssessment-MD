import { describe, expect, it } from 'vitest'
import {
  filterProductsByArea,
  getNavAreaIntro,
  getProductNavArea,
} from './navAreas'
import type { Product } from '../types/product'

const baseProduct: Product = {
  id: 1,
  brand: 'Maybelline',
  name: 'Test',
  price: 9.99,
  imageUrl: null,
  productLink: null,
  websiteLink: null,
  description: null,
  rating: 4,
  category: null,
  productType: 'lipstick',
  colors: [],
}

describe('getProductNavArea', () => {
  it('maps known product types to nav areas', () => {
    expect(getProductNavArea('lipstick')).toBe('Lips')
    expect(getProductNavArea('mascara')).toBe('Eyes')
  })

  it('returns null for unmapped product types', () => {
    expect(getProductNavArea('unknown_type')).toBeNull()
  })
})

describe('filterProductsByArea', () => {
  it('returns all products for All', () => {
    const products = [
      baseProduct,
      { ...baseProduct, id: 2, productType: 'mascara' },
    ]
    expect(filterProductsByArea(products, 'All')).toHaveLength(2)
  })

  it('filters products to the selected nav area', () => {
    const products = [
      baseProduct,
      { ...baseProduct, id: 2, productType: 'mascara' },
    ]
    expect(filterProductsByArea(products, 'Lips')).toHaveLength(1)
    expect(filterProductsByArea(products, 'Eyes')).toHaveLength(1)
  })
})

describe('getNavAreaIntro', () => {
  it('returns area-specific copy', () => {
    expect(getNavAreaIntro('Face').title).toBe('Face Collection')
    expect(getNavAreaIntro('All').title).toBe('All Products')
  })
})
