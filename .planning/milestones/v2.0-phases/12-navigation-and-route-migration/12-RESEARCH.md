# Phase 12: Navigation and Route Migration - Research

**Researched:** 2026-03-31
**Domain:** Vue Router configuration, NavBar data, hardcoded route references
**Confidence:** HIGH

## Summary

Phase 12 is a straightforward find-and-replace migration across 10 source files, converting all references from `/portfolio` and `/testimonials` to `/case-files`. The CaseFilesPage.vue component already exists from Phase 11 and only needs route registration. Vue Router's built-in `redirect` property handles old URL preservation with zero custom code.

Every file requiring modification has been read and the exact line numbers identified. There are no ambiguous cases -- each change is a literal string replacement with clear before/after values. The test suite already covers the back-navigation link via a `[to="/portfolio"]` selector that must update to `[to="/case-files"]`.

**Primary recommendation:** Execute as a single atomic changeset -- route registration, redirects, NavBar, all hardcoded references, and test updates in one commit. The changes are tightly coupled (a partial update would leave broken navigation) and small enough to review as a unit.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Case Files page registers at `/case-files`. Matches page name, forensic brand tone, hyphenated per URL convention.
- D-02: Old routes `/portfolio` and `/testimonials` use Vue Router `redirect: '/case-files'` -- instant client-side redirect, no flash of old page content.
- D-03: Two menu entries (Portfolio + Field Reports) collapse to single "Case Files" entry.
- D-04: "Case Files" replaces Portfolio's position (5th slot). Field Reports entry removed. Final nav order: Home, Philosophy, FAQ, Technologies, Case Files, Contact.
- D-05: Hero secondary CTA text changes from "View My Work" to "View Case Files", pointing to `/case-files`.
- D-06: Testimonial section CTA changes from "View All Field Reports" to "View All Case Files", pointing to `/case-files`.
- D-07: ContactMethods.vue portfolio link updates both href and display text -- `href="/case-files"` with visible text `pattern158.solutions/case-files`.
- D-08: Both layout components (InvestigationReportLayout, EngineeringBriefLayout) update back-nav from "Back to Portfolio" to "Back to Case Files" pointing to `/case-files`.

### Claude's Discretion
- Storybook story updates (CtaButtons.stories.ts references to `/portfolio`) -- update to `/case-files`
- Test assertion updates (ExhibitDetailPage.test.ts `/portfolio` reference) -- update to match new route
- Any additional hardcoded route references discovered during implementation

### Deferred Ideas (OUT OF SCOPE)
- PortfolioPage.vue and TestimonialsPage.vue file deletion -- Phase 13 (pages still exist for redirect targets, actual deletion is Phase 13 scope)
- FlagshipCard.vue deletion -- Phase 13
- Storybook stories for CaseFilesPage -- REF-01 (v2.x)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | NavBar updated: two menu items collapsed to single Case Files entry | NavBar.vue lines 41-49 navLinks array -- replace two entries with one |
| NAV-02 | `/case-files` route added | router.ts -- add new route entry pointing to CaseFilesPage.vue |
| NAV-03 | `/portfolio` and `/testimonials` routes redirect to `/case-files` | router.ts -- change component imports to `redirect: '/case-files'` |
| NAV-04 | All hardcoded references to old routes updated (10+ files) | Full grep audit below identifies 14 references across 9 files |
| NAV-05 | Detail page back-navigation links updated to Case Files | EngineeringBriefLayout.vue:13, InvestigationReportLayout.vue:13 |
| CLN-04 | Homepage "View My Work" CTA updated to Case Files | HomeHero.vue:29-30 via CtaButtons props |
| CLN-05 | Homepage "View All Field Reports" link updated to Case Files | HomePage.vue:80 router-link |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue-router | ^4.5.0 | Client-side routing with `redirect` property | Already installed, `redirect` is built-in |
| vitest | 4.1.0 | Test runner for assertion updates | Already installed, project uses `npm test` |

No new libraries needed. This phase is purely configuration and string replacement.

## Architecture Patterns

### Vue Router Redirect Pattern
**What:** Vue Router's `redirect` property on a route record performs client-side redirect before rendering
**When to use:** When an old URL must forward to a new URL without rendering the old component

```typescript
// Source: Vue Router docs — redirect property on RouteRecordRaw
{ path: '/portfolio', redirect: '/case-files' },
{ path: '/testimonials', redirect: '/case-files' },
```

Key behavior: The redirect happens before any component is loaded. The old page components (PortfolioPage.vue, TestimonialsPage.vue) are NOT imported or rendered. This means those files can safely exist until Phase 13 cleanup without any runtime cost.

### Data-Driven NavBar Pattern
**What:** NavBar renders from a `navLinks` array, not hardcoded template
**When to use:** This project's established pattern -- all nav changes are array edits

```typescript
// Current (lines 41-49 of NavBar.vue):
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/philosophy', label: 'Philosophy' },
  { to: '/faq', label: 'FAQ' },
  { to: '/technologies', label: 'Technologies' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
  { to: '/testimonials', label: 'Field Reports' },
]

// After (per D-04 final nav order):
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/philosophy', label: 'Philosophy' },
  { to: '/faq', label: 'FAQ' },
  { to: '/technologies', label: 'Technologies' },
  { to: '/case-files', label: 'Case Files' },
  { to: '/contact', label: 'Contact' },
]
```

### Anti-Patterns to Avoid
- **Partial migration:** Do NOT update routes without updating all hardcoded references -- results in broken links at runtime
- **Deleting old page files:** PortfolioPage.vue and TestimonialsPage.vue must NOT be deleted -- that is Phase 13 scope. The redirects reference these paths but do not import the components (redirect short-circuits before component resolution)
- **Custom redirect middleware:** Do NOT build navigation guards for redirects -- Vue Router `redirect` property handles this natively

## Complete Reference Inventory

All occurrences of `/portfolio` and `/testimonials` route strings in `src/`:

| # | File | Line | Current Value | New Value | Decision |
|---|------|------|---------------|-----------|----------|
| 1 | `src/router.ts` | 8 | `path: '/portfolio', component: ...` | `path: '/portfolio', redirect: '/case-files'` | D-02 |
| 2 | `src/router.ts` | 10 | `path: '/testimonials', component: ...` | `path: '/testimonials', redirect: '/case-files'` | D-02 |
| 3 | `src/router.ts` | (new) | -- | `path: '/case-files', component: () => import('./pages/CaseFilesPage.vue')` | D-01 |
| 4 | `src/components/NavBar.vue` | 46 | `{ to: '/portfolio', label: 'Portfolio' }` | `{ to: '/case-files', label: 'Case Files' }` | D-03, D-04 |
| 5 | `src/components/NavBar.vue` | 48 | `{ to: '/testimonials', label: 'Field Reports' }` | (remove entire entry) | D-03 |
| 6 | `src/components/HomeHero.vue` | 29-30 | `secondary-label="View My Work" secondary-to="/portfolio"` | `secondary-label="View Case Files" secondary-to="/case-files"` | D-05 |
| 7 | `src/pages/HomePage.vue` | 80 | `<router-link to="/testimonials" ...>View All Field Reports</router-link>` | `<router-link to="/case-files" ...>View All Case Files</router-link>` | D-06 |
| 8 | `src/components/ContactMethods.vue` | 28-29 | `<strong>Portfolio</strong>` + `href="/portfolio"` + text `pattern158.solutions/portfolio` | `<strong>Case Files</strong>` + `href="/case-files"` + text `pattern158.solutions/case-files` | D-07 |
| 9 | `src/components/exhibit/EngineeringBriefLayout.vue` | 13 | `<router-link to="/portfolio">&larr; Back to Portfolio</router-link>` | `<router-link to="/case-files">&larr; Back to Case Files</router-link>` | D-08 |
| 10 | `src/components/exhibit/InvestigationReportLayout.vue` | 13 | `<router-link to="/portfolio">&larr; Back to Portfolio</router-link>` | `<router-link to="/case-files">&larr; Back to Case Files</router-link>` | D-08 |
| 11 | `src/pages/ExhibitDetailPage.test.ts` | 50-61 | Test name "Back to Portfolio" + selector `[to="/portfolio"]` | "Back to Case Files" + `[to="/case-files"]` | Discretion |
| 12 | `src/components/CtaButtons.stories.ts` | 17 | `secondaryTo: '/portfolio'` (Default story) | `secondaryTo: '/case-files'` | Discretion |
| 13 | `src/components/CtaButtons.stories.ts` | 24 | `primaryTo: '/portfolio'` (AlternateLabels story) | `primaryTo: '/case-files'` | Discretion |

**Files NOT modified (out of scope per deferred decisions):**
- `src/pages/PortfolioPage.vue` -- line 33 references `/portfolio` in its own useSeo path. Left as-is; page deleted in Phase 13.
- `src/pages/TestimonialsPage.vue` -- line 14 references `/testimonials` in its own useSeo path. Left as-is; page deleted in Phase 13.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Old URL redirects | Navigation guard middleware | Vue Router `redirect` property | Built-in, zero code, works with SSR/SSG |
| Route existence verification | Manual link checking | Automated tests + `vitest run` | Tests already assert link targets |

## Common Pitfalls

### Pitfall 1: Route Order in Router Array
**What goes wrong:** New `/case-files` route placed after the catch-all `/:pathMatch(.*)*` never matches
**Why it happens:** Vue Router matches routes in declaration order; catch-all swallows everything
**How to avoid:** Place `/case-files` route BEFORE the catch-all. Place redirect routes before the catch-all too.
**Warning signs:** Navigating to `/case-files` shows 404 page

### Pitfall 2: Redirect Routes Still Import Old Components
**What goes wrong:** Using `redirect` alongside `component` causes the old component to be bundled
**Why it happens:** Copy-paste from existing route without removing `component` property
**How to avoid:** Redirect routes should ONLY have `path` and `redirect` -- no `component` property
**Warning signs:** Bundle size doesn't decrease (though this is cosmetic for Phase 12; old files persist until Phase 13)

### Pitfall 3: Stale Test Selectors
**What goes wrong:** ExhibitDetailPage.test.ts still asserts `[to="/portfolio"]` after routes change, test fails
**Why it happens:** Tests forgotten during route migration
**How to avoid:** Update test selector to `[to="/case-files"]` and test description text simultaneously
**Warning signs:** `npm test` fails on ExhibitDetailPage tests

### Pitfall 4: ContactMethods.vue Uses `<a href>` Not `<router-link>`
**What goes wrong:** Treating ContactMethods like other files that use `<router-link to="...">`
**Why it happens:** Assuming all internal links use router-link
**How to avoid:** ContactMethods.vue uses a raw `<a href="/portfolio">` tag. Update the `href` attribute AND the visible text AND the `<strong>` label above it.
**Warning signs:** Contact page still shows "Portfolio" text or links to old URL

## Code Examples

### Router Configuration (after migration)
```typescript
// src/router.ts — complete file after Phase 12
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/HomePage.vue') },
  { path: '/philosophy', component: () => import('./pages/PhilosophyPage.vue') },
  { path: '/faq', component: () => import('./pages/FaqPage.vue') },
  { path: '/technologies', component: () => import('./pages/TechnologiesPage.vue') },
  { path: '/case-files', component: () => import('./pages/CaseFilesPage.vue') },
  { path: '/portfolio', redirect: '/case-files' },
  { path: '/testimonials', redirect: '/case-files' },
  { path: '/contact', component: () => import('./pages/ContactPage.vue') },
  { path: '/accessibility', component: () => import('./pages/AccessibilityPage.vue') },
  { path: '/review', component: () => import('./pages/ReviewPage.vue') },
  { path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
]
```

### Updated Test Assertion
```typescript
// src/pages/ExhibitDetailPage.test.ts — updated test
it('renders a Back to Case Files link', () => {
  vi.mocked(useRoute).mockReturnValue({
    params: { slug: 'exhibit-a' },
  } as any)

  const wrapper = mount(ExhibitDetailPage, {
    global: { stubs: { RouterLink: true, TechTags: true } },
  })

  const caseFilesLink = wrapper.find('[to="/case-files"]')
  expect(caseFilesLink.exists()).toBe(true)
})
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | vitest workspace or vite.config.ts |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | NavBar shows single "Case Files" entry | manual | Visual inspection or NavBar test | No NavBar test exists |
| NAV-02 | `/case-files` route registered | unit | `npx vitest run src/router.test.ts -t "case-files"` | Needs new test |
| NAV-03 | `/portfolio` and `/testimonials` redirect | unit | `npx vitest run src/router.test.ts -t "redirect"` | Needs new test |
| NAV-04 | All hardcoded references updated | unit | `npx vitest run` (existing tests fail if references stale) | Partial -- ExhibitDetailPage.test.ts covers back-nav |
| NAV-05 | Detail page back-nav says "Back to Case Files" | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | Yes -- needs selector update |
| CLN-04 | Homepage hero CTA points to Case Files | manual | Visual inspection | No HomeHero test exists |
| CLN-05 | Homepage testimonial CTA points to Case Files | manual | Visual inspection | No HomePage CTA test exists |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/router.test.ts` -- add tests for `/case-files` route existence and `/portfolio` + `/testimonials` redirect entries
- [ ] `src/pages/ExhibitDetailPage.test.ts` -- update existing "Back to Portfolio" test to assert `[to="/case-files"]`

No new test files needed. Existing test infrastructure covers the key assertions; only updates and additions to existing test files are required.

## Open Questions

None. All decisions are locked, all files are identified, and the changes are mechanical string replacements.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection of all 10 affected files (exact line numbers documented above)
- `grep` audit for `/portfolio` and `/testimonials` across entire `src/` directory -- no additional references found beyond the 13 listed
- Vue Router `redirect` property -- standard built-in feature, no version concerns

### Secondary (MEDIUM confidence)
- None needed -- this phase is purely internal codebase changes with no external dependencies

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, all changes use existing Vue Router features
- Architecture: HIGH - patterns already established in codebase, changes are mechanical
- Pitfalls: HIGH - exhaustive grep audit leaves no hidden references; route order is the only non-obvious concern

**Research date:** 2026-03-31
**Valid until:** Indefinite (internal codebase changes, no external dependency drift)
