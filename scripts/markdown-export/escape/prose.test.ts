import { describe, it, expect } from 'vitest'
import { escapeProse } from './prose.js'

describe('escapeProse', () => {
  it('returns empty string unchanged', () => {
    expect(escapeProse('')).toBe('')
  })

  it('returns plain text unchanged', () => {
    expect(escapeProse('hello world')).toBe('hello world')
  })

  it('escapes asterisk', () => {
    expect(escapeProse('a*b')).toBe('a\\*b')
  })

  it('escapes underscore', () => {
    expect(escapeProse('a_b')).toBe('a\\_b')
  })

  it('escapes square brackets', () => {
    expect(escapeProse('a[b]c')).toBe('a\\[b\\]c')
  })

  it('escapes backtick', () => {
    expect(escapeProse('a`b')).toBe('a\\`b')
  })

  it('escapes angle brackets as markdown backslash (not HTML entities)', () => {
    expect(escapeProse('<tag>')).toBe('\\<tag\\>')
  })

  it('escapes hash', () => {
    expect(escapeProse('#heading')).toBe('\\#heading')
  })

  it('escapes bang', () => {
    expect(escapeProse('!image')).toBe('\\!image')
  })

  it('escapes pipe', () => {
    expect(escapeProse('a|b')).toBe('a\\|b')
  })

  it('escapes tilde', () => {
    expect(escapeProse('a~b')).toBe('a\\~b')
  })

  it('escapes backslash FIRST so later escapes do not double-escape', () => {
    expect(escapeProse('a\\b')).toBe('a\\\\b')
  })

  it('converts ampersand to HTML entity', () => {
    expect(escapeProse('a & b')).toBe('a &amp; b')
  })

  it('preserves NBSP (U+00A0) as-is', () => {
    const nbsp = '\u00A0'
    expect(escapeProse(`a${nbsp}b`)).toBe(`a${nbsp}b`)
  })

  it('strips BOM (U+FEFF)', () => {
    expect(escapeProse('\uFEFFhello')).toBe('hello')
  })

  it('strips multiple BOMs', () => {
    expect(escapeProse('\uFEFFdouble\uFEFFBOM\uFEFF')).toBe('doubleBOM')
  })

  it('handles unicode surrogate pairs', () => {
    // Rocket emoji U+1F680
    expect(escapeProse('launch 🚀')).toBe('launch 🚀')
  })

  it('handles combined special chars', () => {
    // Note: the ( and ) are NOT in the escape set per D-19; verify they pass through
    expect(escapeProse('`code` *bold* [link](x) #h')).toBe(
      '\\`code\\` \\*bold\\* \\[link\\](x) \\#h',
    )
  })
})
