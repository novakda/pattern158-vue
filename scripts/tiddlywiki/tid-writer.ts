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
 * Write the minimal tiddlywiki.info manifest so `npx tiddlywiki . --build index`
 * can render the wiki to a single-file HTML.
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
    },
  }
  const abs = nodePath.join(outputDir, 'tiddlywiki.info')
  await fsp.mkdir(outputDir, { recursive: true })
  await fsp.writeFile(abs, JSON.stringify(manifest, null, 2) + '\n', {
    encoding: 'utf8',
  })
  return abs
}
