---
phase: 9
slug: data-model-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vite.config.ts` (inline vitest config) |
| **Quick run command** | `npx vitest run --project unit` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 0 | DATA-01, DATA-02 | unit | `npx vitest run src/data/exhibits.test.ts` | Exists, needs new assertions | ⬜ pending |
| 09-01-02 | 01 | 1 | DATA-01 | unit+compile | `npx vue-tsc --noEmit` | ✅ | ⬜ pending |
| 09-01-03 | 01 | 1 | DATA-02 | unit | `npx vitest run src/data/exhibits.test.ts` | Needs new assertions | ⬜ pending |
| 09-02-01 | 02 | 1 | DATA-03 | unit | `npx vitest run src/data/exhibits.test.ts` | Needs new assertions | ⬜ pending |
| 09-03-01 | 03 | 2 | DATA-01 | unit | `npx vitest run src/components/ExhibitCard.test.ts` | ✅ needs update | ⬜ pending |
| 09-03-02 | 03 | 2 | DATA-01 | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | ✅ needs update | ⬜ pending |
| 09-04-01 | 04 | 3 | DATA-04 | compile | `npx vitest run` (full suite green) | Implicit via compilation | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/exhibits.test.ts` — new assertions: all 15 have `exhibitType`, exactly 5 `investigation-report`, exactly 10 `engineering-brief`, no `isDetailExhibit` or `investigationReport` on interface
- [ ] `src/data/exhibits.test.ts` — new assertions: 9 flagship exhibits have `isFlagship: true` and `summary` field
- [ ] `src/components/ExhibitCard.test.ts` — updated test data: replace `investigationReport` with `exhibitType` in `baseExhibit`
- [ ] `src/pages/ExhibitDetailPage.test.ts` — add engineering-brief badge test alongside existing investigation-report badge test

*Wave 0 tests will initially FAIL (red) — they define the target state before implementation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Badge visual styling (colors) | DATA-01, D-14, D-15 | CSS color rendering requires visual inspection | Open exhibit detail page for both types; verify distinct badge colors |
| CTA text on ExhibitCard | D-13 | Wording quality is subjective | View gallery; confirm investigation-report says "View Full Investigation Report" and engineering-brief has appropriate CTA |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
