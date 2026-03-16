# Architecture Research

**Domain:** Vue 3 SPA — static portfolio site with component extraction
**Researched:** 2026-03-16
**Confidence:** HIGH — derived directly from existing codebase + two fully-ported pages as proof of pattern

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / HTML Entry                      │
│  index.html → theme detection script → main.ts → Vue app mount  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         App Shell (App.vue)                      │
│  <skip-link> → <NavBar> → <router-view> → <FooterBar>            │
└──────────┬─────────────────────────────────────────┬────────────┘
           │                                         │
┌──────────▼──────────────────────────────────────── │ ───────────┐
│                      Page Layer (src/pages/)        │            │
│  Each route → one Page component                   │            │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────┐  │            │
│  │ HomePage   │ │ PhilosophyPg │ │ TechPage    │  │ ...7 more  │
│  └─────┬──────┘ └──────┬───────┘ └──────┬──────┘  │            │
└────────┼───────────────┼────────────────┼──────────┘────────────┘
         │               │                │
┌────────▼───────────────▼────────────────▼──────────────────────┐
│                   Component Layer (src/components/)             │
│                                                                  │
│  Layout:           Content:             Data Display:           │
│  ┌────────────┐    ┌────────────────┐   ┌──────────────────┐   │
│  │ HeroMinimal│    │TestimonialQuote│   │ TechCard         │   │
│  └────────────┘    └────────────────┘   │ ExpertiseBadge   │   │
│                    ┌────────────────┐   │ TechTags         │   │
│                    │ PatternVisual  │   └──────────────────┘   │
│                    └────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────────┐
│              Composable + Data Layer                           │
│  useSeo() — head tag injection via @unhead/vue                │
│  useBodyClass() — page-specific body class for CSS targeting  │
│  src/data/technologies.ts — structured static content         │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Layer |
|-----------|----------------|-------|
| `App.vue` | Shell — persists nav, footer, router outlet | Root |
| `NavBar.vue` | Navigation, mobile menu, theme toggle host | Shell |
| `FooterBar.vue` | Contact info, site links | Shell |
| `ThemeToggle.vue` | Dark/light state, localStorage, cross-tab sync | Shell |
| `HeroMinimal.vue` | Page-opening banner with h1 + subtitle + optional slot content | Layout |
| `TestimonialQuote.vue` | Blockquote with cite + context, primary/secondary variants | Content |
| `TechCard.vue` | Technology entry with name, level badge, summary, tags | Data display |
| `ExpertiseBadge.vue` | Proficiency level indicator (Deep/Working/Aware) | Atom |
| `TechTags.vue` | Inline tag list for tech associations | Atom |
| `PatternVisual.vue` | Brand graphic (three-bar logo animation) | Brand |
| Page components | Content for a single route — orchestrates sections and layout components | Page |

## Recommended Project Structure

The existing structure is correct and should not change. What follows is where new extractions belong:

```
src/
├── components/                  # Reusable components — always extracted here
│   ├── NavBar.vue               # existing
│   ├── FooterBar.vue            # existing
│   ├── ThemeToggle.vue          # existing
│   ├── HeroMinimal.vue          # existing
│   ├── TestimonialQuote.vue     # existing
│   ├── TechCard.vue             # existing
│   ├── ExpertiseBadge.vue       # existing
│   ├── TechTags.vue             # existing
│   ├── PatternVisual.vue        # existing
│   │
│   ├── FindingCard.vue          # to extract — NTSB-style project case study card
│   ├── SpecialtyCard.vue        # to extract — home page specialty grid item
│   ├── StatItem.vue             # to extract — career stat number + label
│   ├── InfluenceArticle.vue     # to extract (if used on >1 page, else inline)
│   └── FaqItem.vue              # to extract — question + answer disclosure pattern
│
├── pages/                       # One component per route — no sub-folders needed
│   ├── HomePage.vue
│   ├── PhilosophyPage.vue       # fully ported
│   ├── TechnologiesPage.vue     # fully ported
│   ├── FaqPage.vue              # TODO
│   ├── PortfolioPage.vue        # TODO
│   ├── ContactPage.vue          # partially done
│   ├── TestimonialsPage.vue     # TODO
│   ├── AccessibilityPage.vue    # TODO
│   └── ReviewPage.vue           # TODO
│
├── data/                        # Static content as typed TypeScript modules
│   ├── technologies.ts          # existing — tech category + card data
│   ├── faq.ts                   # to create — FAQ question/answer pairs
│   ├── testimonials.ts          # to create — testimonial records
│   └── portfolio.ts             # to create — project/case study data
│
├── composables/
│   ├── useSeo.ts                # existing
│   └── useBodyClass.ts          # existing
│
└── assets/css/
    └── main.css                 # design system — components consume, never replace
```

### Structure Rationale

- **`src/components/`:** Flat directory. No sub-folders for "layout" vs "atoms" because the project is too small for that taxonomy to help. PascalCase names self-document purpose.
- **`src/pages/`:** Flat directory, one file per route. No nesting. Pages are orchestrators, not components — they call composables, reference data, and compose section components.
- **`src/data/`:** Static TypeScript files for content that has structure (tech categories, testimonials, FAQs). This keeps page templates clean and makes content changes obvious. Mirrors the pattern established by `technologies.ts`.
- **No Vuex/Pinia:** Static portfolio. No shared mutable state needed. Theme state lives in `ThemeToggle.vue` + localStorage. SEO state is procedural via `useSeo`.

## Architectural Patterns

### Pattern 1: Extract to Name a Concept

**What:** Create a component when it has a conceptual name, even if used once. `<FindingCard>` names the NTSB-style case study pattern. `<StatItem>` names the career stat display. The name is the documentation.

**When to use:** When you can answer "what IS this thing?" with a noun. When the template without the extract reads like raw HTML instead of an outline.

**Trade-offs:** More files, but pages read like prose. Template becomes scannable: `<HeroMinimal>` → `<section class="specialties"><SpecialtyCard v-for>` → `<StatRow>` vs 300 lines of raw HTML.

**Example:**
```vue
<!-- Page template goal: reads like an outline -->
<template>
  <HeroMinimal title="Dan Novak" subtitle="Systems Architect">
    <TechPills :pills="techPills" />
    <PatternVisual />
  </HeroMinimal>

  <IntroSection />

  <section class="specialties">
    <SpecialtyCard v-for="item in specialties" :key="item.title" v-bind="item" />
  </section>

  <StatRow :stats="careerStats" />

  <section class="findings">
    <FindingCard v-for="project in featuredProjects" :key="project.id" v-bind="project" />
  </section>
</template>
```

### Pattern 2: Data in `src/data/`, Not Inline

**What:** Structured repeated content (tech categories, testimonials, FAQ items, project case studies) lives in typed TypeScript files in `src/data/`. Page templates import and render it. Page templates do not contain inline content arrays.

**When to use:** Any content that is repeated (multiple instances of the same structure) or that may change independently of the template layout.

**Trade-offs:** Adds a file per content type. Pays off because: TypeScript types enforce content completeness, content changes don't require touching template logic, Storybook stories can import the same data, future content additions are obvious.

**Example:**
```typescript
// src/data/testimonials.ts
export interface Testimonial {
  quote: string
  cite: string
  context?: string
  variant?: 'primary' | 'secondary'
}

export const featuredTestimonials: Testimonial[] = [
  { quote: '...', cite: '...', context: '...' },
]
```

```vue
<!-- TestimonialsPage.vue -->
<script setup lang="ts">
import { featuredTestimonials } from '@/data/testimonials'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
</script>

<template>
  <TestimonialQuote
    v-for="t in featuredTestimonials"
    :key="t.cite"
    v-bind="t"
  />
</template>
```

### Pattern 3: Props for Content, Slots for Structure

**What:** Use props for text content (strings, numbers). Use slots for markup or nested components that vary in layout. Use named slots sparingly — default slot is usually sufficient.

**When to use:** Props when the parent controls a value. Slot when the parent controls how something is arranged inside the component's layout frame.

**Trade-offs:** Too many props = component becomes a configuration knob, not a concept. Too many slots = component has no real shape, just wrapper markup. Balance: props carry data, slots carry composition.

**Existing example — HeroMinimal:**
```vue
<!-- Props for primary content, slot for extended/optional content -->
<HeroMinimal title="Technologies" subtitle="Production-proven expertise">
  <p class="hero-intro">Curated expertise spanning...</p>  <!-- slot -->
</HeroMinimal>
```

**When NOT to use a slot:** When the contained content is always structurally identical (use a prop instead). When extracting would require the parent to re-implement the child's internal layout.

### Pattern 4: Composable for Page Setup, Not for UI State

**What:** `useSeo()` and `useBodyClass()` are called at the top of every page's `<script setup>`. These are side-effect composables — they configure global context, not component state. UI state (menu open, theme) lives in the component that owns it.

**When to use:** For anything a page needs to declare about its context (SEO, body class, scroll position) rather than UI it renders.

**Trade-offs:** Keeps page templates declarative at the top. "Setup" concerns separated from "render" concerns.

## Data Flow

### Route Navigation

```
Browser URL change
    ↓
Vue Router matches path → src/router.ts
    ↓
Lazy-loads page component (e.g., PhilosophyPage.vue)
    ↓
Page component's <script setup> runs:
  - useBodyClass('page-philosophy')   → sets document.body class
  - useSeo({ title, description, path }) → @unhead injects <head> tags
    ↓
Template renders into <router-view> inside App.vue
    ↓
NavBar + FooterBar remain mounted (not re-rendered on navigation)
```

### Content Flow (Static)

```
src/data/[content].ts  (typed static arrays)
    ↓ import
Page component <script setup>
    ↓ pass as props
Section components (TechCard, TestimonialQuote, FindingCard, etc.)
    ↓ render
DOM
```

No state management library needed. No computed properties beyond simple filtering. Data flows in one direction: data file → page → component → DOM.

### Theme Flow

```
index.html inline script (before CSS loads)
    ↓ reads localStorage / prefers-color-scheme
    ↓ sets data-theme attribute on <html>
        ↓ (FOUC prevention complete)

User clicks ThemeToggle
    ↓
ThemeToggle.vue toggles isDark ref
    ↓ applyTheme() → document.documentElement.dataset.theme
    ↓ localStorage.setItem('theme', ...)
    ↓ storage event → cross-tab sync
        ↓
CSS custom properties respond to [data-theme="dark"] selectors
```

## Component Extraction Priority

This is the build order for the active phase. Based on what is most referenced across pages:

**First: Shared layout components used on multiple pages**
1. `HeroMinimal.vue` — already done. Ensure all TODO pages use it.
2. `TestimonialQuote.vue` — already done. Philosophy and Contact already use it.

**Second: Homepage-specific atoms that don't yet exist as components**
3. `FindingCard.vue` — NTSB case study card used in HomePage and PortfolioPage
4. `SpecialtyCard.vue` — specialty grid item in HomePage intro section
5. `StatItem.vue` — career stat (number + label) in HomePage stats section

**Third: FAQ page components**
6. `FaqItem.vue` — question + answer, likely a `<details>/<summary>` disclosure pattern

**Fourth: Content data files for remaining pages**
7. `src/data/testimonials.ts` — enables TestimonialsPage without inline arrays
8. `src/data/portfolio.ts` — enables PortfolioPage (case studies / NTSB findings)
9. `src/data/faq.ts` — enables FaqPage without inline arrays

**Defer or skip: components only used once with no obvious reuse**
- Highly page-specific sections (accessibility statement prose, review page layout) — keep inline in the page template unless there is a named concept worth extracting.

## Anti-Patterns

### Anti-Pattern 1: Wrapper-Only Components

**What people do:** Extract `<ContentSection>`, `<PageContainer>`, `<SectionWrapper>` — components that are just `<section class="content-section"><div class="container"><slot/></div></section>`.

**Why it's wrong:** These don't name concepts — they name HTML structure. Any developer can read `<section class="content-section">` directly. The wrapper adds a layer of indirection without adding clarity. It also fights the CSS: the `content-section` class is part of the design system and may carry visual styling that the component author needs to see to reason about spacing.

**Do this instead:** Keep structural boilerplate (`.container` divs, `content-section` class) directly in the page template. Only extract when the component can be named after a concept, not a structural role.

### Anti-Pattern 2: Generic Slot Sinks

**What people do:** Create a component that is essentially `<div :class="variant"><slot/></div>` and pass all content via slot. Every usage looks different. The component has no discernible shape.

**Why it's wrong:** The component doesn't enforce a pattern — it only provides a class. CSS can do that without a component.

**Do this instead:** Components should have a clear internal structure. `TestimonialQuote` always has a `<blockquote>`, a quote text `<p>`, and a `<footer>` with `<cite>`. That structure is the value. Slots are for optional extensions, not the primary content.

### Anti-Pattern 3: Putting Content Directly in Page Templates

**What people do:** Hard-code arrays of objects inline in the `<template>` or in `<script setup>` within the page component. FAQ items as `const faqs = [{ q: '...', a: '...' }]`. Project cards as inline objects.

**Why it's wrong:** Content changes (updating a testimonial quote, adding a new FAQ) require touching the page component file. Storybook stories for the page component become tightly coupled to that specific content.

**Do this instead:** Structured repeated content belongs in `src/data/`. Import it in the page. The page template handles layout; the data file handles content.

### Anti-Pattern 4: Duplicating `main#main-content` in Page Templates

**What people do:** Add `<main id="main-content" aria-label="Main content">` inside individual page components because some pages need it for content that follows a hero.

**Why it's wrong:** The skip-link in `App.vue` targets `#main-content`, and `App.vue` already wraps `<router-view>` in `<main id="main-content">`. Nesting a second `<main>` inside is invalid HTML and breaks accessibility.

**Exception observed:** `TechnologiesPage.vue` and `ContactPage.vue` both have a nested `<main>`. This needs audit — the inner `<main>` should be removed and replaced with a `<div>` wrapper if needed, or the outer wrapper in `App.vue` should be used as-is.

**Do this instead:** The outer `<main>` in `App.vue` is the landmark. Page templates should start with sections, not with another `<main>`.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| App.vue ↔ Page components | Router outlet — no props, no events | Pages are fully decoupled from App shell |
| Page ↔ Components | Props down — no emits needed (static content) | One-directional; no callbacks required |
| Page ↔ Data files | ES module import | Data files are not reactive; no watchers needed |
| Page ↔ Composables | Function call in script setup | useSeo and useBodyClass are fire-and-forget side effects |
| ThemeToggle ↔ CSS | `data-theme` attribute on `<html>` | CSS custom properties respond; no JS-in-CSS coupling |
| index.html script ↔ ThemeToggle | localStorage key `'theme'` | Must use same key — currently `'theme'` in both |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| @unhead/vue | useSeo composable wraps useHead() | No direct usage outside composable |
| Google Fonts | CSS @import in main.css | Network dependency; consider font-display: swap |
| Storybook | Co-located `.stories.ts` files | Component and page stories both implemented |

## Sources

- Direct codebase analysis of `src/components/`, `src/pages/`, `src/App.vue` (HIGH confidence)
- Observed patterns in PhilosophyPage.vue and TechnologiesPage.vue as canonical fully-ported examples (HIGH confidence)
- Vue 3 Composition API documentation — component design principles (HIGH confidence)
- Existing `src/data/technologies.ts` as proof-of-pattern for data extraction approach (HIGH confidence)

---
*Architecture research for: Pattern 158 Vue SPA — portfolio conversion*
*Researched: 2026-03-16*
