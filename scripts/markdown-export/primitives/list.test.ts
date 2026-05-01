import { describe, it, expect } from 'vitest'
import { list } from './list.js'
import { paragraph } from './paragraph.js'

describe('list primitive', () => {
  it('array sugar produces unordered list of paragraph-wrapped strings', () => {
    expect(list(['a', 'b', 'c'])).toEqual({
      kind: 'list',
      ordered: false,
      items: [
        { children: [paragraph('a')] },
        { children: [paragraph('b')] },
        { children: [paragraph('c')] },
      ],
    })
  })

  it('object form with string items matches array form', () => {
    const a = list(['a', 'b'])
    const b = list({ ordered: false, items: ['a', 'b'] })
    expect(a).toEqual(b)
  })

  it('object form with ordered:true produces ordered list', () => {
    const result = list({ ordered: true, items: ['x', 'y'] })
    expect(result.ordered).toBe(true)
    expect(result.items).toHaveLength(2)
    expect(result.items[0]).toEqual({ children: [paragraph('x')] })
    expect(result.items[1]).toEqual({ children: [paragraph('y')] })
  })

  it('accepts fully-structured ListItem[]', () => {
    const structured = [{ children: [paragraph('x')] }]
    expect(list({ ordered: false, items: structured })).toEqual({
      kind: 'list',
      ordered: false,
      items: structured,
    })
  })

  it('accepts mixed string and ListItem items', () => {
    const result = list({
      ordered: false,
      items: ['a', { children: [paragraph('b')] }],
    })
    expect(result.items).toHaveLength(2)
    expect(result.items[0]).toEqual({ children: [paragraph('a')] })
    expect(result.items[1]).toEqual({ children: [paragraph('b')] })
  })

  it('accepts empty array', () => {
    expect(list([])).toEqual({ kind: 'list', ordered: false, items: [] })
  })

  it('accepts empty object form', () => {
    expect(list({ ordered: true, items: [] })).toEqual({
      kind: 'list',
      ordered: true,
      items: [],
    })
  })

  it('does NOT escape item text', () => {
    const result = list(['a*b'])
    expect(result.items[0]).toEqual({ children: [paragraph('a*b')] })
  })
})
