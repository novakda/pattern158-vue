# Phase 11: Unified Listing Page - Research

**Researched:** 2026-03-31
**Domain:** Vue 3 page composition, component reuse, CSS type-aware styling
**Confidence:** HIGH

## Summary

Phase 11 consolidates content from two existing pages (PortfolioPage and TestimonialsPage) into a single CaseFilesPage.vue. The work is primarily composition -- arranging existing components (HeroMinimal, StatItem, ExhibitCard) in a new page template, adding left-border accent CSS to distinguish exhibit types, lifting the Project Directory HTML from PortfolioPage, and deleting NarrativeCard.vue plus its Storybook story.

All building blocks already exist in the codebase. The data model (exhibits.ts with `exhibitType` discriminant) was completed in Phase 9. ExhibitCard already renders type-aware CTA text. The new page needs to filter exhibits by type, render them in two grouped sections, add the stats bar, and include the project directory tables. No new libraries or external dependencies are needed.

**Primary recommendation:** Build CaseFilesPage.vue by composing existing components with `exhibits.filter()` for type grouping, add scoped CSS for left-border accent colors using the established `badge-aware` / `badge-deep` color tokens, then delete NarrativeCard.vue and its story file.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Evidence-first layout: Hero -> Stats bar -> Investigation Reports (5 cards) -> Engineering Briefs (10 cards) -> Project Directory (tables by industry)
- **D-02:** Forensic tone hero -- "Case Files" title with subtitle like "Documented evidence from 28+ years of engineering work" matching the NTSB/investigation brand identity
- **D-03:** Type group headings use the exhibitType names: "Investigation Reports" and "Engineering Briefs" with brief subtitles per section (e.g., "Methodology-driven case studies" / "Constraints navigated, results delivered")
- **D-04:** Left border accent color differentiates card types -- gray (`badge-aware` token) for Investigation Reports, teal (`badge-deep` token) for Engineering Briefs. Consistent with Phase 9 badge color system.
- **D-05:** All 15 exhibits use ExhibitCard uniformly -- no FlagshipCard expanded treatment on Case Files. Type grouping and border accents provide the visual hierarchy.
- **D-06:** ExhibitCard keeps full rendering (quotes, context section, resolution table, impact tags, CTA link). The listing IS the evidence; hiding content defeats the purpose.
- **D-07:** New page component is `CaseFilesPage.vue` in `src/pages/`. Follows existing XxxPage.vue naming convention.
- **D-08:** Delete `NarrativeCard.vue` and its Storybook story (and test if exists) in Phase 11. Satisfies CLN-02. PortfolioPage's Three Lenses section breaks (expected -- page dies in Phase 13).
- **D-09:** Leave FlagshipCard.vue for Phase 13. It's still imported by PortfolioPage which stays alive until Phase 12 migrates traffic. Deleting now would break PortfolioPage prematurely.

### Claude's Discretion
- Stats bar content selection (D-01 stats bar): Claude picks best combination from Portfolio stats (38 Projects / 6,000+ Emails / 15+ Industries) and/or Testimonials stats based on visual balance
- TestimonialsMetrics component: Claude evaluates whether to keep on Case Files page, relocate to homepage, or drop entirely
- Section subtitle wording for type group headings
- CSS implementation for border accents (scoped styles vs global classes)
- Body class naming (e.g., `page-case-files`)
- Project Directory: relocated as-is from PortfolioPage unless Claude identifies improvements

### Deferred Ideas (OUT OF SCOPE)
- FlagshipCard.vue deletion -- Phase 13 (still imported by PortfolioPage)
- PortfolioPage.vue inline narrative data cleanup -- Phase 13 (page deletion)
- Route registration for `/case-files` -- Phase 12
- NavBar menu update -- Phase 12
- Storybook stories for CaseFilesPage -- REF-01 (v2.x)
- TestimonialsMetrics component final disposition -- if not resolved in Phase 11, tracked as REF-03
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LIST-01 | Unified Case Files page renders all 15 exhibits with type-aware card styling | CaseFilesPage.vue composing ExhibitCard with border-accent CSS per D-04/D-05/D-06 |
| LIST-02 | Exhibits grouped by type on listing page (Investigation Reports section and Engineering Briefs section) | `exhibits.filter(e => e.exhibitType === ...)` pattern; two `<section>` blocks per D-01/D-03 |
| LIST-03 | Visual type distinction on cards (badge, border, or icon variation per exhibit type) | Left border accent: `badge-aware` gray for IR, `badge-deep` teal for EB (D-04). CSS tokens already defined in main.css lines 3350-3363 |
| LIST-04 | Stats bar consolidated onto Case Files page (38 Projects, 6,000+ Emails, 15+ Industries) | StatItem component reuse from PortfolioPage pattern (lines 162-167) |
| LIST-05 | 38-project directory table relocated to Case Files page as breadth signal | Lift HTML from PortfolioPage lines 62-158 into CaseFilesPage |
| CLN-01 | Three Lenses section removed from site (AI-generated content, not authored) | PortfolioPage Three Lenses section (lines 43-51) breaks when NarrativeCard deleted -- expected, page dies Phase 13 |
| CLN-02 | NarrativeCard component removed | Delete `src/components/NarrativeCard.vue` and `src/components/NarrativeCard.stories.ts` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | ^3.5.0 | Component framework | Already in use |
| vue-router | ^4.5.0 | Routing (router-link in ExhibitCard) | Already in use |
| @unhead/vue | ^2.0.0 | SEO metadata | Already in use via useSeo composable |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | (devDep) | Unit testing | Test the new page component |
| @vue/test-utils | (devDep) | Component mounting | Test exhibit filtering and rendering |

No new packages needed. This phase is pure composition of existing assets.

## Architecture Patterns

### CaseFilesPage.vue Structure
```
CaseFilesPage.vue
  HeroMinimal (title="Case Files", subtitle=forensic tone)
  Stats Bar section (StatItem x3)
  Investigation Reports section
    ExhibitCard v-for (filtered: exhibitType === 'investigation-report')
  Engineering Briefs section
    ExhibitCard v-for (filtered: exhibitType === 'engineering-brief')
  Project Directory section (tables by industry, lifted from PortfolioPage)
```

### Pattern 1: Type-Based Exhibit Filtering
**What:** Filter the exhibits array by exhibitType to create two groups
**When to use:** Rendering grouped sections on the listing page
**Example:**
```typescript
// In <script setup>
import { exhibits } from '@/data/exhibits'

const investigationReports = exhibits.filter(e => e.exhibitType === 'investigation-report')
const engineeringBriefs = exhibits.filter(e => e.exhibitType === 'engineering-brief')
```

### Pattern 2: Left Border Accent CSS
**What:** Use existing color tokens for type-aware card borders
**When to use:** Differentiating card types visually on listing page
**Example:**
```css
/* Scoped or in main.css */
.page-case-files .exhibit-card.type-investigation-report {
    border-left: 6px solid var(--color-text-muted);  /* badge-aware gray */
}
.page-case-files .exhibit-card.type-engineering-brief {
    border-left: 6px solid var(--color-primary);      /* badge-deep teal */
}
```
**Note on tokens:** `badge-aware` uses `background: var(--color-text-muted)` and `badge-deep` uses `background: var(--color-primary)` per main.css lines 3350-3363. The border colors should use the same underlying CSS custom properties for consistency.

### Pattern 3: ExhibitCard Type Class Propagation
**What:** ExhibitCard needs a CSS class reflecting its exhibit type so the parent page can style borders
**Options:**
- (A) Add a computed class on `.exhibit-card` div inside ExhibitCard.vue: `:class="['exhibit-card', 'detail-exhibit', 'type-' + exhibit.exhibitType]"`
- (B) Wrap each ExhibitCard in a div on the page with the type class
**Recommendation:** Option A -- add the class directly on ExhibitCard's root element. This is cleaner and reusable. The class `type-investigation-report` or `type-engineering-brief` on the card itself allows any parent page to style based on type.

### Pattern 4: Page Composable Usage
**What:** Follow established page patterns
**Example:**
```typescript
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-case-files')
useSeo({
  title: 'Case Files | Pattern 158 - Dan Novak',
  description: 'Documented evidence from 28+ years of engineering work. 15 exhibits across investigation reports and engineering briefs.',
  path: '/case-files',
})
```

### Anti-Patterns to Avoid
- **Don't create separate card components for each type:** D-05 explicitly says all 15 use ExhibitCard uniformly. Type distinction is CSS-only (border accent).
- **Don't add route registration:** That is Phase 12 scope. CaseFilesPage.vue must exist as a component but won't be routable yet.
- **Don't delete FlagshipCard:** D-09 explicitly defers this to Phase 13.
- **Don't hide card content:** D-06 says the listing IS the evidence. No truncation or "show more" patterns.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Stats display | Custom stat component | StatItem.vue | Already exists, used by both current pages |
| Hero banner | Custom hero section | HeroMinimal.vue | Already exists with title/subtitle/slot pattern |
| SEO metadata | Manual meta tags | useSeo composable | Established pattern across all pages |
| Body class | Manual DOM manipulation | useBodyClass composable | Reactive cleanup on unmount |
| Exhibit type filtering | Complex computed logic | Simple `Array.filter()` | 15 items, no need for computed/watch overhead |

## Common Pitfalls

### Pitfall 1: Breaking PortfolioPage Prematurely
**What goes wrong:** Deleting NarrativeCard breaks PortfolioPage's Three Lenses section
**Why it happens:** PortfolioPage imports NarrativeCard at line 4
**How to avoid:** This breakage is EXPECTED per D-08. PortfolioPage is retired in Phase 13. Do NOT try to fix PortfolioPage after deleting NarrativeCard -- it is intentionally left broken.
**Warning signs:** If you feel compelled to edit PortfolioPage to remove the NarrativeCard import, stop. That cleanup is Phase 13 scope.

### Pitfall 2: Inconsistent Border Color Tokens
**What goes wrong:** Using hardcoded colors instead of CSS custom properties for border accents
**Why it happens:** The badge tokens (badge-aware, badge-deep) are CSS classes, not variables. The underlying variables are `--color-text-muted` (gray) and `--color-primary` (teal).
**How to avoid:** Reference the same CSS custom properties that the badge classes use. Check main.css lines 3350-3363 for the mapping.
**Warning signs:** Hardcoded hex values in border-left declarations.

### Pitfall 3: Exhibit Order Mismatch
**What goes wrong:** Exhibits display in wrong order within type groups
**Why it happens:** `exhibits.filter()` preserves array order from exhibits.ts. The current order is: Exhibits A-I (engineering briefs except the last one), then K-O (investigation reports), then P (engineering brief).
**How to avoid:** Verify the filter output matches the expected grouping. The data file has 10 engineering briefs (A-I, P) and 5 investigation reports (K-O). The filtered arrays will maintain their original order within each group.
**Warning signs:** Exhibit P appearing at the wrong position in the engineering briefs list (it's the last exhibit in the array but should appear last in the EB group).

### Pitfall 4: Project Directory HTML Duplication
**What goes wrong:** Copy-pasting the directory tables creates maintenance burden
**Why it happens:** The directory HTML is ~100 lines of inline table markup in PortfolioPage
**How to avoid:** Lift the HTML as-is into CaseFilesPage. Do NOT extract to a separate component unless Claude identifies clear benefit (discretion area). The tables are static content that changes rarely.
**Warning signs:** Temptation to create a data-driven table component for 38 static rows.

### Pitfall 5: TestimonialsMetrics Disposition
**What goes wrong:** Forgetting to make a decision about TestimonialsMetrics component
**Why it happens:** This is a discretion area -- Claude must evaluate and decide
**How to avoid:** Evaluate TestimonialsMetrics content (3 metric cards: Tooling & Automation, Client Impact, Problem-Solving Speed). These are narrative summaries, not hard stats. **Recommendation: Drop from Case Files page.** The content overlaps with what the exhibits themselves demonstrate. If the component has value, it can be relocated to homepage in a future phase (REF-03). Including it on Case Files would add visual noise below the directory tables.
**Warning signs:** Including it without conscious evaluation.

## Code Examples

### CaseFilesPage.vue Template Structure
```vue
<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import ExhibitCard from '@/components/ExhibitCard.vue'
import { exhibits } from '@/data/exhibits'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

const investigationReports = exhibits.filter(e => e.exhibitType === 'investigation-report')
const engineeringBriefs = exhibits.filter(e => e.exhibitType === 'engineering-brief')

useBodyClass('page-case-files')
useSeo({
  title: 'Case Files | Pattern 158 - Dan Novak',
  description: 'Documented evidence from 28+ years of engineering work. Investigation reports and engineering briefs from enterprise clients.',
  path: '/case-files',
})
</script>

<template>
  <HeroMinimal title="Case Files" subtitle="Documented evidence from 28+ years of engineering work">
    <span class="classification">Corroborated &middot; Primary Sources &middot; 2005&ndash;2022</span>
  </HeroMinimal>

  <section class="case-files-stats" aria-label="Portfolio statistics">
    <div class="container">
      <div class="stats-bar">
        <StatItem number="38" label="Projects Documented" />
        <StatItem number="6,000+" label="Archived Emails" />
        <StatItem number="15+" label="Industries" />
      </div>
    </div>
  </section>

  <section class="case-files-exhibits" aria-labelledby="ir-heading">
    <div class="container">
      <h2 id="ir-heading">Investigation Reports</h2>
      <p class="section-subtitle">Methodology-driven case studies</p>
      <ExhibitCard v-for="e in investigationReports" :key="e.label" :exhibit="e" />
    </div>
  </section>

  <section class="case-files-exhibits" aria-labelledby="eb-heading">
    <div class="container">
      <h2 id="eb-heading">Engineering Briefs</h2>
      <p class="section-subtitle">Constraints navigated, results delivered</p>
      <ExhibitCard v-for="e in engineeringBriefs" :key="e.label" :exhibit="e" />
    </div>
  </section>

  <!-- Project Directory lifted from PortfolioPage -->
  <section class="portfolio-directory" aria-labelledby="directory-heading">
    <!-- ... existing directory HTML ... -->
  </section>
</template>
```

### ExhibitCard Type Class Addition
```vue
<!-- In ExhibitCard.vue, update the root div -->
<div :class="['exhibit-card', 'detail-exhibit', 'type-' + exhibit.exhibitType]">
```

### Border Accent CSS
```css
/* In main.css or scoped in CaseFilesPage */
.page-case-files .exhibit-card.type-investigation-report {
    border-left: 6px solid var(--color-text-muted);
}
.page-case-files .exhibit-card.type-engineering-brief {
    border-left: 6px solid var(--color-primary);
}
```

### Files to Delete (CLN-02)
```
src/components/NarrativeCard.vue
src/components/NarrativeCard.stories.ts
```
No test file exists for NarrativeCard (verified by grep -- only PortfolioPage.vue and the stories file import it).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (happy-dom for unit) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LIST-01 | CaseFilesPage renders all 15 exhibits | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "renders all 15"` | Wave 0 |
| LIST-02 | Exhibits grouped into IR and EB sections | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "grouped"` | Wave 0 |
| LIST-03 | ExhibitCard has type-specific CSS class for border styling | unit | `npx vitest run src/components/ExhibitCard.test.ts -t "type class"` | Wave 0 |
| LIST-04 | Stats bar present with 3 stat items | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "stats"` | Wave 0 |
| LIST-05 | Project directory tables present | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "directory"` | Wave 0 |
| CLN-01 | Three Lenses content not rendered on Case Files | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "no Three Lenses"` | Wave 0 |
| CLN-02 | NarrativeCard files deleted | manual | `ls src/components/NarrativeCard*` returns nothing | manual-only (file deletion) |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/pages/CaseFilesPage.test.ts` -- covers LIST-01, LIST-02, LIST-04, LIST-05, CLN-01
- [ ] Update `src/components/ExhibitCard.test.ts` -- add test for type class (LIST-03)

## Discretion Recommendations

### Stats Bar Content (D-01)
**Recommendation:** Use the Portfolio stats (38 Projects / 6,000+ Emails / 15+ Industries). These are the breadth signals that complement the 15 detailed exhibits. The Testimonials stats (17 Years / 600+ Labor Hours / etc.) are engagement-specific and less effective as overview metrics.

### TestimonialsMetrics Component
**Recommendation:** Do NOT include on Case Files page. The component contains narrative summary cards (Tooling & Automation, Client Impact, Problem-Solving Speed) that overlap with what the 15 exhibit cards already demonstrate. Including it adds visual noise after the directory tables. Track as REF-03 for potential homepage relocation.

### CSS Implementation for Border Accents
**Recommendation:** Add the type class to ExhibitCard.vue's root element (`:class="['exhibit-card', 'detail-exhibit', 'type-' + exhibit.exhibitType]"`), then add border rules in main.css scoped under `.page-case-files`. This keeps the type class reusable (any page can style by type) while scoping the border visual to Case Files only.

### Body Class
**Recommendation:** `page-case-files` -- follows the existing `page-portfolio`, `page-testimonials` naming pattern.

### Project Directory
**Recommendation:** Lift as-is from PortfolioPage. The HTML is static, rarely changes, and extracting to a data-driven component would be overengineering for 38 rows organized into 7 industry tables.

## Sources

### Primary (HIGH confidence)
- `src/pages/PortfolioPage.vue` -- current page with Three Lenses, FlagshipCards, Project Directory, Stats bar
- `src/pages/TestimonialsPage.vue` -- current page with ExhibitCards, TestimonialsMetrics
- `src/components/ExhibitCard.vue` -- card component, already has type-aware CTA text
- `src/components/NarrativeCard.vue` -- component to delete (17 lines, no test file)
- `src/data/exhibits.ts` -- 15 exhibits with exhibitType discriminant (10 EB + 5 IR)
- `src/assets/css/main.css` -- badge-deep/badge-aware token definitions (lines 3350-3363)
- `src/components/TestimonialsMetrics.vue` -- 36-line component with 3 narrative metric cards
- `.planning/phases/11-unified-listing-page/11-CONTEXT.md` -- all implementation decisions

### Secondary (MEDIUM confidence)
- Existing test patterns in `src/components/ExhibitCard.test.ts` and `src/pages/ExhibitDetailPage.test.ts` -- established testing conventions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all components already exist
- Architecture: HIGH - straightforward page composition following established patterns
- Pitfalls: HIGH - all identified from direct codebase inspection

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (stable -- no external dependency changes)
