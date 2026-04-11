// scripts/markdown-export/primitives/text.ts
//
// Phase 38 primitive: TextSpan factory. The simplest IR building block —
// every other primitive that accepts a string argument internally calls text().
// ZERO escaping, ZERO rendering logic (D-09).

import type { TextSpan } from '../ir/types.js'

export function text(value: string): TextSpan {
  return { kind: 'text', value }
}
