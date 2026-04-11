import { describe, it, expect } from 'vitest'
import { blockquote } from './blockquote.js'
import { paragraph } from './paragraph.js'

describe('blockquote primitive', () => {
  it('wraps a string in a single paragraph child', () => {
    expect(blockquote('Quoted text')).toEqual({
      kind: 'blockquote',
      children: [paragraph('Quoted text')],
    })
  })

  it('accepts pre-built DocNode[] unchanged', () => {
    const children = [paragraph('a'), paragraph('b')]
    expect(blockquote(children)).toEqual({
      kind: 'blockquote',
      children,
    })
  })

  it('accepts empty DocNode[]', () => {
    expect(blockquote([])).toEqual({ kind: 'blockquote', children: [] })
  })

  it('accepts hr and other block nodes as children', () => {
    const children = [{ kind: 'hr' as const }, paragraph('after')]
    expect(blockquote(children)).toEqual({
      kind: 'blockquote',
      children,
    })
  })

  it('does NOT re-wrap a DocNode[] argument in an extra paragraph', () => {
    const result = blockquote([paragraph('x')])
    expect(result.children).toHaveLength(1)
    expect(result.children[0]?.kind).toBe('paragraph')
  })

  it('does NOT escape the string content', () => {
    expect(blockquote('a*b')).toEqual({
      kind: 'blockquote',
      children: [paragraph('a*b')],
    })
  })
})
