// scripts/markdown-export/escape/wikilink.ts
//
// Phase 38 ESCP-03: escape a wikilink TARGET (not display text).
// Character set locked by D-19:
//   - Markdown escapes: |, ], [, #, ^, \
//   - Filesystem sanitization (Obsidian vault): /, \, :, *, ?, ", <, >
//
// Note: backslash appears in BOTH sets — filesystem sanitization takes
// precedence (replaces with '-') for wikilink targets because Obsidian
// cannot save a note whose filename contains a backslash. This means the
// markdown-escape-backslash case is unreachable for targets; it exists in
// the spec for completeness but is dominated by the filesystem replacement.

const FILESYSTEM_RESERVED: readonly string[] = ['/', '\\', ':', '*', '?', '"', '<', '>']
const MARKDOWN_ESCAPES: readonly string[] = ['|', '[', ']', '#', '^']

export function escapeWikilinkTarget(s: string): string {
  let out = s

  // Filesystem sanitization FIRST: these become '-' so they cannot interact
  // with markdown escape logic below.
  for (const ch of FILESYSTEM_RESERVED) {
    out = out.split(ch).join('-')
  }

  // Markdown escapes: prepend backslash. Order within this group does not
  // matter because none of these characters are created by the others.
  for (const ch of MARKDOWN_ESCAPES) {
    out = out.split(ch).join(`\\${ch}`)
  }

  return out
}
