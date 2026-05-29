import type { ApiProduct, ApiProductColor, Product, ProductColor } from '../types/product'
import { normalizeImageUrl } from '../utils/imageUrl'

const PRODUCTS_URL =
  'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'

function normalizeHex(hex: string): string {
  return hex.replace(/^#/, '').trim()
}

function normalizeColors(raw: ApiProductColor[] | null): ProductColor[] {
  if (!raw) return []

  return raw
    .filter((color) => color.hex_value != null && color.hex_value.trim() !== '')
    .map((color) => {
      const hex = normalizeHex(color.hex_value!)
      const name = color.colour_name?.trim() ?? ''
      return {
        hex_value: hex,
        colour_name: name,
      }
    })
}

function normalizeProduct(raw: ApiProduct): Product {
  const parsedPrice =
    raw.price != null && raw.price !== ''
      ? parseFloat(raw.price)
      : null

  const price =
    parsedPrice != null && !Number.isNaN(parsedPrice) ? parsedPrice : null

  const imageUrl = normalizeImageUrl(
    raw.image_link?.trim() || raw.api_featured_image?.trim() || null,
  )

  return {
    id: raw.id,
    brand: raw.brand ?? '',
    name: raw.name ?? 'Unnamed product',
    price,
    imageUrl,
    productLink: raw.product_link?.trim() || null,
    websiteLink: raw.website_link?.trim() || null,
    description: raw.description?.trim() || null,
    rating: raw.rating ?? null,
    category: raw.category ?? null,
    productType: raw.product_type ?? null,
    colors: normalizeColors(raw.product_colors),
  }
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })

  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`)
  }

  const data = (await response.json()) as ApiProduct[]
  return data.map(normalizeProduct)
}
