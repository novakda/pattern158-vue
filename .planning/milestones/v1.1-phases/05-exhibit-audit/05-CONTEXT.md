# Phase 5: Exhibit Audit - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce a structured comparison table documenting all 15 exhibit detail pages' content sections and classifying every variation — so Dan has a complete picture of what needs fixing versus what is intentionally different. This phase produces an audit document only; no content or code changes are made here.

</domain>

<decisions>
## Implementation Decisions

### Audit output format
- Lives in `.planning/phases/05-exhibit-audit/` as a markdown file (planning artifact, not deployed with the site)
- Structure: **compact comparison table** (at-a-glance view) + **classified variations narrative** (explains each notable difference)
- Table: one row per exhibit (A–O), columns for every field: `quotes`, `contextHeading`, `contextText`, `resolutionTable`, `isDetailExhibit`, `investigationReport`, plus a Classification column per row

### Classification schema
- **4 categories**: `intentional` (content-driven, correct as-is), `formatting-inconsistency` (fixable without a content decision), `content-gap` (needs Dan's review before changing), `needs-review` (auditor cannot determine intent — Dan decides)
- Claude applies classification to each variation; Dan reviews and overrides as needed
- Ambiguous cases → `needs-review` with explanation; Claude does not guess on unclear intent

### Audit scope
- All visible content fields: `quotes`, `contextHeading`, `contextText`, `resolutionTable`, `impactTags`
- Both data flags: `isDetailExhibit` and `investigationReport`
- **Explicit finding required**: `investigationReport` flag exists in `exhibits.ts` but is not rendered anywhere in `ExhibitDetailPage.vue` — this rendering gap must be documented as a concrete finding for Phase 6
- **Cross-reference 11ty source**: Each exhibit's `.html` page in the 11ty GitHub repo must be checked to identify content that exists in the source but is missing from `exhibits.ts` (e.g., Exhibit D has a quote but no `contextText` — is there source context to port?)

### Visual comparison via Playwright
- Screenshot all 15 exhibits at **375px, 768px, and 1280px** (the project's established breakpoints)
- Auditor reviews the full screenshot set, identifies the most complete and well-structured exhibits, and names them as **"best of breed" reference points** with recommendations in the audit doc
- No predefined canonical ideal structure — the best-of-breed call is made after seeing the full visual picture

### Claude's Discretion
- Exact markdown formatting and organization within the audit document
- Screenshot naming convention and storage location within the phase directory
- How to handle exhibits where 11ty source is unavailable or ambiguous

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 11ty source (content source of truth)
- `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — Read each `/exhibits/exhibit-a.html` through `/exhibits/exhibit-o.html` to cross-reference content against `exhibits.ts`

### Requirements
- `.planning/REQUIREMENTS.md` — AUDIT-01 (structured comparison table) and AUDIT-02 (classification of every variation)

### Existing data
- `src/data/exhibits.ts` — All 15 exhibit entries (A–O) with the `Exhibit` interface definition — primary audit target

### Existing rendering code
- `src/pages/ExhibitDetailPage.vue` — How exhibits are rendered; note that `investigationReport` flag is NOT rendered here despite existing in the data interface

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/exhibits.ts`: `Exhibit` interface defines all auditable fields — use as the schema for the comparison table columns
- Established breakpoints: 375px, 768px, 1280px — consistent with all prior Storybook viewport stories

### Established Patterns
- Screenshots from Playwright go in a dedicated folder (see `verify-screenshots/` in project root as precedent)
- Audit artifacts as markdown in `.planning/phases/XX-name/` — established by this milestone's workflow

### Known Variations (pre-identified from code scan)
- `contextHeading`: "Context" (B, C, E, F, G, H, I, M, N, O) vs. "Investigation Summary" (J, K, L) vs. absent (A, D)
- `contextText`: Present on most; **absent on Exhibit A and Exhibit D** — Exhibit D has a quote but no context text
- `quotes`: Present on A, B, D, F, G, H, I; absent on C, E, J, K, L, M, N, O
- `resolutionTable`: Only Exhibit A
- `investigationReport`: true on J, K, L, M, N; false on O; absent on all others — and not rendered in ExhibitDetailPage at all
- `isDetailExhibit`: true on A, C, E, J, K, L, M, N, O; absent on B, D, F, G, H, I

### Integration Points
- Audit document feeds directly into Phase 6 (STRUCT-01/02/03 structural normalization) and Phase 7 (CONT-01/02 content gap fill)
- Screenshot output informs Phase 6's visual target for what "consistent" looks like

</code_context>

<specifics>
## Specific Ideas

- Dan described the inconsistency as a "vague sense that exhibits look inconsistent" — visual screenshots are the right tool to surface what the data audit alone might miss
- "Best of breed" identification: look for exhibits that are visually complete, structurally clear, and would work as a reference target for normalization
- The audit document should be readable without any additional context — Dan reviews it standalone and uses it to guide Phase 6 + 7 decisions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-exhibit-audit*
*Context gathered: 2026-03-18*
