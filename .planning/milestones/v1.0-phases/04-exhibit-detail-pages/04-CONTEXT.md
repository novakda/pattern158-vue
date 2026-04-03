# Phase 4: Exhibit Detail Pages + Data Fix - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire all exhibit router-links (from ExhibitCard and FlagshipCard) to a real ExhibitDetailPage. Fix the Exhibit O data gap (missing from exhibits.ts despite being referenced in portfolioFlagships.ts). Register a single dynamic `/exhibits/:slug` route in router.ts. The result: any exhibit link resolves to a rendered detail page — not 404.

</domain>

<decisions>
## Implementation Decisions

### ExhibitDetailPage content depth
- **Some exhibits have richer 11ty content than what's in exhibits.ts** — the mix varies per exhibit
- Researcher must read the 11ty source for each exhibit URL to determine what additional content exists beyond the current data fields
- When extra content doesn't fit the current Exhibit interface: **Claude's discretion on data model** — extend the Exhibit interface with optional fields, use slots, or use another approach based on what the content structure actually is
- ExhibitDetailPage renders what's in exhibits.ts at minimum; richer exhibits get fuller treatment based on 11ty source

### ExhibitDetailPage header
- **Custom header for exhibits** — not HeroMinimal
- Exhibit pages have distinct metadata (client, date, exhibit label) that warrants a dedicated header treatment
- ExhibitDetailPage should visually distinguish itself from plain inner pages while remaining consistent with the design token system

### Navigation flow
- **Back to Portfolio link at the top of the page** — single link, no breadcrumbs, no prev/next
- Mental model: user came from Portfolio → return to Portfolio
- No sequential exhibit browsing — exhibits are not a linear sequence
- SEO (useSeo) and other standard page setup: Claude's discretion per established pattern

### Exhibit O data gap
- **11ty source has an exhibit-o page** — researcher should read `/exhibits/exhibit-o.html` from the 11ty repo and port the data into exhibits.ts
- `isDetailExhibit` flag and other metadata: Claude's discretion after reading 11ty content
- After adding Exhibit O, exhibits.ts should have entries A through O (15 exhibits)

### Route architecture
- **Single dynamic route: `/exhibits/:slug`** registered in router.ts
- ExhibitDetailPage reads the slug param, looks up exhibit in exhibits.ts by matching `exhibitLink` path
- If slug doesn't match any exhibit: render NotFoundPage (consistent with existing 404 behavior)
- All 15 exhibit links (A–O) must resolve — every ExhibitCard and FlagshipCard router-link hits a real page

### Claude's Discretion
- SEO setup on ExhibitDetailPage (useSeo call with exhibit title/description)
- Exhibit O's isDetailExhibit flag and investigationReport flag — set based on 11ty content
- Data model extension approach when extra content doesn't fit current Exhibit interface
- Storybook story structure for ExhibitDetailPage (required by success criteria)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 11ty source content (PRIMARY — content source of truth)
- `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — Read each `/exhibits/exhibit-*.html` page to determine: (a) what content exists beyond exhibits.ts data fields, (b) Exhibit O content, (c) exact structure and class names for the detail page layout

### Requirements
- `.planning/REQUIREMENTS.md` — PAGE-03 (PortfolioPage exhibit links), PAGE-05 (exhibits navigation flow)

### Prior phase context
- `.planning/phases/03-remaining-pages-completion/03-CONTEXT.md` — ExhibitCard named slots, data patterns, component conventions from Phase 3
- `.planning/phases/02-homepage-extraction-pattern/02-CONTEXT.md` — Data architecture pattern (typed files, co-located interfaces, named exports)

### Existing code
- `src/data/exhibits.ts` — Current Exhibit interface and 14 entries (A–N); Exhibit O to be added
- `src/data/portfolioFlagships.ts` — 15 flagship entries including Exhibit O reference
- `src/components/ExhibitCard.vue` — Existing card component with named slots; ExhibitDetailPage should be consistent with this structure
- `src/router/index.ts` — Current route table; needs `/exhibits/:slug` dynamic route added

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitCard.vue`: Named slots (quote/context/table/actions) + typed Exhibit prop — ExhibitDetailPage can import and reuse the Exhibit interface and potentially reuse rendering logic
- `FlagshipCard.vue`: Also links to exhibit pages — must resolve once routes are registered
- `useSeo.ts`: SEO composable — apply per established pattern on ExhibitDetailPage
- `useBodyClass.ts`: Body class composable — apply per established pattern

### Established Patterns
- Dynamic route param lookup: read `route.params.slug`, find matching entry in data array by path comparison
- Unknown slug → NotFoundPage: use Vue Router's `router.replace({ name: 'not-found' })` or conditional render pattern
- `defineProps<{}>()` TypeScript generic form for all components
- Flat `src/components/` directory, `src/pages/` for page-level SFCs
- Vue 3 fragments (no wrapper `<main>` or div in page templates)
- All internal links as `<router-link>` — no raw `.html` hrefs

### Integration Points
- `src/router/index.ts`: Add `/exhibits/:slug` route before the catch-all `/:pathMatch(.*)*` route
- `src/pages/`: Add `ExhibitDetailPage.vue` (and optionally `ExhibitDetailPage.stories.ts`)
- `src/data/exhibits.ts`: Add Exhibit O entry; optionally extend Exhibit interface with new optional fields

</code_context>

<specifics>
## Specific Ideas

- The exhibit detail header should surface the client, date range, and exhibit label prominently — these are the provenance markers that make an exhibit credible as a case study
- The "Back to Portfolio" link should feel like a navigation affordance, not just a footer item — top placement, near the header

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-exhibit-detail-pages*
*Context gathered: 2026-03-17*
