import { describe, it, expect } from 'vitest'
import { wikilink, WIKILINK_HREF_PREFIX } from './wikilink.js'

describe('wikilink primitive', () => {
  it('exports WIKILINK_HREF_PREFIX as "wikilink://"', () => {
    expect(WIKILINK_HREF_PREFIX).toBe('wikilink://')
  })

  it('builds a wikilink with target-as-display-text when display omitted', () => {
    expect(wikilink('Exhibit A')).toEqual({
      kind: 'link',
      href: 'wikilink://Exhibit A',
      children: [{ kind: 'text', value: 'Exhibit A' }],
    })
  })

  it('builds a wikilink with custom display text', () => {
    expect(wikilink('Exhibit A', 'See Exhibit A')).toEqual({
      kind: 'link',
      href: 'wikilink://Exhibit A',
      children: [{ kind: 'text', value: 'See Exhibit A' }],
    })
  })

  it('uses the exported prefix constant (not a magic string)', () => {
    const result = wikilink('Target')
    expect(result.href.startsWith(WIKILINK_HREF_PREFIX)).toBe(true)
  })

  it('does NOT escape the target (escape happens at render time)', () => {
    // Target with characters that escapeWikilinkTarget WOULD escape.
    expect(wikilink('Has | pipe').href).toBe('wikilink://Has | pipe')
  })

  it('does NOT sanitize filesystem chars (renderer responsibility)', () => {
    expect(wikilink('path/with/slash').href).toBe('wikilink://path/with/slash')
  })
})
