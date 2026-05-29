export function formatPrice(price: number | null): string {
  if (price == null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatRatingLabel(rating: number | null): string {
  if (rating == null) return 'No rating'
  return `${rating.toFixed(1)} / 5`
}

export function formatRatingCompact(rating: number | null): string {
  if (rating == null) return ''
  return rating.toFixed(1)
}

export function formatRatingModal(rating: number | null): string {
  if (rating == null) return 'No rating'
  return `${rating.toFixed(1)} rating`
}

export function formatCategoryLabel(value: string): string {
  return value
    .trim()
    .replace(/_/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getProductTypeLabel(productType: string | null): string {
  if (!productType) return 'Other'
  return formatCategoryLabel(productType)
}

const SHORT_COLOR_NAMES = new Set([
  'Nude',
  'Plum',
  'Onyx',
  'Pink',
  'Gold',
  'Rose',
  'Mauve',
  'Sand',
  'Pear',
  'Coral',
  'Wine',
  'Snow',
  'Ruby',
  'Mint',
  'Teal',
  'Blue',
  'Bare',
  'Java',
  'Dawn',
  'Dusk',
])

function isHexLikeName(value: string): boolean {
  return /^#?[0-9A-Fa-f]{3,8}$/.test(value.trim())
}

export function isDisplayableColorFilterName(rawName: string): boolean {
  const trimmed = rawName.trim()
  if (!trimmed || isHexLikeName(trimmed)) return false

  const label = formatColorLabel(trimmed)
  if (!label) return false
  if (SHORT_COLOR_NAMES.has(label)) return true
  if (label.length < 3) return false

  const words = label.split(/\s+/)
  return words.some((word) => word.length >= 3)
}

export function formatColorLabel(value: string): string {
  const cleaned = value
    .trim()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/#/g, '')
    .replace(/[_,]/g, ' ')
    .replace(/\d/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return ''

  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
