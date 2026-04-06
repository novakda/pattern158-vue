# Pitfalls Research

**Domain:** JSON data externalization in a Vue 3 + TypeScript + Vite project
**Researched:** 2026-04-06
**Confidence:** HIGH (based on direct analysis of 11 data files, 25+ consumer imports, tsconfig, and Vite config)

## Critical Pitfalls

### Pitfall 1: JSON Imports Are Untyped -- Discriminated Unions Silently Break

**What goes wrong:**
When `export const exhibits: Exhibit[] = [...]` moves from a `.ts` file to a `.json` file and is imported via `import data from './exhibits.json'`, TypeScript infers the type from JSON structure rather than applying the `Exhibit` interface. String union fields widen to `string`:
- `exhibitType: 'investigation-report' | 'engineering-brief'` becomes `string`
- `ExhibitSection.type: 'text' | 'table' | 'flow' | 'timeline' | 'metadata'` becomes `string`
- `FaqItem.category: 'hiring' | 'expertise' | 'style' | 'process'` becomes `string`

The discriminated union stops discriminating. `switch` exhaustiveness checks fail. Template `v-if` comparisons against string literals produce TypeScript errors.

**Why it happens:**
JSON has no type system. TypeScript's `resolveJsonModule` (already enabled in tsconfig.json) infers structural types from JSON content, but string literals widen to `string` unless explicitly asserted. Developers assume the import "just works" because the shapes look identical.

**How to avoid:**
Create a thin TypeScript wrapper module for each JSON file that imports raw JSON and re-exports with an explicit type assertion:
```typescript
// src/data/exhibits.ts (becomes the wrapper)
import rawData from './exhibits.json'
import type { Exhibit } from '@/types/exhibits'
export const exhibits = rawData as Exhibit[]
```
This preserves every existing `import { exhibits } from '@/data/exhibits'` across all 8 consumer files unchanged. The wrapper is the type boundary; the JSON is the data store.

**Warning signs:**
- TypeScript errors on `.exhibitType === 'investigation-report'` comparisons after migration
- `switch` exhaustiveness checks on section types stop working
- Tests pass but IDE shows type errors (or vice versa)

**Phase to address:**
Phase 1 (setup) -- establish the wrapper pattern and types directory before touching any data files.

---

### Pitfall 2: Breaking the Import Contract Across 25+ Consumer Files

**What goes wrong:**
Components and tests import both data values AND type definitions from `@/data/*.ts` files. For example:
- `ExhibitCard.vue` imports `type { Exhibit }` from `@/data/exhibits`
- `CaseFilesPage.vue` imports the `exhibits` array from `@/data/exhibits`
- `EngineeringBriefLayout.vue` imports `type { Exhibit, ExhibitSection }` from `@/data/exhibits`
- `FindingCard.vue` imports `type { Finding }` from `@/data/findings`
- `InfluencesList.vue` imports `type { Influence }` from `@/data/influences`
- `StatsSection.vue` imports `type { Stat }` from `@/data/stats`

If types move to `@/types/` and data moves to `.json` without maintaining the original import paths, every consumer breaks. With 25+ import statements across 15+ files, this is a mass breakage event.

**Why it happens:**
The refactor goal (separate types from data) conflicts with the stability goal (no breaking changes). Developers either update all imports at once (risky, hard to verify) or forget some (broken build).

**How to avoid:**
Each `src/data/*.ts` file becomes a thin wrapper that:
1. Imports from the new JSON file
2. Re-exports the typed data
3. Re-exports the types from `@/types/`

```typescript
// src/data/exhibits.ts (wrapper)
import rawData from './exhibits.json'
import type { Exhibit, ExhibitType, ExhibitSection } from '@/types/exhibits'
export type { Exhibit, ExhibitType, ExhibitSection, ExhibitQuote /* etc */ }
export const exhibits = rawData as Exhibit[]
```

Every existing consumer import remains valid. Zero diff on consumer files.

**Warning signs:**
- Any phase plan that includes "update imports in components" is a red flag
- `git diff --stat` showing changes in page/component files during data migration phases
- Type imports failing after types move to `@/types/`

**Phase to address:**
Phase 1 (setup) -- the wrapper contract must be established as the pattern before any data moves. Every subsequent phase inherits it.

---

### Pitfall 3: ExhibitSection Discriminated Union Loses Runtime Validation

**What goes wrong:**
`ExhibitSection` uses `type: 'text' | 'table' | 'flow' | 'timeline' | 'metadata'` as a discriminant, with different required companion fields per variant:
- `text`: requires `body`
- `table`: requires `columns` + `rows`
- `flow`: requires `steps` (array of `ExhibitFlowStep`)
- `timeline`: requires `entries` (array of `ExhibitTimelineEntry`)
- `metadata`: requires `items` (array of `ExhibitMetadataItem`)

In TypeScript source, the compiler narrows after checking `section.type`. In JSON, there is no narrowing -- a section with `type: 'text'` and `rows: [...]` is structurally valid JSON. The `as ExhibitSection[]` assertion trusts the data blindly. Future content edits to JSON could introduce inconsistencies that nothing catches until runtime rendering breaks.

**Why it happens:**
TypeScript's discriminated union narrowing is compile-time only. JSON data bypasses the compiler entirely. Type assertions (`as T`) tell TypeScript "trust me" without verification.

**How to avoid:**
Add validation tests in `exhibits.test.ts` that verify structural consistency:
```typescript
it('every section has correct companion fields for its type', () => {
  exhibits.forEach(e => {
    e.sections?.forEach(s => {
      switch (s.type) {
        case 'text': expect(s.body).toBeTruthy(); break
        case 'table': expect(s.columns).toBeDefined(); expect(s.rows).toBeDefined(); break
        case 'flow': expect(s.steps).toBeDefined(); break
        case 'timeline': expect(s.entries).toBeDefined(); break
        case 'metadata': expect(s.items).toBeDefined(); break
      }
    })
  })
})
```
This is cheap insurance -- runs in the existing test suite, catches JSON data drift.

**Warning signs:**
- Detail page renders unexpected empty blocks or shows wrong section layout
- A section has data for multiple variant types simultaneously
- Exhibit renders differently after JSON migration despite "no data changes"

**Phase to address:**
Same phase that moves exhibits data to JSON. Validation tests should be written before the JSON file is created (TDD, consistent with project convention from Phase 8 and Phase 16).

---

### Pitfall 4: technologies.ts Cross-Boundary Type Dependencies

**What goes wrong:**
`technologies.ts` imports types from component files:
```typescript
import type { Tag } from '@/components/TechTags.types'
import type { ExpertiseLevel } from '@/components/ExpertiseBadge.types'
```
`ExpertiseLevel` is defined via `as const` derivation: `export const expertiseLevels = ['deep', 'working', 'aware'] as const`. This creates two problems:
1. **Type ownership conflict:** Moving `TechCardData` to `@/types/technologies.ts` forces it to import from `@/components/` -- an inverted dependency (types depending on components)
2. **`as const` loss:** The `expertiseLevels` array and its derived `ExpertiseLevel` type cannot exist in JSON. The runtime array and the compile-time type are entangled

**Why it happens:**
The original codebase co-located types with their consumers (good practice for components). The externalization milestone introduces a second organizational principle (centralized data types) that conflicts with the first.

**How to avoid:**
Move `Tag` and `ExpertiseLevel` (and the `expertiseLevels` const) to `@/types/` as the canonical source. Update both component files and the data wrapper to import from `@/types/`. This is one of the few cases where component imports must change -- but it is only 3-4 component files (`TechCard.vue`, `TechTags.vue`, `ExpertiseBadge.types.ts`), not the broad consumer surface.

The `expertiseLevels` const array stays in a `.ts` file (it is runtime code, not data to externalize). Only `technologies` card data goes to JSON; the supporting type definitions and const arrays remain TypeScript.

**Warning signs:**
- Circular dependency warnings during build
- `@/types/` importing from `@/components/` (inverted dependency direction)
- `ExpertiseLevel` widening to `string` in the data layer

**Phase to address:**
Must be resolved before or during the phase that handles technologies.ts. Decision should be logged before migration begins.

---

### Pitfall 5: `as const` Assertions Have No JSON Equivalent

**What goes wrong:**
Several data files use `as const` or const-derived types:
- `faqCategories` uses `{ id: 'hiring' as const, ... }` -- the category IDs narrow to literal types
- `ExpertiseBadge.types.ts` uses `['deep', 'working', 'aware'] as const` to derive `ExpertiseLevel`
- `techPills` is `string[]` (simple, but worth noting)

In JSON, `as const` does not exist. Category IDs become plain strings. The type link between `faqCategories[].id` and `FaqItem.category` evaporates. TypeScript stops catching invalid category values.

**Why it happens:**
`as const` is a TypeScript-only construct. Developers moving data to JSON forget it was doing narrowing work.

**How to avoid:**
Define explicit literal union types in type definition files:
```typescript
// @/types/faq.ts
export type FaqCategoryId = 'hiring' | 'expertise' | 'style' | 'process'
export interface FaqCategory {
  id: FaqCategoryId
  heading: string
  intro: string
}
```
The `as const` was a shortcut that an explicit type definition replaces. The wrapper asserts the type on import.

**Warning signs:**
- TypeScript stops catching invalid category values in templates
- IDE autocomplete offers `string` instead of `'hiring' | 'expertise' | ...`
- `v-for` over categories works but type narrowing in conditionals breaks

**Phase to address:**
Phase handling faq.ts migration. Type definition must be written before the JSON file.

---

### Pitfall 6: Inconsistent Migration Order Breaks Tests Mid-Milestone

**What goes wrong:**
The 64 existing tests import from `@/data/exhibits` (3 test files), and components import types from various `@/data/*.ts` files. If data files are migrated in an order that creates temporary inconsistencies -- for example, moving exhibits to JSON before the wrapper pattern is established, or moving type definitions before the wrappers re-export them -- the test suite breaks between phases. Broken tests create pressure to "fix later" or skip runs, which undermines the safety net.

**Why it happens:**
Developers naturally start with the most complex file (exhibits.ts) because it feels like the hardest problem. But exhibits has the most consumers and the most complex types -- getting it wrong first means everything breaks at once.

**How to avoid:**
Migration order should follow increasing complexity and consumer count:
1. **Start with infrastructure:** Create `@/types/` directory, establish wrapper pattern with one simple file (e.g., `stats.ts` -- 1 interface, 1 array, 1 consumer)
2. **Validate the pattern:** Run full test suite after the first file
3. **Progress through medium complexity:** `specialties.ts`, `methodologySteps.ts`, `techPills.ts`
4. **Handle files with type dependencies:** `technologies.ts`, `faq.ts` (require type ownership decisions)
5. **Finish with exhibits.ts:** Most consumers (8 files), most complex types (6 interfaces, 1 union, 5 section variants)

After every file migration, `npm run test` and `npm run build` must pass before proceeding.

**Warning signs:**
- Tests skipped or marked `.skip` during migration
- Multiple data files migrated in a single commit without intermediate test runs
- "We'll fix the tests at the end" mentality

**Phase to address:**
Phase ordering in the roadmap. Each phase should migrate a coherent batch of data files and end with a green test suite.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `as unknown as Type` double assertion in wrappers | Silences complex type mismatches between JSON shape and interface | Hides real structural mismatches; bugs surface at runtime | Never -- if the assertion needs `unknown`, the types do not match the JSON |
| Skipping type re-exports from wrapper files | Fewer lines per wrapper | Consumers must import types from `@/types/` and data from `@/data/` -- two import paths for one concern | Never -- the wrapper should be the single import source for both data and types |
| One giant JSON file for all data | Simpler migration (one file) | Loses per-page code splitting; Vite bundles everything together; harder to edit | Never -- keep files 1:1 with current .ts files |
| Removing wrapper .ts files entirely; importing JSON directly in components | "Cleaner" imports, fewer files | Types lost on all imports, 25+ consumer files change, no validation layer | Never for this project -- wrappers are the stability mechanism |
| Leaving type definitions in `@/data/*.ts` wrappers instead of extracting to `@/types/` | Fewer files to create, types stay near data | Types and data remain coupled; future CMS integration cannot reuse types independently | Acceptable as a temporary intermediate state within a single phase, but not as the end state |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vite JSON tree-shaking | Assuming JSON is tree-shaken like ES module named exports (it is not -- JSON imports include the full file) | Accept this -- exhibits.json will be ~30KB. At 15 exhibits this is irrelevant. Not worth adding complexity for theoretical savings |
| Vite HMR with JSON | Expecting JSON edits will not trigger HMR, or trigger it incorrectly | Vite does support HMR for static JSON imports (`import x from './file.json'`). The wrapper pattern preserves this. Dynamic `import()` would break HMR -- do not use dynamic imports for data files |
| Vitest path aliases | Tests using `@/data/exhibits` expecting TypeScript modules; JSON import resolution differs | Wrapper pattern resolves this entirely -- tests import wrappers which are still .ts files at `@/data/`. No test changes needed |
| tsconfig `include` pattern | Adding `"src/**/*.json"` to tsconfig `include` thinking it is required for JSON imports | Not needed. `resolveJsonModule: true` (already enabled) handles JSON imports without them being in `include`. Adding JSON to `include` causes TypeScript to type-check JSON files, which is unnecessary overhead |
| Storybook data imports | Story files import data for mock props; changing import paths breaks stories | Wrapper pattern means story imports remain unchanged. No story file modifications needed for data migration |
| Production build validation | Assuming `tsc --noEmit` catches JSON-related issues | `tsc` type-checks but does not validate JSON data integrity. Must also run `vite build` to catch bundling issues, and `vitest` to catch data shape issues at runtime |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full JSON import for single-item lookup | ExhibitDetailPage imports all 15 exhibits to find one by slug | Not a real problem at this scale (~30KB). Would matter at 1000+ exhibits. Do not prematurely optimize by splitting into per-exhibit JSON files | N/A for this project |
| JSON parsed on every import | Common misconception -- Vite compiles JSON to ES modules at build time, so JSON is parsed once during build, not at runtime | No action needed. This is handled correctly by Vite | N/A |
| Duplicate JSON bundling | If the same JSON file is imported by multiple wrappers or directly by components, Vite may include it twice | Use wrappers as the single import point. Never import JSON files directly in components | Unlikely at this project's scale, but bad pattern for portfolio demonstrating best practices |

## "Looks Done But Isn't" Checklist

- [ ] **Type re-exports:** Every wrapper `.ts` file re-exports ALL types from `@/types/`, not just the data array -- verify `import type { Exhibit }` still works from `@/data/exhibits`
- [ ] **All 15 exhibits valid:** Verify all exhibits in JSON have `exhibitType` as exact string `"investigation-report"` or `"engineering-brief"` -- no typos, no missing field
- [ ] **Section type consistency:** Every `ExhibitSection` in JSON has correct companion fields for its `type` discriminant (text has body, table has columns+rows, flow has steps, timeline has entries, metadata has items)
- [ ] **Unicode preserved:** Exhibit data contains em dashes (U+2014), curly quotes (U+2018/2019), and other Unicode -- verify JSON encoding preserves these (UTF-8 is default, but compare before/after)
- [ ] **Optional fields preserved:** Fields like `quotes`, `contextHeading`, `contextText`, `resolutionTable`, `sections`, `isFlagship`, `summary`, `emailCount`, `role` are optional on `Exhibit`. Verify JSON omits them (not sets them to `null`) for exhibits that do not have them -- `null` vs absent changes behavior of `?.` optional chaining
- [ ] **All 64 tests pass:** Run full test suite after each individual data file migration, not just at the end
- [ ] **Production build clean:** `vite build` produces no warnings and no errors. JSON shape mismatches surface as runtime errors in prod, not build errors
- [ ] **Storybook still builds:** Story files import data indirectly through wrappers. Verify `npm run storybook` works after migration
- [ ] **influences.ts nested links:** `InfluenceSegment` has optional `link` with nested `InfluenceLink` object (`{ text, to }`). Verify JSON nesting matches the interface hierarchy exactly
- [ ] **No `null` where `undefined` expected:** JSON has `null` but not `undefined`. TypeScript interfaces use `?:` (optional = possibly `undefined`). If JSON explicitly sets a field to `null`, TypeScript may flag it or runtime `?.` checks behave differently. Omit absent fields from JSON rather than setting them to `null`

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Types widened to string (Pitfall 1) | LOW | Add explicit type assertion in wrapper; no consumer changes needed |
| Broken imports (Pitfall 2) | MEDIUM | If wrappers were not used: must update 25+ import statements via find-and-replace, then verify each. If wrappers were used but missing re-exports: add re-exports to wrapper |
| Invalid section data (Pitfall 3) | LOW | Add validation test, fix JSON data. No code changes needed |
| Circular type dependencies (Pitfall 4) | MEDIUM | Restructure type ownership; update 3-5 import paths in component files |
| Lost `as const` narrowing (Pitfall 5) | LOW | Add explicit literal union type to type definition file; wrapper assertion handles the rest |
| Tests broken mid-milestone (Pitfall 6) | LOW-MEDIUM | Revert to last green state, re-migrate in correct order. Git history provides safety net |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Untyped JSON imports (Pitfall 1) | Phase 1: Create `@/types/` directory, establish wrapper pattern | `tsc --noEmit` passes; discriminated union narrowing works in IDE; `switch` exhaustiveness holds |
| Broken import contract (Pitfall 2) | Phase 1: Establish wrapper convention with type re-exports | `git diff` shows zero changes in page/component Vue files throughout entire milestone |
| Section discriminant validity (Pitfall 3) | Phase handling exhibits.ts | New Vitest tests validate section type/field consistency for all 15 exhibits |
| Cross-boundary type ownership (Pitfall 4) | Phase handling technologies.ts | Dependency direction is `@/components/ -> @/types/` and `@/data/ -> @/types/`, never reversed |
| `as const` loss (Pitfall 5) | Phase handling faq.ts | TypeScript rejects invalid category string in test assertion |
| Migration order breakage (Pitfall 6) | Roadmap phase ordering | Every phase ends with 64+ tests passing and clean `vite build` |

## Sources

- Direct codebase analysis: 11 data files in `src/data/`, 25+ consumer imports across `src/pages/` and `src/components/`, `tsconfig.json`, `vite.config.ts` (HIGH confidence)
- TypeScript `resolveJsonModule` behavior: verified in project's tsconfig.json, line 8 (HIGH confidence)
- TypeScript discriminated union narrowing limitations with type assertions: core TypeScript language behavior (HIGH confidence)
- Vite JSON import compilation: Vite compiles JSON to ES modules at build time, standard documented behavior (HIGH confidence)
- `null` vs `undefined` in JSON/TypeScript interop: core language specification difference (HIGH confidence)

---
*Pitfalls research for: JSON data externalization in Vue 3 + TypeScript + Vite*
*Researched: 2026-04-06*
