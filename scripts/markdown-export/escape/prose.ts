// scripts/markdown-export/escape/prose.ts
//
// Phase 38 ESCP-01: escape prose text for GFM + Obsidian rendering.
// Character set locked by D-19.
//
// IMPORTANT: this is a SINGLE-PASS escape. Calling it twice on the same string
// will double-escape the backslashes. Renderers MUST call it exactly once per span.

const BOM = '\uFEFF'

// Order matters: backslash MUST be first so subsequent escapes don't double-escape.
const PROSE_ESCAPES: readonly (readonly [RegExp, string])[] = [
  [/\\/g, '\\\\'],
  [/\*/g, '\\*'],
  [/_/g, '\\_'],
  [/\[/g, '\\['],
  [/\]/g, '\\]'],
  [/`/g, '\\`'],
  [/</g, '\\<'],
  [/>/g, '\\>'],
  [/#/g, '\\#'],
  [/!/g, '\\!'],
  [/\|/g, '\\|'],
  [/~/g, '\\~'],
]

export function escapeProse(s: string): string {
  // Strip BOM first (U+FEFF). Never preserve it — it corrupts YAML frontmatter
  // and Obsidian property parsing.
  let out = s.split(BOM).join('')

  // HTML entity: only ampersand becomes &amp;. Other entities (<, >) are
  // escaped as markdown backslash chars below, NOT as HTML entities, because
  // GFM renders \< literally instead of parsing it as HTML.
  out = out.replace(/&/g, '&amp;')

  for (const [pattern, replacement] of PROSE_ESCAPES) {
    out = out.replace(pattern, replacement)
  }

  // NBSP (U+00A0) is preserved as-is — GFM and Obsidian both render it,
  // and converting to space would lose the intentional non-breaking semantics.

  return out
}
