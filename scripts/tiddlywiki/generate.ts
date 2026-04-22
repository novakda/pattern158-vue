// scripts/tiddlywiki/generate.ts
// v9.0 orchestrator: reads static-site/ HTML + src/data/json/*.json,
// runs the Phase 53 extractor layer via extract-all.ts, composes the
// tiddler list via Phase 54 generators + iter-1 sources.ts helpers, and
// writes tiddlywiki/tiddlers/*.tid + pattern158-tiddlers.json + tiddlywiki.info.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.
//
// Exports composeAllTiddlers(input) as the pure, in-memory tiddler composer
// — consumed both by main() here and by scripts/tiddlywiki/verify-integrity.ts
// (Plan 55-07 smoke-gate integrity audit). Single source of truth for the
// tiddler assembly order.
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

import { extractAll, type ExtractedBundle } from './extract-all.ts'
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
import { emitPersonTiddlers } from './generators/person.ts'
import { emitFindingTiddlers } from './generators/finding.ts'
import { emitTechnologyTiddlers } from './generators/technology.ts'
import { emitTestimonialTiddlers } from './generators/testimonial.ts'
import { type PersonnelEntry } from './extractors/types.ts'
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

export interface ComposeInput {
  readonly bundle: ExtractedBundle
  readonly exhibitsJson: readonly ExhibitJson[]
  readonly faqItemsJson: readonly FaqJsonItem[]
}

export function composeAllTiddlers(input: ComposeInput): Tiddler[] {
  const { bundle, exhibitsJson, faqItemsJson } = input

  // Person tiddlers require a client string per call (ATOM-01 tag format);
  // group personnel entries by client via the bundle.exhibits lookup so
  // each invocation tags its output with the correct [[{Client}]] value.
  const clientByLabel = new Map<string, string>()
  for (const ex of bundle.exhibits) clientByLabel.set(ex.label, ex.client)

  const personnelByClient = new Map<string, PersonnelEntry[]>()
  for (const p of bundle.personnelByExhibit) {
    const client = clientByLabel.get(p.sourceExhibitLabel)
    if (client === undefined) continue
    const bucket = personnelByClient.get(client)
    if (bucket === undefined) personnelByClient.set(client, [p])
    else bucket.push(p)
  }

  const personTiddlers: Tiddler[] = []
  for (const client of Array.from(personnelByClient.keys()).sort()) {
    const entries = personnelByClient.get(client)!
    personTiddlers.push(...emitPersonTiddlers(entries, { client }))
  }

  const findingTiddlers = emitFindingTiddlers(bundle.findingsByExhibit)
  const technologyTiddlers = emitTechnologyTiddlers(bundle.technologiesByExhibit)
  const testimonialTiddlers = emitTestimonialTiddlers(bundle.testimonials)

  return [
    ...siteMetaTiddlers(),
    ...pageContentToTiddlers(bundle.pages),
    caseFilesIndexTiddler(exhibitsJson),
    ...exhibitsToTiddlers(exhibitsJson, {
      extractedExhibits: bundle.exhibits,
      personnel: bundle.personnelByExhibit,
      findings: bundle.findingsByExhibit,
      technologies: bundle.technologiesByExhibit,
      testimonials: bundle.testimonials,
    }),
    ...personTiddlers,
    ...findingTiddlers,
    ...technologyTiddlers,
    ...testimonialTiddlers,
    faqIndexTiddler(faqItemsJson),
    ...faqItemsToTiddlers(faqItemsJson, {
      exhibitLabels: bundle.exhibits.map((e) => e.label),
    }),
  ]
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
  const exhibitCount = exhibitsJson.length + 1 // +1 for index
  const faqCount = faqItemsJson.length + 1 // +1 for index
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
