# Pitfalls Research

**Domain:** Vue 3 SPA conversion from 11ty static HTML portfolio site
**Researched:** 2026-03-16
**Confidence:** HIGH (based on codebase inspection + verified community patterns)

---

## Critical Pitfalls

### Pitfall 1: Raw `href` Links Surviving the Conversion

**What goes wrong:**
Pages copied from static HTML retain `<a href="/contact.html">` anchors instead of `<router-link to="/contact">`. These work fine on first load but cause full-page reloads — breaking the SPA contract — or 404s when the server has no `.html` files to serve. The current `HomePage.vue` already has this problem: `href="/contact.html"`, `href="/portfolio.html"`, `href="/exhibits/exhibit-j.html"` are all hardcoded HTML paths scattered through the template.

**Why it happens:**
Page content is copy-pasted from HTML source files as the fastest way to transfer content. Links come along for the ride and are easy to miss because they render correctly in development (Vite serves everything, the browser navigates). The failure only surfaces in production or on refresh.

**How to avoid:**
Establish a convention before starting page conversions: all internal links must use `<router-link to="...">` with clean paths (no `.html` extension). Add a search-and-replace step to the conversion checklist: `grep -r '\.html"' src/pages/` should return zero results before any page is marked done.

**Warning signs:**
- Page templates contain `.html"` in any link href
- Links work in dev but break on a hard refresh or when deployed to static hosting
- Browser navigation loses SPA scroll behavior (scrolls to top at full-page reload)

**Phase to address:**
Every page conversion phase — apply as a gate condition for marking a page complete.

---

### Pitfall 2: Non-Existent Routes Referenced in Content

**What goes wrong:**
The current `PhilosophyPage.vue` contains four `<router-link>` tags pointing to `/exhibits/exhibit-j`, `/exhibits/exhibit-e`, `/exhibits/exhibit-m`, and `/exhibits/exhibit-l` — routes that do not exist in `router.ts`. These are silently broken: Vue Router renders them, the user clicks, gets a blank or broken state, and there is no 404 page to catch it. This is already in production in the completed reference page.

**Why it happens:**
Content is ported faithfully from the source HTML (correct behavior), but the exhibit pages are deferred to a future scope. The link destinations are aspirational, not implemented. Without a catch-all 404 route, the failure is invisible during development.

**How to avoid:**
Two mitigations, both needed: (1) Add the catch-all 404 route immediately (`/:pathMatch(.*)*` → `NotFoundPage.vue`) so broken links surface visibly rather than silently. (2) During conversion, audit every `<router-link>` against the route list in `router.ts`. Links to pages not yet built should be disabled or replaced with plain text with a "coming soon" annotation in a code comment.

**Warning signs:**
- `<router-link>` destinations that are not in `router.ts`
- No catch-all route in `router.ts`
- No `NotFoundPage.vue` exists

**Phase to address:**
Foundation phase (before page conversions begin) — add the 404 route. Ongoing during each page conversion — audit links as part of the port checklist.

---

### Pitfall 3: Component Extraction at the Wrong Granularity

**What goes wrong:**
Two failure modes exist, both real risks for this project:

**Under-extraction:** Pages are just raw HTML inside `<template>` tags. Every section, every card, every repeated pattern stays as inline HTML. Templates become 200-300 line walls of markup. The stated goal — "templates should read like outlines" — is defeated. The site works but the codebase fails as a portfolio artifact demonstrating Vue component thinking.

**Over-extraction:** Every `<dt>/<dd>` pair becomes a component. Every `<article>` becomes a component. Page templates become so abstract they require navigating five files to understand one page. Components are created with no props, no reuse potential, and no cognitive load benefit — pure abstraction overhead.

**Why it happens:**
Under-extraction happens when developers are in "get content in fast" mode and defer refactoring. Over-extraction happens when developers confuse "component count" with "good architecture" — especially on a portfolio site where there's an implicit desire to demonstrate Vue skills.

**How to avoid:**
Apply the explicit extraction criterion from `PROJECT.md`: extract a component when it (a) is reused across pages, (b) names a concept that helps scan the template, or (c) enforces a design pattern that must stay consistent. If a block doesn't meet any of those three criteria, it stays inline. When in doubt: inline. The test is whether a developer can scan the page template and understand the page structure in 30 seconds.

Concrete examples of the right call:
- `<HeroMinimal>` — correct extraction (reused on every interior page, names a concept)
- `<TestimonialQuote>` — correct extraction (reused, enforces quote structure and variants)
- `<TechCard>` — correct extraction (reused in a v-for loop, enforces card layout)
- `<FindingCard>` — worth extracting (the three "FINDING N" cards in HomePage are identical structure)
- `<BrandElement>` — probably NOT worth extracting (only used in PhilosophyPage, inline `<dt>/<dd>` is already readable)

**Warning signs:**
- A page component `<script setup>` imports more than 6-8 components for a single page
- Component files have zero props (wrapper-only with no configurability)
- A template is unreadable without opening every imported component's source
- Conversely: page template files exceed ~100 lines of dense markup

**Phase to address:**
Architecture decision phase — settle the extraction criteria before starting page conversions, not after. Use `PhilosophyPage.vue` as the calibration example: it correctly uses `TestimonialQuote` for structured data and inline HTML for prose sections.

---

### Pitfall 4: Visual Parity Assumed, Not Verified

**What goes wrong:**
Pages are ported and marked "done" based on a quick visual eyeball in one browser at one viewport. CSS class names and structure match the original, so it looks right — until someone checks on mobile, in the other theme, or in a different browser and finds layout drift, text wrapping differences, or color token mismatches. The 11ty site is live and is the source of truth; any visual divergence makes the Vue version unshippable.

**Why it happens:**
Conversion work focuses on getting content in. Verification is deferred or assumed based on matching class names. The design token CSS system (`main.css`, 3955 lines) has cascade layers and custom properties — a single missing class or wrong nesting breaks rendering without an obvious error.

**How to avoid:**
For each page: side-by-side comparison against the live 11ty site at three viewports (mobile 375px, tablet 768px, desktop 1280px) and in both light and dark themes. Storybook stories for completed pages capture a known-good state and provide a regression reference. Do not mark a page complete until both viewports and both themes are verified.

For the `HomePage.vue` specifically: it has the most visual complexity (hero section, specialty cards, stats row, finding cards) and is the first impression — it needs the most rigorous parity check.

**Warning signs:**
- "Looks right to me" without specifying viewport and theme
- Storybook story for a page not yet created
- Missing `useBodyClass()` call in a page (body class drives page-specific CSS overrides)

**Phase to address:**
Each page conversion phase — parity verification is a gate condition, not an afterthought.

---

### Pitfall 5: Deployment 404s from History Mode Routing

**What goes wrong:**
`createWebHistory` (the current router configuration) produces clean URLs like `/philosophy` instead of `/#/philosophy`. When the Vue SPA replaces the 11ty site on its hosting environment, any direct URL visit or page refresh sends a request to the server for `/philosophy` — a path that doesn't correspond to any file. The server returns 404. This is invisible during development (Vite handles it) and invisible when navigating within the SPA (client-side routing handles it), but breaks completely on deploy.

**Why it happens:**
History mode is the correct choice for a production portfolio site (hash URLs look amateur), but it requires server-side configuration to redirect all requests to `index.html`. Developers test locally, everything works, they deploy, and hard refreshes start 404ing.

**How to avoid:**
Verify the hosting configuration before considering the migration complete. Netlify needs a `public/_redirects` file: `/* /index.html 200`. A `netlify.toml` file is the alternative. The existing `public/` directory is the right place for this file. Confirm with a hard refresh on a non-root route after deploying.

**Warning signs:**
- No `_redirects` or `netlify.toml` file in the repository
- Hard refresh on `/philosophy` returns a 404 or hosting-provider error page
- The router uses `createWebHistory` (correct!) but deployment config hasn't been updated to match

**Phase to address:**
Deployment readiness phase — address before the Vue site replaces the 11ty site.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline raw HTML in page templates without extracting repeated structures | Pages get content faster | Templates become 200+ line walls; refactoring is harder later when patterns are clear | Acceptable as a first pass if immediately followed by extraction in the same phase |
| Copy href links verbatim from HTML source | Faster copy-paste | Full-page reloads, 404s on deploy, breaks SPA navigation | Never — find-replace is trivial |
| Skip Storybook story update when refactoring a component | Saves 10-20 minutes | Stories drift from implementation; portfolio artifact loses its value | Never for components with existing stories |
| Leave placeholder `<router-link>` destinations for unbuilt pages | Content structure is preserved | Silent broken links confuse users and testing | Acceptable only if catch-all 404 route exists and a code comment marks the intent |
| Use `useBodyClass()` but skip verifying what CSS it activates | Works visually on first look | Page-specific CSS rules silently fail; dark mode or responsive variants break | Never — verify body class against `main.css` rules after each port |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Global CSS design system (`main.css`) + Vue scoped styles | Adding `<style scoped>` to page components that fight the global design system CSS | Page-level components should use the global CSS classes already defined. Only use scoped styles when a component genuinely encapsulates styling that has no global equivalent. When in doubt, add to `main.css` in the appropriate cascade layer. |
| `useSeo()` composable + page routes | Forgetting `useSeo()` in a new page, or copying the wrong title/description from another page | Every page component must have `useSeo()` as the first composable call. Storybook stories cannot verify this — check the `<head>` in a browser. |
| `useBodyClass()` composable + page-specific CSS | Page body class is applied but the CSS selector in `main.css` doesn't match, or the composable is skipped | After each page conversion, search `main.css` for the body class name to confirm the CSS rules exist and are being activated. |
| Vue Router `<router-link>` + external links | Using `<router-link>` for external URLs (`https://...`) — these route to the router and fail silently or navigate incorrectly | External links must remain `<a href="..." target="_blank" rel="noopener">`. Only internal paths use `<router-link>`. |
| Google Fonts external dependency | Fonts load from `googleapis.com` without a local fallback; if CDN is unavailable, layout shifts or breaks | If font metrics are critical to layout (which they are with a 3955-line design system), add `font-display: swap` and verify fallback font metrics don't break spacing. |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Monolithic CSS bundle on all pages | Large CSS file (3955 lines) delivered even for simple pages; slower Time to Interactive | This is already the architecture — don't make it worse by adding inline `<style>` blocks that duplicate tokens. Consider per-component scoped styles only for truly component-specific rules. | Already present at page 1; a portfolio site at this scale will not visibly suffer. |
| Lazy-loaded routes with no loading state | Route transitions show blank screen for 100-200ms while the chunk loads | Vue Router's lazy-loading is already in place. For a portfolio site at this scale, chunk sizes will be tiny — not a practical concern. | Would become visible at 500KB+ chunk sizes, not applicable here. |
| Storybook stories importing all page data | Storybook build becomes slow if stories import large data files (e.g., `technologies.ts`) | Already acceptable pattern. Keep data files lean. | Not a practical concern at this scale. |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Hardcoded `BASE_URL` and `SITE_NAME` in `useSeo.ts` | Canonical URLs and OG tags point to wrong domain if deployed to staging/preview URL | Move to `.env` variables: `VITE_SITE_URL`, `VITE_SITE_NAME`. Document in `.env.example`. |
| Hardcoded email in `FooterBar.vue` and `useSeo.ts` | Brittle; change in one place misses the other | Single source of truth: environment variable or a `site.config.ts` constants file. |
| No Content Security Policy for Google Fonts | External resource loaded without explicit permission policy | Add CSP header at hosting level (`X-Content-Type-Options`, `Content-Security-Policy: font-src 'self' fonts.gstatic.com`). |
| `v-html` if any future content uses it | XSS vector if source HTML is ever user-generated | Current pages use only static content — no `v-html` usage is the correct pattern. Flag any future use for review. |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No 404 page (confirmed missing from router) | Users who follow broken links, mistype URLs, or find old bookmarks see a blank/broken state with no recovery path | Add `NotFoundPage.vue` with `/:pathMatch(.*)*` catch-all route. Already called out in CONCERNS.md as missing. |
| Skip-to-content link exists but internal anchor `#main-content` is inconsistently placed | Screen reader and keyboard users tab to the skip link but the target doesn't exist or is on a different element | Every page with a `<main id="main-content">` must match the skip link target. Verify during each page conversion that `id="main-content"` is on the `<main>` element, not a `<section>`. |
| Theme toggle works but FOUC prevention script is separate from component | If the inline script in `index.html` diverges from `ThemeToggle.vue`'s logic, theme flickers on load | Treat the `index.html` early-detection script as load-bearing. Don't modify `ThemeToggle.vue`'s storage key or attribute name without updating the inline script. |
| SPA navigation does not scroll to top on route change | Users navigate to a new page and start mid-scroll | Vue Router's `scrollBehavior` option should return `{ top: 0 }` for new navigations. Verify this is configured in `router.ts`. |

---

## "Looks Done But Isn't" Checklist

- [ ] **Page conversion:** Often missing `useBodyClass()` — verify body class matches CSS selectors in `main.css`
- [ ] **Page conversion:** Often missing `useSeo()` — verify `<title>` and OG tags appear in browser devtools Network > Response headers
- [ ] **Internal links:** Often retains `.html` suffixes from source — `grep '\.html"' src/pages/PageName.vue` must return zero results
- [ ] **Router-link destinations:** Often points to unbuilt routes — verify every `<router-link to="...">` destination exists in `router.ts`
- [ ] **Dark mode parity:** Page is checked in light mode only — open theme toggle and verify dark mode classes activate correctly
- [ ] **Mobile parity:** Page checked at desktop width only — verify at 375px mobile viewport
- [ ] **Storybook story:** Component or page story not updated after refactor — verify story renders without error and reflects current props API
- [ ] **External links:** `<a href="https://...">` should have `rel="noopener"` and `target="_blank"` — verify all outbound links
- [ ] **Deployment:** History mode routing requires server redirect config — verify `public/_redirects` or equivalent exists before go-live

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Raw href links discovered after 5+ pages converted | LOW | Grep for `.html"` across all `src/pages/`, replace in bulk. 30 minutes max. |
| Component extraction strategy diverges mid-project (some pages flat HTML, some over-abstracted) | MEDIUM | Establish the extraction criteria (three-criterion rule above), audit each page against it, refactor incrementally. Worst case is 1-2 days. |
| Visual parity failures found late (after all pages converted) | MEDIUM-HIGH | Side-by-side audit of every page at all viewports/themes. Each page takes 30-60 minutes to diagnose and fix. Missed early, this is a week of work. |
| Deployment 404s on history mode routing discovered post-launch | LOW | Add `public/_redirects` file, redeploy. Under 30 minutes. But it's a visible outage window on a live portfolio site. |
| Storybook stories out of sync with refactored components | LOW per story | Update stories alongside component changes. If deferred, stories fail to render — fix story by story. |
| Missing 404 route discovered from user report | LOW | Create `NotFoundPage.vue`, add catch-all route. Under 2 hours including Storybook story. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Raw href links surviving conversion | Every page conversion phase | `grep -r '\.html"' src/pages/` returns zero matches |
| Non-existent route destinations | Foundation phase (add 404 route) + each page conversion | Every `<router-link to>` value matches a path in `router.ts` |
| Component extraction at wrong granularity | Architecture decision (before page conversions) | Templates read as outlines; no page template over 100 lines; no components with zero props and no reuse |
| Visual parity not verified | Each page conversion (gate condition) | Side-by-side with live 11ty site at 375px/768px/1280px, light and dark themes |
| Deployment 404s from history mode | Deployment readiness phase | `public/_redirects` exists; hard refresh on `/philosophy` returns 200 |
| Hardcoded configuration | Environment setup phase | `useSeo.ts` reads from `import.meta.env`; `.env.example` documents required variables |
| Missing body class / missing SEO composable | Each page conversion (checklist item) | Devtools show correct `<title>` and body class attribute |
| Storybook stories drifting | During component refactoring | `npm run storybook` shows no story errors; stories reflect current props API |

---

## Sources

- Codebase inspection: `src/pages/PhilosophyPage.vue`, `src/pages/HomePage.vue`, `src/pages/TechnologiesPage.vue`, `src/components/*` (direct analysis — HIGH confidence)
- `.planning/codebase/CONCERNS.md` — known issues audit from 2026-03-15 (HIGH confidence)
- `.planning/PROJECT.md` — extraction criteria, project constraints, key decisions (HIGH confidence)
- Vue Router official docs — history mode and server configuration requirements: https://router.vuejs.org/guide/essentials/history-mode.html (HIGH confidence)
- Vue.js official SFC documentation: https://vuejs.org/guide/scaling-up/sfc.html (HIGH confidence)
- Vue.js official style guide on scoped CSS: https://v3.vuejs.org/style-guide/ (HIGH confidence)
- Community: "How I Fixed 404 Errors in My Vue Project Deployed on Netlify" — https://dev.to/highflyer910/how-i-fixed-404-errors-in-my-vue-project-deployed-on-netlify-27k (MEDIUM confidence)
- Community: Nuxt SEO — SPA and SEO pitfalls: https://nuxtseo.com/learn-seo/vue/spa (MEDIUM confidence)
- Community: "7 Vue 3 Performance Pitfalls" — https://medium.com/simform-engineering/7-vue-3-performance-pitfalls-that-quietly-derail-your-app-33c7180d68d4 (MEDIUM confidence)

---

*Pitfalls research for: Vue 3 SPA conversion from 11ty static HTML portfolio site*
*Researched: 2026-03-16*
