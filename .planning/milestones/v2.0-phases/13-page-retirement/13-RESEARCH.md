# Phase 13: Page Retirement - Research

**Researched:** 2026-04-01
**Domain:** Vue component deletion, CSS cleanup, build verification
**Confidence:** HIGH

## Summary

Phase 13 is a pure deletion/cleanup phase. Seven files are removed (2 page components, 2 supporting components, 3 Storybook stories) and approximately 116 CSS rule lines referencing `.page-portfolio` and `.page-testimonials` are stripped from `main.css`. No new code is created.

The codebase is already in a clean state for this work. The router uses redirect objects (not lazy imports) for `/portfolio` and `/testimonials`, so no router changes are needed. All imports of the target files are self-contained within the files being deleted -- no external production code references them. The build currently passes.

**Primary recommendation:** Delete files first, then clean CSS, then verify with build + grep. Single plan, straightforward execution.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Delete all 7 orphaned files -- no survivors:
  - `src/pages/PortfolioPage.vue`
  - `src/pages/TestimonialsPage.vue`
  - `src/components/FlagshipCard.vue`
  - `src/components/TestimonialsMetrics.vue`
  - `src/pages/PortfolioPage.stories.ts`
  - `src/pages/TestimonialsPage.stories.ts`
  - `src/components/FlagshipCard.stories.ts`
- **D-02:** TestimonialsMetrics is NOT relocated -- it dies with TestimonialsPage. No future use planned.
- **D-03:** Keep `/portfolio` and `/testimonials` redirect objects in router.ts permanently. Cheap insurance for bookmarks and any indexed URLs.
- **D-04:** Remove all `.page-portfolio` and `.page-testimonials` scoped CSS rules from `src/assets/css/main.css`. This includes regular styles, dark theme overrides (`[data-theme="dark"]`), and responsive breakpoint rules (~100+ rules total).

### Claude's Discretion
- Order of operations within the phase (delete files first vs. CSS first)
- Whether to scan for any additional orphaned CSS selectors beyond the two page scopes
- Verification approach (build check, grep for dead imports, test suite)

### Deferred Ideas (OUT OF SCOPE)
- Storybook stories for CaseFilesPage -- REF-01 (v2.x)
- Any broader CSS dead code audit beyond these two page scopes -- future pass
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLN-03 | PortfolioPage.vue and TestimonialsPage.vue retired after Case Files is live | All 7 files confirmed present and deletable; no external imports found; CSS scoped rules identified at 116 lines across main.css |
</phase_requirements>

## Codebase Audit Findings

### Files to Delete (all confirmed present)

| File | Lines | Dependencies | External Refs |
|------|-------|-------------|---------------|
| `src/pages/PortfolioPage.vue` | Vue SFC | Imports FlagshipCard, useBodyClass | None outside itself + its story |
| `src/pages/TestimonialsPage.vue` | Vue SFC | Imports TestimonialsMetrics, useBodyClass | None outside itself + its story |
| `src/components/FlagshipCard.vue` | Vue SFC | Standalone | Only imported by PortfolioPage |
| `src/components/TestimonialsMetrics.vue` | Vue SFC | Standalone | Only imported by TestimonialsPage |
| `src/pages/PortfolioPage.stories.ts` | Storybook | Imports PortfolioPage | Self-contained |
| `src/pages/TestimonialsPage.stories.ts` | Storybook | Imports TestimonialsPage | Self-contained |
| `src/components/FlagshipCard.stories.ts` | Storybook | Imports FlagshipCard | Self-contained |

**Confidence: HIGH** -- verified via grep across entire `src/` directory. No production code outside these 7 files imports any of them.

### Router State (no changes needed)

```typescript
// src/router.ts lines 9-10 -- these STAY per D-03
{ path: '/portfolio', redirect: '/case-files' },
{ path: '/testimonials', redirect: '/case-files' },
```

The router uses `redirect` property, not `component` -- no lazy import of the deleted pages exists.

### CSS Cleanup Scope

116 lines in `src/assets/css/main.css` reference `.page-portfolio` or `.page-testimonials`. These fall into distinct regions:

| Region | Lines | Content |
|--------|-------|---------|
| Dark theme override | 221-223 | `[data-theme="dark"] .page-testimonials .detail-exhibit .exhibit-label` |
| Link color rules | 749-754 | Mixed selector list with other pages -- needs surgical removal of only the portfolio/testimonials selectors, keeping the surrounding rule intact |
| Testimonials page block | 1755-2144 | Entire `.page-testimonials` section (~389 lines) |
| Investigation reports heading | 3125-3138 | `.page-testimonials .investigation-reports-heading` block |
| Responsive breakpoints (mixed) | 3467-3518 | `.page-testimonials` and `.page-portfolio` selectors within `@media` blocks -- needs surgical removal |
| More responsive rules | 3717-3730 | `.page-testimonials` within responsive block |
| Responsive blockquote | 3849 | Single `.page-testimonials blockquote` line in responsive |
| Portfolio page block | 3976-4249 | Entire `.page-portfolio` section (~273 lines) |

**Critical nuance on lines 749-754:** This is a comma-separated selector list inside a larger rule that also targets `.page-philosophy` and `.page-contact`. Only the 6 portfolio/testimonials selectors should be removed; the rule itself and the remaining selectors must stay.

Similarly, responsive `@media` blocks at lines 3467-3518 contain mixed selectors. Only the portfolio/testimonials entries should be removed.

### useBodyClass Composable

The `useBodyClass` composable remains in use by other pages. Only the specific calls in the two deleted pages are removed (by deleting the files). The composable itself stays.

## Architecture Patterns

### Recommended Order of Operations

1. **Delete the 7 files** -- simple `git rm` or file deletion
2. **Clean CSS** -- remove dead selectors from `main.css`, being careful with mixed selector lists
3. **Verify** -- build, grep, test suite

This order is recommended because:
- File deletion is atomic and easily verified
- CSS cleanup is the only task requiring care (mixed selector lists)
- Verification confirms both steps together

### Anti-Patterns to Avoid
- **Removing redirect routes:** D-03 explicitly says keep them. Do not touch router.ts.
- **Relocating TestimonialsMetrics:** D-02 explicitly says it dies. Do not move it elsewhere.
- **Broad CSS audit:** Deferred. Only remove `.page-portfolio` and `.page-testimonials` scoped rules.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Orphan detection | Manual file-by-file tracing | `grep -r` across src/ for import/reference verification | Grep is definitive for static imports in a Vue/TS codebase |
| Build verification | Visual inspection | `npm run build` | Vite will fail on broken imports |

## Common Pitfalls

### Pitfall 1: Mixed Selector Lists
**What goes wrong:** Deleting an entire CSS rule block when only some selectors in a comma-separated list are dead, breaking styles for live pages.
**Why it happens:** Lines 749-754 contain `.page-testimonials` and `.page-portfolio` selectors alongside `.page-philosophy` and `.page-contact` selectors in the same rule.
**How to avoid:** Remove only the dead selectors from the comma-separated list. Keep the rule, the opening `{`, the declaration, and the closing `}` intact.
**Warning signs:** Philosophy or Contact page styles break after CSS cleanup.

### Pitfall 2: Responsive Block Collateral Damage
**What goes wrong:** Removing an entire `@media` block when it contains both dead and live selectors.
**Why it happens:** Lines 3467-3518 mix portfolio/testimonials selectors with other page selectors in responsive breakpoints.
**How to avoid:** Remove only the dead selectors within each `@media` block. If the `@media` block becomes empty after removal, remove the entire block.
**Warning signs:** Responsive layout breaks on other pages.

### Pitfall 3: Forgetting Dark Theme Overrides
**What goes wrong:** Dead `.page-testimonials` rule persists in dark theme section.
**Why it happens:** Line 221 is isolated from the main testimonials block and easy to miss.
**How to avoid:** Grep for all occurrences of both class names, not just the contiguous blocks.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLN-03 | No broken imports after file deletion | build | `npm run build` | N/A (build check) |
| CLN-03 | No references to deleted files in src/ | grep | `grep -r "PortfolioPage\|TestimonialsPage\|FlagshipCard\|TestimonialsMetrics" src/ --include="*.ts" --include="*.vue"` | N/A (grep check) |
| CLN-03 | No dead CSS selectors remain | grep | `grep -c "page-portfolio\|page-testimonials" src/assets/css/main.css` (expect 0) | N/A (grep check) |
| CLN-03 | Existing tests still pass | unit | `npm test` | Existing tests |

### Sampling Rate
- **Per task commit:** `npm run build && npm test`
- **Per wave merge:** `npm run build && npm test`
- **Phase gate:** Full suite green + grep verification before `/gsd:verify-work`

### Wave 0 Gaps
None -- existing test infrastructure covers all phase requirements. No new test files needed for a deletion phase.

## Sources

### Primary (HIGH confidence)
- Direct codebase audit via grep and file inspection -- all findings verified against actual source files
- `npm run build` -- confirmed clean build at research time
- `src/router.ts` -- confirmed redirect-only routes (no component imports for deleted pages)

### Secondary (MEDIUM confidence)
- CSS line ranges from CONTEXT.md cross-verified against actual `main.css` content

## Metadata

**Confidence breakdown:**
- Files to delete: HIGH -- all 7 confirmed present, all imports self-contained
- CSS cleanup scope: HIGH -- all 116 references identified with line numbers, mixed-selector nuances documented
- Router state: HIGH -- verified no lazy imports exist
- Pitfalls: HIGH -- directly observed in codebase (mixed selector lists at lines 749-754)

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable -- deletion phase, no external dependency drift)
