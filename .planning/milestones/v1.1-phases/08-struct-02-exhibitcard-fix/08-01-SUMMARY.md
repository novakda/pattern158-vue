---
phase: 08-struct-02-exhibitcard-fix
plan: "01"
subsystem: ExhibitCard
tags: [tdd, bug-fix, cta-text, struct-02, storybook, traceability]
dependency_graph:
  requires: []
  provides: [STRUCT-02 closure, ExhibitCard CTA text correctness]
  affects: [src/components/ExhibitCard.vue, src/components/ExhibitCard.test.ts, src/components/ExhibitCard.stories.ts]
tech_stack:
  added: []
  patterns: [TDD RED/GREEN, RouterLink slot-rendering stub for text assertions]
key_files:
  created:
    - src/components/ExhibitCard.test.ts
  modified:
    - src/components/ExhibitCard.vue
    - src/components/ExhibitCard.stories.ts
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md
decisions:
  - "RouterLink stub must use slot-rendering template (<a><slot /></a>) — boolean true stub suppresses slot text and makes CTA assertions impossible"
  - "All 3 tests failed in RED phase (not just Test 1) because the ternary is fully inverted — both directions of the bug triggered failures; this is acceptable RED state"
metrics:
  duration: 3 minutes
  completed: "2026-03-19"
---

# Phase 8 Plan 01: Fix ExhibitCard CTA Text Inversion (STRUCT-02) Summary

**One-liner:** Fixed inverted investigationReport ternary in ExhibitCard.vue — true now shows 'View Full Investigation Report', false/absent shows 'View Investigation Report' — via TDD with slot-rendering RouterLink stub.

## What Was Built

- **ExhibitCard.test.ts** — 3 unit tests for STRUCT-02 CTA text behavior: emphatic CTA when investigationReport true, neutral CTA when false, neutral CTA when absent (undefined)
- **ExhibitCard.vue line 55** — ternary operands swapped; correct semantics restored
- **ExhibitCard.stories.ts** — two new named exports: InvestigationReport (investigationReport: true) and StandardExhibit (investigationReport: false) showing CTA distinction in Storybook
- **REQUIREMENTS.md** — STRUCT-02 marked [x] Complete; traceability table updated; coverage note updated
- **ROADMAP.md** — Phase 8 plan marked complete; progress row updated 0/1 → 1/1 Complete; v1.1 milestone extended to Phases 5-8

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write failing ExhibitCard unit tests (RED) | 440f97a | src/components/ExhibitCard.test.ts |
| 2 | Fix ExhibitCard.vue line 55 and update Storybook stories (GREEN) | 7911fd7 | src/components/ExhibitCard.vue, src/components/ExhibitCard.stories.ts |
| 3 | Close STRUCT-02 traceability (REQUIREMENTS.md, ROADMAP.md) | a8dc0b6 | .planning/REQUIREMENTS.md, .planning/ROADMAP.md |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] RouterLink stub pattern adjusted for slot text visibility**
- **Found during:** Task 1 (RED phase)
- **Issue:** The plan specified `stubs: { RouterLink: true }` (boolean) in global stubs, but a boolean true stub replaces the component with an empty element — suppressing all slot content including the CTA text. This made it impossible to assert on `wrapper.text()` for link text.
- **Fix:** Changed all three test cases to use `RouterLink: { template: '<a><slot /></a>' }` as the stub value, matching the pattern already present in the `vi.mock` call at the top of the test file.
- **Files modified:** src/components/ExhibitCard.test.ts
- **Commit:** 440f97a

## Verification Results

- Full unit suite: 20/20 tests passing (5 test files)
- ExhibitCard tests: 3/3 passing
- CTA ternary fix confirmed: `grep "investigationReport ? 'View Full Investigation Report'"` returns 1 match
- Storybook exports confirmed: InvestigationReport and StandardExhibit exports present
- Traceability confirmed: STRUCT-02 [x] Complete in REQUIREMENTS.md; Phase 8 1/1 Complete in ROADMAP.md

## Self-Check: PASSED
