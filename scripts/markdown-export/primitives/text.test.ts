import { describe, it, expect } from 'vitest'
import { text } from './text.js'

describe('text primitive', () => {
  it('wraps a string in a TextSpan', () => {
    expect(text('hello')).toEqual({ kind: 'text', value: 'hello' })
  })

  it('accepts empty string', () => {
    expect(text('')).toEqual({ kind: 'text', value: '' })
  })

  it('does NOT escape markdown syntax characters (that is renderer work)', () => {
    expect(text('a*b_c')).toEqual({ kind: 'text', value: 'a*b_c' })
  })

  it('preserves unicode and NBSP verbatim', () => {
    const input = 'launch \u00A0 🚀'
    expect(text(input)).toEqual({ kind: 'text', value: input })
  })

  it('preserves HTML entities verbatim (renderer escapes them)', () => {
    expect(text('a & b')).toEqual({ kind: 'text', value: 'a & b' })
  })
})
