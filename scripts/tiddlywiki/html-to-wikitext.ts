/// <reference lib="dom" />
// scripts/tiddlywiki/html-to-wikitext.ts
// Minimal HTML → TiddlyWiki wikitext converter for iteration 1.
// Covers common block + inline elements. Leaves unknown HTML inline
// (TW renders inline HTML natively) — 80/20 conversion approach.

import { Window } from 'happy-dom'

/**
 * Convert an HTML fragment string to TiddlyWiki wikitext.
 *
 * Internal-link map rewrites `<a href="URL">text</a>` where URL matches
 * a known key to `[[text|Tiddler Title]]`. External / unmapped hrefs
 * become `[[text|url]]`. Empty href → plain text.
 */
export function htmlToWikitext(
  html: string,
  linkMap: Readonly<Record<string, string>> = {},
): string {
  const window = new Window()
  const { document } = window
  document.body.innerHTML = html
  // happy-dom's HTMLBodyElement is structurally compatible with the
  // standard-DOM Node type our renderers consume, but TypeScript's DOM
  // typings (file-scoped via /// <reference lib="dom" />) reject the
  // nominal mismatch. Single cast at the producer boundary — same
  // pattern as extractors/types.ts parseHtml. Phase 58 Plan 58-05
  // unblock-the-build fix (tsconfig.scripts.json de-excluded this file).
  const rootNode = document.body as unknown as Node
  const out: string[] = []
  renderChildren(rootNode, out, linkMap)
  return normalize(out.join(''))
}

function renderChildren(
  node: Node,
  out: string[],
  linkMap: Readonly<Record<string, string>>,
): void {
  for (let i = 0; i < node.childNodes.length; i += 1) {
    renderNode(node.childNodes[i], out, linkMap)
  }
}

function renderNode(
  node: Node,
  out: string[],
  linkMap: Readonly<Record<string, string>>,
): void {
  if (node.nodeType === 3) {
    out.push((node as Text).data)
    return
  }
  if (node.nodeType !== 1) return
  const el = node as Element
  const tag = el.tagName.toLowerCase()
  switch (tag) {
    case 'h1':
      out.push(`\n! ${inline(el, linkMap)}\n\n`)
      return
    case 'h2':
      out.push(`\n!! ${inline(el, linkMap)}\n\n`)
      return
    case 'h3':
      out.push(`\n!!! ${inline(el, linkMap)}\n\n`)
      return
    case 'h4':
      out.push(`\n!!!! ${inline(el, linkMap)}\n\n`)
      return
    case 'h5':
      out.push(`\n!!!!! ${inline(el, linkMap)}\n\n`)
      return
    case 'h6':
      out.push(`\n!!!!!! ${inline(el, linkMap)}\n\n`)
      return
    case 'p':
      out.push(`\n${inline(el, linkMap)}\n\n`)
      return
    case 'ul': {
      out.push('\n')
      for (const li of Array.from(el.children)) {
        if (li.tagName.toLowerCase() === 'li') {
          out.push(`* ${inline(li as Element, linkMap)}\n`)
        }
      }
      out.push('\n')
      return
    }
    case 'ol': {
      out.push('\n')
      for (const li of Array.from(el.children)) {
        if (li.tagName.toLowerCase() === 'li') {
          out.push(`# ${inline(li as Element, linkMap)}\n`)
        }
      }
      out.push('\n')
      return
    }
    case 'blockquote':
      out.push(`\n<<<\n${inline(el, linkMap).trim()}\n<<<\n\n`)
      return
    case 'hr':
      out.push('\n---\n\n')
      return
    case 'br':
      out.push('\n')
      return
    case 'strong':
    case 'b':
      out.push(`''${inline(el, linkMap)}''`)
      return
    case 'em':
    case 'i':
      out.push(`//${inline(el, linkMap)}//`)
      return
    case 'code':
      out.push(`\`${el.textContent ?? ''}\``)
      return
    case 'pre': {
      const codeInside = el.querySelector('code')
      const codeText = (codeInside ?? el).textContent ?? ''
      out.push(`\n\`\`\`\n${codeText}\n\`\`\`\n\n`)
      return
    }
    case 'a': {
      const href = el.getAttribute('href') ?? ''
      const text = inline(el, linkMap).trim() || href
      if (!href) {
        out.push(text)
        return
      }
      const mapped = linkMap[href]
      if (mapped) {
        out.push(`[[${text}|${mapped}]]`)
        return
      }
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        out.push(`[[${text}|${href}]]`)
        return
      }
      // Internal href not in map — keep as wikitext external link with the raw href
      out.push(`[[${text}|${href}]]`)
      return
    }
    case 'img': {
      const alt = el.getAttribute('alt') ?? ''
      const src = el.getAttribute('src') ?? ''
      if (alt) out.push(alt)
      else if (src) out.push(`[img[${src}]]`)
      return
    }
    case 'script':
    case 'style':
    case 'noscript':
      return
    case 'div':
    case 'section':
    case 'article':
    case 'aside':
    case 'main':
    case 'header':
    case 'footer':
    case 'nav': {
      // Block-level container: render children, add trailing newlines
      renderChildren(el, out, linkMap)
      out.push('\n\n')
      return
    }
    default: {
      // Unknown / specialized tags: pass through as HTML, render children inline
      const attrs = attrString(el)
      out.push(`<${tag}${attrs}>`)
      renderChildren(el, out, linkMap)
      out.push(`</${tag}>`)
      return
    }
  }
}

function inline(
  el: Element,
  linkMap: Readonly<Record<string, string>>,
): string {
  const inner: string[] = []
  renderChildren(el, inner, linkMap)
  return inner.join('').trim()
}

function attrString(el: Element): string {
  const attrs = Array.from(el.attributes)
  if (attrs.length === 0) return ''
  return ' ' + attrs.map((a) => `${a.name}="${a.value}"`).join(' ')
}

/**
 * Normalize whitespace: collapse 3+ consecutive newlines to 2,
 * trim leading/trailing blank lines.
 */
function normalize(s: string): string {
  return s.replace(/\n{3,}/g, '\n\n').replace(/^\s+|\s+$/g, '') + '\n'
}
