# Architecture Patterns

**Domain:** JSON data externalization for Vue 3 SPA portfolio site
**Researched:** 2026-04-06
**Confidence:** HIGH -- derived from direct analysis of all 11 data files, all consumer imports, tsconfig, and Vite configuration

## Current Architecture

### Data Flow (Before)

```
Component (.vue)
  └── imports data array + type ──> src/data/file.ts (co-located type + data)
                                        └── may import types from src/components/*.types.ts
```

Pages import **data values** from `src/data/*.ts`. Components import **type-only** from `src/data/*.ts` (for prop typing). Two component-owned type files already exist: `TechTags.types.ts` (Tag interface) and `ExpertiseBadge.types.ts` (ExpertiseLevel union).

### Import Map (Current)

| Consumer | Imports Data From | Imports Type From |
|----------|------------------|-------------------|
| HomePage.vue | techPills, specialties, stats, influences, findings | (none directly) |
| PhilosophyPage.vue | brandElements, philosophyInfluences | (none directly) |
| CaseFilesPage.vue | exhibits | (none directly) |
| ExhibitDetailPage.vue | exhibits | (none directly) |
| TechnologiesPage.vue | technologies | (none directly) |
| FaqPage.vue | faqItems, faqCategories | (none directly) |
| ExhibitCard.vue | (none) | Exhibit from exhibits.ts |
| InvestigationReportLayout.vue | (none) | Exhibit, ExhibitSection from exhibits.ts |
| EngineeringBriefLayout.vue | (none) | Exhibit, ExhibitSection from exhibits.ts |
| FindingCard.vue | (none) | Finding from findings.ts |
| BrandElement.vue | (none) | BrandElement from brandElements.ts |
| InfluencesList.vue | (none) | Influence from influences.ts |
| InfluenceArticle.vue | (none) | PhilosophyInfluence from philosophyInfluences.ts |
| MethodologyStep.vue | (none) | MethodologyStep from methodologySteps.ts |
| StatsSection.vue | (none) | Stat from stats.ts |
| exhibits.test.ts | exhibits | (none) |
| InvestigationReportLayout.test.ts | exhibits | Exhibit from exhibits.ts |
| EngineeringBriefLayout.test.ts | exhibits | Exhibit from exhibits.ts |

### Key Observations

1. **Two import patterns exist:** Pages import data values. Child components import only types (for prop definitions).
2. **Types are co-located with data** in all 11 `src/data/*.ts` files.
3. **Two component-owned type files** already exist outside `src/data/`: `TechTags.types.ts` (Tag interface) and `ExpertiseBadge.types.ts` (ExpertiseLevel union + const array).
4. **Cross-file type dependency:** `technologies.ts` imports `Tag` from `TechTags.types.ts` and `ExpertiseLevel` from `ExpertiseBadge.types.ts`.
5. **`resolveJsonModule: true`** is already set in tsconfig.json -- Vite and TypeScript are ready for JSON imports with no configuration changes.
6. **HowIWorkSection.vue has hardcoded content** instead of consuming `methodologySteps.ts`. The MethodologyStep.vue component exists but is unused in the current page tree. This means `methodologySteps.ts` has zero runtime data consumers -- it only provides a type import for the unused MethodologyStep.vue component.
7. **faq.ts exports two things:** `faqItems` (array) and `faqCategories` (array with `as const` id values). The `faqCategories` array uses string literal types that cannot be represented in JSON.

---

## Recommended Architecture (After)

### Data Flow (After)

```
Component (.vue)
  |-- imports data array --> src/data/file.ts (thin loader: imports JSON, re-exports typed)
  |                              |-- imports raw data --> src/data/json/file.json
  |                              |-- imports type --> src/types/file.ts
  |-- imports type --> src/types/file.ts (or barrel: src/types/index.ts)
```

### Directory Structure

```
src/
|-- types/                          # NEW: Centralized type definitions
|   |-- index.ts                    # Barrel export for all types
|   |-- exhibits.ts                 # Exhibit, ExhibitType, ExhibitQuote, ExhibitSection, etc.
|   |-- technologies.ts             # TechCategory, TechCardData
|   |-- findings.ts                 # Finding
|   |-- brandElements.ts            # BrandElement
|   |-- methodologySteps.ts         # MethodologyStep
|   |-- influences.ts               # Influence, InfluenceSegment, InfluenceLink
|   |-- specialties.ts              # Specialty
|   |-- stats.ts                    # Stat
|   |-- faq.ts                      # FaqItem, FaqCategory
|   |-- philosophyInfluences.ts     # PhilosophyInfluence
|
|-- data/                           # MODIFIED: Thin typed loaders over JSON
|   |-- json/                       # NEW: Pure JSON data files
|   |   |-- exhibits.json
|   |   |-- technologies.json
|   |   |-- techPills.json
|   |   |-- findings.json
|   |   |-- brandElements.json
|   |   |-- methodologySteps.json
|   |   |-- influences.json
|   |   |-- specialties.json
|   |   |-- stats.json
|   |   |-- faq.json
|   |   |-- philosophyInfluences.json
|   |
|   |-- exhibits.ts                 # import json, import type, export typed
|   |-- technologies.ts             # same pattern
|   |-- techPills.ts                # same pattern (string[] -- simplest case)
|   |-- findings.ts
|   |-- brandElements.ts
|   |-- methodologySteps.ts
|   |-- influences.ts
|   |-- specialties.ts
|   |-- stats.ts
|   |-- faq.ts
|   |-- philosophyInfluences.ts
|   |-- exhibits.test.ts            # Unchanged -- still imports from src/data/exhibits.ts
|
|-- components/
|   |-- TechTags.types.ts           # KEEP as-is (component-owned, not data type)
|   |-- ExpertiseBadge.types.ts     # KEEP as-is (component-owned, not data type)
```

### Rationale: Why src/data/json/ Instead of Flat in src/data/

Placing JSON files inside `src/data/json/` rather than at `src/data/` level (alongside the .ts loader files) keeps the data directory scannable. You see `.ts` loader files at one level, `.json` data files at another. No mixed-extension confusion. The `json/` subdirectory is an implementation detail that no external consumer ever references directly.

### Rationale: Why Keep src/data/*.ts Loader Files

Removing the loader files and importing JSON directly into components would:
- **Break all existing imports** -- every `import { exhibits } from '@/data/exhibits'` would need to change
- **Lose type safety** -- JSON imports are typed as the inferred shape, not the declared interface (no string literal unions, no discriminants)
- **Scatter type assertions** -- every component importing data would need its own `as Type` cast

The thin loader pattern centralizes the type assertion in one place and preserves every existing import path unchanged. Zero consumer changes required.

---

## Component Integration Patterns

### Pattern 1: Thin Typed Loader (Standard)

**What:** Each `src/data/*.ts` file becomes a thin re-export layer that imports raw JSON and applies a type assertion.

**When:** Every data file.

**Example (simple -- stats.ts):**
```typescript
// src/types/stats.ts
export interface Stat {
  number: string
  label: string
}

// src/data/json/stats.json
[
  { "number": "28+", "label": "Years" },
  { "number": "5,200+", "label": "Projects" },
  { "number": "40+", "label": "Clients" },
  { "number": "930+", "label": "Testimonials" }
]

// src/data/stats.ts
import type { Stat } from '@/types/stats'
import statsJson from './json/stats.json'

export type { Stat }
export const stats: Stat[] = statsJson
```

**Why re-export the type:** Components currently do `import type { Stat } from '@/data/stats'`. The `export type { Stat }` in the loader preserves this import path. Over time, components can migrate to `import type { Stat } from '@/types/stats'` or `from '@/types'`, but this is not required for correctness and can be deferred.

### Pattern 2: Loader With Derived Constants (faq.ts)

**What:** faq.ts exports both `faqItems` and `faqCategories`. The categories use `as const` literal types. JSON cannot express TypeScript literal types, so faqCategories stays in the loader file as a TypeScript constant.

**Example:**
```typescript
// src/types/faq.ts
export interface FaqItem {
  question: string
  answer: string
  category: 'hiring' | 'expertise' | 'style' | 'process'
}

export interface FaqCategory {
  id: 'hiring' | 'expertise' | 'style' | 'process'
  heading: string
  intro: string
}

// src/data/json/faq.json  -- contains only faqItems array
[
  { "category": "hiring", "question": "...", "answer": "..." }
]

// src/data/faq.ts
import type { FaqItem, FaqCategory } from '@/types/faq'
import faqItemsJson from './json/faq.json'

export type { FaqItem, FaqCategory }

export const faqItems: FaqItem[] = faqItemsJson as FaqItem[]

// faqCategories stays in TypeScript -- it uses `as const` literal IDs
// and is structural/config, not content data
export const faqCategories: FaqCategory[] = [
  { id: 'hiring', heading: 'Hiring Logistics', intro: 'Availability, rates, and work arrangements' },
  { id: 'expertise', heading: 'Technical Expertise', intro: 'Technologies, specializations, and domain knowledge' },
  { id: 'style', heading: 'Working Style', intro: 'Communication, collaboration, and approach' },
  { id: 'process', heading: 'Process & Methodology', intro: 'How Dan works in practice' },
]
```

**Why faqCategories stays in TypeScript:** It is structural metadata (4 items, unlikely to change), not content. Its `id` field values must match the `category` literal union on `FaqItem`. Keeping it in TypeScript ensures this constraint is enforced at compile time. Moving it to JSON would require a runtime check that "hiring" in the JSON actually matches the `FaqItem.category` type.

### Pattern 3: Loader With Cross-Type Dependency (technologies.ts)

**What:** `technologies.ts` currently imports `Tag` from `TechTags.types.ts` and `ExpertiseLevel` from `ExpertiseBadge.types.ts`. The centralized type file needs these imports too.

**Example:**
```typescript
// src/types/technologies.ts
import type { Tag } from '@/components/TechTags.types'
import type { ExpertiseLevel } from '@/components/ExpertiseBadge.types'

export interface TechCardData {
  name: string
  level: ExpertiseLevel
  summary: string
  dateRange?: string
  tags?: Tag[]
}

export interface TechCategory {
  id: string
  title: string
  intro?: string
  historical?: boolean
  cards: TechCardData[]
}

// src/data/technologies.ts
import type { TechCategory } from '@/types/technologies'
import technologiesJson from './json/technologies.json'

export type { TechCardData, TechCategory } from '@/types/technologies'
export const technologies: TechCategory[] = technologiesJson as TechCategory[]
```

**Decision: Keep TechTags.types.ts and ExpertiseBadge.types.ts where they are.** These are component-owned types (used for component props/rendering), not data types. The `src/types/technologies.ts` file imports from them. This is a deliberate cross-boundary dependency -- the data types reference component types because the data feeds those components. Moving these into `src/types/` would break the principle that component-specific display types live with their components.

### Pattern 4: Primitive Array (techPills.ts)

**What:** `techPills.ts` exports `string[]` -- no custom interface needed.

**Example:**
```typescript
// src/data/json/techPills.json
["JavaScript", "Node.js", "Vue.js", "TypeScript", "SQL", "REST APIs", "AI Integration", "Power Platform"]

// src/data/techPills.ts
import techPillsJson from './json/techPills.json'

export const techPills: string[] = techPillsJson
```

No entry needed in `src/types/` -- no custom type to centralize.

### Pattern 5: Complex Union Types (exhibits.ts)

**What:** exhibits.ts has the most complex type hierarchy: `ExhibitType` (string literal union), `ExhibitSection` (with a `type` discriminant field using `'text' | 'table' | 'flow' | 'timeline' | 'metadata'`), and 7 supporting interfaces. JSON can represent all the data but cannot enforce discriminant narrowing at compile time.

**Key concern:** The `ExhibitSection.type` field is a string literal union. JSON stores these as plain strings. The type assertion in the loader file bridges this gap. Tests in `exhibits.test.ts` already validate structural correctness at runtime.

```typescript
// src/types/exhibits.ts
// All 7 interfaces + ExhibitType union move here verbatim

// src/data/exhibits.ts
import type { Exhibit } from '@/types/exhibits'
import exhibitsJson from './json/exhibits.json'

export type {
  Exhibit, ExhibitType, ExhibitQuote, ExhibitResolutionRow,
  ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection
} from '@/types/exhibits'

export const exhibits: Exhibit[] = exhibitsJson as Exhibit[]
```

**The `as Exhibit[]` assertion is justified because:**
1. The JSON is authored by the developer, not fetched from an external source
2. The JSON is bundled at build time (static import), not loaded at runtime
3. `exhibits.test.ts` validates structural correctness (15 entries, valid links, correct type counts, flagship data)
4. TypeScript cannot infer string literal unions from JSON -- the assertion is the only way to get type narrowing

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct JSON Imports in Components
**What:** Components importing from `@/data/json/file.json` directly.
**Why bad:** Type safety lost. Type assertions scattered across components. If the JSON structure changes, every consumer must update its assertion.
**Instead:** Always go through the `src/data/*.ts` loader. Components never know JSON exists.

### Anti-Pattern 2: Moving Component-Owned Types to src/types/
**What:** Moving `TechTags.types.ts` and `ExpertiseBadge.types.ts` into `src/types/`.
**Why bad:** These types define component props/display concerns (Tag, ExpertiseLevel). They are consumed by components and happen to also be referenced by data types. They are not "data types" -- they are "component types that data must conform to."
**Instead:** Keep them in `src/components/`. Let `src/types/technologies.ts` import from `src/components/`.

### Anti-Pattern 3: Barrel-Only Imports for Data
**What:** Creating a `src/data/index.ts` barrel that re-exports all data values.
**Why bad:** Defeats tree-shaking. A page that needs `stats` would pull in `exhibits` (the largest data file at ~34K tokens). Current import paths are already specific per-file.
**Instead:** Keep per-file imports for data values. The `src/types/index.ts` barrel is fine because types are erased at build time and have zero runtime cost.

### Anti-Pattern 4: Runtime Validation Libraries
**What:** Adding Zod, io-ts, or similar for runtime JSON validation.
**Why bad:** Overkill for static JSON that ships with the build. The data is authored by the developer, bundled by Vite, never fetched at runtime. TypeScript compile-time checking + existing unit tests are sufficient.
**Instead:** Type assertions in loader files. Existing tests validate structure.

### Anti-Pattern 5: Splitting Exhibits JSON Into Per-Exhibit Files
**What:** Creating `src/data/json/exhibits/exhibit-a.json`, `exhibit-b.json`, etc.
**Why bad:** The listing pages need the full array to filter/iterate. Splitting into 15 files means 15 imports and manual reassembly. The JSON is bundled at build time regardless -- splitting adds complexity with no performance benefit for a static SPA.
**Instead:** Single `exhibits.json` with all 15 entries.

---

## What Changes vs. What Stays the Same

### New Files

| File | Purpose |
|------|---------|
| `src/types/stats.ts` | Stat interface |
| `src/types/specialties.ts` | Specialty interface |
| `src/types/brandElements.ts` | BrandElement interface |
| `src/types/methodologySteps.ts` | MethodologyStep interface |
| `src/types/findings.ts` | Finding interface |
| `src/types/influences.ts` | Influence, InfluenceSegment, InfluenceLink interfaces |
| `src/types/philosophyInfluences.ts` | PhilosophyInfluence interface |
| `src/types/faq.ts` | FaqItem, FaqCategory interfaces |
| `src/types/technologies.ts` | TechCardData, TechCategory interfaces (imports from component types) |
| `src/types/exhibits.ts` | All exhibit interfaces + ExhibitType union |
| `src/types/index.ts` | Barrel export |
| `src/data/json/techPills.json` | Pure string array |
| `src/data/json/stats.json` | Stat data |
| `src/data/json/specialties.json` | Specialty data |
| `src/data/json/brandElements.json` | BrandElement data |
| `src/data/json/methodologySteps.json` | MethodologyStep data |
| `src/data/json/findings.json` | Finding data |
| `src/data/json/influences.json` | Influence data |
| `src/data/json/philosophyInfluences.json` | PhilosophyInfluence data |
| `src/data/json/faq.json` | FaqItem data (faqCategories stays in .ts) |
| `src/data/json/technologies.json` | TechCategory data |
| `src/data/json/exhibits.json` | Full exhibit data (largest file) |

**Total new files: 22** (11 type files + 11 JSON files)

### Modified Files

| File | Change |
|------|--------|
| `src/data/stats.ts` | Remove interface, import type from `@/types`, import JSON, re-export type |
| `src/data/specialties.ts` | Same pattern |
| `src/data/brandElements.ts` | Same pattern |
| `src/data/methodologySteps.ts` | Same pattern |
| `src/data/findings.ts` | Same pattern |
| `src/data/influences.ts` | Same pattern (3 interfaces extracted) |
| `src/data/philosophyInfluences.ts` | Same pattern |
| `src/data/faq.ts` | Same pattern, but faqCategories const stays in .ts |
| `src/data/techPills.ts` | Import JSON, no type to extract (string[]) |
| `src/data/technologies.ts` | Remove interfaces, import type from `@/types/technologies` |
| `src/data/exhibits.ts` | Remove 7 interfaces + 1 type alias, import from `@/types/exhibits` |

**Total modified files: 11**

### Unchanged Files

| File(s) | Why |
|---------|-----|
| All 18+ `.vue` component files | Import paths unchanged -- `@/data/*.ts` loaders preserve the API surface |
| All `.test.ts` files | Import paths unchanged |
| All `.stories.ts` files | No data imports in story files |
| `src/components/TechTags.types.ts` | Component-owned type, not data |
| `src/components/ExpertiseBadge.types.ts` | Component-owned type, not data |
| `tsconfig.json` | `resolveJsonModule: true` already set |
| `vite.config.ts` | JSON handling is built-in to Vite |

**Zero breaking changes to consumers.**

---

## Migration Order (Build Sequence)

Migration should proceed from simplest/least-dependent to most complex/most-dependent. Each step should result in passing tests and a clean build.

### Tier 1: Primitives and Simple Flat Types (No Type Dependencies)

These files have simple interfaces with only primitive fields (string, number, boolean). No cross-file type imports. No union types. Lowest risk. This tier establishes and proves the pattern.

| Order | File | Types to Extract | JSON Shape | Consumers |
|-------|------|-----------------|------------|-----------|
| 1 | techPills.ts | none (string[]) | flat array of strings | HomePage |
| 2 | stats.ts | Stat | flat array of objects | HomePage, StatsSection |
| 3 | specialties.ts | Specialty | flat array of objects | HomePage |
| 4 | brandElements.ts | BrandElement | flat + optional field | PhilosophyPage, BrandElement.vue |
| 5 | methodologySteps.ts | MethodologyStep | flat array of objects | MethodologyStep.vue (unused in pages) |

**Checkpoint:** Run full test suite after Tier 1. Verify no import regressions. Clean production build.

### Tier 2: Nested Types (Still No Cross-File Dependencies)

These files have nested interfaces (objects within objects, or arrays of objects within objects), but all types are self-contained within the file.

| Order | File | Types to Extract | JSON Shape | Consumers |
|-------|------|-----------------|------------|-----------|
| 6 | findings.ts | Finding | flat + optional link + tags array | HomePage, FindingCard.vue |
| 7 | philosophyInfluences.ts | PhilosophyInfluence | nested (paragraphs string[]) | PhilosophyPage, InfluenceArticle.vue |
| 8 | influences.ts | Influence, InfluenceSegment, InfluenceLink | nested (segments with optional link objects) | HomePage, InfluencesList.vue |
| 9 | faq.ts | FaqItem, FaqCategory | flat items + TS-only categories const | FaqPage |

**Checkpoint:** Run full test suite after Tier 2. Clean production build.

### Tier 3: Cross-Type Dependencies

| Order | File | Types to Extract | Complexity | Consumers |
|-------|------|-----------------|------------|-----------|
| 10 | technologies.ts | TechCardData, TechCategory | Imports Tag and ExpertiseLevel from component types | TechnologiesPage |

**Why last among non-exhibit files:** Has cross-file type dependencies. Must verify that `src/types/technologies.ts` correctly imports from `src/components/TechTags.types.ts` and `src/components/ExpertiseBadge.types.ts`.

**Checkpoint:** Run full test suite after step 10. Clean production build.

### Tier 4: The Big One

| Order | File | Types to Extract | Complexity | Consumers |
|-------|------|-----------------|------------|-----------|
| 11 | exhibits.ts | 7 interfaces + 1 type alias | Deeply nested, union discriminants, ~34K tokens of data | 4 components, 2 pages, 3 test files |

**Why last:** Most complex type hierarchy. Most consumers (9 files). Largest data volume. Highest risk of subtle breakage. By the time you reach this, the pattern is proven on 10 simpler files.

**Special considerations for exhibits.ts:**
- The JSON file will be very large (~30KB+). Vite handles this fine (static import, bundled at build time).
- `ExhibitSection.type` uses a string literal union (`'text' | 'table' | 'flow' | 'timeline' | 'metadata'`). The type assertion in the loader bridges this.
- `ExhibitType` uses a string literal union (`'investigation-report' | 'engineering-brief'`). Same approach.
- 3 test files and 6 component/page files import from this module -- all must continue passing.
- The `as Exhibit[]` assertion is justified because `exhibits.test.ts` validates structural correctness at runtime (15 entries, valid links, correct type distribution, flagship data integrity).

**Checkpoint:** Run full test suite. Verify clean production build (`npm run build`). Spot-check that ExhibitDetailPage still renders all 15 exhibits.

---

## Barrel Export Strategy for src/types/

```typescript
// src/types/index.ts
export type { Stat } from './stats'
export type { Specialty } from './specialties'
export type { BrandElement } from './brandElements'
export type { MethodologyStep } from './methodologySteps'
export type { Finding } from './findings'
export type { PhilosophyInfluence } from './philosophyInfluences'
export type { Influence, InfluenceSegment, InfluenceLink } from './influences'
export type { FaqItem, FaqCategory } from './faq'
export type { TechCardData, TechCategory } from './technologies'
export type {
  Exhibit, ExhibitType, ExhibitQuote, ExhibitResolutionRow,
  ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection
} from './exhibits'
```

The barrel is optional syntactic sugar. Components can import from specific type files or from the barrel. Since `export type` is used throughout, the barrel has zero runtime cost (all erased at compile time, no tree-shaking concern).

---

## Scalability Considerations

| Concern | Current (11 files) | Future CMS (50+ content items) |
|---------|-------------------|-------------------------------|
| Build performance | Negligible -- static JSON bundled by Vite | Same -- JSON is fast to parse |
| Type safety | Compile-time via loader assertions | Would need runtime validation (Zod) if data comes from API |
| Content editing | Edit JSON files, rebuild | Replace JSON imports with fetch() + runtime validation |
| Migration to CMS | Swap loader internals only; component imports unchanged | The loader pattern makes this a single-file change per data type |

The loader pattern is the key architectural decision that enables future CMS migration without touching any component files.

---

## Confidence Assessment

| Aspect | Confidence | Rationale |
|--------|------------|-----------|
| Directory structure | HIGH | Standard Vue 3 pattern, verified tsconfig supports JSON resolution |
| Thin loader pattern | HIGH | Built-in Vite JSON support confirmed, `resolveJsonModule: true` in tsconfig |
| Import path preservation | HIGH | Verified every consumer import path against the loader re-export pattern |
| Migration order | HIGH | Based on actual dependency analysis of all 11 data files and their 17+ consumers |
| Type assertion safety | HIGH | Existing test suite validates data structure at runtime; data is developer-authored |
| faqCategories staying in TS | HIGH | `as const` literal types cannot be expressed in JSON |
| Component types staying in components | MEDIUM | Reasonable architectural boundary; could be argued either way but avoids coupling data concerns to component concerns |

## Sources

- Direct codebase analysis of all 11 `src/data/*.ts` files and all consumer imports
- `tsconfig.json` verified for `resolveJsonModule: true` (line 9)
- `vite.config.ts` verified -- no special JSON configuration needed (Vite handles JSON natively)
- Existing `src/components/TechTags.types.ts` and `ExpertiseBadge.types.ts` analyzed for cross-type dependencies
- All `.vue`, `.test.ts`, and `.stories.ts` files searched for `from '@/data/` import patterns

---
*Architecture research for: Pattern 158 v3.0 -- JSON Data Externalization*
*Researched: 2026-04-06*
