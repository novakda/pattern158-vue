import { describe, it, expect } from 'vitest'
import { escapeTableCell } from './table-cell.js'

describe('escapeTableCell', () => {
  it('returns plain text unchanged', () => {
    expect(escapeTableCell('hello')).toBe('hello')
  })

  it('escapes pipe via delegated prose escape', () => {
    expect(escapeTableCell('a|b')).toBe('a\\|b')
  })

  it('inherits asterisk escaping from prose', () => {
    expect(escapeTableCell('a*b')).toBe('a\\*b')
  })

  it('replaces LF with <br>', () => {
    expect(escapeTableCell('line1\nline2')).toBe('line1<br>line2')
  })

  it('replaces CRLF with single <br> (not double)', () => {
    expect(escapeTableCell('line1\r\nline2')).toBe('line1<br>line2')
  })

  it('replaces multiple newlines with multiple <br>', () => {
    expect(escapeTableCell('a\n\nb')).toBe('a<br><br>b')
  })

  it('handles mixed pipe + newline + html entity', () => {
    expect(escapeTableCell('a & b|c\nd')).toBe('a &amp; b\\|c<br>d')
  })

  it('strips BOM via delegated prose escape', () => {
    expect(escapeTableCell('\uFEFFhello')).toBe('hello')
  })

  it('preserves NBSP via delegated prose escape', () => {
    const nbsp = '\u00A0'
    expect(escapeTableCell(`a${nbsp}b`)).toBe(`a${nbsp}b`)
  })

  it('delegates prose test cases: backslash + special chars', () => {
    expect(escapeTableCell('a\\b*c')).toBe('a\\\\b\\*c')
  })
})
