---
phase: 4
slug: exhibit-detail-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4 (projects array API) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose src/data/exhibits.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/data/exhibits.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 0 | PAGE-03 | unit | `npx vitest run src/data/exhibits.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 0 | PAGE-03 | unit | `npx vitest run src/router.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 0 | PAGE-05 | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-04 | 01 | 1 | PAGE-03 | unit | `npx vitest run src/data/exhibits.test.ts` | ✅ | ⬜ pending |
| 4-01-05 | 01 | 1 | PAGE-03 | unit | `npx vitest run src/router.test.ts` | ✅ | ⬜ pending |
| 4-01-06 | 01 | 2 | PAGE-05 | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/exhibits.test.ts` — stubs for PAGE-03 (entry count = 15, all exhibitLinks valid)
- [ ] `src/router.test.ts` — stubs for PAGE-03 (/exhibits/:slug route registered before catch-all)
- [ ] `src/pages/ExhibitDetailPage.test.ts` — stubs for PAGE-05 (slug lookup, not-found redirect)

*All three test files are new (Wave 0 creates them); existing infrastructure (vitest.config.ts) already covers the unit project.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Storybook story renders ExhibitDetailPage prop variants | PAGE-05 | Browser visual inspection; Storybook stories are not covered by Vitest | Run `npm run storybook`, navigate to ExhibitDetailPage story, verify it renders without errors for multiple exhibit slugs |
| ExhibitCard router-link navigates to detail page | PAGE-05 | E2E navigation flow; no Playwright config in scope | Dev server: click any ExhibitCard or FlagshipCard link, confirm ExhibitDetailPage renders with correct exhibit content |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
