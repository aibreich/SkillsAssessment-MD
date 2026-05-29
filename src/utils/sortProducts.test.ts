import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { sortProducts } from './sortProducts'

const products: Product[] = [
  {
    id: 1,
    brand: 'Maybelline',
    name: 'Zeta Lipstick',
    price: 12,
    imageUrl: null,
    productLink: null,
    websiteLink: null,
    description: null,
    rating: 3,
    category: null,
    productType: 'lipstick',
    colors: [],
  },
  {
    id: 2,
    brand: 'Maybelline',
    name: 'Alpha Mascara',
    price: 6,
    imageUrl: null,
    productLink: null,
    websiteLink: null,
    description: null,
    rating: 4.8,
    category: null,
    productType: 'mascara',
    colors: [],
  },
  {
    id: 3,
    brand: 'Maybelline',
    name: 'Beta Foundation',
    price: null,
    imageUrl: null,
    productLink: null,
    websiteLink: null,
    description: null,
    rating: null,
    category: null,
    productType: 'foundation',
    colors: [],
  },
]

describe('sortProducts', () => {
  it('preserves order for featured sort', () => {
    expect(sortProducts(products, 'featured').map((p) => p.id)).toEqual([1, 2, 3])
  })

  it('sorts by price ascending with null prices treated as zero', () => {
    expect(sortProducts(products, 'price-asc').map((p) => p.id)).toEqual([3, 2, 1])
  })

  it('sorts by price descending', () => {
    expect(sortProducts(products, 'price-desc').map((p) => p.id)).toEqual([1, 2, 3])
  })

  it('sorts by rating descending with unrated last', () => {
    expect(sortProducts(products, 'rating-desc').map((p) => p.id)).toEqual([2, 1, 3])
  })

  it('sorts by name ascending', () => {
    expect(sortProducts(products, 'name-asc').map((p) => p.name)).toEqual([
      'Alpha Mascara',
      'Beta Foundation',
      'Zeta Lipstick',
    ])
  })
})
