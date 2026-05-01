---
phase: 037-sfc-content-extraction
plan: 05
subsystem: content-extraction
tags: [sfc, content-module, accessibility, refactor, v7.0]
requires:
  - src/pages/AccessibilityPage.vue (pre-refactor verbatim prose)
provides:
  - src/content/accessibility.ts (10 named exports + 2 interfaces)
  - AccessibilityPage.vue fully data-bound
affects:
  - src/pages/AccessibilityPage.vue
tech-stack:
  added: []
  patterns:
    - "LabeledBullet + DefinitionListItem interfaces (shared shape with Plans 02/04)"
    - "template v-for over DefinitionListItem[] for <dl>/<dt>/<dd> pairs"
    - ":href binding on mailto anchor, :to binding on router-link — structural elements preserved"
key-files:
  created:
    - src/content/accessibility.ts
  modified:
    - src/pages/AccessibilityPage.vue
decisions:
  - "Definition list rendered via <template v-for> wrapping <dt>/<dd> pairs — keeps <dl> as a single semantic unit while iterating the methods array"
  - "Feedback list keeps mailto <a> and <router-link> as structural template elements; only href/to/display text bound from content module — no link abstraction into data"
  - "Features bullets use space separator between <strong>label</strong> and body (not em-dash) to preserve original prose punctuation from lines 95-104"
metrics:
  duration: "2m 23s"
  tasks: 2
  files_created: 1
  files_modified: 1
  tests_passing: 127
  completed: 2026-04-10
---

# Phase 37 Plan 05: AccessibilityPage Content Extraction Summary

Extracted 130+ lines of accessibility-statement prose from `AccessibilityPage.vue` into a typed `src/content/accessibility.ts` module (10 exports, 2 interfaces), preserving the definition list, mailto link, and router-link as structural template elements while data-binding all display text.

## Tasks Completed

| Task | Name                                          | Commit    |
| ---- | --------------------------------------------- | --------- |
| 1    | Create `src/content/accessibility.ts`         | `677bfe0` |
| 2    | Refactor `AccessibilityPage.vue` to consume it | `b200b39` |

## What Was Built

### `src/content/accessibility.ts` (new)

Named exports:

- `hero` — `{ title, lead }`
- `commitment` — `{ heading, body }`
- `standards` — `{ heading, intro, bullets: LabeledBullet[] }`
- `testing` — `{ heading, intro, methods: DefinitionListItem[] }`
- `currentStatus` — `{ heading, lastVerifiedLabel, lastVerifiedValue, testResultsLabel, results: string[] }`
- `browsers` — `{ heading, browsersIntro, browserList, assistiveIntro, assistiveList }`
- `features` — `{ heading, intro, bullets: LabeledBullet[] }`
- `knownIssues` — `{ heading, intro, issues, outro }`
- `feedback` — `{ heading, intro, emailLabel, emailHref, emailDisplay, contactPageLabel, contactPageTo, contactPageDisplay, outro }`
- `technicalSpecs` — `{ heading, intro, bullets: string[] }`

Interfaces:

- `DefinitionListItem` — `{ term, description }`
- `LabeledBullet` — `{ label, body }`

HTML entities normalized to unicode escapes:

- `&rarr;` → `\u2192`
- `&ldquo;` / `&rdquo;` → `\u201C` / `\u201D`
- `'` → `\u2019` (apostrophe in "website's")

### `src/pages/AccessibilityPage.vue` (refactored)

- Added named imports from `@/content/accessibility`
- `HeroMinimal :title="hero.title"` + `<p class="lead">{{ hero.lead }}</p>`
- Each `<h2>` and paragraph bound via `{{ section.heading }}` / `{{ section.body }}`
- `standards.bullets` → `v-for` with `<strong>` + ` — ` separator
- `testing.methods` → `<dl><template v-for>...<dt>/<dd></template></dl>` (single `<dl>` preserved)
- `currentStatus.results`, `browsers.browserList`, `browsers.assistiveList`, `features.bullets`, `knownIssues.issues`, `technicalSpecs.bullets` → `v-for` lists
- Feedback list preserves `<a :href="feedback.emailHref">` mailto anchor and `<router-link :to="feedback.contactPageTo">` with only display text bound
- All structural markup (`<section class="content-section">`, `<div class="container">`, `<dl>`, `<ul>`, `<router-link>`) preserved
- `useBodyClass('page-accessibility')` and `useSeo({...})` unchanged

## Verification

- `npx vue-tsc -b --force` — exit 0
- `npm run test:unit` — 127/127 passing (11 test files)
- `npm run build` — success, `AccessibilityPage-gHr0kKrQ.js` 8.16 kB
- `grep -r "Accessibility Statement" src/pages/` — 0 matches
- `grep -r "axe-core" src/pages/` — 0 matches
- `grep -c "<router-link" src/pages/AccessibilityPage.vue` — 1 (preserved)
- `grep -c "<dl" src/pages/AccessibilityPage.vue` — 1 (preserved)
- `grep -c "v-html" src/pages/AccessibilityPage.vue` — 0 (forbidden)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/content/accessibility.ts` — FOUND
- `src/pages/AccessibilityPage.vue` — FOUND (refactored)
- Commit `677bfe0` — FOUND in git log
- Commit `b200b39` — FOUND in git log
