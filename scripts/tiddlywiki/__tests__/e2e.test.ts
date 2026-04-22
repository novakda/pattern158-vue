// scripts/tiddlywiki/__tests__/e2e.test.ts
// Phase 56 — TEST-03 hermetic end-to-end smoke.
// Exercises the full extractor → generator pipeline against the committed
// fixture site in scripts/tiddlywiki/__fixtures__/site/. No network, no
// dependency on the live static-site/ corpus, no writes to disk.
//
// Design note: this file replicates the composition order of
// composeAllTiddlers (from generate.ts) inline rather than importing it,
// because generate.ts invokes main() as a module-level side effect. That
// would fire an unwanted real-site generate the moment the test module is
// loaded. The inline replica stays in lockstep with generate.ts — a drift
// regression would surface here as an orphan or a tiddler-count mismatch.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { extractAll } from '../extract-all.ts'
import { pageContentToTiddlers } from '../page-content-to-tiddlers.ts'
import {
  type ExhibitJson,
  type FaqJsonItem,
  caseFilesIndexTiddler,
  exhibitsToTiddlers,
  faqIndexTiddler,
  faqItemsToTiddlers,
  siteMetaTiddlers,
} from '../sources.ts'
import { emitPersonTiddlers } from '../generators/person.ts'
import { emitFindingTiddlers } from '../generators/finding.ts'
import { emitTechnologyTiddlers } from '../generators/technology.ts'
import { emitTestimonialTiddlers } from '../generators/testimonial.ts'
import { verifyCrossLinkIntegrity } from '../generators/integrity-check.ts'
import { type PersonnelEntry } from '../extractors/types.ts'
import type { Tiddler } from '../tid-writer.ts'

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url))
const FIXTURE_ROOT = nodePath.resolve(__dirname, '..', '__fixtures__', 'site')

async function readJson<T>(relPath: string): Promise<T> {
  const abs = nodePath.join(FIXTURE_ROOT, relPath)
  const raw = await fsp.readFile(abs, { encoding: 'utf8' })
  return JSON.parse(raw) as T
}

// Mirrors composeAllTiddlers() in scripts/tiddlywiki/generate.ts.
// If generate.ts's composition order changes, update the mirror here too —
// the integrity assertion below will catch most drifts as orphans.
async function composeTiddlersFromFixture(): Promise<Tiddler[]> {
  const bundle = await extractAll(FIXTURE_ROOT)
  const exhibitsJson = await readJson<readonly ExhibitJson[]>(
    'src/data/json/exhibits.json',
  )
  const faqItemsJson = await readJson<readonly FaqJsonItem[]>(
    'src/data/json/faq.json',
  )

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

describe('e2e — extractAll emits a populated bundle from fixture site', () => {
  it('bundle exposes non-empty counts for every extractor category', async () => {
    const bundle = await extractAll(FIXTURE_ROOT)
    expect(bundle.faqItems.length).toBe(3)
    expect(bundle.exhibits.length).toBe(2)
    expect(bundle.personnelByExhibit.length).toBe(4)
    expect(bundle.findingsByExhibit.length).toBe(2)
    expect(bundle.technologiesByExhibit.length).toBe(4)
    expect(bundle.testimonials.length).toBe(3)
    expect(bundle.pages.length).toBe(5)
    expect(bundle.caseFilesIndex.entries.length).toBe(2)
  })
})

describe('e2e — exhibit labels normalized to short form', () => {
  it('bundle.exhibits[*].label is "A"/"B" (not "Exhibit A"/"Exhibit B")', async () => {
    const bundle = await extractAll(FIXTURE_ROOT)
    const labels = bundle.exhibits.map((e) => e.label).sort()
    expect(labels).toEqual(['A', 'B'])
  })
})

describe('e2e — composed tiddler corpus has expected count', () => {
  it('produces 27 tiddlers (3 meta + 5 pages + index + 2 exhibits + 4 persons + 2 findings + 3 tech + 3 testimonials + FAQ-index + 3 FAQs)', async () => {
    const tiddlers = await composeTiddlersFromFixture()
    expect(tiddlers.length).toBe(27)
  })
})

describe('e2e — key tiddlers present in corpus by title', () => {
  it('includes site meta, page, exhibit, person, finding, testimonial, and FAQ titles', async () => {
    const tiddlers = await composeTiddlersFromFixture()
    const titles = new Set(tiddlers.map((t) => t.title))
    // Site meta
    expect(titles.has('$:/SiteTitle')).toBe(true)
    expect(titles.has('$:/DefaultTiddlers')).toBe(true)
    // Pages
    expect(titles.has('Home')).toBe(true)
    expect(titles.has('Philosophy')).toBe(true)
    expect(titles.has('Accessibility')).toBe(true)
    // Index
    expect(titles.has('Case Files Index')).toBe(true)
    expect(titles.has('FAQ Index')).toBe(true)
    // Exhibits (short-form link target)
    expect(titles.has('Exhibit A')).toBe(true)
    expect(titles.has('Exhibit B')).toBe(true)
    // Person (from exhibit A personnel row)
    expect(titles.has('Alice Alpha')).toBe(true)
    // Finding (truncated-title format from emitFindingTiddlers)
    expect(titles.has('A Finding: Missing e2e coverage')).toBe(true)
    // Technology (Tech: prefix form from emitTechnologyTiddlers)
    expect(titles.has('Tech: TypeScript')).toBe(true)
    // FAQ question
    expect(titles.has('What does the fixture cover?')).toBe(true)
  })
})

describe('e2e — full corpus has zero orphan wikitext cross-links', () => {
  it('verifyCrossLinkIntegrity reports orphans.length === 0', async () => {
    const tiddlers = await composeTiddlersFromFixture()
    const result = verifyCrossLinkIntegrity(tiddlers)
    expect(result.orphans).toEqual([])
  })
})

describe('e2e — idempotent composition', () => {
  it('two sequential compose runs yield byte-identical JSON', async () => {
    const first = JSON.stringify(await composeTiddlersFromFixture())
    const second = JSON.stringify(await composeTiddlersFromFixture())
    expect(second).toBe(first)
  })
})
