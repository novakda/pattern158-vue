# Phase 9: Data Model Migration - Research

**Researched:** 2026-03-30
**Domain:** TypeScript interface refactoring, data consolidation, Vue 3 component consumer updates
**Confidence:** HIGH

## Summary

Phase 9 is a pure refactoring/data migration within a small, well-bounded codebase. The Exhibit interface needs two boolean flags (`isDetailExhibit`, `investigationReport`) replaced with an explicit `exhibitType` discriminant, flagship data merged from `portfolioFlagships.ts` into the Exhibit interface, and all consumers updated. The scope is precisely defined: 1 interface, 15 data records, 6 consumer files (components, tests, stories), and 2 files to delete.

The current codebase has 20 passing tests across 3 test files. The `investigationReport` flag is set on 6 exhibits (J, K, L, M, N with `true`; O with explicit `false`). `isDetailExhibit` is set on 9 exhibits (A, C, E, J, K, L, M, N, O). The CONTEXT.md states 5 investigation reports and 10 engineering briefs, so the executor must audit each exhibit's content to confirm classification.

**Primary recommendation:** Execute as a sequential migration: interface change first (compiler catches all breaks), data population second, consumer updates third, file deletion last. TypeScript's structural typing means the compiler will surface every broken reference when booleans are removed.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: `exhibitType` is REQUIRED on all 15 exhibits (not optional). TypeScript enforces completeness.
- D-02: Union type is exactly `'investigation-report' | 'engineering-brief'` -- closed two-value union, no extensibility needed now.
- D-04: Flagship fields (`summary`, `emailCount`, `role`) added as OPTIONAL fields directly on the Exhibit interface (flat, not nested).
- D-07: All 9 current flagship exhibits (A, J, L, K, C, E, O, N, M) get their data merged.
- D-08: Add explicit `isFlagship?: boolean` field to the Exhibit interface to mark featured exhibits.
- D-10: Remove `isDetailExhibit` from the Exhibit interface in Phase 9.
- D-11: Always apply the `detail-exhibit` CSS class on ExhibitCard (hardcode it, since all cards are now detail cards). Don't remove the class itself.
- D-12: Update ALL consumers in Phase 9: ExhibitCard.vue, ExhibitDetailPage.vue, tests (exhibits.test.ts, ExhibitCard.test.ts, ExhibitDetailPage.test.ts), and Storybook stories.
- D-14: Both exhibit types display a type badge on the detail page.
- D-16: Add test assertions: all 15 have exhibitType, exactly 5 investigation-report, exactly 10 engineering-brief, no boolean flag references remain on interface.

### Claude's Discretion
- D-03: Exhibit classification audit (especially Exhibit H)
- D-05: Quote field merge strategy
- D-06: Tags field merge strategy
- D-07: Flagging weak flagship entries
- D-09: portfolioNarratives.ts deletion timing
- D-13: Engineering Brief CTA wording
- D-15: Engineering Brief badge color selection

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | Exhibit interface uses explicit `exhibitType: 'investigation-report' \| 'engineering-brief'` discriminant replacing ambiguous boolean flags | Interface definition pattern documented; current boolean locations mapped (lines 53-54 of exhibits.ts) |
| DATA-02 | All 15 exhibits classified with correct `exhibitType` value (5 investigation reports, 10 engineering briefs) via audit | Current flags mapped: J, K, L, M, N have `investigationReport: true`; O has `false`; H has no flag. Classification audit needed per D-03 |
| DATA-03 | Flagship summary fields from `portfolioFlagships.ts` merged into Exhibit interface as single source of truth | Flagship interface documented with 9 records; field mapping complete (summary, emailCount, role are flat optionals per D-04) |
| DATA-04 | `portfolioFlagships.ts` and `portfolioNarratives.ts` removed after data consolidation | Consumer dependency chain mapped: PortfolioPage.vue, FlagshipCard.vue, NarrativeCard.vue all import these files |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | (project version) | Type-safe interface refactoring | Compiler enforces completeness when `exhibitType` becomes required |
| Vue 3 | (project version) | Component template updates | `v-if` conditionals on new discriminant |
| Vitest | 4.1.0 | Test updates and new assertions | Already configured with happy-dom, 20 tests passing |

No new packages needed. This is a pure refactoring phase within existing dependencies.

## Architecture Patterns

### Current Exhibit Interface (exhibits.ts:41-55)
```typescript
export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  sections?: ExhibitSection[]
  impactTags: string[]
  exhibitLink: string
  isDetailExhibit?: boolean      // REMOVE
  investigationReport?: boolean  // REMOVE
}
```

### Target Exhibit Interface
```typescript
export type ExhibitType = 'investigation-report' | 'engineering-brief'

export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  exhibitType: ExhibitType          // NEW - required discriminant
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  sections?: ExhibitSection[]
  impactTags: string[]
  exhibitLink: string
  // Flagship fields (from portfolioFlagships.ts merge)
  isFlagship?: boolean               // NEW - explicit flag per D-08
  summary?: string                   // NEW - from Flagship.summary
  emailCount?: string                // NEW - from Flagship.emailCount
  role?: string                      // NEW - from Flagship.role
  // isDetailExhibit removed (D-10)
  // investigationReport removed (D-01/D-02)
}
```

### Pattern: TypeScript Compiler-Driven Migration
**What:** Make `exhibitType` required on the interface, remove boolean fields. TypeScript immediately flags every exhibit record missing the field and every consumer referencing removed fields.
**When to use:** When replacing one field with another across a bounded dataset.
**Why it works:** With 15 records and 6 consumer files, the compiler error list IS the migration checklist.

### Pattern: Discriminant-Based Conditional Rendering
**What:** Replace boolean checks with string literal comparisons.
**Before:**
```typescript
exhibit.investigationReport ? 'View Full Investigation Report' : 'View Investigation Report'
```
**After:**
```typescript
exhibit.exhibitType === 'investigation-report'
  ? 'View Full Investigation Report'
  : 'View Engineering Brief'  // D-13: Claude picks wording
```

### Anti-Patterns to Avoid
- **Partial migration:** Do NOT leave both `investigationReport` and `exhibitType` on the interface. Remove booleans in the same commit that adds the discriminant. Clean break.
- **Optional discriminant:** D-01 says REQUIRED. Do not make `exhibitType` optional "for safety" -- that defeats TypeScript enforcement.
- **Implicit flagship detection:** D-08 explicitly requires `isFlagship?: boolean`. Do not rely on checking `summary !== undefined` to detect flagships.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type narrowing | Custom type guard functions | Direct string literal comparison (`=== 'investigation-report'`) | Two-value union is simple enough for direct comparison |
| Data validation | Runtime schema validation (zod etc.) | TypeScript compiler + vitest assertions | 15 static records; compile-time + test-time coverage is sufficient |

## Common Pitfalls

### Pitfall 1: FlagshipCard.vue and PortfolioPage.vue Break on File Deletion
**What goes wrong:** Deleting `portfolioFlagships.ts` breaks `FlagshipCard.vue` (line 2 imports `Flagship` type) and `PortfolioPage.vue` (line 9 imports `flagships`). Similarly, deleting `portfolioNarratives.ts` breaks `NarrativeCard.vue` and `PortfolioPage.vue`.
**Why it happens:** These consumers are outside the D-12 explicit update list but depend on the deleted files.
**How to avoid:** Either (a) update FlagshipCard/PortfolioPage to source data from the Exhibit interface, or (b) keep the deleted files as thin re-exports, or (c) leave deletion for Phase 11/13 when those pages are retired. Option (c) is cleanest -- PortfolioPage is retired in Phase 13 per CLN-03.
**Warning signs:** TypeScript compile errors in files not listed in D-12.

### Pitfall 2: Exhibit H Classification Ambiguity
**What goes wrong:** Exhibit H has no `investigationReport` flag in the current data. CONTEXT.md notes "H has explicit false" but the actual data shows NO flag at all on H. The CONTEXT.md references this from the discussion where the user mentioned it.
**Why it happens:** H is "Rapid Diagnosis Under Pressure" -- not a full NTSB-style investigation but does involve diagnostic work.
**How to avoid:** Audit exhibit H's content. Based on its summary ("LMS configuration issue identified and resolved same day"), it is an engineering-brief (rapid fix, not forensic multi-angle investigation).
**Warning signs:** Count mismatch in tests (not exactly 5 investigation-report or 10 engineering-brief).

### Pitfall 3: Flagship Quote Duplication
**What goes wrong:** Flagship records have a `quote` field. Exhibit records have a `quotes[]` array. Merging naively could duplicate quotes that already exist in both places.
**How to avoid:** Per D-05 (Claude's discretion), compare flagship quotes against exhibit quotes before merging. The flagship quote format is `{ text, cite? }` while exhibit quotes are `{ text, attribution, role? }` -- different shapes.

### Pitfall 4: Tags Field Collision
**What goes wrong:** Exhibits have `impactTags: string[]`. Flagships have `tags: string[]`. These may overlap or diverge.
**How to avoid:** Per D-06 (Claude's discretion), compare the two arrays for each flagship exhibit. If semantically identical, keep `impactTags` only. If distinct, keep both (but this adds interface complexity).

### Pitfall 5: Storybook Stories Use Boolean Flags
**What goes wrong:** `ExhibitCard.stories.ts` uses `isDetailExhibit: true` (lines 31, 62) and `investigationReport: true/false` (lines 97, 111). These will fail TypeScript compilation after interface change.
**How to avoid:** Update all story args to use new `exhibitType` field and remove boolean flags.

## Code Examples

### Current Boolean Flag Locations in exhibits.ts
```
investigationReport: true  -- lines 1129 (J), 1214 (K), 1309 (L), 1369 (M), 1445 (N)
investigationReport: false -- line 1521 (O)
isDetailExhibit: true      -- lines 289 (A), 448 (C), 669 (E), 1128 (J), 1213 (K), 1308 (L), 1368 (M), 1444 (N), 1520 (O)
```

### Flagship-to-Exhibit Field Mapping
```
Flagship.summary     -> Exhibit.summary?     (string, optional)
Flagship.emailCount  -> Exhibit.emailCount?  (string, optional)
Flagship.role        -> Exhibit.role?        (string, optional)
Flagship.quote       -> Audit against Exhibit.quotes[] (D-05)
Flagship.tags        -> Audit against Exhibit.impactTags (D-06)
Flagship.client      -> Already on Exhibit.client (no action)
Flagship.title       -> Already on Exhibit.title (no action, may differ slightly)
Flagship.dates       -> Already on Exhibit.date (no action)
Flagship.exhibitLink -> Already on Exhibit.exhibitLink (no action)
```

### 9 Flagship Exhibits to Merge
| Flagship | Exhibit Match | exhibitLink |
|----------|--------------|-------------|
| General Dynamics Electric Boat | Exhibit A | /exhibits/exhibit-a |
| General Motors | Exhibit J | /exhibits/exhibit-j |
| Enterprise Client (Confidential) | Exhibit L | /exhibits/exhibit-l |
| Microsoft | Exhibit K | /exhibits/exhibit-k |
| GP Strategies (Internal) | Exhibit C | /exhibits/exhibit-c |
| GP Strategies (Energy Sector) | Exhibit E | /exhibits/exhibit-e |
| GP Strategies (Internal Product) | Exhibit O | /exhibits/exhibit-o |
| BP | Exhibit N | /exhibits/exhibit-n |
| GP Strategies (Internal Tooling) | Exhibit M | /exhibits/exhibit-m |

### Consumer Update Map
| File | What Changes | Lines |
|------|-------------|-------|
| `src/data/exhibits.ts` | Interface: remove 2 booleans, add `exhibitType`, `isFlagship`, `summary`, `emailCount`, `role`. All 15 records: add `exhibitType`, remove booleans, add flagship data for 9. | Interface: 41-55; Records: throughout |
| `src/components/ExhibitCard.vue` | Line 11: hardcode `detail-exhibit` class. Line 55: switch from `investigationReport` to `exhibitType` for CTA text. | 11, 55 |
| `src/pages/ExhibitDetailPage.vue` | Line 51: badge rendering uses `exhibitType` instead of `investigationReport`. Add engineering-brief badge. | 51 |
| `src/data/exhibits.test.ts` | Add assertions: all 15 have `exhibitType`, 5 are investigation-report, 10 are engineering-brief, no boolean references. | New tests |
| `src/components/ExhibitCard.test.ts` | Update test data from `investigationReport` to `exhibitType`. Update CTA expectations per D-13. | All 3 tests |
| `src/pages/ExhibitDetailPage.test.ts` | Update badge test from `investigationReport` to `exhibitType`. Add engineering-brief badge test. | Lines 74-96 |
| `src/components/ExhibitCard.stories.ts` | Remove `isDetailExhibit` and `investigationReport` from args. Add `exhibitType`. | Lines 31, 62, 97, 111 |

### File Deletion Dependency Chain
```
portfolioFlagships.ts is imported by:
  - FlagshipCard.vue (type import)
  - PortfolioPage.vue (data import)

portfolioNarratives.ts is imported by:
  - NarrativeCard.vue (type import)
  - PortfolioPage.vue (data import)
```
**Critical:** PortfolioPage.vue is retired in Phase 13 (CLN-03). FlagshipCard.vue and NarrativeCard.vue are also portfolio components. Deleting these files in Phase 9 requires either updating these consumers or accepting they will break until Phase 13.

### CSS Design Tokens for Badge Colors
Available tokens for engineering-brief badge (D-15):
- `--color-primary: #0e7c8c` (teal, currently used for links)
- `--color-accent: #8f6d00` (gold/amber)
- `--color-text-muted: #666666` (gray, currently used for investigation badge via `.badge-aware`)

The investigation report badge uses `.badge-aware` (gray/muted). Engineering brief badge needs a distinct color. `--color-primary` (teal) is a natural choice -- it contrasts with the muted gray and is already established in the design system.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vite.config.ts` (inline vitest config) |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | exhibitType replaces boolean flags on interface | unit | `npx vitest run src/data/exhibits.test.ts -x` | Exists, needs new assertions |
| DATA-02 | All 15 exhibits have correct exhibitType (5 IR, 10 EB) | unit | `npx vitest run src/data/exhibits.test.ts -x` | Exists, needs new assertions |
| DATA-03 | Flagship fields accessible on Exhibit objects | unit | `npx vitest run src/data/exhibits.test.ts -x` | Exists, needs new assertions |
| DATA-04 | portfolioFlagships.ts and portfolioNarratives.ts deleted | unit | `npx vitest run` (compile failure if imports remain) | Implicit via TypeScript compilation |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + `npx vue-tsc --noEmit` (type check)

### Wave 0 Gaps
- [ ] New test assertions in `exhibits.test.ts`: all 15 have `exhibitType`, exactly 5 `investigation-report`, exactly 10 `engineering-brief`, no `isDetailExhibit` or `investigationReport` on interface
- [ ] New test assertions in `exhibits.test.ts`: 9 flagship exhibits have `isFlagship: true` and `summary` field
- [ ] Updated test data in `ExhibitCard.test.ts`: replace `investigationReport` with `exhibitType` in `baseExhibit`
- [ ] Updated badge test in `ExhibitDetailPage.test.ts`: test both investigation-report and engineering-brief badges

## Open Questions

1. **portfolioNarratives.ts deletion timing (D-09)**
   - What we know: Narratives don't map to exhibits. PortfolioPage (consumer) is retired in Phase 13. NarrativeCard.vue is removed in Phase 11 (CLN-02).
   - What's unclear: Whether to delete now and break PortfolioPage temporarily, or defer to Phase 11.
   - Recommendation: Delete in Phase 9 alongside portfolioFlagships.ts. PortfolioPage will break but that is expected -- it is being retired. Breaking it now surfaces any hidden dependencies early. Alternatively, if clean compilation at every phase boundary is a hard requirement, defer to Phase 11.

2. **FlagshipCard.vue and PortfolioPage.vue after file deletion**
   - What we know: Both files import from the to-be-deleted modules. Both are slated for removal in Phase 11/13.
   - What's unclear: Whether Phase 9 should update these files to maintain compilation or accept temporary breakage.
   - Recommendation: Update PortfolioPage.vue to import flagship-equivalent data from exhibits.ts (filtered by `isFlagship`). Update FlagshipCard.vue to accept an Exhibit prop instead of Flagship. This keeps the build green at phase boundary without premature file deletion. Alternatively, keep portfolioFlagships.ts as a thin re-export wrapper that sources from exhibits.

3. **Exhibit classification audit for H, M, N, O**
   - What we know: J, K, L have `investigationReport: true` and are clearly forensic/diagnostic. M (SCORM Debugger) and N (BP Platform) have `true` but are arguably engineering work, not investigations. O has explicit `false`. H has no flag.
   - Recommendation: The executor should audit based on content, not existing flags. The CONTEXT.md target is 5 investigation-report, 10 engineering-brief. Current `true` flags: J, K, L, M, N (5 total). If all 5 are confirmed as investigation-report, plus 10 engineering-brief (A, B, C, D, E, F, G, H, I, O), counts align.

## Sources

### Primary (HIGH confidence)
- `src/data/exhibits.ts` -- Current interface definition and all 15 exhibit records (direct code inspection)
- `src/data/portfolioFlagships.ts` -- Flagship interface and 9 records (direct code inspection)
- `src/data/portfolioNarratives.ts` -- Narrative interface and 3 records (direct code inspection)
- `src/components/ExhibitCard.vue` -- Consumer using isDetailExhibit and investigationReport (direct code inspection)
- `src/pages/ExhibitDetailPage.vue` -- Consumer using investigationReport for badge (direct code inspection)
- All 3 test files and Storybook stories -- Direct code inspection
- `vite.config.ts` -- Vitest 4.1.0 configuration confirmed
- Test suite run -- All 20 tests passing as of research date

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, pure refactoring within existing TypeScript/Vue/Vitest
- Architecture: HIGH -- interface change is mechanical; compiler enforces completeness
- Pitfalls: HIGH -- all consumer files read directly, dependency chain fully mapped

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable -- no external dependencies)
