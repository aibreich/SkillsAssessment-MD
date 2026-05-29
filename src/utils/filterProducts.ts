import type { FilterState, Product } from '../types/product'
import { PRICE_RANGE_OPTIONS, RATING_FILTER_OPTIONS } from '../types/product'
import { formatCategoryLabel, formatColorLabel, isDisplayableColorFilterName } from './formatters'

function matchesPriceRange(product: Product, rangeIds: string[]): boolean {
  if (rangeIds.length === 0) return true
  if (product.price == null) return false

  const price = product.price

  return rangeIds.some((id) => {
    const range = PRICE_RANGE_OPTIONS.find((r) => r.id === id)
    if (!range) return false
    return price >= range.min && price < range.max
  })
}

function matchesProductType(product: Product, types: string[]): boolean {
  if (types.length === 0) return true
  const type = product.productType ?? 'Other'
  return types.includes(type)
}

function matchesRating(product: Product, ratingIds: string[]): boolean {
  if (ratingIds.length === 0) return true

  return ratingIds.some((id) => {
    const option = RATING_FILTER_OPTIONS.find((r) => r.id === id)
    if (!option) return false

    if (option.min === null) {
      return product.rating == null
    }

    return product.rating != null && product.rating >= option.min
  })
}

function matchesColor(product: Product, colorLabels: string[]): boolean {
  if (colorLabels.length === 0) return true

  return product.colors.some((c) => {
    const rawName = c.colour_name.trim()
    if (!rawName || !isDisplayableColorFilterName(rawName)) return false
    return colorLabels.includes(formatColorLabel(rawName))
  })
}

export function filterProducts(
  products: Product[],
  filters: FilterState,
): Product[] {
  return products.filter(
    (product) =>
      matchesPriceRange(product, filters.priceRanges) &&
      matchesProductType(product, filters.productTypes) &&
      matchesRating(product, filters.ratings) &&
      matchesColor(product, filters.colors),
  )
}

export function getUniqueProductTypes(products: Product[]): string[] {
  const types = new Set<string>()
  for (const product of products) {
    types.add(product.productType ?? 'Other')
  }
  return Array.from(types).sort((a, b) => a.localeCompare(b))
}

export function getUniqueColors(
  products: Product[],
): { label: string; hex: string }[] {
  const colorMap = new Map<string, string>()

  for (const product of products) {
    for (const color of product.colors) {
      const rawName = color.colour_name.trim()
      if (!rawName || !isDisplayableColorFilterName(rawName)) continue

      const label = formatColorLabel(rawName)
      if (label && !colorMap.has(label)) {
        colorMap.set(label, color.hex_value.replace(/^#/, ''))
      }
    }
  }

  return Array.from(colorMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, hex]) => ({ label, hex }))
}

export interface ActiveFilterChip {
  group: keyof FilterState
  value: string
  label: string
}

export function getActiveFilterChips(filters: FilterState): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []

  for (const id of filters.priceRanges) {
    const option = PRICE_RANGE_OPTIONS.find((r) => r.id === id)
    chips.push({
      group: 'priceRanges',
      value: id,
      label: option?.label ?? id,
    })
  }

  for (const type of filters.productTypes) {
    chips.push({
      group: 'productTypes',
      value: type,
      label: formatCategoryLabel(type),
    })
  }

  for (const id of filters.ratings) {
    const option = RATING_FILTER_OPTIONS.find((r) => r.id === id)
    chips.push({
      group: 'ratings',
      value: id,
      label: option?.label ?? id,
    })
  }

  for (const colorLabel of filters.colors) {
    chips.push({
      group: 'colors',
      value: colorLabel,
      label: colorLabel,
    })
  }

  return chips
}
