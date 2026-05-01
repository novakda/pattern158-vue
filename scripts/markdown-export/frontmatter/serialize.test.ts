import { describe, it, expect } from 'vitest'
import { serializeFrontmatter, FORBIDDEN_SINGULAR_KEYS } from './serialize.js'

describe('serializeFrontmatter', () => {
  it('emits only title when all other fields are empty/omitted', () => {
    const out = serializeFrontmatter({ title: 'Home' })
    expect(out).toBe('---\ntitle: "Home"\n---\n')
  })

  it('emits aliases in block style when provided', () => {
    const out = serializeFrontmatter({
      title: 'Home',
      aliases: ['Landing', 'Main'],
    })
    expect(out).toContain('aliases:\n  - Landing\n  - Main\n')
    expect(out).not.toContain('[Landing')
  })

  it('emits tags in block style when provided', () => {
    const out = serializeFrontmatter({
      title: 'Home',
      tags: ['page', 'home'],
    })
    expect(out).toContain('tags:\n  - page\n  - home\n')
    expect(out).not.toContain('[page')
  })

  it('enforces canonical key order: title -> aliases -> tags -> date -> cssclasses', () => {
    const out = serializeFrontmatter({
      cssclasses: ['wide'],
      tags: ['x'],
      date: '2026-04-10',
      title: 'T',
      aliases: ['A'],
    })
    const titleIdx = out.indexOf('title:')
    const aliasesIdx = out.indexOf('aliases:')
    const tagsIdx = out.indexOf('tags:')
    const dateIdx = out.indexOf('date:')
    const cssIdx = out.indexOf('cssclasses:')
    expect(titleIdx).toBeGreaterThanOrEqual(0)
    expect(aliasesIdx).toBeGreaterThan(titleIdx)
    expect(tagsIdx).toBeGreaterThan(aliasesIdx)
    expect(dateIdx).toBeGreaterThan(tagsIdx)
    expect(cssIdx).toBeGreaterThan(dateIdx)
  })

  it('omits aliases when empty array', () => {
    const out = serializeFrontmatter({ title: 'T', aliases: [] })
    expect(out).not.toContain('aliases:')
  })

  it('omits tags when empty array', () => {
    const out = serializeFrontmatter({ title: 'T', tags: [] })
    expect(out).not.toContain('tags:')
  })

  it('omits date when undefined', () => {
    const out = serializeFrontmatter({ title: 'T' })
    expect(out).not.toContain('date:')
  })

  it('includes date when provided', () => {
    const out = serializeFrontmatter({ title: 'T', date: '2026-04-10' })
    expect(out).toContain('date:')
    expect(out).toContain('2026-04-10')
  })

  it('omits cssclasses when empty array', () => {
    const out = serializeFrontmatter({ title: 'T', cssclasses: [] })
    expect(out).not.toContain('cssclasses:')
  })

  it('includes cssclasses in block style when provided', () => {
    const out = serializeFrontmatter({ title: 'T', cssclasses: ['wide', 'hero'] })
    expect(out).toContain('cssclasses:\n  - wide\n  - hero\n')
  })

  it('rejects forbidden singular key tag', () => {
    expect(() => serializeFrontmatter({ title: 'T', tag: 'x' } as never)).toThrow(/tag.*tags/)
  })

  it('rejects forbidden singular key alias', () => {
    expect(() => serializeFrontmatter({ title: 'T', alias: 'x' } as never)).toThrow(/alias.*aliases/)
  })

  it('rejects forbidden singular key cssclass', () => {
    expect(() => serializeFrontmatter({ title: 'T', cssclass: 'x' } as never)).toThrow(
      /cssclass.*cssclasses/,
    )
  })

  it('exports FORBIDDEN_SINGULAR_KEYS list', () => {
    expect(FORBIDDEN_SINGULAR_KEYS).toEqual(['tag', 'alias', 'cssclass'])
  })

  it('quotes wikilinks in title value so Obsidian parses them as strings', () => {
    const out = serializeFrontmatter({ title: '[[Pattern158]] Home' })
    expect(out).toContain('title: "[[Pattern158]] Home"')
    // Ensure the wikilink is not on its own unquoted line
    expect(out).not.toMatch(/^\[\[/m)
  })

  it('double-quotes numeric-looking title to prevent YAML type coercion', () => {
    const out = serializeFrontmatter({ title: '42' })
    expect(out).toContain('title: "42"')
  })

  it('double-quotes boolean-looking title', () => {
    const out = serializeFrontmatter({ title: 'true' })
    expect(out).toContain('title: "true"')
  })

  it('double-quotes null-looking title', () => {
    const out = serializeFrontmatter({ title: 'null' })
    expect(out).toContain('title: "null"')
  })

  it('is deterministic - same input returns byte-identical output', () => {
    const input = {
      title: 'Home',
      aliases: ['Landing'],
      tags: ['page', 'home'],
      date: '2026-04-10',
    }
    const a = serializeFrontmatter(input)
    const b = serializeFrontmatter(input)
    expect(a).toBe(b)
  })

  it('always starts with --- and ends with ---\\n', () => {
    const out = serializeFrontmatter({ title: 'T' })
    expect(out.startsWith('---\n')).toBe(true)
    expect(out.endsWith('---\n')).toBe(true)
  })

  it('uses LF line endings only (never CRLF)', () => {
    const out = serializeFrontmatter({ title: 'T', tags: ['a', 'b'] })
    expect(out).not.toContain('\r\n')
    expect(out).not.toContain('\r')
  })
})
