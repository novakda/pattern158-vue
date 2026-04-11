// scripts/markdown-export/primitives/heading.ts
//
// Phase 38 primitive: HeadingNode factory.
// Accepts either a plain string (sugar for `[text(s)]`) or pre-built InlineSpan[].
// Level is constrained to HeadingLevel (1-6) at compile time.

import type { HeadingLevel, HeadingNode, InlineSpan } from '../ir/types.js'
import { text } from './text.js'

export function heading(
  level: HeadingLevel,
  content: string | readonly InlineSpan[],
): HeadingNode {
  const children = typeof content === 'string' ? [text(content)] : content
  return { kind: 'heading', level, children }
}
