# Phase 9: Data Model Migration - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace ambiguous boolean flags (`isDetailExhibit`, `investigationReport`) on the Exhibit interface with an explicit `exhibitType` discriminant, consolidate data from `portfolioFlagships.ts` into the Exhibit interface, delete `portfolioFlagships.ts` and `portfolioNarratives.ts`, and update all consumers (components, tests, Storybook) to use the new field.

</domain>

<decisions>
## Implementation Decisions

### ExhibitType Discriminant
- **D-01:** `exhibitType` is REQUIRED on all 15 exhibits (not optional). TypeScript enforces completeness.
- **D-02:** Union type is exactly `'investigation-report' | 'engineering-brief'` — closed two-value union, no extensibility needed now.
- **D-03:** Classification audit — Claude's discretion. Use existing `investigationReport` flags as baseline (J, L, K, F have `true`; H has explicit `false`). Claude audits each exhibit's content to confirm or adjust, especially Exhibit H.

### Flagship Data Merge
- **D-04:** Flagship fields (`summary`, `emailCount`, `role`) added as OPTIONAL fields directly on the Exhibit interface (flat, not nested).
- **D-05:** Quote merge — Claude's discretion. Audit whether flagship quotes are already present in the exhibit's `quotes` array and recommend whether a separate field is needed.
- **D-06:** Tags merge — Claude's discretion. Compare `impactTags` on Exhibit vs `tags` on Flagship to determine if they're semantically identical (merge into one) or distinct (keep separate).
- **D-07:** All 9 current flagship exhibits (A, J, L, K, C, E, O, N, M) get their data merged. Claude may flag any weak entries for downstream review.
- **D-08:** Add explicit `isFlagship?: boolean` field to the Exhibit interface to mark featured exhibits. Don't rely on implicit "has summary" detection.

### portfolioNarratives.ts Disposition
- **D-09:** Claude's discretion on timing. DATA-04 says remove after consolidation. Narratives don't map to exhibits — could delete now or leave for Phase 11 (which removes Three Lenses consumer). Claude decides the cleanest sequencing.

### isDetailExhibit Removal
- **D-10:** Remove `isDetailExhibit` from the Exhibit interface in Phase 9. With exhibitType required on all 15, every exhibit has a detail page — the boolean is redundant.
- **D-11:** Always apply the `detail-exhibit` CSS class on ExhibitCard (hardcode it, since all cards are now detail cards). Don't remove the class itself.

### Consumer Updates (Migration Scope)
- **D-12:** Update ALL consumers in Phase 9: ExhibitCard.vue, ExhibitDetailPage.vue, tests (exhibits.test.ts, ExhibitCard.test.ts, ExhibitDetailPage.test.ts), and Storybook stories. No broken references remain at phase boundary.
- **D-13:** ExhibitCard CTA text — type-based differentiation. Investigation reports: "View Full Investigation Report". Engineering briefs: different CTA text (e.g., "View Engineering Brief"). Specific wording at Claude's discretion.

### Badge Display
- **D-14:** Both exhibit types display a type badge on the detail page. Investigation Report badge AND Engineering Brief badge. Aligns with DTPL-04 requirement.
- **D-15:** Badge styling differs between types — distinct accent colors per type. Investigation Report keeps current styling; Engineering Brief gets a different color. Claude picks colors from existing CSS design tokens.

### Data Validation
- **D-16:** Add test assertions in exhibits.test.ts: all 15 exhibits have exhibitType, exactly 5 are investigation-report, exactly 10 are engineering-brief, no boolean flag references remain on the interface.

### Claude's Discretion
- D-03: Exhibit classification audit (especially Exhibit H)
- D-05: Quote field merge strategy
- D-06: Tags field merge strategy
- D-07: Flagging weak flagship entries
- D-09: portfolioNarratives.ts deletion timing
- D-13: Engineering Brief CTA wording
- D-15: Engineering Brief badge color selection

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Model
- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-04 define the data model requirements
- `src/data/exhibits.ts` — Current Exhibit interface and all 15 exhibit records
- `src/data/portfolioFlagships.ts` — Flagship interface and 9 flagship records to merge
- `src/data/portfolioNarratives.ts` — Narrative interface and 3 narratives (deletion candidate)

### Consumers to Update
- `src/components/ExhibitCard.vue` — Uses `isDetailExhibit` (CSS class) and `investigationReport` (CTA text)
- `src/pages/ExhibitDetailPage.vue` — Uses `investigationReport` (badge rendering)
- `src/components/ExhibitCard.test.ts` — Tests for `investigationReport` CTA logic
- `src/pages/ExhibitDetailPage.test.ts` — Tests for investigation report badge
- `src/components/ExhibitCard.stories.ts` — Storybook stories using boolean flags
- `src/data/exhibits.test.ts` — Data validation tests

### Related (read-only context)
- `src/components/FlagshipCard.vue` — Imports from portfolioFlagships (PortfolioPage consumer — will break when file deleted)
- `src/components/NarrativeCard.vue` — Imports from portfolioNarratives (PortfolioPage consumer)
- `src/pages/PortfolioPage.vue` — Imports both flagship and narrative data (Page being retired in Phase 13)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitCard.vue` — Already has conditional CTA text logic based on `investigationReport`; pattern reusable for `exhibitType` switch
- `ExhibitDetailPage.vue` — Badge rendering pattern at line 51 can be extended for engineering-brief badge
- `exhibits.test.ts` — Existing data validation tests to extend with type count assertions
- CSS design tokens in `main.css` — `badge-aware` class and expertise-badge styling available for badge variants

### Established Patterns
- Exhibit data is a single typed array export (`export const exhibits: Exhibit[]`)
- Optional fields use `?` syntax on the interface (e.g., `quotes?`, `contextHeading?`)
- Component conditional rendering uses `v-if` with property checks
- Tests use vitest with mount/wrapper pattern

### Integration Points
- `ExhibitCard.vue:11` — CSS class binding needs `isDetailExhibit` replaced
- `ExhibitCard.vue:55` — CTA text ternary needs `investigationReport` replaced with `exhibitType` check
- `ExhibitDetailPage.vue:51` — Badge span needs exhibitType-based rendering
- Router exhibit detail route — no changes needed (slug-based, type-agnostic)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for the migration. User consistently chose recommended (clean, type-safe) options throughout discussion.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-data-model-migration*
*Context gathered: 2026-03-29*
