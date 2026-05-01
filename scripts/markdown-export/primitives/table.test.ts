import { describe, it, expect } from 'vitest'
import { table } from './table.js'
import { text } from './text.js'

describe('table primitive', () => {
  it('wraps string cells with text() sugar', () => {
    expect(
      table({
        headers: ['H1', 'H2'],
        rows: [
          ['a', 'b'],
          ['c', 'd'],
        ],
      }),
    ).toEqual({
      kind: 'table',
      headers: [[{ kind: 'text', value: 'H1' }], [{ kind: 'text', value: 'H2' }]],
      rows: [
        [[{ kind: 'text', value: 'a' }], [{ kind: 'text', value: 'b' }]],
        [[{ kind: 'text', value: 'c' }], [{ kind: 'text', value: 'd' }]],
      ],
    })
  })

  it('accepts fully-structured InlineSpan[][] headers and rows', () => {
    const result = table({
      headers: [[text('H')]],
      rows: [[[text('x')]]],
    })
    expect(result.headers).toEqual([[text('H')]])
    expect(result.rows).toEqual([[[text('x')]]])
  })

  it('accepts mixed string and InlineSpan[] cells in headers', () => {
    const result = table({
      headers: ['H1', [text('H2')]],
      rows: [['a', 'b']],
    })
    expect(result.headers[0]).toEqual([{ kind: 'text', value: 'H1' }])
    expect(result.headers[1]).toEqual([{ kind: 'text', value: 'H2' }])
  })

  it('accepts mixed string and InlineSpan[] cells in rows', () => {
    const result = table({
      headers: ['H'],
      rows: [['a'], [[text('b')]]],
    })
    expect(result.rows[0]).toEqual([[{ kind: 'text', value: 'a' }]])
    expect(result.rows[1]).toEqual([[{ kind: 'text', value: 'b' }]])
  })

  it('accepts empty rows (headers-only table)', () => {
    expect(table({ headers: ['H1'], rows: [] })).toEqual({
      kind: 'table',
      headers: [[{ kind: 'text', value: 'H1' }]],
      rows: [],
    })
  })

  it('accepts empty headers and empty rows', () => {
    expect(table({ headers: [], rows: [] })).toEqual({
      kind: 'table',
      headers: [],
      rows: [],
    })
  })

  it('does NOT escape pipes or other markdown chars', () => {
    const result = table({ headers: ['a|b'], rows: [['c*d']] })
    expect(result.headers[0]).toEqual([{ kind: 'text', value: 'a|b' }])
    expect(result.rows[0]?.[0]).toEqual([{ kind: 'text', value: 'c*d' }])
  })
})
