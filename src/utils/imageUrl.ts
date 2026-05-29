export function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  if (trimmed.startsWith('http://')) return trimmed.replace(/^http:\/\//i, 'https://')
  return trimmed
}
