import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons'
import { getPageNumbers } from '../utils/pagination'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationControlsProps) {
  if (totalItems === 0 || totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav className="pagination" aria-label="Product pagination">
      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__arrow"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        <p className="pagination__page-status" aria-live="polite" aria-atomic="true">
          Page {currentPage} of {totalPages}
        </p>

        <ul className="pagination__pages" aria-label="Page numbers">
          {pages.map((page, index) => (
            <li key={`${page}-${index}`}>
              {page === 'ellipsis' ? (
                <span className="pagination__ellipsis" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  className={`pagination__page${currentPage === page ? ' pagination__page--active' : ''}`}
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="pagination__arrow"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </nav>
  )
}
