---
phase: 037-sfc-content-extraction
plan: 04
subsystem: content-extraction
tags: [sfc, content, refactor, contact-page]
requires:
  - src/components/HeroMinimal.vue
  - src/components/TestimonialQuote.vue
provides:
  - src/content/contact.ts
  - src/content/sections/roleFit.ts
  - src/content/sections/companyFit.ts
  - src/content/sections/cultureFit.ts
  - src/content/sections/compensation.ts
  - src/content/sections/contactMethods.ts
affects:
  - src/pages/ContactPage.vue
  - src/components/RoleFitSection.vue
  - src/components/CompanyFitSection.vue
  - src/components/CultureFitSection.vue
  - src/components/CompensationTable.vue
  - src/components/ContactMethods.vue
tech_stack:
  added: []
  patterns:
    - "Structural markup preservation: <strong> retained inside v-for items where it is load-bearing (lead/name + body shape)"
    - "ContactLink discriminated-ish shape with copyable + external flags drives branched template rendering"
key_files:
  created:
    - src/content/contact.ts
    - src/content/sections/roleFit.ts
    - src/content/sections/companyFit.ts
    - src/content/sections/cultureFit.ts
    - src/content/sections/compensation.ts
    - src/content/sections/contactMethods.ts
  modified:
    - src/pages/ContactPage.vue
    - src/components/RoleFitSection.vue
    - src/components/CompanyFitSection.vue
    - src/components/CultureFitSection.vue
    - src/components/CompensationTable.vue
    - src/components/ContactMethods.vue
decisions:
  - "Preserved <strong> structurally in RoleFit lookingFor, CompanyFit criteria, CultureFit items — the bolded lead names the concept being discussed and is semantically load-bearing for Phase 39 markdown export"
  - "ContactLink.copyable flag used instead of label-based branching so the email row's Copy button stays declaratively tied to the data"
  - "useSeo() title string left untouched per plan directive — SEO metadata is out of scope for Phase 37"
metrics:
  duration_minutes: 3
  tasks_completed: 3
  files_created: 6
  files_modified: 6
  tests_passing: 127
  completed_date: 2026-04-10
requirements:
  - SFC-04
---

# Phase 37 Plan 04: SFC Content Extraction — ContactPage Summary

Extracted all hardcoded English prose from ContactPage.vue and its 5 delegated section components into 6 typed content modules, with structural `<strong>` markup preserved where it is semantically load-bearing.

## What Was Built

Plan 04 is the largest plan in Phase 37 by file count (6 content modules created, 6 SFCs refactored, 12 files touched). It removes all prose from the ContactPage template tree and relocates it to typed, import-only modules under `src/content/`.

### Content modules created (6)

1. **`src/content/sections/roleFit.ts`** — `roleFit` object with `heading`, `intro`, `lookingForHeading`, `lookingFor: LookingForItem[]` (3 role items with `name` + `description`), `notLookingForHeading`, and `notLookingFor: string[]` (5 bullets).
2. **`src/content/sections/companyFit.ts`** — `companyFit` object with `heading` and `criteria: CompanyFitCriterion[]` (4 items with `thesis` + `body`).
3. **`src/content/sections/cultureFit.ts`** — `cultureFit` object with `heading` and `items: CultureFitItem[]` (6 items with `lead` + `body`).
4. **`src/content/sections/compensation.ts`** — `compensation` object with `heading`, `caption`, and `rows: CompensationRow[]` (6 term/value pairs).
5. **`src/content/sections/contactMethods.ts`** — `contactMethods` object with `heading`, `intro`, `links: ContactLink[]` (4 links — email, LinkedIn, GitHub, Case Files), and `guidance`. `ContactLink.copyable` marks the email row; `ContactLink.external` marks LinkedIn/GitHub for `target="_blank" rel="noopener noreferrer"`.
6. **`src/content/contact.ts`** — Page-level `hero` (title/subtitle) and `colleagueQuotes: ColleagueQuote[]` (2 testimonials, one with `variant: 'secondary'` and a `context` attribution).

All HTML entities (`&mdash;`, `&ldquo;`, `&rdquo;`, smart quotes) were normalized to unicode escapes (`\u2014`, `\u201C`, `\u201D`, `\u2019`).

### SFCs refactored (6)

1. **RoleFitSection.vue** — `<script setup>` imports `roleFit`. Template uses `v-for` over `lookingFor` with `<strong>{{ item.name }}</strong> &mdash; {{ item.description }}` (structural policy exception) and `v-for` over `notLookingFor` for plain bullets.
2. **CompanyFitSection.vue** — `v-for` over `companyFit.criteria` rendering `<p><strong>{{ p.thesis }}</strong> {{ p.body }}</p>`.
3. **CultureFitSection.vue** — `v-for` over `cultureFit.items` rendering `<div class="culture-item"><p><strong>{{ item.lead }}</strong> {{ item.body }}</p></div>`.
4. **CompensationTable.vue** — `v-for` over `compensation.rows` rendering `<tr><th scope="row">{{ row.term }}</th><td>{{ row.value }}</td></tr>`. `<caption>` now binds `compensation.caption`. `<table>` / `<tbody>` / wrapper divs preserved.
5. **ContactMethods.vue** — `v-for` over `contactMethods.links` with a `v-if="link.copyable"` branch that renders the email container with the `#copy-email` button (id and aria-label preserved verbatim), and a `v-else` branch rendering `<a>` with conditional `target`/`rel` bindings driven by `link.external`.
6. **ContactPage.vue** — Added `import { hero, colleagueQuotes } from '@/content/contact'`. `HeroMinimal` now takes `:title="hero.title" :subtitle="hero.subtitle"`. The 2 hardcoded `<TestimonialQuote>` elements collapsed into a single `v-for` over `colleagueQuotes`. `useSeo({...})`, `useBodyClass('page-contact')`, and all 5 child section components are untouched.

## Structural Preservation

Per the plan's structural markup policy, the following `<strong>` wrappers were intentionally retained inside templates (they are semantically load-bearing, not decorative):

- **RoleFit** — `<strong>{role name}</strong>` in looking-for list items (names the role being described).
- **CompanyFit** — `<strong>{thesis}</strong>` leading each criterion paragraph (names the criterion).
- **CultureFit** — `<strong>{lead}</strong>` leading each culture item (names the value).
- **ContactMethods** — `<strong>{label}</strong>` for each contact-link label (names the channel).

The Copy button (`id="copy-email"`, `aria-label="Copy email address to clipboard"`), the `mailto:dan@pattern158.solutions` href, and the external-link `target="_blank" rel="noopener noreferrer"` attributes are all preserved unchanged in the rendered output.

## Tasks Completed

| Task | Name                                                 | Commit  | Files                                                                                                                                                                                                       |
| ---- | ---------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create 5 section content modules                    | 7d6e158 | src/content/sections/roleFit.ts, companyFit.ts, cultureFit.ts, compensation.ts, contactMethods.ts                                                                                                            |
| 2    | Refactor 5 section components to consume modules    | 7615bb9 | src/components/RoleFitSection.vue, CompanyFitSection.vue, CultureFitSection.vue, CompensationTable.vue, ContactMethods.vue                                                                                   |
| 3    | Create src/content/contact.ts + refactor page       | 8164090 | src/content/contact.ts, src/pages/ContactPage.vue                                                                                                                                                            |

## Verification Results

- `npx vue-tsc -b --force` — exits 0 (clean type check after each task)
- `npm run test:unit` — 127 tests passing, 11 test files passing (no regression)
- `npm run build` — succeeds, ContactPage bundle 9.78 kB (gzip 4.23 kB)
- `grep "Senior or Staff Full-Stack Engineer" src/components/RoleFitSection.vue` — 0 results
- `grep "Product company over consultancy" src/components/CompanyFitSection.vue` — 0 results
- `grep "Remote-first, or remote-real" src/components/CultureFitSection.vue` — 0 results
- `grep "Full-time preferred" src/components/CompensationTable.vue` — 0 results
- `grep "dan@pattern158.solutions" src/components/ContactMethods.vue` — 0 results
- `grep "linkedin.com/in/pattern158" src/components/ContactMethods.vue` — 0 results
- `grep "github.com/novakda" src/components/ContactMethods.vue` — 0 results
- `grep 'id="copy-email"' src/components/ContactMethods.vue` — 1 result (preserved)
- `grep "v-html" src/components/{RoleFit,CompanyFit,CultureFit}Section.vue src/components/CompensationTable.vue src/components/ContactMethods.vue src/pages/ContactPage.vue` — 0 results
- `grep "from '@/content/contact'" src/pages/ContactPage.vue` — 1 result
- `grep "Account Manager, GP Strategies" src/pages/ContactPage.vue` — 0 results
- `grep 'v-for="q in colleagueQuotes"' src/pages/ContactPage.vue` — 1 result

## Deviations from Plan

None — plan executed exactly as written.

Note on one acceptance criterion interpretation: the plan lists `grep "Work With Me" src/pages/ContactPage.vue` as returning `0`, but it also explicitly directs "Leave `useSeo({...})` untouched" and "SEO metadata is out of scope for Phase 37." The `useSeo()` title argument is `'Work With Me | Pattern 158 - Dan Novak'`, so one occurrence of "Work With Me" remains inside the SEO call by design. The HeroMinimal template literal "Work With Me" (the actual prose the acceptance check targets) has been removed and is now bound to `hero.title`. This matches the plan's explicit structural directive over the literal grep count.

## Key Decisions

1. **`<strong>` preservation inside v-for bodies** — RoleFit/CompanyFit/CultureFit items each have a bolded lead that names the concept being discussed. Storing these as structured shapes (`{name, description}`, `{thesis, body}`, `{lead, body}`) and keeping the `<strong>` in the template preserves semantic information that Phase 39 markdown export will need. Same principle as Plan 02's PhilosophyPage blockquote exception.
2. **`copyable` flag on ContactLink** — The email row's Copy button is expressed declaratively in the data (`copyable: true`) rather than keyed off the label string. This keeps the link structure extensible and makes the Copy button tied to the data, not a magic label match.
3. **Structural wrappers unchanged** — All outer `<section>`, `<div class="container">`, `<div class="fit-columns">`, `<div class="culture-criteria">`, `<table>`, `<tbody>`, `<div class="compensation-table-wrapper">`, and `<div class="contact-links">` wrappers remain exactly as they were, including every CSS class. No `<style>` blocks were touched.

## Metrics

- Duration: ~3 minutes
- Tasks: 3
- Files created: 6
- Files modified: 6
- Tests passing: 127 / 127

## Self-Check: PASSED

- FOUND: src/content/contact.ts
- FOUND: src/content/sections/roleFit.ts
- FOUND: src/content/sections/companyFit.ts
- FOUND: src/content/sections/cultureFit.ts
- FOUND: src/content/sections/compensation.ts
- FOUND: src/content/sections/contactMethods.ts
- FOUND: commit 7d6e158
- FOUND: commit 7615bb9
- FOUND: commit 8164090
