// scripts/markdown-export/primitives/link.ts
//
// Phase 38 primitive: LinkSpan factory (regular markdown link).
// For Obsidian-style wikilinks, use wikilink.ts instead.

import type { InlineSpan, LinkSpan } from '../ir/types.js'
import { text } from './text.js'

export function link(href: string, content: string | readonly InlineSpan[]): LinkSpan {
  const children = typeof content === 'string' ? [text(content)] : content
  return { kind: 'link', href, children }
}
