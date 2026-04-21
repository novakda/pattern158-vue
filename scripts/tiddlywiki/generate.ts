// scripts/tiddlywiki/generate.ts
// v9.0 starter: generate a TiddlyWiki source folder from Pattern 158 data.
//
// Input sources:
//   - src/data/json/faq.json      → per-question FAQ tiddlers + FAQ Index
//   - src/data/json/exhibits.json → per-exhibit tiddlers + Case Files Index
//   - static-site/*.html          → page tiddlers (Home, Philosophy, etc.)
//
// Output:
//   - tiddlywiki/tiddlers/*.tid         (canonical source; git-trackable)
//   - tiddlywiki/pattern158-tiddlers.json  (byproduct for drag-drop import)
//   - tiddlywiki/tiddlywiki.info        (TW5 build manifest)
//
// Build the single-file HTML wiki:
//   npx tiddlywiki tiddlywiki --build index

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import {
  type ExhibitJson,
  type FaqJsonItem,
  caseFilesIndexTiddler,
  defaultLinkMap,
  exhibitsToTiddlers,
  faqIndexTiddler,
  faqItemsToTiddlers,
  pageSpecsToTiddlers,
  siteMetaTiddlers,
  type PageSpec,
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

const PAGES: readonly PageSpec[] = [
  {
    title: 'Home',
    sourceHtmlPath: 'static-site/index.html',
    tags: ['page'],
  },
  {
    title: 'Philosophy',
    sourceHtmlPath: 'static-site/philosophy.html',
    tags: ['page'],
  },
  {
    title: 'Technologies',
    sourceHtmlPath: 'static-site/technologies.html',
    tags: ['page'],
  },
  {
    title: 'Contact',
    sourceHtmlPath: 'static-site/contact.html',
    tags: ['page'],
  },
  {
    title: 'Accessibility',
    sourceHtmlPath: 'static-site/accessibility.html',
    tags: ['page'],
  },
]

async function readJson<T>(relativePath: string): Promise<T> {
  const abs = nodePath.join(PROJECT_ROOT, relativePath)
  const raw = await fsp.readFile(abs, { encoding: 'utf8' })
  return JSON.parse(raw) as T
}

async function main(): Promise<void> {
  const faqItems = await readJson<readonly FaqJsonItem[]>(
    'src/data/json/faq.json',
  )
  const exhibits = await readJson<readonly ExhibitJson[]>(
    'src/data/json/exhibits.json',
  )

  const linkMap = defaultLinkMap(exhibits)

  const tiddlers: Tiddler[] = [
    ...siteMetaTiddlers(),
    ...(await pageSpecsToTiddlers(PROJECT_ROOT, PAGES, linkMap)),
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
  const pageCount = PAGES.length
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
