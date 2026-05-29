import type { SortOption } from '../types/product'
import { ChevronDownIcon } from './icons/Icons'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string; title?: string }[] = [
  {
    value: 'featured',
    label: 'Featured (Default)',
    title: 'Preserves the original catalog order',
  },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

export function SortSelect({ value, onChange }: SortSelectProps) {
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Featured'

  return (
    <label className="sort-select">
      <span className="sort-select__label">Sort:</span>
      <span className="sort-select__control">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label={`Sort products, currently ${currentLabel}`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} title={option.title}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="sort-select__chevron" />
      </span>
    </label>
  )
}
