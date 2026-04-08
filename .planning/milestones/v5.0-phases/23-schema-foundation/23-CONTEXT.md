# Phase 23: Schema Foundation - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Update FindingEntry type with unified field set (finding, description, severity?, resolution?, outcome?, category?) and normalize Exhibit A's `background` field to `description`. Pure type/data change with no rendering impact.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key constraints:
- FindingEntry already exists in src/types/exhibit.ts with optional severity, resolution, background, description fields
- Exhibit A is the only exhibit using `background` field — rename to `description` in exhibits.json
- Add `outcome` and `category` as optional string fields to FindingEntry
- Remove `background` from FindingEntry type (replaced by `description`)
- Layout template variant detection uses `exhibit.findings[0].background !== undefined` — must update to use new field presence logic

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/exhibit.ts` — FindingEntry interface (lines 43-49)
- `src/data/json/exhibits.json` — all exhibit data
- `src/data/exhibits.ts` — thin loader with type assertion

### Established Patterns
- Field-presence variant detection in templates (v-if on field existence)
- Type assertions (`as Exhibit[]`) on JSON import
- Optional fields for variant handling (PersonnelEntry pattern from Phase 20)

### Integration Points
- Both layout components (InvestigationReportLayout, EngineeringBriefLayout) render findings
- Layout uses `exhibit.findings[0].background !== undefined` for column variant detection — needs update after background→description rename

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
