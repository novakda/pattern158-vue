---
phase: 21
slug: type-definition-data-extraction
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | DATA-01 | unit | `grep 'ExhibitFindingEntry' src/data/exhibits.ts` | ✅ | ⬜ pending |
| 21-01-02 | 01 | 1 | DATA-02 | unit | `grep 'findings?' src/data/exhibits.ts` | ✅ | ⬜ pending |
| 21-01-03 | 01 | 1 | DATA-03 | unit | `grep 'findingsHeading?' src/data/exhibits.ts` | ✅ | ⬜ pending |
| 21-01-04 | 01 | 1 | DATA-04 | unit | `npx vitest run --reporter=verbose` | ✅ | ⬜ pending |
| 21-01-05 | 01 | 1 | DATA-05 | unit | `grep 'findingsHeading' src/data/exhibits.ts` | ✅ | ⬜ pending |
| 21-01-06 | 01 | 1 | DATA-06 | unit | `npx vitest run --reporter=verbose` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

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
