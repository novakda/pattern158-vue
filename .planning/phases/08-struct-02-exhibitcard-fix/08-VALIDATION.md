---
phase: 8
slug: struct-02-exhibitcard-fix
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --project unit src/components/ExhibitCard.test.ts` |
| **Full suite command** | `npx vitest run --project unit` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit src/components/ExhibitCard.test.ts`
- **After every plan wave:** Run `npx vitest run --project unit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 0 | STRUCT-02 | unit | `npx vitest run --project unit src/components/ExhibitCard.test.ts` | ❌ W0 | ⬜ pending |
| 8-01-02 | 01 | 1 | STRUCT-02 | unit | `npx vitest run --project unit src/components/ExhibitCard.test.ts` | ✅ after W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/ExhibitCard.test.ts` — TDD stubs for STRUCT-02: two test cases (`investigationReport: true` → "View Full Investigation Report", `investigationReport: false` → "View Investigation Report")

*Note: Wave 0 creates the test file in failing (RED) state. Wave 1 fixes the source to make tests GREEN.*

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
