import { describe, expect, it } from 'vitest'
import { getPageNumbers } from './pagination'

describe('getPageNumbers', () => {
  it('returns all pages when total is seven or fewer', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('includes ellipsis for long page ranges near the start', () => {
    expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, 'ellipsis', 10])
  })

  it('includes ellipsis for long page ranges near the end', () => {
    expect(getPageNumbers(9, 10)).toEqual([1, 'ellipsis', 8, 9, 10])
  })

  it('includes ellipsis on both sides in the middle', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })
})
