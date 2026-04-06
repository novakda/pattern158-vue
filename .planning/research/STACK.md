# Stack Research

**Domain:** JSON data externalization for Vue 3 + TypeScript + Vite portfolio site
**Researched:** 2026-04-06
**Confidence:** HIGH

---

## Key Finding: No New Dependencies Required

This milestone requires **zero new packages**. The existing stack already has full support for JSON imports with type safety. The work is purely structural reorganization: moving interfaces to `src/types/`, converting `.ts` data files to `.json`, and adding typed re-export wrappers.

---

## Existing Stack (Already Configured)

| Technology | Version | Relevant Capability | Status |
|------------|---------|---------------------|--------|
| TypeScript | ~5.7.0 | `resolveJsonModule: true` already in tsconfig.json | Ready -- no changes needed |
| Vite | ^6.2.0 | Native JSON import with tree-shaking via named exports | Ready -- no changes needed |
| vue-tsc | ^2.2.0 | Type-checks `.vue` files including JSON imports | Ready -- no changes needed |

---

## tsconfig.json Analysis

The current `tsconfig.json` already has the critical settings:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "env.d.ts"]
}
```

**Why no tsconfig changes are needed:**
- `resolveJsonModule: true` lets TypeScript resolve `.json` imports and infer their structural types automatically.
- The `include` array does **not** need `"src/**/*.json"` added. TypeScript resolves JSON files when they are imported from `.ts` files that are already covered by `include`. The JSON files are pulled in transitively through `import` statements.
- `moduleResolution: "bundler"` defers to Vite for actual resolution at build time, which natively handles JSON.

---

## JSON Import Patterns for This Project

### Pattern 1: Type-Safe Assignment (Simple Data)

For files with simple interfaces (`stats.ts`, `techPills.ts`, `specialties.ts`, `methodologySteps.ts`, `brandElements.ts`, `philosophyInfluences.ts`, `influences.ts`, `findings.ts`):

```typescript
// src/data/stats.ts (thin wrapper -- preserves existing import API)
import type { Stat } from '@/types'
import statsJson from './stats.json'

export const stats: Stat[] = statsJson
```

**Why this pattern:** TypeScript infers a structural type from the JSON file (e.g., `{ number: string; label: string }[]`). Assigning to a typed `const` performs compile-time structural checking -- if the JSON shape drifts from the interface, `vue-tsc` catches it during `npm run build`. No explicit `as` cast needed for interfaces whose fields are all `string`, `number`, `boolean`, or nested objects of the same.

**Why keep the `.ts` wrapper:** Every component currently imports `import { stats } from '@/data/stats'`. The thin wrapper preserves this import path unchanged. Zero component modifications required.

### Pattern 2: Type Assertion for Union Literals

For data with string literal union fields -- `faq.ts` has `category: 'hiring' | 'expertise' | 'style' | 'process'`, `exhibits.ts` has `exhibitType: 'investigation-report' | 'engineering-brief'` and `type: 'text' | 'table' | 'flow' | 'timeline' | 'metadata'`:

```typescript
// src/data/faq.ts (thin wrapper)
import type { FaqItem, FaqCategory } from '@/types'
import faqItemsJson from './faqItems.json'
import faqCategoriesJson from './faqCategories.json'

export const faqItems = faqItemsJson as FaqItem[]
export const faqCategories = faqCategoriesJson as FaqCategory[]
```

**Why `as` is needed here:** JSON imports infer string fields as `string`, not as narrow literal unions like `'hiring' | 'expertise'`. The `as` assertion narrows the type to match the interface. This is safe because the data is static, developer-authored, and validated visually. The alternative -- runtime validation via zod or similar -- is overkill for a 15-exhibit portfolio site with no user input.

### Pattern 3: Cross-Referenced Component Types

`technologies.ts` imports `Tag` from `TechTags.types.ts` and `ExpertiseLevel` from `ExpertiseBadge.types.ts`. These component type files stay in place -- they belong to their components. The centralized `src/types/` re-exports them:

```typescript
// src/types/exhibits.ts
export type { Tag } from '@/components/TechTags.types'
export type { ExpertiseLevel } from '@/components/ExpertiseBadge.types'

export interface TechCardData {
  name: string
  level: ExpertiseLevel
  // ...
}
```

**Why re-export, not duplicate:** Single source of truth. If `ExpertiseLevel` changes in the component file, the data types update automatically.

---

## src/types/ Organization

```
src/types/
  index.ts          # Barrel re-exporting everything
  exhibits.ts       # Exhibit types (8+ interfaces, complex nesting)
  data.ts           # All other data types (simple interfaces)
```

**Why two files, not eleven:** Most data files have a single simple interface (1-4 fields). Creating `src/types/stat.ts` with one 3-line interface per file creates unnecessary module noise. Exhibits warrant their own file because they have 8+ interfaces with nested relationships (`ExhibitSection`, `ExhibitTimelineEntry`, `ExhibitFlowStep`, etc.).

**Why a barrel `index.ts`:** Enables `import type { Stat, FaqItem, Exhibit } from '@/types'` -- clean single import path for all consumers.

---

## Data File Inventory

All 11 data files in `src/data/`, classified by import pattern needed:

| File | Current Types | Pattern | Notes |
|------|---------------|---------|-------|
| `stats.ts` | `Stat` | 1 (assignment) | Simple string fields |
| `techPills.ts` | `string[]` | 1 (assignment) | No interface needed -- stays `string[]` |
| `specialties.ts` | `Specialty` | 1 (assignment) | Simple string fields |
| `methodologySteps.ts` | `MethodologyStep` | 1 (assignment) | Simple string fields |
| `brandElements.ts` | `BrandElement` | 1 (assignment) | Has optional `sourceNote?` -- still works |
| `philosophyInfluences.ts` | `PhilosophyInfluence` | 1 (assignment) | `paragraphs: string[]` -- works fine |
| `influences.ts` | `Influence`, `InfluenceSegment`, `InfluenceLink` | 1 (assignment) | Nested objects, all string fields |
| `findings.ts` | `Finding` | 1 (assignment) | Has optional `link?` and `tags: string[]` |
| `faq.ts` | `FaqItem`, `FaqCategory` | 2 (assertion) | `category` is a string literal union |
| `technologies.ts` | `TechCardData`, `TechCategory` | 2 + 3 (assertion + cross-ref) | `level: ExpertiseLevel` is a string literal union; imports component types |
| `exhibits.ts` | 8+ interfaces | 2 (assertion) | `exhibitType`, section `type` are literal unions |

**`exhibits.test.ts`**: This is a test file, not a data file. It stays as-is in `src/data/`.

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|---------------------|
| zod / valibot / ajv | Runtime schema validation is pointless for static, developer-authored portfolio data with no API responses or user input | TypeScript compile-time structural checking via typed assignment |
| json-loader / json5 | Vite handles `.json` natively since v1.0; json5 syntax (comments, trailing commas) not needed | Standard `.json` files |
| `@types/json-schema` | No JSON Schema definitions needed; TypeScript interfaces are the schema | Plain interfaces in `src/types/` |
| Dynamic `import()` for JSON | Unnecessary code-splitting for tiny static data files (each < 5KB) | Static `import` statements; Vite bundles efficiently |
| `satisfies` operator for JSON | Would require TypeScript 4.9+ (have 5.7, so version is fine), but `satisfies` doesn't narrow -- it validates. The typed `const` assignment already validates AND narrows | `const data: Type[] = jsonImport` |
| Pinia / Vuex for data | Data is static imports, not reactive state. No mutations, no async fetching, no cross-component state management needed | Direct imports from `@/data/*` |

---

## Vite JSON Import Behavior

Vite supports two JSON import modes:

```typescript
// Default import -- full object/array
import stats from './stats.json'

// Named import -- Vite tree-shakes unused fields
import { items } from './large.json'
```

**For this project:** Use default imports. Each JSON file is a single array or object used in its entirety. Named imports only add value for large JSON files where you consume a subset of top-level keys.

**Build behavior:** Vite inlines small JSON files into the JS bundle. No separate network requests at runtime. This is the correct behavior for static portfolio data.

---

## Version Compatibility

No new packages means no new compatibility concerns.

| Package | Feature Used | Notes |
|---------|-------------|-------|
| TypeScript ~5.7.0 | `resolveJsonModule` | Stable since TypeScript 2.9 (2018). Fully mature. |
| Vite ^6.2.0 | Native JSON imports | Supported since Vite 1.0. Tree-shaking since Vite 2.0. |
| vue-tsc ^2.2.0 | JSON type inference in `.vue` files | Inherits TypeScript's `resolveJsonModule` behavior. |

---

## Installation

```bash
# No new packages required.
# The existing stack fully supports JSON externalization.
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| Thin `.ts` wrappers re-exporting typed JSON | Direct JSON imports in `.vue` components | Would break every existing `import { stats } from '@/data/stats'` in components; forces changes across the entire codebase instead of isolating the refactor to `src/data/` |
| `as Type` for union-typed fields | `satisfies` operator | `satisfies` validates but doesn't narrow; the typed const assignment already validates. `as` is the simpler, more readable pattern for this use case |
| Two type files (`data.ts` + `exhibits.ts`) + barrel | One type file per data source (11 files) | 11 tiny files with 1-3 line interfaces each creates unnecessary directory noise |
| Two type files + barrel | Single monolithic `types.ts` | Exhibits alone have 8+ interfaces with nesting; mixing them with simple `Stat`/`Specialty` types hurts readability and makes the file unwieldy |
| Re-export component types in `src/types/` | Move component types into `src/types/` | Component types (`Tag`, `ExpertiseLevel`) belong with their components. Re-exporting maintains single source of truth |

---

## Sources

- **Project tsconfig.json** -- direct inspection confirmed `resolveJsonModule: true`, `moduleResolution: "bundler"` already set -- HIGH confidence
- **Project src/data/*.ts** -- direct inspection of all 11 data files, type patterns catalogued -- HIGH confidence
- **TypeScript resolveJsonModule** -- stable feature since TS 2.9 (2018), well-documented behavior for structural type inference from JSON -- HIGH confidence
- **Vite static asset handling** -- JSON imports are a documented core feature since Vite 1.0, inlined into bundle for small files -- HIGH confidence

---

*Stack research for: JSON data externalization (Vue 3 + TypeScript + Vite)*
*Researched: 2026-04-06*
