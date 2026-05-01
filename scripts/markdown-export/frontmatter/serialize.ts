// scripts/markdown-export/frontmatter/serialize.ts
//
// Phase 38 FM-01 + FM-02: YAML frontmatter serializer with Obsidian-safe
// quoting, canonical key order, and forbidden singular-key rejection.
//
// Locked by D-16 (key order), D-17 (wikilink quoting), PROJECT.md forbidden
// singular keys (tag, alias, cssclass).

import { Document, Scalar } from 'yaml'

export const FORBIDDEN_SINGULAR_KEYS: readonly string[] = ['tag', 'alias', 'cssclass']

const SINGULAR_TO_PLURAL: Record<string, string> = {
  tag: 'tags',
  alias: 'aliases',
  cssclass: 'cssclasses',
}

/**
 * Build a forced double-quoted scalar node. Used for the title (which must
 * always be quoted to prevent YAML type coercion and make wikilinks safe).
 */
function quotedScalar(value: string): Scalar<string> {
  const node = new Scalar(value)
  node.type = Scalar.QUOTE_DOUBLE
  return node
}

export interface FrontmatterInput {
  readonly title: string
  readonly aliases?: readonly string[]
  readonly tags?: readonly string[]
  readonly date?: string
  readonly cssclasses?: readonly string[]
}

/**
 * Serialize a frontmatter block to a YAML document suitable for prepending
 * to a markdown file. Output is deterministic, block-style, double-quoted
 * for strings, with canonical key order: title -> aliases -> tags -> date -> cssclasses.
 *
 * Throws a descriptive error if the input contains a forbidden singular key
 * (tag, alias, cssclass) — these would corrupt Obsidian's property parser.
 */
export function serializeFrontmatter(input: FrontmatterInput): string {
  // Guard against forbidden singular keys even if called from untyped code.
  const inputObj = input as unknown as Record<string, unknown>
  for (const singular of FORBIDDEN_SINGULAR_KEYS) {
    if (singular in inputObj) {
      const plural = SINGULAR_TO_PLURAL[singular]
      throw new Error(
        `Frontmatter forbidden singular key '${singular}' — use plural '${plural}' instead (Obsidian requires plural keys).`,
      )
    }
  }

  // Build the object in canonical key order. Omit empty arrays and undefined fields.
  // Title uses a forced QUOTE_DOUBLE scalar (D-17: wikilinks safe, no YAML type
  // coercion of numeric/boolean/null-looking titles). Array items (aliases, tags,
  // cssclasses) and date use plain scalars — the yaml package automatically quotes
  // individual items only if they contain YAML special characters.
  const ordered: Record<string, unknown> = {}
  ordered.title = quotedScalar(input.title)
  if (input.aliases && input.aliases.length > 0) {
    ordered.aliases = [...input.aliases]
  }
  if (input.tags && input.tags.length > 0) {
    ordered.tags = [...input.tags]
  }
  if (input.date !== undefined) {
    ordered.date = input.date
  }
  if (input.cssclasses && input.cssclasses.length > 0) {
    ordered.cssclasses = [...input.cssclasses]
  }

  // Build a Document so we can use per-scalar types (title is forced QUOTE_DOUBLE
  // via quotedScalar, the rest remain PLAIN). Document#toString honors locked
  // quoting on individual nodes.
  //
  // Options:
  //   lineWidth: 0              — never wrap long lines (forbidden-list: no prose wrapping)
  //   defaultStringType: 'PLAIN'— array items emit unquoted when safe
  //   defaultKeyType: 'PLAIN'   — plain keys (no quoting)
  //   collectionStyle: 'block'  — force block style for all maps/sequences (no [a, b] flow)
  //   minContentWidth: 0
  //   indent: 2
  const doc = new Document(ordered)
  const body = doc.toString({
    lineWidth: 0,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN',
    collectionStyle: 'block',
    minContentWidth: 0,
    indent: 2,
  })

  // Wrap in YAML document separators. Always LF (\n) literals — never the
  // platform line-ending constant (forbidden-list disallows platform EOL).
  return `---\n${body}---\n`
}
