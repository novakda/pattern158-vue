# Phase 30: Cross-Page Content Audit - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce a structured audit document comparing every FAQ answer against authoritative content across all other site pages (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data). Classify each finding by issue type and provide recommended fixes.

</domain>

<decisions>
## Implementation Decisions

### Audit Methodology
- Structure the comparison per-FAQ-question — one section per FAQ Q&A with all cross-page findings grouped under it
- Content overlap = same fact, same audience, no new angle; same fact reframed for different audience is acceptable repetition
- Check both FAQ categories/structure AND individual answer content

### Audit Output
- Audit document lives at `.planning/phases/30-cross-page-content-audit/30-AUDIT.md` — phase artifact consumed by Phase 31 & 32
- Use table format per FAQ question with columns: Issue, Type, Source Page, Recommended Fix
- Include "no issues found" entries to confirm completeness

### Claude's Discretion
- Severity/priority ranking of issues is at Claude's discretion
- Level of detail in recommended fixes

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- FAQ data: `src/data/json/faq.json` (14 Q&A items across 4 categories)
- FAQ categories: `src/data/faq.ts` (hiring, expertise, style, process)
- All other page data in `src/data/json/*.json` and hardcoded in Vue components

### Established Patterns
- Data externalized to JSON in v3.0 — content lives in `src/data/json/`
- Some content still hardcoded in Vue component templates (ContactPage sections: RoleFitSection, CompanyFitSection, CultureFitSection)
- Testimonials appear on multiple pages (FAQ, Philosophy, Contact, HomePage)

### Integration Points
- Audit output feeds Phase 31 (content fixes) and Phase 32 (overlap resolution)
- No code changes in this phase — output is a planning artifact

</code_context>

<specifics>
## Specific Ideas

- Known issue: FAQ answer references "portfolio" but site uses "case files" since v2.0
- Known issue: FAQ tech list is incomplete vs TechnologiesPage
- Known issue: "GitHub Spec Kit" reference needs verification
- ContactPage has structured sections (RoleFit, CompanyFit, CultureFit) that may overlap with FAQ

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
