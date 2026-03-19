---
phase: 7
slug: content-gap-fill
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- src/data/exhibits.test.ts` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- src/data/exhibits.test.ts`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | CONT-01 | manual | — | ✅ | ⬜ pending |
| 7-02-01 | 02 | 2 | CONT-02 | unit | `npm run test -- src/data/exhibits.test.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. `exhibits.test.ts` already exists and validates data shape. No new test stubs needed for CONT-01 (artifact creation) or CONT-02 (data additions verified by existing tests).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gap list produced and presented to Dan | CONT-01 | Human approval gate — checkboxes in 07-01-GAPS.md | Verify 07-01-GAPS.md exists with at least one checkbox item per exhibit (A, C, D, G) |
| Approved items only are implemented | CONT-02 | Requires reading checkbox state from 07-01-GAPS.md | Confirm no content in exhibits.ts that isn't on the approved list |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
