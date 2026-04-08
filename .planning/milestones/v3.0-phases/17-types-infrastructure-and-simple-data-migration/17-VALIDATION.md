---
phase: 17
slug: types-infrastructure-and-simple-data-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --project unit` |
| **Full suite command** | `npx vitest run --project unit && vue-tsc -b && npx vite build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit`
- **After every plan wave:** Run `npx vitest run --project unit && vue-tsc -b && npx vite build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | TYPE-01 | unit | `npx vitest run --project unit` | ✅ | ⬜ pending |
| 17-01-02 | 01 | 1 | TYPE-02 | unit | `npx vitest run --project unit` | ✅ | ⬜ pending |
| 17-01-03 | 01 | 1 | TYPE-03 | unit | `npx vitest run --project unit` | ✅ | ⬜ pending |
| 17-02-01 | 02 | 2 | SMPL-01 | unit+build | `npx vitest run --project unit && npx vite build` | ✅ | ⬜ pending |
| 17-02-02 | 02 | 2 | SMPL-02 | unit+build | `npx vitest run --project unit && npx vite build` | ✅ | ⬜ pending |
| 17-02-03 | 02 | 2 | SMPL-03 | unit+build | `npx vitest run --project unit && npx vite build` | ✅ | ⬜ pending |
| 17-02-04 | 02 | 2 | SMPL-04 | unit+build | `npx vitest run --project unit && npx vite build` | ✅ | ⬜ pending |
| 17-02-05 | 02 | 2 | SMPL-05 | unit+build | `npx vitest run --project unit && npx vite build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. 64 unit tests already pass. No new test framework or fixtures needed.

---

## Manual-Only Verifications

All phase behaviors have automated verification. Type safety is verified by `vue-tsc -b`, data integrity by existing unit tests, and build correctness by `vite build`.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
