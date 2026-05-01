// scripts/markdown-export/primitives/paragraph.ts
//
// Phase 38 primitive: ParagraphNode factory.
// Accepts either a plain string (sugar for `[text(s)]`) or pre-built InlineSpan[].
// Does NOT split on newlines — extractors are responsible for pre-splitting
// source content into one ParagraphNode per paragraph.

import type { InlineSpan, ParagraphNode } from '../ir/types.js'
import { text } from './text.js'

export function paragraph(content: string | readonly InlineSpan[]): ParagraphNode {
  const children = typeof content === 'string' ? [text(content)] : content
  return { kind: 'paragraph', children }
}
