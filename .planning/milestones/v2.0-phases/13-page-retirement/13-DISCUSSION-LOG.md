# Phase 13: Page Retirement - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 13-page-retirement
**Areas discussed:** Deletion scope, Redirect cleanup, CSS cleanup

---

## Deletion Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Delete all 7 | PortfolioPage.vue, TestimonialsPage.vue, FlagshipCard.vue, TestimonialsMetrics.vue, plus their 3 Storybook stories. All orphaned. | ✓ |
| Keep TestimonialsMetrics | Relocate to another page in a future pass. Everything else deleted. | |
| You decide | Claude evaluates each file for safety. | |

**User's choice:** Delete all 7
**Notes:** Clean sweep — no files worth preserving.

---

## Redirect Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Keep redirects | Old URLs may be bookmarked or indexed. Two lines of config, zero runtime cost. | ✓ |
| Remove redirects | Clean slate — old URLs hit catch-all/404. | |
| You decide | Claude evaluates based on evidence of external links. | |

**User's choice:** Keep redirects
**Notes:** Cheap insurance for bookmarks and SEO.

---

## CSS Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Remove dead CSS | Delete all .page-portfolio and .page-testimonials scoped rules (~100+ rules). Smaller bundle. | ✓ |
| Leave CSS for now | Delete only Vue/TS files. CSS cleanup in separate pass. | |
| You decide | Claude confirms which blocks are truly orphaned before removing. | |

**User's choice:** Remove dead CSS
**Notes:** Full cleanup — no reason to keep dead rules.

---

## Claude's Discretion

- Order of operations (file deletion vs CSS cleanup sequence)
- Whether to scan for additional orphaned CSS beyond the two page scopes
- Verification approach (build, grep, tests)

## Deferred Ideas

- Storybook stories for CaseFilesPage (REF-01, v2.x)
- Broader CSS dead code audit beyond these two page scopes
