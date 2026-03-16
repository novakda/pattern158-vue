# Phase 2: Homepage + Extraction Pattern - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Port HomePage with full content parity to the live 11ty site and extract named concept components (FindingCard, SpecialtyCard, StatItem, HomeHero, InfluencesList, CtaButtons, StatsSection) with TypeScript props — establishing the extraction pattern Phase 3 follows. All `.html` hrefs become `<router-link>`. Data extracted to typed files in `src/data/`.

</domain>

<decisions>
## Implementation Decisions

### Link handling
- All internal route links converted from `.html` hrefs to `<router-link :to="...">` — no raw `.html` hrefs remain
- Exhibit links (`/exhibits/exhibit-e.html`, etc.) become `<router-link>` with clean paths (`/exhibits/exhibit-e`) — they'll hit NotFoundPage until exhibit pages are ported from 11ty in a future phase
- All exhibit paths drop `.html` extension to match clean URL pattern across the app
- Hash anchors (e.g., `/philosophy#influences`) work natively with `<router-link>`

### Component extraction scope
- **Extract as new components:** HomeHero, FindingCard, SpecialtyCard, StatItem, StatsSection (wraps StatItems), InfluencesList, CtaButtons
- **Reuse existing components:** TestimonialQuote (for teaser quotes), TechTags (extended for string[] support), PatternVisual (already used)
- All new components go in flat `src/components/` directory (no subfolders)
- Template line count: best effort toward scannable — don't force extractions just to hit <50 lines
- DB-generated HTML comments from 11ty source stripped — no longer meaningful

### Data architecture
- All structured data extracted to typed files in `src/data/` — even simple data like stats and tech pills
- Named exports: `export const findings: Finding[]` and `export interface Finding` from same file
- Interfaces co-located in data files (not separate type files, not in components)
- Array position determines display order — no sort/priority fields
- Named exports only (per codebase convention)

### Component API design
- All components use `defineProps<{}>()` TypeScript generic form (COMP-02 requirement)
- TechTags extended to accept `(Tag | string)[]` — normalizes strings internally for hero tech pills
- CtaButtons uses props (primaryLabel, primaryTo, secondaryLabel, secondaryTo) — not slots

### Claude's Discretion
- TestimonialQuote: whether to make `cite` optional or provide fallback for teasers without attribution
- FindingCard: single data object prop vs individual props
- SpecialtyCard: props only vs props + default slot
- HomeHero: inline content vs props-driven (it's a one-off component)
- StatsSection: array prop rendering StatItems internally vs slot-based composition
- InfluencesList: how to model mixed content (some entries have router-links, some are plain text)
- Findings data: fixed required fields with optional link vs sections array
- Data file organization: flat `src/data/` vs grouped by page — Claude decides
- FieldReportsTeaser: extract as full section component or just reuse TestimonialQuote inline
- FeaturedProjects: extract section wrapper or just loop FindingCard inline

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source content
- Live 11ty site HTML is the source of truth for content parity — the current `src/pages/HomePage.vue` already contains the full content to port
- `.planning/codebase/CONVENTIONS.md` — Naming patterns, Vue conventions, import organization
- `.planning/codebase/STRUCTURE.md` — Directory layout, where to add new code

### Existing components to reuse/extend
- `src/components/TestimonialQuote.vue` — Current API: `{ quote: string, cite: string, context?: string, variant?: 'primary' | 'secondary' }`. Teasers need cite flexibility.
- `src/components/TechTags.vue` — Current API: `{ tags: Tag[] }` where `Tag = { label: string, title: string }`. Needs extension to accept `string[]`.
- `src/components/PatternVisual.vue` — Already used in hero, no changes needed

### Requirements
- `.planning/REQUIREMENTS.md` — PAGE-01, COMP-02, COMP-04 mapped to this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TestimonialQuote.vue`: Blockquote component with quote/cite/context/variant props — reuse for teaser quotes
- `TechTags.vue`: Tag pill component with Tag[] props — extend to support string[] for hero tech pills
- `PatternVisual.vue`: Already in use in HomePage hero section
- `HeroMinimal.vue`: Inner page hero — NOT used for HomePage (HomePage has its own unique hero)
- `useSeo.ts`: Already called in HomePage — no changes needed
- `useBodyClass.ts`: Already called in HomePage — no changes needed

### Established Patterns
- `defineProps<{}>()` TypeScript generic form used consistently (TechTags, TestimonialQuote)
- Interfaces exported from component files (TechTags exports `Tag` interface)
- Named exports preferred throughout codebase
- 2-space indentation, single quotes, semicolons
- `@/` alias for all imports

### Integration Points
- `src/pages/HomePage.vue` — refactor in place, not create new
- `src/components/` — new components added here (flat)
- `src/data/` — new directory for extracted data files
- `src/router.ts` — no route changes needed (HomePage route exists)

</code_context>

<specifics>
## Specific Ideas

- Exhibit pages will be ported from 11ty in a future phase — links should use clean paths now so routes are ready
- Component extraction philosophy: components name concepts, enforce patterns, and reduce cognitive load — even single-use components are worth extracting if they make the template scannable (ADHD-informed design principle from PROJECT.md)
- This phase establishes the extraction pattern that Phase 3 applies to all remaining pages

</specifics>

<deferred>
## Deferred Ideas

- Exhibit page porting (exhibit-e, exhibit-j, exhibit-k, exhibit-m) — future phase, links are ready with clean paths
- Storybook stories for new components — Phase 3 (STORY-01)

</deferred>

---

*Phase: 02-homepage-extraction-pattern*
*Context gathered: 2026-03-16*
