// src/data/__tests__/loaders.thin.test.ts
//
// LOAD-01: Thin-loader invariant enforcement test.
//
// Allowed top-level constructs in a thin loader:
//   1. `import type { ... }` statements
//   2. `import <name> from './json/*.json'` statements
//   3. `export type { ... }` re-exports
//   4. `export const <name>: <Type> = <data>[ as <Type>]` — single-line assignments from imported JSON
//   5. `export const <name> = [...] as const satisfies ...` — literal const registries
//      (e.g. `faqCategories` in `faq.ts` — a compile-time-only registry, NOT a runtime transform)
//
// Loaders MAY NOT call `.sort()`, `.filter()`, `.map()`, `.reduce()`, `computed()`, `ref()`,
// `reactive()`, or any data-transforming function. Loaders MAY NOT define classes, functions,
// or exported helpers.
//
// This test reads every `src/data/*.ts` file as a string and greps for forbidden identifiers.
// It does NOT import loaders — it is a meta-test over source text.

import { describe, it, expect } from 'vitest'
import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOADERS_DIR = join(__dirname, '..')

const FORBIDDEN_TOKENS: Array<{ token: RegExp; reason: string }> = [
  { token: /\.filter\s*\(/, reason: 'loaders may not filter data' },
  { token: /\.map\s*\(/, reason: 'loaders may not map data' },
  { token: /\.sort\s*\(/, reason: 'loaders may not sort data' },
  { token: /\.reduce\s*\(/, reason: 'loaders may not reduce data' },
  { token: /\bcomputed\s*\(/, reason: 'loaders may not expose computed refs' },
  { token: /\bref\s*\(/, reason: 'loaders may not expose refs' },
  { token: /\breactive\s*\(/, reason: 'loaders may not expose reactive()' },
  { token: /\bwatch\s*\(/, reason: 'loaders may not register watchers' },
]

async function listLoaderFiles(): Promise<string[]> {
  const files = await readdir(LOADERS_DIR)
  return files.filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
}

describe('LOAD-01: thin-loader invariant', () => {
  it('every src/data/*.ts loader is thin (no sort/filter/map/reduce/computed/ref/reactive/watch)', async () => {
    const loaders = await listLoaderFiles()

    expect(loaders.length).toBeGreaterThan(0)

    const violations: string[] = []
    for (const loader of loaders) {
      const source = await readFile(join(LOADERS_DIR, loader), 'utf8')
      for (const { token, reason } of FORBIDDEN_TOKENS) {
        if (token.test(source)) {
          violations.push(`${loader}: ${reason} (matched ${token.source})`)
        }
      }
    }

    expect(violations, `Loader violations:\n${violations.join('\n')}`).toEqual([])
  })

  it('every src/data/*.ts loader imports its JSON sibling', async () => {
    const loaders = await listLoaderFiles()

    expect(loaders.length).toBeGreaterThan(0)

    for (const loader of loaders) {
      const source = await readFile(join(LOADERS_DIR, loader), 'utf8')
      expect(
        source,
        `${loader} should import from ./json/*.json`,
      ).toMatch(/import\s+\w+\s+from\s+['"]\.\/json\/[\w.-]+\.json['"]/)
    }
  })

  it('faq.ts faqCategories literal registry is allowed (as const satisfies pattern)', async () => {
    const source = await readFile(join(LOADERS_DIR, 'faq.ts'), 'utf8')
    // This assertion documents the edge case: faqCategories is a compile-time literal
    // registry, NOT a runtime data transform. It must continue to pass the forbidden-
    // token grep organically because it contains no `.filter`/`.map`/`.sort`/etc.
    expect(source).toMatch(/faqCategories\s*=\s*\[/)
    expect(source).toMatch(/as const satisfies/)
  })
})
