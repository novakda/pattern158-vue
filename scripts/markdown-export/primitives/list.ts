// scripts/markdown-export/primitives/list.ts
//
// Phase 38 primitive: ListNode factory with flexible argument sugar.
//
// Accepted forms (D-10):
//   list(['a', 'b', 'c'])                          — unordered list of strings
//   list({ ordered: true, items: ['a', 'b'] })     — ordered list of strings
//   list({ ordered: false, items: [{ children: [paragraph('x')] }] })  — fully structured
//   list({ ordered: false, items: ['a', { children: [paragraph('b')] }] })  — mixed
//
// String items are wrapped via `paragraph(s)` so every ListItem contains
// block-level DocNode children (never bare InlineSpans, never bare strings).
// ZERO escaping, ZERO rendering logic (D-09).

import type { ListItem, ListNode } from '../ir/types.js'
import { paragraph } from './paragraph.js'

export type ListItemInput = string | ListItem

export type ListInput =
  | readonly string[]
  | {
      readonly ordered: boolean
      readonly items: readonly ListItemInput[]
    }

function toListItem(input: ListItemInput): ListItem {
  if (typeof input === 'string') {
    return { children: [paragraph(input)] }
  }
  return input
}

export function list(input: ListInput): ListNode {
  // Array form = unordered list of strings.
  if (Array.isArray(input)) {
    return {
      kind: 'list',
      ordered: false,
      items: input.map((item) => toListItem(item)),
    }
  }

  // Object form = ordered flag + mixed items array.
  const obj = input as { ordered: boolean; items: readonly ListItemInput[] }
  return {
    kind: 'list',
    ordered: obj.ordered,
    items: obj.items.map((item) => toListItem(item)),
  }
}
