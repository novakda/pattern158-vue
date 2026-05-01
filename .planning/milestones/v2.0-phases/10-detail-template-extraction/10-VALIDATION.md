---
phase: 10
slug: detail-template-extraction
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | DTPL-04 | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | ✅ | ⬜ pending |
| 10-01-02 | 01 | 1 | DTPL-01 | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts` | ❌ W0 | ⬜ pending |
| 10-01-03 | 01 | 1 | DTPL-02, DTPL-03 | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/exhibit/InvestigationReportLayout.test.ts` — stubs for DTPL-01
- [ ] `src/components/exhibit/EngineeringBriefLayout.test.ts` — stubs for DTPL-02, DTPL-03

*Existing ExhibitDetailPage.test.ts covers dispatcher (DTPL-04) verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| IR layout shows NTSB-style sections | DTPL-01 | Visual layout verification | Navigate to an IR exhibit (e.g., /exhibits/exhibit-b), verify timeline/probable-cause sections visible |
| EB layout shows constraints-approach-results framing | DTPL-02, DTPL-03 | Visual framing verification | Navigate to an EB exhibit (e.g., /exhibits/exhibit-a), verify no forensic framing |
| Type badge visible in header | DTPL-01, DTPL-02 | Visual badge color check | Both IR and EB exhibits show correct badge text and color in header |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
