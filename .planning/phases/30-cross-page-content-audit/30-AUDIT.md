# Phase 30: Cross-Page Content Audit

**Audited:** 2026-04-08
**FAQ source:** src/data/json/faq.json (14 items, 4 categories)
**Comparison pages:** HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data

## Summary

| Issue Type | Count |
|------------|-------|
| Stale Reference | 2 |
| Factual Drift | 2 |
| Content Overlap | 4 |
| Missing Content | 5 |
| No Issues | 5 |

**Total findings: 13 across 9 questions; 5 questions clean.**

## Audit by FAQ Question

### Category: Hiring Logistics

#### Q: "Are you available for new projects?"

**FAQ Answer (verbatim):**
> Yes, I'm available for contract, contract-to-hire, or full-time positions. I was laid off from GP Strategies in January 2026 and am actively seeking new opportunities.
>
> I'm interested in roles involving legacy system modernization, LMS/SCORM integration, enterprise system architecture, accessibility remediation (WCAG 2.1 AA+), and AI-assisted development tooling.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| FAQ lists role interests that partially overlap with ContactPage RoleFitSection | content overlap | low | ContactPage (RoleFitSection) | FAQ lists "legacy system modernization, LMS/SCORM integration, enterprise system architecture, accessibility remediation, AI-assisted development tooling." RoleFitSection lists "Senior or Staff Full-Stack Engineer, Solutions Architect, Senior Frontend Engineer at enterprise scale." Same audience (hiring managers), different framing — FAQ is domain-oriented, Contact is title-oriented. Borderline overlap but the angles are sufficiently different. | No action needed — the two lists complement each other (domain interests vs. role titles). Flag for Phase 32 review if FAQ restructuring changes scope. |
| No issues found | — | — | HomePage, TechnologiesPage, PhilosophyPage, CaseFilesPage, exhibit data | FAQ content consistent with site | None needed |

---

#### Q: "What's your work arrangement preference?"

**FAQ Answer (verbatim):**
> Remote is ideal. I'm also open to hybrid arrangements in the Portland, OR area (Vancouver, WA specifically). I have 28+ years of experience working effectively with distributed teams across time zones.
>
> I'm comfortable with async communication (email, Slack, documentation) and sync collaboration (video calls, pair programming) depending on what the project needs.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| FAQ duplicates ContactPage CultureFitSection remote/location content | content overlap | medium | ContactPage (CultureFitSection) | FAQ says "Remote is ideal. I'm also open to hybrid arrangements in the Portland, OR area (Vancouver, WA specifically)." CultureFitSection says "Remote-first, or remote-real. Not 'remote but everyone who gets promoted is in the office.' I'm in Portland, Oregon, and this is non-negotiable. Hybrid within the Portland/Vancouver WA metro is fine." Same audience (hiring managers), same fact, CultureFitSection provides more nuance. | Phase 32: Consider making FAQ answer shorter and linking to ContactPage for the full picture, or removing the location detail from FAQ since CultureFitSection covers it more completely. |
| FAQ duplicates async/sync communication detail with Q8 | content overlap | medium | FaqPage (Q8) | FAQ Q2 says "I'm comfortable with async communication (email, Slack, documentation) and sync collaboration (video calls, pair programming) depending on what the project needs." FAQ Q8 says nearly the same: "I'm comfortable with async (email, Slack, documentation) and sync (video calls, pair programming) depending on what the project needs." These are near-identical sentences within the same FAQ page. | Phase 31: Remove the async/sync detail from Q2 (work arrangement) and keep it in Q8 (communication), where it topically belongs. Q2 should focus on remote/hybrid/location preference only. |

---

#### Q: "What are your contract rates?"

**FAQ Answer (verbatim):**
> For contract work, rates vary based on project scope, duration, and technical complexity. Let's discuss your specific needs -- contact me with project details and we can work out terms that make sense for both of us.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| No issues found | — | — | All pages checked (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data) | FAQ content is self-contained and does not conflict with any other page. ContactPage has a CompensationTable component but FAQ does not reference specific numbers, so no drift. | None needed |

---

### Category: Technical Expertise

#### Q: "What technologies do you specialize in?"

**FAQ Answer (verbatim):**
> Primary stack: JavaScript, TypeScript, Vue.js, Node.js, HTML5/CSS3, SQL
>
> Specialized domains: Learning Management Systems (LMS), SCORM/AICC/xAPI, eLearning technologies, accessibility remediation (WCAG 2.1 AA)

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| FAQ tech list missing React, Python, Power Platform, Claude Code | missing content | high | TechnologiesPage | TechnologiesPage features React (working level, BP/AICPA/ContentAIQ), Python (working level, data pipelines), Power Platform (deep level, year-long production), Claude Code (deep level, primary AI tool). These are significant production technologies absent from the FAQ "Primary stack" answer. | Phase 31: Add a second tier to the FAQ answer, e.g., "Also production experience with: React, Python, Power Platform, Claude Code" — or restructure the answer to distinguish "primary stack" from "production experience." |
| FAQ omits entire "AI & Automation" category from TechnologiesPage | missing content | medium | TechnologiesPage | TechnologiesPage has a dedicated "AI & Automation" section with Claude Code (deep), GitHub Copilot (working), Power Platform (deep), Copilot Studio (deep), Dataverse (working). FAQ Q4 only lists the JS/TS/Vue/Node stack and eLearning domains. The AI dimension is covered in Q6 but not cross-referenced here. | Phase 31: Add a brief mention of AI tooling or cross-reference Q6, e.g., "See also: AI and automation experience (Q6)." |
| techPills (HomePage hero) includes "AI Integration" and "Power Platform" not in FAQ | missing content | low | HomePage | HomePage techPills array: JavaScript, Node.js, Vue.js, TypeScript, SQL, REST APIs, AI Integration, Power Platform. FAQ Q4 omits AI Integration and Power Platform from its tech list. | Phase 31: Align FAQ tech list with techPills or acknowledge the broader scope. |

---

#### Q: "Do you work with legacy systems?"

**FAQ Answer (verbatim):**
> Yes, legacy system modernization is a core specialty. I've rescued undocumented systems, reverse-engineered abandoned codebases, and integrated legacy platforms with modern architectures.
>
> See the portfolio for examples like the legacy CMS rescue and cross-domain SCORM framework.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| "See the portfolio" — site uses "case files" since v2.0 | stale reference | high | CaseFilesPage, HomePage, router | Site renamed "Portfolio" to "Case Files" in v2.0. The route `/portfolio` redirects to `/case-files`. HomePage CTA says "View All Case Files." CaseFilesPage title is "Case Files." FAQ still says "See the portfolio." | Phase 31: Change "See the portfolio" to "See the case files" in the FAQ answer. |
| FAQ references "legacy CMS rescue" — verify against HomePage findings | — | — | HomePage | HomePage "Featured Projects" includes "Legacy Courseware CMS Rescue" (finding #2). Consistent. | None needed |

---

#### Q: "Are you experienced with AI and automation?"

**FAQ Answer (verbatim):**
> Yes. I've designed agentic workflows using GitHub Spec Kit, built Copilot Studio agents for enterprise clients, and use AI-assisted development extensively (GitHub Copilot, Claude Code).
>
> I focus on practical applications - tools that solve real problems, not hype. AI is most valuable for documentation generation, code review, and rapid prototyping.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| "GitHub Spec Kit" — verify term consistency | — | — | TechnologiesPage, PhilosophyPage, exhibit data | "GitHub Spec Kit" appears in: Exhibit L (tools field: "GitHub Spec Kit (AI-assisted requirements analysis, baseline generation, gap detection)"), PhilosophyPage philosophyInfluences ("GitHub Spec Kit emerged from that model"). Term is consistent across all occurrences. Not on TechnologiesPage as a standalone tech card, but referenced in exhibit data and philosophy content. | None needed — term is used consistently. Could consider adding a tech card for GitHub Spec Kit on TechnologiesPage in a future phase, but that's out of scope for this audit. |
| FAQ omits Power Platform from AI answer | missing content | low | TechnologiesPage | TechnologiesPage lists Power Platform at "deep" level in the AI & Automation section. FAQ Q6 mentions Copilot Studio and GitHub Copilot/Claude Code but doesn't mention Power Platform explicitly (though Copilot Studio runs on Power Platform). | Phase 31: Consider mentioning Power Platform alongside Copilot Studio for completeness, or leave as-is since Copilot Studio implies Power Platform context. Low priority. |

---

#### Q: "What industries have you worked in?"

**FAQ Answer (verbatim):**
> Banking (PNC, JPMorgan Chase, Kmart Credit), Defense (GDEB Electric Boat), Energy (7+ utilities including FPL, NRG, Exelon), Retail (GM, Kmart), Healthcare (Cornell Medical), and Enterprise software (Microsoft, BP).
>
> This cross-industry experience helps me recognize patterns and apply solutions from one domain to another.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| FAQ lists "JPMorgan Chase" and "Kmart Credit" — not in exhibit data or project directory | factual drift | medium | CaseFilesPage, exhibit data | CaseFilesPage project directory lists banking clients: Bank of America, SunTrust Bank, Horizon BCBS NJ, MetLife, SAP SuccessFactors. Exhibit data includes Wells Fargo, HSBC, TD Bank, PNC. Neither JPMorgan Chase nor Kmart Credit appear anywhere else on the site. FAQ lists company names that cannot be cross-referenced with any other site content. | Phase 31: Verify JPMorgan Chase and Kmart Credit are accurate career claims. If so, ensure consistency — either add them to the project directory or replace with companies that appear in exhibit data (e.g., HSBC, Wells Fargo, TD Bank are documented). If they're from pre-exhibit career period, note that context. |
| FAQ lists "Cornell Medical" under Healthcare — site uses "Weill Cornell Medicine" | factual drift | low | CaseFilesPage | CaseFilesPage project directory lists "Weill Cornell Medicine" (official name). FAQ uses "Cornell Medical" which is an informal abbreviation. | Phase 31: Change "Cornell Medical" to "Weill Cornell Medicine" for consistency with the project directory. |
| FAQ categorizes "GM" as Retail — site directory lists GM under Consumer & Manufacturing with no exhibit | — | — | CaseFilesPage, exhibit data | Exhibit J client is "General Motors" with title "Flash-to-HTML5 Course Migration." CaseFilesPage does not categorize by industry for exhibits. The project directory doesn't include GM separately (it's an exhibit). FAQ calling GM "Retail" is debatable — GM is automotive/manufacturing, not retail. | Phase 31: Consider recategorizing GM from "Retail" to "Automotive/Manufacturing" or removing the industry sub-label and just listing the company. |

---

### Category: Working Style

#### Q: "How do you handle communication?"

**FAQ Answer (verbatim):**
> I provide clear, documented communication. I'm comfortable with async (email, Slack, documentation) and sync (video calls, pair programming) depending on what the project needs.
>
> I'm in US Pacific timezone (Portland, OR). I respond to messages during business hours and document key decisions so distributed teams can stay aligned.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| Near-identical async/sync sentence appears in FAQ Q2 | content overlap | medium | FaqPage (Q2) | As documented under Q2: FAQ Q8 and Q2 contain near-identical sentences about async/sync communication comfort. "I'm comfortable with async (email, Slack, documentation) and sync (video calls, pair programming) depending on what the project needs." | Phase 31: See Q2 fix — remove duplicate from Q2, keep in Q8 where it topically belongs. |
| No issues found with other pages | — | — | HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data | Communication style content is self-contained in FAQ. CultureFitSection discusses remote preference but not communication mechanics. No drift. | None needed |

---

#### Q: "Do you work well with distributed teams?"

**FAQ Answer (verbatim):**
> Yes. I've spent 28 years working with distributed teams across time zones. I understand the importance of documentation, clear handoffs, and async-first workflows.
>
> I'm experienced with collaborative tools (Jira, Confluence, GitHub, Teams, Slack) and know how to keep projects moving when team members are in different locations.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| No issues found | — | — | All pages checked (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data) | FAQ content consistent. TechnologiesPage lists Jira at "working" level, consistent with FAQ mention. ContactPage CultureFitSection mentions autonomy and remote-first but doesn't duplicate distributed teams content. | None needed |

---

#### Q: "What's your approach to unclear requirements?"

**FAQ Answer (verbatim):**
> I treat it as a forensic investigation. When requirements are undefined or contradictory, I document what exists, map the gaps, and propose solutions grounded in evidence.
>
> See the featured projects for examples of how I approach undocumented systems and rebuild them systematically. If you have an unclear situation, let's talk -- this is the kind of problem I'm good at solving.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| "See the featured projects" — ambiguous reference | stale reference | medium | HomePage, CaseFilesPage | "Featured projects" appears on HomePage as a section titled "Featured Projects" (3 FindingCards). But CaseFilesPage has the full exhibit collection. The FAQ reference is ambiguous — does it mean the 3 featured projects on HomePage or the full case files? Since the page is called "Case Files" not "Featured Projects," this reference is partially stale. | Phase 31: Change "See the featured projects" to "See the case files" with a link to /case-files, or be specific: "See the featured projects on the home page." |

---

#### Q: "Are you comfortable working independently?"

**FAQ Answer (verbatim):**
> Yes. I've often been "the engineer" on projects -- the one who figures problems out, builds the tool, and hands off documentation. I'm self-directed but also collaborate well when the project calls for it.
>
> I thrive in situations where requirements are unclear, documentation is missing, or the problem hasn't been solved before. Give me a complex puzzle and I'll map it, solve it, and document it.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| No issues found | — | — | All pages checked (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data) | FAQ content is self-contained. PhilosophyPage discusses the same themes (forensic investigation, documentation) but from a methodology angle, not a "working style" angle — different framing for different audience intent. Not overlap. | None needed |

---

### Category: Process & Methodology

#### Q: "What's your typical workflow?"

**FAQ Answer (verbatim):**
> The pattern repeats across my career:
>
> 1. Deconstruct the Chaos: Forensic investigation to understand the system -- map dependencies, identify patterns, document what exists
> 2. Build the Tool: Create reusable frameworks to solve root causes, not symptoms -- automate repetitive tasks, standardize processes
> 3. Empower the User: Hand off robust, documented tools that make complex processes simple -- clear READMEs, inline comments, training materials
>
> This pattern shows up whether I'm debugging SCORM packages, reverse-engineering legacy systems, or building automation tools.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| FAQ duplicates PhilosophyPage HowIWorkSection three-step methodology | content overlap | medium | PhilosophyPage (HowIWorkSection) | FAQ Q12 reproduces the same three steps (Deconstruct the Chaos, Build the Tool, Empower the User) that PhilosophyPage HowIWorkSection covers in full depth. FAQ version is a condensed summary; PhilosophyPage version has detailed prose for each step. Same audience could encounter both. | Phase 32: This is a legitimate overlap — the FAQ is summarizing what PhilosophyPage explains in depth. Consider: (a) Keep FAQ as a brief summary with a "Read more on the Philosophy page" link, or (b) Replace FAQ content with a shorter reference: "My three-step pattern — Deconstruct, Build, Empower — is detailed on the Philosophy page." |

---

#### Q: "How do you approach troubleshooting?"

**FAQ Answer (verbatim):**
> Systems thinking first. I look for patterns, examine different angles (technical, UX, user behavior), and verify hypotheses with evidence. I document findings clearly so others can follow the reasoning.
>
> I'm methodical: reproduce the issue, isolate variables, test hypotheses, fix root cause (not symptoms), verify the fix, and document for future reference.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| No issues found | — | — | All pages checked (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data) | FAQ troubleshooting content is self-contained. PhilosophyPage discusses "Deconstruct the Chaos" with similar themes but from a broader methodology perspective. The FAQ is specifically about troubleshooting process steps, not the three-step philosophy — sufficiently different angle. | None needed |

---

#### Q: "Do you write documentation?"

**FAQ Answer (verbatim):**
> Yes, extensively. I believe tools are as good as their documentation. I write clear READMEs, inline code comments, architecture decision records (ADRs), and handoff guides.
>
> Documentation isn't an afterthought -- it's part of the deliverable. If I build it, I document it so the next person (or future me) can understand and maintain it.

**Cross-Page Comparison:**

| Issue | Type | Severity | Source Page | Evidence | Recommended Fix |
|-------|------|----------|------------|----------|-----------------|
| No issues found | — | — | All pages checked (HomePage, TechnologiesPage, PhilosophyPage, ContactPage, CaseFilesPage, exhibit data) | FAQ documentation content is self-contained. TechnologiesPage lists "Technical Writing" at deep level, consistent. PhilosophyPage "Empower the User" step mentions documentation but from a different angle (philosophy vs. practice). No drift or problematic overlap. | None needed |
