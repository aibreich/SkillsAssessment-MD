import type { Product, SortOption } from '../types/product'

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    case 'rating-desc':
      return sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      return sorted
  }
}
