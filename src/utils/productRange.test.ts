import { describe, expect, it } from 'vitest'
import {
  formatProductRange,
  getProductRange,
} from './productRange'

describe('getProductRange', () => {
  it('returns zero range when there are no products', () => {
    expect(getProductRange(0, 1, 24)).toEqual({ start: 0, end: 0 })
  })

  it('calculates the visible range for a page', () => {
    expect(getProductRange(50, 2, 24)).toEqual({ start: 25, end: 48 })
  })

  it('caps the end at the total on the last page', () => {
    expect(getProductRange(50, 3, 24)).toEqual({ start: 49, end: 50 })
  })
})

describe('formatProductRange', () => {
  it('formats empty results', () => {
    expect(formatProductRange(0, 0, 0)).toBe('Showing 0 products')
  })

  it('formats a single visible product', () => {
    expect(formatProductRange(1, 1, 1)).toBe('Showing 1 of 1 products')
  })

  it('formats a multi-product range', () => {
    expect(formatProductRange(1, 24, 50)).toBe('Showing 1–24 of 50 products')
  })
})
