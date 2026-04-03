---
phase: 18
slug: personnelcard-component
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 18 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 with happy-dom |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --project unit src/components/PersonnelCard.test.ts` |
| **Full suite command** | `npx vitest run --project unit` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit src/components/PersonnelCard.test.ts`
- **After every plan wave:** Run `npx vitest run --project unit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 18-01-01 | 01 | 1 | RNDR-01 | unit | `npx vitest run --project unit src/components/PersonnelCard.test.ts` | ❌ W0 | ⬜ pending |
| 18-01-02 | 01 | 1 | RNDR-02 | unit | `npx vitest run --project unit src/components/PersonnelCard.test.ts` | ❌ W0 | ⬜ pending |
| 18-01-03 | 01 | 1 | RNDR-03 | unit | `npx vitest run --project unit src/components/PersonnelCard.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/PersonnelCard.test.ts` — stubs for RNDR-01, RNDR-02, RNDR-03
- Framework and test utils already installed and configured

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive grid flows from 1-3 columns | D-02 | CSS grid responsiveness requires visual viewport testing | Resize browser from 320px to 1200px, verify column count changes |
| Self-entry visual distinction is noticeable | RNDR-03 | Subjective visual prominence | Navigate to Exhibit A detail page, confirm isSelf entry stands out from others |
| Anonymous title-as-name styling signals role not name | RNDR-02 | Subjective visual signal | Navigate to Exhibit A, confirm anonymous entries look distinct from named entries |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
