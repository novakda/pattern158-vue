import { describe, it, expect } from 'vitest'
import { caption } from './caption.js'

describe('caption primitive', () => {
  it('wraps text in a paragraph > emphasis > text structure', () => {
    expect(caption('Alt text for image')).toEqual({
      kind: 'paragraph',
      children: [
        {
          kind: 'emphasis',
          children: [{ kind: 'text', value: 'Alt text for image' }],
        },
      ],
    })
  })

  it('accepts empty string', () => {
    expect(caption('')).toEqual({
      kind: 'paragraph',
      children: [
        {
          kind: 'emphasis',
          children: [{ kind: 'text', value: '' }],
        },
      ],
    })
  })

  it('does NOT escape markdown syntax characters', () => {
    const result = caption('a*b_c')
    expect(result.children[0]).toEqual({
      kind: 'emphasis',
      children: [{ kind: 'text', value: 'a*b_c' }],
    })
  })

  it('produces a paragraph (not a standalone emphasis span) so it is block-level', () => {
    const result = caption('x')
    expect(result.kind).toBe('paragraph')
  })
})
