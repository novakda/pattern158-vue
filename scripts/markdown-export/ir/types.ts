// scripts/markdown-export/ir/types.ts
//
// Phase 38 IR: the single structured representation every extractor produces
// and every renderer consumes. Primitives (../primitives/*) are pure IR factories.
// Renderers (Phase 41 mono / Phase 42 Obsidian) branch on `kind` exhaustively.
//
// Locked decisions: D-06 (DocNode union), D-07 (structured InlineSpan tree), D-08 (PageDoc shape).

// --- Inline tree ------------------------------------------------------------

export type InlineSpan =
  | TextSpan
  | StrongSpan
  | EmphasisSpan
  | CodeSpan
  | LinkSpan
  | ImageSpan

export type TextSpan = { readonly kind: 'text'; readonly value: string }
export type StrongSpan = { readonly kind: 'strong'; readonly children: readonly InlineSpan[] }
export type EmphasisSpan = { readonly kind: 'emphasis'; readonly children: readonly InlineSpan[] }
export type CodeSpan = { readonly kind: 'code'; readonly value: string }
export type LinkSpan = {
  readonly kind: 'link'
  readonly href: string
  readonly children: readonly InlineSpan[]
}
export type ImageSpan = {
  readonly kind: 'image'
  readonly src: string
  readonly alt: string
}

// --- Block tree -------------------------------------------------------------

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type DocNode =
  | HeadingNode
  | ParagraphNode
  | ListNode
  | TableNode
  | BlockquoteNode
  | HRNode

export type HeadingNode = {
  readonly kind: 'heading'
  readonly level: HeadingLevel
  readonly children: readonly InlineSpan[]
}

export type ParagraphNode = {
  readonly kind: 'paragraph'
  readonly children: readonly InlineSpan[]
}

export type ListItem = {
  readonly children: readonly DocNode[]
}

export type ListNode = {
  readonly kind: 'list'
  readonly ordered: boolean
  readonly items: readonly ListItem[]
}

export type TableNode = {
  readonly kind: 'table'
  readonly headers: readonly (readonly InlineSpan[])[]
  readonly rows: readonly (readonly (readonly InlineSpan[])[])[]
}

export type BlockquoteNode = {
  readonly kind: 'blockquote'
  readonly children: readonly DocNode[]
}

export type HRNode = {
  readonly kind: 'hr'
}

// --- Page wrapper -----------------------------------------------------------

export interface PageDoc {
  readonly title: string
  readonly aliases: readonly string[]
  readonly tags: readonly string[]
  readonly date?: string
  readonly body: readonly DocNode[]
  readonly sourceRoute: string
}

// --- Exhaustiveness helpers (used by renderers and tests) -------------------

export function assertNever(value: never): never {
  throw new Error(`Unreachable: unexpected IR node ${JSON.stringify(value)}`)
}
