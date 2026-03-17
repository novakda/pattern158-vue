# Phase 3: Remaining Pages + Completion - Research

**Researched:** 2026-03-16
**Domain:** Vue 3 SFC page porting, component extraction, Storybook 10 stories
**Confidence:** HIGH

## Summary

Phase 3 completes the Vue port by replacing six TODO-stub pages (FAQ, Portfolio, Contact finish, Testimonials, Accessibility, Review) with full content from the published 11ty HTML source. Every page follows the port-first, extract-second sequence: content lands in the Vue SFC, then repeating structured data is lifted into `src/data/` typed files, then concept components are extracted. The phase closes with Storybook stories for all new and backfilled components.

The codebase after Phase 2 is in excellent shape for this work. `HeroMinimal`, `TestimonialQuote`, `FindingCard`, `TechTags`, and the `src/data/` pattern are all production-ready and directly reusable. The primary unknowns resolved during research: (1) the Testimonials page uses a richer exhibit-card structure that does NOT map directly to `TestimonialQuote` — it needs a new `ExhibitCard` component; (2) the Portfolio page has three distinct structural areas (narratives, flagship cards, directory table) that each warrant separate components; (3) `ReviewPage.vue` has no counterpart in the 11ty source — it is a Vue-only route that needs content invented or scaffolded as a placeholder; (4) PhilosophyPage at 179 lines exceeds the 50-line target and requires component extraction to comply with COMP-03.

**Primary recommendation:** Execute three waves — Wave 1 (content porting), Wave 2 (component extraction + data files), Wave 3 (Storybook backfill). Every page adopts `<HeroMinimal>` in Wave 1 as content is ported.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Port-first, extract-second** — convert all 11ty HTML content into Vue SFCs before identifying components to extract. Content must exist before component APIs can be designed.
- Use the published 11ty HTML repo as the canonical content source.
- All internal links converted from `.html` hrefs to `<router-link>` — no raw `.html` hrefs remain.
- FaqItem component: **static rendering** (all Q&A pairs visible, no accordion/disclosure) — the `<details>`/`<summary>` structure in 11ty HTML is NOT preserved.
- Repeating structured data (Q&A pairs, testimonials, case studies) → typed data files in `src/data/`.
- Prose-heavy content (Accessibility, Review, Contact guidance) → keep inline in templates.
- Follow Phase 2 pattern: typed files, co-located interfaces, named exports, array order = display order.
- **Standardize ALL inner pages** to use `<HeroMinimal>` — replace inline `<section class="hero-minimal">` blocks.
- **Full Storybook coverage** — prop variants, composition examples, and page-level stories.
- Page stories enhanced with **viewport presets** (375px, 768px, 1280px) for visual parity verification.
- **Backfill Phase 2 component stories** — FindingCard, SpecialtyCard, StatItem, HomeHero, InfluencesList, CtaButtons, StatsSection all get stories.

### Claude's Discretion
- PhilosophyPage: whether to extract named components (BrandElement, MethodologyStep, InfluenceArticle, OriginStory) or leave inline.
- Data file decisions per page after content review.
- Portfolio/Testimonials component structure after content review.
- Dark mode in Storybook: separate story variants vs toolbar toggle — pick what works best with Storybook 10 and the existing CSS custom property theme system.
- Exact composition example selection for Storybook stories.

### Deferred Ideas (OUT OF SCOPE)
- Exhibit page porting (exhibit-e, exhibit-j, exhibit-k, exhibit-l, exhibit-m) — future phase.
- Animations/transitions — explicitly out of scope per PROJECT.md.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-02 | Port FaqPage from 11ty with complete content | 4 FAQ categories, 15 Q&A pairs confirmed from 11ty source. Static render (no accordion). FaqItem extracts a Q+A pair as a named component. Data to `src/data/faq.ts`. |
| PAGE-03 | Port PortfolioPage from 11ty with complete content | Three structural areas: narratives (3 cards), flagships (detailed case-study cards), directory table (15 industries). New components: NarrativeCard, FlagshipCard. Directory stays inline as a table. |
| PAGE-04 | Port ContactPage from 11ty with complete content | ContactPage.vue already fully ported — matches 11ty source exactly. Task is limited to verification + HeroMinimal adoption (already done). Mark complete after audit. |
| PAGE-05 | Port TestimonialsPage from 11ty with complete content | Exhibit-card structure with header, quote, context, impact-tags, link. Does NOT map to TestimonialQuote. New ExhibitCard component needed. 14 exhibits confirmed. Stats bar reuses StatItem. |
| PAGE-06 | Port AccessibilityPage from 11ty with complete content | Prose-heavy content page. Keep inline. Hero uses `.hero.hero-minimal` in 11ty — use HeroMinimal component. Sections: commitment, standards, testing (dl.definition-list), current status, browsers, features, known issues, feedback, tech specs. |
| PAGE-07 | Port ReviewPage from 11ty with complete content | No `review.html` exists in 11ty source. Route exists in Vue router and NavBar omits it. Needs a minimal professional placeholder — not a TODO stub. Prose-inline, no data file needed. |
| COMP-01 | Extract named concept components | New: FaqItem, NarrativeCard, FlagshipCard, ExhibitCard. Evaluate: PhilosophyPage sections (BrandElement, MethodologyStep, InfluenceArticle). Reuse: HeroMinimal, TestimonialQuote, TechTags, FindingCard. |
| COMP-03 | Page templates < 50 lines — scannable outlines | PhilosophyPage at 179 lines requires extraction. ContactPage at 128 lines — extraction candidate. All new pages start clean with extraction from Wave 1. |
| COMP-04 | Layout components use named slots for flexible composition | HeroMinimal already has a default slot. New layout-level components (section wrappers) should use named slots where the section can accept variant content. |
| STORY-01 | All new and refactored components have Storybook stories with prop variants | Backfill: FindingCard, SpecialtyCard, StatItem, HomeHero, InfluencesList, CtaButtons, StatsSection. New: FaqItem, NarrativeCard, FlagshipCard, ExhibitCard, plus any PhilosophyPage extractions. Viewport presets on page stories. |
</phase_requirements>

---

## Standard Stack

### Core (established — no changes)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 SFC | 3.x | Component authoring | Already in use throughout project |
| `<script setup lang="ts">` | — | Composition API pattern | Project-wide convention |
| `defineProps<{}>()` | — | TypeScript generic props | COMP-02 established in Phase 2 |
| `@storybook/vue3-vite` | 10.2.19 | Component stories | Already installed and configured |
| `@storybook/addon-vitest` | 10.2.19 | Story-based testing | Already installed |

### Supporting (established)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `HeroMinimal.vue` | local | Title/subtitle/slot hero | All inner pages |
| `TestimonialQuote.vue` | local | Quote blockquote component | Pages with simple attributable quotes |
| `FindingCard.vue` | local | Case-study card | Portfolio flagship entries if structurally identical |
| `TechTags.vue` | local | Tag pill list | Any component needing tech pill display |
| `useBodyClass` | local | Page body class | All pages with page-specific CSS |
| `useSeo` | local | Head metadata | All pages |

### No New Dependencies Required
All required libraries are already installed. Phase 3 adds no new npm packages.

---

## Architecture Patterns

### Three-Wave Execution Pattern

```
Wave 1: Content Porting
  src/pages/FaqPage.vue        — full content, inline, HeroMinimal
  src/pages/PortfolioPage.vue  — full content, inline, HeroMinimal
  src/pages/ContactPage.vue    — audit + HeroMinimal (already ported)
  src/pages/TestimonialsPage.vue — full content, inline, HeroMinimal
  src/pages/AccessibilityPage.vue — full content, inline, HeroMinimal
  src/pages/ReviewPage.vue     — professional placeholder, HeroMinimal
  src/pages/PhilosophyPage.vue — replace inline hero with HeroMinimal

Wave 2: Component Extraction + Data Files
  src/components/FaqItem.vue
  src/components/NarrativeCard.vue
  src/components/FlagshipCard.vue
  src/components/ExhibitCard.vue
  src/components/[PhilosophyPage extractions if extracted]
  src/data/faq.ts
  src/data/portfolio.ts         (narratives + flagships)
  src/data/testimonials.ts      (exhibits)

Wave 3: Storybook
  Backfill: FindingCard, SpecialtyCard, StatItem, HomeHero,
            InfluencesList, CtaButtons, StatsSection
  New:      FaqItem, NarrativeCard, FlagshipCard, ExhibitCard
  Pages:    viewport preset stories (375/768/1280)
```

### Pattern 1: HeroMinimal Adoption
**What:** Replace the inline `<section class="hero-minimal">` block with `<HeroMinimal :title="..." :subtitle="...">`.
**When to use:** Every inner page, Wave 1.
**Example:**
```typescript
// Before (all six stubs):
<section class="hero-minimal">
  <div class="container">
    <h1>FAQ</h1>
    <p class="subtitle">TODO: ...</p>
  </div>
</section>

// After:
<HeroMinimal title="Frequently Asked Questions" subtitle="Common questions about working with Dan Novak" />
```
Note: TestimonialsPage hero in 11ty uses `class="hero"` (not `hero-minimal`) and includes a `.classification` span. Use HeroMinimal with default slot for the classification text.

### Pattern 2: Data File + v-for Loop
**What:** Structured repeating data extracted to typed `src/data/` files, looped in template.
**When to use:** FAQ Q&A pairs (15 items), portfolio narratives (3), portfolio flagships (multiple), exhibit cards (14).
**Example (established Phase 2 pattern):**
```typescript
// src/data/faq.ts
export interface FaqItem {
  question: string
  answer: string
  category: 'hiring' | 'expertise' | 'style' | 'process'
}

export const faqItems: FaqItem[] = [
  {
    question: 'Are you available for new projects?',
    answer: 'Yes, available for contract, contract-to-hire, or full-time...',
    category: 'hiring',
  },
  // ...
]
```

```vue
// FaqPage.vue template (after extraction)
<FaqCategory
  v-for="cat in faqCategories"
  :key="cat.id"
  :heading="cat.heading"
  :items="faqItems.filter(i => i.category === cat.id)"
/>
```

### Pattern 3: Named Slot in Layout Components (COMP-04)
**What:** Section wrapper components expose named slots so consuming templates can inject variant content without prop proliferation.
**When to use:** Any new section-level component where content structure varies by page.
**Example:**
```vue
<!-- ExhibitCard.vue — uses default slot for quote content -->
<template>
  <div class="exhibit-card">
    <div class="exhibit-header">
      <span class="exhibit-label">{{ label }}</span>
      <span class="exhibit-client">{{ client }}</span>
    </div>
    <slot name="quote" />          <!-- blockquote injected by parent -->
    <slot name="context" />        <!-- exhibit-context section -->
    <slot name="actions" />        <!-- exhibit-link + impact tags -->
  </div>
</template>
```

### Pattern 4: Storybook Viewport Preset on Page Stories
**What:** Add viewport parameters to page-level stories for visual parity verification at 375/768/1280px.
**When to use:** All page stories in Wave 3.
**Example (Storybook 10 / `@storybook/vue3-vite`):**
```typescript
// src/pages/FaqPage.stories.ts
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },  // 320px default preset
  },
}

// Or custom viewport:
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet768',
      viewports: {
        tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
      },
    },
  },
}
```

### Anti-Patterns to Avoid
- **Accordion/disclosure for FAQ:** The locked decision is static render — no `<details>`/`<summary>`, no `v-show`, no expand/collapse.
- **Importing `.html` paths:** Every link that pointed to a `.html` file must become a `<router-link :to="...">`. The grep check `grep -r '\.html"' src/pages/` must return zero.
- **Wrapper div in page template root:** Vue 3 fragment pattern means page templates have multiple root elements (sections), never a wrapper `<div>`.
- **Prose content in data files:** Accessibility, Review, and Contact guidance content stays inline. Data files are for structured repeating records.
- **Subfolders in `src/components/`:** All new components go flat in `src/components/` per established convention.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hero section | Custom hero markup per page | `<HeroMinimal>` with props + slot | Already abstracted, consistent CSS |
| Quote display | Custom blockquote markup | `<TestimonialQuote>` | Already handles variant, cite, context |
| Tag pill lists | Custom tag rendering | `<TechTags :tags="...">` | Accepts `string[]` after Phase 2 extension |
| SEO metadata | Custom `<head>` manipulation | `useSeo({ title, description, path })` | Already wired to `@unhead/vue` |
| Body class per page | `document.body.classList` directly | `useBodyClass('page-faq')` | Lifecycle cleanup handled |

---

## Common Pitfalls

### Pitfall 1: Testimonials Page — exhibit-card != TestimonialQuote
**What goes wrong:** Implementer reuses `TestimonialQuote` for each exhibit card because the page is "testimonials." The exhibit cards have client header, dates, exhibit label, impact tags, and exhibit link — none of which TestimonialQuote exposes.
**Why it happens:** Name association overrides structural analysis.
**How to avoid:** Port content first (Wave 1). The exhibit card structure from 11ty becomes obvious. Design `ExhibitCard` props from the actual data fields.
**Warning signs:** If you're passing exhibit-specific data through `context` prop, stop — create ExhibitCard.

### Pitfall 2: PhilosophyPage Line Count
**What goes wrong:** PhilosophyPage stays at 179 lines (currently already violating the <50 target) and the plan skips it.
**Why it happens:** It's not a TODO stub, so it seems "done."
**How to avoid:** COMP-03 requires ALL page templates under 50 lines. PhilosophyPage needs component extraction (brand elements list → `BrandElement` items, methodology steps → `MethodologyStep` items, influence articles → `InfluenceArticle` items, origin stories → inline sections or `OriginStory`).
**Warning signs:** Any page template over 50 lines at Wave 2 completion is a COMP-03 violation.

### Pitfall 3: ContactPage Considered Already Done
**What goes wrong:** ContactPage is 128 lines and already has content, so it's skipped in planning.
**Why it happens:** "Already ported" suggests no work needed.
**How to avoid:** ContactPage still needs: (1) adoption of `<HeroMinimal>` — it currently uses `<HeroMinimal>` correctly, so this is done. (2) Line count — 128 lines violates <50 target. Contact guidance content is prose-heavy so staying inline was decided, but the section structure (contact-methods, guidance, testimonial) could be extracted if needed to reach <50. At minimum, audit current ContactPage.vue against the 11ty source for content parity.
**Warning signs:** Running `wc -l src/pages/ContactPage.vue` — it's 128; plan must address COMP-03 for this page.

### Pitfall 4: ReviewPage — No 11ty Source
**What goes wrong:** Implementer searches for `review.html` in the 11ty repo, doesn't find it, and either panics or creates a page with completely invented content unrelated to the site.
**Why it happens:** PAGE-07 requirement says "port from 11ty" but the source file doesn't exist.
**How to avoid:** ReviewPage is a Vue-only route (not in NavBar, not in 11ty nav). It needs a professional minimal placeholder — not a TODO, not fake content. Use HeroMinimal with title "Review" and a brief note that the page is coming soon or is a private stakeholder review area.
**Warning signs:** Any "TODO" or empty template in ReviewPage at end of Wave 1.

### Pitfall 5: Storybook Dark Mode
**What goes wrong:** Implementer adds a dark mode Storybook story by importing CSS and toggling a class — but the project's dark mode is controlled by `data-theme="dark"` on `<html>`, set by `ThemeToggle.vue`. Storybook's decorator approach won't match.
**Why it happens:** Dark mode implementation varies by project.
**How to avoid:** The existing CSS custom property system uses `[data-theme="dark"]` selector in `main.css`. In Storybook, a decorator that sets `document.documentElement.dataset.theme = 'dark'` on the preview iframe root works with the existing CSS. Verify in `preview.ts` or use a story-level decorator. This is Claude's discretion per CONTEXT.md.

### Pitfall 6: Portfolio Directory Table — Accessibility
**What goes wrong:** The `<table>` in the portfolio directory section is built without `data-label` attributes on `<td>` elements, breaking the responsive table CSS from main.css.
**Why it happens:** The responsive table pattern uses `[data-label]` pseudo-content for mobile stacked display.
**How to avoid:** Copy the `data-label` attribute pattern from the 11ty source verbatim for all `<td>` elements in the directory table.

---

## Code Examples

Verified patterns from existing codebase:

### Component Props (defineProps generic form)
```typescript
// Source: existing FindingCard.vue, SpecialtyCard.vue pattern
defineProps<{
  question: string
  answer: string
}>()
```

### Data File Pattern (co-located interface)
```typescript
// Source: src/data/findings.ts pattern
export interface FaqItem {
  question: string
  answer: string
  category: 'hiring' | 'expertise' | 'style' | 'process'
}

export const faqItems: FaqItem[] = [
  // array order = display order
]
```

### HeroMinimal with Slot (for Testimonials classification span)
```vue
<!-- TestimonialsPage.vue — hero needs extra classification text -->
<HeroMinimal title="FIELD REPORTS" subtitle="Documented evidence from incident sites...">
  <span class="classification">Corroborated · Primary Sources · 2005–2022</span>
</HeroMinimal>
```

### Page Story with Viewport Preset
```typescript
// Source: HeroMinimal.stories.ts pattern + Storybook 10 viewport addon
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FaqPage from './FaqPage.vue'

const meta = {
  title: 'Pages/FaqPage',
  component: FaqPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FaqPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile375: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile375',
      viewports: {
        mobile375: { name: 'Mobile 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
}
```

### Storybook Dark Mode Decorator Pattern
```typescript
// Decorator that applies data-theme to the story root
export const Dark: Story = {
  decorators: [
    (story) => ({
      components: { story },
      template: '<div data-theme="dark" style="min-height:100vh"><story /></div>',
    }),
  ],
}
```
Note: This only works if `[data-theme="dark"]` is on an ancestor element. The existing CSS uses `html[data-theme="dark"]` — verify selector scope in main.css before choosing decorator vs global preview approach.

---

## Content Inventory (from 11ty Source)

### FAQ Page (faq.html) — confirmed content
- **Hero:** title "Frequently Asked Questions", subtitle "Common questions about working with Dan Novak"
- **4 categories:** Hiring Logistics (3 Q&A), Technical Expertise (4 Q&A), Working Style (4 Q&A), Process & Methodology (4 Q&A) = 15 total Q&A pairs
- **Testimonial section** at bottom (2 TestimonialQuote instances)
- **Data candidate:** `src/data/faq.ts` with `FaqItem { question, answer, category }`

### Portfolio Page (portfolio.html) — confirmed structure
- **Hero:** title "Portfolio", subtitle "38 client engagements spanning 28 years of documented project work"
- **3 Positioning Narratives:** `section.portfolio-narratives` → `narrative-card` items (title, description, clients)
- **Featured Engagements:** `section.portfolio-flagships` → `flagship-card` items (client, title, dates, email count, role, summary, tags, quote, exhibit link)
- **Complete Project Directory:** `section.portfolio-directory` → industry headings + responsive `<table>` with 15 industries
- **Stats bar:** reuses `.stats-bar`/`.stat-item` pattern
- **Data candidates:** `src/data/portfolioNarratives.ts`, `src/data/portfolioFlagships.ts` (if structured). Directory table may be too large for a data file — evaluate after content review.

### Testimonials Page (testimonials.html) — confirmed structure
- **Hero:** `class="hero"` (not hero-minimal) — "FIELD REPORTS" with `pattern-number` span on "REPORTS", subtitle, and `.classification` span
- **14 Exhibit Cards** (A through N) — structure: label, client, date, title, blockquote + attribution, context section, impact-tags, exhibit link
- **Stats summary** section with stats-bar
- **New component needed:** `ExhibitCard.vue` — TestimonialQuote is insufficient
- **Data candidate:** `src/data/exhibits.ts` with `Exhibit` interface

### Accessibility Page (accessibility.html) — confirmed structure
- **Hero:** `class="hero hero-minimal"` — title "Accessibility Statement", lead paragraph
- **8+ prose sections:** Commitment, Standards (ul), Testing (dl.definition-list), Current Status (ul), Browsers, Features, Known Issues, Feedback, Technical Specs
- **Keep inline** per locked decision — no data file needed
- **`dl.definition-list`** CSS class must be preserved for styled definition lists

### Review Page — no 11ty source
- **No `review.html` in 11ty deploy branch**
- Route exists in `src/router.ts` — not in NavBar links
- **Action:** Implement as minimal professional placeholder page with HeroMinimal
- Suggested content: "Review" heading, brief contextual text (this is a private stakeholder review page, or similar)

### Contact Page (contact.html) — already ported
- **Vue ContactPage.vue matches 11ty source** — all sections present (email, social, guidance, testimonials)
- **HeroMinimal already adopted** — `<HeroMinimal title="Get in Touch" subtitle="Let's talk about your project" />`
- **Remaining work:** audit for any missed content, verify line count vs COMP-03 target

---

## Component Extraction Decision Guide

For each potential component extraction, apply this test (from project philosophy):

> Extract if the component (a) is reused across 2+ pages, OR (b) names a concept that makes the template scannable, OR (c) enforces a consistent pattern.

| Component | Reuse | Names Concept | Enforces Pattern | Extract? |
|-----------|-------|--------------|-----------------|---------|
| FaqItem | Phase 3 only | YES — a Q&A pair | YES — static Q+A display | YES |
| NarrativeCard | Phase 3 only | YES — a positioning lens | YES — title/desc/clients | YES |
| FlagshipCard | Phase 3 only | YES — a flagship engagement | YES — header/meta/summary/tags/quote/link | YES |
| ExhibitCard | Phase 3 only | YES — a field report exhibit | YES — rich exhibit structure | YES |
| BrandElement (PhilosophyPage) | Phase 3 only | YES — a brand element entry | YES — dt/dd pattern | Claude discretion |
| MethodologyStep (PhilosophyPage) | Phase 3 only | YES — a methodology step | YES — numbered step | Claude discretion |
| InfluenceArticle (PhilosophyPage) | Phase 3 only | YES — an influence article | YES — source/lesson/application | Claude discretion |

**Recommendation for PhilosophyPage:** Extract all three (BrandElement, MethodologyStep, InfluenceArticle) — the template is 179 lines and must reach <50. This is mathematically required, not optional.

---

## State of the Art

| Old Pattern | Phase 3 Pattern | Context |
|-------------|-----------------|---------|
| `<section class="hero-minimal">` inline | `<HeroMinimal title="..." subtitle="..." />` | Standardize all pages |
| `TODO: Convert from x.html` stub | Full content from 11ty source | Wave 1 |
| `export default {}` in stories | `satisfies Meta<typeof Component>` | Already in use in project |
| Single `Default` story | `Default` + viewport stories + `Dark` | Wave 3 |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (projects array with unit + browser) |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-02 | FaqPage renders all 15 Q&A pairs, no TODO text | unit | `vitest run --project unit src/pages/FaqPage.test.ts` | ❌ Wave 0 |
| PAGE-03 | PortfolioPage renders narratives, flagships, directory | unit | `vitest run --project unit src/pages/PortfolioPage.test.ts` | ❌ Wave 0 |
| PAGE-04 | ContactPage renders complete content, no TODO | unit | `vitest run --project unit src/pages/ContactPage.test.ts` | ❌ Wave 0 |
| PAGE-05 | TestimonialsPage renders 14 exhibit cards, no TODO | unit | `vitest run --project unit src/pages/TestimonialsPage.test.ts` | ❌ Wave 0 |
| PAGE-06 | AccessibilityPage renders all sections, no TODO | unit | `vitest run --project unit src/pages/AccessibilityPage.test.ts` | ❌ Wave 0 |
| PAGE-07 | ReviewPage renders content, no TODO | unit | `vitest run --project unit src/pages/ReviewPage.test.ts` | ❌ Wave 0 |
| COMP-03 | All page templates under 50 lines | manual | `wc -l src/pages/*.vue` | N/A — manual check |
| COMP-03 | No `.html` hrefs remain | manual | `grep -r '\.html"' src/pages/` | N/A — manual check |
| COMP-04 | HeroMinimal slot renders injected content | unit | `vitest run --project unit src/components/HeroMinimal.test.ts` | ❌ Wave 0 |
| STORY-01 | All component stories render without error | Storybook/vitest | `npm test` (addon-vitest integration) | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/pages/FaqPage.test.ts` — covers PAGE-02
- [ ] `src/pages/PortfolioPage.test.ts` — covers PAGE-03
- [ ] `src/pages/ContactPage.test.ts` — covers PAGE-04
- [ ] `src/pages/TestimonialsPage.test.ts` — covers PAGE-05
- [ ] `src/pages/AccessibilityPage.test.ts` — covers PAGE-06
- [ ] `src/pages/ReviewPage.test.ts` — covers PAGE-07
- [ ] `src/components/HeroMinimal.test.ts` — covers COMP-04 slot behavior

---

## Open Questions

1. **ReviewPage content**
   - What we know: No `review.html` in 11ty source. Route exists in router. Not in NavBar.
   - What's unclear: What should this page say? Is it a private stakeholder review area, a page about the review/engagement process, or something else?
   - Recommendation: Implement as a minimal professional placeholder — "Review" heading with a one-sentence explanation that this page is for stakeholder review of ongoing engagements. Not a TODO stub; reads as intentional.

2. **CSS selectors for dark mode in Storybook**
   - What we know: `main.css` uses `[data-theme="dark"]` selector. ThemeToggle sets `document.documentElement.dataset.theme`.
   - What's unclear: Whether `document.documentElement` in the Storybook preview iframe refers to the `<html>` of the story canvas or the outer Storybook shell.
   - Recommendation: Implement a story-level decorator that wraps story output in `<div data-theme="dark">` and verify that CSS variables cascade correctly. If they don't, use a global preview decorator that sets the attribute on the iframe `<html>` element.

3. **Portfolio Directory Table — data file vs inline**
   - What we know: 15 industries, dozens of rows. Phase 2 pattern favors typed data files for structured repeating content.
   - What's unclear: Whether the table is large enough to warrant a data file or small enough to stay inline.
   - Recommendation: Defer per locked decision. After content is ported inline in Wave 1, evaluate row count. If >20 rows total, extract to `src/data/portfolioDirectory.ts`. If manageable inline, leave it.

4. **PhilosophyPage extraction — InfluenceArticle vs InfluencesList reuse**
   - What we know: `InfluencesList.vue` already exists from Phase 2 (renders `influences` data from `src/data/influences.ts`). PhilosophyPage has its own `<article class="influence">` elements with the same concept.
   - What's unclear: Whether the PhilosophyPage influences section should reuse `InfluencesList` + `influences` data or extract separate `InfluenceArticle` components.
   - Recommendation: Check whether `InfluencesList.vue` renders the same data that PhilosophyPage's influence articles use. If same data, reuse InfluencesList. If richer content (the PhilosophyPage articles have longer "career application" paragraphs with router-links), extract InfluenceArticle.

---

## Sources

### Primary (HIGH confidence)
- Live 11ty source — `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — all page HTML structures fetched directly
- `src/` codebase — all existing components, pages, data files, configs read directly

### Secondary (MEDIUM confidence)
- Storybook 10 viewport addon docs — inferred from `@storybook/addon-docs` and standard Storybook viewport parameters API (verified pattern exists in Storybook docs, exact parameter names assumed from docs)

### Tertiary (LOW confidence)
- Dark mode decorator pattern — based on CSS custom property system observed in codebase + general Storybook decorator approach; specific behavior with `data-theme` on div vs html element requires runtime verification

---

## Metadata

**Confidence breakdown:**
- Content inventory (what each page needs): HIGH — fetched directly from 11ty source
- Component extraction scope: HIGH — derived from content structure + established Phase 2 rules
- Storybook viewport stories: MEDIUM — API pattern confirmed from Storybook docs, exact param names need verification
- Dark mode Storybook: LOW — CSS approach confirmed, Storybook iframe scoping needs runtime check
- ReviewPage placeholder: MEDIUM — inference from context (not in NavBar, no 11ty source)

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable Vue 3 + Storybook 10 — unlikely to change)
