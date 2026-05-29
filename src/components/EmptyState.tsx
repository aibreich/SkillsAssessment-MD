import { SearchIcon } from './icons/Icons'
import type { NavArea } from '../utils/navAreas'

export type EmptyStateReason = 'filters' | 'category' | 'catalog'

interface EmptyStateProps {
  reason: EmptyStateReason
  activeArea?: NavArea
  onClearFilters: () => void
  onBrowseAll?: () => void
}

function getEmptyStateContent(
  reason: EmptyStateReason,
  activeArea: NavArea,
): { title: string; message: string } {
  switch (reason) {
    case 'filters':
      return {
        title: 'No products found',
        message:
          'Try adjusting your filters to find what you\u2019re looking for.',
      }
    case 'category':
      return {
        title: 'No products in this collection',
        message:
          activeArea === 'All'
            ? 'There aren\u2019t any products in this collection right now.'
            : `There aren\u2019t any ${activeArea.toLowerCase()} products right now. Browse the full catalog instead.`,
      }
    case 'catalog':
      return {
        title: 'No products available',
        message: 'The catalog is empty. Please try again later.',
      }
  }
}

export function EmptyState({
  reason,
  activeArea = 'All',
  onClearFilters,
  onBrowseAll,
}: EmptyStateProps) {
  const { title, message } = getEmptyStateContent(reason, activeArea)

  return (
    <div className="empty-state" role="status">
      <div className="empty-state__skeletons" aria-hidden="true">
        <div className="empty-state__skeleton" />
        <div className="empty-state__skeleton" />
        <div className="empty-state__skeleton" />
      </div>
      <div className="empty-state__content">
        <div className="empty-state__icon-wrap">
          <SearchIcon size={28} />
        </div>
        <h2 className="empty-state__title">{title}</h2>
        <p className="empty-state__message">{message}</p>
        {reason === 'filters' && (
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={onClearFilters}
          >
            Clear All Filters
          </button>
        )}
        {reason === 'category' && onBrowseAll && (
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={onBrowseAll}
          >
            Browse All Products
          </button>
        )}
      </div>
    </div>
  )
}
