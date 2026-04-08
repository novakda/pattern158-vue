# Phase 32: Overlap Resolution - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Resolve content overlap between FAQ answers and Contact/Philosophy pages. Each overlapping FAQ answer should complement rather than duplicate other pages — shorter, distinct angle, with cross-references where appropriate.

</domain>

<decisions>
## Implementation Decisions

### Q2 Work Arrangement Overlap
- Keep FAQ Q2 as a shorter quick-scan summary — hiring manager entry point with key facts only
- Remove overlap with CultureFitSection by keeping FAQ focused on facts (remote/hybrid/Portland) without the opinionated tone
- Q2 already had async/sync paragraph removed in Phase 31 — remaining content should be concise location/arrangement preference

### Q12 Typical Workflow Overlap
- Shorten Q12 to a teaser with reference to Philosophy page
- Replace full 3-step reproduction with brief mention: "My three-step pattern (Deconstruct, Build, Empower) is detailed on the Philosophy page"
- Keep one-liner context sentence about the pattern recurring across career

### Q1 Role Interests
- No change needed — audit classified as sufficiently different angles (domain-oriented FAQ vs title-oriented Contact)

### Cross-References
- Where overlap exists, FAQ answers should reference the relevant page explicitly (e.g., "See the Philosophy page for the full methodology")
- Cross-references help hiring managers navigate between related content

### Claude's Discretion
- Exact wording of shortened FAQ answers
- Whether Q2 needs further trimming beyond Phase 31 changes

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- FAQ data: `src/data/json/faq.json` (already updated in Phase 31)
- Audit findings: `.planning/phases/30-cross-page-content-audit/30-AUDIT.md`

### Established Patterns
- FAQ answers are plain text with \n for line breaks
- No markdown or HTML in FAQ answers

### Integration Points
- Only file modified: `src/data/json/faq.json`
- Cross-references are text-only (no hyperlinks in FAQ answers)

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the overlap resolution decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
