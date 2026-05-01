# Phase 10: Detail Template Extraction - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 10-detail-template-extraction
**Areas discussed:** Dispatcher pattern, Engineering Brief layout, Section ownership, Header & badge area

---

## Dispatcher Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic :is | Uses `<component :is>` with layout map — conventional dispatcher pattern | |
| v-if branches | Explicit v-if/v-else — matches codebase patterns, clear at a glance | ✓ |
| Route-level split | Two separate route entries per exhibit type — changes URL structure | |

**User's choice:** v-if branches
**Notes:** User asked why `:is` was initially recommended. After discussing trade-offs — `:is` scales for N types but adds abstraction; `v-if` is explicit and grepable — the recommendation was revised to `v-if` since the union is closed at two values (D-02 from Phase 9) and the codebase favors clarity over cleverness.

---

## Engineering Brief Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Reframe headings only | Same section engine with different heading labels (Constraints, Approach, Results) | |
| Distinct visual structure | Different section ordering, layout, or visual treatment | |
| You decide | Claude audits 10 EB exhibits' data patterns and designs layout to fit | ✓ |

**User's choice:** You decide (Claude's discretion)
**Notes:** None — user comfortable with Claude determining the best layout based on actual data patterns.

---

## Section Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Layouts own everything | Each layout is self-contained, renders header-to-footer. Dispatcher stays thin (~30 lines). | ✓ |
| Dispatcher keeps shared parts | Dispatcher renders header, quotes, impactTags. Layouts only render type-specific body. | |
| You decide | Claude determines cleanest split based on data audit | |

**User's choice:** Layouts own everything
**Notes:** None.

---

## Header & Badge Area

| Option | Description | Selected |
|--------|-------------|----------|
| Same header, both types | Identical header structure, only badge text/color differs (already handled by Phase 9) | |
| You decide | Claude determines if headers should differ between types | ✓ |

**User's choice:** You decide (Claude's discretion)
**Notes:** This area was simplified since the "layouts own everything" decision from Section Ownership already determined that headers live inside layouts, not the dispatcher.

---

## Claude's Discretion

- Engineering Brief layout design (audit data patterns of 10 EB exhibits)
- Header differences between layout types (if any)
- File organization for new layout components

## Deferred Ideas

None — discussion stayed within phase scope.
