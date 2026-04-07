# Phase 21: Technologies Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Exhibit technologies data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure. 8 exhibits have technologies tables with identical columns: ["Category", "Technologies & Tools"] (Exhibits A, C, D, E, F, G, I, J).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Follow the same pattern established in Phase 20 (PersonnelEntry migration). Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/exhibit.ts` — Now has PersonnelEntry as reference pattern for new TechnologyEntry
- `src/data/exhibits.ts` — thin loader with PersonnelEntry export pattern to follow
- `src/data/json/exhibits.json` — 15 exhibits, 8 have technologies table sections to promote

### Established Patterns
- Phase 20 established the migration pattern: add type → transform JSON → remove sections → update layouts → add tests
- Both layout components already have personnel rendering blocks to use as template
- `sectionHasContent()` guard remains for remaining generic table sections

### Integration Points
- `src/types/exhibit.ts` — add TechnologyEntry interface and `technologies?` field to Exhibit
- `src/types/index.ts` — export new type from barrel
- `src/data/json/exhibits.json` — add technologies arrays, remove technologies table sections
- Both layout .vue files — add technologies rendering block

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Follow Phase 20 pattern exactly.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
