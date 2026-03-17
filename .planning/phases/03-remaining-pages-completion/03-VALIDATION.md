---
phase: 3
slug: remaining-pages-completion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 3 — Validation Strategy

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
| TBD | TBD | TBD | PAGE-02 through PAGE-07 | visual + content | `grep -r 'TODO' src/pages/` returns 0 | ✅ | ⬜ pending |
| TBD | TBD | TBD | COMP-03 | line-count | `wc -l src/pages/*.vue` all under 50 | ✅ | ⬜ pending |
| TBD | TBD | TBD | COMP-01 | grep | `grep -r '\.html"' src/pages/` returns 0 | ✅ | ⬜ pending |
| TBD | TBD | TBD | STORY-01 | storybook | `npx storybook build` exits 0 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual parity at 375px/768px/1280px | PAGE-02–07 | Requires visual comparison with live 11ty site | Open each page at each breakpoint, compare with live site in both light and dark themes |
| Dark mode rendering | COMP-04 | CSS custom property theming requires visual check | Toggle theme on each page, verify no broken colors or layout |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
