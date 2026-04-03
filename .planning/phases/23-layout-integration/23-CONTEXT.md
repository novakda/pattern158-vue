# Phase 23: Layout Integration - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Wire FindingsTable into both InvestigationReportLayout and EngineeringBriefLayout with empty-state suppression. Identical pattern to Phase 19 (PersonnelCard wiring).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — infrastructure wiring phase following the exact v2.2 Phase 19 pattern. Use v-if guard on exhibit.findings?.length, import FindingsTable, render with findings and findingsHeading props.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 19 PersonnelCard wiring — direct pattern reference
- InvestigationReportLayout.vue — already has personnel section with v-if guard
- EngineeringBriefLayout.vue — already has personnel section with v-if guard
- FindingsTable.vue — component built in Phase 22

### Established Patterns
- `v-if="exhibit.personnel?.length"` guard pattern on personnel rendering
- Same pattern applies: `v-if="exhibit.findings?.length"` for findings
- Props: `:findings="exhibit.findings"` `:heading="exhibit.findingsHeading"`

### Integration Points
- InvestigationReportLayout.vue — add FindingsTable section
- EngineeringBriefLayout.vue — add FindingsTable section

</code_context>

<specifics>
## Specific Ideas

- Follow Phase 19 TDD pattern: write integration tests first, then wire component
- Place findings section after personnel section in both layouts (logical content order)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
