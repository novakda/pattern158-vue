# Phase 5: Exhibit Audit - Research

**Researched:** 2026-03-18
**Domain:** Content audit, Playwright screenshot capture, structured comparison documentation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Audit output lives in `.planning/phases/05-exhibit-audit/` as a markdown file (planning artifact, not deployed)
- Structure: compact comparison table (at-a-glance view) + classified variations narrative (explains each notable difference)
- Table: one row per exhibit (A-O), columns for every field: `quotes`, `contextHeading`, `contextText`, `resolutionTable`, `isDetailExhibit`, `investigationReport`, plus a Classification column per row
- Four classification categories: `intentional`, `formatting-inconsistency`, `content-gap`, `needs-review`
- Claude applies classification; Dan reviews and overrides; ambiguous cases get `needs-review` with explanation
- Audit scope: all visible content fields (`quotes`, `contextHeading`, `contextText`, `resolutionTable`, `impactTags`) plus both flags (`isDetailExhibit`, `investigationReport`)
- Explicit finding required: `investigationReport` flag exists in `exhibits.ts` but is NOT rendered anywhere in `ExhibitDetailPage.vue` — must be documented as a concrete finding for Phase 6
- Cross-reference 11ty source: each exhibit's `.html` page must be checked to identify content that exists in source but is missing from `exhibits.ts`
- Screenshot all 15 exhibits at 375px, 768px, and 1280px (the project's established breakpoints)
- No predefined canonical ideal structure — "best of breed" call is made after reviewing the full screenshot set
- Audit document must be readable as a standalone document without any additional context

### Claude's Discretion
- Exact markdown formatting and organization within the audit document
- Screenshot naming convention and storage location within the phase directory
- How to handle exhibits where 11ty source is unavailable or ambiguous

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUDIT-01 | Produce structured per-exhibit comparison table documenting all section variations (headings, quotes, tables, flags) across all 15 exhibits | Fully supported: all 15 exhibit entries in `exhibits.ts` are enumerated; all variation patterns are pre-identified in CONTEXT.md; comparison table schema is defined |
| AUDIT-02 | Classify each variation as intentional (content-driven), formatting inconsistency (fixable), or content gap (needs review) | Supported: four-category classification schema defined in CONTEXT.md; 11ty source cross-referencing provides the evidence needed to assign classifications |
</phase_requirements>

---

## Summary

Phase 5 is a documentation-only audit phase. No code or content changes are made. The deliverable is a single markdown audit document in `.planning/phases/05-exhibit-audit/` that (1) presents all 15 exhibit entries in a structured comparison table, (2) classifies every identified variation, (3) documents the `investigationReport` rendering gap as a concrete finding, and (4) cross-references the 11ty HTML source to identify content gaps.

The supporting work is a Playwright screenshot capture of all 15 exhibits at three breakpoints (375px, 768px, 1280px), stored in a dedicated folder within the phase directory. After reviewing the screenshots, Claude identifies "best of breed" exhibits — those that are visually complete and structurally clear — and names them as reference targets for Phase 6 normalization.

All variation data is already fully enumerable from `exhibits.ts` via code inspection without running the app. The pre-identified variations from CONTEXT.md (contextHeading label differences, absent contextText on A and D, quotes only on 7 of 15 exhibits, resolutionTable only on A, investigationReport on J–N, false on O) are confirmed by direct reading of the data file. The 11ty source cross-reference is needed specifically for Exhibit D (has a quote but no contextText in `exhibits.ts`) and Exhibit A (has fewer quotes in `exhibits.ts` than in the 11ty source).

**Primary recommendation:** Execute audit as a two-task sequence — (1) Playwright screenshot capture of all 15 exhibits, (2) write the full audit document incorporating both the comparison table and the visual best-of-breed assessment. The screenshot task runs first so the audit author has the visual evidence when writing classifications.

---

## What the Data Audit Already Knows

All variation data is enumerable directly from `exhibits.ts` without running the application. The following is confirmed by reading the file:

### Pre-Enumerated Field Matrix

| Exhibit | quotes | contextHeading | contextText | resolutionTable | isDetailExhibit | investigationReport |
|---------|--------|---------------|-------------|-----------------|-----------------|---------------------|
| A | 2 quotes (1 missing attribution) | absent | absent | 5-row table | true | absent |
| B | 2 quotes | "Context" | present | absent | absent | absent |
| C | absent | "Context" | present | absent | true | absent |
| D | 1 quote (with role) | absent | absent | absent | absent | absent |
| E | absent | "Context" | present | absent | true | absent |
| F | 1 quote | "Context" | present | absent | absent | absent |
| G | 1 quote | "Context" | present | absent | absent | absent |
| H | 1 quote | "Context" | present | absent | absent | absent |
| I | 1 quote | "Context" | present | absent | absent | absent |
| J | absent | "Investigation Summary" | present | absent | true | true |
| K | absent | "Investigation Summary" | present | absent | true | true |
| L | absent | "Investigation Summary" | present | absent | true | true |
| M | absent | "Context" | present | absent | true | true |
| N | absent | "Context" | present | absent | true | true |
| O | absent | "Context" | present | absent | true | false |

### Key Variations Identified

**contextHeading label split:**
- "Context" — exhibits B, C, E, F, G, H, I, M, N, O (10 exhibits)
- "Investigation Summary" — exhibits J, K, L (3 exhibits)
- Absent — exhibits A, D (2 exhibits)

**contextText absent:**
- Exhibit A: has `resolutionTable` but no contextText — unique structure
- Exhibit D: has a quote but no contextText — content may exist in 11ty source (confirmed: background narrative exists in 11ty exhibit-d.html)

**quotes distribution:**
- Present: A, B, D, F, G, H, I (7 exhibits)
- Absent: C, E, J, K, L, M, N, O (8 exhibits)

**investigationReport flag:**
- `true`: J, K, L, M, N
- `false` (explicit): O
- Absent from schema: A, B, C, D, E, F, G, H, I

**isDetailExhibit flag:**
- `true`: A, C, E, J, K, L, M, N, O
- Absent from schema: B, D, F, G, H, I

**resolutionTable:**
- Only Exhibit A has a resolutionTable — unique across all 15

**quotes attribution completeness:**
- Exhibit A, quote 2: `attribution` is empty string `""` — only exhibit where attribution is present but blank (the `role` field provides context instead)

---

## Critical Finding: investigationReport Rendering Gap

Confirmed by reading `ExhibitDetailPage.vue`: the `investigationReport` boolean field is present on the `Exhibit` interface in `exhibits.ts` but is **never read or rendered** in `ExhibitDetailPage.vue`. The template renders: quotes, contextText/contextHeading, resolutionTable, impactTags. There is no `v-if="exhibit.investigationReport"` or any reference to the flag in the component.

This is a concrete, verified finding that the audit document must state. It feeds directly into Phase 6 (STRUCT-02).

---

## 11ty Source Cross-Reference Findings

The 11ty source is at: `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f/exhibits/`

Raw file base URL: `https://raw.githubusercontent.com/novakda/pattern158.solutions/deploy/20260315-feat-auto-generate-deploy-branch-names-f/exhibits/`

### Exhibit A (11ty vs. exhibits.ts)

The 11ty source contains significantly more quotes than `exhibits.ts` captures:

| Source | Quotes in 11ty | Quotes in exhibits.ts |
|--------|---------------|----------------------|
| Chief of Learning Services | 3 quotes (August 2018, January 2020, and a third) | Not included |
| GP Strategies Sr. Director | "I hear you did an AWESOME job onsite..." | Not in exhibits.ts (present in Exhibit B data instead) |
| GP Strategies Director | "Thanks for all the great work..." | Captured |
| "Thank you Dan for working with us..." | Present | Captured (as second quote with empty attribution) |

The 11ty also contains: a full timeline of engagement (2017-2022), root cause analysis narrative, quantified impact metrics (574 emails, 49 contacts), and extended engagement outcomes beyond what contextText would capture. These richer sections are intentionally not ported — the current exhibits.ts captures a curated summary.

**Audit classification for A's missing contextText:** The 11ty page has extensive background narrative. Exhibit A is the only exhibit with a `resolutionTable` but no `contextText`. Classification: `content-gap` — Exhibit A has 11ty source content that could populate contextText, but the question of whether to add it requires Dan's decision.

### Exhibit D (11ty vs. exhibits.ts)

The 11ty source for Exhibit D contains:
- The same quote already in exhibits.ts
- A second quote: "I can't thank you enough. I know you're working with little heads up right now."
- A full background narrative section describing the Wells Fargo 100+ course migration, QA methodology, IE/Flash SCORM diagnosis
- Quantified impact: 223 tracked emails, 6-month engagement, 100+ courses

**Audit classification for D's missing contextText:** `content-gap` — 11ty source has background narrative not reflected in `exhibits.ts`. The second quote is also missing. Dan must decide whether to port this content.

### Other Exhibits

The 11ty source for exhibits with both quotes and contextText (B, F, G, H, I) generally aligns with what's in `exhibits.ts`. No material gaps were identified from sampling. The investigation report exhibits (J, K, L, M, N) have richer forensic narrative in the 11ty source but the contextText in exhibits.ts captures reasonable summaries.

The full per-exhibit 11ty cross-reference must be completed as part of the audit execution — all 15 exhibits (A through O) must be fetched and checked. Research has confirmed the pattern and identified the two highest-priority gaps (A and D). The remaining 13 should be checked methodically during the audit task.

---

## Architecture: Audit Document Structure

### File Location
```
.planning/phases/05-exhibit-audit/
├── 05-01-AUDIT.md          # The audit document (primary deliverable)
└── screenshots/            # Playwright screenshot output
    ├── exhibit-a-375.png
    ├── exhibit-a-768.png
    ├── exhibit-a-1280.png
    ... (45 total: 15 exhibits × 3 breakpoints)
```

### Audit Document Sections

```
# Exhibit Audit: Content Comparison and Classification

## Summary of Findings
[executive overview — key patterns, counts, recommended action items]

## Comparison Table
[one row per exhibit A-O, all auditable fields, Classification column]

## Classified Variations
[narrative section — each notable variation explained and classified]

## Critical Finding: investigationReport Rendering Gap
[concrete finding: field exists in data, not rendered in ExhibitDetailPage.vue]

## 11ty Source Cross-Reference
[per-exhibit: what's in 11ty vs. what's in exhibits.ts, gaps documented]

## Visual Assessment: Best of Breed
[after screenshot review: which exhibits serve as normalization reference targets]

## Recommended Actions for Phase 6 and Phase 7
[structured hand-off — what STRUCT-01/02/03 and CONT-01/02 address]
```

### Comparison Table Schema

```markdown
| Exhibit | quotes | contextHeading | contextText | resolutionTable | isDetailExhibit | investigationReport | Classification | Notes |
|---------|--------|---------------|-------------|-----------------|-----------------|---------------------|----------------|-------|
| A       | 2      | absent        | absent      | 5-row           | true            | absent              | ...            | ...   |
```

The Classification column applies to the row as a whole — the most significant variation for that exhibit. Individual field-level classifications are documented in the Classified Variations narrative section.

---

## Playwright Screenshot Approach

### How Prior Screenshots Were Taken

The project has no persistent Playwright script. Prior screenshots in `verify-screenshots/` were taken ad-hoc during verify/implementation tasks using a Playwright script written inline (Node.js with `playwright` npm package). The project has `playwright: ^1.58.2` installed as a devDependency.

The pattern is: write a Node.js script, run `node script.js` with the dev server running, screenshots output to a specified directory.

### Screenshot Script Pattern

```javascript
// Takes screenshots of all 15 exhibit pages at 3 breakpoints
// Run: node .planning/phases/05-exhibit-audit/screenshot-exhibits.js
// Requires: dev server running on http://localhost:5173

const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const exhibits = [
  'exhibit-a', 'exhibit-b', 'exhibit-c', 'exhibit-d', 'exhibit-e',
  'exhibit-f', 'exhibit-g', 'exhibit-h', 'exhibit-i', 'exhibit-j',
  'exhibit-k', 'exhibit-l', 'exhibit-m', 'exhibit-n', 'exhibit-o',
]

const breakpoints = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
]

const outputDir = path.join(__dirname, 'screenshots')
fs.mkdirSync(outputDir, { recursive: true })

;(async () => {
  const browser = await chromium.launch()
  for (const exhibit of exhibits) {
    for (const bp of breakpoints) {
      const page = await browser.newPage()
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto(`http://localhost:5173/exhibits/${exhibit}`)
      await page.waitForLoadState('networkidle')
      const filename = `${exhibit}-${bp.name}.png`
      await page.screenshot({
        path: path.join(outputDir, filename),
        fullPage: true,
      })
      await page.close()
      console.log(`Captured: ${filename}`)
    }
  }
  await browser.close()
  console.log('Done. 45 screenshots captured.')
})()
```

**Key considerations:**
- `fullPage: true` is required — exhibit pages may be taller than the viewport
- `waitForLoadState('networkidle')` ensures Vue router has resolved the exhibit before screenshot
- Dev server must be running (`npm run dev`) before the script executes
- The script file lives in the phase directory and is a planning artifact (not committed to src/)

### Screenshot Naming Convention

`{exhibit-slug}-{breakpoint}.png` — e.g., `exhibit-a-375.png`, `exhibit-j-1280.png`

This follows the pattern established by `verify-screenshots/` (e.g., `04-exhibit-a-1280.png`) but uses a simpler, flatter naming scheme since all files are exhibit screenshots at known breakpoints.

---

## Classification Schema Reference

| Category | When to Apply | Example |
|----------|--------------|---------|
| `intentional` | The variation exists because of the specific content — different content reasonably requires different structure | Exhibit A has a resolution table because it was a multi-issue technical engagement; no other exhibit has this kind of documented issue/resolution pair |
| `formatting-inconsistency` | The variation looks inconsistent but the correct value is determinable without a content decision | contextHeading "Context" vs. "Investigation Summary" — the label should follow the `investigationReport` flag; exhibits where the flag is true should use "Investigation Summary" |
| `content-gap` | Content that exists in the 11ty source but is absent from exhibits.ts — requires Dan's decision before porting | Exhibit D missing contextText when 11ty has a background narrative; Exhibit A missing contextText when 11ty has extensive background |
| `needs-review` | Auditor cannot determine intent from available evidence — Dan must decide | Cases where 11ty source is ambiguous, absent, or where the rationale for the variation is unclear |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Exhibit data enumeration | Parse HTML files or run the app | Read `exhibits.ts` directly | All 15 entries with all fields are in one TypeScript file; no execution needed |
| Screenshot infrastructure | Custom page-object model, test harness | One-off Node.js script using `playwright` (already installed) | This is a one-time audit task; no reusable framework needed |
| Diff detection between 11ty and exhibits.ts | Automated comparison script | Manual fetch + reading | 15 files, one-time audit; automation adds complexity without value |
| Classification algorithm | Rule-based code | Human judgment by Claude, table in markdown | Classification requires contextual judgment, not pattern matching |

---

## Common Pitfalls

### Pitfall 1: Dev Server Must Be Running for Screenshots
**What goes wrong:** The Playwright script navigates to `http://localhost:5173/exhibits/*` — if the dev server is not running, all screenshots will be blank error pages or connection refused.
**Why it happens:** Vue Router handles exhibit routes client-side; there is no static file at that URL.
**How to avoid:** Start `npm run dev` first, wait for it to report "ready", then run the screenshot script. Verify the first screenshot manually before capturing all 45.
**Warning signs:** Screenshots show blank white page or Vite error screen.

### Pitfall 2: Exhibit D Has No Route Redirect Issue
**What goes wrong:** Exhibit D has no `isDetailExhibit` or `investigationReport` flag — implementer may assume it's incomplete or broken.
**Why it happens:** These flags are optional; their absence is a data fact, not a bug.
**How to avoid:** Treat absent fields as `undefined` in the comparison table — document them as absent, not missing. The classification explains whether absence is intentional.

### Pitfall 3: Confusing "absent field" with "content gap"
**What goes wrong:** Marking every absent optional field as `content-gap` — overstating the gap list.
**Why it happens:** Every optional field being undefined looks like a gap.
**How to avoid:** A field is a `content-gap` only when the 11ty source has corresponding content that is not in exhibits.ts. A field that is absent in both the 11ty source and exhibits.ts is either `intentional` (content doesn't warrant it) or `needs-review`.

### Pitfall 4: investigationReport flag vs. investigationReport rendering
**What goes wrong:** Conflating the data model question (which exhibits have the flag set) with the rendering question (the flag is never rendered at all).
**Why it happens:** Two distinct issues share the same field name.
**How to avoid:** The audit document must state both: (a) the per-exhibit flag values in the comparison table, and (b) the concrete finding that the flag is not rendered anywhere in ExhibitDetailPage.vue — these are separate findings that feed into separate Phase 6 tasks.

### Pitfall 5: Incomplete 11ty source fetch
**What goes wrong:** Only fetching the exhibits with known gaps (A, D) and missing gaps in other exhibits.
**Why it happens:** Pre-identified variations from CONTEXT.md create an assumption that all gaps are already known.
**How to avoid:** Fetch all 15 11ty source files. Check each one. The two confirmed gaps (A and D) are starting points, not a complete list.

---

## Code Examples

### Reading exhibits.ts for audit enumeration
```typescript
// The Exhibit interface defines all auditable fields:
interface Exhibit {
  label: string           // always present
  client: string          // always present
  date: string            // always present
  title: string           // always present
  quotes?: ExhibitQuote[] // optional — present on 7 of 15
  contextHeading?: string // optional — present on 13 of 15
  contextText?: string    // optional — present on 13 of 15
  resolutionTable?: ExhibitResolutionRow[] // optional — present on 1 of 15
  impactTags: string[]    // always present
  exhibitLink: string     // always present
  isDetailExhibit?: boolean  // optional — true on 9 of 15
  investigationReport?: boolean // optional — true on 5, false on 1, absent on 9
}
```

### ExhibitDetailPage.vue — what renders (confirmed)
```typescript
// These fields ARE rendered:
// - label, client, date, title (header section)
// - quotes (v-if="exhibit.quotes?.length")
// - contextText + contextHeading (v-if="exhibit.contextText")
// - resolutionTable (v-if="exhibit.resolutionTable?.length")
// - impactTags (always rendered via TechTags component)

// These fields are NOT rendered (confirmed by reading the template):
// - isDetailExhibit — never referenced in template
// - investigationReport — never referenced in template
```

### 11ty source URL pattern
```
Base URL: https://raw.githubusercontent.com/novakda/pattern158.solutions/deploy/20260315-feat-auto-generate-deploy-branch-names-f/exhibits/
File pattern: exhibit-{letter}.html
Example: .../exhibits/exhibit-a.html through .../exhibits/exhibit-o.html
```

---

## Validation Architecture

> `nyquist_validation: true` in config.json — section is required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4 (projects array API) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

Phase 5 produces only a planning artifact (a markdown audit document). No application code is written or modified. No automated tests are possible for "does the audit document exist" or "are the classifications correct" — these are human-review deliverables.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUDIT-01 | Audit document exists with comparison table covering all 15 exhibits | manual-only | N/A — file existence check via `ls .planning/phases/05-exhibit-audit/05-01-AUDIT.md` | Wave 0 |
| AUDIT-02 | Every row in comparison table has a Classification value | manual-only | N/A — human review of table | Wave 0 |

**Manual-only justification:** Audit document quality (completeness, accuracy of classification, readability as standalone document) is a human judgment task. Automated tests cannot verify that Dan can read the document without additional context, or that classifications are correctly applied.

**Regression protection:** Existing vitest suite (`npx vitest run`) must remain green after phase 5 — the audit phase makes no code changes, so this is an assertion that nothing was accidentally modified.

### Sampling Rate
- **Per task commit:** `npx vitest run` (confirm no regressions — no code changes expected)
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Audit document complete, all 15 exhibits documented, all variations classified, screenshots captured

### Wave 0 Gaps
None — existing test infrastructure covers phase 5 requirements. No test files need to be created. Phase 5 adds no application code.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Informal "vague sense that exhibits look inconsistent" | Structured per-exhibit comparison table with classification schema | Dan has a concrete, reviewable picture of what needs fixing |
| investigationReport flag exists but does nothing | Documented as a concrete finding targeting STRUCT-02 | Phase 6 has a specific, testable fix to make |
| Content gaps (Exhibit D, A) are intuited | 11ty source cross-reference confirms and specifies the exact missing content | Phase 7 CONT-01 has a specific, bounded gap list to present to Dan |

---

## Open Questions

1. **Exhibit A: how many 11ty quotes should be ported?**
   - What we know: 11ty source has 5+ distinct quotes across the engagement; exhibits.ts captures 2; the 11ty source quotes are attributed to specific named roles
   - What's unclear: Whether Dan wants exhibits.ts to be comprehensive (all quotes) or curated (representative quotes only)
   - Recommendation: Document as `content-gap` in audit, include the full list of 11ty quotes in the cross-reference section, defer the "which quotes to keep" decision to CONT-01 in Phase 7

2. **investigationReport flag: inverted display logic**
   - What we know: STRUCT-02 in requirements.md says "button text must semantically match the flag value (currently appears inverted)" — this was a pre-identified bug from the v1.1 milestone definition
   - What's unclear: How the rendering inversion manifests (the flag is not rendered at all in ExhibitDetailPage.vue as of Phase 4) — the "inversion" bug may refer to a prior implementation state or to future implementation behavior that was planned but not yet built
   - Recommendation: The audit document should note the rendering gap as the primary finding. The "inverted display logic" question is a Phase 6 concern — audit documents the gap, Phase 6 defines the correct rendering behavior.

3. **Exhibits B, D, F, G, H, I: absent isDetailExhibit flag**
   - What we know: These 6 exhibits have no `isDetailExhibit` field (undefined, not false)
   - What's unclear: Whether `undefined` is intentionally treated the same as `false` by the rendering layer, or whether it represents an unenumerated gap
   - Recommendation: Document in comparison table as "absent" (not "false"). ExhibitDetailPage.vue does not use this flag, so currently it has no rendering consequence. Flag as `needs-review` — Dan should decide if all exhibits should have an explicit true/false.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `src/data/exhibits.ts` — all 15 exhibit entries fully enumerated, all field values confirmed
- Direct code inspection: `src/pages/ExhibitDetailPage.vue` — template confirmed: `investigationReport` and `isDetailExhibit` are not rendered
- Direct code inspection: `vitest.config.ts` — test framework and project split confirmed
- Direct code inspection: `package.json` — `playwright: ^1.58.2`, `vitest: ^4.1.0` confirmed
- 11ty source: `exhibit-a.html` — content fetched, gap analysis performed (5+ quotes vs. 2 in data, extensive narrative not in contextText)
- 11ty source: `exhibit-d.html` — content fetched, gap confirmed (background narrative + second quote not in exhibits.ts)
- `.planning/phases/05-exhibit-audit/05-CONTEXT.md` — all locked decisions and pre-identified variations

### Secondary (MEDIUM confidence)
- `verify-screenshots/` directory inspection — confirmed ad-hoc Playwright screenshot pattern (no persistent script; screenshots stored flat in directory)
- `.planning/phases/04-exhibit-detail-pages/04-RESEARCH.md` — confirmed Playwright is the established screenshot tool for this project

### Tertiary (LOW confidence)
- 11ty content for exhibits C, E, F, G, H, I, J, K, L, M, N, O — not fetched during research; confirmed patterns from A and D extrapolate likely, but full cross-reference must happen during audit task execution

---

## Metadata

**Confidence breakdown:**
- Exhibit field matrix: HIGH — read directly from exhibits.ts, all 15 entries fully enumerated
- investigationReport rendering gap: HIGH — confirmed by reading ExhibitDetailPage.vue template
- Screenshot approach: HIGH — Playwright installed, prior pattern confirmed from verify-screenshots/
- 11ty content for A and D: HIGH — fetched and read directly
- 11ty content for remaining 13 exhibits: LOW — not fetched during research; must be completed during audit execution
- Classification recommendations: MEDIUM — based on field evidence; Dan reviews and overrides

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable — no fast-moving dependencies; data file changes would invalidate field matrix)
