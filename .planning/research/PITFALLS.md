# Pitfalls Research

**Domain:** Portfolio site IA restructure -- page merge, route changes, dual templates (Vue 3 SPA)
**Researched:** 2026-03-27
**Confidence:** HIGH (based on direct codebase analysis of 14 affected files across 10 components, 2 pages, 1 router, and 1 test suite)

## Critical Pitfalls

### Pitfall 1: Orphaned Internal Links After Route Removal

**What goes wrong:**
Removing `/portfolio` and `/testimonials` routes while internal `router-link` references still point to them causes silent navigation failures. Vue Router matches the catch-all `/:pathMatch(.*)*` route and renders NotFoundPage. Users clicking "View My Work" on the homepage land on a 404.

**Why it happens:**
Route references are scattered across 10+ files with no centralized link registry. This codebase has hardcoded paths in:
- `NavBar.vue` (lines 46, 48) -- navigation menu, both `/portfolio` and `/testimonials`
- `HomeHero.vue` (line 30) via `CtaButtons` -- homepage "View My Work" CTA pointing to `/portfolio`
- `HomePage.vue` (line 80) -- "View All Field Reports" button pointing to `/testimonials`
- `ExhibitDetailPage.vue` (line 43) -- back navigation `<router-link to="/portfolio">`
- `ExhibitDetailPage.test.ts` (line 58) -- test assertion for `to="/portfolio"`
- `ContactMethods.vue` (line 29) -- plain `<a href="/portfolio">` (not even a router-link)
- `CtaButtons.stories.ts` (lines 17, 24) -- Storybook stories with `/portfolio`
- `PortfolioPage.stories.ts`, `TestimonialsPage.stories.ts` -- page stories for deleted pages

**How to avoid:**
Create a route inventory before touching any routes. Build a checklist of every file that needs updating from the grep results above. Update all references in a single atomic phase simultaneously with route changes. Add Vue Router `redirect` entries for old paths as a safety net (see Pitfall 2).

**Warning signs:**
- Any `router-link` or `<a href>` pointing to a path that no longer exists in `router.ts`
- Test suite still asserting `to="/portfolio"` after route rename
- Storybook stories referencing removed pages

**Phase to address:**
Route inventory in Phase 1 (planning). Route updates must be atomic -- the phase that removes old routes must update every reference in the same phase. Never split route removal and reference updates across phases.

---

### Pitfall 2: SEO Damage from SPA Route Changes Without Redirects

**What goes wrong:**
Even though this is a client-side SPA, search engines index routes. Google's JavaScript rendering service (Googlebot WRS) executes JavaScript and indexes SPA routes. Changing `/portfolio` and `/testimonials` to a new path without redirects means:
- Existing Google index entries return soft 404 (NotFoundPage)
- External links or bookmarks break
- Open Graph / social media card previews cached for old URLs become dead links
- The `canonical` URLs set via `useSeo()` (hardcoded `path: '/portfolio'` and `path: '/testimonials'`) persist in search engine caches

**Why it happens:**
SPAs handle routing client-side, so developers assume "there are no real URLs to worry about." But the current `useSeo` composable hardcodes canonical URLs with `BASE_URL + path` -- these get indexed.

**How to avoid:**
1. Add Vue Router `redirect` entries for old paths: `{ path: '/portfolio', redirect: '/case-files' }` and `{ path: '/testimonials', redirect: '/case-files' }` (or whatever the new path is)
2. Keep redirects permanently -- they cost nothing in a client-side router
3. Update `useSeo()` calls in all new pages with correct paths
4. If the live site uses server-side routing (Netlify `_redirects`, Vercel config, nginx), add 301 redirects there too for crawlers that don't execute JS
5. Update `og:url` meta tags (handled by `useSeo`) to point to new canonical paths

**Warning signs:**
- Old URLs in `router.ts` have no `redirect` entries after route change
- Google Search Console showing increased 404s after deploy

**Phase to address:**
Same phase as route creation. Redirects are a 2-line addition per old route and must ship with the route change, not as a follow-up.

---

### Pitfall 3: Exhibit Data Model Mutation Breaking Existing Detail Pages

**What goes wrong:**
The v2.0 plan introduces two exhibit types ("Investigation Report" vs "Engineering Brief") with distinct detail templates. If the `Exhibit` interface in `exhibits.ts` is modified (renaming `investigationReport` to `exhibitType`, changing section shapes, adding required fields), existing exhibit data entries that don't conform cause TypeScript compilation failures or runtime rendering errors in ExhibitDetailPage.

**Why it happens:**
The `exhibits.ts` file is a single large data file (32K+ tokens) containing all 15 exhibits with varying shapes. The current `ExhibitDetailPage.vue` handles optional fields defensively (`exhibit.quotes?.length`, `exhibit.sections?.length`), but any new required fields or renamed properties break exhibits that lack them. The `investigationReport` boolean is already used for conditional rendering (badge display in ExhibitDetailPage, CTA text in ExhibitCard).

**How to avoid:**
1. Make the new exhibit type field additive: add `exhibitType: 'investigation-report' | 'engineering-brief'` alongside the existing `investigationReport` boolean, then deprecate the boolean after migration is complete
2. Or: keep `investigationReport` as the discriminator and derive the template choice from it (since v1.1 already classified all 15 exhibits)
3. Never add required fields to the `Exhibit` interface without providing values for all 15 exhibits in the same commit
4. Write a data validation test (extending existing `exhibits.test.ts`) that verifies every exhibit satisfies the new interface before the template switch

**Warning signs:**
- TypeScript errors after interface change
- ExhibitDetailPage rendering blank sections for some exhibits but not others
- `v-if` guards evaluating differently due to renamed/missing fields

**Phase to address:**
Data model changes must happen before template changes. Phase ordering: (1) classify exhibits and update data, (2) build new templates that consume the classification, (3) wire routing. Never change the data model and template in the same phase without a passing test suite between them.

---

### Pitfall 4: Template Switching Logic Creating an Untestable Conditional Explosion

**What goes wrong:**
The current `ExhibitDetailPage.vue` is already 155 lines with conditional rendering for quotes, sections (5 types: text, table, flow, timeline, metadata), context text, and resolution tables. Adding a second template path ("Engineering Brief" layout) by forking the template with `v-if="exhibit.investigationReport"` / `v-else` doubles the template size, makes it nearly impossible to test all branches, and creates maintenance where changes to shared elements must be applied in two places.

**Why it happens:**
The natural instinct is to add a conditional branch in the existing page component. This works for small differences but collapses when two templates have substantially different structures.

**How to avoid:**
Extract the two detail templates into separate components (e.g., `InvestigationReportDetail.vue` and `EngineeringBriefDetail.vue`). The parent `ExhibitDetailPage.vue` becomes a thin router: resolve the exhibit, determine type, render the correct component via `<component :is="...">` or a simple `v-if`/`v-else` that delegates to child components. Shared elements (header, back nav, impact tags) stay in the parent; divergent body content goes in the child templates.

This aligns with the project's extraction criterion from PROJECT.md: extract when it "names a concept, enforces a pattern, or makes a template scannable."

**Warning signs:**
- `ExhibitDetailPage.vue` growing past 200 lines
- Duplicate `v-for` loops or `v-if` blocks in the template
- Tests needing increasingly complex exhibit mocks to cover both paths
- Bug fixes for one template accidentally affecting the other

**Phase to address:**
Architecture decision needed before building the Engineering Brief template. Decide on the component extraction strategy in the planning phase, then implement the split when building the new template.

---

### Pitfall 5: Losing Unique Content From Both Pages During Merge

**What goes wrong:**
The Portfolio page and Testimonials/Field Reports page serve different purposes with different content that gets lost in a naive merge:
- **PortfolioPage** has: Three Lenses narratives (being removed -- OK), Featured Engagements (FlagshipCards from `portfolioFlagships.ts`), Complete Project Directory (38 projects across 7 industry tables, ~90 lines of hardcoded HTML), StatItems (38/6000+/15+)
- **TestimonialsPage** has: Executive Summary prose, StatItems (17/600+/5/1,216), Exhibit listing split into regular exhibits (slice 0-8) and Investigation Reports (slice 9+), TestimonialsMetrics component

Simply replacing both pages with an exhibit listing loses the directory, the stats, the metrics, and the framing content.

**Why it happens:**
The merge is conceptualized as "combine two pages into one" but the pages serve different purposes. Portfolio is about breadth (38 projects) and narrative framing. Field Reports is about depth (15 detailed exhibits with quotes).

**How to avoid:**
Create a content inventory before building the merged page:
- Content that moves to the new page: exhibit cards (type-differentiated listing)
- Content that relocates: project directory (stated goal), possibly stats
- Content removed: Three Lenses (stated goal)
- Content needing a new home: stats bars, executive summary, TestimonialsMetrics
- Components that become orphaned: NarrativeCard, FlagshipCard, possibly FlagshipCard's data file

**Warning signs:**
- The merged page is shorter or thinner than either original page
- Components from `portfolioFlagships.ts` or `portfolioNarratives.ts` are imported nowhere
- TestimonialsMetrics component has no consumer
- The 38-project directory disappears without being relocated

**Phase to address:**
Content inventory in Phase 1 (planning). Content relocation decisions before building the merged page. Verify no orphaned components/data files after merge.

---

### Pitfall 6: "Back to Portfolio" Link Becoming Contextually Wrong

**What goes wrong:**
ExhibitDetailPage.vue line 43 hardcodes `<router-link to="/portfolio">Back to Portfolio</router-link>`. After the merge, this link needs to point to the new unified page. But more subtly: the back link text "Back to Portfolio" references a page that no longer exists in navigation, confusing users.

**Why it happens:**
The back-navigation link is hardcoded rather than derived from props or the new route structure. Easy to overlook because it's inside a detail page, not a listing page.

**How to avoid:**
Update both the `to` path and the label text in a single change. Hardcoded path to the new listing page is the right approach (over `router.back()`) because users may deep-link to exhibits. Also update the test in `ExhibitDetailPage.test.ts` line 58 which asserts `to="/portfolio"`.

**Warning signs:**
- Back link text references a page name that doesn't appear in the NavBar
- Test assertion still checks for old path

**Phase to address:**
Same phase as route changes. Pair with Pitfall 1 (orphaned links).

---

### Pitfall 7: CSS Body Class Conflicts After Page Removal

**What goes wrong:**
Both pages use `useBodyClass()` with different class names: `page-portfolio` and `page-testimonials`. The site's CSS system (~3500+ lines) likely has page-scoped styles targeting these classes. If the merged page uses a new body class (e.g., `page-case-files`), all CSS rules scoped to `.page-portfolio` and `.page-testimonials` stop applying. The new page renders with missing spacing, colors, or layout rules.

**Why it happens:**
The CSS design system uses body classes for page-level scoping (sound pattern), but removing a page also removes the CSS hook. Developers focus on the Vue component and forget about the cascading CSS dependency.

**How to avoid:**
1. Grep the CSS for `.page-portfolio` and `.page-testimonials` selectors
2. Audit which styles are shared vs. page-specific
3. Create new `.page-case-files` styles incorporating needed rules from both
4. Remove orphaned CSS for deleted pages in the same phase

**Warning signs:**
- New merged page looks visually different from both source pages
- Spacing or typography inconsistencies
- CSS file still contains `.page-portfolio` and `.page-testimonials` selectors after merge (dead CSS)

**Phase to address:**
CSS migration in the same phase as page creation. Do not defer CSS cleanup.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping both old and new routes without redirects | "We'll add redirects later" | Search engines index duplicates, canonical confusion | Never -- redirects are 2 lines each |
| Forking ExhibitDetailPage with v-if instead of extracting child components | Faster to implement initially | 300+ line template, untestable, duplicate maintenance | Never for substantially different layouts |
| Leaving orphaned data files (portfolioNarratives.ts, portfolioFlagships.ts) | No immediate breakage | Confusing for future maintainers, dead imports in IDE suggestions | Acceptable briefly if tracked as explicit cleanup task |
| Hardcoding project directory HTML in a new location instead of extracting to data | Faster content relocation | 90 lines of HTML tables duplicated or moved wholesale | Acceptable for v2.0 if data extraction is explicitly out of scope |
| Keeping `investigationReport` boolean alongside new `exhibitType` discriminator | Backward compatibility during transition | Two sources of truth for exhibit classification | Acceptable during transition, must consolidate before v2.0 ships |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `useSeo()` composable | Forgetting to update `path` parameter when route changes | Update path in every `useSeo()` call; grep for old paths after route rename |
| `useHead(computed(...))` in ExhibitDetailPage | Not updating dynamic SEO to reflect new parent page context | Verify meta description and title still make sense with new IA terminology |
| Storybook page stories | Stories for removed pages still import deleted components | Delete or update stories for PortfolioPage and TestimonialsPage; create story for new page |
| ExhibitCard CTA text | CTA text logic (`investigationReport ? 'View Full Investigation Report' : 'View Investigation Report'`) may not make sense for Engineering Brief type | Review CTA text for both exhibit types on the unified listing page |
| `ContactMethods.vue` plain anchor | Contains `<a href="/portfolio">` (not a router-link, won't follow client-side redirects) | Update href to new route; consider converting to router-link |
| TestimonialsPage exhibits.slice() | Current `exhibits.slice(0, 9)` and `exhibits.slice(9)` hardcodes the split point between exhibit types | New listing should derive grouping from `investigationReport` flag, not array index |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Eagerly loading both detail template components when only one is needed | Slightly larger chunk for exhibit detail route | Use dynamic `<component :is>` with lazy imports, or accept the trivial cost at this scale | Not a real concern at 15 exhibits; but sets a bad pattern precedent for a portfolio demonstrating Vue skills |
| Project directory as hardcoded HTML duplicated across locations | Maintenance burden (not perf) | Extract to data file if it moves; single source of truth | Never a perf issue at this scale |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Navigation label change without mental model continuity | Users who learned "Portfolio" or "Field Reports" feel disoriented | Use clear, descriptive label for the merged page; ensure the page content immediately orients visitors |
| Merged listing loses two-section visual separation | Investigation Reports and regular exhibits become undifferentiated card wall | Distinct card styles per exhibit type (already planned) with clear section headings |
| Removing Three Lenses without replacing narrative on-ramp | New visitors lose the "why should I care" framing | Ensure Case Files page has intro section explaining what they're looking at |
| Losing "Executive Summary" stats from TestimonialsPage | Quantitative credibility signals (17 years, 600+ hours saved, 5 issues resolved) disappear | Relocate key stats to the merged page or another visible location |
| Two homepage CTAs pointing to two different old pages, both needing updates | If only one CTA is updated, the other 404s | Update HomeHero CTA (`/portfolio`) and Field Reports teaser CTA (`/testimonials`) in the same phase |

## "Looks Done But Isn't" Checklist

- [ ] **Route redirects:** Old `/portfolio` and `/testimonials` paths have `redirect` entries in `router.ts` -- verify by navigating to old URLs
- [ ] **NavBar:** Navigation links updated to new page -- verify both mobile hamburger and desktop menus
- [ ] **HomePage CTAs:** Both "View My Work" (HomeHero via CtaButtons) and "View All Field Reports" (field-reports-teaser section) point to new page
- [ ] **ExhibitDetailPage back link:** Both the `to` path and link text updated to reference new page
- [ ] **ExhibitDetailPage test:** Test assertion on line 58 updated from `to="/portfolio"` to new path
- [ ] **ContactMethods:** Plain `<a href="/portfolio">` updated to new path
- [ ] **Storybook stories:** Old page stories deleted/updated, new page story created, CtaButtons.stories.ts updated
- [ ] **CSS body classes:** New page has appropriate body class; old page-scoped CSS migrated or removed
- [ ] **useSeo paths:** New page has correct canonical path; no pages reference deleted paths in useSeo() calls
- [ ] **Orphaned components:** NarrativeCard, FlagshipCard -- either repurposed or removed with their data files
- [ ] **Orphaned data files:** `portfolioNarratives.ts`, `portfolioFlagships.ts` -- either consumed by new page or removed
- [ ] **TestimonialsMetrics component:** Relocated or explicitly removed
- [ ] **Project directory:** 38-project table relocated to its new home (7 industry tables, not lost)
- [ ] **Exhibit type classification:** All 15 exhibits have consistent type field, not just 5 with `investigationReport: true`
- [ ] **Exhibit listing logic:** New page groups by type from data (not `exhibits.slice()` by index)

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Orphaned internal links (404s) | LOW | Grep for old paths, update all references, add route redirects. All references documented in Pitfall 1. |
| SEO damage from missing redirects | MEDIUM | Add redirects immediately; resubmit sitemap to Google Search Console; damage recovers in 2-4 weeks |
| Data model breakage | LOW | TypeScript compiler catches most issues; fix interface and data in tandem |
| Lost content from merge | LOW | Content exists in git history; re-extract from pre-merge commit |
| CSS regression | LOW | Compare screenshots before/after; restore page-scoped styles under new class |
| Template conditional explosion | MEDIUM | Extract to child components retroactively; requires refactoring tests and stories |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Orphaned internal links | Route change phase (atomic with all reference updates) | Grep for `/portfolio` and `/testimonials` returns zero results outside redirect entries |
| SEO route damage | Route change phase (redirects ship with new routes) | Navigate to `/portfolio` and `/testimonials` in browser, verify redirect to new page |
| Data model mutation | Data/classification phase (before template work) | `npm run type-check` passes; `exhibits.test.ts` passes; all 15 exhibits render on detail page |
| Template conditional explosion | Architecture phase (decision), template build phase (execution) | ExhibitDetailPage.vue stays under 80 lines; child templates handle divergent content |
| Lost content during merge | Planning phase (content inventory with disposition for each section) | Checklist of all content sections verified: kept, relocated, or explicitly removed |
| Back link context | Route change phase (paired with Pitfall 1) | ExhibitDetailPage test updated and passing with new path |
| CSS body class conflicts | Page build phase (same phase as new page creation) | Visual comparison of merged page against screenshots of both source pages |

## Sources

- Direct codebase analysis of `/home/xhiris/projects/pattern158-vue/src/` -- 14 files examined including router.ts, NavBar.vue, HomePage.vue, HomeHero.vue, CtaButtons.vue, PortfolioPage.vue, TestimonialsPage.vue, ExhibitDetailPage.vue, ExhibitDetailPage.test.ts, ExhibitCard.vue, ContactMethods.vue, CtaButtons.stories.ts, exhibits.ts (interface), portfolioFlagships.ts, portfolioNarratives.ts (HIGH confidence)
- Vue Router documentation on `redirect` and `alias` route options (HIGH confidence, well-established features)
- Google documentation on JavaScript rendering and SPA indexing via Googlebot WRS (HIGH confidence)
- `.planning/PROJECT.md` v2.0 milestone definition and component extraction criteria (HIGH confidence)

---
*Pitfalls research for: Portfolio site IA restructure -- page merge, route changes, dual templates*
*Researched: 2026-03-27*
