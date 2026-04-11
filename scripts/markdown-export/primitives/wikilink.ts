// scripts/markdown-export/primitives/wikilink.ts
//
// Phase 38 primitive: wikilink factory.
//
// Produces a LinkSpan whose `href` is prefixed with a sentinel string that
// the Phase 42 Obsidian renderer recognizes and rewrites into `[[target]]` or
// `[[target|display]]` syntax. The Phase 41 monolithic renderer will fall
// back to rendering these as plain markdown anchors (via slug lookup).
//
// Primitives are escape-free (D-09) — the renderer calls escapeWikilinkTarget()
// on the target portion at render time, NOT here.

import type { InlineSpan, LinkSpan } from '../ir/types.js'
import { text } from './text.js'

export const WIKILINK_HREF_PREFIX = 'wikilink://'

export function wikilink(target: string, display?: string): LinkSpan {
  const displayText = display ?? target
  const children: readonly InlineSpan[] = [text(displayText)]
  return {
    kind: 'link',
    href: `${WIKILINK_HREF_PREFIX}${target}`,
    children,
  }
}
