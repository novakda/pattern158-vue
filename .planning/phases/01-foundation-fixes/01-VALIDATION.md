---
phase: 1
slug: foundation-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.x |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | A11Y-01 | manual | Browser DevTools check for nested `<main>` | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | — | integration | `npx vitest run` (smoke test) | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | — | manual | Navigate to `/does-not-exist` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — test configuration with browser and happy-dom projects
- [ ] `vitest-browser-vue` + `happy-dom` — install missing test packages
- [ ] One smoke test file to verify infrastructure works

*Test infrastructure is Phase 1 scope — Wave 0 and implementation overlap.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No nested `<main>` in TechnologiesPage, ContactPage, HomePage | A11Y-01 | HTML structure validation requires rendered DOM | Open each page in browser, inspect DOM for single `<main>` |
| NotFoundPage renders on unknown routes | — | Route catch-all requires navigation test | Navigate to `/does-not-exist`, verify NotFoundPage displays |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
