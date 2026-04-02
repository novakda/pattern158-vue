# Phase 11: Unified Listing Page - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a single Case Files page (CaseFilesPage.vue) that presents all 15 exhibits with type-aware styling, consolidates breadth signals (stats bar, 38-project directory), removes Three Lenses content and NarrativeCard, replacing content that lived on two separate pages (PortfolioPage and TestimonialsPage).

</domain>

<decisions>
## Implementation Decisions

### Page Layout & Section Order
- **D-01:** Evidence-first layout: Hero → Stats bar → Investigation Reports (5 cards) → Engineering Briefs (10 cards) → Project Directory (tables by industry)
- **D-02:** Forensic tone hero — "Case Files" title with subtitle like "Documented evidence from 28+ years of engineering work" matching the NTSB/investigation brand identity
- **D-03:** Type group headings use the exhibitType names: "Investigation Reports" and "Engineering Briefs" with brief subtitles per section (e.g., "Methodology-driven case studies" / "Constraints navigated, results delivered")

### Card Type Styling
- **D-04:** Left border accent color differentiates card types — gray (`badge-aware` token) for Investigation Reports, teal (`badge-deep` token) for Engineering Briefs. Consistent with Phase 9 badge color system.
- **D-05:** All 15 exhibits use ExhibitCard uniformly — no FlagshipCard expanded treatment on Case Files. Type grouping and border accents provide the visual hierarchy.
- **D-06:** ExhibitCard keeps full rendering (quotes, context section, resolution table, impact tags, CTA link). The listing IS the evidence; hiding content defeats the purpose.

### Component Naming
- **D-07:** New page component is `CaseFilesPage.vue` in `src/pages/`. Follows existing XxxPage.vue naming convention.

### Three Lenses / NarrativeCard Removal (CLN-01, CLN-02)
- **D-08:** Delete `NarrativeCard.vue` and its Storybook story (and test if exists) in Phase 11. Satisfies CLN-02. PortfolioPage's Three Lenses section breaks (expected — page dies in Phase 13).

### FlagshipCard Disposition
- **D-09:** Leave FlagshipCard.vue for Phase 13. It's still imported by PortfolioPage which stays alive until Phase 12 migrates traffic. Deleting now would break PortfolioPage prematurely.

### Claude's Discretion
- Stats bar content selection (D-01 stats bar): Claude picks best combination from Portfolio stats (38 Projects / 6,000+ Emails / 15+ Industries) and/or Testimonials stats based on visual balance
- TestimonialsMetrics component: Claude evaluates whether to keep on Case Files page, relocate to homepage, or drop entirely
- Section subtitle wording for type group headings
- CSS implementation for border accents (scoped styles vs global classes)
- Body class naming (e.g., `page-case-files`)
- Project Directory: relocated as-is from PortfolioPage unless Claude identifies improvements

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — LIST-01 through LIST-05, CLN-01, CLN-02 define the listing page and cleanup requirements

### Current Pages (content sources)
- `src/pages/PortfolioPage.vue` — Three Lenses (to remove), Featured Engagements (FlagshipCards), Project Directory (tables), Stats bar
- `src/pages/TestimonialsPage.vue` — Executive Summary, all 15 ExhibitCards (two groups), TestimonialsMetrics

### Components
- `src/components/ExhibitCard.vue` — Card component for all 15 exhibits; already has type-based CTA text and border accent will be added
- `src/components/NarrativeCard.vue` — To be deleted (CLN-02)
- `src/components/FlagshipCard.vue` — NOT used on Case Files; left for Phase 13 deletion
- `src/components/TestimonialsMetrics.vue` — Disposition at Claude's discretion
- `src/components/StatItem.vue` — Reusable stat display component
- `src/components/HeroMinimal.vue` — Hero banner component used by both current pages

### Data Model
- `src/data/exhibits.ts` — Exhibit interface with `exhibitType` discriminant, `isFlagship`, all 15 exhibit records

### Prior Phase Context
- `.planning/phases/09-data-model-migration/09-CONTEXT.md` — exhibitType discriminant, badge colors (badge-aware gray for IR, badge-deep teal for EB), isFlagship field
- `.planning/phases/10-detail-template-extraction/10-CONTEXT.md` — Layout components for detail pages, dispatcher pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitCard.vue` — Already renders full exhibit cards with type-based CTA text; needs border accent CSS addition
- `StatItem.vue` — Generic stat display component, used by both PortfolioPage and TestimonialsPage
- `HeroMinimal.vue` — Hero banner with title/subtitle/slot; reusable for Case Files hero
- `TechTags.vue` — Impact tags rendering, used by ExhibitCard
- `useBodyClass` composable — Adds page-specific body class
- `useSeo` composable — SEO metadata injection

### Established Patterns
- Pages in `src/pages/` with `XxxPage.vue` naming
- `<script setup lang="ts">` with Composition API
- Data imported directly from `src/data/exhibits.ts` and filtered in component
- `v-for` with `:key` for list rendering
- Existing CSS classes: `exhibit-card`, `detail-exhibit`, `stats-bar`, `stat-item`, `portfolio-directory`, `directory-table`

### Integration Points
- `src/router.ts` — New route needed for Case Files page (Phase 12 adds the route, but component must exist first)
- `src/components/NavBar.vue` — Navigation update is Phase 12 scope
- Project Directory HTML is inline in PortfolioPage — needs to be lifted into CaseFilesPage or extracted to a component

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user consistently chose recommended options. Forensic brand tone maintained throughout.

</specifics>

<deferred>
## Deferred Ideas

- FlagshipCard.vue deletion — Phase 13 (still imported by PortfolioPage)
- PortfolioPage.vue inline narrative data cleanup — Phase 13 (page deletion)
- Route registration for `/case-files` — Phase 12
- NavBar menu update — Phase 12
- Storybook stories for CaseFilesPage — REF-01 (v2.x)
- TestimonialsMetrics component final disposition — if not resolved in Phase 11, tracked as REF-03

</deferred>

---

*Phase: 11-unified-listing-page*
*Context gathered: 2026-03-31*
