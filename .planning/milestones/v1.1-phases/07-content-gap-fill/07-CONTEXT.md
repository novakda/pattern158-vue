# Phase 7: Content Gap Fill - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Add content gaps approved by Dan to `exhibits.ts` — Exhibit A (missing contextText) and Exhibit D (missing contextText + second quote), plus any additional Exhibit A quotes found in the 11ty source. No content change is made without Dan's explicit approval via the CONT-01 gap decision list. Scope is explicitly bounded to Exhibits A and D; all other exhibits were classified intentional in Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Gap list format (CONT-01)
- Lives as `07-01-GAPS.md` in `.planning/phases/07-content-gap-fill/` AND presented inline in chat for immediate review
- Each item: exhibit name + description of the gap + exact proposed content (Claude-drafted, not raw 11ty copy)
- Approval mechanism: checkboxes per item — Dan checks boxes directly in the markdown file
- Unchecked = not approved; CONT-02 reads the file and only implements checked items

### Content scope
- Exhibits A and D only — Phase 5 classified all other missing-quote exhibits as intentional; that classification stands
- Exhibit A: propose contextText fill AND any additional quotes found in 11ty source as separate approve/reject items
- Exhibit D: propose contextText fill AND the second quote identified in the 11ty source as separate items

### Content fidelity
- **contextText**: Claude drafts based on 11ty source content, then presents for approval in the gap list before anything is added — Dan approves the draft, not raw 11ty HTML
- **Quotes**: Verbatim always — testimonials must match the source exactly, no paraphrasing or editorial changes

### Approval workflow
- CONT-01 produces `07-01-GAPS.md` with checkboxes and inline chat walkthrough
- Dan checks boxes for approved items in the markdown file
- CONT-02 is triggered by running `/gsd:execute-phase 7` — the plan reads `07-01-GAPS.md`, finds checked items, implements only those
- If CONT-02 runs with no items checked: abort with clear message — "No items approved in 07-01-GAPS.md. Check boxes for items to implement, then re-run."

### Claude's Discretion
- Exact prose style and length of Claude-drafted contextText (must be grounded in 11ty source facts)
- How to surface CONT-02 abort vs proceed logic in the plan spec

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 11ty source (content source of truth)
- `https://github.com/novakda/pattern158.solutions/tree/deploy/20260315-feat-auto-generate-deploy-branch-names-f` — Exhibits A and D HTML files are the authoritative source for all proposed content

### Phase 5 audit (gap identification)
- `.planning/phases/05-exhibit-audit/05-01-AUDIT.md` — Section 3.2 ("contextText Absent on Exhibit A and Exhibit D") names the specific 11ty content available for each exhibit

### Existing data
- `src/data/exhibits.ts` — Exhibit interface definition + current Exhibit A and D entries that CONT-02 will modify

### Requirements
- `.planning/REQUIREMENTS.md` — CONT-01 and CONT-02 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/exhibits.ts` `Exhibit` interface: `quotes?: ExhibitQuote[]`, `contextHeading?: string`, `contextText?: string` — fields CONT-02 will populate; no schema changes needed
- `ExhibitQuote` interface: `{ text, attribution, role? }` — quote entries must match this shape

### Established Patterns
- All `contextText` values use em-dashes (`\u2014`) and Unicode-escaped characters consistent with existing entries
- Quotes without a `role` field omit the key entirely (don't set `role: undefined`)
- contextHeading for Exhibits A and D (no `investigationReport` flag): should be `"Context"` to match the established pattern

### Integration Points
- CONT-02 modifies only `exhibits.ts` — no component or route changes
- Phase 6 (STRUCT-01/02/03) already normalized contextHeading and investigationReport rendering; CONT-02 builds on that stable state

</code_context>

<specifics>
## Specific Ideas

- The approval checkpoint is a first-class part of the phase — CONT-02 must not proceed silently if CONT-01 hasn't been reviewed
- Claude-drafted contextText should be grounded in 11ty facts but written in the same analytical voice as existing contextText entries (not raw HTML sentences)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-content-gap-fill*
*Context gathered: 2026-03-18*
