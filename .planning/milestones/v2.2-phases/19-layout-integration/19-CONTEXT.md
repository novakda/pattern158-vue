# Phase 19: Layout Integration - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the PersonnelCard component into both exhibit detail layouts (InvestigationReportLayout and EngineeringBriefLayout) so personnel data renders on exhibit detail pages. Additive only — existing table sections remain untouched. Exhibits without personnel data show nothing.

</domain>

<decisions>
## Implementation Decisions

### Personnel Section Placement
- Personnel section appears after the sections loop, before Skills & Technologies — personnel context precedes technical tags
- Section heading text is "Project Team" — clear, professional, matches portfolio tone

### Empty State Handling
- Guard with `v-if="exhibit.personnel?.length"` — no wrapper div rendered at all (matches existing empty-section suppression pattern from Phase 16)
- Wrap in `.exhibit-section` div with `<h2>` heading for visual consistency with other sections

### Claude's Discretion
- Import statement placement and ordering in script setup
- Test structure and assertion patterns (follow existing layout test conventions)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PersonnelCard.vue` — accepts `personnel: ExhibitPersonnelEntry[]` prop, renders CSS grid with named/anonymous/self modes
- `TechTags.vue` — already imported in both layouts, shows the integration pattern

### Established Patterns
- Both layouts receive `exhibit: Exhibit` prop via `defineProps`
- Both layouts are nearly identical templates (~130 lines each) with section-type rendering
- Empty section suppression via `sectionHasContent()` guard function
- Layout tests in `src/components/exhibit/` alongside components

### Integration Points
- `exhibit.personnel` — top-level array on Exhibit type (added in Phase 17)
- Insert PersonnelCard between sections template and impact tags div in both layouts
- Exhibit O has no personnel data — natural empty guard test case

</code_context>

<specifics>
## Specific Ideas

No specific requirements — straightforward wiring of existing component into existing layouts.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
