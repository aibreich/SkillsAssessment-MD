export function getProductRange(
  total: number,
  currentPage: number,
  itemsPerPage: number,
): { start: number; end: number } {
  if (total === 0) return { start: 0, end: 0 }
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, total)
  return { start, end }
}

export function formatProductRange(
  start: number,
  end: number,
  total: number,
): string {
  if (total === 0) return 'Showing 0 products'
  if (start === end) return `Showing ${start} of ${total} products`
  return `Showing ${start}–${end} of ${total} products`
}
