# Phase 20: Personnel Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Exhibit personnel data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure. 11 exhibits have personnel tables across 3 column variants: ["Name", "Title", "Organization"] (8), ["Name", "Title", "Role"] (2), ["Role", "Involvement"] (1).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/exhibit.ts` — ExhibitSection type with table support (columns/rows)
- `src/data/exhibits.ts` — thin loader that imports JSON and asserts `as Exhibit[]`
- `src/data/json/exhibits.json` — all 15 exhibits with sections arrays

### Established Patterns
- Thin loader pattern: JSON in `src/data/json/`, TypeScript loader in `src/data/`, types in `src/types/`
- Both layout components (InvestigationReportLayout, EngineeringBriefLayout) are identical in section rendering logic
- Generic table rendering: `v-else-if="section.type === 'table'"` with `columns` headers and `rows` cells
- `sectionHasContent()` guard function checks content arrays per type

### Integration Points
- `src/types/exhibit.ts` — add PersonnelEntry interface and `personnel?` field to Exhibit
- `src/types/index.ts` — export new type from barrel
- `src/data/json/exhibits.json` — add personnel arrays, remove personnel table sections
- Both layout .vue files — add personnel rendering block

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
