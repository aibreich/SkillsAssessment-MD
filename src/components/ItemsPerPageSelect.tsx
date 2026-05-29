import { ChevronDownIcon } from './icons/Icons'

export const PER_PAGE_OPTIONS = [24, 48] as const
export type ItemsPerPage = (typeof PER_PAGE_OPTIONS)[number]

interface ItemsPerPageSelectProps {
  value: number
  onChange: (value: number) => void
}

export function ItemsPerPageSelect({ value, onChange }: ItemsPerPageSelectProps) {
  return (
    <label className="sort-select items-per-page-select">
      <span className="sort-select__label">Show:</span>
      <span className="sort-select__control">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`Items per page, currently ${value}`}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="sort-select__chevron" />
      </span>
    </label>
  )
}
