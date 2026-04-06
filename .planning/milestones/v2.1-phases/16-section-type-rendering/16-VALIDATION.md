---
phase: 16
slug: section-type-rendering
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.x with happy-dom |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | SECT-01 | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts` | Exists (needs new tests) | ⬜ pending |
| 16-01-02 | 01 | 1 | SECT-02 | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts` | Exists (needs new tests) | ⬜ pending |
| 16-01-03 | 01 | 1 | SECT-03 | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts` | Exists (needs new tests) | ⬜ pending |
| 16-01-04 | 01 | 1 | SECT-04 | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts` | Exists (needs new tests) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Add timeline rendering tests to `InvestigationReportLayout.test.ts` (Exhibit A has 4 timelines, Exhibit J has 1)
- [ ] Add metadata rendering tests to both layout test files (all exhibits have metadata)
- [ ] Add flow rendering test to `EngineeringBriefLayout.test.ts` (Exhibit L has flow)
- [ ] Add empty-section suppression tests to both layout test files (synthetic data with empty arrays)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Timeline visual styling (vertical line, markers) | SECT-01 | CSS visual rendering | Open exhibit A detail page, verify timeline has vertical line and dot markers |
| Flow horizontal arrow layout | SECT-03 | CSS flex layout visual | Open exhibit L detail page, verify steps display horizontally with arrows |
| Metadata card grid responsiveness | SECT-02 | Responsive layout | Open any exhibit detail page, resize browser, verify cards reflow |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
