# Phase 13: Page Retirement - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove old Portfolio and Testimonials pages and all their exclusive dependencies (components, Storybook stories, scoped CSS) after all traffic routes elsewhere. Router redirects remain in place as permanent bookmarks/SEO insurance.

</domain>

<decisions>
## Implementation Decisions

### Deletion Scope
- **D-01:** Delete all 7 orphaned files — no survivors:
  - `src/pages/PortfolioPage.vue`
  - `src/pages/TestimonialsPage.vue`
  - `src/components/FlagshipCard.vue`
  - `src/components/TestimonialsMetrics.vue`
  - `src/pages/PortfolioPage.stories.ts`
  - `src/pages/TestimonialsPage.stories.ts`
  - `src/components/FlagshipCard.stories.ts`
- **D-02:** TestimonialsMetrics is NOT relocated — it dies with TestimonialsPage. No future use planned.

### Router Redirects
- **D-03:** Keep `/portfolio` → `/case-files` and `/testimonials` → `/case-files` redirect objects in router.ts permanently. Cheap insurance for bookmarks and any indexed URLs.

### CSS Cleanup
- **D-04:** Remove all `.page-portfolio` and `.page-testimonials` scoped CSS rules from `src/assets/css/main.css`. This includes regular styles, dark theme overrides (`[data-theme="dark"]`), and responsive breakpoint rules (~100+ rules total).

### Claude's Discretion
- Order of operations within the phase (delete files first vs. CSS first)
- Whether to scan for any additional orphaned CSS selectors beyond the two page scopes
- Verification approach (build check, grep for dead imports, test suite)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — CLN-03 is the sole requirement: retire PortfolioPage.vue and TestimonialsPage.vue

### Files to Delete
- `src/pages/PortfolioPage.vue` — Dead page, NarrativeCard import already broken (Phase 11 D-08)
- `src/pages/TestimonialsPage.vue` — Dead page, no active route
- `src/components/FlagshipCard.vue` — Only imported by PortfolioPage (Phase 11 D-09 deferred to here)
- `src/components/TestimonialsMetrics.vue` — Only imported by TestimonialsPage
- `src/pages/PortfolioPage.stories.ts` — Storybook story for dead page
- `src/pages/TestimonialsPage.stories.ts` — Storybook story for dead page
- `src/components/FlagshipCard.stories.ts` — Storybook story for dead component

### CSS to Clean
- `src/assets/css/main.css` — All `.page-portfolio` and `.page-testimonials` scoped rules (lines ~221, ~749-754, ~1760-2144, ~3125-3138, ~3467-3518, ~3717-3730, ~3849, ~3976-4249)

### Router (keep as-is)
- `src/router.ts` — Redirect objects for `/portfolio` and `/testimonials` stay; no lazy-import references to deleted pages exist

### Prior Phase Context
- `.planning/phases/11-unified-listing-page/11-CONTEXT.md` — D-08 (NarrativeCard deleted, PortfolioPage partially broken), D-09 (FlagshipCard deferred to Phase 13)
- `.planning/phases/12-navigation-and-route-migration/12-CONTEXT.md` — Redirects already in place, deferred page deletion to Phase 13

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — this phase only deletes, it creates nothing new.

### Established Patterns
- `useBodyClass` composable adds page-specific body class (e.g., `page-portfolio`, `page-testimonials`) — these classes are the CSS scope anchors being removed
- Storybook stories follow `Component.stories.ts` naming beside the component file

### Integration Points
- `src/router.ts` — Already clean: redirect objects don't import the page components (uses `redirect` property, not `component`)
- `src/assets/css/main.css` — Global stylesheet where scoped page rules live; only file needing modification (not deletion)
- Build system — `npm run build` will confirm no broken imports remain after deletion

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user chose recommended options throughout. Straightforward cleanup phase.

</specifics>

<deferred>
## Deferred Ideas

- Storybook stories for CaseFilesPage — REF-01 (v2.x)
- Any broader CSS dead code audit beyond these two page scopes — future pass

</deferred>

---

*Phase: 13-page-retirement*
*Context gathered: 2026-04-01*
