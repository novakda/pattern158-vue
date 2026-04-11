// scripts/markdown-export/escape/table-cell.ts
//
// Phase 38 ESCP-02: escape content for a GFM table cell.
// Superset of escapeProse: ALL prose escapes apply, PLUS table cells must
// replace any newline with <br> because GFM table cells cannot contain
// literal newlines.
//
// Note: `escapeProse` already handles the pipe character `|`, so we do NOT
// double-escape it here. Table-cell-specific work is just newline normalization.

import { escapeProse } from './prose.js'

export function escapeTableCell(s: string): string {
  // Run prose escapes first (handles pipes, brackets, etc.).
  const prose = escapeProse(s)

  // Normalize CRLF then LF to <br>. Order matters: replace CRLF before LF so
  // we don't emit <br><br> for a single CRLF.
  return prose.split('\r\n').join('<br>').split('\n').join('<br>')
}
