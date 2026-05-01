// scripts/tiddlywiki/generators/helpers.ts
// Phase 54 Plan 01 — shared pure helpers used by every atomic tiddler generator.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic string-in / string-out.

const ELLIPSIS = '…'

// Truncate text at the last word boundary that keeps total length (including
// the ellipsis) <= maxLen. If the input already fits, it is returned unchanged
// without an ellipsis. Empty input returns empty output.
export function truncateAtWordBoundary(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  if (maxLen <= 1) return ELLIPSIS
  const sliceBudget = maxLen - 1
  const slice = text.slice(0, sliceBudget)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${cut}${ELLIPSIS}`
}

// Canonical exhibit tiddler title. Consumers call wikiLink(formatExhibitTitle(label))
// to produce the [[Exhibit J]] cross-link body tokens.
export function formatExhibitTitle(label: string): string {
  return `Exhibit ${label.trim()}`
}

// Wrap a string in TiddlyWiki double-bracket link syntax exactly once.
// Callers pass the target title verbatim; this helper never escapes or pipes.
export function wikiLink(target: string): string {
  return `[[${target}]]`
}
