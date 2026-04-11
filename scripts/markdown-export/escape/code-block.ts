// scripts/markdown-export/escape/code-block.ts
//
// Phase 38 ESCP-04: compute the fenced code block fence length needed to
// safely contain the given content, per GFM "longer fence wins" rule.
// The content itself is NEVER modified — fenced code blocks preserve content
// verbatim, including asterisks, underscores, brackets, etc.
//
// Returns both the content (unchanged) and the fence string so callers can
// assemble: `${fence}${info}\n${content}\n${fence}`.

const DEFAULT_FENCE = '```'

export interface CodeBlockFenced {
  readonly content: string
  readonly fence: string
}

export function escapeCodeBlockContent(s: string): CodeBlockFenced {
  // Find the longest run of consecutive backticks in the content.
  // We need a fence strictly longer than any inner run, with a minimum of 3.
  const matches = s.match(/`+/g) ?? []
  let longestInnerRun = 0
  for (const m of matches) {
    if (m.length > longestInnerRun) longestInnerRun = m.length
  }

  const fenceLength = Math.max(3, longestInnerRun + 1)
  const fence = fenceLength === 3 ? DEFAULT_FENCE : '`'.repeat(fenceLength)

  return { content: s, fence }
}
