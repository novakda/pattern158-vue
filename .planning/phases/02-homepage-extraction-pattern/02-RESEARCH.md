# Phase 2: Homepage + Extraction Pattern - Research

**Researched:** 2026-03-16
**Domain:** Vue 3 SFC component extraction, TypeScript data files, router-link migration
**Confidence:** HIGH

## Summary

Phase 2 is a refactor-in-place of a single existing file (`src/pages/HomePage.vue`) plus
creation of a new `src/data/` directory and seven new Vue SFC components. All content already
exists in the current `HomePage.vue` — no new copy is authored. The work is structural: lift
raw HTML blocks into named concept components and lift inline data into typed `.ts` files.

The extraction pattern is the real deliverable. Every decision made here — how interfaces are
co-located, how `defineProps<{}>()` is typed, how data files are organized — becomes the
template Phase 3 follows for the remaining pages. Getting the pattern right matters more than
speed.

Two existing components need targeted changes: `TechTags.vue` needs to accept `string[]` in
addition to `Tag[]`, and `TestimonialQuote.vue` needs `cite` made optional. Both changes are
small and backwards-compatible.

**Primary recommendation:** Work file-by-file in this order: data files first, then
components, then refactor `HomePage.vue` to use them. This lets each piece be independently
verified before being wired together.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Link handling**
- All internal route links converted from `.html` hrefs to `<router-link :to="...">` — no raw `.html` hrefs remain
- Exhibit links (`/exhibits/exhibit-e.html`, etc.) become `<router-link>` with clean paths (`/exhibits/exhibit-e`) — they'll hit NotFoundPage until exhibit pages are ported from 11ty in a future phase
- All exhibit paths drop `.html` extension to match clean URL pattern across the app
- Hash anchors (e.g., `/philosophy#influences`) work natively with `<router-link>`

**Component extraction scope**
- Extract as new components: HomeHero, FindingCard, SpecialtyCard, StatItem, StatsSection (wraps StatItems), InfluencesList, CtaButtons
- Reuse existing components: TestimonialQuote (for teaser quotes), TechTags (extended for string[] support), PatternVisual (already used)
- All new components go in flat `src/components/` directory (no subfolders)
- Template line count: best effort toward scannable — don't force extractions just to hit <50 lines
- DB-generated HTML comments from 11ty source stripped — no longer meaningful

**Data architecture**
- All structured data extracted to typed files in `src/data/` — even simple data like stats and tech pills
- Named exports: `export const findings: Finding[]` and `export interface Finding` from same file
- Interfaces co-located in data files (not separate type files, not in components)
- Array position determines display order — no sort/priority fields
- Named exports only (per codebase convention)

**Component API design**
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

### Deferred Ideas (OUT OF SCOPE)
- Exhibit page porting (exhibit-e, exhibit-j, exhibit-k, exhibit-m) — future phase, links are ready with clean paths
- Storybook stories for new components — Phase 3 (STORY-01)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-01 | Port HomePage from 11ty with complete content | Full content already in `src/pages/HomePage.vue`; refactor in place using component extraction pattern below |
| COMP-02 | All extracted components use `defineProps<{}>()` TypeScript generic form | Confirmed pattern in existing codebase (TechTags, TestimonialQuote both use this form already); no third-party library needed |
| COMP-04 | Layout components use named slots for flexible composition | Not directly applicable to the new components in this phase (all props-driven, no named slots needed); the slot contract is fulfilled by reusing existing TestimonialQuote with its slot-free design — worth noting the requirement refers to layout-level components, not concept components |
</phase_requirements>

---

## Standard Stack

### Core (no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 SFC + `<script setup lang="ts">` | already installed | Component authoring | Project convention — every component file uses this form |
| Vue Router `<router-link>` | already installed | Internal navigation | Replaces all raw `.html` hrefs; hash anchors work natively |
| TypeScript strict mode | already enabled | Type safety in data files | `tsconfig.json` has `"strict": true` |

### No new dependencies

All work in this phase uses libraries already present. No `npm install` commands needed.

## Architecture Patterns

### Directory Layout After Phase 2

```
src/
├── components/
│   ├── CtaButtons.vue          # new — hero CTA pair
│   ├── FindingCard.vue         # new — NTSB-style project card
│   ├── HomeHero.vue            # new — unique hero section
│   ├── InfluencesList.vue      # new — dl-based influences list
│   ├── SpecialtyCard.vue       # new — intro section specialty card
│   ├── StatItem.vue            # new — single stat (number + label)
│   ├── StatsSection.vue        # new — wraps StatItems with stats[]
│   ├── TechTags.vue            # modified — accept (Tag | string)[]
│   ├── TestimonialQuote.vue    # modified — make cite optional
│   └── PatternVisual.vue       # unchanged
├── data/
│   ├── findings.ts             # new — Finding interface + findings[]
│   ├── influences.ts           # new — Influence, InfluenceLink interfaces + influences[]
│   ├── specialties.ts          # new — Specialty interface + specialties[]
│   ├── stats.ts                # new — Stat interface + stats[]
│   ├── techPills.ts            # new — string[] (no interface needed)
│   └── technologies.ts         # existing — unchanged
└── pages/
    └── HomePage.vue            # refactored in place
```

### Pattern 1: Data File with Co-located Interface

**What:** TypeScript data file exports both the interface and the const array from the same file. Interfaces are NOT defined in component files.

**When to use:** Every piece of structured data extracted from a page template.

**Example:**
```typescript
// src/data/stats.ts
// Source: established in CONTEXT.md data architecture decisions

export interface Stat {
  number: string;
  label: string;
}

export const stats: Stat[] = [
  { number: '28+', label: 'Years' },
  { number: '5,200+', label: 'Projects' },
  { number: '40+', label: 'Clients' },
  { number: '930+', label: 'Testimonials' },
];
```

### Pattern 2: Component with defineProps TypeScript Generic Form

**What:** Props declared inline with `defineProps<{}>()` — no `withDefaults` unless a prop needs a default value.

**When to use:** Every new component in this phase.

**Example (SpecialtyCard):**
```typescript
// src/components/SpecialtyCard.vue
<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
```

**Example (component with optional prop):**
```typescript
// src/components/TestimonialQuote.vue — modified
defineProps<{
  quote: string
  cite?: string          // changed from required to optional
  context?: string
  variant?: 'primary' | 'secondary'
}>()
```

### Pattern 3: Single Object Prop for Composite Data

**What:** For components that render a single data record (FindingCard), accept one typed object prop rather than many individual props. This keeps the call site clean and matches the data array iteration pattern.

**When to use:** When the component renders all fields of a single record from a data array.

**Example:**
```typescript
// src/data/findings.ts
export interface Finding {
  number: number
  title: string
  meta: string
  analysis: string
  solution: string
  outcome: string
  link?: string          // optional — not all findings have an exhibit link
  tags: string[]
}

// src/components/FindingCard.vue
import type { Finding } from '@/data/findings'

defineProps<{
  finding: Finding
}>()
```

### Pattern 4: TechTags Union Type Extension

**What:** Extend `TechTags.vue` to accept `(Tag | string)[]` by normalizing strings internally using a computed property. The `Tag` export interface is unchanged.

**When to use:** When passing plain tech pill strings from `techPills.ts` to `TechTags`.

**Example:**
```typescript
// src/components/TechTags.vue — modified
import { computed } from 'vue'

export interface Tag {
  label: string
  title: string
}

const props = defineProps<{
  tags: (Tag | string)[]
}>()

const normalizedTags = computed<Tag[]>(() =>
  props.tags.map(t => typeof t === 'string' ? { label: t, title: t } : t)
)
```

### Pattern 5: InfluencesList Mixed-Content Modeling

**What:** Influences entries have term, description text, and zero or more router-link items embedded in the description. Model links as a separate optional array so the component can render plain text paragraphs with interspersed `<router-link>` elements.

**When to use:** The `InfluencesList` component only.

**Recommended interface:**
```typescript
// src/data/influences.ts
export interface InfluenceLink {
  text: string
  to: string
}

export interface Influence {
  term: string
  description: string            // text segments excluding linked phrases
  links?: InfluenceLink[]        // optional link items with display text + route
}
```

**Note:** The mixed inline-link-within-paragraph requirement cannot be expressed as a simple template loop without either rendering raw HTML or splitting description strings at link positions. The simplest approach is to store the full description as a string with link placeholders, then render links separately — OR to accept that InfluencesList renders its own specific markup structure using `v-for` over a structured representation. Claude's discretion on exact modeling.

### Pattern 6: HomePage.vue After Refactor

**What:** The final HomePage template should read as a section-level outline. Each section uses a named component; no inline HTML blocks.

**Target structure (approximate):**
```html
<!-- src/pages/HomePage.vue <template> after refactor -->
<HomeHero :tech-pills="techPills" />

<section class="intro">
  <div class="container">
    <h2>I Reverse-Engineer Chaos Into Clarity</h2>
    <p>...</p>
    <div class="specialties">
      <SpecialtyCard v-for="s in specialties" :key="s.title"
        :title="s.title" :description="s.description" />
    </div>
  </div>
</section>

<StatsSection :stats="stats" />
<InfluencesList :influences="influences" />

<section class="findings" id="work">
  <div class="container">
    <h2>Featured Projects</h2>
    <FindingCard v-for="f in findings" :key="f.number" :finding="f" />
  </div>
</section>

<section class="field-reports-teaser">
  <div class="container">
    <h2>From the Field</h2>
    <p class="section-subtitle">...</p>
    <div class="teaser-quotes">
      <TestimonialQuote v-for="q in teaserQuotes" :key="q.quote" v-bind="q" />
    </div>
    <router-link to="/testimonials" class="btn btn-primary">View All Field Reports</router-link>
  </div>
</section>
```

### Anti-Patterns to Avoid

- **Putting interfaces in component files:** The codebase convention (confirmed in `technologies.ts`) is interfaces in data files. Components import types from `@/data/`.
- **Default exports from data files:** All exports are named. No `export default`.
- **Relative imports:** Always use `@/` alias, never `../` paths.
- **Barrel files:** Not used in this codebase — import directly from source files.
- **Forcing extraction to hit line count targets:** CONTEXT.md says "best effort toward scannable — don't force extractions just to hit <50 lines."
- **Adding FieldReportsTeaser as a dedicated component:** The two teaser quotes are handled inline using the existing `TestimonialQuote` component — no new wrapper component needed unless the template becomes unreadable.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Internal navigation | `<a href="/path">` | `<router-link :to="...">` | Vue Router handles history mode, active class, and programmatic navigation |
| Tag normalization | manual string check in template | computed property in `TechTags.vue` | Keeps template clean, single source of truth |
| SEO head management | manual `document.title =` | existing `useSeo()` composable | Already wired in `HomePage.vue`, no changes needed |
| Body class | manual DOM manipulation | existing `useBodyClass()` composable | Already wired in `HomePage.vue`, no changes needed |
| Hash anchor scrolling | scroll library or JS | `<router-link to="/philosophy#influences">` | Vue Router handles hash navigation natively |

**Key insight:** This phase has no missing infrastructure. The risk is over-engineering — adding complexity that doesn't exist in the source content.

## Common Pitfalls

### Pitfall 1: HTML Entities in Template Copy

**What goes wrong:** Copy-pasted content from `HomePage.vue` contains HTML entities (`&mdash;`, `&hellip;`, `&rarr;`, etc.) that render as literal text in Vue templates.

**Why it happens:** HTML entities are a browser parsing feature, not a Vue template feature. Vue templates compile to render functions — entities in template string positions are not decoded by the browser HTML parser.

**How to avoid:** Replace all HTML entities with literal Unicode characters when moving content into Vue data files or template literals. The UI-SPEC has the complete mapping:
- `&mdash;` → `—`
- `&hellip;` → `…`
- `&rarr;` → `→`
- `&ldquo;` / `&rdquo;` → `"` / `"`
- `&rsquo;` → `'`
- `&lsquo;` → `'`

**Warning signs:** Running `npm run build` and seeing entity strings in the page source output, or seeing `&mdash;` text in the browser viewport.

### Pitfall 2: Forgetting `cite` Is Changing to Optional in TestimonialQuote

**What goes wrong:** First teaser quote in the current HTML (`src/pages/HomePage.vue` lines 270-275) has no `<footer>` or `<cite>` — it is an anonymous quote. The current `TestimonialQuote` component requires `cite: string`, so passing an anonymous quote would fail TypeScript.

**Why it happens:** The current component was designed for full testimonials with attribution.

**How to avoid:** Make `cite` optional (`cite?: string`) in `TestimonialQuote.vue` and add a conditional render: `<footer v-if="cite" ...>`. This is backwards-compatible — all existing usages that pass `cite` continue to work.

**Warning signs:** TypeScript error when passing a teaser without a cite attribute.

### Pitfall 3: TechTags Prop Type Break

**What goes wrong:** Changing `tags: Tag[]` to `tags: (Tag | string)[]` in `TechTags.vue` can break existing call sites if they pass a `Tag[]` variable but TypeScript now infers a different type.

**Why it happens:** The union type is a wider contract. Existing call sites passing `Tag[]` still satisfy `(Tag | string)[]` — `Tag[]` is assignable to `(Tag | string)[]`. No break.

**How to avoid:** Verify existing `TechTags` usages with a quick grep before modifying. In this codebase the only known usage is in `TechnologiesPage.vue` and the import in `src/data/technologies.ts` (`import type { Tag } from '@/components/TechTags.vue'`). Both continue to work because `Tag[]` is a valid subtype of `(Tag | string)[]`.

**Warning signs:** TypeScript errors in `TechnologiesPage.vue` after modifying `TechTags.vue`.

### Pitfall 4: Exhibit Links Silently Resolving to NotFoundPage

**What goes wrong:** Clean exhibit paths (`/exhibits/exhibit-e`) hit the catch-all 404 route and render `NotFoundPage`. This is expected and correct behavior. But if the catch-all route does not exist, Vue Router silently renders nothing with no console warning.

**Why it happens:** Phase 1 state notes "no catch-all 404 route exists" — but this was listed as a Phase 1 concern. Verify `router.ts` has a catch-all before shipping Phase 2 exhibit links.

**How to avoid:** Check `src/router.ts` for a `path: '/:pathMatch(.*)*'` catch-all route before implementation. If absent, add it as part of Phase 2 work.

**Warning signs:** Clicking an exhibit link navigates to blank page with no 404 content.

### Pitfall 5: Section aria-label Lost During Refactor

**What goes wrong:** The stats section in current HTML has `aria-label="Career statistics"` on the `<section>` element. If StatsSection hides this section behind a component boundary without passing it through, the landmark is lost.

**Why it happens:** The aria attribute is on the wrapper element, not on an inner element.

**How to avoid:** The `StatsSection` component should render the `<section class="stats-section" aria-label="Career statistics">` wrapper itself, not accept it from outside.

## Code Examples

Verified patterns from the existing codebase:

### defineProps Generic Form (from TechTags.vue)
```typescript
// Source: src/components/TechTags.vue
defineProps<{
  tags: Tag[]
}>()
```

### Named Export Convention (from src/data/technologies.ts)
```typescript
// Source: src/data/technologies.ts
export interface TechCardData {
  name: string
  level: ExpertiseLevel
  // ...
}

export const technologies: TechCategory[] = [ /* ... */ ]
```

### Import Type from Component File (from technologies.ts)
```typescript
// Source: src/data/technologies.ts line 1
import type { Tag } from '@/components/TechTags.vue'
```
Note: After Phase 2, `FindingCard` imports `Finding` from `@/data/findings`, not from the component. The data file is the source of truth for interfaces.

### router-link with Hash Anchor
```html
<!-- Source: CONTEXT.md decision — hash anchors work natively with Vue Router -->
<router-link to="/philosophy#influences" class="link-primary">Full details →</router-link>
```

### Conditional Footer in TestimonialQuote (recommended change)
```html
<!-- src/components/TestimonialQuote.vue — modified template section -->
<footer v-if="cite" class="quote-attribution">
  <cite>{{ cite }}</cite>
  <p v-if="context" class="quote-context">{{ context }}</p>
</footer>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<a href="/page.html">` | `<router-link :to="/page">` | This phase | Eliminates full-page reloads, enables active class, history mode |
| Inline HTML blocks in page template | Named concept components | This phase | Template becomes scannable outline; Phase 3 follows this pattern |
| Data inline in template | Typed `.ts` files in `src/data/` | This phase | Data is separately testable, shareable across pages in Phase 3 |

## Open Questions

1. **Catch-all 404 route existence**
   - What we know: Phase 1 STATE.md notes "no catch-all 404 route exists" as a concern
   - What's unclear: Whether Phase 1 work added it (need to check `src/router.ts` during implementation)
   - Recommendation: Implementer verifies `src/router.ts` at the start of the task and adds `{ path: '/:pathMatch(.*)*', component: NotFoundPage }` if missing

2. **InfluencesList mixed inline content**
   - What we know: Three of five influences have inline router-links within description text (see lines 117-143 of HomePage.vue). Two have plain text descriptions only.
   - What's unclear: Whether to model the full description as structured data (term + text segments + link positions) or use a simpler approach (store description split around link positions, render with v-for)
   - Recommendation: Implementer uses Claude's discretion per CONTEXT.md. Simplest working model is to split each description into text/link segments stored as an array in the data file.

3. **FieldReportsTeaser extraction level**
   - What we know: CONTEXT.md marks this as Claude's discretion
   - What's unclear: Whether two teaser quotes + a CTA button warrant a dedicated component
   - Recommendation: No dedicated component. Render TestimonialQuote inline in HomePage.vue for the teasers; teaser data (quote, optional cite, optional context) lives in a local const rather than a separate data file since it is not shared across pages.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4 (confirmed via `vitest.config.ts` using `projects` array API) |
| Config file | `vitest.config.ts` — projects array with `extends: true` |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | HomePage imports without error | unit | `npx vitest run --project unit src/pages/HomePage.test.ts` | ❌ Wave 0 |
| PAGE-01 | HomePage renders no raw `.html` hrefs | unit | `npx vitest run --project unit src/pages/HomePage.test.ts` | ❌ Wave 0 |
| COMP-02 | FindingCard, SpecialtyCard, StatItem are importable modules | unit | `npx vitest run --project unit src/components/FindingCard.test.ts` | ❌ Wave 0 |
| COMP-04 | TestimonialQuote renders without cite prop (optional) | unit | `npx vitest run --project unit src/components/TestimonialQuote.test.ts` | ❌ Wave 0 |

Visual parity at 375px/768px/1280px in light/dark (success criterion 1) is manual-only — no automated visual regression tooling is installed in this project.

### Sampling Rate

- **Per task commit:** `npx vitest run --project unit`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/pages/HomePage.test.ts` — smoke: imports without error, no raw `.html` hrefs in rendered output — covers PAGE-01
- [ ] `src/components/TestimonialQuote.test.ts` — cite optional rendering — covers COMP-04
- [ ] `src/components/FindingCard.test.ts` — module importable, defineProps shape — covers COMP-02

*(Vitest and happy-dom are already installed — no framework install needed)*

## Sources

### Primary (HIGH confidence)

- Direct file reads: `src/pages/HomePage.vue` — full source content inventoried
- Direct file reads: `src/components/TechTags.vue`, `TestimonialQuote.vue`, `PatternVisual.vue` — current APIs confirmed
- Direct file reads: `vitest.config.ts` — test infrastructure confirmed
- Direct file reads: `.planning/phases/02-homepage-extraction-pattern/02-CONTEXT.md` — all decisions locked
- Direct file reads: `.planning/phases/02-homepage-extraction-pattern/02-UI-SPEC.md` — component inventory and data file contracts
- Direct file reads: `.planning/codebase/CONVENTIONS.md`, `STRUCTURE.md` — naming and directory conventions

### Secondary (MEDIUM confidence)

- Vue 3 `<router-link>` hash anchor behavior — confirmed by Vue Router documentation pattern (router-link to with hash works natively)
- TypeScript union type assignability (`Tag[]` satisfies `(Tag | string)[]`) — standard TypeScript structural typing rule

### Tertiary (LOW confidence)

- None — all findings are based on direct codebase inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — everything confirmed from direct file reads; no new libraries
- Architecture: HIGH — patterns derived from existing codebase conventions and locked CONTEXT.md decisions
- Pitfalls: HIGH — derived from direct inspection of existing component APIs and current template content

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable project, no fast-moving external dependencies in scope)
