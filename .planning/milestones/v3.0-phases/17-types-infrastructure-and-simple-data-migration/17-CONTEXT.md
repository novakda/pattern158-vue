# Phase 17: Types Infrastructure and Simple Data Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Establish `src/types/` directory with barrel exports for all data interfaces. Migrate 5 simple data files (stats, techPills, specialties, brandElements, methodologySteps) to JSON + thin TypeScript loader pattern. Resolve cross-boundary types (Tag, ExpertiseLevel) into `src/types/`. All existing component imports must continue working unchanged.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key architectural decisions from research:
- JSON files go in `src/data/json/` subdirectory
- Thin `.ts` loaders in `src/data/` import JSON, assert types, re-export
- Types centralized in `src/types/` with barrel `index.ts`
- Cross-boundary types (Tag, ExpertiseLevel) moved to `src/types/`

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 11 TypeScript data files in `src/data/` with co-located types and data
- Existing `exhibits.test.ts` test file validating data integrity

### Established Patterns
- Vue 3 Composition API + TypeScript throughout
- `@/` path alias configured in tsconfig for `src/`
- `resolveJsonModule: true` already set in tsconfig.json

### Integration Points
- All page components import from `src/data/*.ts`
- Components import types from data files (e.g., `import type { Exhibit } from '@/data/exhibits'`)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
