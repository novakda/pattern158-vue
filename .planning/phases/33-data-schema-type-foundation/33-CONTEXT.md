# Phase 33: Data Schema & Type Foundation - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend the FaqItem type with id, multi-tag categories, and optional exhibitNote. Define a unified 7-category taxonomy covering both existing site and career-vault content. Migrate all existing JSON data to the new schema. No component changes in this phase — data layer only.

</domain>

<decisions>
## Implementation Decisions

### Category Taxonomy
- 7 unified categories: hiring, expertise, approach, architecture, legacy, collaboration, ai-tooling
- Existing "style" absorbed into "collaboration"; existing "process" absorbed into "approach"
- Career vault "accessibility" absorbed into "expertise"; "legacy-systems" shortened to "legacy"
- Category IDs use kebab-case strings (e.g., `ai-tooling`, `legacy`)
- Items tagged with 1-2 categories maximum to keep filtering predictable

### Schema Migration
- FAQ item IDs are kebab-case derived from question text (e.g., `available-new-projects`, `problem-solving-methodology`) — human-readable and stable
- FaqCategoryId becomes `string` type since categories are now data-driven; the `faqCategories` array in faq.ts is the single source of truth
- Existing single `category` values wrapped in `categories` arrays (e.g., `"hiring"` → `["hiring"]`)
- faqCategories stays in faq.ts as `as const` — same pattern as today, just with updated category IDs and headings/intros

### Claude's Discretion
- Exact heading and intro text for new categories
- ID derivation rules (how to shorten long questions to kebab IDs)
- Which existing items get a second category tag

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/faq.ts` — FaqItem, FaqCategory, FaqCategoryId types (will be modified)
- `src/data/faq.ts` — thin loader with `as const satisfies` pattern for faqCategories
- `src/data/json/faq.json` — 14 FAQ items, current schema: {question, answer, category}
- `src/types/index.ts` — barrel exports for FaqItem, FaqCategory, FaqCategoryId

### Established Patterns
- JSON data + thin TypeScript loader pattern (established v3.0)
- `as const satisfies readonly Type[]` for category arrays with type narrowing
- `as FaqItem[]` assertion on JSON import to restore type information
- Barrel exports in src/types/index.ts

### Integration Points
- FaqPage.vue imports faqItems and faqCategories from `@/data/faq`
- FaqItem.vue receives question and answer as props (will be replaced in Phase 35, not this phase)
- FaqItem.stories.ts uses FaqItem type
- 5 files total reference FAQ types/data

</code_context>

<specifics>
## Specific Ideas

- Career vault content at /home/xhiris/career-vault/job-search/interview-prep/website-faq-content.md has 13 questions with exhibit cross-references in markdown blockquote format (→ *Exhibit X: Name*) — these will become exhibitNote values in Phase 34
- Existing "What's your work arrangement preference?" answer references Contact page — keep that cross-reference
- FaqPage.vue currently filters `faqItems.filter(i => i.category === cat.id)` — will need update to `i.categories.includes(cat.id)` but that's a Phase 35/36 concern

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
