# Feature Research

**Domain:** Senior engineer portfolio site — Vue 3 SPA conversion from 11ty static HTML
**Researched:** 2026-03-16
**Confidence:** HIGH (domain is well-understood; findings grounded in existing codebase, published portfolio, and current Vue ecosystem)

---

## Context Note

This is a **conversion project**, not a greenfield feature build. The 11ty site is live and published. The feature set is already defined — the question is how to implement those features in Vue 3 correctly, and which component extraction decisions demonstrate Vue mastery vs. add complexity without value.

The dual audience for this portfolio is:
1. Potential clients and employers (content readers)
2. Technical reviewers who will look at the code (the Vue implementation is itself a portfolio artifact)

Features are evaluated against both audiences.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that must exist and work correctly. Missing or broken = unprofessional. Technical reviewers expect these done well in a Vue portfolio.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| All 9 pages fully ported with content | Placeholders read as abandoned work-in-progress | MEDIUM | HomePage and PhilosophyPage done; 7 pages remain as TODO stubs |
| Visual parity with published 11ty site | Mismatched layouts signal incomplete work | MEDIUM | Content must match exactly; CSS system already handles styling |
| Client-side routing (Vue Router) | SPA navigation is the baseline for any Vue app | LOW | Already implemented with lazy-loaded routes |
| SEO meta tags per page (title, description, OG, canonical) | Portfolio pages are publicly crawled; missing meta = bad signal | LOW | `useSeo` composable already exists and is in use |
| Dark/light theme toggle with localStorage persistence | Expected in 2026 frontend work; absence feels dated | LOW | Already implemented with FOUC prevention |
| Responsive navigation with mobile hamburger | Every portfolio is viewed on phones by recruiters | LOW | Already implemented with keyboard support |
| Skip-to-content link and semantic HTML structure | WCAG accessibility is explicitly part of Dan's work; it would be ironic to fail this | LOW | Already implemented in App.vue |
| ARIA labels on all interactive elements | Same as above — accessibility is Dan's stated expertise | LOW | NavBar and ThemeToggle already have ARIA labels |
| Footer with contact info and links | Standard portfolio convention | LOW | FooterBar already implemented |
| HeroMinimal component for inner pages | All inner pages use `hero-minimal` pattern; raw section tags don't communicate intent | LOW | Component exists; ContactPage already uses it; other TODO pages use raw section tags — needs adoption |
| Storybook stories for all components and pages | Already established as a portfolio deliverable; missing stories are gaps | LOW-MEDIUM | Exists for all current components; must stay current as components are extracted |

### Differentiators (Signals Vue Mastery)

Features that go beyond "it works" and demonstrate engineering judgment. Technical reviewers will look for these specifically.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Template readability via extracted components | Pages that read like outlines (not raw HTML soup) signal ADHD-informed component design thinking | MEDIUM | This is the project's core design principle; `PhilosophyPage` uses inline HTML; extraction transforms it into scannable composition |
| TypeScript props with strict types | Every component prop typed via `defineProps<{}>()` shows production Vue habits | LOW | `HeroMinimal`, `TestimonialQuote`, `ExpertiseBadge`, `TechCard` already do this; maintain the pattern across all new extractions |
| Composables for cross-cutting logic (`useSeo`, `useBodyClass`) | Demonstrates Composition API idioms — logic separated from templates | LOW | Both exist; the pattern should be consistent, not ad-hoc |
| Named slots for flexible layout components | `<ContentSection>` or `<FindingCard>` with named slots (`#header`, `#body`, `#footer`) is idiomatic Vue 3 | MEDIUM | Slot-based composition shows understanding of Vue's component model at depth |
| `<script setup>` throughout | The modern Vue 3 idiom; mixing Options API or old `export default` signals unfamiliarity | LOW | Already consistent; maintain it |
| Storybook stories that document prop variants | Stories showing all component states (not just happy path) demonstrate documentation-as-engineering | MEDIUM | Current stories exist; quality matters — `variant="secondary"` on TestimonialQuote should have its own story state |
| router-link over `<a href>` for internal navigation | Using `<a href="/page.html">` inside a Vue SPA is a correctness error, not just style | LOW | `HomePage.vue` has several raw `<a href>` links to `.html` paths that need converting; `PhilosophyPage` correctly uses `router-link` |
| `v-if` / `v-show` used semantically | `v-if` for conditional existence, `v-show` for toggle visibility — mixing them carelessly signals Vue anti-patterns | LOW | Already correct in existing components; maintain in new ones |
| Component extraction driven by cognitive load, not DRY | Extracting `<SpecialtyCard>`, `<FindingCard>`, `<StatItem>` etc. — single-use components that name concepts — signals ADHD-informed engineering | MEDIUM | This is the differentiating design philosophy; articulated in PROJECT.md |

### Anti-Features (Deliberately NOT Building)

Features that seem like good portfolio additions but create problems for this specific conversion scope.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Pinia state management | "Real Vue apps use Pinia" | No shared reactive state across pages; overkill for a static site; adds dependency for no benefit | Props + composables are sufficient; add Pinia only if a future feature genuinely requires cross-component state |
| Page transition animations | Makes SPAs feel polished; common portfolio flex | Explicitly out of scope per PROJECT.md; adds visual noise to a professional portfolio; risks breaking accessibility (prefers-reduced-motion); defers the conversion milestone | Router `scrollBehavior` is sufficient; animations are a future-pass concern |
| Contact form with server-side submission | "Contact forms are professional" | Requires backend or third-party service (Formspree, Netlify Forms); not in 11ty site; adds maintenance surface | Direct email link and copy-to-clipboard button already serves the contact need; already implemented in ContactPage |
| CMS or data fetching layer | "Portfolio content should be editable" | Adds architectural complexity; content is stable; static data is simpler and more maintainable | Hardcode content in Vue templates or extract to typed TypeScript data files if repetitive |
| Blog / article system | "Engineers should have a blog" | Not in the 11ty site; requires content management; scope creep | Link to external writing platforms if needed; out of scope for this conversion |
| Search functionality | "Helps users find content" | Portfolio is small and navigable; search adds complexity without proportionate value | Clear navigation structure and section anchors are sufficient |
| SSR or SSG via Nuxt | "Better SEO" | Architectural pivot, not a conversion; SPA with proper meta tags is sufficient for a portfolio | Current `useSeo` composable handles meta adequately; SPA is the established constraint |
| Loading spinners / skeleton screens | "Feels faster" | With lazy-loaded routes, initial hydration is fast; all content is static; skeleton screens add visual complexity | Vite's code splitting + lazy routes already minimize perceived load time |
| Particle backgrounds, WebGL hero, scroll parallax | "Makes portfolio memorable" | Over-engineering a professional CV; often degrades accessibility; focuses attention on tech demo over work | Content quality is the differentiator; the PatternVisual component already provides a meaningful subtle visual |
| Dark mode custom CSS per-component | "Deep theme control" | CSS custom property system already handles theme switching at the token level; component-level dark mode overrides create maintenance burden | Consume existing `--color-*` tokens; trust the cascade layer system |

---

## Feature Dependencies

```
[All pages ported]
    └──requires──> [HeroMinimal component adoption]
                       └──requires──> [HeroMinimal component exists]  ✓ DONE

[Template readability via component extraction]
    └──requires──> [Content ported to page first]
                       └──requires──> [Page exists as TODO stub]  ✓ DONE (stubs exist)

[Storybook stories current]
    └──requires──> [Components extracted and finalized]

[router-link correctness]
    └──requires──> [Internal hrefs audited on ported pages]

[TypeScript prop types]
    └──enhances──> [Storybook auto-generated controls]
                       └──requires──> [vue-component-meta or vue-docgen-api setup]  ✓ DONE (Storybook 10)

[Named slot components (FindingCard, ContentSection)]
    └──enhances──> [Template readability]
    └──requires──> [Content ported first — can't design slot API without knowing the content shape]
```

### Dependency Notes

- **Pages must be ported before components can be extracted:** You cannot design `<FindingCard>` slots correctly until you have the full finding card HTML in front of you. Port content first, extract components second.
- **HeroMinimal adoption is a quick win:** The component already exists. ContactPage already uses it. The 5 TODO pages that use raw `<section class="hero-minimal">` just need the import and tag swap when ported.
- **Storybook stories trail component work:** Stories are documentation artifacts; they are written after component interfaces stabilize, not before. Budget story-writing time as part of each component's completion definition.
- **router-link audit is a post-port concern:** `HomePage.vue` has raw `<a href="/contact.html">` and `<a href="/portfolio.html">` links that reference `.html` paths. These must be converted to `<router-link to="/contact">` when the page is considered "done." Every ported page needs this audit.

---

## MVP Definition

For this project, "MVP" means: the Vue site reaches feature parity with the published 11ty site, making it ready to replace it.

### Launch With (v1 — Conversion Complete)

- [ ] All 9 pages fully ported with complete content — replaces TODO stubs
- [ ] HeroMinimal component used consistently on all inner pages
- [ ] All internal `<a href>` links converted to `<router-link>` with correct paths (no `.html` extensions)
- [ ] Template readability via component extraction — pages read as outlines, not raw HTML
- [ ] TypeScript props on all extracted components
- [ ] Storybook stories updated to cover all components and their variants
- [ ] Visual parity verified against published 11ty site
- [ ] Accessibility audit passes (skip link, ARIA labels, semantic HTML, color contrast)

### Add After Validation (v1.x — Post-Launch Polish)

- [ ] `<script setup>` audit — ensure no accidental Options API usage crept in during porting
- [ ] router-link audit pass across all pages (confirm no stale `.html` hrefs)
- [ ] Performance audit — confirm lazy-loading behaves as expected, no route chunk regressions

### Future Consideration (v2+)

- [ ] Page transition animations — only after conversion complete and after checking `prefers-reduced-motion` compliance
- [ ] Extracted TypeScript data files for structured content (tech list, project list) — only if content maintenance burden justifies it
- [ ] Vitest unit tests for composables — valuable but not required for conversion milestone

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| All pages ported with content | HIGH | MEDIUM | P1 |
| HeroMinimal adoption on all inner pages | MEDIUM | LOW | P1 (quick win, do during port) |
| router-link correctness audit | HIGH (correctness) | LOW | P1 |
| Component extraction for template readability | HIGH (code reviewer audience) | MEDIUM | P1 |
| TypeScript props on all components | HIGH (code reviewer audience) | LOW | P1 |
| Storybook stories current | MEDIUM | LOW-MEDIUM | P1 |
| Visual parity verification | HIGH | LOW | P1 |
| Page transition animations | LOW | MEDIUM | P3 |
| Pinia state management | LOW | MEDIUM | P3 (only if need arises) |
| Vitest composable tests | MEDIUM (code reviewer audience) | MEDIUM | P2 |
| TypeScript data files for content | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for conversion milestone
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor / Reference Feature Analysis

Framed as: what do technical reviewers look for when reading a Vue 3 portfolio codebase vs. what portfolio visitors look for when reading the site.

| Feature | Visitor Expectation | Technical Reviewer Expectation | This Site's Approach |
|---------|---------------------|-------------------------------|----------------------|
| Page content completeness | All pages have real content, no placeholders | Same — stubs signal incomplete work | Port all 7 remaining TODO pages |
| Component naming | N/A (invisible) | Components should name concepts, not describe structure | Extract `<FindingCard>`, `<SpecialtyCard>`, `<StatItem>` etc. |
| Template length | N/A | Page templates under ~50 lines signal good decomposition | Drive toward outline-length templates |
| TypeScript usage | N/A | `defineProps<{}>()` generic form, typed component contracts | Already consistent; maintain |
| Dark mode | Expected in 2026 | Implementation should use CSS variables, not JS hacks | Already correct |
| Accessibility | Expected | WCAG violations in an accessibility expert's portfolio would be disqualifying | Already strong; maintain during extraction |
| Internal links | Work correctly | `router-link` not raw `<a href>` | HomePage has stale `.html` hrefs that need fixing |
| Storybook | N/A | Presence of Storybook + complete stories signals documentation discipline | Storybook 10 already set up; stories must stay current |

---

## Sources

- [Vue.js Composables official guide](https://vuejs.org/guide/reusability/composables.html) — HIGH confidence
- [Vue Router Transitions](https://router.vuejs.org/guide/advanced/transitions.html) — HIGH confidence
- [Storybook for Vue & Vite](https://storybook.js.org/docs/get-started/frameworks/vue3-vite) — HIGH confidence
- [Vue Best Practices in 2026 — One Horizon](https://onehorizon.ai/blog/vue-best-practices-in-2026-architecting-for-speed-scale-and-sanity) — MEDIUM confidence (third-party)
- [Good practices and Design Patterns for Vue Composables — DEV Community](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk) — MEDIUM confidence
- [Vue 3 layout system — Medium](https://medium.com/@sakensaten1409/vue-3-layout-system-smart-layouts-for-vuejs-80ae700e48a6) — MEDIUM confidence
- Codebase analysis — `src/pages/`, `src/components/` (direct inspection) — HIGH confidence
- `.planning/PROJECT.md` constraints and decisions — HIGH confidence (authoritative for this project)

---

*Feature research for: Vue 3 portfolio site conversion (pattern158.solutions)*
*Researched: 2026-03-16*
