# Phase 10: Detail Template Extraction - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Split the monolithic ExhibitDetailPage.vue into a thin dispatcher (~30 lines) plus two self-contained layout components — InvestigationReportLayout and EngineeringBriefLayout — so each exhibit type renders through a purpose-built layout that emphasizes its strengths.

</domain>

<decisions>
## Implementation Decisions

### Dispatcher Pattern
- **D-01:** ExhibitDetailPage.vue uses explicit `v-if`/`v-else` branching to delegate to layout components — no dynamic `:is` lookup. Matches the codebase's existing conditional rendering patterns and is clearer for a closed two-value union.
- **D-02:** Dispatcher stays thin (~30 lines): route slug lookup, SEO head tag, 404 redirect, and the v-if/v-else layout delegation. Nothing else.

### Section Ownership
- **D-03:** Each layout component is fully self-contained — renders header, badges, back-nav, quotes, sections, resolution table, and impact tags. No shared rendering in the dispatcher.
- **D-04:** Shared sections (quotes, impactTags, resolutionTable) are duplicated across both layouts rather than extracted into the dispatcher. Keeps each layout independent and the dispatcher minimal.

### Header & Badge Area
- **D-05:** Header structure (back-nav, exhibit meta, title, type badge) lives inside each layout component, not the dispatcher. Badge text and color already implemented in Phase 9 (badge-aware for IR, badge-deep for EB).

### Claude's Discretion
- **D-06 (EB Layout):** Claude audits the actual data patterns of all 10 engineering brief exhibits to determine how the EngineeringBriefLayout should differ from InvestigationReportLayout. DTPL-03 says emphasize "constraints navigated, approach taken, and lasting results" rather than forensic diagnosis framing — Claude decides the concrete layout based on what the data contains.
- **D-07 (Header Differences):** Claude determines whether the two layout headers should differ or remain identical (beyond the badge text/color that already differs).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — DTPL-01 through DTPL-04 define the detail template requirements

### Current Implementation
- `src/pages/ExhibitDetailPage.vue` — Current monolithic detail page (~157 lines) to be refactored into thin dispatcher
- `src/pages/ExhibitDetailPage.test.ts` — Existing tests that must be updated/split for new layout components
- `src/pages/ExhibitDetailPage.stories.ts` — Storybook stories to update

### Data Model
- `src/data/exhibits.ts` — Exhibit interface with `exhibitType` discriminant, all 15 exhibit records. Layout components receive Exhibit as prop.

### Prior Phase Context
- `.planning/phases/09-data-model-migration/09-CONTEXT.md` — Phase 9 decisions on exhibitType, badges, and consumer updates

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitDetailPage.vue` — All current rendering logic to be distributed between two layouts; the section rendering patterns (text, flow, timeline, table, metadata) can be lifted directly
- `TechTags.vue` — Used for impactTags rendering, imported by both layouts
- CSS classes: `exhibit-detail-page`, `exhibit-detail-header`, `exhibit-detail-body`, `exhibit-section`, `exhibit-timeline`, `exhibit-flow`, `exhibit-metadata`, `exhibit-table`, `exhibit-quotes`, `exhibit-resolution` — all existing and styled

### Established Patterns
- Vue 3 Composition API with `<script setup lang="ts">`
- Props via `defineProps` with TypeScript interface
- `v-if` chains for conditional rendering (not dynamic `:is`)
- Components in `src/components/` for reusable pieces, `src/pages/` for route-matched pages

### Integration Points
- Router: exhibit detail route uses `:slug` param — no route changes needed (dispatcher stays at same route)
- SEO: `useHead(computed(...))` pattern stays in dispatcher (needs exhibit data before layout renders)
- Back-nav: currently links to `/portfolio` — Phase 12 will update this; layouts should use the current link for now
- Layout components will live in a new location (e.g., `src/components/layouts/` or `src/components/exhibit/`) — Claude decides file organization

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User consistently chose recommended options and deferred implementation details to Claude's discretion.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 10-detail-template-extraction*
*Context gathered: 2026-03-31*
