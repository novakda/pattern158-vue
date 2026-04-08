# Phase 18: Complex Data Migration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Migrate 4 data files with nested structures, union types, and `as const` handling to JSON + thin TypeScript loader pattern. Files: findings.ts, philosophyInfluences.ts, influences.ts, faq.ts. The `faqCategories` `as const` literal type behavior must be preserved (kept in TypeScript, not moved to JSON). All existing component imports must continue working unchanged.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key architectural decisions from Phase 17 (established pattern):
- JSON files go in `src/data/json/` subdirectory
- Thin `.ts` loaders in `src/data/` import JSON, assert types from `@/types`, re-export
- Types centralized in `src/types/` with barrel `index.ts`
- `faqCategories` uses `as const` — must stay in TypeScript, only `faqItems` data moves to JSON

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 17 established the thin loader pattern on 5 simple files — replicate for complex files
- `src/types/` directory with barrel exports already exists
- `src/data/json/` directory already exists with 5 JSON files

### Established Patterns
- Thin loader: `import data from './json/X.json'; import type { T } from '@/types'; export const x: T[] = data as T[]; export type { T };`
- Types extracted to `src/types/X.ts` and re-exported from `src/types/index.ts`

### Integration Points
- Components import from `@/data/X` — these paths must remain unchanged
- New types need to be added to `src/types/index.ts` barrel

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
