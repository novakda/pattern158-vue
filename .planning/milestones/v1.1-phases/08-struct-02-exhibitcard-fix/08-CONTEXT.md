# Phase 8: Fix STRUCT-02 ExhibitCard Link Text - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix the inverted `investigationReport` flag conditional in `ExhibitCard.vue:55` so investigation exhibits show the more emphatic CTA and standard exhibits show a neutral CTA. Also bring all related files to full parity: unit tests (TDD), Storybook stories, and traceability docs. No other ExhibitCard behavior changes.

</domain>

<decisions>
## Implementation Decisions

### CTA copy
- Exact strings must be looked up from the 11ty source — researcher fetches portfolio HTML from the GitHub repo and finds the anchor text used on exhibit card elements
- Do NOT invent or guess copy; content fidelity rule (PROJECT.md) applies here
- The inverted logic is the bug: currently `true` shows the shorter string and `false/absent` shows the longer one; after the fix `true` gets the emphatic CTA and `false/absent` gets the neutral one

### false vs absent behavior
- Both `investigationReport: false` (Exhibit O) and `investigationReport: undefined` (most exhibits A–I) get the same neutral CTA
- No distinction between them — same falsy branch, same string
- Consistent with Phase 6 badge handling (`v-if="exhibit.investigationReport"` covers both with no special-casing)

### Test coverage
- TDD approach — write a failing ExhibitCard unit test before fixing the line (matches Phase 6 pattern)
- Tests assert: `investigationReport: true` renders emphatic CTA text; `investigationReport: false` renders neutral CTA text
- No ExhibitCard.test.ts currently exists — Phase 8 creates it

### Storybook
- Update `ExhibitCard.stories.ts` to surface the CTA distinction between investigation and standard exhibits
- Add or update stories so both variants (investigationReport: true and false) are visible in Storybook
- Makes the fix visually verifiable and closes the documentation gap

### File scope
- `src/components/ExhibitCard.vue` — fix line 55
- `src/components/ExhibitCard.test.ts` — new file, TDD tests for CTA text
- `src/components/ExhibitCard.stories.ts` — update to show investigation vs standard variants
- `.planning/REQUIREMENTS.md` — mark STRUCT-02 [x] Complete once fix is verified
- `.planning/ROADMAP.md` — mark Phase 8 plan complete and phase complete
- STATE.md, SUMMARY.md, VERIFICATION.md — handled automatically during execution

### Claude's Discretion
- Exact test file structure and describe/it naming (follow existing test conventions)
- How to organize Storybook story additions (new named export vs updated existing)
- Exact ROADMAP.md wording for Phase 8 completion entry

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 11ty source (CTA copy source of truth)
- `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — Portfolio page HTML is the authoritative source for the exact anchor text used on exhibit card elements; researcher must find the link text for investigation vs standard exhibit cards

### Current implementation
- `src/components/ExhibitCard.vue` — Line 55: the inverted conditional being fixed
- `src/components/ExhibitCard.stories.ts` — Existing Storybook stories to be updated

### Phase 6 precedent (TDD pattern to follow)
- `.planning/phases/06-structural-normalization/06-01-PLAN.md` — TDD task structure to replicate: Task 1 writes failing tests (RED), Task 2 implements fix (GREEN)

### Requirements
- `.planning/REQUIREMENTS.md` — STRUCT-02 acceptance criteria; mark complete when Phase 8 verified
- `.planning/ROADMAP.md` — Phase 8 success criteria (SC-1: emphatic CTA for true, SC-2: matches 11ty source, SC-3: no other behavior changed)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitCard.vue` `defineProps<{ exhibit: Exhibit }>()` — already typed; fix is a string swap at line 55, no prop changes
- `ExhibitCard.stories.ts` — existing stories to extend, not replace
- Phase 6 test files (`src/data/exhibits.test.ts`, `src/pages/ExhibitDetailPage.test.ts`) — reference for test style and vi.mocked patterns

### Established Patterns
- TDD pattern from Phase 6: write failing test → implement fix → confirm GREEN → commit both
- `investigationReport?: boolean` on the `Exhibit` interface — falsy covers both `false` and `undefined`; no interface changes needed
- Storybook stories in `ExhibitCard.stories.ts` use named exports; follow existing export pattern

### Integration Points
- `ExhibitCard.vue` is used in `PortfolioPage.vue` to render all exhibit cards — the fix is a display-only change, no data or routing impact
- `REQUIREMENTS.md` traceability table: STRUCT-02 row maps to Phase 8 — update to [x] Complete after verification

</code_context>

<specifics>
## Specific Ideas

- Follow the Phase 6 TDD structure exactly: Task 1 = failing tests (RED), Task 2 = fix + stories (GREEN), Task 3 = traceability updates (REQUIREMENTS.md, ROADMAP.md)
- The Storybook update should make the CTA difference obvious — side-by-side investigation vs standard exhibit is ideal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-struct-02-exhibitcard-fix*
*Context gathered: 2026-03-18*
