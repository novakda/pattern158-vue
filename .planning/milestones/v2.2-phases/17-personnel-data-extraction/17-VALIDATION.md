---
phase: 17
slug: personnel-data-extraction
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --project unit src/data/exhibits.test.ts` |
| **Full suite command** | `npx vitest run --project unit` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit src/data/exhibits.test.ts`
- **After every plan wave:** Run `npx vitest run --project unit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | DATA-01 | unit | `npx vitest run --project unit src/data/exhibits.test.ts` | Needs new tests | ⬜ pending |
| 17-01-02 | 01 | 1 | DATA-02 | unit | same | Needs new tests | ⬜ pending |
| 17-01-03 | 01 | 1 | DATA-03 | unit | same | Needs new tests | ⬜ pending |
| 17-01-04 | 01 | 1 | DATA-04 | unit | same | Needs new tests | ⬜ pending |
| 17-01-05 | 01 | 1 | DATA-05 | unit | same | Needs new tests | ⬜ pending |
| 17-01-06 | 01 | 1 | DATA-06 | unit | same | Needs new tests | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/exhibits.test.ts` — needs new `describe` blocks for DATA-01 through DATA-06
- No new test files needed — existing test file covers the data layer

*Existing infrastructure covers framework installation.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
