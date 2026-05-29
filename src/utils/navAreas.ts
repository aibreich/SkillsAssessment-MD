import type { Product } from '../types/product'

export const NAV_AREAS = ['All', 'Face', 'Eyes', 'Lips', 'Nails'] as const
export type NavArea = (typeof NAV_AREAS)[number]

const PRODUCT_TYPE_TO_NAV_AREA: Record<string, Exclude<NavArea, 'All'>> = {
  blush: 'Face',
  bronzer: 'Face',
  foundation: 'Face',
  eyeliner: 'Eyes',
  eyeshadow: 'Eyes',
  mascara: 'Eyes',
  lip_liner: 'Lips',
  lipstick: 'Lips',
  nail_polish: 'Nails',
}

export function getProductNavArea(
  productType: string | null,
): Exclude<NavArea, 'All'> | null {
  if (!productType) return null
  return PRODUCT_TYPE_TO_NAV_AREA[productType] ?? null
}

export function filterProductsByArea(
  products: Product[],
  area: NavArea,
): Product[] {
  if (area === 'All') return products
  return products.filter(
    (product) => getProductNavArea(product.productType) === area,
  )
}

export function getNavAreaIntro(area: NavArea): {
  title: string
  subtitle: string
} {
  switch (area) {
    case 'All':
      return {
        title: 'All Products',
        subtitle: 'Browse the full Maybelline collection.',
      }
    case 'Face':
      return {
        title: 'Face Collection',
        subtitle: 'Flawless finishes for every skin type.',
      }
    case 'Eyes':
      return {
        title: 'Eyes Collection',
        subtitle: 'Bold looks from lashes to lids.',
      }
    case 'Lips':
      return {
        title: 'Lips Collection',
        subtitle: 'Statement shades and smooth finishes.',
      }
    case 'Nails':
      return {
        title: 'Nails Collection',
        subtitle: 'Polished color for every mood.',
      }
  }
}
