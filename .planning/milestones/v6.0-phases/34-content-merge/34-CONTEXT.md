# Phase 34: Content Merge - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Merge 13 career-vault FAQ questions into the existing 14-item faq.json. Reconcile overlapping topics, strip markdown formatting from career-vault prose, extract exhibit cross-references to structured exhibitNote/exhibitUrl fields, and tag all items with the unified 7-category taxonomy. Add exhibitUrl field to FaqItem type.

</domain>

<decisions>
## Implementation Decisions

### Overlap Reconciliation
- Replace existing "Do you work with legacy systems?" with career vault's 2 richer questions ("Can you actually rescue..." + "When should you replace...")
- Replace existing "Are you experienced with AI and automation?" with career vault's richer version (includes MCAPS story + exhibit ref)
- Replace existing "What's your approach to unclear requirements?" with career vault's "What happens when you don't have all the information upfront?" (includes HSBC/PNC examples)
- Keep existing "How do you approach troubleshooting?" AND add career vault's "What's your actual problem-solving methodology?" as separate (different angles: tactical vs strategic)
- Net result: 14 existing - 3 replaced + 13 new - 3 replacements = ~24 items (some career vault Qs have no overlap)

### Exhibit Cross-References
- Two optional fields: exhibitNote (display text) and exhibitUrl (path to exhibit page)
- exhibitNote format: plain text, e.g. "Exhibit J: GM Course Completion Investigation"
- exhibitUrl format: route path, e.g. "/exhibits/exhibit-j"
- Career vault exhibit references in markdown blockquote format (→ *Exhibit X: Name*) must be extracted to structured fields
- GDEB is Exhibit D — verify all career vault exhibit letter references against actual exhibit data
- AICPA reference has no formal exhibit — omit exhibitNote for that answer, keep reference in prose only
- Exhibit link mapping: /exhibits/exhibit-a through /exhibits/exhibit-o

### Content Formatting
- Strip Obsidian markdown from career vault content: blockquotes (→), italics (*), exhibit references
- Convert career vault prose to plain text paragraphs separated by \n\n (matching existing FAQ JSON format)
- Preserve first-person voice from career vault content

### Category Assignments for New Content
- Career vault categories map to unified taxonomy:
  - "approach" category → approach
  - "architecture" category → architecture
  - "legacy-systems" → legacy (+ expertise for broader ones)
  - "collaboration" → collaboration
  - "accessibility" → expertise (absorbed per Phase 33 decision)
  - "ai-tooling" → ai-tooling (+ expertise)
- Multi-tag items where content genuinely spans categories (1-2 max)

### Claude's Discretion
- Exact kebab-case IDs for new items (derive from question text)
- Minor prose edits for consistency with existing FAQ tone
- Category multi-tag decisions for individual items

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/types/faq.ts — FaqItem with id, categories[], exhibitNote?, exhibitUrl? (just added)
- src/data/json/faq.json — 14 items in new schema (Phase 33 output)
- src/data/faq.ts — 7 unified categories, thin loader

### Source Content
- /home/xhiris/career-vault/job-search/interview-prep/website-faq-content.md — 13 questions with exhibit refs

### Established Patterns
- JSON data + thin TypeScript loader (v3.0)
- kebab-case IDs derived from question text (Phase 33)
- categories as string arrays (Phase 33)

### Integration Points
- FaqPage.vue uses faqItems.filter(i => i.categories.includes(cat.id)) — will show new items automatically
- FaqItem.vue displays question + answer — exhibitNote rendering deferred to Phase 36

</code_context>

<specifics>
## Specific Ideas

- Career vault content is at /home/xhiris/career-vault/job-search/interview-prep/website-faq-content.md
- Exhibit cross-reference mapping (from career vault → site):
  - "Exhibit J: GM Course Completion Investigation" → /exhibits/exhibit-j
  - "Exhibit M: SCORM Debugger" → /exhibits/exhibit-m
  - "Exhibit E: CSBB Dispatch Framework" → /exhibits/exhibit-e
  - "Exhibit D: GDEB" → /exhibits/exhibit-d
  - "Exhibit K: Microsoft MCAPS AILT" → /exhibits/exhibit-k
  - "Enterprise Accessibility Methodology" → /exhibits/exhibit-i
  - "Legacy System Rescue: Ready2Role CMS" → no direct exhibit match (content in Exhibit F area)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
