import { describe, it, expect } from 'vitest'
import { link } from './link.js'
import { text } from './text.js'

describe('link primitive', () => {
  it('builds a link with string display text', () => {
    expect(link('/foo', 'Foo')).toEqual({
      kind: 'link',
      href: '/foo',
      children: [{ kind: 'text', value: 'Foo' }],
    })
  })

  it('accepts anchor hrefs', () => {
    expect(link('#section-1', 'Jump')).toEqual({
      kind: 'link',
      href: '#section-1',
      children: [{ kind: 'text', value: 'Jump' }],
    })
  })

  it('accepts absolute URLs', () => {
    expect(link('https://example.com', 'Ext').href).toBe('https://example.com')
  })

  it('accepts pre-built InlineSpan[] children', () => {
    const children = [text('a'), text('b')]
    expect(link('/x', children)).toEqual({
      kind: 'link',
      href: '/x',
      children,
    })
  })

  it('does NOT validate or escape the href', () => {
    expect(link('not a url', 'label').href).toBe('not a url')
  })
})
