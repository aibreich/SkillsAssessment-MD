import { describe, expect, it } from 'vitest'
import {
  formatColorLabel,
  isDisplayableColorFilterName,
} from './formatters'

describe('formatColorLabel', () => {
  it('normalizes messy API color names', () => {
    expect(formatColorLabel('ruby_red (123)')).toBe('Ruby Red')
  })

  it('returns empty string when digits are stripped leaving nothing useful', () => {
    expect(formatColorLabel('12345')).toBe('')
  })
})

describe('isDisplayableColorFilterName', () => {
  it('accepts short known color names', () => {
    expect(isDisplayableColorFilterName('nude')).toBe(true)
  })

  it('rejects hex-like names', () => {
    expect(isDisplayableColorFilterName('ff0000')).toBe(false)
  })
})
