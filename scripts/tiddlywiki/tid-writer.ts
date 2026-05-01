// scripts/tiddlywiki/tid-writer.ts
// TiddlyWiki .tid file serializer + JSON byproduct writer.
// SCAF-08 forbidden tokens avoided: no wall-clock, no randomness,
// no platform-specific line endings.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

export interface Tiddler {
  readonly title: string
  readonly type: string // e.g. 'text/vnd.tiddlywiki', 'text/html'
  readonly tags: readonly string[]
  readonly fields: Readonly<Record<string, string>>
  readonly text: string
}

/**
 * Format tags for .tid file headers. Multi-word tags wrapped in [[...]].
 */
function formatTagsField(tags: readonly string[]): string {
  return tags
    .map((t) => (t.includes(' ') ? `[[${t}]]` : t))
    .join(' ')
}

/**
 * Serialize a Tiddler to .tid file text. Header block + blank line + text body.
 * Header keys sorted alphabetically for determinism.
 */
export function tiddlerToTidFile(t: Tiddler): string {
  const header: Record<string, string> = {
    title: t.title,
    type: t.type,
    tags: formatTagsField(t.tags),
    ...t.fields,
  }
  const lines: string[] = []
  for (const key of Object.keys(header).sort()) {
    const value = header[key]
    if (value === undefined || value === '') continue
    lines.push(`${key}: ${value}`)
  }
  return `${lines.join('\n')}\n\n${t.text}\n`
}

/**
 * Title → filename. Replace chars unsafe for most filesystems.
 */
export function tiddlerTitleToFilename(title: string): string {
  return title
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\.+$/, '')
}

export async function writeTiddlerFile(
  outputDir: string,
  t: Tiddler,
): Promise<string> {
  const fname = `${tiddlerTitleToFilename(t.title)}.tid`
  const abs = nodePath.join(outputDir, fname)
  await fsp.mkdir(nodePath.dirname(abs), { recursive: true })
  await fsp.writeFile(abs, tiddlerToTidFile(t), { encoding: 'utf8' })
  return abs
}

/**
 * Serialize all tiddlers to a single JSON array suitable for drag-drop
 * import into an empty TiddlyWiki.
 */
export function tiddlersToJson(tiddlers: readonly Tiddler[]): string {
  const shaped = tiddlers.map((t) => ({
    title: t.title,
    type: t.type,
    tags: formatTagsField(t.tags),
    text: t.text,
    ...t.fields,
  }))
  return JSON.stringify(shaped, null, 2)
}

/**
 * Write the tiddlywiki.info manifest with three build targets (TZK-02):
 *
 *   - `index`        — backward-compat default; no publish filter. Renders
 *                      every tiddler into `output/index.html`.
 *   - `public-index` — applies `publishFilter=[!tag[private]]` via the
 *                      $:/core/save/all `saveTiddlerFilter` variable so
 *                      every private-tagged tiddler is excluded from the
 *                      built HTML. Outputs to `output/index.html`.
 *   - `all-index`    — no publish filter. Outputs to `output/all.html`.
 *
 * `$:/core/save/all` interpolates `$(publishFilter)$` into its internal
 * saveTiddlerFilter, so passing a 5th/6th name/value pair to `--render`
 * narrows the exported tiddler set without requiring a custom template.
 * See TiddlyWiki core template `$:/core/save/all` (line with
 * `$(publishFilter)$`). Passing empty-string template preserves the
 * existing `render '$:/core/save/all' filename type` invocation shape.
 *
 * The `--output tiddlywiki/output` prefix lands files in
 * `tiddlywiki/output/` when run from the project root (TiddlyWiki's
 * `--output <pathname>` resolves a relative path against the CWD of the
 * CLI, per core/language/en-GB/Help/output.tid). Pnpm scripts always run
 * from the project root, so the prefix is deterministic. The legacy
 * `index` target stays `--output`-free for backward compatibility with
 * any pre-Phase-58 scripts or documentation (npx tiddlywiki tiddlywiki
 * --build index).
 */
export async function writeTiddlywikiInfo(outputDir: string): Promise<string> {
  const manifest = {
    description: 'Pattern 158 — Dan Novak Portfolio',
    plugins: ['tiddlywiki/tiddlyweb', 'tiddlywiki/filesystem'],
    themes: ['tiddlywiki/vanilla', 'tiddlywiki/snowwhite'],
    build: {
      index: [
        '--render',
        '$:/core/save/all',
        'index.html',
        'text/plain',
      ],
      'public-index': [
        '--output',
        'tiddlywiki/output',
        '--render',
        '$:/core/save/all',
        'index.html',
        'text/plain',
        '',
        'publishFilter',
        '+[!tag[private]]',
      ],
      'all-index': [
        '--output',
        'tiddlywiki/output',
        '--render',
        '$:/core/save/all',
        'all.html',
        'text/plain',
      ],
    },
  }
  const abs = nodePath.join(outputDir, 'tiddlywiki.info')
  await fsp.mkdir(outputDir, { recursive: true })
  await fsp.writeFile(abs, JSON.stringify(manifest, null, 2) + '\n', {
    encoding: 'utf8',
  })
  return abs
}
