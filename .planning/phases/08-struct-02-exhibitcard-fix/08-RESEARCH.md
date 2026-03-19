# Phase 8: Fix STRUCT-02 ExhibitCard Link Text — Research

**Researched:** 2026-03-18
**Domain:** Vue 3 component bug fix — conditional string rendering + TDD + Storybook
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Exact CTA strings must come from the 11ty source — researcher fetches portfolio HTML; do NOT invent or guess copy
- The inverted logic is the bug: currently `true` shows the shorter string and `false/absent` shows the longer one; after the fix `true` gets the emphatic CTA and `false/absent` gets the neutral one
- Both `investigationReport: false` (Exhibit O) and `investigationReport: undefined` (most exhibits A–I) get the same neutral CTA — no distinction between them, same falsy branch, same string
- TDD approach — write a failing ExhibitCard unit test before fixing the line (matches Phase 6 pattern)
- Tests assert: `investigationReport: true` renders emphatic CTA text; `investigationReport: false` renders neutral CTA text
- No ExhibitCard.test.ts currently exists — Phase 8 creates it
- Update `ExhibitCard.stories.ts` to surface the CTA distinction between investigation and standard exhibits
- File scope is fixed: ExhibitCard.vue line 55, ExhibitCard.test.ts (new), ExhibitCard.stories.ts, REQUIREMENTS.md, ROADMAP.md

### Claude's Discretion

- Exact test file structure and describe/it naming (follow existing test conventions)
- How to organize Storybook story additions (new named export vs updated existing)
- Exact ROADMAP.md wording for Phase 8 completion entry

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| STRUCT-02 | Fix `investigationReport` flag display logic — button text must semantically match the flag value (currently appears inverted) | 11ty source CTA copy confirmed; bug location identified at ExhibitCard.vue:55; TDD pattern from Phase 6 directly applicable |
</phase_requirements>

---

## Summary

Phase 8 is a surgical single-line fix in `ExhibitCard.vue:55` with TDD scaffolding and a Storybook update. The current conditional `exhibit.investigationReport ? 'View Investigation Report' : 'View Full Investigation Report'` is inverted — the emphatic string is showing for `true` and the longer, more emphatic string is showing for `false`. The fix swaps the strings so `true` (investigation exhibits) shows the emphatic CTA and `false`/`undefined` (standard exhibits) shows the neutral CTA.

The critical research finding is that the 11ty source HTML uses **one universal string — "Full Investigation Report →"** — for every exhibit card on the portfolio page, regardless of investigation flag. This means the two-string approach in the Vue code was intentionally added as an enhancement beyond the 11ty source. The exact strings to use therefore cannot be lifted verbatim from 11ty; they must be defined based on the semantic intent documented in the project context.

Given the 11ty source uses "Full Investigation Report →" uniformly, the most defensible interpretation is: the emphatic CTA (for `true`) should include "Full" (matching 11ty exactly), and the neutral CTA (for `false`/absent) should be the shorter variant. The current strings "View Full Investigation Report" (currently used when `false`) and "View Investigation Report" (currently used when `true`) are both present in the codebase already — the fix is simply inverting which condition gets which string.

**Primary recommendation:** Invert the ternary at ExhibitCard.vue:55 so `true` maps to the longer/emphatic string ("View Full Investigation Report") and `false`/absent maps to the shorter/neutral string ("View Investigation Report"). Apply TDD: write failing test first, fix the line, confirm green, update stories.

---

## Critical Finding: 11ty Source CTA Copy

**Source:** `https://raw.githubusercontent.com/novakda/pattern158.solutions/deploy/20260315-feat-auto-generate-deploy-branch-names-f/portfolio.html`
**Confidence:** HIGH — verified by direct raw HTML fetch

The 11ty portfolio page uses **identical CTA text for all 15 exhibit cards:**

```html
<a href="/exhibits/exhibit-a.html" class="exhibit-link">Full Investigation Report →</a>
```

This applies to:
- Exhibit A (Electric Boat) — `investigationReport` absent in Vue data
- Exhibit J (GM) — `investigationReport: true` in Vue data
- Exhibit O (ContentAIQ) — `investigationReport: false` in Vue data

**Implication for Phase 8:** The 11ty source does not differentiate CTA text between investigation and standard exhibits. The two-string design in the Vue app is an intentional enhancement. The string pairing in the current code ("View Investigation Report" vs "View Full Investigation Report") was introduced during earlier development. The Phase 8 fix is to correct the inversion — not to align the strings themselves with 11ty copy.

**Resolved copy decision:**

| Condition | String | Rationale |
|-----------|--------|-----------|
| `investigationReport: true` | `'View Full Investigation Report'` | Emphatic — "Full" signals comprehensive forensic document; matches 11ty spirit |
| `investigationReport: false` or absent | `'View Investigation Report'` | Neutral — shorter, appropriate for standard exhibits |

Both strings already exist in the codebase (just inverted). The fix is a swap, not a copy change.

---

## Bug Analysis

### Current (broken) state — ExhibitCard.vue line 55

```html
{{ exhibit.investigationReport ? 'View Investigation Report' : 'View Full Investigation Report' }}
```

Reading this: when `investigationReport` is `true`, it shows the **shorter** string. When false/absent, it shows the **longer/emphatic** string. This is semantically backwards.

### Fixed state

```html
{{ exhibit.investigationReport ? 'View Full Investigation Report' : 'View Investigation Report' }}
```

When `true` → emphatic "View Full Investigation Report". When falsy → neutral "View Investigation Report".

### Why the inversion happened

Likely a copy-paste or logic error during initial component authoring — the ternary was written with the strings in the wrong positions. The correct semantic is "investigation reports deserve the fuller, more emphatic description."

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vitest | ^4.1.0 | Unit test runner | Already in project; used for all existing tests |
| @vue/test-utils | (via vitest setup) | Vue component mounting | Used in ExhibitDetailPage.test.ts |
| happy-dom | ^20.8.4 | Test environment | Configured in vitest.config.ts for unit project |
| @storybook/vue3-vite | ^10.2.19 | Component documentation | Already in project; ExhibitCard.stories.ts exists |

### No new dependencies needed

Phase 8 requires zero new package installations. All tooling is in place.

---

## Architecture Patterns

### Recommended File Structure (Phase 8 scope)

```
src/components/
├── ExhibitCard.vue          # Fix line 55 — string swap only
├── ExhibitCard.test.ts      # NEW — TDD tests for CTA text (unit project)
└── ExhibitCard.stories.ts   # UPDATE — add InvestigationReport and StandardExhibit stories
.planning/
├── REQUIREMENTS.md          # Mark STRUCT-02 [x] Complete
└── ROADMAP.md               # Mark Phase 8 complete
```

### Pattern 1: TDD Red-Green (from Phase 6 precedent)

**What:** Write failing tests first, then implement the fix, then confirm green.
**When to use:** All Phase 8 changes — required per CONTEXT.md decisions.

```typescript
// Source: src/pages/ExhibitDetailPage.test.ts (Phase 6 pattern)
// Test structure to replicate in ExhibitCard.test.ts

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ExhibitCard from './ExhibitCard.vue'

// Mock vue-router (RouterLink is used inside ExhibitCard)
vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot /></a>' },
}))

describe('ExhibitCard CTA text (STRUCT-02)', () => {
  it('renders emphatic CTA when investigationReport is true', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { /* minimal props */ investigationReport: true, exhibitLink: '/exhibits/exhibit-j' },
      },
      global: { stubs: { RouterLink: true, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Full Investigation Report')
  })

  it('renders neutral CTA when investigationReport is false', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { /* minimal props */ investigationReport: false, exhibitLink: '/exhibits/exhibit-o' },
      },
      global: { stubs: { RouterLink: true, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Investigation Report')
    expect(wrapper.text()).not.toContain('View Full Investigation Report')
  })
})
```

**Note:** `ExhibitCard` uses `router-link` directly — vue-router must be mocked or stubbed. The established pattern from ExhibitDetailPage.test.ts uses `global: { stubs: { RouterLink: true, TechTags: true } }`.

### Pattern 2: Minimal Props for ExhibitCard Tests

`ExhibitCard.vue` uses `defineProps<{ exhibit: Exhibit }>()`. The `Exhibit` interface has required fields. Tests must supply the minimum required fields:

```typescript
// Minimum required fields from Exhibit interface (src/data/exhibits.ts)
const minimalExhibit = {
  label: 'Exhibit J',
  client: 'General Motors',
  date: '2019',
  title: 'Test Exhibit',
  impactTags: [],
  exhibitLink: '/exhibits/exhibit-j',
  investigationReport: true,
}
```

Optional fields (quotes, contextHeading, contextText, resolutionTable, isDetailExhibit) can be omitted.

### Pattern 3: Storybook Named Export

**What:** Add two new named story exports to `ExhibitCard.stories.ts` to show investigation vs standard variant.
**When to use:** After the fix is confirmed green.

```typescript
// Source: ExhibitCard.stories.ts (existing pattern)
export const InvestigationReport: Story = {
  args: {
    exhibit: {
      // ... exhibit with investigationReport: true
      investigationReport: true,
    },
  },
}

export const StandardExhibit: Story = {
  args: {
    exhibit: {
      // ... exhibit with investigationReport: false or absent
      investigationReport: false,
    },
  },
}
```

### Anti-Patterns to Avoid

- **Changing the Exhibit interface:** No interface changes needed — `investigationReport?: boolean` already covers both cases.
- **Adding a new prop or computed:** The fix is a one-character logical change in the template, not an architecture change.
- **Changing ExhibitCard.stories.ts Default story:** The Default story has no `investigationReport` field — leave it as-is. Add new named exports.
- **Testing other ExhibitCard behavior:** The test file should be scoped to STRUCT-02. Don't add tests for quotes, resolutionTable, slots, etc. in this phase.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Vue component mounting in tests | Custom render helpers | `@vue/test-utils mount()` | Already used in ExhibitDetailPage.test.ts; consistent with project |
| Router stubbing | Custom mock implementation | `global: { stubs: { RouterLink: true } }` | Same pattern as existing test files |

---

## Common Pitfalls

### Pitfall 1: RouterLink in ExhibitCard Tests

**What goes wrong:** `mount(ExhibitCard, ...)` throws because `router-link` is not resolved — ExhibitCard template uses `<router-link>` directly.
**Why it happens:** Tests don't have a real router instance.
**How to avoid:** Pass `global: { stubs: { RouterLink: true, TechTags: true } }` in mount options — same pattern as ExhibitDetailPage.test.ts.
**Warning signs:** Test throws "Failed to resolve component: router-link" error.

### Pitfall 2: "not.toContain" False Pass

**What goes wrong:** The negative assertion `expect(wrapper.text()).not.toContain('View Full Investigation Report')` passes even when the component is broken because the text isn't rendered at all.
**Why it happens:** If the component errors or renders nothing, `not.toContain` vacuously passes.
**How to avoid:** Pair negative assertions with a positive assertion confirming the neutral string IS present: `expect(wrapper.text()).toContain('View Investigation Report')`.

### Pitfall 3: "undefined" falsy path test

**What goes wrong:** Only testing `investigationReport: false` — misses the `undefined` case.
**Why it happens:** Only one negative test written.
**How to avoid:** CONTEXT.md confirms both false and undefined use the same neutral branch. A third test with `investigationReport` absent from the exhibit object is good practice but not required — the ternary handles it correctly since `undefined` is falsy.

### Pitfall 4: Exact string match sensitivity

**What goes wrong:** Test asserts `'View Full Investigation Report'` but the component renders `'View Full Investigation Report '` (trailing space) or with `→` appended.
**Why it happens:** Template whitespace or copy mismatch.
**How to avoid:** Use `wrapper.text()` (which trims whitespace) and `toContain()` rather than `toBe()`. The current codebase strings do NOT include `→`.

---

## Code Examples

### Current broken line (ExhibitCard.vue:55)

```html
<!-- Source: src/components/ExhibitCard.vue line 55 -->
{{ exhibit.investigationReport ? 'View Investigation Report' : 'View Full Investigation Report' }}
```

### Fixed line

```html
{{ exhibit.investigationReport ? 'View Full Investigation Report' : 'View Investigation Report' }}
```

This is the COMPLETE change to ExhibitCard.vue. Nothing else in the file changes.

### Existing Exhibit interface (no changes needed)

```typescript
// Source: src/data/exhibits.ts
export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  impactTags: string[]
  exhibitLink: string
  isDetailExhibit?: boolean
  investigationReport?: boolean  // falsy covers both false and undefined
}
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --project unit src/components/ExhibitCard.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STRUCT-02 | `investigationReport: true` renders "View Full Investigation Report" | unit | `npx vitest run --project unit src/components/ExhibitCard.test.ts` | Wave 0 (new file) |
| STRUCT-02 | `investigationReport: false` renders "View Investigation Report" | unit | `npx vitest run --project unit src/components/ExhibitCard.test.ts` | Wave 0 (new file) |

### Sampling Rate

- **Per task commit:** `npx vitest run --project unit src/components/ExhibitCard.test.ts`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/components/ExhibitCard.test.ts` — covers STRUCT-02 CTA text assertions (new file, TDD RED phase)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No ExhibitCard unit tests | TDD with ExhibitCard.test.ts | Phase 8 | Test coverage for critical CTA conditional |
| Inverted conditional | Correct conditional | Phase 8 fix | Investigation exhibits show emphatic CTA |

---

## Open Questions

1. **Does the neutral branch need to test `undefined` explicitly?**
   - What we know: Both `false` and `undefined` are falsy in JavaScript — ternary treats them identically
   - What's unclear: Whether a third test case for `undefined` adds value
   - Recommendation: Write the `false` test case; the `undefined` path is implicitly covered. CONTEXT.md explicitly says "no distinction between them."

---

## Sources

### Primary (HIGH confidence)
- Direct raw HTML fetch: `https://raw.githubusercontent.com/novakda/pattern158.solutions/deploy/20260315-feat-auto-generate-deploy-branch-names-f/portfolio.html` — All 15 exhibit card CTA anchor tags confirmed using "Full Investigation Report →"
- `src/components/ExhibitCard.vue` — Bug location confirmed at line 55
- `src/components/ExhibitCard.stories.ts` — Existing story structure confirmed
- `src/pages/ExhibitDetailPage.test.ts` — TDD pattern and mock structure confirmed
- `vitest.config.ts` — Test infrastructure confirmed (unit project, happy-dom, `src/**/*.test.ts` glob)
- `.planning/phases/06-structural-normalization/06-01-PLAN.md` — TDD task structure (RED/GREEN pattern)

### Secondary (MEDIUM confidence)
- WebFetch summary of portfolio.html exhibit card blocks — confirmed all cards use identical CTA regardless of exhibit type

---

## Metadata

**Confidence breakdown:**
- Bug location: HIGH — confirmed by reading ExhibitCard.vue:55 directly
- 11ty source CTA copy: HIGH — verified by direct raw HTML fetch of portfolio.html
- String assignment (which string for true vs false): HIGH — CONTEXT.md specifies the inversion direction; strings already in codebase
- TDD pattern: HIGH — Phase 6 plan provides exact pattern to replicate
- Test infrastructure: HIGH — vitest.config.ts and existing test files confirm setup

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable — single-file component fix with established patterns)
