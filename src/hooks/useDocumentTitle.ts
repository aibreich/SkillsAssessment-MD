import { useEffect } from 'react'

const DEFAULT_TITLE = 'Maybelline Product Catalog'

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}

export function getCatalogDocumentTitle(area: string): string {
  const areaTitle = area === 'All' ? 'All Products' : `${area} Products`
  return `${areaTitle} | ${DEFAULT_TITLE}`
}

export { DEFAULT_TITLE }
