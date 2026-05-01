// scripts/markdown-export/primitives/table.ts
//
// Phase 38 primitive: TableNode factory with per-cell string sugar.
//
// Accepted input cell forms (D-10):
//   - string        → wrapped as `[text(s)]`
//   - InlineSpan[]  → passed through unchanged
//
// Accepted input shapes:
//   table({ headers: ['H1', 'H2'], rows: [['a', 'b'], ['c', 'd']] })   // all-string
//   table({ headers: [[text('H')]], rows: [[[text('x')]]] })           // fully structured
//   table({ headers: ['H1', [text('H2')]], rows: [...] })              // per-cell mixed
//
// ZERO escape logic (D-09): pipe / markdown-char escaping is the renderer's
// job via escapeTableCell, not the primitive's.

import type { InlineSpan, TableNode } from '../ir/types.js'
import { text } from './text.js'

export type TableCellInput = string | readonly InlineSpan[]

export interface TableInput {
  readonly headers: readonly TableCellInput[]
  readonly rows: readonly (readonly TableCellInput[])[]
}

function toCell(input: TableCellInput): readonly InlineSpan[] {
  return typeof input === 'string' ? [text(input)] : input
}

export function table(input: TableInput): TableNode {
  return {
    kind: 'table',
    headers: input.headers.map(toCell),
    rows: input.rows.map((row) => row.map(toCell)),
  }
}
