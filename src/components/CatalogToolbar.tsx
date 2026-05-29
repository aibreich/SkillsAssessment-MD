import type { FilterState, SortOption } from '../types/product'
import {
  getActiveFilterChips,
  type ActiveFilterChip,
} from '../utils/filterProducts'
import { formatProductRange } from '../utils/productRange'
import { ItemsPerPageSelect } from './ItemsPerPageSelect'
import { SlidersIcon } from './icons/Icons'
import { SortSelect } from './SortSelect'

interface CatalogToolbarProps {
  rangeStart: number
  rangeEnd: number
  resultCount: number
  filters: FilterState
  sort: SortOption
  itemsPerPage: number
  onRemoveFilter: (group: keyof FilterState, value: string) => void
  onClearAll: () => void
  onSortChange: (value: SortOption) => void
  onItemsPerPageChange: (count: number) => void
  onOpenMobileFilters?: (trigger: HTMLButtonElement) => void
}

function getFilterButtonLabel(activeFilterCount: number): string {
  if (activeFilterCount === 0) return 'Filter & Sort'
  return `Filter & Sort (${activeFilterCount})`
}

function getFilterButtonAriaLabel(activeFilterCount: number): string {
  if (activeFilterCount === 0) return 'Open filters and sort'
  return `Open filters and sort, ${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'}`
}

export function CatalogToolbar({
  rangeStart,
  rangeEnd,
  resultCount,
  filters,
  sort,
  itemsPerPage,
  onRemoveFilter,
  onClearAll,
  onSortChange,
  onItemsPerPageChange,
  onOpenMobileFilters,
}: CatalogToolbarProps) {
  const chips = getActiveFilterChips(filters)
  const hasActiveFilters = chips.length > 0
  const activeFilterCount = chips.length
  const rangeLabel = formatProductRange(rangeStart, rangeEnd, resultCount)
  const filterButtonLabel = getFilterButtonLabel(activeFilterCount)
  const filterButtonAriaLabel = getFilterButtonAriaLabel(activeFilterCount)

  return (
    <div className="catalog-toolbar">
      <div className="catalog-toolbar__mobile">
        <button
          type="button"
          className="catalog-toolbar__filter-btn"
          onClick={(event) => onOpenMobileFilters?.(event.currentTarget)}
          aria-label={filterButtonAriaLabel}
        >
          <SlidersIcon />
          {filterButtonLabel}
        </button>
        <span className="catalog-toolbar__mobile-count" aria-hidden="true">
          {rangeLabel}
        </span>
      </div>

      {hasActiveFilters && (
        <div
          className="catalog-toolbar__mobile-chips"
          aria-label="Active filters"
        >
          <FilterChipList
            chips={chips}
            onRemoveFilter={onRemoveFilter}
            onClearAll={onClearAll}
          />
        </div>
      )}

      <div className="catalog-toolbar__desktop">
        <div className="catalog-toolbar__left">
          {onOpenMobileFilters && (
            <button
              type="button"
              className="catalog-toolbar__filter-btn catalog-toolbar__filter-btn--tablet"
              onClick={(event) => onOpenMobileFilters?.(event.currentTarget)}
              aria-label={filterButtonAriaLabel}
            >
              <SlidersIcon />
              {filterButtonLabel}
            </button>
          )}
          <p className="catalog-toolbar__count" aria-hidden="true">
            {rangeLabel}
          </p>
          {hasActiveFilters && (
            <div className="catalog-toolbar__chips" aria-label="Active filters">
              <FilterChipList
                chips={chips}
                onRemoveFilter={onRemoveFilter}
                onClearAll={onClearAll}
              />
            </div>
          )}
        </div>

        <div className="catalog-toolbar__right">
          <SortSelect value={sort} onChange={onSortChange} />
          <ItemsPerPageSelect
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  )
}

function FilterChipList({
  chips,
  onRemoveFilter,
  onClearAll,
}: {
  chips: ActiveFilterChip[]
  onRemoveFilter: (group: keyof FilterState, value: string) => void
  onClearAll: () => void
}) {
  return (
    <>
      <ul className="filter-chips-list">
        {chips.map((chip) => (
          <li key={`${chip.group}-${chip.value}`}>
            <button
              type="button"
              className="filter-chip"
              onClick={() => onRemoveFilter(chip.group, chip.value)}
              aria-label={`Remove filter: ${chip.label}`}
            >
              {chip.label}
              <CloseChipIcon />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="catalog-toolbar__clear"
        onClick={onClearAll}
      >
        Clear All
      </button>
    </>
  )
}

function CloseChipIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
