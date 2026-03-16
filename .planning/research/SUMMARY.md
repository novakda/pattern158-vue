# Project Research Summary

**Project:** Pattern 158 Vue — Portfolio Site Conversion
**Domain:** Vue 3 SPA conversion from 11ty static HTML; senior engineer portfolio
**Researched:** 2026-03-16
**Confidence:** HIGH

## Executive Summary

This is a conversion project, not a greenfield build. The 11ty site at pattern158.solutions is live and published, and the Vue 3 scaffold (Vue 3 + TypeScript 5.7 + Vite 6 + Vue Router 4 + Storybook 10 + Vitest 4) is already in place and correct. The goal is feature parity: port all 9 pages, extract Vue components to demonstrate composition thinking, and produce a codebase that serves as a portfolio artifact for technical reviewers as much as it serves visitors reading the site. Two pages are fully ported (PhilosophyPage, TechnologiesPage); one is partial (ContactPage); six remain as TODO stubs.

The recommended approach is port-first, extract-second. Content must be in the page before component APIs can be designed correctly. The extraction criterion is deliberate: extract when a component (a) is reused across pages, (b) names a concept that makes the template scannable, or (c) enforces a design pattern that must stay consistent. Everything else stays inline. The target is page templates that read like outlines in under 30 seconds — this is the core design philosophy and the primary differentiator for technical reviewers.

The top risks are all well-defined and avoidable. Raw `<a href="*.html">` links surviving copy-paste from the HTML source is the most pervasive ongoing risk and must be a gate condition on every page. History-mode routing requires a server-side `_redirects` configuration before the Vue site can replace the 11ty site on its hosting environment. A missing 404 route is already a known gap and creates silent broken-link failures from the four exhibit links in PhilosophyPage. All three are low-effort fixes — the risk is forgetting them, not solving them.

---

## Key Findings

### Recommended Stack

The full stack is installed and verified. The one missing piece is `vitest-browser-vue` (the official Vitest-maintained package for rendering Vue components in real browser mode), which is not yet in `package.json`. All other packages — Vitest 4, @vitest/browser-playwright, Storybook 10, @storybook/addon-vitest, @storybook/addon-a11y — are confirmed correct and version-compatible.

The deliberate exclusions are as important as the inclusions: no Pinia (no shared mutable state exists), no Nuxt (SSR/SSG is out of scope), no CSS-in-JS utilities (they conflict with the 3955-line CSS token system), no Jest (Vitest shares the Vite pipeline and is dramatically faster), and no jsdom/happy-dom for component tests (simulation misses real browser behavior).

**Core technologies:**
- Vue 3 + `<script setup lang="ts">`: UI framework — Composition API is the current standard; Options API is explicitly legacy
- TypeScript 5.7 (strict mode): Type safety — catches prop contract violations at compile time; `defineProps<{}>()` generic form is the portfolio-quality pattern
- Vite 6: Build tool — near-instant HMR for Vue SFCs; ESM-native; lazy-loaded routes via dynamic import reduce initial bundle
- Vue Router 4 (`createWebHistory`): Client-side routing — clean URLs; requires server redirect config on deploy
- @unhead/vue: Head management — reactive `<title>`, meta, OG tags, canonical URLs per-route via `useSeo` composable
- Storybook 10 + @storybook/vue3-vite: Component workshop — ESM-only, shares Vite config; stories are portfolio artifacts and test doubles
- Vitest 4 + @vitest/browser-playwright: Testing — real Chromium for component tests; stories with play functions become tests via @storybook/addon-vitest
- **vitest-browser-vue** (NOT YET INSTALLED): Required for rendering Vue components in Vitest browser mode — `npm install -D vitest-browser-vue`

### Expected Features

This is a conversion project. "Features" are the existing 11ty site's content and structure, implemented correctly in Vue. The question is not what to build but what to port, what to extract, and what to defer.

**Must have (table stakes — v1 conversion complete):**
- All 9 pages fully ported with complete content — no TODO stubs remain
- HeroMinimal component adopted consistently on all inner pages (already exists; ContactPage uses it; 5 remaining pages use raw `<section class="hero-minimal">` and need the import + tag swap during port)
- All internal `<a href>` links converted to `<router-link to="...">` with no `.html` extensions
- Component extraction for template readability — pages read as outlines, not 200-line HTML walls
- TypeScript props on all extracted components (`defineProps<{}>()` generic form)
- Storybook stories current for all components and their variants
- Visual parity with live 11ty site at 375px/768px/1280px, light and dark themes
- Accessibility audit passes — skip link, ARIA labels, semantic HTML, color contrast

**Should have (signals Vue mastery to technical reviewers):**
- Named concepts extracted as components: `FindingCard`, `SpecialtyCard`, `StatItem`, `FaqItem`
- Structured content in `src/data/` TypeScript files: `testimonials.ts`, `portfolio.ts`, `faq.ts`
- Composable usage consistent and documented via Storybook

**Defer to v2+:**
- Page transition animations (scope creep; accessibility risk with `prefers-reduced-motion`)
- Vitest unit tests for composables (valuable but not required for conversion milestone)
- TypeScript data files for all content (only if content maintenance burden justifies it)
- Visual regression via Chromatic (Chromatic addon already installed; activate if CI is added)

**Deliberately excluded (anti-features):**
- Pinia state management — no shared reactive state exists in a static portfolio
- Nuxt SSR/SSG — architectural pivot, out of scope
- Contact form with server-side submission — not in the 11ty site
- Blog/article system — scope creep
- WebGL hero, scroll parallax, particle backgrounds — over-engineering; hurts accessibility

### Architecture Approach

The architecture is a four-layer SPA: browser entry (index.html with FOUC-prevention script) → App shell (App.vue with NavBar, router-view, FooterBar) → Page layer (one component per route, lazy-loaded) → Component + Composable layer (reusable atoms, layout components, data files, side-effect composables). Data flows in one direction: `src/data/*.ts` → page component → section components → DOM. No state management library is needed or appropriate. Two pages (PhilosophyPage, TechnologiesPage) serve as the canonical reference implementations.

**Major components:**
1. **App.vue** — Shell that persists nav and footer across all routes; wraps `<router-view>` in `<main id="main-content">`
2. **Page components** — Route-level orchestrators: call `useSeo()`, call `useBodyClass()`, import data files, compose section components
3. **HeroMinimal, TestimonialQuote, TechCard, ExpertiseBadge** — Existing reusable components with typed props
4. **FindingCard, SpecialtyCard, StatItem, FaqItem** — Components to extract; currently inline HTML in page templates
5. **src/data/*.ts** — Typed static content modules (technologies.ts exists; testimonials.ts, portfolio.ts, faq.ts to create)
6. **useSeo, useBodyClass** — Side-effect composables called at top of every page's `<script setup>`

**Key known bug:** `TechnologiesPage.vue` and `ContactPage.vue` both have a nested `<main>` inside App.vue's outer `<main id="main-content">`. Nested `<main>` is invalid HTML and breaks accessibility. Inner `<main>` tags must be replaced with `<div>` wrappers.

### Critical Pitfalls

1. **Raw `href` links surviving copy-paste** — `HomePage.vue` already has `href="/contact.html"`, `href="/portfolio.html"` etc. Apply as a gate condition on every page: `grep '\.html"' src/pages/PageName.vue` must return zero results before marking a page done.

2. **Non-existent router destinations** — `PhilosophyPage.vue` already has four `<router-link>` tags pointing to exhibit routes that don't exist in `router.ts`. No catch-all 404 route exists, so failures are silent. Add `NotFoundPage.vue` with `/:pathMatch(.*)*` catch-all in the foundation phase, before any page conversions.

3. **Component extraction at wrong granularity** — Two failure modes: under-extraction (200-line HTML walls; fails as a portfolio artifact) and over-extraction (every `<dt>/<dd>` becomes a component; navigation overhead exceeds clarity benefit). The three-criterion rule governs: extract when (a) reused, (b) names a concept, or (c) enforces a pattern. The test is whether the page template reads as an outline in 30 seconds.

4. **Visual parity assumed, not verified** — The 3955-line CSS cascade layer system means a missing class or wrong nesting can break rendering without an obvious error. Gate condition: side-by-side comparison with the live 11ty site at three viewports and both themes before marking any page done.

5. **Deployment 404s from history mode routing** — `createWebHistory` (correctly used) requires server-side redirect config. No `public/_redirects` or `netlify.toml` exists yet. Must be in place before the Vue site replaces the 11ty site. Add it in the deployment readiness phase.

---

## Implications for Roadmap

Based on the combined research, the conversion has clear dependency ordering: infrastructure fixes must precede page conversions, page content must exist before components can be extracted from it, and deployment config must be verified before go-live.

### Phase 1: Foundation Fixes

**Rationale:** Three known defects exist in the current codebase that will compound during conversion if not fixed first: missing 404 route, nested `<main>` invalid HTML in two pages, and missing `vitest-browser-vue` dependency. Fix these before adding more pages.

**Delivers:** Clean baseline — no silent broken links, no accessibility violations in existing pages, complete testing stack

**Addresses:**
- Pitfall: Non-existent router destinations (add `NotFoundPage.vue` + catch-all route)
- Pitfall: Nested `<main>` in `TechnologiesPage.vue` and `ContactPage.vue` (replace with `<div>`)
- Stack gap: Install `vitest-browser-vue`
- Architecture: Confirm `router.ts` has `scrollBehavior: { top: 0 }` for new navigations

**Research flags:** None — all well-documented, straightforward fixes.

---

### Phase 2: Homepage Completion + Component Extraction

**Rationale:** `HomePage.vue` is the most visible page, has the most complex layout, and already contains the inline HTML that needs extracting into `FindingCard`, `SpecialtyCard`, and `StatItem` components. It also has the stale `.html` href links. Completing it establishes the extraction pattern for all subsequent pages.

**Delivers:** Fully ported and componentized `HomePage.vue`; three new reusable components; Storybook stories for each; `router-link` correctness confirmed

**Addresses:**
- Feature: All pages ported (completes one of seven remaining)
- Feature: Component extraction (`FindingCard`, `SpecialtyCard`, `StatItem`)
- Pitfall: Raw href links — gate condition applied
- Pitfall: Visual parity verification at three viewports and both themes

**Uses:** `src/data/` pattern (may extract to data files if homepage content is repetitive enough); TypeScript props on all extracted components

**Research flags:** None — `PhilosophyPage.vue` and `TechnologiesPage.vue` serve as direct reference implementations.

---

### Phase 3: Content Pages — Port Remaining 5 TODO Pages

**Rationale:** With the extraction pattern established via Homepage, the five remaining TODO pages (FaqPage, PortfolioPage, TestimonialsPage, AccessibilityPage, ReviewPage) follow the same sequence: port content, adopt HeroMinimal, convert links to router-link, verify parity, write stories. FaqPage and TestimonialsPage have the most structural repetition and will benefit from data file extraction.

**Delivers:** All 9 pages fully ported; visual parity confirmed; HeroMinimal used consistently; no `.html` hrefs remaining

**Addresses:**
- Feature: All 9 pages ported with content (the primary conversion milestone)
- Feature: HeroMinimal adoption on all inner pages (quick win per page)
- Architecture: `src/data/faq.ts`, `src/data/testimonials.ts`, `src/data/portfolio.ts` created

**New components to extract during this phase:**
- `FaqItem.vue` — `<details>/<summary>` disclosure pattern (FaqPage)
- `FindingCard.vue` reused on PortfolioPage
- No extraction needed on AccessibilityPage or ReviewPage (prose-heavy; inline HTML is readable)

**Research flags:** None — pattern is established. Apply the three-criterion extraction rule per page.

---

### Phase 4: Quality Pass + Deployment Readiness

**Rationale:** With all pages ported, a systematic quality pass catches the "looks done but isn't" issues before go-live. Deployment config must be in place before the Vue site replaces the 11ty site.

**Delivers:** Deployment-ready Vue site that can replace the live 11ty site

**Addresses:**
- Pitfall: Deployment 404s — add `public/_redirects` (Netlify: `/* /index.html 200`) or `netlify.toml`
- Post-launch polish: `<script setup>` audit for any accidental Options API
- Post-launch polish: Final `router-link` audit across all pages
- Security: Move hardcoded `BASE_URL` and email in `useSeo.ts` to `.env` variables; create `.env.example`
- UX: External links audit — `rel="noopener" target="_blank"` on all outbound `<a>` tags

**Research flags:** Deployment hosting configuration — if the site is not on Netlify, the redirect mechanism differs (Apache `.htaccess`, nginx `try_files`, Cloudflare Pages `_redirects`). Confirm hosting target before this phase.

---

### Phase Ordering Rationale

- **Foundation before content:** The 404 route and nested `<main>` fixes are load-bearing for accessibility and correctness. Shipping more pages before fixing these makes the problem worse.
- **Homepage before other pages:** It has the highest visual complexity and most components to extract. Completing it calibrates the extraction pattern for the remaining five pages.
- **Port-first, extract-second per page:** You cannot design `FindingCard`'s slot API correctly until the full finding card HTML is in front of you. This ordering is the key dependency from FEATURES.md.
- **Deployment config as its own phase:** It is easy to forget and creates a visible outage window on a live portfolio site if missed.

### Research Flags

Phases with well-documented patterns (no additional research needed):
- **Phase 1 (Foundation Fixes):** All fixes are unambiguous — add a route, remove a tag, install a package
- **Phase 2 (Homepage):** `PhilosophyPage.vue` and `TechnologiesPage.vue` are direct reference implementations
- **Phase 3 (Content Pages):** Repeats established pattern; `technologies.ts` is the reference for data file structure

Phases that may need targeted investigation:
- **Phase 4 (Deployment):** Confirm hosting provider before writing redirect config. If Netlify, `public/_redirects` is straightforward. If another provider, the mechanism differs.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack non-negotiable and already installed; version compatibility verified against official release posts; single gap (vitest-browser-vue) is clear |
| Features | HIGH | Derived from direct codebase inspection + existing live site as source of truth; no ambiguity about what needs to be ported |
| Architecture | HIGH | Two fully-ported pages serve as proven reference implementations; patterns are already working in production code |
| Pitfalls | HIGH | Most pitfalls sourced from direct codebase inspection of existing bugs (not speculative); raw href links and nested `<main>` are already present in current code |

**Overall confidence:** HIGH

### Gaps to Address

- **Hosting environment:** `PITFALLS.md` identifies that history-mode redirect config is hosting-specific. The correct file format (Netlify `_redirects` vs. other providers) needs confirmation before Phase 4. Netlify is assumed based on the site being a static SPA portfolio, but not confirmed in any research file.
- **Exhibit routes:** `PhilosophyPage.vue` has four links to `/exhibits/exhibit-j`, `/exhibits/exhibit-e`, `/exhibits/exhibit-m`, `/exhibits/exhibit-l` that point to non-existent routes. Whether these exhibit pages are ever planned is not addressed in research. During Phase 4, make a decision: either build stub exhibit pages, disable the links, or add a code comment marking them as future scope.
- **ContactPage partial state:** ContactPage is "partially done" per `ARCHITECTURE.md`. The extent of what's missing is not quantified in research. Treat it as a full port during Phase 3.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis — `src/pages/`, `src/components/`, `src/App.vue`, `src/data/technologies.ts` (codebase inspection)
- `.planning/PROJECT.md` — extraction criteria, project constraints, key decisions
- `.planning/codebase/CONCERNS.md` — known issues audit from 2026-03-15
- Storybook 10 release blog — ESM-only, Vitest 4 support, Vue 3 portable stories
- Vitest 4.0 announcement — browser mode stable, provider packages
- vitest-browser-vue npm/GitHub — v2.1.0 requires Vitest 4+, official Vitest package
- Vue Router official docs — history mode and server configuration requirements
- Vue.js official testing guide — Vitest + vitest-browser-vue as recommended stack

### Secondary (MEDIUM confidence)
- Vue Best Practices in 2026 — One Horizon (third-party blog)
- Good practices and Design Patterns for Vue Composables — DEV Community
- "How I Fixed 404 Errors in My Vue Project Deployed on Netlify" — dev.to
- Nuxt SEO — SPA and SEO pitfalls — nuxtseo.com

---
*Research completed: 2026-03-16*
*Ready for roadmap: yes*
