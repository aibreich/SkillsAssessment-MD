import type { Product } from '../types/product'

export function isBestseller(product: Product): boolean {
  return product.rating != null && product.rating >= 4.5
}
