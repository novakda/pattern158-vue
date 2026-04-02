# Phase 12: Navigation and Route Migration - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Atomic switchover of routes, NavBar, homepage CTAs, and all internal link references so users reach Case Files through every path that previously led to Portfolio or Field Reports, with zero broken links. 13 references across 10 files need updating.

</domain>

<decisions>
## Implementation Decisions

### Route URL
- **D-01:** Case Files page registers at `/case-files`. Matches page name, forensic brand tone, hyphenated per URL convention.
- **D-02:** Old routes `/portfolio` and `/testimonials` use Vue Router `redirect: '/case-files'` — instant client-side redirect, no flash of old page content.

### NavBar
- **D-03:** Two menu entries (Portfolio + Field Reports) collapse to single "Case Files" entry.
- **D-04:** "Case Files" replaces Portfolio's position (5th slot). Field Reports entry removed. Final nav order: Home, Philosophy, FAQ, Technologies, Case Files, Contact.

### Homepage CTAs
- **D-05:** Hero secondary CTA text changes from "View My Work" to "View Case Files", pointing to `/case-files`.
- **D-06:** Testimonial section CTA changes from "View All Field Reports" to "View All Case Files", pointing to `/case-files`.

### Contact Page Link
- **D-07:** ContactMethods.vue portfolio link updates both href and display text — `href="/case-files"` with visible text `pattern158.solutions/case-files`.

### Detail Page Back-Navigation
- **D-08:** Both layout components (InvestigationReportLayout, EngineeringBriefLayout) update back-nav from "Back to Portfolio" → "Back to Case Files" pointing to `/case-files`.

### Claude's Discretion
- Storybook story updates (CtaButtons.stories.ts references to `/portfolio`) — update to `/case-files`
- Test assertion updates (ExhibitDetailPage.test.ts `/portfolio` reference) — update to match new route
- Any additional hardcoded route references discovered during implementation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-05, CLN-04, CLN-05 define the navigation and cleanup requirements

### Files to Modify (all 10 files with old route references)
- `src/router.ts` — Route definitions: add `/case-files`, redirect `/portfolio` and `/testimonials`
- `src/components/NavBar.vue` — navLinks array: replace two entries with one "Case Files" entry
- `src/pages/HomePage.vue` — "View All Field Reports" button text and `/testimonials` link
- `src/components/HomeHero.vue` — "View My Work" CTA text and `/portfolio` link (via CtaButtons)
- `src/components/exhibit/EngineeringBriefLayout.vue` — Back-nav link text and `/portfolio` href
- `src/components/exhibit/InvestigationReportLayout.vue` — Back-nav link text and `/portfolio` href
- `src/pages/ExhibitDetailPage.test.ts` — Test assertion referencing `/portfolio`
- `src/components/ContactMethods.vue` — Hardcoded `/portfolio` href and display text
- `src/components/CtaButtons.stories.ts` — Story data referencing `/portfolio`

### Prior Phase Context
- `.planning/phases/09-data-model-migration/09-CONTEXT.md` — Badge colors, exhibitType discriminant
- `.planning/phases/10-detail-template-extraction/10-CONTEXT.md` — Layout component locations, back-nav noted for Phase 12 update
- `.planning/phases/11-unified-listing-page/11-CONTEXT.md` — CaseFilesPage.vue creation, deferred route/nav work to Phase 12

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `NavBar.vue` — Data-driven navLinks array makes the nav update a single array edit
- `CtaButtons.vue` — Accepts `primary-to`/`secondary-to` props, so HomeHero update is just a prop change
- Vue Router `redirect` property — built-in, no custom code needed for old route redirects

### Established Patterns
- Router uses flat `RouteRecordRaw[]` array with lazy-loaded components
- NavBar renders from a `navLinks` array (data-driven, not hardcoded template)
- Layout components use `<router-link to="/portfolio">` for back-nav
- Tests use `wrapper.find('[to="/portfolio"]')` selector pattern

### Integration Points
- `src/router.ts` — Central route registry; add new route, add redirects
- `src/components/NavBar.vue:41-49` — navLinks array is the single source for menu items
- `src/pages/CaseFilesPage.vue` — Already exists from Phase 11, just needs route registration
- `src/components/HomeHero.vue:30` — secondary-to prop on CtaButtons
- `src/pages/HomePage.vue:80` — router-link to testimonials

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user consistently chose recommended options (clean, consistent "Case Files" branding throughout). All decisions favor the forensic brand tone established in earlier phases.

</specifics>

<deferred>
## Deferred Ideas

- PortfolioPage.vue and TestimonialsPage.vue file deletion — Phase 13 (pages still exist for redirect targets, actual deletion is Phase 13 scope)
- FlagshipCard.vue deletion — Phase 13
- Storybook stories for CaseFilesPage — REF-01 (v2.x)

</deferred>

---

*Phase: 12-navigation-and-route-migration*
*Context gathered: 2026-03-31*
