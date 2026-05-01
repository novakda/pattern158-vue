// scripts/tiddlywiki/verify-integrity.ts
// Phase 55 Plan 07 — smoke-gate integrity audit.
// Runs the full generate pipeline in memory (no disk writes) and fails
// non-zero if any [[target]] link in any tiddler body points to a tiddler
// title that is absent from the generated corpus.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import { extractAll } from './extract-all.ts'
import { composeAllTiddlers } from './generate.ts'
import type { ExhibitJson, FaqJsonItem } from './sources.ts'
import { verifyCrossLinkIntegrity } from './generators/integrity-check.ts'

const PROJECT_ROOT = process.cwd()

async function readJson<T>(relativePath: string): Promise<T> {
  const abs = nodePath.join(PROJECT_ROOT, relativePath)
  const raw = await fsp.readFile(abs, { encoding: 'utf8' })
  return JSON.parse(raw) as T
}

async function main(): Promise<void> {
  const bundle = await extractAll(PROJECT_ROOT)
  const exhibitsJson = await readJson<readonly ExhibitJson[]>(
    'src/data/json/exhibits.json',
  )
  const faqItemsJson = await readJson<readonly FaqJsonItem[]>(
    'src/data/json/faq.json',
  )
  const tiddlers = composeAllTiddlers({ bundle, exhibitsJson, faqItemsJson })

  const result = verifyCrossLinkIntegrity(tiddlers)
  if (result.orphans.length > 0) {
    const sources = new Set<string>()
    for (const orphan of result.orphans) {
      sources.add(orphan.source)
      process.stderr.write(
        `[55-07] ORPHAN: tiddler "${orphan.source}" links to missing "${orphan.link}"\n`,
      )
    }
    process.stderr.write(
      `[55-07] FAIL: ${result.orphans.length} orphaned link(s) across ${sources.size} tiddler(s).\n`,
    )
    process.exit(1)
  }
  process.stdout.write(
    `[55-07] PASS: ${tiddlers.length} tiddlers, 0 orphaned links.\n`,
  )
}

main().catch((err) => {
  process.stderr.write(`[55-07] verify-integrity failed: ${String(err)}\n`)
  process.exit(1)
})
