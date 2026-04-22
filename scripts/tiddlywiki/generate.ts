// scripts/tiddlywiki/generate.ts
// v9.0 orchestrator: reads static-site/ HTML + src/data/json/*.json,
// runs the Phase 53 extractor layer via extract-all.ts, composes the
// tiddler list via Phase 54 generators + iter-1 sources.ts helpers, and
// writes tiddlywiki/tiddlers/*.tid + pattern158-tiddlers.json + tiddlywiki.info.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.
//
// Input sources (discovered via extractAll):
//   - static-site/*.html (page + exhibit + case-files + faq HTML)
//   - src/data/json/faq.json (FAQ fallback)
//   - src/data/json/exhibits.json (iter-1 exhibit JSON; migration in Plan 55-03+)
//
// Output:
//   - tiddlywiki/tiddlers/*.tid          (canonical source; git-trackable)
//   - tiddlywiki/pattern158-tiddlers.json (drag-drop byproduct)
//   - tiddlywiki/tiddlywiki.info         (TW5 build manifest)
//
// Build single-file wiki:  npx tiddlywiki tiddlywiki --build index

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import { extractAll } from './extract-all.ts'
import { pageContentToTiddlers } from './page-content-to-tiddlers.ts'
import {
  type ExhibitJson,
  type FaqJsonItem,
  caseFilesIndexTiddler,
  exhibitsToTiddlers,
  faqIndexTiddler,
  faqItemsToTiddlers,
  siteMetaTiddlers,
} from './sources.ts'
import {
  type Tiddler,
  tiddlersToJson,
  writeTiddlerFile,
  writeTiddlywikiInfo,
} from './tid-writer.ts'

const PROJECT_ROOT = process.cwd()
const OUTPUT_ROOT = nodePath.join(PROJECT_ROOT, 'tiddlywiki')
const TIDDLER_DIR = nodePath.join(OUTPUT_ROOT, 'tiddlers')
const JSON_BYPRODUCT = nodePath.join(OUTPUT_ROOT, 'pattern158-tiddlers.json')

async function readJson<T>(relativePath: string): Promise<T> {
  const abs = nodePath.join(PROJECT_ROOT, relativePath)
  const raw = await fsp.readFile(abs, { encoding: 'utf8' })
  return JSON.parse(raw) as T
}

async function main(): Promise<void> {
  const bundle = await extractAll(PROJECT_ROOT)

  // Exhibits + FAQ still driven by the JSON source-of-truth for iter-1
  // tiddler generators (exhibitsToTiddlers / faqItemsToTiddlers consume the
  // JSON shapes). Plans 55-03..06 will migrate each consumer incrementally.
  const exhibits = await readJson<readonly ExhibitJson[]>(
    'src/data/json/exhibits.json',
  )
  const faqItems = await readJson<readonly FaqJsonItem[]>(
    'src/data/json/faq.json',
  )

  const tiddlers: Tiddler[] = [
    ...siteMetaTiddlers(),
    ...pageContentToTiddlers(bundle.pages),
    caseFilesIndexTiddler(exhibits),
    ...exhibitsToTiddlers(exhibits),
    faqIndexTiddler(faqItems),
    ...faqItemsToTiddlers(faqItems),
  ]

  await fsp.mkdir(TIDDLER_DIR, { recursive: true })
  await writeTiddlywikiInfo(OUTPUT_ROOT)

  for (const t of tiddlers) {
    await writeTiddlerFile(TIDDLER_DIR, t)
  }
  await fsp.writeFile(JSON_BYPRODUCT, tiddlersToJson(tiddlers), {
    encoding: 'utf8',
  })

  const metaCount = siteMetaTiddlers().length
  const pageCount = bundle.pages.length
  const exhibitCount = exhibits.length + 1 // +1 for index
  const faqCount = faqItems.length + 1 // +1 for index
  process.stdout.write(
    `[tiddlywiki:generate] Wrote ${tiddlers.length} tiddlers → ${TIDDLER_DIR}\n`,
  )
  process.stdout.write(
    `                      ${metaCount} meta, ${pageCount} pages, ${exhibitCount} exhibits, ${faqCount} FAQ\n`,
  )
  process.stdout.write(`                      JSON byproduct: ${JSON_BYPRODUCT}\n`)
  process.stdout.write(
    `                      Build single-file wiki: npx tiddlywiki ${nodePath.relative(PROJECT_ROOT, OUTPUT_ROOT)} --build index\n`,
  )
}

main().catch((err) => {
  process.stderr.write(`[tiddlywiki:generate] failed: ${String(err)}\n`)
  process.exit(1)
})
