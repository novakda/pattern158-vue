# Phase 3: Remaining Pages + Completion - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Port all 6 remaining pages (FAQ, Portfolio, Testimonials, Accessibility, Review, plus finish Contact) from the published 11ty HTML to Vue SFCs. Extract named concept components where they name concepts, enforce patterns, or reduce cognitive load. Bring all templates under 50 lines. Add Storybook stories for all new and existing components. Achieve visual parity with the live 11ty site at 375px/768px/1280px in both light and dark themes.

</domain>

<decisions>
## Implementation Decisions

### Porting approach
- **Port-first, extract-second** — convert all 11ty HTML content into Vue SFCs before identifying components to extract. Content must exist before component APIs can be designed.
- Use the published 11ty HTML repo as the canonical content source (see canonical_refs)
- All internal links converted from `.html` hrefs to `<router-link>` — no raw `.html` hrefs remain

### Component extraction scope
- Defer component extraction decisions until after content is ported into Vue SFCs
- FaqItem component: **static rendering** (all Q&A pairs visible, no accordion/disclosure)
- PortfolioPage components: Claude decides after reviewing 11ty content structure — reuse FindingCard if structurally similar, or create new component if needed
- TestimonialsPage components: Claude decides after reviewing 11ty content — reuse TestimonialQuote if sufficient, or create wrapper if richer structure exists
- PhilosophyPage componentization (currently 180 lines): Claude's discretion on whether to extract named components to bring under 50 lines

### Data file scope
- Defer data file decisions until after content is ported — Claude evaluates each page's content structure
- Repeating structured data (Q&A pairs, testimonials, case studies) → typed data files in `src/data/`
- Prose-heavy content (Accessibility, Review, Contact guidance) → keep inline in templates
- Follow Phase 2 pattern: typed files, co-located interfaces, named exports, array order = display order

### HeroMinimal adoption
- **Standardize ALL inner pages** to use the `<HeroMinimal>` component — replace inline `<section class="hero-minimal">` blocks
- ContactPage already uses HeroMinimal (keep as-is)
- PhilosophyPage, FaqPage, PortfolioPage, TestimonialsPage, AccessibilityPage, ReviewPage — all adopt HeroMinimal
- Check 11ty source for each page's hero section — use HeroMinimal's slot if the source has extra content beyond title + subtitle

### Storybook coverage
- **Full coverage** — prop variants, composition examples, and page-level stories
- Page stories enhanced with **viewport presets** (375px, 768px, 1280px) for visual parity verification
- **Backfill Phase 2 component stories** — FindingCard, SpecialtyCard, StatItem, HomeHero, InfluencesList, CtaButtons, StatsSection all get stories
- All newly extracted Phase 3 components get stories with prop variants

### Claude's Discretion
- PhilosophyPage: whether to extract named components (BrandElement, MethodologyStep, InfluenceArticle, OriginStory) or leave inline
- Data file decisions per page after content review
- Portfolio/Testimonials component structure after content review
- Dark mode in Storybook: separate story variants vs toolbar toggle — pick what works best with Storybook 10 and the existing CSS custom property theme system
- Exact composition example selection for Storybook stories

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 11ty source content (PRIMARY — content source of truth)
- `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — Published 11ty HTML pages to port from. Read each page's HTML to get exact content, structure, and class names.

### Requirements
- `.planning/REQUIREMENTS.md` — PAGE-02 through PAGE-07, COMP-01, COMP-03, COMP-04, STORY-01 mapped to this phase

### Prior phase context
- `.planning/phases/02-homepage-extraction-pattern/02-CONTEXT.md` — Extraction pattern, data architecture decisions, component API conventions established in Phase 2

### Codebase conventions
- `.planning/codebase/CONVENTIONS.md` — Naming patterns, Vue conventions, import organization
- `.planning/codebase/STRUCTURE.md` — Directory layout, where to add new code

### Existing components to reuse
- `src/components/HeroMinimal.vue` — Title/subtitle props + slot. Adopt on all inner pages.
- `src/components/TestimonialQuote.vue` — Quote/cite/context/variant props. Reuse for testimonials.
- `src/components/FindingCard.vue` — May be reusable for portfolio entries (evaluate after content review)
- `src/components/TechTags.vue` — Tag pill component (extended in Phase 2 for string[] support)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HeroMinimal.vue`: Title + subtitle props + default slot — standardize on all inner pages
- `TestimonialQuote.vue`: Quote/cite/context/variant props — reuse for testimonials across pages
- `FindingCard.vue`: Card component from Phase 2 — potential reuse for portfolio entries
- `useBodyClass.ts`: Body class composable — already used on most pages
- `useSeo.ts`: SEO composable — already called on all pages
- `ExpertiseBadge.vue`: Badge component with typed props — available for reuse

### Established Patterns
- `defineProps<{}>()` TypeScript generic form for all components
- Flat `src/components/` directory (no subfolders)
- Data files in `src/data/` with co-located interfaces and named exports
- Vue 3 fragments (multiple root elements) for page templates
- `@/` alias for all imports, 2-space indent, single quotes, semicolons

### Integration Points
- `src/pages/` — 5 TODO stub pages to replace with full content
- `src/components/` — new components added here
- `src/data/` — new data files if structured data is extracted
- Storybook stories co-located with components (`.stories.ts` suffix)

</code_context>

<specifics>
## Specific Ideas

- Port-first approach means Phase 3 naturally splits into: (1) content porting wave, (2) component extraction wave, (3) Storybook wave
- PhilosophyPage is the model for a "fully ported inner page" — it shows the section-based content structure to follow
- ContactPage is partially ported and already uses HeroMinimal — it's the model for HeroMinimal adoption
- The 11ty source HTML defines exactly what content goes on each page — no editorial changes, no content additions

</specifics>

<deferred>
## Deferred Ideas

- Exhibit page porting (exhibit-e, exhibit-j, exhibit-k, exhibit-l, exhibit-m) — future phase, links are ready with clean paths from Phase 2
- Animations/transitions — explicitly out of scope per PROJECT.md

</deferred>

---

*Phase: 03-remaining-pages-completion*
*Context gathered: 2026-03-16*
