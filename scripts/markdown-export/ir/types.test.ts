// scripts/markdown-export/ir/types.test.ts
import { describe, it, expect } from 'vitest'
import type {
  InlineSpan,
  TextSpan,
  StrongSpan,
  EmphasisSpan,
  CodeSpan,
  LinkSpan,
  ImageSpan,
  DocNode,
  HeadingNode,
  ParagraphNode,
  ListNode,
  TableNode,
  BlockquoteNode,
  HRNode,
  PageDoc,
  HeadingLevel,
} from './types.js'
import { assertNever } from './types.js'

describe('InlineSpan', () => {
  it('accepts text span', () => {
    const s: TextSpan = { kind: 'text', value: 'hello' }
    expect(s.kind).toBe('text')
  })

  it('accepts strong with nested children', () => {
    const s: StrongSpan = { kind: 'strong', children: [{ kind: 'text', value: 'bold' }] }
    expect(s.children).toHaveLength(1)
  })

  it('accepts emphasis with nested children', () => {
    const s: EmphasisSpan = { kind: 'emphasis', children: [{ kind: 'text', value: 'italic' }] }
    expect(s.children).toHaveLength(1)
  })

  it('accepts code with flat value (no children)', () => {
    const s: CodeSpan = { kind: 'code', value: 'x()' }
    expect(s.value).toBe('x()')
  })

  it('accepts link with href and children', () => {
    const s: LinkSpan = {
      kind: 'link',
      href: '/foo',
      children: [{ kind: 'text', value: 'Foo' }],
    }
    expect(s.href).toBe('/foo')
  })

  it('accepts image with src and alt (no children)', () => {
    const s: ImageSpan = { kind: 'image', src: '/img.png', alt: 'caption' }
    expect(s.alt).toBe('caption')
  })

  it('narrows exhaustively via assertNever', () => {
    function render(span: InlineSpan): string {
      switch (span.kind) {
        case 'text':
          return span.value
        case 'strong':
          return span.children.map(render).join('')
        case 'emphasis':
          return span.children.map(render).join('')
        case 'code':
          return span.value
        case 'link':
          return span.children.map(render).join('')
        case 'image':
          return span.alt
        default:
          return assertNever(span)
      }
    }
    expect(render({ kind: 'text', value: 'hi' })).toBe('hi')
  })
})

describe('DocNode', () => {
  it('accepts heading with valid level and inline children', () => {
    const level: HeadingLevel = 2
    const n: HeadingNode = {
      kind: 'heading',
      level,
      children: [{ kind: 'text', value: 'Title' }],
    }
    expect(n.level).toBe(2)
  })

  it('accepts paragraph with inline children', () => {
    const n: ParagraphNode = { kind: 'paragraph', children: [{ kind: 'text', value: 'Body' }] }
    expect(n.children).toHaveLength(1)
  })

  it('accepts unordered list of items wrapping DocNodes', () => {
    const n: ListNode = {
      kind: 'list',
      ordered: false,
      items: [{ children: [{ kind: 'paragraph', children: [{ kind: 'text', value: 'a' }] }] }],
    }
    expect(n.ordered).toBe(false)
  })

  it('accepts ordered list', () => {
    const n: ListNode = { kind: 'list', ordered: true, items: [] }
    expect(n.ordered).toBe(true)
  })

  it('accepts table with InlineSpan[][] headers and InlineSpan[][][] rows', () => {
    const n: TableNode = {
      kind: 'table',
      headers: [[{ kind: 'text', value: 'Col' }]],
      rows: [[[{ kind: 'text', value: 'Cell' }]]],
    }
    expect(n.headers).toHaveLength(1)
    expect(n.rows).toHaveLength(1)
  })

  it('accepts blockquote wrapping DocNodes (not InlineSpans)', () => {
    const n: BlockquoteNode = {
      kind: 'blockquote',
      children: [{ kind: 'paragraph', children: [{ kind: 'text', value: 'Quoted' }] }],
    }
    expect(n.children).toHaveLength(1)
  })

  it('accepts hr with no other fields', () => {
    const n: HRNode = { kind: 'hr' }
    expect(n.kind).toBe('hr')
  })

  it('narrows exhaustively via assertNever', () => {
    function countDescendants(node: DocNode): number {
      switch (node.kind) {
        case 'heading':
          return node.children.length
        case 'paragraph':
          return node.children.length
        case 'list':
          return node.items.length
        case 'table':
          return node.rows.length
        case 'blockquote':
          return node.children.length
        case 'hr':
          return 0
        default:
          return assertNever(node)
      }
    }
    expect(countDescendants({ kind: 'hr' })).toBe(0)
  })
})

describe('PageDoc', () => {
  it('accepts minimum shape (no date)', () => {
    const p: PageDoc = {
      title: 'Home',
      aliases: [],
      tags: [],
      body: [],
      sourceRoute: '/',
    }
    expect(p.title).toBe('Home')
  })

  it('accepts optional date', () => {
    const p: PageDoc = {
      title: 'Home',
      aliases: ['Landing'],
      tags: ['page'],
      date: '2026-04-10',
      body: [{ kind: 'hr' }],
      sourceRoute: '/',
    }
    expect(p.date).toBe('2026-04-10')
  })
})
