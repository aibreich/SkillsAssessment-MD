import type { Product } from '../types/product'
import type { NavArea } from '../utils/navAreas'
import { EmptyState, type EmptyStateReason } from './EmptyState'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  hasActiveFilters: boolean
  activeArea: NavArea
  onViewMore: (product: Product, trigger: HTMLButtonElement) => void
  onClearFilters: () => void
  onBrowseAll: () => void
}

function getEmptyReason(
  hasActiveFilters: boolean,
  activeArea: NavArea,
): EmptyStateReason {
  if (hasActiveFilters) return 'filters'
  if (activeArea !== 'All') return 'category'
  return 'catalog'
}

export function ProductGrid({
  products,
  hasActiveFilters,
  activeArea,
  onViewMore,
  onClearFilters,
  onBrowseAll,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        reason={getEmptyReason(hasActiveFilters, activeArea)}
        activeArea={activeArea}
        onClearFilters={onClearFilters}
        onBrowseAll={onBrowseAll}
      />
    )
  }

  return (
    <ul className="product-grid">
      {products.map((product, index) => (
        <li key={product.id} className="product-grid__item">
          <ProductCard
            product={product}
            onViewMore={onViewMore}
            priorityImage={index < 3}
          />
        </li>
      ))}
    </ul>
  )
}
