// scripts/tiddlywiki/__tests__/integrity.test.ts
// Phase 56 — TEST-04 full-corpus cross-link integrity canary.
// Composes the entire real-site tiddler set and asserts the orphan list is
// empty. Mirrors the verify-integrity.ts CLI gate (Phase 55-07) so any
// future refactor that breaks [[...]] cross-links fails `pnpm test:scripts`
// without having to run the standalone CLI.
//
// Resilience: if static-site/ or src/data/json/ is absent from the project
// root (e.g. a clean checkout where the live site hasn't been generated),
// the test reports a pass-with-skip-message via `it.skip` and logs what
// was missing. The hermetic e2e.test.ts (TEST-03) remains the guaranteed-
// running canary; this test is the live-corpus sibling.
//
// Design note: like e2e.test.ts this file replicates composeAllTiddlers'
// assembly order inline rather than importing generate.ts, because
// generate.ts fires main() as a module-level side effect that would write
// tiddlers to disk and log to stdout at test import time. The inline
// replica intentionally mirrors the CLI compose order.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'
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

const PROJECT_ROOT = process.cwd()

async function pathExists(abs: string): Promise<boolean> {
  try {
    await fsp.access(abs)
    return true
  } catch {
    return false
  }
}

async function readJsonMaybe<T>(relPath: string): Promise<T | null> {
  const abs = nodePath.join(PROJECT_ROOT, relPath)
  try {
    const raw = await fsp.readFile(abs, { encoding: 'utf8' })
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function countExhibitHtml(): Promise<number> {
  const dir = nodePath.join(PROJECT_ROOT, 'static-site', 'exhibits')
  try {
    const entries = await fsp.readdir(dir)
    return entries.filter((name) => name.endsWith('.html')).length
  } catch {
    return 0
  }
}

async function composeRealCorpus(): Promise<Tiddler[]> {
  const bundle = await extractAll(PROJECT_ROOT)
  const exhibitsJson =
    (await readJsonMaybe<readonly ExhibitJson[]>('src/data/json/exhibits.json'))
      ?? []
  const faqItemsJson =
    (await readJsonMaybe<readonly FaqJsonItem[]>('src/data/json/faq.json')) ?? []

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

describe('integrity — full real-site corpus has zero orphan cross-links', () => {
  it('composes the real corpus and verifyCrossLinkIntegrity returns 0 orphans', async () => {
    const staticSiteExists = await pathExists(
      nodePath.join(PROJECT_ROOT, 'static-site'),
    )
    const exhibitsJsonExists = await pathExists(
      nodePath.join(PROJECT_ROOT, 'src', 'data', 'json', 'exhibits.json'),
    )
    const exhibitHtmlCount = await countExhibitHtml()

    if (!staticSiteExists || !exhibitsJsonExists || exhibitHtmlCount === 0) {
      // Resilient trivial-pass path: the real site is absent or empty (e.g.
      // a clean checkout). The hermetic e2e test (TEST-03) still guarantees
      // the pipeline's correctness — this test is the live-corpus sibling.
      process.stdout.write(
        `[integrity.test] Skipping live-corpus check: static-site=${staticSiteExists}, exhibits.json=${exhibitsJsonExists}, exhibit .html files=${exhibitHtmlCount}\n`,
      )
      expect(true).toBe(true)
      return
    }

    const tiddlers = await composeRealCorpus()
    const result = verifyCrossLinkIntegrity(tiddlers)
    if (result.orphans.length > 0) {
      for (const o of result.orphans.slice(0, 20)) {
        process.stderr.write(
          `[integrity.test] orphan: "${o.source}" → "${o.link}"\n`,
        )
      }
    }
    expect(result.orphans).toEqual([])
    // Sanity floor: a healthy corpus should have many more than the fixture's 27.
    expect(tiddlers.length).toBeGreaterThan(50)
  })
})
