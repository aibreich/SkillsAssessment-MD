import { useEffect, useRef, type ReactNode } from 'react'
import type { FilterState, Product } from '../types/product'
import {
  PRICE_RANGE_OPTIONS,
  RATING_FILTER_OPTIONS,
} from '../types/product'
import {
  getUniqueColors,
  getUniqueProductTypes,
} from '../utils/filterProducts'
import { formatCategoryLabel } from '../utils/formatters'
import { handleFocusTrap } from '../utils/focusTrap'
import { useBackgroundAriaHidden } from '../hooks/useBackgroundAriaHidden'
import { CloseIcon } from './icons/Icons'

interface FilterPanelProps {
  products: Product[]
  filters: FilterState
  onChange: (filters: FilterState) => void
  variant?: 'sidebar' | 'sheet'
  isOpen?: boolean
  onClose?: () => void
  onApply?: () => void
  resultCount?: number
  sortControl?: ReactNode
  itemsPerPageControl?: ReactNode
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value]
}

function getFilterSheetDoneLabel(count: number): string {
  if (count === 0) return 'Done'
  return `Done (${count} ${count === 1 ? 'product' : 'products'})`
}

export function FilterPanel({
  products,
  filters,
  onChange,
  variant = 'sidebar',
  isOpen = false,
  onClose,
  onApply,
  resultCount = 0,
  sortControl,
  itemsPerPageControl,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const productTypes = getUniqueProductTypes(products)
  const colors = getUniqueColors(products)

  useBackgroundAriaHidden(variant === 'sheet' && isOpen)

  const update = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch })
  }

  const handleApply = () => {
    onApply?.()
    onClose?.()
  }

  useEffect(() => {
    if (variant !== 'sheet' || !isOpen) return

    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
        return
      }

      if (panelRef.current) {
        handleFocusTrap(event, panelRef.current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [variant, isOpen, onClose])

  const panelContent = (
    <>
      <div className="filter-panel__header">
        <div>
          <h2
            {...(variant === 'sheet' ? { id: 'filter-panel-title' } : {})}
            className="filter-panel__title"
          >
            Filters
          </h2>
          <p className="filter-panel__subtitle">Refine your selection</p>
        </div>
        {variant === 'sheet' && (
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-btn filter-panel__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {variant === 'sheet' && (sortControl || itemsPerPageControl) && (
        <div className="filter-panel__controls-mobile">
          {sortControl}
          {itemsPerPageControl}
        </div>
      )}

      <fieldset className="filter-group">
        <legend>Categories</legend>
        <ul className="filter-list">
          {productTypes.map((type) => (
            <li key={type}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.productTypes.includes(type)}
                  onChange={() =>
                    update({
                      productTypes: toggleValue(filters.productTypes, type),
                    })
                  }
                />
                <span className="filter-checkbox__box" aria-hidden="true" />
                <span>{formatCategoryLabel(type)}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price Range</legend>
        <ul className="filter-list">
          {PRICE_RANGE_OPTIONS.map((option) => (
            <li key={option.id}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(option.id)}
                  onChange={() =>
                    update({
                      priceRanges: toggleValue(filters.priceRanges, option.id),
                    })
                  }
                />
                <span className="filter-checkbox__box" aria-hidden="true" />
                <span>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Rating</legend>
        <ul className="filter-list">
          {RATING_FILTER_OPTIONS.map((option) => (
            <li key={option.id}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(option.id)}
                  onChange={() =>
                    update({
                      ratings: toggleValue(filters.ratings, option.id),
                    })
                  }
                />
                <span className="filter-checkbox__box" aria-hidden="true" />
                <span className="filter-checkbox__rating">
                  {option.id !== 'unrated' ? (
                    <>
                      <RatingStars count={option.min ?? 0} />
                      <span className="visually-hidden">{option.label}</span>
                    </>
                  ) : (
                    option.label
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {colors.length > 0 && (
        <fieldset className="filter-group">
          <legend>Product colors</legend>
          <ul className="filter-list filter-list--colors">
            {colors.map((color) => (
              <li key={color.label}>
                <label className="filter-checkbox filter-checkbox--color">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.label)}
                    onChange={() =>
                      update({
                        colors: toggleValue(filters.colors, color.label),
                      })
                    }
                  />
                  <span className="filter-checkbox__box" aria-hidden="true" />
                  <span
                    className="filter-color-swatch"
                    style={{ backgroundColor: `#${color.hex}` }}
                    aria-hidden="true"
                  />
                  <span>{color.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {variant === 'sheet' && (
        <button
          type="button"
          className="btn btn--primary btn--full filter-panel__apply"
          onClick={handleApply}
        >
          {getFilterSheetDoneLabel(resultCount)}
        </button>
      )}
    </>
  )

  if (variant === 'sheet') {
    return (
      <>
        <div
          className={`filter-sheet-backdrop${isOpen ? ' filter-sheet-backdrop--open' : ''}`}
          onClick={onClose}
          role="presentation"
          aria-hidden={!isOpen}
        />
        <div
          ref={panelRef}
          className={`filter-panel filter-panel--sheet${isOpen ? ' filter-panel--sheet-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-panel-title"
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          {panelContent}
        </div>
      </>
    )
  }

  return (
    <aside className="filter-panel filter-panel--sidebar" aria-label="Product filters">
      {panelContent}
    </aside>
  )
}

function RatingStars({ count }: { count: number }) {
  return (
    <span className="filter-rating-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < count ? 'filter-rating-stars__star filter-rating-stars__star--filled' : 'filter-rating-stars__star'}
        >
          ★
        </span>
      ))}
    </span>
  )
}
