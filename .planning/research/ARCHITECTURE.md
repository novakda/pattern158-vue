# Architecture Research

**Domain:** Vue 3 SPA — Dual exhibit template integration with unified listing page
**Researched:** 2026-03-27
**Confidence:** HIGH — derived from direct analysis of all 15 exhibits, existing page/component/data architecture

## System Overview: Current State

```
┌─────────────────────────────────────────────────────────────────┐
│                          Router (9 routes + 1 dynamic)           │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│ PortfolioPage│ Testimonials │ ExhibitDetail│ 8 other pages      │
│              │   Page       │    Page      │                    │
│ ┌──────────┐ │ ┌──────────┐│ (single      │                    │
│ │Narrative │ │ │ExhibitCard││  template,   │                    │
│ │Card      │ │ └──────────┘│  :slug param)│                    │
│ │FlagshipCd│ │ ┌──────────┐│              │                    │
│ └──────────┘ │ │Testimonial││              │                    │
│              │ │Metrics   ││              │                    │
│              │ └──────────┘│              │                    │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│                        Data Layer (static TS)                    │
│  exhibits.ts  portfolioFlagships.ts  portfolioNarratives.ts      │
└─────────────────────────────────────────────────────────────────┘
```

### Current Problems

1. **Content redundancy:** PortfolioPage and TestimonialsPage present overlapping exhibit data from different angles, with separate data sources (`portfolioFlagships.ts` duplicates content already in `exhibits.ts`)
2. **Hardcoded split:** TestimonialsPage uses `exhibits.slice(0, 9)` / `exhibits.slice(9)` to separate field reports from investigation reports -- brittle and array-order-dependent
3. **Single template:** ExhibitDetailPage renders all 15 exhibits with one template. Investigation reports (J, K, L, M, N) have rich `sections` arrays with structured content types; field reports (A-I, O) lean on quotes and contextText. Both get the same layout.
4. **Inconsistent classification flags:** `isDetailExhibit` (set on 9 of 15 exhibits) and `investigationReport` (5 true, 1 explicit false, 9 absent) overlap without clear semantics. `isDetailExhibit` only applies a CSS class on ExhibitCard; its purpose is undocumented.

## System Overview: Target State

```
┌─────────────────────────────────────────────────────────────────┐
│                     Router (updated routes)                      │
├─────────────────────────────────────────────────────────────────┤
│  /case-files  -> CaseFilesPage (unified listing)                 │
│  /portfolio   -> redirect /case-files                            │
│  /testimonials -> redirect /case-files                           │
│  /exhibits/:slug -> ExhibitDetailPage (dispatcher)               │
│                     |-> InvestigationReportLayout                │
│                     |-> EngineeringBriefLayout                   │
├─────────────────────────────────────────────────────────────────┤
│                      Component Layer                             │
│  ┌─────────────┐  ┌───────────────────┐  ┌──────────────────┐   │
│  │CaseFileCard │  │InvestigationReport│  │EngineeringBrief  │   │
│  │(type-aware) │  │Layout             │  │Layout            │   │
│  └─────────────┘  └───────────────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Data Layer                                  │
│  exhibits.ts (with exhibitType discriminant)                     │
│  [portfolioFlagships.ts -- retired]                              │
│  [portfolioNarratives.ts -- retired]                             │
└─────────────────────────────────────────────────────────────────┘
```

## Recommendation: One Page Component, Two Layout Components

**Use a single ExhibitDetailPage.vue as a dispatcher that delegates to layout components based on exhibit type.** Do NOT create two separate page components.

### Rationale

1. **Single route, single entry point.** The `/exhibits/:slug` route already works. Adding a second route (`/briefs/:slug` or `/investigations/:slug`) would break existing links, split SEO, and add routing complexity for zero user benefit.

2. **Shared concerns stay in the page.** SEO meta tags, slug resolution, 404 handling, back-navigation, and the header (label, client, date, title, type badge) are identical across both types. These belong in the page component, not duplicated across two pages.

3. **Distinct rendering stays in layouts.** The body content differs significantly between types: Investigation Reports have structured sections (text, tables, flows, timelines, metadata) while Engineering Briefs emphasize quotes, contextual narrative, and resolution tables. Extracting these into named layout components makes each template scannable -- consistent with the project's cognitive load management principle.

4. **Matches existing precedent.** The project already uses conditional rendering in ExhibitDetailPage (`v-if` on sections, quotes, resolutionTable). Refactoring from inline conditionals to named layout components is a natural evolution, not a pattern break.

### Component Architecture

```
ExhibitDetailPage.vue (page -- owns route, SEO, header, 404)
    |-- InvestigationReportLayout.vue (body layout for investigation reports)
    |   renders sections array: text, table, flow, timeline, metadata
    |-- EngineeringBriefLayout.vue (body layout for engineering briefs)
        renders quotes, contextText, resolutionTable
```

#### ExhibitDetailPage.vue -- The Dispatcher

```vue
<!-- Simplified structure showing the dispatch pattern -->
<template>
  <div v-if="exhibit" class="exhibit-detail-page">
    <!-- SHARED: Header section (identical for both types) -->
    <section class="exhibit-detail-header">
      <div class="container">
        <nav class="exhibit-back-nav">
          <router-link to="/case-files">&larr; Back to Case Files</router-link>
        </nav>
        <div class="exhibit-meta-header">
          <span class="exhibit-label">{{ exhibit.label }}</span>
          <span class="exhibit-client">{{ exhibit.client }}</span>
          <span class="exhibit-date">{{ exhibit.date }}</span>
        </div>
        <h1 class="exhibit-detail-title">{{ exhibit.title }}</h1>
        <span class="expertise-badge badge-aware">
          {{ exhibit.exhibitType === 'investigation-report'
            ? 'Investigation Report' : 'Engineering Brief' }}
        </span>
      </div>
    </section>

    <!-- DISPATCHED: Body section (type-specific) -->
    <section class="exhibit-detail-body">
      <div class="container">
        <InvestigationReportLayout
          v-if="exhibit.exhibitType === 'investigation-report'"
          :exhibit="exhibit"
        />
        <EngineeringBriefLayout
          v-else
          :exhibit="exhibit"
        />

        <!-- SHARED: Impact tags (identical for both types) -->
        <div class="exhibit-impact-tags">
          <h2>Impact &amp; Capabilities</h2>
          <TechTags :tags="exhibit.impactTags" />
        </div>
      </div>
    </section>
  </div>
</template>
```

**Why `v-if/v-else` and not dynamic components:** There are exactly two types. `<component :is="...">` adds indirection for no benefit. Two named components in the template are more scannable and explicit. If a third type ever appears (unlikely for a portfolio site), refactoring to dynamic components is trivial.

## Data Model Evolution

### Current Model Issues

The `Exhibit` interface has two classification flags (`isDetailExhibit` and `investigationReport`) that overlap and are inconsistently set:
- `isDetailExhibit` is true on 9 exhibits (A is absent, B is present, pattern unclear)
- `investigationReport` is true on 5 exhibits (J, K, L, M, N), explicitly false on 1 (O), absent on 9
- Neither flag alone cleanly maps to the two exhibit types

### Recommended: Replace Flags with String Literal Discriminant

```typescript
export type ExhibitType = 'investigation-report' | 'engineering-brief'

export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  exhibitType: ExhibitType           // NEW: replaces investigationReport + isDetailExhibit
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  sections?: ExhibitSection[]
  impactTags: string[]
  exhibitLink: string
  // isDetailExhibit -- REMOVED
  // investigationReport -- REMOVED
}
```

### Classification Mapping

Based on content analysis of all 15 exhibits:

| Exhibit | Current Flags | Proposed Type | Rationale |
|---------|---------------|---------------|-----------|
| A | isDetail: absent, invReport: absent | `engineering-brief` | Quote-heavy, context narrative, no structured investigation flow |
| B | isDetail: true, invReport: absent | `engineering-brief` | Pattern analysis narrative, no structured findings |
| C | isDetail: absent, invReport: absent | `engineering-brief` | Platform narrative, quote-driven |
| D | isDetail: absent, invReport: absent | `engineering-brief` | Migration work, context narrative |
| E | isDetail: true, invReport: absent | `engineering-brief` | Architecture narrative, no NTSB structure |
| F | isDetail: true, invReport: absent | `engineering-brief` | Protocol forensics, narrative-driven |
| G | isDetail: absent, invReport: absent | `engineering-brief` | Integration work, context narrative |
| H | isDetail: absent, invReport: absent | `engineering-brief` | Rapid diagnosis, short narrative |
| I | isDetail: absent, invReport: absent | `engineering-brief` | Methodology narrative |
| J | isDetail: true, invReport: true | `investigation-report` | NTSB-style, structured sections with findings |
| K | isDetail: true, invReport: true | `investigation-report` | Structured background/findings/outcome |
| L | isDetail: true, invReport: true | `investigation-report` | Forensic audit, structured sections |
| M | isDetail: true, invReport: true | `investigation-report` | Tool investigation, structured sections |
| N | isDetail: true, invReport: true | `investigation-report` | Platform investigation, structured sections |
| O | isDetail: true, invReport: false | `engineering-brief` | Product narrative arc, not structured investigation |

This yields **10 engineering briefs** and **5 investigation reports**.

### Why String Literal, Not Boolean

1. **Self-documenting:** `exhibitType: 'investigation-report'` reads clearly in data. `investigationReport: true` requires cross-referencing to understand.
2. **Extensible without breaks:** Adding a third type later means adding to the union, not introducing a third boolean flag.
3. **Template-friendly:** `v-if="exhibit.exhibitType === 'investigation-report'"` is clearer than `v-if="exhibit.investigationReport"`.
4. **Filter-friendly:** `exhibits.filter(e => e.exhibitType === 'engineering-brief')` reads naturally for the listing page.

## Unified Listing Page: CaseFilesPage

### Route Structure

```typescript
// router.ts changes
export const routes: RouteRecordRaw[] = [
  // ...existing routes...
  { path: '/case-files', component: () => import('./pages/CaseFilesPage.vue') },
  // Backward compat redirects
  { path: '/portfolio', redirect: '/case-files' },
  { path: '/testimonials', redirect: '/case-files' },
  // Exhibit detail route unchanged
  { path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
]
```

**Why `/case-files`:** Matches the investigative brand language ("exhibits", "field reports", "investigation reports"). `/evidence` is too vague. `/exhibits` would conflict with the detail route prefix. `/case-files` is distinct, brand-consistent, and URL-friendly.

### CaseFilesPage Structure

```
CaseFilesPage.vue
|-- HeroMinimal (consistent with all listing pages)
|-- Engineering Briefs section
|   |-- CaseFileCard v-for (type='engineering-brief')
|-- Investigation Reports section
|   |-- CaseFileCard v-for (type='investigation-report')
|-- Project Directory section (relocated from PortfolioPage)
|   |-- directory tables (inline, per existing pattern)
|-- Stats bar (relocated from PortfolioPage)
```

### CaseFileCard: Type-Aware Card Component

Replace ExhibitCard + FlagshipCard with a single CaseFileCard that has modest type-awareness:

```vue
<!-- CaseFileCard.vue -- distinct visual treatment per exhibit type -->
<template>
  <div :class="['case-file-card', `type-${exhibit.exhibitType}`]">
    <div class="case-file-header">
      <span class="case-file-label">{{ exhibit.label }}</span>
      <span class="case-file-type-badge">
        {{ exhibit.exhibitType === 'investigation-report'
          ? 'Investigation Report' : 'Engineering Brief' }}
      </span>
    </div>
    <h3>{{ exhibit.title }}</h3>
    <span class="case-file-client">{{ exhibit.client }}</span>
    <span class="case-file-date">{{ exhibit.date }}</span>

    <!-- Brief-specific: show lead quote -->
    <blockquote v-if="exhibit.exhibitType === 'engineering-brief' && exhibit.quotes?.length">
      {{ exhibit.quotes[0].text }}
    </blockquote>

    <!-- Report-specific: show contextText as summary -->
    <p v-if="exhibit.exhibitType === 'investigation-report' && exhibit.contextText"
       class="case-file-summary">
      {{ exhibit.contextText }}
    </p>

    <TechTags :tags="exhibit.impactTags" />
    <router-link :to="exhibit.exhibitLink" class="case-file-link">
      {{ exhibit.exhibitType === 'investigation-report'
        ? 'View Investigation Report' : 'View Engineering Brief' }}
    </router-link>
  </div>
</template>
```

**Design note:** The type-awareness in this card is limited to badge text, CTA text, and which preview content to show (quote vs summary). The structural layout is the same. If the two card types diverge further in visual structure, split into `BriefCard` and `ReportCard` -- but start with one component and split only if the template becomes noisy.

## Component Responsibilities

| Component | Responsibility | Status |
|-----------|---------------|--------|
| **CaseFilesPage.vue** | Unified listing replacing Portfolio + Testimonials | NEW |
| **CaseFileCard.vue** | Type-aware exhibit card for listing page | NEW (replaces ExhibitCard + FlagshipCard) |
| **InvestigationReportLayout.vue** | Detail body for investigation reports (sections rendering) | NEW (extracted from ExhibitDetailPage) |
| **EngineeringBriefLayout.vue** | Detail body for engineering briefs (quotes, context, resolution) | NEW (extracted from ExhibitDetailPage) |
| **ExhibitDetailPage.vue** | Route handler, SEO, header, dispatcher to layouts | MODIFIED (slimmed down) |
| **ExhibitCard.vue** | Listing card for Field Reports page | RETIRED (replaced by CaseFileCard) |
| **FlagshipCard.vue** | Featured engagement card for Portfolio page | RETIRED (replaced by CaseFileCard) |
| **NarrativeCard.vue** | Three Lenses narrative card | RETIRED (Three Lenses removed per v2.0 scope) |
| **TestimonialsMetrics.vue** | Recurring patterns metrics grid | EVALUATE: relocate to CaseFilesPage or remove |
| **NavBar.vue** | Navigation links array | MODIFIED (Portfolio + Field Reports -> Case Files) |
| **HomePage.vue** | CTA links and teaser section | MODIFIED (update CTAs to /case-files) |

## Data Layer Changes

| File | Action |
|------|--------|
| **exhibits.ts** | MODIFIED: add `exhibitType` field to interface and all 15 entries, remove `isDetailExhibit` + `investigationReport` |
| **portfolioFlagships.ts** | RETIRE: content is a subset of exhibits.ts, no longer needed |
| **portfolioNarratives.ts** | RETIRE: Three Lenses section removed per v2.0 scope |

### Data Flow: Listing Page

```
exhibits.ts
    |
    |-- exhibits.filter(e => e.exhibitType === 'engineering-brief')
    |   |-- CaseFileCard (brief variant) x10
    |
    |-- exhibits.filter(e => e.exhibitType === 'investigation-report')
        |-- CaseFileCard (report variant) x5
```

### Data Flow: Detail Page

```
Route params -> slug
    |
    |-- exhibits.find(e => e.exhibitLink === `/exhibits/${slug}`)
    |   |-- exhibit.exhibitType
    |       |-- 'investigation-report' -> InvestigationReportLayout
    |       |-- 'engineering-brief' -> EngineeringBriefLayout
    |
    |-- null -> redirect to not-found
```

## Recommended Build Order

Order considers dependencies: data model first (everything depends on it), then listing page (most visible change), then detail templates (refinement), then cleanup.

### Phase 1: Data Model Migration

**Depends on:** nothing
**Enables:** everything else

1. Add `ExhibitType` type and `exhibitType` field to `Exhibit` interface
2. Classify all 15 exhibits (10 briefs, 5 reports) -- mapping in table above
3. Remove `isDetailExhibit` and `investigationReport` from interface and all entries
4. Update `exhibits.test.ts` to validate new classification
5. Update ExhibitCard to use `exhibitType` instead of `isDetailExhibit` CSS class
6. Update ExhibitDetailPage badge to use `exhibitType` instead of `investigationReport`

**Risk:** Low. Pure data refactor. All existing rendering behavior preserved, just driven by different field.

### Phase 2: CaseFilesPage + CaseFileCard

**Depends on:** Phase 1 (exhibitType field exists)
**Enables:** navigation update, page retirement

1. Create CaseFileCard.vue with type-aware rendering + Storybook stories
2. Create CaseFilesPage.vue with Engineering Briefs and Investigation Reports sections
3. Relocate project directory tables from PortfolioPage (copy, not move -- old page still active)
4. Relocate stats bar from PortfolioPage
5. Decide on TestimonialsMetrics: keep and relocate, or fold content into CaseFilesPage differently
6. Add Storybook stories for CaseFilesPage

**Risk:** Medium. Most content movement. TestimonialsMetrics decision needs consideration.

### Phase 3: Route + Navigation Updates

**Depends on:** Phase 2 (CaseFilesPage exists and is complete)
**Enables:** page retirement

1. Add `/case-files` route to router.ts
2. Add redirect routes for `/portfolio` and `/testimonials`
3. Update NavBar navLinks: remove Portfolio + Field Reports entries, add Case Files
4. Update HomePage CTAs: "View All Field Reports" -> link to /case-files
5. Update ExhibitDetailPage back-nav: `/portfolio` -> `/case-files`

**Risk:** Low. Straightforward route and link updates. Router test file needs updating.

### Phase 4: Detail Template Extraction

**Depends on:** Phase 1 (exhibitType field exists)
**Can run parallel to:** Phases 2-3 (independent work on the detail page)

1. Create InvestigationReportLayout.vue -- extract sections rendering from ExhibitDetailPage
2. Create EngineeringBriefLayout.vue -- extract quotes/context/resolution rendering from ExhibitDetailPage
3. Slim ExhibitDetailPage.vue to dispatcher pattern (shared header + type dispatch + shared impact tags)
4. Add Storybook stories for both layout components
5. Verify all 15 exhibits render correctly (regression check each slug)

**Risk:** Medium. Template extraction requires careful verification. Key concern: some engineering briefs (A, E, F) also have `sections` arrays, so EngineeringBriefLayout must also handle sections rendering -- it cannot assume briefs are sections-free. The layout distinction is about emphasis and presentation framing, not about which data fields are present.

### Phase 5: Cleanup + Retirement

**Depends on:** Phases 2, 3, 4 all complete

1. Remove PortfolioPage.vue
2. Remove TestimonialsPage.vue
3. Remove ExhibitCard.vue, FlagshipCard.vue, NarrativeCard.vue
4. Remove portfolioFlagships.ts, portfolioNarratives.ts
5. Remove stale Storybook stories for retired components
6. Remove old route entries (replaced by redirects in Phase 3)
7. Final regression check: all routes, all 15 exhibit slugs

**Risk:** Low. Removing dead code after replacement is verified.

## Anti-Patterns

### Anti-Pattern 1: Two Separate Detail Page Components

**What people do:** Create `InvestigationReportPage.vue` and `EngineeringBriefPage.vue` as separate route targets.
**Why it's wrong:** Duplicates slug resolution, SEO, header rendering, 404 handling across two files. Requires either two routes (breaking links) or a router-level dispatch (moving presentation logic into the router). The shared header alone is ~20 lines of template; duplicating it is a maintenance burden.
**Do this instead:** One page component dispatching to two layout components.

### Anti-Pattern 2: Dynamic Component Registry for Two Types

**What people do:** Build a `componentMap` with `<component :is="componentMap[type]">` for exhibit rendering.
**Why it's wrong:** Indirection for two items is not abstraction, it's obfuscation. The map must be maintained separately from the template. Harder to find what renders what. `v-if` with two named imports is faster to read.
**Do this instead:** Explicit `v-if/v-else` with named imports. Two types = two branches.

### Anti-Pattern 3: Gradual Flag Migration

**What people do:** Add `exhibitType` alongside `investigationReport` and `isDetailExhibit`, plan to remove old fields "later."
**Why it's wrong:** Three classification systems in parallel. Every consumer must check multiple fields. "Later" becomes "never." Ambiguity about which field is authoritative.
**Do this instead:** Clean migration in one phase. Add new field, remove old fields, update all consumers in a single coherent change.

### Anti-Pattern 4: Assuming Layout Maps Cleanly to Data Shape

**What people do:** Assume engineering briefs have no `sections` array and investigation reports have no `quotes`. Build layouts that only handle their "expected" fields.
**Why it's wrong:** Exhibits A, E, and F are engineering briefs but have `sections` arrays. Investigation reports (J, K) have quotes. The layout distinction is about **presentation emphasis**, not data shape. A brief might render sections in a simplified way; a report might show quotes in a sidebar. The data is a superset; the layout chooses what to emphasize.
**Do this instead:** Both layout components should handle all optional fields. The difference is in presentation order, visual weight, and framing -- not in which fields are rendered.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| CaseFilesPage -> exhibits.ts | Direct import + filter by `exhibitType` | No store needed for static data |
| ExhibitDetailPage -> Layout components | Props (`:exhibit`) | Layout receives full Exhibit object |
| NavBar -> router | `navLinks` array update | Remove two entries, add one |
| HomePage -> router | RouterLink `to` prop update | Two CTA destinations change |
| ExhibitDetailPage -> router | Back-nav link text and target | `/portfolio` -> `/case-files` |

### Storybook Integration

Each new component needs stories following existing pattern: `*.stories.ts` files co-located with the component. Layout components should have stories using representative exhibit data:
- InvestigationReportLayout: use Exhibit J (most structured, has all section types)
- EngineeringBriefLayout: use Exhibit A (has quotes, context, sections, resolution table)
- CaseFileCard: one story per type variant

### Router Test Updates

`src/router.test.ts` will need updates for:
- New `/case-files` route
- Redirect behavior for `/portfolio` and `/testimonials`
- Removal of direct `/portfolio` and `/testimonials` route assertions

## Sources

- Direct codebase analysis: `src/pages/ExhibitDetailPage.vue`, `src/pages/PortfolioPage.vue`, `src/pages/TestimonialsPage.vue`, `src/components/ExhibitCard.vue`, `src/components/FlagshipCard.vue`, `src/components/NarrativeCard.vue` (HIGH confidence)
- Data model analysis: `src/data/exhibits.ts` -- all 15 exhibits, interface definition, flag usage (HIGH confidence)
- Route analysis: `src/router.ts` -- current route structure (HIGH confidence)
- Navigation analysis: `src/components/NavBar.vue` -- current nav links (HIGH confidence)
- PROJECT.md v2.0 milestone requirements (HIGH confidence)

---
*Architecture research for: Pattern 158 v2.0 -- Dual exhibit templates with unified listing page*
*Researched: 2026-03-27*
