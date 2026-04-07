# Feature Research

**Domain:** JSON data externalization in Vue 3 + TypeScript + Vite
**Researched:** 2026-04-06
**Confidence:** HIGH

## Context Note

This is a **data externalization milestone** (v3.0), not a greenfield build. The v2.1 site is complete with 11 TypeScript data files in `src/data/` exporting typed arrays/objects, consumed by Vue components across 9 pages. 15 exhibit records with complex nested structures and union types. 64 unit tests passing. The goal is to decouple content (JSON) from code (TypeScript types), preparing for future CMS integration without breaking anything.

The critical constraint: **25+ import statements** across pages, components, and test files reference `@/data/*` paths. The migration must preserve these paths or update them systematically.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that are non-negotiable for a correct JSON externalization. Missing any of these means the migration is incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| JSON files replacing TS data exports | The entire point of the milestone -- decouple content from code | LOW | Vite natively imports `.json` with `resolveJsonModule: true` (already set in tsconfig). Each of the 11 data files becomes a `.json` file in `src/data/`. |
| Centralized type definitions in `src/types/` | Types currently co-located with data in `.ts` files. Moving data to JSON means types must live elsewhere. | LOW | Create `src/types/` directory. Move all `export interface` and `export type` declarations from `src/data/*.ts` into dedicated type files. |
| Type-safe re-export modules | Components currently import both data and types from `src/data/foo`. Import paths must remain stable. | MEDIUM | Each `src/data/*.ts` becomes a thin re-export module: imports JSON, asserts type, re-exports. This preserves existing import paths and provides the type assertion layer. |
| Zero breaking changes to component imports | 25+ import statements across pages, components, and tests reference `@/data/*`. All must continue working. | MEDIUM | The re-export pattern (`src/data/exhibits.ts` imports `exhibits.json` and re-exports typed data) makes this seamless. Alternative: update all imports directly to JSON + separate type imports, but that is unnecessary churn. |
| All 64 tests passing after migration | Existing test suite is the regression safety net. | LOW | Tests import from `@/data/*` -- if re-export modules preserve signatures, tests pass without changes. |
| Clean production build | Vite must bundle JSON correctly with tree-shaking. | LOW | Vite handles JSON imports natively -- no configuration needed. JSON is statically analyzable and tree-shakeable at the property level. |

### Differentiators (Competitive Advantage)

Features that elevate the migration from "it works" to "it's well-engineered." These demonstrate portfolio-quality engineering decisions.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Type assertion with `satisfies` operator | Proves the JSON data conforms to TypeScript interfaces at import time, catching data/type drift. Portfolio-quality type safety. | LOW | Pattern: `import raw from './exhibits.json'; export const exhibits = raw as Exhibit[];` with compile-time validation. `satisfies` provides even stricter checking if the inferred JSON shape is close enough. Available since TypeScript 4.9. |
| Consistent type file organization | Single `src/types/` directory with clear naming conventions makes the type system discoverable. | LOW | One type file per domain: `exhibit.types.ts`, `technology.types.ts`, etc. Cross-cutting types (like `Tag`, `ExpertiseLevel`) that currently live in component `.types.ts` files need resolution. |
| Cross-dependency resolution for shared types | `technologies.ts` imports types from component files (`TechTags.types.ts`, `ExpertiseBadge.types.ts`). This dependency must be cleanly resolved. | MEDIUM | Move `Tag` and `ExpertiseLevel` to `src/types/` and have both data re-exports and components import from there. Types flow outward from `src/types/` to both data and components. |
| Discriminated union types preserved in JSON | The `exhibitType` discriminant (`'investigation-report' | 'engineering-brief'`) and `ExhibitSection.type` (`'text' | 'table' | 'flow' | 'timeline' | 'metadata'`) must narrow correctly when loaded from JSON. | LOW | JSON string values work with discriminated unions via type assertion. The re-export module's type annotation ensures the literal values match the union. |
| `as const` category arrays preserved | `faqCategories` uses `as const` for literal types on `id` fields. JSON imports lose `as const` narrowing. | MEDIUM | The re-export module must re-assert the const narrowing. Either define a typed constant with literal types, or use `as const satisfies` on the imported value. This is the one place where JSON import behavior differs meaningfully from inline TS. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Runtime JSON validation (Zod/Valibot) | "What if the JSON is malformed?" | The JSON is co-located in the repo and checked at compile time via TypeScript. Runtime validation adds a dependency and bundle size for data that never changes at runtime. This is a static site, not a CMS. | Use TypeScript type assertions for compile-time validation. Add JSON linting in CI if extra confidence is wanted. |
| JSON Schema files alongside data | "Document the shape of each JSON file" | TypeScript interfaces ARE the schema. JSON Schema would duplicate them and drift. Maintaining two sources of truth is worse than one. | TypeScript types in `src/types/` are the single source of truth. |
| Dynamic `import()` for JSON files | "Lazy-load data for performance" | Total data is ~180KB of TypeScript (mostly exhibits at 138KB). As JSON without type definitions, it will be smaller. This is a portfolio site with 9 routes already lazy-loaded. Per-file JSON lazy loading adds complexity for negligible gain. | Static imports. Vite bundles JSON into route chunks automatically via lazy-loaded pages. |
| YAML/TOML instead of JSON | "More human-readable for content editing" | Adds a build-time transform step, a parser dependency, and breaks `resolveJsonModule`. JSON is natively supported by TypeScript and Vite with zero configuration. | Use JSON. It is not as pretty for hand-editing, but it is zero-config and type-safe. |
| Auto-generating types from JSON | "Derive types from the data" | Types should be authoritative (designed), not derived (inferred). The existing interfaces have optional fields, union types, and semantic meaning that inference would lose or flatten. | Hand-authored types in `src/types/`, JSON validated against them. |
| Splitting exhibits.json into per-exhibit files | "One file per exhibit for easier editing" | 15 exhibits is not enough to justify per-file splitting. It would require a dynamic import pattern or a barrel file that reassembles them, adding complexity for no real gain. | Single `exhibits.json` array. Revisit at 50+ exhibits (which is explicitly out of scope per PROJECT.md). |
| Moving data to `public/` for runtime fetch | "Prepare for CMS by fetching JSON at runtime" | PROJECT.md explicitly puts runtime fetching out of scope. Moving to `public/` loses type safety, tree-shaking, and compile-time validation. | Keep JSON in `src/data/` as static imports. Future CMS milestone can change the data source without changing the type layer. |
| Barrel index files in `src/types/` | "Export everything from index.ts for cleaner imports" | With 11 type files, barrel files add a maintenance burden and can cause circular import issues. Direct imports are clearer. | Import directly from specific type files: `import type { Exhibit } from '@/types/exhibit.types'`. |

---

## Feature Dependencies

```
[Centralized types in src/types/]
    |
    +--required-by--> [Type-safe re-export modules in src/data/]
    |                      |
    |                      +--required-by--> [JSON files created in src/data/]
    |
    +--required-by--> [Component type imports updated]

[Cross-dependency resolution (Tag, ExpertiseLevel)]
    |
    +--required-by--> [technology.types.ts in src/types/]
    +--required-by--> [Component imports of Tag/ExpertiseLevel updated]

[JSON files + re-export modules complete]
    |
    +--required-by--> [Test suite verification]
    +--required-by--> [Production build verification]
```

### Dependency Notes

- **Re-export modules require centralized types:** You cannot write `import raw from './exhibits.json'; export const exhibits: Exhibit[] = raw;` until `Exhibit` is importable from `src/types/`.
- **JSON files require re-export modules (for zero-breakage):** Creating JSON files without the re-export shim would break all 25+ import statements simultaneously. The shim must exist before the JSON files replace inline data.
- **Cross-dependency resolution is prerequisite for technologies:** `TechCardData` references `Tag` and `ExpertiseLevel` from component type files (`TechTags.types.ts`, `ExpertiseBadge.types.ts`). These must be relocated or re-exported before `technology.types.ts` can be finalized.
- **Tests and build verification depend on everything else:** They validate the migration, so they run last in each phase.
- **Simple data files are independent of each other:** `stats.ts`, `techPills.ts`, `specialties.ts`, etc. can be converted in any order. Only `technologies.ts` (cross-dependency) and `faq.ts` (`as const` handling) need special attention.

---

## MVP Definition

### Launch With (v3.0)

This is the complete scope -- the milestone is already tightly scoped.

- [ ] All 11 data files converted to JSON + typed re-export pattern
- [ ] All type definitions centralized in `src/types/`
- [ ] All existing component imports unbroken (same `@/data/*` paths work)
- [ ] Type assertions on all re-export modules for compile-time safety
- [ ] Cross-dependency for `Tag`/`ExpertiseLevel` cleanly resolved (moved to `src/types/`)
- [ ] `as const` behavior preserved for `faqCategories`
- [ ] Discriminated unions (`exhibitType`, `section.type`) validated through type layer
- [ ] 64 tests passing, clean production build

### Add After Validation (v3.x)

- [ ] JSON formatting/linting added to CI (prettier for JSON files)
- [ ] Evaluate whether `Tag` and `ExpertiseLevel` in `src/types/` simplifies component imports enough to update component `.types.ts` files

### Future Consideration (v4+)

- [ ] CMS integration replacing JSON files with API responses (types and re-export layer already support this swap -- only re-export modules change)
- [ ] Per-exhibit file splitting if exhibit count grows past 50
- [ ] Runtime validation if data source becomes external/untrusted (Zod/Valibot at that point)

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Centralized types in `src/types/` | HIGH | LOW | P1 |
| Cross-dependency resolution (Tag/ExpertiseLevel) | HIGH | LOW | P1 |
| JSON file creation (11 files) | HIGH | LOW | P1 |
| Re-export modules with type assertions | HIGH | LOW | P1 |
| `as const` preservation for faqCategories | MEDIUM | LOW | P1 |
| Discriminated union validation | MEDIUM | LOW | P1 |
| Test suite verification | HIGH | LOW | P1 |
| Production build verification | HIGH | LOW | P1 |

**Priority key:**
- P1: Must have for v3.0 -- everything here is P1 because the milestone scope is already minimal and tightly coupled

---

## Data File Inventory and Conversion Notes

Specific notes per file for roadmap phase planning.

| File | Size | Types Defined | Import Count | Complexity | Conversion Notes |
|------|------|---------------|-------------|------------|-----------------|
| `exhibits.ts` | 138KB | 8 interfaces, 1 type alias, 1 union type | 7 (data + type imports) | HIGH | Largest file. Complex nested structures: `ExhibitSection` with discriminated `type` field, optional arrays of `ExhibitQuote`, `ExhibitFlowStep`, `ExhibitTimelineEntry`, `ExhibitMetadataItem`, `ExhibitResolutionRow`. Most critical to get right. |
| `technologies.ts` | 25KB | 2 interfaces | 1 (data + type) | MEDIUM | Imports `Tag` from `TechTags.types.ts` and `ExpertiseLevel` from `ExpertiseBadge.types.ts`. Cross-dependency must be resolved before this file can be converted. |
| `faq.ts` | 7.5KB | 1 interface | 1 (data import) | MEDIUM | Two separate exports: `faqItems` (typed array) and `faqCategories` (const assertion). The `as const` on categories needs special handling in re-export. Category `id` field uses literal string union (`'hiring' | 'expertise' | 'style' | 'process'`). |
| `philosophyInfluences.ts` | 3.9KB | 1 interface | 1 (data + type) | LOW | Simple flat structure with string arrays (`paragraphs: string[]`). |
| `findings.ts` | 2.5KB | 1 interface | 1 (data + type) | LOW | Simple flat structure with optional `link` and `tags: string[]`. |
| `influences.ts` | 1.9KB | 3 interfaces | 1 (data + type) | LOW | Nested but straightforward: `Influence` contains `InfluenceSegment[]` with optional `InfluenceLink`. |
| `brandElements.ts` | 1.8KB | 1 interface | 1 (data + type) | LOW | Simple flat structure with optional `sourceNote`. |
| `specialties.ts` | 835B | 1 interface | 0 (data only from pages) | LOW | Two-field interface. Trivial conversion. |
| `methodologySteps.ts` | 788B | 1 interface | 1 (type import from component) | LOW | Two-field interface. Trivial conversion. |
| `stats.ts` | 257B | 1 interface | 1 (data + type) | LOW | Two-field interface. Trivial conversion. |
| `techPills.ts` | 160B | 0 (string array) | 0 (data only) | LOW | No interface needed -- just `string[]`. Simplest possible conversion. |

### Conversion Order Recommendation

Based on dependencies and complexity:

1. **Simple files first** (stats, techPills, specialties, methodologySteps, brandElements) -- build confidence, establish the pattern
2. **Medium files** (findings, influences, philosophyInfluences) -- slightly more nesting, still independent
3. **Cross-dependency resolution** (move Tag/ExpertiseLevel to src/types/) -- prerequisite for technologies
4. **Technologies** -- depends on cross-dependency resolution
5. **FAQ** -- `as const` handling needs the pattern to be established
6. **Exhibits** -- largest and most complex, do last when pattern is proven

---

## Sources

- TypeScript `resolveJsonModule` documentation -- already enabled in project `tsconfig.json` (HIGH confidence, verified in codebase)
- TypeScript `satisfies` operator -- available since TS 4.9, project uses TS 5.x (HIGH confidence)
- Vite JSON import handling -- native support, tree-shakeable at property level (HIGH confidence, standard Vite behavior)
- Direct codebase analysis: 25+ import statements across 11 pages/components and 3 test files (HIGH confidence, primary source)

---
*Feature research for: JSON data externalization in Vue 3 + TypeScript + Vite*
*Researched: 2026-04-06*
