# Phase 4: Exhibit Detail Pages + Data Fix - Research

**Researched:** 2026-03-17
**Domain:** Vue 3 dynamic routing, data model extension, page-level SFC composition
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Single dynamic route `/exhibits/:slug`** registered in router.ts before the catch-all
- **Custom header for exhibits** — not HeroMinimal. Exhibit pages surface client/date/label prominently as a custom header treatment
- **Back to Portfolio link at the top of the page** — single link, no breadcrumbs, no prev/next
- **If slug doesn't match any exhibit: render NotFoundPage** — use `router.replace({ name: 'not-found' })` or conditional render pattern
- **11ty source is the content source of truth** — researcher must read each exhibit URL to determine additional content
- **Exhibit O must be added** — 11ty source has `/exhibits/exhibit-o.html`; port data into `exhibits.ts`; target is 15 entries (A–O)
- **ExhibitDetailPage reads slug param** — looks up exhibit by matching `exhibitLink` path in `exhibits.ts`

### Claude's Discretion
- SEO setup on ExhibitDetailPage (useSeo call with exhibit title/description)
- Exhibit O's `isDetailExhibit` flag and `investigationReport` flag — set based on 11ty content
- Data model extension approach when extra content doesn't fit current Exhibit interface
- Storybook story structure for ExhibitDetailPage (required by success criteria)
- `useBodyClass` body class name for exhibit detail pages

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-03 | Port PortfolioPage from 11ty with complete content | Gap closure: all exhibit router-links from ExhibitCard/FlagshipCard must resolve to real pages, not 404. All 15 `/exhibits/exhibit-*` routes must be registered. |
| PAGE-05 | Port TestimonialsPage from 11ty with complete content | Gap closure: the "Exhibit detail navigation" E2E flow (navigating from portfolio to an exhibit page) must complete. ExhibitDetailPage is the missing destination. |
</phase_requirements>

---

## Summary

Phase 4 is a focused gap-closure phase with three interlocking deliverables: (1) register a single dynamic `/exhibits/:slug` route, (2) add the missing Exhibit O entry to `exhibits.ts`, and (3) implement `ExhibitDetailPage.vue` that renders exhibit content from the data layer.

The 11ty source reveals that full exhibit pages are rich investigation reports — timelines, numbered findings, evidence cards, sidebar metadata. However, not all of this richness needs to be ported into the Vue data model for Phase 4. The current `Exhibit` interface already captures the core fields. The ExhibitDetailPage can render what `exhibits.ts` provides at minimum (label, client, date, title, quotes, contextText, resolutionTable, impactTags) and the page layout provides the investigation report framing. Optional extended fields can be added to the interface if the Exhibit O content demands them.

The route architecture is simple: Vue Router's dynamic segment `/:slug` is resolved by matching `route.params.slug` against the last path segment of each exhibit's `exhibitLink` field (e.g., `/exhibits/exhibit-a` → `exhibit-a`). No slug in the data array triggers a redirect to `not-found`.

**Primary recommendation:** Implement ExhibitDetailPage as a self-contained page SFC that reads the slug param, looks up the exhibit, renders a custom exhibit header (label + client + date), then renders the content fields from the Exhibit interface in investigation-report style. Add Exhibit O to exhibits.ts with `isDetailExhibit: true` and `investigationReport: false` (it is a field report without an investigation report format). Register the route before the catch-all.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue Router | Already installed | Dynamic route param (`/exhibits/:slug`) | The project's existing router; `useRoute()` composable for param access |
| `useRoute` | Vue Router composable | Read `route.params.slug` in script setup | Standard Vue Router Composition API pattern |
| `exhibits.ts` | Project data layer | Single source of truth for all 15 exhibits | Already typed; all ExhibitCard/FlagshipCard links reference `exhibitLink` from this file |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `useSeo.ts` | Project composable | Set `<title>` and OG tags per exhibit | Apply per established pattern on all page SFCs |
| `useBodyClass.ts` | Project composable | Add body class for per-page CSS scoping | Apply per established pattern |
| `TechTags.vue` | Project component | Render `impactTags` as styled pills | Already used in ExhibitCard; reuse for ExhibitDetailPage |
| `@storybook/vue3-vite` | Already installed | Storybook story for ExhibitDetailPage | Required by phase success criteria |

### No New Dependencies
No new npm packages are needed. All required tools are already installed in the project.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── data/
│   └── exhibits.ts          # Add Exhibit O entry here; optionally extend Exhibit interface
├── pages/
│   ├── ExhibitDetailPage.vue        # New: dynamic exhibit page
│   └── ExhibitDetailPage.stories.ts # New: Storybook story
└── router.ts                # Add /exhibits/:slug route
```

### Pattern 1: Dynamic Route Registration (Router)
**What:** A single parameterized route replaces the need for 15 static routes.
**When to use:** Any time a page renders variable content keyed by a URL segment.
**Implementation:**

```typescript
// src/router.ts — insert BEFORE the catch-all route
{ path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
{ path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
```

Order is critical. The catch-all currently sits last; the dynamic exhibit route must be inserted above it.

### Pattern 2: Slug-to-Data Lookup (ExhibitDetailPage)
**What:** Read the route param, derive the full path, find the matching exhibit entry.
**When to use:** Any page driven by a URL segment that keys into a local data array.

```typescript
// src/pages/ExhibitDetailPage.vue — script setup
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { exhibits } from '@/data/exhibits'

const route = useRoute()
const router = useRouter()

const exhibit = computed(() => {
  const slug = route.params.slug as string
  return exhibits.find(e => e.exhibitLink === `/exhibits/${slug}`)
})

// If slug doesn't resolve, redirect to not-found
if (!exhibit.value) {
  router.replace({ name: 'not-found' })
}
```

The lookup uses `exhibitLink` already present on every Exhibit entry. No slug normalization needed beyond prefixing `/exhibits/`.

### Pattern 3: Custom Exhibit Header (No HeroMinimal)
**What:** A dedicated header section that surfaces exhibit provenance markers (label, client, date) prominently.
**When to use:** Exhibit pages only — distinct from HeroMinimal used on other inner pages.

The 11ty source for Exhibit A renders a hero with: exhibit title as h1, classification badge (e.g., "Field Report · Exhibit A · Electric Boat"), and a metadata block with client, location, period, investigator. The Vue implementation should render at minimum: exhibit label, client, date, and title as h1 — all data already in the Exhibit interface.

```html
<!-- Example header structure — CSS class names to align with design token system -->
<section class="exhibit-detail-header">
  <div class="container">
    <span class="exhibit-back-nav">
      <router-link to="/portfolio">&larr; Back to Portfolio</router-link>
    </span>
    <div class="exhibit-meta-header">
      <span class="exhibit-label">{{ exhibit.label }}</span>
      <span class="exhibit-client">{{ exhibit.client }}</span>
      <span class="exhibit-date">{{ exhibit.date }}</span>
    </div>
    <h1 class="exhibit-detail-title">{{ exhibit.title }}</h1>
  </div>
</section>
```

The back-nav link at the top satisfies the locked decision: "Back to Portfolio link at the top of the page."

### Pattern 4: Conditional Rendering for Optional Fields
**What:** Exhibit interface fields are largely optional; the template guards each section.
**When to use:** Every optional field on Exhibit.

```html
<!-- quotes section -->
<div v-if="exhibit.quotes?.length" class="exhibit-quotes">
  <blockquote v-for="(q, i) in exhibit.quotes" :key="i">
    {{ q.text }}
    <footer>
      <span v-if="q.attribution">{{ q.attribution }}</span>
      <span v-if="q.role" class="role">{{ q.role }}</span>
    </footer>
  </blockquote>
</div>

<!-- context section -->
<div v-if="exhibit.contextText" class="exhibit-context">
  <h2>{{ exhibit.contextHeading }}</h2>
  <p>{{ exhibit.contextText }}</p>
</div>

<!-- resolution table -->
<table v-if="exhibit.resolutionTable?.length" class="resolution-table">
  ...
</table>
```

### Anti-Patterns to Avoid
- **Static routes per exhibit:** Never add 15 individual route entries. One dynamic route covers all of them.
- **Slug from exhibit label:** Don't derive slug from the `label` field ("Exhibit A" → "exhibit-a"). Use `exhibitLink` directly — it already contains the canonical path.
- **HeroMinimal on ExhibitDetailPage:** The decision is locked — exhibit pages use a custom header, not HeroMinimal.
- **Breadcrumbs or prev/next:** Locked out of scope. Back to Portfolio is the only navigation affordance.
- **v-html for any content field:** Existing project convention is no v-html. All text fields in Exhibit interface are plain strings.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 404 handling for unknown slug | Custom error component | `router.replace({ name: 'not-found' })` redirecting to existing NotFoundPage | NotFoundPage already exists with proper useSeo/useBodyClass setup |
| Slug normalization | String manipulation utilities | Direct `exhibitLink` path comparison — already canonical | `exhibitLink` is already `/exhibits/exhibit-a` format; just prefix the param |
| Route guard for missing exhibit | Navigation guard in router | Computed + conditional redirect in script setup | Simpler, co-located with the page, consistent with Vue 3 Composition API patterns |

---

## Exhibit O Data (Ported from 11ty Source)

**Source:** `https://raw.githubusercontent.com/novakda/pattern158.solutions/deploy/20260315-feat-auto-generate-deploy-branch-names-f/exhibits/exhibit-o.html`

Exhibit O content extracted from the 11ty source:

```typescript
{
  label: 'Exhibit O',
  client: 'GP Strategies (Internal Product)',
  date: '2024\u20132025',
  title: 'ContentAIQ \u2014 The Integration Thread: Pattern Recognition Across Three Projects',
  contextHeading: 'Context',
  contextText: 'Integration expertise forms the connective thread across three GP Strategies projects spanning federated LMS facades, webhook sync pipelines, and AI product interfaces. The progression demonstrates pattern recognition across thirteen years, from CSBB Dispatch (2011) through modern multitenant SaaS architecture. All three projects required coordinating across system boundaries and debugging failures spanning multiple platforms.',
  impactTags: ['AI Product Frontend', 'Multitenant Architecture', 'Design Translation', 'Integration Patterns', 'Pattern Recognition', 'Cross-System Coordination', 'Federated Systems'],
  exhibitLink: '/exhibits/exhibit-o',
  isDetailExhibit: true,
  investigationReport: false,
}
```

**Rationale for flags:**
- `isDetailExhibit: true` — The 11ty page has a full field report structure with findings table, technologies table, and narrative sections. It is a substantive investigation exhibit.
- `investigationReport: false` — The page is classified as a "Field Report" (same as other exhibits), not an "Investigation Report." The `investigationReport` flag in the existing data correlates with entries that use the NTSB investigation framing (Exhibits J, K, L, M, N). Exhibit O does not.

**Extended fields consideration:** The 11ty Exhibit O page includes a multi-column technologies comparison table (BP Learning Platform / AICPA Bridge Adapter / ContentAIQ) and a findings table (F-01 through F-05). These are richer than what the current Exhibit interface captures. For Phase 4 minimum: the contextText above captures the summary. The full technologies comparison table could be added as an optional `technologiesTable` field or rendered as a static inline table on the detail page if the planner chooses to port deeper content. Claude's discretion per CONTEXT.md.

---

## 11ty Content Structure Analysis

### What the 11ty detail pages contain
Based on reading exhibit-a.html and exhibit-j.html:

| Section | Present in 11ty | In current Exhibit interface | Action |
|---------|----------------|------------------------------|--------|
| Hero (title, label, classification badge) | Yes | Partial (label, title) | Render from existing fields + classification string |
| Client/Period/Industry metadata | Yes | `client`, `date` | Render from existing fields |
| Background narrative | Yes | `contextText` (partial) | Current field captures this |
| Quotes / evidence cards | Yes | `quotes[]` | Render from existing field |
| Resolution / findings table | Yes | `resolutionTable[]` | Render from existing field |
| Timeline (dated events) | Yes — rich | No | Out of scope for Phase 4 minimum |
| Skills demonstrated list | Yes | `impactTags` (equivalent) | Render impactTags |
| Related exhibits grid | Yes | No | Out of scope for Phase 4 minimum |
| Technologies list | Yes | No (part of impactTags) | Out of scope for Phase 4 minimum |
| "Back to Field Reports" nav | Yes | N/A | Implement as "Back to Portfolio" per locked decision |

**Phase 4 scope:** The ExhibitDetailPage renders the fields already in `exhibits.ts`. Timeline entries, related exhibits grid, and detailed technologies sections from the 11ty source are not blocked — they simply require data model extension and are at Claude's discretion. The minimum viable page must render every exhibit without 404 and surface the core content fields.

### Content variation by exhibit type

| Category | Exhibits | What they have |
|----------|----------|----------------|
| Detail exhibits with investigation report | J, K, L, M, N | `contextText` framed as investigation summary, `investigationReport: true` |
| Detail exhibits without investigation report | A, C, E, O | `isDetailExhibit: true`, may have quotes + resolution tables + contextText |
| Simpler exhibits | B, D, F, G, H, I | Mix of quotes and contextText, no resolution table |

All 15 renders correctly with the current interface using conditional rendering — no fields are required beyond `label`, `client`, `date`, `title`, `impactTags`, `exhibitLink`.

---

## Common Pitfalls

### Pitfall 1: Route Order — Dynamic Route After Catch-All
**What goes wrong:** If `/exhibits/:slug` is placed after `/:pathMatch(.*)*`, Vue Router matches the catch-all first and every exhibit URL hits NotFoundPage.
**Why it happens:** Route matching is first-match-wins in Vue Router.
**How to avoid:** Insert the exhibit route on the line immediately before the catch-all.
**Warning signs:** All `/exhibits/*` URLs show 404 — but no console error, because the catch-all silently handles them.

### Pitfall 2: Slug Derivation Mismatch
**What goes wrong:** If slug derivation logic in ExhibitDetailPage differs from the `exhibitLink` format in exhibits.ts, some exhibits won't resolve.
**Why it happens:** Manual string processing introduces edge cases (uppercase, special chars).
**How to avoid:** Don't transform the slug — use `e.exhibitLink === `/exhibits/${slug}`` directly. The `exhibitLink` values are already normalized to `/exhibits/exhibit-[letter]` format.

### Pitfall 3: Computed Exhibit Used Before Redirect Completes
**What goes wrong:** Template renders before `router.replace` completes when slug is unknown; template may attempt to access `exhibit.value.title` on `undefined`.
**Why it happens:** `router.replace` is async; template reactive evaluation happens synchronously.
**How to avoid:** Guard the template with `v-if="exhibit"` on the root content section, or use the conditional render pattern: show NotFoundPage content inline if exhibit is null, rather than relying on redirect timing.

### Pitfall 4: Missing Exhibit O in portfolioFlagships Cross-Reference
**What goes wrong:** `portfolioFlagships.ts` already has an Exhibit O entry with `exhibitLink: '/exhibits/exhibit-o'`. If the route is registered but the data entry is missing from `exhibits.ts`, navigating to `/exhibits/exhibit-o` will hit the not-found redirect despite the route existing.
**Why it happens:** The lookup is against `exhibits.ts`, not `portfolioFlagships.ts`.
**How to avoid:** Add Exhibit O to `exhibits.ts` as the first task. Verify the count reaches 15.

### Pitfall 5: useSeo with Dynamic Title
**What goes wrong:** `useSeo` is called with static strings in script setup on all other pages. On ExhibitDetailPage, the title must be derived from the exhibit data, but the exhibit is a computed value.
**Why it happens:** `useHead` from `@unhead/vue` (used internally by `useSeo`) does accept reactive values — but the `useSeo` wrapper takes plain strings.
**How to avoid:** Call `useHead` directly with `computed(() => ({ title: exhibit.value?.title }))` OR call `useSeo` with a static fallback and handle the dynamic case separately. Alternative: extend `useSeo` to accept a reactive title, or call `useHead` directly on this page only. Claude's discretion.

---

## Code Examples

### Dynamic Route in router.ts
```typescript
// Source: Vue Router official docs — dynamic route matching
// Insert BEFORE the catch-all /:pathMatch(.*)*
{ path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
```

### ExhibitDetailPage script setup (complete skeleton)
```typescript
// src/pages/ExhibitDetailPage.vue
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { exhibits } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

const route = useRoute()
const router = useRouter()

useBodyClass('page-exhibit-detail')

const exhibit = computed(() => {
  const slug = route.params.slug as string
  return exhibits.find(e => e.exhibitLink === `/exhibits/${slug}`) ?? null
})

// Dynamic SEO — useHead directly since title is reactive
useHead(computed(() => ({
  title: exhibit.value
    ? `${exhibit.value.label}: ${exhibit.value.title} | Pattern 158`
    : 'Exhibit | Pattern 158',
  meta: [
    {
      name: 'description',
      content: exhibit.value?.contextText ?? exhibit.value?.title ?? '',
    },
  ],
})))
```

### Storybook story pattern for ExhibitDetailPage
```typescript
// src/pages/ExhibitDetailPage.stories.ts
// Pattern: inline mock data (no data file import) per Phase 3 decision
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ExhibitDetailPage from './ExhibitDetailPage.vue'

// Storybook challenge: ExhibitDetailPage reads route.params.slug
// Standard approach: mock useRoute via parameters or wrap in a story decorator
// that provides a mock router with the slug set.
// Alternative: accept an optional `exhibitOverride` prop for testing/stories only.
// Claude's discretion on story isolation approach.

const meta = {
  title: 'Pages/ExhibitDetailPage',
  component: ExhibitDetailPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExhibitDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Mobile375: Story = { parameters: { viewport: { ... } } }
```

**Storybook routing note:** ExhibitDetailPage reads `useRoute()` which requires a router context. The `@storybook/vue3-vite` integration handles this via a stub router by default. However, `route.params.slug` will be empty in stories unless configured. The planner should account for either: (a) a story decorator that wraps with a mock route, or (b) a defensive computed that falls back to a hardcoded exhibit when slug is empty (stories-only path).

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| Static route per exhibit (15 entries) | Single dynamic `/exhibits/:slug` route | One route covers all 15 exhibits; adding new exhibits requires no router change |
| Missing Exhibit O (14 entries) | 15 entries A–O in exhibits.ts | All FlagshipCard and ExhibitCard links resolve |
| All exhibit links → 404 (no route registered) | Dynamic route + ExhibitDetailPage | PAGE-03 and PAGE-05 gap closure complete |

---

## Open Questions

1. **Storybook route param isolation**
   - What we know: `useRoute()` in a Storybook story returns an empty params object unless the story configures a mock route
   - What's unclear: Whether `@storybook/vue3-vite`'s default router stub populates params, or whether a decorator is needed
   - Recommendation: The planner should include a task to verify the story renders correctly and specify the mock route approach. A simple defensive fallback (`exhibit.value ?? exhibits[0]`) in the story context is the lowest-friction solution.

2. **Extended Exhibit O content (technologies comparison table)**
   - What we know: The 11ty Exhibit O page has a 3-column technologies table (BP / AICPA / ContentAIQ) not captured in the contextText field
   - What's unclear: Whether Phase 4 should port this into an extended interface field or leave it as future work
   - Recommendation: Port the core contextText (done above). Leave the technologies table for a future data enrichment pass. The exhibit renders fully with current fields.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4 (projects array API) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose src/data/exhibits.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-03 | exhibits.ts contains exactly 15 entries (A–O) | unit | `npx vitest run src/data/exhibits.test.ts` | Wave 0 |
| PAGE-03 | Every Exhibit entry has a valid exhibitLink starting with /exhibits/ | unit | `npx vitest run src/data/exhibits.test.ts` | Wave 0 |
| PAGE-03 | /exhibits/:slug route is registered in router.ts | unit | `npx vitest run src/router.test.ts` | Wave 0 |
| PAGE-05 | ExhibitDetailPage resolves exhibit by slug | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | Wave 0 |
| PAGE-05 | Unknown slug triggers redirect to not-found | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/data/exhibits.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/data/exhibits.test.ts` — covers PAGE-03 (entry count = 15, all exhibitLinks valid)
- [ ] `src/router.test.ts` — covers PAGE-03 (/exhibits/:slug route registered before catch-all)
- [ ] `src/pages/ExhibitDetailPage.test.ts` — covers PAGE-05 (slug lookup, not-found redirect)

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `src/data/exhibits.ts` — 14 current entries, full Exhibit interface
- Direct code inspection: `src/data/portfolioFlagships.ts` — 15 Flagship entries including Exhibit O reference
- Direct code inspection: `src/router.ts` — current route table, catch-all position confirmed
- Direct code inspection: `src/components/ExhibitCard.vue` — named slots, Exhibit prop usage
- Direct code inspection: `src/components/FlagshipCard.vue` — exhibitLink router-link usage
- Direct code inspection: `src/composables/useSeo.ts` — plain string interface confirmed
- Direct code inspection: `src/composables/useBodyClass.ts` — usage pattern confirmed
- Direct code inspection: `vitest.config.ts` — projects array API, unit/browser split
- 11ty source: `exhibit-o.html` — Exhibit O content ported directly
- 11ty source: `exhibit-a.html` — full detail page structure analyzed
- 11ty source: `exhibit-j.html` — investigation report structure analyzed
- 11ty source: `exhibit-b.html` — simpler exhibit structure analyzed

### Secondary (MEDIUM confidence)
- Vue Router documentation pattern: dynamic route segment `/:slug` — standard, well-established
- `@unhead/vue` `useHead` reactive computed support — consistent with project's existing `useSeo.ts` import

### Tertiary (LOW confidence)
- Storybook `@storybook/vue3-vite` behavior with `useRoute()` stub — needs verification during Wave 0

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed; no new dependencies
- Architecture: HIGH — dynamic routing is standard Vue Router; slug lookup verified against existing `exhibitLink` format
- Exhibit O data: HIGH — fetched directly from 11ty source HTML
- 11ty content structure: HIGH — fetched directly from raw GitHub source files
- Pitfalls: HIGH — derived from direct code inspection (route order, slug format)
- Storybook route mocking: LOW — needs validation during implementation

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable stack, no fast-moving dependencies)
