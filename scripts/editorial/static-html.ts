/// <reference lib="dom" />
// scripts/editorial/static-html.ts
// v9.0 starter: emit static HTML per route from CapturedPage.mainHtml.
// - Strip Vue scaffolding (script/style/noscript/aria-hidden subtrees + data-v-* attrs).
// - PRESERVE class attributes (diff from Markdown path — we need them for styling).
// - Transform FAQ accordion (.faq-accordion-item) → <details><summary>.
// - Wrap in full HTML boilerplate with local CSS links from dist/assets/.
// SCAF-08 forbidden tokens avoided: no wall-clock reads, no randomness,
// no platform-specific line endings, no path-alias imports, sequential iteration only.

import { Window } from 'happy-dom'
import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import type { CapturedPage } from './capture.ts'
import type { Route } from './routes.ts'

const STRIP_SELECTOR = 'script, style, noscript, [aria-hidden="true"]'

export interface StaticPageInput {
  readonly route: Route
  readonly title: string
  readonly description: string
  readonly mainHtml: string
  readonly cssHrefs: readonly string[]
}

export interface StaticSiteResult {
  readonly outputDir: string
  readonly pages: readonly string[]
  readonly cssFiles: readonly string[]
}

/**
 * HTML-mode sanitizer. Like sanitizeHtml in convert.ts but:
 *   - Preserves class attributes (needed for CSS styling).
 *   - Does NOT demote headings (page headings stay H1/H2 for semantic fidelity).
 *   - Applies the FAQ accordion → details/summary transform.
 */
export function sanitizeForHtml(rawHtml: string): string {
  const window = new Window()
  const { document } = window
  document.body.innerHTML = rawHtml
  document.body.querySelectorAll(STRIP_SELECTOR).forEach((el) => el.remove())
  document.body.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('data-v-')) el.removeAttribute(attr.name)
    }
  })
  transformFaqAccordion(document as unknown as Document)
  return document.body.innerHTML
}

/**
 * Rewrite every .faq-accordion-item to a <details><summary>…</summary>…</details>.
 * Matches the Vue component shape at src/components/FaqAccordionItem.vue.
 */
export function transformFaqAccordion(document: Document): void {
  const items = document.querySelectorAll('.faq-accordion-item')
  items.forEach((item) => {
    const questionText =
      item.querySelector('.faq-accordion-question')?.textContent ?? ''
    const pills = item.querySelector('.faq-category-pills')
    const answer = item.querySelector('.faq-answer')

    const details = document.createElement('details')
    details.setAttribute('open', '')
    details.className = item.className

    const summary = document.createElement('summary')
    summary.className = 'faq-accordion-heading'
    const questionSpan = document.createElement('span')
    questionSpan.className = 'faq-accordion-question'
    questionSpan.textContent = questionText
    summary.appendChild(questionSpan)
    details.appendChild(summary)

    if (pills) {
      details.appendChild(pills.cloneNode(true))
    }
    if (answer) {
      const cleanedAnswer = answer.cloneNode(true) as Element
      cleanedAnswer.removeAttribute('id')
      cleanedAnswer.removeAttribute('role')
      cleanedAnswer.removeAttribute('hidden')
      cleanedAnswer.removeAttribute('aria-labelledby')
      details.appendChild(cleanedAnswer)
    }

    item.replaceWith(details)
  })
}

export function routeToFilename(routePath: string): string {
  if (routePath === '/') return 'index.html'
  return `${routePath.replace(/^\//, '')}.html`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Build full HTML page wrapped in DOCTYPE + head + main#main-content.
 * cssHrefs are relative paths from the page's containing directory to each CSS file.
 */
export function buildStaticHtmlPage(input: StaticPageInput): string {
  const sanitized = sanitizeForHtml(input.mainHtml)
  const cssLinks = input.cssHrefs
    .map((href) => `    <link rel="stylesheet" href="${href}">`)
    .join('\n')
  const title = escapeHtml(input.title || input.route.label)
  const description = escapeHtml(input.description)
  return (
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    `    <title>${title}</title>\n` +
    `    <meta name="description" content="${description}">\n` +
    `${cssLinks}\n` +
    '</head>\n' +
    '<body>\n' +
    '    <main id="main-content">\n' +
    `${sanitized}\n` +
    '    </main>\n' +
    '</body>\n' +
    '</html>\n'
  )
}

/**
 * Compute relative CSS hrefs from a given page file back to the css/ directory.
 */
function relativeCssHrefs(
  pageFileAbs: string,
  outputDir: string,
  cssFilenames: readonly string[],
): readonly string[] {
  const fromDir = nodePath.dirname(pageFileAbs)
  const cssDir = nodePath.join(outputDir, 'css')
  const rel = nodePath.relative(fromDir, cssDir)
  const sep = rel === '' ? '' : `${rel}/`
  return cssFilenames.map((f) => `${sep}${f}`)
}

/**
 * Copy every *.css file from <projectRoot>/dist/assets/ into <outputDir>/css/.
 * Returns the list of bare CSS filenames (not absolute paths).
 */
export async function copyDistCssToStaticSite(
  projectRoot: string,
  outputDir: string,
): Promise<readonly string[]> {
  const distAssets = nodePath.join(projectRoot, 'dist', 'assets')
  const cssDir = nodePath.join(outputDir, 'css')
  await fsp.mkdir(cssDir, { recursive: true })

  let entries: readonly string[]
  try {
    entries = await fsp.readdir(distAssets)
  } catch {
    return []
  }

  const cssFilenames = entries.filter((f) => f.endsWith('.css'))
  const copied: string[] = []
  for (const f of cssFilenames) {
    await fsp.copyFile(
      nodePath.join(distAssets, f),
      nodePath.join(cssDir, f),
    )
    copied.push(f)
  }
  return copied
}

/**
 * Top-level: write a per-route static HTML file under outputDir + copy CSS bundles.
 * outputDir is project-relative (e.g. 'static-site').
 */
export async function writeStaticSite(
  projectRoot: string,
  outputDir: string,
  captured: readonly CapturedPage[],
): Promise<StaticSiteResult> {
  const absOutput = nodePath.resolve(projectRoot, outputDir)
  await fsp.mkdir(absOutput, { recursive: true })

  const cssFilenames = await copyDistCssToStaticSite(projectRoot, absOutput)

  const pagePaths: string[] = []
  for (const page of captured) {
    const relative = routeToFilename(page.route.path)
    const abs = nodePath.join(absOutput, relative)
    await fsp.mkdir(nodePath.dirname(abs), { recursive: true })
    const cssHrefs = relativeCssHrefs(abs, absOutput, cssFilenames)
    const content = buildStaticHtmlPage({
      route: page.route,
      title: page.title,
      description: page.description,
      mainHtml: page.mainHtml,
      cssHrefs,
    })
    await fsp.writeFile(abs, content, { encoding: 'utf8' })
    pagePaths.push(abs)
  }

  return {
    outputDir: absOutput,
    pages: pagePaths,
    cssFiles: cssFilenames.map((f) => `css/${f}`),
  }
}
