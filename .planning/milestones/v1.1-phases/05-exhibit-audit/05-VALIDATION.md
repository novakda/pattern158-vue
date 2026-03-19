---
phase: 5
slug: exhibit-audit
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4 (projects array API) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | AUDIT-01 | manual | `ls .planning/phases/05-exhibit-audit/05-01-AUDIT.md` | ❌ W0 | ⬜ pending |
| 5-01-02 | 01 | 1 | AUDIT-02 | manual | human review of classification column | ❌ W0 | ⬜ pending |
| 5-01-03 | 01 | 1 | AUDIT-01 | regression | `npx vitest run` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed — Phase 5 adds no application code.

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Audit document covers all 15 exhibits with structured comparison table | AUDIT-01 | Document completeness and accuracy is a human-review deliverable — automated tests cannot verify table correctness | Open `.planning/phases/05-exhibit-audit/05-01-AUDIT.md`, confirm all 15 exhibits present, all section columns filled |
| Every row in comparison table has a Classification value | AUDIT-02 | Classification correctness (intentional vs formatting-inconsistency vs content-gap) requires human judgment | Scan the Classification column — no row should be empty or "TBD" |
| Audit is readable as a standalone document | AUDIT-01 | Readability is a human judgment | Read the document cold — could Dan understand the scope of normalization work without additional context? |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
