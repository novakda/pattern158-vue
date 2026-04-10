# Phase 31: Content Fixes - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix all factual inaccuracies, stale references, and terminology drift in faq.json identified by the Phase 30 audit. Changes are limited to src/data/json/faq.json — no component or layout changes.

</domain>

<decisions>
## Implementation Decisions

### Stale References
- Q5 ("Do you work with legacy systems?"): Change "See the portfolio" to "See the case files"
- Q10 ("What's your approach to unclear requirements?"): Change "See the featured projects" to "See the case files"

### Technology Listing (Q4)
- Add second tier to answer: "Also production experience with: React, Python, Power Platform, Claude Code"
- Keep existing primary stack line unchanged
- Brief mention of AI tooling or cross-reference to Q6

### Industry List (Q7)
- Replace "JPMorgan Chase, Kmart Credit" with documented banking clients (HSBC, Wells Fargo, TD Bank) that appear in site exhibit data
- Change "Cornell Medical" to "Weill Cornell Medicine" to match project directory
- Recategorize GM from "Retail" to "Automotive" or remove industry sub-label
- Remove "Kmart" from Retail category (not documented on site)

### Internal Duplication (Q2/Q8)
- Remove async/sync communication detail from Q2 (work arrangement) — keep it in Q8 (communication) where it topically belongs
- Q2 should focus on remote/hybrid/location preference only

### AI/Automation (Q6)
- GitHub Spec Kit reference verified correct — no change needed
- Consider mentioning Power Platform alongside Copilot Studio for completeness (low priority)

### Accessibility Phrasing
- FAQ Q1 says "WCAG 2.1 AA+" — add "Section 508" to match ContactPage phrasing: "WCAG 2.1 AA / Section 508"

### Claude's Discretion
- Exact wording of second-tier tech additions
- Whether to add cross-reference between Q4 and Q6

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- FAQ data: `src/data/json/faq.json` (14 Q&A items, plain JSON)
- Audit findings: `.planning/phases/30-cross-page-content-audit/30-AUDIT.md`

### Established Patterns
- FAQ answers are plain text with \n for line breaks
- No markdown rendering in FAQ answers — plain text only

### Integration Points
- Only file modified: `src/data/json/faq.json`
- No component changes needed
- Tests may verify FAQ content if any exist

</code_context>

<specifics>
## Specific Ideas

- All fixes are concrete text replacements in faq.json — no ambiguity
- The audit document at 30-AUDIT.md has the exact current text and recommended fixes for each item

</specifics>

<deferred>
## Deferred Ideas

- Content overlap resolution (Q2 vs CultureFitSection, Q12 vs HowIWorkSection) deferred to Phase 32

</deferred>
