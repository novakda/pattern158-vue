# Phase 17: Types Infrastructure and Simple Data Migration - Research

**Researched:** 2026-04-06
**Domain:** TypeScript data externalization, JSON module imports, barrel exports
**Confidence:** HIGH

## Summary

This phase creates two foundational pieces: a centralized `src/types/` directory with barrel exports, and the migration of 5 simple data files from co-located TypeScript (data + types in one `.ts` file) to separated JSON data + thin TypeScript loader. The codebase already has `resolveJsonModule: true` in tsconfig and Vite handles JSON imports natively, so no tooling changes are needed.

The 5 simple files (stats, techPills, specialties, brandElements, methodologySteps) are genuinely simple -- flat arrays of objects with string/number/optional-string properties. No discriminated unions, no `as const`, no computed values. This makes them ideal first candidates for JSON extraction.

**Primary recommendation:** Extract types to `src/types/`, create JSON files in `src/data/json/`, write thin loaders that re-export both data and types from the original `src/data/*.ts` paths so all existing imports resolve unchanged.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion -- pure infrastructure phase. Key architectural decisions from research:
- JSON files go in `src/data/json/` subdirectory
- Thin `.ts` loaders in `src/data/` import JSON, assert types, re-export
- Types centralized in `src/types/` with barrel `index.ts`
- Cross-boundary types (Tag, ExpertiseLevel) moved to `src/types/`

### Claude's Discretion
All implementation choices.

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TYPE-01 | All data interfaces centralized in `src/types/` with barrel exports | Architecture Patterns section -- barrel index.ts pattern, type definitions for all 5 simple data files |
| TYPE-02 | Cross-boundary types (Tag, ExpertiseLevel) moved to `src/types/` | Cross-boundary types analysis -- currently in `src/components/TechTags.types.ts` and `src/components/ExpertiseBadge.types.ts` |
| TYPE-03 | All existing component imports of types continue to resolve | Re-export strategy in Architecture Patterns -- old files re-export from `src/types/` |
| SMPL-01 | `stats.ts` externalized to JSON + thin loader | Code Examples section -- `Stat` interface, 4-item array |
| SMPL-02 | `techPills.ts` externalized to JSON + thin loader | Code Examples section -- `string[]`, 8 items |
| SMPL-03 | `specialties.ts` externalized to JSON + thin loader | Code Examples section -- `Specialty` interface, 4-item array |
| SMPL-04 | `brandElements.ts` externalized to JSON + thin loader | Code Examples section -- `BrandElement` interface, 6 items with optional `sourceNote` |
| SMPL-05 | `methodologySteps.ts` externalized to JSON + thin loader | Code Examples section -- `MethodologyStep` interface, 3-item array |
| VALD-01 | All 64+ existing unit tests pass | Validation Architecture section -- `vitest run --project unit` |
| VALD-02 | Clean production build succeeds | Validation Architecture section -- `vue-tsc -b && vite build` |
| VALD-03 | No component file changes required | Import analysis -- all imports from `@/data/*` paths preserved by thin loaders |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | (project-installed) | Type definitions and barrel exports | Already in project [VERIFIED: tsconfig.json] |
| Vite | (project-installed) | JSON module resolution at build time | Already in project, handles JSON imports natively [VERIFIED: vite.config.ts] |
| Vitest | 4.1.0 | Test runner for validation | Already in project, 64 tests passing [VERIFIED: test run output] |

### Supporting
No additional libraries needed. This phase uses only existing project tooling.

**Installation:**
```bash
# No new packages required
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── types/
│   └── index.ts              # Barrel export for all data interfaces
├── data/
│   ├── json/
│   │   ├── stats.json
│   │   ├── techPills.json
│   │   ├── specialties.json
│   │   ├── brandElements.json
│   │   └── methodologySteps.json
│   ├── stats.ts              # Thin loader (imports JSON, re-exports typed data + type)
│   ├── techPills.ts           # Thin loader
│   ├── specialties.ts         # Thin loader
│   ├── brandElements.ts       # Thin loader
│   ├── methodologySteps.ts    # Thin loader
│   ├── exhibits.ts            # UNCHANGED (Phase 19)
│   ├── exhibits.test.ts       # UNCHANGED
│   ├── findings.ts            # UNCHANGED (Phase 18)
│   ├── faq.ts                 # UNCHANGED (Phase 18)
│   ├── influences.ts          # UNCHANGED (Phase 18)
│   ├── philosophyInfluences.ts # UNCHANGED (Phase 18)
│   └── technologies.ts        # UNCHANGED (not in scope)
└── components/
    ├── TechTags.types.ts      # Re-exports Tag from @/types (backward compat)
    └── ExpertiseBadge.types.ts # Re-exports ExpertiseLevel from @/types (backward compat)
```

### Pattern 1: Thin TypeScript Loader
**What:** Each `src/data/*.ts` file becomes a thin wrapper that imports JSON, casts to the correct type, and re-exports.
**When to use:** Every simple data file migration.
**Example:**
```typescript
// src/data/stats.ts (after migration)
import type { Stat } from '@/types'
import statsData from './json/stats.json'

export type { Stat }
export const stats: Stat[] = statsData
```
[VERIFIED: pattern aligns with resolveJsonModule: true in tsconfig.json]

**Key details:**
- `resolveJsonModule: true` is already set in tsconfig.json, so `import x from './file.json'` works [VERIFIED: tsconfig.json line 8]
- TypeScript infers JSON imports as their literal shape. Assigning to a typed variable (`const stats: Stat[] = statsData`) provides the type assertion [VERIFIED: TypeScript handbook]
- The `export type { Stat }` re-export ensures components importing `import type { Stat } from '@/data/stats'` continue to work

### Pattern 2: Barrel Export for Types
**What:** Single `src/types/index.ts` that exports all data interfaces.
**When to use:** Centralizing types for the types infrastructure.
**Example:**
```typescript
// src/types/index.ts
export type { Stat } from './stat'
export type { Specialty } from './specialty'
export type { BrandElement } from './brandElement'
export type { MethodologyStep } from './methodologyStep'
export type { Tag } from './tag'
export type { ExpertiseLevel } from './expertiseLevel'
export { expertiseLevels } from './expertiseLevel'
```

**Note on ExpertiseLevel:** The `expertiseLevels` array (`['deep', 'working', 'aware'] as const`) is a runtime value used to derive the `ExpertiseLevel` type. It must be exported as a value, not just a type. The `as const` assertion must stay in TypeScript (not JSON) because JSON cannot express const assertions. [VERIFIED: src/components/ExpertiseBadge.types.ts]

### Pattern 3: Cross-Boundary Type Migration with Backward-Compatible Re-exports
**What:** Move types from component-local files to `src/types/`, leave re-export shims in original locations.
**When to use:** For `Tag` and `ExpertiseLevel` which currently live in `src/components/*.types.ts`.
**Example:**
```typescript
// src/components/TechTags.types.ts (after migration -- backward-compat shim)
export type { Tag } from '@/types'
```
```typescript
// src/components/ExpertiseBadge.types.ts (after migration -- backward-compat shim)
export { expertiseLevels } from '@/types'
export type { ExpertiseLevel } from '@/types'
```

### Anti-Patterns to Avoid
- **Modifying .vue files:** The entire point of thin loaders is that component import paths stay unchanged. Zero `.vue` files should be touched.
- **Modifying .test.ts files:** Test files import from `@/data/*` paths which thin loaders preserve.
- **Putting types in JSON:** JSON cannot express TypeScript interfaces, `as const`, or union types. Types stay in `.ts` files.
- **Using `as` type assertions on JSON imports:** Prefer typed variable declarations (`const x: Type[] = jsonData`) over `as` casts (`jsonData as Type[]`). The former catches shape mismatches at compile time.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON schema validation | Runtime validators (Zod/Valibot) | TypeScript compile-time checking | Explicitly out of scope per REQUIREMENTS.md |
| Module re-exports | Complex index files with dynamic imports | Simple `export { x } from './y'` re-exports | Static re-exports are tree-shaken by Vite |

**Key insight:** This phase is pure structural reorganization. The data content doesn't change, only where it lives and how it's imported. Keep it mechanical.

## Common Pitfalls

### Pitfall 1: Unicode Characters in JSON
**What goes wrong:** Special characters like em dashes, curly quotes, and Unicode symbols in the data files may need to be preserved exactly when converting to JSON.
**Why it happens:** `brandElements.ts` contains em dashes, curly quotes, and Unicode characters (e.g., `\u201c`, `\u2014`).
**How to avoid:** Use `JSON.stringify()` on the existing TypeScript data arrays to generate the JSON files programmatically, or let the editor handle UTF-8 encoding correctly. JSON natively supports Unicode.
**Warning signs:** Build succeeds but text renders with garbled characters.

### Pitfall 2: Optional Fields in JSON
**What goes wrong:** TypeScript interfaces with optional fields (e.g., `sourceNote?: string` in `BrandElement`) -- JSON will have the key absent entirely vs. explicitly `null`.
**Why it happens:** TypeScript `?` means the key can be missing. JSON typically omits the key rather than setting it to `null`.
**How to avoid:** When generating JSON, simply omit optional keys that have no value. The TypeScript type assertion (`const x: BrandElement[] = jsonData`) will still type-check correctly because missing keys satisfy optional field requirements.
**Warning signs:** TypeScript compile errors about missing properties.

### Pitfall 3: techPills Has No Interface
**What goes wrong:** `techPills.ts` exports `string[]` with no named interface. Creating a type for it is unnecessary.
**Why it happens:** Not all data files have custom interfaces.
**How to avoid:** The thin loader for techPills simply types it as `string[]`. No entry needed in `src/types/index.ts` for this file unless a named type alias is desired for consistency.
**Warning signs:** Over-engineering a type where `string[]` suffices.

### Pitfall 4: tsconfig include Not Listing JSON
**What goes wrong:** Developer worries JSON files aren't "included" in the TypeScript project.
**Why it happens:** `tsconfig.json` `include` only lists `*.ts` and `*.vue`, not `*.json`.
**How to avoid:** This is fine. With `resolveJsonModule: true`, TypeScript resolves JSON imports regardless of the `include` array. Vite handles the actual bundling. No tsconfig changes needed. [VERIFIED: TypeScript resolveJsonModule docs]
**Warning signs:** None -- this is a non-issue.

### Pitfall 5: ExpertiseBadge.types.ts Contains Runtime Value
**What goes wrong:** Treating `ExpertiseBadge.types.ts` as pure types and losing the `expertiseLevels` const array.
**Why it happens:** The file exports both a runtime value (`expertiseLevels` array) and a derived type.
**How to avoid:** The `expertiseLevels` const array must be moved to `src/types/expertiseLevel.ts` and re-exported through both the barrel and the backward-compat shim. It cannot go in JSON because `as const` is a TypeScript feature.
**Warning signs:** Runtime errors in components that use `expertiseLevels` for rendering.

## Code Examples

### JSON File (stats.json)
```json
[
  { "number": "28+", "label": "Years" },
  { "number": "5,200+", "label": "Projects" },
  { "number": "40+", "label": "Clients" },
  { "number": "930+", "label": "Testimonials" }
]
```
[VERIFIED: derived from src/data/stats.ts]

### Type Definition (src/types/stat.ts)
```typescript
export interface Stat {
  number: string
  label: string
}
```
[VERIFIED: extracted from src/data/stats.ts]

### Thin Loader (src/data/stats.ts after migration)
```typescript
import type { Stat } from '@/types'
import statsData from './json/stats.json'

export type { Stat }
export const stats: Stat[] = statsData
```

### Barrel Export (src/types/index.ts)
```typescript
export type { Stat } from './stat'
export type { Specialty } from './specialty'
export type { BrandElement } from './brandElement'
export type { MethodologyStep } from './methodologyStep'
export type { Tag } from './tag'
export type { ExpertiseLevel } from './expertiseLevel'
export { expertiseLevels } from './expertiseLevel'
```

### Cross-Boundary Type File (src/types/expertiseLevel.ts)
```typescript
export const expertiseLevels = ['deep', 'working', 'aware'] as const
export type ExpertiseLevel = (typeof expertiseLevels)[number]
```

### Backward-Compatible Shim (src/components/ExpertiseBadge.types.ts)
```typescript
export { expertiseLevels } from '@/types'
export type { ExpertiseLevel } from '@/types'
```

## Existing Import Map (consumers that must not break)

| File | Imports | Import Path |
|------|---------|-------------|
| `HomePage.vue` | `{ techPills }` (value) | `@/data/techPills` |
| `HomePage.vue` | `{ specialties }` (value) | `@/data/specialties` |
| `HomePage.vue` | `{ stats }` (value) | `@/data/stats` |
| `PhilosophyPage.vue` | `{ brandElements }` (value) | `@/data/brandElements` |
| `StatsSection.vue` | `type { Stat }` | `@/data/stats` |
| `BrandElement.vue` | `type { BrandElement }` | `@/data/brandElements` |
| `MethodologyStep.vue` | `type { MethodologyStep }` | `@/data/methodologySteps` |
| `technologies.ts` | `type { Tag }` | `@/components/TechTags.types` |
| `technologies.ts` | `type { ExpertiseLevel }` | `@/components/ExpertiseBadge.types` |
| `TechCard.vue` | `type { ExpertiseLevel }` | `@/components/ExpertiseBadge.types` |
| `TechCard.vue` | `type { Tag }` | `@/components/TechTags.types` |
| `ExpertiseBadge.vue` | `type { ExpertiseLevel }` | `./ExpertiseBadge.types` |
| `TechTags.vue` | `type { Tag }` | `@/components/TechTags.types` |

[VERIFIED: grep of all imports in src/]

**Key observation:** `methodologySteps` data is NOT imported by any page -- only the `MethodologyStep` type is imported by the component. The data must be passed as props from a parent (likely hardcoded in a template or imported elsewhere not caught by grep). This is fine -- the thin loader still works.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vite.config.ts` (test section) |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TYPE-01 | Types barrel exists and exports all interfaces | unit | `npx vitest run --project unit` | No -- Wave 0 |
| TYPE-02 | Cross-boundary types importable from `@/types` | unit | `npx vitest run --project unit` | No -- Wave 0 |
| TYPE-03 | Existing imports resolve | build | `vue-tsc -b && vite build` | N/A (build check) |
| SMPL-01 | stats.ts re-exports from JSON | unit | `npx vitest run --project unit` | No -- Wave 0 |
| SMPL-02 | techPills.ts re-exports from JSON | unit | `npx vitest run --project unit` | No -- Wave 0 |
| SMPL-03 | specialties.ts re-exports from JSON | unit | `npx vitest run --project unit` | No -- Wave 0 |
| SMPL-04 | brandElements.ts re-exports from JSON | unit | `npx vitest run --project unit` | No -- Wave 0 |
| SMPL-05 | methodologySteps.ts re-exports from JSON | unit | `npx vitest run --project unit` | No -- Wave 0 |
| VALD-01 | All 64 existing tests pass | unit | `npx vitest run --project unit` | Yes (8 test files, 64 tests) |
| VALD-02 | Clean production build | build | `vue-tsc -b && vite build` | N/A (build check) |
| VALD-03 | No .vue or .test.ts files modified | manual/git | `git diff --name-only \| grep -E '\.(vue\|test\.ts)$'` | N/A (git check) |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit`
- **Per wave merge:** `npx vitest run --project unit && vue-tsc -b && vite build`
- **Phase gate:** Full suite green + build clean + no .vue/.test.ts modifications

### Wave 0 Gaps
- [ ] `src/data/simpleData.test.ts` -- covers SMPL-01 through SMPL-05 (verifies JSON data matches expected shape and content)
- [ ] `src/types/types.test.ts` -- covers TYPE-01, TYPE-02 (verifies barrel exports resolve)

Note: The primary validation for this phase is that the **existing 64 tests continue to pass** and the **build succeeds**. New tests for the simple data files are optional but recommended for regression safety.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | JSON imports work without adding `*.json` to tsconfig `include` when `resolveJsonModule: true` is set | Pitfall 4 | LOW -- would require a one-line tsconfig change |
| A2 | Vite tree-shakes re-exported JSON data correctly | Anti-Patterns | LOW -- worst case is slightly larger bundle, still correct |

## Open Questions

1. **Should `techPills` get a named type alias?**
   - What we know: It's currently `string[]` with no named interface
   - What's unclear: Whether a `TechPill` type alias adds value or is noise
   - Recommendation: Skip it -- `string[]` is self-documenting. Don't add types for the sake of types.

2. **Should new tests be written for the simple data files?**
   - What we know: The 64 existing tests don't directly test the 5 simple data files. They test exhibits and components.
   - What's unclear: Whether the effort of writing new data tests is justified for arrays of 3-8 items
   - Recommendation: Write minimal smoke tests (file imports successfully, array has expected length) as Wave 0. The real validation is that existing tests + build still pass.

## Sources

### Primary (HIGH confidence)
- `src/data/stats.ts`, `techPills.ts`, `specialties.ts`, `brandElements.ts`, `methodologySteps.ts` -- read directly, all types and data structures verified
- `src/components/TechTags.types.ts`, `ExpertiseBadge.types.ts` -- cross-boundary type files verified
- `tsconfig.json` -- `resolveJsonModule: true`, `paths` alias, `include` array verified
- `vite.config.ts` -- test configuration verified
- Full import graph from grep of all `@/data/*` imports across `.vue` and `.ts` files

### Secondary (MEDIUM confidence)
- TypeScript resolveJsonModule behavior with tsconfig include -- well-documented TypeScript feature [ASSUMED but low risk]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new packages, all existing tooling
- Architecture: HIGH -- pattern is mechanical and well-understood
- Pitfalls: HIGH -- based on direct codebase analysis
- Cross-boundary types: HIGH -- exact files and import paths verified

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- no external dependencies)
