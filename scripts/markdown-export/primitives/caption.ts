// scripts/markdown-export/primitives/caption.ts
//
// Phase 38 primitive: image caption factory.
//
// Per VAULT-09 (Obsidian vault: images skipped, alt text emitted as italicized
// captions), the caption primitive produces a ParagraphNode wrapping an
// EmphasisSpan wrapping a TextSpan. Both the mono and Obsidian renderers
// render emphasis as italic, so the visual result is consistent.

import type { EmphasisSpan, ParagraphNode } from '../ir/types.js'
import { text } from './text.js'

export function caption(captionText: string): ParagraphNode {
  const emph: EmphasisSpan = {
    kind: 'emphasis',
    children: [text(captionText)],
  }
  return { kind: 'paragraph', children: [emph] }
}
