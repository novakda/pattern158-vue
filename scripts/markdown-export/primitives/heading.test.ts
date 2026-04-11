import { describe, it, expect } from 'vitest'
import { heading } from './heading.js'
import { text } from './text.js'

describe('heading primitive', () => {
  it('builds level-1 heading from a string', () => {
    expect(heading(1, 'Title')).toEqual({
      kind: 'heading',
      level: 1,
      children: [{ kind: 'text', value: 'Title' }],
    })
  })

  it('builds level-6 heading (max level)', () => {
    expect(heading(6, 'Sub')).toEqual({
      kind: 'heading',
      level: 6,
      children: [{ kind: 'text', value: 'Sub' }],
    })
  })

  it('accepts pre-built InlineSpan[] array (D-10 convenience)', () => {
    const children = [text('Foo'), text(' '), text('Bar')]
    expect(heading(2, children)).toEqual({
      kind: 'heading',
      level: 2,
      children,
    })
  })

  it('accepts composed spans with strong inline content', () => {
    const strong = {
      kind: 'strong' as const,
      children: [{ kind: 'text' as const, value: 'bold' }],
    }
    const result = heading(3, [strong])
    expect(result.children).toHaveLength(1)
    expect(result.children[0]?.kind).toBe('strong')
  })

  it('does NOT escape the string input', () => {
    expect(heading(2, 'a*b')).toEqual({
      kind: 'heading',
      level: 2,
      children: [{ kind: 'text', value: 'a*b' }],
    })
  })

  it('rejects out-of-range levels at compile time', () => {
    // @ts-expect-error — level 0 is not a HeadingLevel
    heading(0, 'Invalid')
    // @ts-expect-error — level 7 is not a HeadingLevel
    heading(7, 'Invalid')
  })
})
