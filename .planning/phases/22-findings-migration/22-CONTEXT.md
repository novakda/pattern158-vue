# Phase 22: Findings Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Exhibit findings data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure. 6 exhibits have findings tables across 3 column variants:
- ["Finding", "Description"] — 4 exhibits (E, J, M, N)
- ["Finding", "Background", "Resolution"] — 1 exhibit (A)
- ["Finding", "Severity", "Description"] — 1 exhibit (L)

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Follow the same pattern established in Phases 20-21 (PersonnelEntry, TechnologyEntry migrations). Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key design note: The FindingEntry interface must accommodate all 3 column variants with optional fields:
- finding: string (always present)
- description?: string (4 exhibits + 1 exhibit L)
- background?: string (only Exhibit A)
- resolution?: string (only Exhibit A)
- severity?: string (only Exhibit L)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/exhibit.ts` — Now has PersonnelEntry and TechnologyEntry as reference patterns
- `src/data/exhibits.ts` — thin loader with both type exports to follow
- `src/data/json/exhibits.json` — 15 exhibits, 6 have findings table sections to promote

### Established Patterns
- Phase 20-21 established the migration pattern: add type → transform JSON → remove sections → update layouts → add tests
- Both layout components already have personnel and technologies rendering blocks
- Findings rendering must adapt to column variants (unlike technologies which had one variant)

### Integration Points
- `src/types/exhibit.ts` — add FindingEntry interface and `findings?` field to Exhibit
- `src/types/index.ts` — export new type from barrel
- `src/data/json/exhibits.json` — add findings arrays, remove findings table sections
- Both layout .vue files — add findings rendering block with variant detection

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Follow Phase 20-21 pattern. Findings rendering needs column variant detection similar to personnel's 3-variant handling.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
