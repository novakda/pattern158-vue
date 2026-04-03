# Phase 21: Type Definition & Data Extraction - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Define ExhibitFindingEntry interface and migrate 7 exhibits' findings table data to typed first-class arrays. Remove old findings table sections from migrated exhibits. Preserve custom headings for Exhibits J and L.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure/data migration phase. Follow the v2.2 personnel promotion pattern (ExhibitPersonnelEntry) as direct reference. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- ExhibitPersonnelEntry interface in exhibits.ts — direct pattern reference for ExhibitFindingEntry
- Exhibit interface with optional personnel[] array — same pattern for findings[]
- exhibits.ts contains all 7 table-type findings sections with string[][] rows

### Established Patterns
- v2.2 personnel promotion: interface → array field → data migration → old sections kept
- Optional fields pattern: all fields optional except primary identifier
- findingsHeading parallels how section headings work in exhibit data

### Integration Points
- src/data/exhibits.ts — all changes happen here (interface + data)
- Naming collision: existing Finding interface in src/data/findings.ts is unrelated (homepage)

</code_context>

<specifics>
## Specific Ideas

- Interface fields: finding (required), description?, background?, resolution?, severity?
- 7 exhibits to migrate: A (3-col), E (2-col), F (2-col), J (2-col), L (3-col severity), N (2-col), O (2-col)
- Remove old findings table sections from sections[] after migration (unlike personnel which kept both)
- Preserve custom headings: Exhibit J "Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)", Exhibit L "Findings -- Five Foundational Gaps"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
