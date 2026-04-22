// scripts/tiddlywiki/generate.test.ts
// Phase 58 Plan 01 — TZK-01 tests for withPublicTag transform.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: inline object-literal fixtures only.

import { describe, expect, it } from 'vitest'

import { withPublicTag } from './generate.ts'
import type { Tiddler } from './tid-writer.ts'

const BASE: Tiddler = {
  title: 'Sample',
  type: 'text/vnd.tiddlywiki',
  tags: [],
  fields: { created: '20260421000000000', modified: '20260421000000000' },
  text: 'hello',
}

describe('withPublicTag — TZK-01 default-public tag transform', () => {
  it('prepends "public" when tiddler has no public/private tag', () => {
    const input: Tiddler = { ...BASE, tags: ['page', 'home'] }
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['public', 'page', 'home'])
  })

  it('prepends "public" to an empty tag list', () => {
    const input: Tiddler = { ...BASE, tags: [] }
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['public'])
  })

  it('leaves tags alone when "public" is already present', () => {
    const input: Tiddler = { ...BASE, tags: ['public', 'exhibit'] }
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['public', 'exhibit'])
    // Idempotent reference contract — same object returned when no-op path.
    expect(out).toBe(input)
  })

  it('leaves tags alone when "private" is present (does NOT add "public")', () => {
    const input: Tiddler = { ...BASE, tags: ['private', 'draft'] }
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['private', 'draft'])
    expect(out.tags).not.toContain('public')
    expect(out).toBe(input)
  })

  it('respects private even when public is also present (private wins, unchanged)', () => {
    const input: Tiddler = { ...BASE, tags: ['public', 'private'] }
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['public', 'private'])
    expect(out).toBe(input)
  })

  it('does not mutate the input tiddler when prepending', () => {
    const input: Tiddler = { ...BASE, tags: ['exhibit'] }
    const originalTags = input.tags
    const out = withPublicTag(input)
    // Input must remain untouched — readonly/frozen-safe contract.
    expect(input.tags).toEqual(['exhibit'])
    expect(input.tags).toBe(originalTags)
    // Output is a fresh object with a fresh tags array.
    expect(out).not.toBe(input)
    expect(out.tags).not.toBe(input.tags)
  })

  it('is idempotent — withPublicTag(withPublicTag(t)) equals withPublicTag(t)', () => {
    const input: Tiddler = { ...BASE, tags: ['faq'] }
    const once = withPublicTag(input)
    const twice = withPublicTag(once)
    expect(twice.tags).toEqual(once.tags)
    expect(twice.tags).toEqual(['public', 'faq'])
  })

  it('preserves title, type, fields, and text unchanged', () => {
    const input: Tiddler = {
      title: 'Exhibit A',
      type: 'text/vnd.tiddlywiki',
      tags: ['exhibit', 'Acme'],
      fields: {
        created: '20260421000000000',
        modified: '20260421000000000',
        label: 'A',
      },
      text: 'body content',
    }
    const out = withPublicTag(input)
    expect(out.title).toBe(input.title)
    expect(out.type).toBe(input.type)
    expect(out.fields).toBe(input.fields)
    expect(out.text).toBe(input.text)
    expect(out.tags).toEqual(['public', 'exhibit', 'Acme'])
  })

  it('works on a frozen tag array (readonly contract)', () => {
    const frozenTags = Object.freeze(['exhibit'])
    const input: Tiddler = { ...BASE, tags: frozenTags }
    // Must not throw — must not mutate input.tags in place.
    const out = withPublicTag(input)
    expect(out.tags).toEqual(['public', 'exhibit'])
    expect(input.tags).toBe(frozenTags)
  })
})
