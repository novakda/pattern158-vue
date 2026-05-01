import { describe, it, expect } from 'vitest'
import { escapeWikilinkTarget } from './wikilink.js'

describe('escapeWikilinkTarget', () => {
  it('returns empty string unchanged', () => {
    expect(escapeWikilinkTarget('')).toBe('')
  })

  it('returns simple target unchanged', () => {
    expect(escapeWikilinkTarget('Simple Page')).toBe('Simple Page')
  })

  it('returns exhibit-style name unchanged', () => {
    expect(escapeWikilinkTarget('Exhibit A')).toBe('Exhibit A')
  })

  it('escapes pipe', () => {
    expect(escapeWikilinkTarget('Has | pipe')).toBe('Has \\| pipe')
  })

  it('escapes square brackets', () => {
    expect(escapeWikilinkTarget('Has [bracket]')).toBe('Has \\[bracket\\]')
  })

  it('escapes hash', () => {
    expect(escapeWikilinkTarget('Has #hash')).toBe('Has \\#hash')
  })

  it('escapes caret (block reference syntax)', () => {
    expect(escapeWikilinkTarget('Has ^caret')).toBe('Has \\^caret')
  })

  it('sanitizes filesystem slash to dash', () => {
    expect(escapeWikilinkTarget('path/subpath')).toBe('path-subpath')
  })

  it('sanitizes filesystem backslash to dash (dominates markdown escape)', () => {
    expect(escapeWikilinkTarget('back\\slash')).toBe('back-slash')
  })

  it('sanitizes colon', () => {
    expect(escapeWikilinkTarget('colon:name')).toBe('colon-name')
  })

  it('sanitizes star', () => {
    expect(escapeWikilinkTarget('star*name')).toBe('star-name')
  })

  it('sanitizes question mark', () => {
    expect(escapeWikilinkTarget('question?name')).toBe('question-name')
  })

  it('sanitizes double quote', () => {
    expect(escapeWikilinkTarget('quote"name')).toBe('quote-name')
  })

  it('sanitizes angle brackets', () => {
    expect(escapeWikilinkTarget('lt<name>gt')).toBe('lt-name-gt')
  })

  it('does NOT escape ampersand (not in wikilink set)', () => {
    expect(escapeWikilinkTarget('Hello&World')).toBe('Hello&World')
  })

  it('handles realistic exhibit filename scenario (colon and space)', () => {
    expect(escapeWikilinkTarget('Exhibit A: Short Title')).toBe('Exhibit A- Short Title')
  })

  it('does not touch asterisks in markdown-semantic sense (stars sanitize to dash first)', () => {
    // '*' is filesystem-reserved and becomes '-' before any markdown-escape pass
    expect(escapeWikilinkTarget('a*b')).toBe('a-b')
  })
})
