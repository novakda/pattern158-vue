// scripts/markdown-export/primitives/blockquote.ts
//
// Phase 38 primitive: BlockquoteNode factory.
//
// Blockquotes wrap DocNode children (NOT InlineSpan) because markdown
// blockquotes can contain paragraphs, lists, nested blockquotes, horizontal
// rules, etc. — block-level content.
//
// Sugar: a string argument is wrapped as `[paragraph(s)]`. A DocNode[]
// argument is passed through unchanged — we do NOT re-wrap it in an extra
// paragraph.
//
// ZERO escape logic, ZERO render logic (D-09).

import type { BlockquoteNode, DocNode } from '../ir/types.js'
import { paragraph } from './paragraph.js'

export function blockquote(content: string | readonly DocNode[]): BlockquoteNode {
  const children: readonly DocNode[] =
    typeof content === 'string' ? [paragraph(content)] : content
  return { kind: 'blockquote', children }
}
