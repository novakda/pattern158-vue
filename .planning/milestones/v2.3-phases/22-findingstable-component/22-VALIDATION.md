---
phase: 22
slug: findingstable-component
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 22 — Validation Strategy

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
| 22-01-01 | 01 | 1 | RNDR-01 | unit | `npx vitest run src/components/FindingsTable.test.ts` | ✅ | ⬜ pending |
| 22-01-02 | 01 | 1 | RNDR-02 | unit | `npx vitest run src/components/FindingsTable.test.ts` | ✅ | ⬜ pending |
| 22-01-03 | 01 | 1 | RNDR-03 | unit | `npx vitest run src/components/FindingsTable.test.ts` | ✅ | ⬜ pending |
| 22-01-04 | 01 | 1 | RNDR-04 | unit | `npx vitest run src/components/FindingsTable.test.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual appearance of severity badges | RNDR-04 | CSS color rendering | Open Storybook, verify badge colors in light/dark modes |
| Responsive breakpoint switching | RNDR-02 | CSS media query | Resize browser window below 768px, verify table hides and cards show |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
