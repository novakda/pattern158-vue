import { describe, it, expect } from 'vitest'
import { paragraph } from './paragraph.js'
import { text } from './text.js'

describe('paragraph primitive', () => {
  it('wraps a string in a paragraph with a single text span', () => {
    expect(paragraph('hello world')).toEqual({
      kind: 'paragraph',
      children: [{ kind: 'text', value: 'hello world' }],
    })
  })

  it('accepts pre-built InlineSpan[]', () => {
    const children = [text('a'), text('b')]
    expect(paragraph(children)).toEqual({
      kind: 'paragraph',
      children,
    })
  })

  it('accepts empty string (single empty text span)', () => {
    expect(paragraph('')).toEqual({
      kind: 'paragraph',
      children: [{ kind: 'text', value: '' }],
    })
  })

  it('accepts empty InlineSpan[]', () => {
    expect(paragraph([])).toEqual({ kind: 'paragraph', children: [] })
  })

  it('does NOT split on newlines (extractor responsibility)', () => {
    expect(paragraph('line1\nline2')).toEqual({
      kind: 'paragraph',
      children: [{ kind: 'text', value: 'line1\nline2' }],
    })
  })
})
