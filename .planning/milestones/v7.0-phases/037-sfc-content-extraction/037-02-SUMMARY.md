---
phase: 037-sfc-content-extraction
plan: 02
subsystem: content-extraction
tags: [sfc, content, refactor, philosophy]
requires:
  - Vue 3 SFC content containing hardcoded English prose
provides:
  - src/content/philosophy.ts (page-level prose)
  - src/content/sections/pattern158Origin.ts
  - src/content/sections/howIWork.ts (MethodologyStep interface + 3 steps)
  - src/content/sections/aiClarity.ts
  - Refactored PhilosophyPage.vue consuming @/content/philosophy
  - Refactored Pattern158OriginSection.vue, HowIWorkSection.vue, AiClaritySection.vue
affects:
  - src/pages/PhilosophyPage.vue
  - src/components/Pattern158OriginSection.vue
  - src/components/HowIWorkSection.vue
  - src/components/AiClaritySection.vue
tech-stack:
  added: []
  patterns:
    - "Content modules export typed objects; SFCs v-for over imported arrays"
    - "Moe Howard blockquote uses structured { text, cite } satisfies PhilosophyQuote with structural markup preserved"
    - "ColleagueQuote interface typed with optional cite/context/variant; v-for replaces hardcoded instances"
key-files:
  created:
    - src/content/philosophy.ts
    - src/content/sections/pattern158Origin.ts
    - src/content/sections/howIWork.ts
    - src/content/sections/aiClarity.ts
  modified:
    - src/pages/PhilosophyPage.vue
    - src/components/Pattern158OriginSection.vue
    - src/components/HowIWorkSection.vue
    - src/components/AiClaritySection.vue
decisions:
  - "Inline <em>/<strong> wrappers dropped from all refactored prose per Phase 37 structural markup policy (consistent across all modules)"
  - "Moe Howard blockquote <blockquote>/<cite> structural tags preserved in template; only text nodes bound to moralSpine.quote.text/.cite (Pitfall 6)"
  - "methodologyNote kept as separate field in aiClarity so the class='methodology-note' paragraph stays distinct in the template"
  - "TestimonialQuote v-for over colleagueQuotes array replaces 2 hardcoded instances on PhilosophyPage"
metrics:
  duration: "~3 minutes"
  completed: "2026-04-10"
  tasks: 3
  files_created: 4
  files_modified: 4
  tests_passing: 127
---

# Phase 37 Plan 02: SFC Content Extraction — Philosophy Page Summary

Extracted all hardcoded English prose from `PhilosophyPage.vue` and its three delegated section components (`Pattern158OriginSection`, `HowIWorkSection`, `AiClaritySection`) into typed content modules under `src/content/`, making the Philosophy subsystem markdown-exportable by Phase 39 without parsing `.vue` SFCs.

## Scope Executed

Four new content modules created and four SFCs refactored to consume them via `v-for`:

1. **`src/content/sections/pattern158Origin.ts`** — heading + 5 paragraphs (Myst origin story).
2. **`src/content/sections/howIWork.ts`** — `MethodologyStep` interface + `methodologySteps: MethodologyStep[]` (3 steps, each with heading + 2-3 paragraphs).
3. **`src/content/sections/aiClarity.ts`** — heading + intro + 9 body paragraphs + `methodologyNote`.
4. **`src/content/philosophy.ts`** — `PhilosophyQuote` and `ColleagueQuote` interfaces plus `designThinking`, `moralSpine` (with `quote: { text, cite } satisfies PhilosophyQuote`), `influencesHeading`, `brandElementsHeading`, `colleagueQuotes`, `colleagueQuotesHeading`, `closingLine`.

## Structural Markup Policy Applied

Per the plan's structural markup policy (Pattern 2 from RESEARCH.md):

### Inline `<em>` / `<strong>` — Dropped

All inline emphasis wrappers were dropped from the refactored prose, producing plain `string` paragraphs throughout. Specifically:

| Location | Original | Refactored |
|---|---|---|
| Pattern158OriginSection P1 | `<em>"The final page..."</em>` | Plain text with unicode smart quotes |
| Pattern158OriginSection P4 | `<strong>Pattern 158 = the code...</strong>` | Plain string paragraph |
| HowIWorkSection step 1 P2 | `<strong>Never blame the human first.</strong> When a system fails...` | Merged into single plain paragraph |
| AiClaritySection P6 | `<em>"AI wrote it"</em> is a mischaracterization. <em>AI clarified it.</em>` | Joined as single plain paragraph: `"AI wrote it" is a mischaracterization. AI clarified it.` |
| AiClaritySection P9 | `<strong>The question is: does the reader understand...</strong>` | Plain string paragraph |
| AiClaritySection methodologyNote | `...<em>Provider of Clarity</em>...` | Plain text |
| PhilosophyPage moralSpine intro | `<em>how</em> I work. This is <em>why</em>:` | `The three-step pattern is how I work. This is why:` |
| PhilosophyPage influencesHeading intro | `<em>this changed how I solve problems.</em>` | Plain text |

This is a deliberate Phase 37 simplification. Phase 39 (Obsidian vault renderer) will render plain markdown from the same data; Phase 39 may revisit segmented markup if needed.

### Blockquote — Preserved (Structural Markup Exception)

Per Pitfall 6, the Moe Howard blockquote on `#moral-spine` retains its structural tags in the template:

```vue
<blockquote>
  <p>{{ moralSpine.quote.text }}</p>
  <cite>{{ moralSpine.quote.cite }}</cite>
</blockquote>
```

The data shape uses a typed `PhilosophyQuote` interface:

```typescript
export interface PhilosophyQuote {
  text: string
  cite: string
}
```

`moralSpine.quote` carries `satisfies PhilosophyQuote` so the structural contract is typed. Phase 39's Obsidian renderer can detect this shape (text + cite) and emit `> [!quote]` callouts.

### `class="methodology-note"` — Preserved

The final paragraph of `AiClaritySection` keeps its `class="methodology-note"` binding; only the text node was replaced with `{{ aiClarity.methodologyNote }}`. This maintains the distinct CSS treatment while decoupling the prose.

## Execution Order Notes

Per the plan strategy, child components were refactored first (Task 2) before the page (Task 3). This ensured the existing 127 unit tests could validate each component independently at every step. Test counts remained steady at 127 through all three task commits.

## Verification Results

- `npx vue-tsc -b --force` — clean (exit 0) after each task
- `npm run test:unit` — 127 tests passing (11 test files) after each task
- `npm run build` — clean production build (exit 0) after Task 3
- `grep -c "Moe Howard" src/components src/pages` — 0 (prose fully extracted)
- `grep -c "Moe Howard" src/content` — 1 (in `philosophy.ts`)
- `grep -c "Near the end of Myst" src/components/Pattern158OriginSection.vue` — 0
- `grep -c "Deconstruct the Chaos" src/components/HowIWorkSection.vue` — 0
- `grep -c "On AI and This Site" src/components/AiClaritySection.vue` — 0
- `grep -c "<blockquote>" src/pages/PhilosophyPage.vue` — 1 (preserved)
- `grep -c "<cite>" src/pages/PhilosophyPage.vue` — 1 (preserved)
- `grep -c "v-html" src/pages/PhilosophyPage.vue src/components/*.vue` — 0

## Deviations from Plan

None — plan executed exactly as written.

No auto-fix rules triggered. No authentication gates. No architectural decisions required. No new dependencies added. The plan's interface transcriptions in `<interfaces>` were used verbatim (with unicode escape normalization).

## Scope Boundary Notes

Story files `src/components/InfluencesList.stories.ts` and `src/components/MethodologyStep.stories.ts` still contain prose fragments matching "Moe Howard" and "Deconstruct the Chaos". These story files are NOT in this plan's `files_modified` list and are out of scope for Plan 037-02. They are stories for different components (`InfluencesList`, `MethodologyStep`) that use local story-fixture data, not the refactored `philosophyInfluences` data source or the new `methodologySteps` content module. If Phase 37 or a follow-up plan wants to consolidate those fixtures, it should be scoped explicitly.

## Commits

| Task | Description | Commit |
|---|---|---|
| 1 | Extract 3 section content modules | `159c759` |
| 2 | Refactor 3 section SFCs to consume modules | `29ddc4b` |
| 3 | Create philosophy.ts + refactor PhilosophyPage.vue | `3998013` |

## Known Stubs

None. All extracted content is wired to the new modules; no placeholder or empty-array rendering paths introduced.

## Self-Check: PASSED

- FOUND: src/content/philosophy.ts
- FOUND: src/content/sections/pattern158Origin.ts
- FOUND: src/content/sections/howIWork.ts
- FOUND: src/content/sections/aiClarity.ts
- FOUND commit: 159c759
- FOUND commit: 29ddc4b
- FOUND commit: 3998013
- Tests: 127/127 passing
- Build: clean
