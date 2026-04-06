# Project Research Summary

**Project:** Pattern 158 v3.0 -- JSON Data Externalization
**Domain:** Data layer refactoring for Vue 3 + TypeScript + Vite portfolio site
**Researched:** 2026-04-06
**Confidence:** HIGH

## Executive Summary

This milestone is a surgical refactoring of 11 TypeScript data files in an existing Vue 3 portfolio site. The goal is to decouple static content (JSON) from code (TypeScript types and imports), preparing the architecture for future CMS integration. The critical finding across all research: **zero new dependencies are needed**. The existing stack (TypeScript 5.7, Vite 6.2, vue-tsc 2.2) already has full JSON import support via `resolveJsonModule: true`, which is already enabled in tsconfig.json. This is purely a structural reorganization.

The recommended approach is the "thin loader" pattern: each `src/data/*.ts` file becomes a wrapper that imports raw JSON from a `src/data/json/` subdirectory, applies a type assertion, and re-exports both data and types. This preserves all 25+ existing import statements across pages, components, and tests with zero consumer changes. Types are extracted to a new centralized `src/types/` directory with a barrel index. The result is 22 new files (11 type files + 11 JSON files), 11 modified files (the loaders), and zero changed consumer files.

The primary risks are type widening (JSON strings lose literal union narrowing), breaking the import contract across 25+ consumers, and `as const` loss for FAQ categories. All three are fully mitigated by the thin loader pattern and explicit type assertions. The migration order is critical: start with the simplest files to prove the pattern, progress through nested types, resolve the cross-dependency for technologies.ts, and finish with the complex exhibits.ts (138KB, 8 interfaces, 9 consumer files). Every tier must end with all 64 tests passing and a clean production build.

## Key Findings

### Recommended Stack

No new packages. The existing stack handles everything. See [STACK.md](STACK.md) for full analysis.

**Core technologies (all already configured):**
- **TypeScript ~5.7.0:** `resolveJsonModule: true` already set; infers structural types from JSON imports automatically
- **Vite ^6.2.0:** Native JSON import with build-time compilation to ES modules; small JSON inlined into bundle
- **vue-tsc ^2.2.0:** Type-checks JSON imports in `.vue` files; inherits TypeScript's resolution behavior

**Critical non-changes:** No modifications needed to tsconfig.json, vite.config.ts, or package.json. The `include` array does not need `"src/**/*.json"` added -- JSON files are resolved transitively through import statements.

### Expected Features

See [FEATURES.md](FEATURES.md) for the full inventory and conversion notes per file.

**Must have (v3.0 -- all P1):**
- JSON files replacing all 11 TS data exports
- Centralized type definitions in `src/types/` with barrel index
- Type-safe re-export wrapper modules preserving `@/data/*` import paths
- Zero breaking changes to 25+ component/test imports
- All 64 tests passing, clean production build

**Should have (v3.0 differentiators):**
- Cross-dependency resolution for `Tag`/`ExpertiseLevel` shared types
- `as const` behavior preserved for `faqCategories` (stays in TypeScript, not JSON)
- Discriminated union types validated through type assertion layer

**Defer (v3.x / v4+):**
- JSON formatting/linting in CI
- Runtime validation (Zod/Valibot) -- only needed if data source becomes external
- Per-exhibit file splitting -- only if exhibit count exceeds 50
- CMS integration replacing JSON with API responses

**Anti-features (explicitly rejected):**
- Runtime JSON validation libraries (data is static, developer-authored)
- YAML/TOML (adds parser dependency for no benefit)
- Dynamic `import()` for JSON (breaks HMR, unnecessary for <5KB files)
- Auto-generating types from JSON (loses semantic meaning, optional fields, unions)
- Moving data to `public/` for runtime fetch (loses type safety and tree-shaking)

### Architecture Approach

The architecture follows a three-layer pattern: **JSON data** (pure content in `src/data/json/`), **typed loaders** (thin wrappers in `src/data/*.ts` that apply type assertions), and **centralized types** (interfaces in `src/types/`). Components import from loaders only -- they never know JSON exists. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full directory structure, all 5 integration patterns, and the complete import map.

**Major components:**
1. **`src/types/` directory** (11 type files + barrel index) -- centralized type definitions extracted from data files; component-owned types (`TechTags.types.ts`, `ExpertiseBadge.types.ts`) stay with their components
2. **`src/data/json/` directory** (11 JSON files) -- pure content data, no TypeScript constructs; each file maps 1:1 to an existing data module
3. **`src/data/*.ts` loader files** (11 modified) -- thin wrappers importing JSON, asserting types, re-exporting both data values and type definitions to preserve the existing import API

**Key architectural decisions:**
- JSON files in a `json/` subdirectory (not flat alongside .ts loaders) for directory scannability
- `faqCategories` stays in TypeScript (structural metadata with `as const` literal types, not externalizable content)
- Component-owned types stay in `src/components/` -- `src/types/technologies.ts` imports from them, creating a deliberate cross-boundary dependency that is acceptable because data types reference component types (data feeds components)

### Critical Pitfalls

See [PITFALLS.md](PITFALLS.md) for all 6 pitfalls with code examples and recovery strategies.

1. **JSON imports widen string unions to `string`** -- Discriminated unions on `exhibitType`, `ExhibitSection.type`, and `FaqItem.category` silently break. Prevent with explicit type assertions in loader wrappers (`as Exhibit[]`). Establish the pattern in Phase 1 before any data moves.

2. **Breaking the 25+ import contract** -- Components import both data and types from `@/data/*`. If wrappers do not re-export types, consumer imports break. Every wrapper must include `export type { ... }` re-exports. Verify with `git diff` showing zero changes in page/component files.

3. **ExhibitSection discriminant loses runtime validation** -- `as ExhibitSection[]` trusts data blindly. Add validation tests verifying correct companion fields per section type (`text` has `body`, `table` has `columns`+`rows`, etc.) before creating exhibits.json.

4. **Cross-boundary type dependencies for technologies.ts** -- `TechCardData` references `Tag` and `ExpertiseLevel` from component type files. Decision: keep component types in `src/components/`, import into `src/types/technologies.ts`. Resolve before migrating technologies data.

5. **`as const` has no JSON equivalent** -- `faqCategories` and `expertiseLevels` use `as const` for literal narrowing. Define explicit literal union types in `src/types/` instead. Keep const arrays in TypeScript files.

## Implications for Roadmap

Based on combined research, the milestone should be structured as 4 phases following the dependency chain and increasing complexity. Total new files: 22. Total modified files: 11. Total consumer file changes: 0.

### Phase 1: Foundation -- Types Directory and Simple File Migration
**Rationale:** The loader pattern and types directory are prerequisites for every subsequent phase. Proving the pattern on the simplest files first eliminates risk.
**Delivers:** `src/types/` directory with barrel index; first 5 simple data files migrated (techPills, stats, specialties, brandElements, methodologySteps); pattern validated end-to-end.
**Addresses:** Table stakes (centralized types, type-safe re-exports, zero breaking changes); establishes Pattern 1 (type-safe assignment) and Pattern 4 (primitive array).
**Avoids:** Pitfall 1 (untyped JSON imports), Pitfall 2 (broken import contract), Pitfall 6 (migration order breakage).
**Checkpoint:** All 64 tests pass. Clean `vite build`. `git diff` shows zero changes in `.vue` or `.test.ts` files.

### Phase 2: Nested and Union Types
**Rationale:** Medium-complexity files with nested structures but no cross-file type dependencies. Proves the pattern scales to more complex shapes.
**Delivers:** 4 more data files migrated (findings, philosophyInfluences, influences, faq); `faqCategories` kept in TypeScript with explicit literal union types.
**Addresses:** Differentiators (`as const` preservation, discriminated union validation for FAQ categories); Pattern 2 (type assertion for union literals).
**Avoids:** Pitfall 5 (`as const` loss -- explicit union types replace it).
**Checkpoint:** All 64 tests pass. Clean `vite build`.

### Phase 3: Cross-Dependency Resolution and Technologies
**Rationale:** `technologies.ts` cannot be migrated until the `Tag`/`ExpertiseLevel` type ownership is resolved. This is an isolated decision that affects only 3-4 component files.
**Delivers:** `src/types/technologies.ts` importing from component type files; technologies data in JSON; cross-dependency cleanly documented.
**Addresses:** Differentiator (cross-dependency resolution); Pattern 3 (loader with cross-type dependency).
**Avoids:** Pitfall 4 (circular dependencies, inverted type ownership).
**Checkpoint:** All 64 tests pass. Clean `vite build`. No circular dependency warnings.

### Phase 4: Exhibits Migration and Validation
**Rationale:** Most complex file (138KB, 8 interfaces, discriminated unions, 9 consumer files). Must be last so the pattern is fully proven. Needs additional validation tests.
**Delivers:** `exhibits.json` with all 15 exhibits; `src/types/exhibits.ts` with all interfaces; new validation tests for section type/field consistency; Pattern 5 (complex union types).
**Addresses:** Table stakes (all 11 files migrated, all tests pass, clean build); Differentiator (discriminated unions preserved).
**Avoids:** Pitfall 3 (section discriminant validation via new tests), Pitfall 6 (exhibits last, not first).
**Checkpoint:** 64+ tests pass (new validation tests added). Clean `vite build`. Spot-check ExhibitDetailPage renders all 15 exhibits.

### Phase Ordering Rationale

- **Dependency-driven:** Types directory must exist before any loader can import from it. Simple files have no dependencies on each other. Technologies depends on cross-type resolution. Exhibits is the terminal node.
- **Risk-graduated:** Simplest files first (2-field interfaces, 1 consumer) through medium (nested objects, optional fields) to most complex (8 interfaces, discriminated unions, 9 consumers). Each tier validates the pattern before the next tier begins.
- **Every phase is independently shippable:** Each phase ends with all tests passing and a clean build. If the milestone is interrupted, the partial migration is stable.

### Research Flags

Phases with standard patterns (skip phase-level research):
- **Phase 1:** Well-documented pattern (JSON imports + typed wrappers). TypeScript and Vite documentation is extensive. Direct codebase analysis provides all needed specifics.
- **Phase 2:** Same pattern with minor variation for `as const`. Fully covered by existing research.
- **Phase 3:** Cross-dependency is a one-time architectural decision already analyzed in ARCHITECTURE.md and PITFALLS.md.

Phases that may benefit from validation during planning:
- **Phase 4:** The exhibits.json conversion is mechanical but large. The "Looks Done But Isn't" checklist in PITFALLS.md (Unicode preservation, `null` vs absent fields, optional field handling) should be used as acceptance criteria. Consider whether the validation tests should be written as a sub-phase before the JSON conversion.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All capabilities verified directly in project tsconfig.json and vite.config.ts. Features used (resolveJsonModule, Vite JSON imports) are stable since 2018+. |
| Features | HIGH | All 11 data files inventoried with exact line counts, type counts, consumer counts, and conversion complexity. Scope is tightly bounded by existing PROJECT.md. |
| Architecture | HIGH | Complete import map of all 25+ consumer statements verified against codebase. Directory structure and loader patterns derived from direct analysis. |
| Pitfalls | HIGH | All pitfalls derived from actual code patterns in the codebase (discriminated unions, `as const`, cross-type imports). No speculative pitfalls -- every one maps to a specific file and line. |

**Overall confidence:** HIGH

All four research outputs are based on direct codebase analysis rather than external documentation or community patterns. The project has a complete test suite (64 tests) that serves as a regression safety net. The migration involves no new dependencies, no API integrations, and no external services -- the risk surface is entirely within the developer's control.

### Gaps to Address

- **HowIWorkSection.vue hardcoded content:** Architecture research noted that this page has hardcoded content instead of consuming `methodologySteps.ts`. The MethodologyStep.vue component exists but is unused. This is not a blocker for data externalization (the file still gets migrated), but it is a known inconsistency to address in a future milestone.
- **Storybook build verification:** Mentioned in PITFALLS.md checklist but not deeply investigated. Need to verify whether `npm run storybook` is currently configured and working before relying on it as a verification step.
- **Unicode edge cases in exhibits:** PITFALLS.md flags em dashes and curly quotes. The conversion from TypeScript string literals to JSON strings should preserve these (both are UTF-8), but a before/after diff of the rendered exhibits page is the definitive validation.

## Sources

### Primary (HIGH confidence)
- Direct analysis of all 11 `src/data/*.ts` files -- type patterns, export shapes, consumer counts
- Direct analysis of all 25+ consumer imports across `src/pages/`, `src/components/`, and test files
- Project `tsconfig.json` -- confirmed `resolveJsonModule: true`, `moduleResolution: "bundler"`
- Project `vite.config.ts` -- confirmed no special JSON configuration needed

### Secondary (HIGH confidence)
- TypeScript `resolveJsonModule` -- stable since TypeScript 2.9 (2018), well-documented behavior
- Vite JSON import handling -- documented core feature since Vite 1.0, tree-shaking since Vite 2.0
- TypeScript discriminated union narrowing with type assertions -- core language behavior

---
*Research completed: 2026-04-06*
*Ready for roadmap: yes*
