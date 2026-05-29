export interface ApiProductColor {
  hex_value: string | null
  colour_name: string | null
}

export interface ProductColor {
  hex_value: string
  colour_name: string
}

export interface ApiProduct {
  id: number
  brand: string
  name: string
  price: string | null
  image_link: string | null
  api_featured_image: string | null
  product_link: string | null
  website_link: string | null
  description: string | null
  rating: number | null
  category: string | null
  product_type: string | null
  product_colors: ApiProductColor[] | null
}

export interface Product {
  id: number
  brand: string
  name: string
  price: number | null
  imageUrl: string | null
  productLink: string | null
  websiteLink: string | null
  description: string | null
  rating: number | null
  category: string | null
  productType: string | null
  colors: ProductColor[]
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc'

export interface FilterState {
  priceRanges: string[]
  productTypes: string[]
  ratings: string[]
  /** Canonical formatted color labels (see formatColorLabel) */
  colors: string[]
}

export const DEFAULT_FILTERS: FilterState = {
  priceRanges: [],
  productTypes: [],
  ratings: [],
  colors: [],
}

export const PRICE_RANGE_OPTIONS = [
  { id: 'under-5', label: 'Under $5', min: 0, max: 5 },
  { id: '5-10', label: '$5 – $10', min: 5, max: 10 },
  { id: '10-15', label: '$10 – $15', min: 10, max: 15 },
  { id: '15-plus', label: '$15+', min: 15, max: Infinity },
] as const

export const RATING_FILTER_OPTIONS = [
  { id: '4-plus', label: '4+ stars', min: 4 },
  { id: '3-plus', label: '3+ stars', min: 3 },
  { id: '2-plus', label: '2+ stars', min: 2 },
  { id: 'unrated', label: 'No rating', min: null },
] as const
