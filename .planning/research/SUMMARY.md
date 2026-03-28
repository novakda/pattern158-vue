# Project Research Summary

**Project:** Pattern 158 v2.0 -- Dual Exhibit Templates and IA Restructure
**Domain:** Vue 3 SPA portfolio site for senior engineer with proprietary work history
**Researched:** 2026-03-27
**Confidence:** HIGH

## Executive Summary

Pattern 158 v2.0 is an information architecture restructure of an existing Vue 3 portfolio site, not a greenfield build. The site presents 28+ years of proprietary engineering work through 15 evidence-based "exhibits" -- primary-source quotes, email corpus metrics, and named personnel replacing the public repos and live demos that this engineer cannot show. The core problem: two listing pages (Portfolio and Field Reports/Testimonials) present overlapping exhibit content from different angles with separate data sources, and all 15 exhibits share a single detail template despite having two distinct content structures.

The recommended approach requires zero new dependencies. The entire v2.0 scope is achievable with Vue 3's built-in component system, TypeScript discriminated unions, and Vue Router redirects -- all patterns already validated in the existing codebase. The work is: (1) replace two ambiguous boolean flags with a single `exhibitType` string literal discriminant on the data model, (2) merge two listing pages into one unified Case Files page with type-aware cards, (3) extract the monolithic detail page into a thin dispatcher plus two focused layout components, and (4) update all routes, navigation, and internal links atomically.

The primary risks are content loss during the page merge (the two pages contain unique content beyond just exhibit cards -- project directory tables, stats bars, executive summary prose) and orphaned internal links (route references are scattered across 10+ files with no centralized registry). Both risks are fully mitigatable through upfront inventories and atomic phase execution. The architecture research produced a complete 15-exhibit classification mapping and a file-level impact analysis, giving high confidence in the implementation plan.

## Key Findings

### Recommended Stack

No new packages. The existing stack (Vue 3.5.30, TypeScript 5.7, Vite 6, Vue Router 4.6.4) provides everything needed. The key Vue patterns are `v-if/v-else` for template dispatch, `defineAsyncComponent` for lazy layout loading (optional at this scale), computed properties for type-based filtering, and Vue Router `redirect` for backward-compatible route changes.

**Core patterns (all built-in):**
- **TypeScript discriminated union** (`ExhibitType = 'investigation-report' | 'engineering-brief'`): replaces two overlapping boolean flags with a self-documenting, extensible discriminant
- **`v-if/v-else` template dispatch**: two exhibit types means two branches, not a dynamic component registry
- **Vue Router `redirect`**: zero-cost backward compatibility for renamed routes
- **Computed filtering**: idiomatic Vue for deriving exhibit subsets from static data

**What NOT to add:** Pinia/Vuex (data is static imports), separate routes per exhibit type (breaks bookmarks if reclassified), provide/inject (one level of props), CSS Modules (project uses cascade layers).

### Expected Features

**Must have (v2.0 -- resolves IA redundancy):**
- Classify all 15 exhibits as Investigation Report (5) or Engineering Brief (10) in data model
- Unified Case Files listing page replacing Portfolio + Field Reports
- Visual type distinction on cards (badge, border, CTA text per type)
- Detail page type label for both types (Investigation Report badge exists; Engineering Brief needs equivalent)
- Navigation coherence (single entry point replacing two)
- Route redirects for `/portfolio` and `/testimonials`
- Project directory (38 projects, 7 industry tables) relocated to Case Files
- Stats bar consolidated onto Case Files
- Three Lenses AI-generated content deliberately removed

**Should have (v2.x after validation):**
- Type-filtered listing view (tabs or toggle on Case Files)
- Engineering Brief template refinements if the generic layout does not fit well
- Flagship data consolidation (merge summaries into Exhibit interface or retire `portfolioFlagships.ts`)
- Storybook stories for all new/modified components
- Homepage CTA updates

**Defer (v3+):**
- New exhibit content creation
- Technology cross-references between exhibits
- Tag-based filtering (premature at 15 items)

### Architecture Approach

Single ExhibitDetailPage.vue acts as a dispatcher: it owns route resolution, SEO meta, the shared header (label, client, date, title, type badge), 404 handling, and back-navigation. It delegates body rendering to two extracted layout components -- InvestigationReportLayout (structured sections: text, table, flow, timeline, metadata) and EngineeringBriefLayout (quotes, context narrative, resolution tables). Both layouts must handle all optional Exhibit fields because the data shapes overlap; the distinction is presentation emphasis, not data presence. A new CaseFileCard component replaces both ExhibitCard and FlagshipCard with type-driven CSS modifiers and conditional content slots.

**Major components:**
1. **CaseFilesPage.vue** (NEW) -- unified listing with type-grouped sections, project directory, stats bar
2. **CaseFileCard.vue** (NEW) -- single card component with `.type-investigation-report` / `.type-engineering-brief` CSS modifiers
3. **InvestigationReportLayout.vue** (NEW) -- detail body for NTSB-style structured investigations
4. **EngineeringBriefLayout.vue** (NEW) -- detail body for quote-driven engineering narratives
5. **ExhibitDetailPage.vue** (MODIFIED) -- slimmed to dispatcher pattern (~80 lines)

**Retired:** ExhibitCard.vue, FlagshipCard.vue, NarrativeCard.vue, PortfolioPage.vue, TestimonialsPage.vue, portfolioFlagships.ts, portfolioNarratives.ts

### Critical Pitfalls

1. **Orphaned internal links after route removal** -- Route references exist in 10+ files (NavBar, HomeHero, HomePage, ExhibitDetailPage, ContactMethods, tests, Storybook stories). All must update atomically with route changes. ContactMethods uses a plain `<a href>` that will not follow client-side redirects. Mitigation: grep-based route inventory, atomic update phase.

2. **Content loss during page merge** -- Portfolio page has 38-project directory (90 lines of HTML tables), stats bars, and flagship summaries. Testimonials page has executive summary prose, different stats, and TestimonialsMetrics. A naive exhibit-card listing loses all of this. Mitigation: content inventory with explicit disposition for every section before building.

3. **Data model mutation breaking existing pages** -- Adding `exhibitType` while removing `investigationReport` and `isDetailExhibit` must happen in one atomic data migration with values for all 15 exhibits. Never add required fields without providing values for all entries in the same commit. Mitigation: data validation test, type-check pass between data and template changes.

4. **Template conditional explosion** -- Adding a second layout path via inline `v-if/v-else` in ExhibitDetailPage (already 155 lines) creates an untestable monolith. Mitigation: extract to two named layout components from the start, not as a later refactor.

5. **CSS body class conflicts** -- Both pages use `useBodyClass()` with page-specific classes. CSS rules scoped to `.page-portfolio` and `.page-testimonials` stop applying when those pages are removed. Mitigation: audit CSS selectors, create `.page-case-files` styles in the same phase as page creation.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Data Model Migration

**Rationale:** Everything depends on the `exhibitType` discriminant existing. This is the foundation with zero visual impact -- pure data refactor that can be validated with type-checking and unit tests before any UI work begins.
**Delivers:** Clean exhibit classification (10 engineering briefs, 5 investigation reports), removal of ambiguous `isDetailExhibit` and `investigationReport` flags, updated data validation tests.
**Addresses:** Exhibit type classification (P1 feature), data model consistency.
**Avoids:** Pitfall 3 (data model mutation breaking pages) -- by updating all 15 exhibits in one atomic change with a passing test suite.

### Phase 2: Detail Template Extraction

**Rationale:** Can proceed immediately after Phase 1 since it depends only on `exhibitType` existing. Independent of listing page work. Extracting templates early means the detail page is stable before route changes create navigation churn.
**Delivers:** InvestigationReportLayout.vue, EngineeringBriefLayout.vue, slimmed ExhibitDetailPage dispatcher. All 15 exhibits rendering correctly through the new template dispatch.
**Addresses:** Engineering Brief as distinct type (differentiator feature), detail page type labels.
**Avoids:** Pitfall 4 (conditional explosion) -- by extracting from the start rather than forking inline.

### Phase 3: Unified Listing Page

**Rationale:** Depends on Phase 1 (needs `exhibitType` for filtering/grouping). This is the most visible change and the most content-sensitive. Building it while old pages still exist allows side-by-side comparison.
**Delivers:** CaseFilesPage.vue, CaseFileCard.vue, relocated project directory and stats bar, retired Three Lenses content.
**Addresses:** Unified Case Files listing (P1), visual type distinction on cards (P1), breadth signal preservation, stats consolidation, Three Lenses removal.
**Avoids:** Pitfall 5 (content loss during merge) -- by building new page alongside old ones with explicit content inventory.

### Phase 4: Route and Navigation Migration

**Rationale:** Must come after Phases 2 and 3 so that the new page and templates are complete and tested before old routes are removed. All link updates happen atomically in one phase.
**Delivers:** New `/case-files` route, redirects for `/portfolio` and `/testimonials`, updated NavBar, HomePage CTAs, ExhibitDetailPage back-nav, ContactMethods href, updated tests and Storybook stories.
**Addresses:** Navigation coherence (P1), route redirects (P1), back-nav update (P1).
**Avoids:** Pitfall 1 (orphaned links) and Pitfall 6 (back link context) -- by updating every reference in one atomic phase using the route inventory from pitfalls research. Pitfall 2 (SEO damage) -- by shipping redirects with the route change.

### Phase 5: Cleanup and Retirement

**Rationale:** Only after all new components are wired and tested. Removing dead code is low risk but should be verified with a full regression pass.
**Delivers:** Removal of PortfolioPage, TestimonialsPage, ExhibitCard, FlagshipCard, NarrativeCard, portfolioFlagships.ts, portfolioNarratives.ts, stale Storybook stories, orphaned CSS.
**Addresses:** Clean codebase, no orphaned components or data files.
**Avoids:** Pitfall 7 (CSS body class conflicts) -- by auditing and migrating CSS in the same phase as removal.

### Phase Ordering Rationale

- **Data model first** because every subsequent phase reads `exhibitType`. Validated independently with TypeScript compiler and unit tests.
- **Detail templates before listing page** because template extraction is a focused refactor (one component in, two components out) with clear verification (all 15 exhibits must render). Listing page is higher-risk content work that benefits from a stable detail layer.
- **Listing page before route changes** because building alongside old pages enables comparison and content verification. No user-facing breakage until routes switch.
- **Routes as atomic phase** because the pitfalls research identified 10+ files with hardcoded paths. Splitting route removal and reference updates across phases guarantees orphaned links.
- **Cleanup last** because premature file deletion creates risk with no benefit. Dead files cost nothing; broken imports cost debugging time.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Detail Template Extraction):** Exhibits A, E, and F are engineering briefs with `sections` arrays. The layout split is about presentation emphasis, not data shape. Needs careful review of which sections each layout renders and how. May benefit from `/gsd:research-phase` to audit all 15 exhibits' actual content structures.
- **Phase 3 (Unified Listing Page):** Content disposition decisions needed for TestimonialsMetrics component, executive summary prose, and two different stats bars. Needs a content inventory checklist before implementation.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Data Model Migration):** Pure TypeScript interface change with well-documented discriminated union pattern. Classification mapping already complete in architecture research.
- **Phase 4 (Route Migration):** Vue Router redirects are documented core functionality. Complete file inventory already provided in pitfalls research.
- **Phase 5 (Cleanup):** File deletion and dead code removal. No research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All patterns use built-in Vue 3 / TypeScript features already validated in v1.0/v1.1. Sources are official Vue and TypeScript documentation. |
| Features | HIGH | Feature list derived from direct codebase audit of all 15 exhibits plus PROJECT.md requirements. External sources are secondary confirmation. |
| Architecture | HIGH | Component architecture, data model evolution, and build order derived from direct analysis of every affected file. Complete 15-exhibit classification mapping produced. |
| Pitfalls | HIGH | Every pitfall identified by grep/analysis of actual codebase files (14 files examined). File names and line numbers provided. No theoretical pitfalls -- all are concrete. |

**Overall confidence:** HIGH -- This is an established codebase restructure with no new technology, no external integrations, and no uncertain requirements. The research is grounded in direct code analysis rather than external sources.

### Gaps to Address

- **TestimonialsMetrics disposition:** Research identified this component needs relocation or removal but did not make a firm recommendation. Decision needed during Phase 3 planning: relocate to Case Files page, fold content into a different format, or remove.
- **Flagship summary content:** `portfolioFlagships.ts` contains `summary` and `quote` fields that extend exhibit data. Decision needed: merge summaries into the Exhibit interface (richer cards on listing page) or accept that CaseFileCard renders from existing exhibit fields only. Deferred to v2.x is acceptable.
- **Project directory data extraction:** The 38-project directory is 90 lines of hardcoded HTML tables. Research flags this as acceptable tech debt for v2.0 (relocate HTML as-is) but notes it should be extracted to data if the directory grows. Not blocking.
- **Engineering Brief section rendering:** Briefs A, E, and F have `sections` arrays despite being classified as engineering briefs. EngineeringBriefLayout must render sections -- the layout distinction is framing and emphasis, not field presence. This needs attention during Phase 2 implementation.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: all 15 exhibits in `exhibits.ts`, `ExhibitDetailPage.vue`, `PortfolioPage.vue`, `TestimonialsPage.vue`, `ExhibitCard.vue`, `FlagshipCard.vue`, `NarrativeCard.vue`, `NavBar.vue`, `HomePage.vue`, `HomeHero.vue`, `CtaButtons.vue`, `ContactMethods.vue`, `router.ts`, `ExhibitDetailPage.test.ts`
- Vue 3 official documentation: dynamic components, async components, computed properties
- Vue Router 4 official documentation: redirect and alias
- TypeScript handbook: discriminated unions and type narrowing
- PROJECT.md v2.0 milestone requirements

### Secondary (MEDIUM confidence)
- DEV Community, Codecademy, TextExpander, Toptal, Artfolio: portfolio best practices and case study structuring
- NTSB official site: investigation process methodology (framing reference)

### Tertiary (LOW confidence)
- Quora community advice on showing proprietary work in portfolios

---
*Research completed: 2026-03-27*
*Ready for roadmap: yes*
