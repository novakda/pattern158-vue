# Phase 19: Exhibits Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Migrate exhibits.ts — the largest and most complex data file (~138KB, 15 exhibits, 8 interfaces, discriminated unions) — to JSON + thin TypeScript loader. All discriminated union types (`exhibitType`: 'investigationReport' | 'engineeringBrief', and section `type` with 5 variants) must be correctly asserted on JSON import. All 9 consumer components must render correctly with no code changes.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key considerations from research:
- exhibits.ts has discriminated unions that widen to `string` when imported from JSON — must use type assertion
- Existing exhibits.test.ts validates data integrity — must continue passing
- 9 consumer components use exhibit types — import paths must remain unchanged
- JSON has `null` but not `undefined` — omit optional fields rather than setting to `null`
- The established thin loader pattern from Phases 17-18 applies here

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phases 17-18 established the thin loader pattern on 9 files — replicate for exhibits
- `src/types/` directory with barrel exports for all other data types
- `src/data/json/` directory with 9 JSON files from prior phases
- `src/data/exhibits.test.ts` — existing test file for data integrity

### Established Patterns
- Thin loader: import JSON, assert type, re-export data + types
- Types in `src/types/X.ts`, re-exported from `src/types/index.ts`

### Integration Points
- 9 consumer components: ExhibitCard, ExhibitDetailPage, InvestigationReportLayout, EngineeringBriefLayout, CaseFilesPage, and others
- All import from `@/data/exhibits`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
