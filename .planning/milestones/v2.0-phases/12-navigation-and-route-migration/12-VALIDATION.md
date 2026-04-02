---
phase: 12
slug: navigation-and-route-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 |
| **Config file** | vite.config.ts |
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
| 12-01-01 | 01 | 1 | NAV-02 | unit | `npx vitest run src/router.test.ts -t "case-files"` | ❌ W0 | ⬜ pending |
| 12-01-02 | 01 | 1 | NAV-03 | unit | `npx vitest run src/router.test.ts -t "redirect"` | ❌ W0 | ⬜ pending |
| 12-01-03 | 01 | 1 | NAV-01 | manual | Visual inspection of NavBar | N/A | ⬜ pending |
| 12-01-04 | 01 | 1 | NAV-05 | unit | `npx vitest run src/pages/ExhibitDetailPage.test.ts` | ✅ (needs update) | ⬜ pending |
| 12-01-05 | 01 | 1 | NAV-04 | unit | `npx vitest run` (all tests pass = no stale refs) | ✅ | ⬜ pending |
| 12-01-06 | 01 | 1 | CLN-04 | manual | Visual inspection of HomeHero CTA | N/A | ⬜ pending |
| 12-01-07 | 01 | 1 | CLN-05 | manual | Visual inspection of HomePage CTA | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/router.test.ts` — add tests for `/case-files` route existence and `/portfolio` + `/testimonials` redirect entries
- [ ] `src/pages/ExhibitDetailPage.test.ts` — update existing "Back to Portfolio" test to assert `[to="/case-files"]`

*Existing infrastructure covers most phase requirements. Only router redirect tests and one selector update needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| NavBar shows single "Case Files" entry | NAV-01 | No NavBar unit test exists | Open app, verify nav shows Home, Philosophy, FAQ, Technologies, Case Files, Contact |
| Homepage hero CTA points to Case Files | CLN-04 | No HomeHero unit test exists | Open homepage, verify secondary CTA reads "View Case Files" and links to /case-files |
| Homepage testimonial CTA points to Case Files | CLN-05 | No HomePage CTA unit test exists | Open homepage, scroll to testimonials, verify CTA reads "View All Case Files" and links to /case-files |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
