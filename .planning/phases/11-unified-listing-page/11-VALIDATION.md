---
phase: 11
slug: unified-listing-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (happy-dom for unit) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --project unit` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --project unit`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | LIST-03 | unit | `npx vitest run src/components/ExhibitCard.test.ts -t "type class"` | ❌ W0 | ⬜ pending |
| 11-02-01 | 02 | 1 | LIST-01 | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "renders all 15"` | ❌ W0 | ⬜ pending |
| 11-02-02 | 02 | 1 | LIST-02 | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "grouped"` | ❌ W0 | ⬜ pending |
| 11-02-03 | 02 | 1 | LIST-04 | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "stats"` | ❌ W0 | ⬜ pending |
| 11-02-04 | 02 | 1 | LIST-05 | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "directory"` | ❌ W0 | ⬜ pending |
| 11-02-05 | 02 | 1 | CLN-01 | unit | `npx vitest run src/pages/CaseFilesPage.test.ts -t "no Three Lenses"` | ❌ W0 | ⬜ pending |
| 11-03-01 | 03 | 2 | CLN-02 | manual | `ls src/components/NarrativeCard*` returns nothing | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/pages/CaseFilesPage.test.ts` — stubs for LIST-01, LIST-02, LIST-04, LIST-05, CLN-01
- [ ] Update `src/components/ExhibitCard.test.ts` — add test for type class (LIST-03)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| NarrativeCard files deleted | CLN-02 | File deletion, not testable via unit | Run `ls src/components/NarrativeCard*` — should return "No such file" |
| Border accent colors render correctly | LIST-03 | Visual verification of color correctness | Open CaseFilesPage in browser, verify IR cards have gray left border, EB cards have teal left border |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
