# Feature Research

**Domain:** Evidence-based senior engineer portfolio with dual exhibit types (v2.0 IA restructure)
**Researched:** 2026-03-27
**Confidence:** HIGH (existing codebase fully audited, domain patterns well-understood, data model inspected)

---

## Context Note

This is an **IA restructure milestone**, not a greenfield build. The v1.0-v1.1 Vue site is complete with 15 exhibit detail pages, ExhibitCard components, a Portfolio page (Three Lenses + 15 flagships + 38-project directory), and a Testimonials/Field Reports page (all 15 exhibits as cards). The v2.0 goal is to resolve content redundancy between these two pages and introduce two distinct exhibit presentation types.

The core challenge unique to this portfolio: **28+ years of proprietary work with no public repositories, no open-source contributions, and no live demos to show.** Every client engagement is NDA-bound or proprietary. The evidence layer (primary-source quotes, email corpus metrics, named personnel) IS the differentiator -- not code artifacts.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features hiring managers and visitors assume exist. Missing these = site feels broken or confusing after the restructure.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Unified Case Files listing page | Two pages (Portfolio + Field Reports) showing overlapping content creates confusion. Visitors expect one place to browse all evidence | MEDIUM | Replaces PortfolioPage.vue and TestimonialsPage.vue. Must render all 15 exhibits with type-aware cards. Existing ExhibitCard component is the foundation |
| Visual type distinction on cards | With two exhibit types on one page, visitors need instant visual signal of what they're entering | LOW | Existing `investigationReport` boolean on Exhibit interface already classifies 5/15. Card badge/border/icon variation is CSS-level work on ExhibitCard |
| Exhibit type label in detail headers | Detail pages must self-identify as "Investigation Report" or "Engineering Brief" so visitors know what framing they're reading | LOW | Investigation Report badge already exists via `.expertise-badge` on ExhibitDetailPage. Engineering Briefs need equivalent label |
| Consistent back-navigation | Detail pages currently link "Back to Portfolio" -- must update to unified Case Files destination | LOW | Single string + route change in ExhibitDetailPage nav link |
| Breadth signal preserved | Hiring managers need volume/range evidence beyond 15 detailed exhibits. 38 projects across 15+ industries is a strong signal | LOW | Already built as inline HTML tables on PortfolioPage. Needs relocation to Case Files page or a dedicated section, not rebuilding |
| Quote prominence maintained | Quotes from primary sources are the core evidence mechanism for proprietary work. They must stay front-and-center | LOW | Already rendered via `quotes` array in ExhibitCard and ExhibitDetailPage. Data model unchanged |
| Navigation coherence | Nav must reflect new IA with single entry point replacing two | LOW | Router config + NavBar label changes |
| Stats bar preserved | "38 Projects / 6,000+ Emails / 15+ Industries" is a quick credibility signal | LOW | StatItem components already exist on both pages. Consolidate onto Case Files page |

### Differentiators (Competitive Advantage)

Features that set this portfolio apart. These matter specifically because Dan's work is proprietary with zero public artifacts.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| NTSB-style investigation framing | Most portfolios use generic "case study" format. The forensic investigation metaphor (sequence of events, probable cause, contributing factors, named personnel) signals depth of analysis that is itself the deliverable. Hiring managers see a systems thinker | LOW | Already built for 5 exhibits (Exhibits A, J, K, L, and one other with `investigationReport: true`). The framing lives in content (timeline entries, flow diagrams, personnel tables), section types, and the Investigation Report badge. No new components needed |
| Engineering Brief as distinct type | Separating "the investigation IS the deliverable" from "here's what I built and how" prevents metaphor fatigue. Not every project is an accident investigation -- some are rigorous platform engineering. Dual types signal versatility | MEDIUM | Requires: (1) explicit classification of remaining 10 exhibits, (2) appropriate detail page label, (3) potentially different section emphasis. The existing ExhibitDetailPage already handles polymorphic sections (text, table, flow, timeline, metadata) -- conditional rendering, not separate templates |
| Evidence-based methodology with primary sources | Most portfolios have self-reported claims. This site uses direct quotes from named personnel at named organizations, email corpus sizes, engagement timelines. This is forensic-grade evidence of impact | LOW | Already built. The `quotes` array with `attribution` and `role` fields, contextual metrics like "574 emails across 49 EB personnel," named personnel tables. The restructure preserves all of this |
| Deliberate removal of AI-generated content | Three Lenses section is AI-generated narrative, not Dan's authored content. Removing it in 2026 signals authenticity when most portfolios are going the other direction | LOW | Delete NarrativeCard, portfolioNarratives data, Three Lenses section. Subtraction as differentiator |
| Type-filtered listing view | Visitors can quickly see "forensic investigations" vs. "engineering builds." Unusual for personal portfolios; signals intentional IA thinking | LOW-MEDIUM | Filter on `investigationReport` boolean. Tabs, toggle, or section grouping on Case Files page. 15 items = client-side only |
| The codebase as portfolio artifact | The Vue 3 + TypeScript implementation quality is itself evidence. Component extraction for readability, typed data models, composable patterns -- code reviewers see engineering judgment in the code that presents the evidence | LOW | Already true. The restructure must maintain this standard: clean component boundaries, typed interfaces, semantic naming |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Interactive search/filter on 15 items | "Modern portfolios have search" | 15 exhibits is far below where search adds value. Filter UI would outweigh the content. Overengineering 15 items signals poor judgment to code reviewers | Simple type grouping (section headers) or tabs (Investigation Reports / Engineering Briefs / All). Two-state filter, not a filter system |
| New exhibit content creation | Natural instinct during restructure is to "fill gaps" | Out of scope per PROJECT.md. Content creation is a different activity than IA restructure. Mixing them causes scope creep | Restructure existing 15 exhibits only. Flag content gaps for v3.0 |
| Animated transitions between views | Portfolio sites often add page transitions | Explicitly deferred in PROJECT.md. Adds complexity without evidence value | Clean, fast loads. The content is the differentiator |
| Separate detail templates per type | InvestigationReportPage.vue + EngineeringBriefPage.vue | Maintenance burden for 15 items. ExhibitDetailPage already handles section-type polymorphism via `section.type` discriminated union. Two templates means duplicated logic for shared rendering | Single ExhibitDetailPage with conditional header label and type-aware styling. Data model drives rendering |
| Tag/technology filtering | Filter by Vue, SCORM, React, etc. | Useful at 50+ items, premature at 15. Impact tags exist but cross-cutting filters add disproportionate UI complexity | Keep impact tags as display-only on cards and detail pages |
| CMS or markdown content | "Why is content in TypeScript?" | Static TS data is correct for 15 exhibits. CMS adds deployment complexity, auth, and a maintenance dependency for content that changes quarterly at most. The typed data file is itself a portfolio artifact | Keep exhibits.ts as single source of truth. Version-controlled, type-checked, directly inspectable |
| Stats/metrics dashboard | Charts showing technology distribution, timelines | Feels like padding. The existing stats bar is more impactful as a single-glance element than a whole dashboard page | Relocate existing StatItem bar to Case Files. Keep concise |
| Flagship cards as separate data source | portfolioFlagships.ts duplicates exhibit data with summaries | Redundant data source for the same exhibits. The Case Files listing should draw from exhibits.ts directly | Evaluate whether flagship summaries should merge into Exhibit interface or if ExhibitCard can render adequate previews from existing data |

---

## Feature Dependencies

```
[Exhibit Type Classification (data model)]
    |
    +--enables--> [Visual Type Distinction on Cards]
    |
    +--enables--> [Type-Filtered Listing View]
    |
    +--enables--> [Detail Page Type Label for Engineering Briefs]
    |
    +--enables--> [Engineering Brief Template Refinements]

[Unified Case Files Page]
    |
    +--requires--> [Exhibit Type Classification]
    |
    +--requires--> [Remove/Redirect Portfolio route]
    |
    +--requires--> [Remove/Redirect Testimonials route]
    |
    +--requires--> [Navigation Update]
    |
    +--requires--> [Project Directory Relocation]
    |
    +--requires--> [Stats Bar Consolidation]

[Three Lenses Removal]
    |
    +--independent (no dependencies, can happen in any phase)

[Flagship Data Consolidation]
    |
    +--requires--> [Decision: merge flagship summaries into Exhibit or drop them]
    +--enables--> [Cleaner Case Files card rendering from single data source]
```

### Dependency Notes

- **Exhibit Type Classification is the foundation:** Every listing and detail feature depends on having a clear, data-model-level distinction between Investigation Reports and Engineering Briefs. The existing `investigationReport: boolean` covers 5 exhibits; the remaining 10 default to Engineering Brief (explicit or by absence of flag).
- **Unified Case Files Page requires retirement of two pages:** Cannot ship the new listing without removing or redirecting Portfolio and Testimonials routes. These are a coupled operation.
- **Three Lenses Removal is independent:** No feature depends on it. Can be done as standalone cleanup.
- **Flagship data consolidation is a design decision:** portfolioFlagships.ts contains `summary` and `quote` fields that duplicate/extend exhibit data. The restructure must decide whether to merge these into the Exhibit interface (richer cards) or accept that Case Files cards render from existing exhibit fields.
- **Project Directory Relocation depends on Case Files page existence:** The 38-project directory needs a home once PortfolioPage is removed.

---

## MVP Definition

### Launch With (v2.0 -- IA Restructure Complete)

Minimum viable restructure that resolves content redundancy and introduces dual types.

- [ ] Classify all 15 exhibits as Investigation Report or Engineering Brief in data model
- [ ] Build unified Case Files listing page rendering all 15 exhibits with type-aware cards
- [ ] Visual type distinction on ExhibitCard (badge/border per type)
- [ ] Update ExhibitDetailPage header to label both types
- [ ] Remove Three Lenses section and NarrativeCard/portfolioNarratives
- [ ] Relocate 38-project directory as breadth signal on or near Case Files
- [ ] Update navigation (router routes + NavBar labels)
- [ ] Update detail page back-navigation links
- [ ] Redirect or remove old /portfolio and /testimonials routes
- [ ] Consolidate stats bar onto Case Files page

### Add After Validation (v2.x)

- [ ] Type-filtered listing (tabs/toggle on Case Files) -- adds value once classifications are confirmed
- [ ] Engineering Brief detail template refinements -- if Investigation Report template doesn't fit Briefs well
- [ ] Flagship data consolidation (merge summaries into Exhibit interface or remove portfolioFlagships.ts)
- [ ] Storybook stories for new/modified components
- [ ] Homepage CTA updates pointing to Case Files

### Future Consideration (v3+)

- [ ] New exhibit content creation (new Engineering Briefs or Investigation Reports)
- [ ] Technology cross-references between exhibits ("See also" links)
- [ ] Expanded/filterable project directory if it grows past 38

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Exhibit type classification (data model) | HIGH | LOW | P1 |
| Unified Case Files listing page | HIGH | MEDIUM | P1 |
| Visual type distinction on cards | HIGH | LOW | P1 |
| Detail page type labels (both types) | MEDIUM | LOW | P1 |
| Three Lenses removal | MEDIUM | LOW | P1 |
| Navigation update (routes + labels) | HIGH | LOW | P1 |
| Project directory relocation | MEDIUM | LOW | P1 |
| Old route removal/redirect | MEDIUM | LOW | P1 |
| Back-nav link update | LOW | LOW | P1 |
| Stats bar consolidation | LOW | LOW | P1 |
| Type-filtered listing view | MEDIUM | LOW-MEDIUM | P2 |
| Engineering Brief template refinements | MEDIUM | MEDIUM | P2 |
| Flagship data consolidation | MEDIUM | MEDIUM | P2 |
| Storybook stories for changes | LOW | MEDIUM | P2 |
| Homepage CTA updates | LOW | LOW | P2 |
| New exhibit content | HIGH | HIGH | P3 (out of scope) |
| Tag-based filtering | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for v2.0 (resolves IA redundancy, introduces dual types)
- P2: Should have, add once core restructure is stable
- P3: Future consideration, explicitly deferred

---

## Domain Pattern Analysis

How this portfolio addresses the proprietary-work problem compared to typical approaches.

| Challenge | Typical Engineer Portfolio | This Site's Approach |
|-----------|---------------------------|---------------------|
| No public code repos | Link to GitHub, hope open-source work is impressive | The site itself IS the code artifact (Vue 3 + TS + Vite). Code quality demonstrates engineering judgment directly |
| Proprietary client work | Vague bullet points ("Improved performance 30%") | Direct quotes with named attribution, email corpus sizes (574 emails, 2554 emails), engagement timelines, personnel tables. Forensic-grade primary sources |
| Demonstrating rigor | Whiteboard exercises, take-home projects | NTSB-style investigation methodology. The analysis structure itself demonstrates systems thinking. Timeline entries, contributing factor analysis, probable cause determination |
| Single presentation format | Every project gets the same "case study" treatment | Dual types: Investigation Reports (forensic, NTSB-style) and Engineering Briefs (rigorous builds). Signals versatility in thinking |
| Breadth vs. depth | Either deep dives OR a long list | Both: 15 detailed exhibits (depth) + 38-project directory (breadth), unified under one IA |
| Content authenticity (2025-2026) | AI-generated summaries increasingly common | Deliberately removing AI-generated content (Three Lenses). All exhibit content sourced from primary correspondence |
| Proving impact at senior level | Self-reported metrics, vague leadership claims | Multi-level recognition patterns documented (Exhibit B), escalation through organizational hierarchy visible in quote chains, trust indicators (employee credentials granted to contractor) |

---

## Sources

- [Quora: Showing private employer projects in portfolio](https://www.quora.com/As-a-programmer-how-best-can-I-show-my-employers-projects-that-I-worked-on-which-are-private-or-not-publicly-accessible-on-my-portfolio-for-future-job-applications) -- LOW confidence, community advice
- [Codecademy: Software Developer Portfolio Tips](https://www.codecademy.com/resources/blog/software-developer-portfolio-tips) -- MEDIUM confidence
- [DEV Community: What I Look for When Hiring Senior Software Engineers](https://dev.to/thawkin3/what-i-look-for-when-hiring-senior-software-engineers-4a6j) -- MEDIUM confidence, practitioner perspective
- [TextExpander: What Should You Look for in a Software Engineer Portfolio](https://textexpander.com/blog/what-should-you-look-for-in-a-software-engineer-portfolio) -- MEDIUM confidence
- [Toptal: Dissecting Case Study Portfolios](https://www.toptal.com/designers/ui/case-study-portfolio) -- MEDIUM confidence, design-focused but applicable
- [NTSB: The Investigative Process](https://www.ntsb.gov/investigations/process/Pages/default.aspx) -- HIGH confidence, official source for investigation framing
- [Artfolio: Case Study Portfolio Tips for 2025](https://www.artfolio.com/article/structuring-case-studies-inside-your-portfolio-to-solve-real-client-pain-points) -- MEDIUM confidence
- Existing codebase analysis: `exhibits.ts` (Exhibit interface + 15 records), `portfolioFlagships.ts`, `ExhibitCard.vue`, `ExhibitDetailPage.vue`, `PortfolioPage.vue`, `TestimonialsPage.vue` -- HIGH confidence, primary source

---

*Feature research for: Evidence-based portfolio IA restructure with dual exhibit types*
*Researched: 2026-03-27*
