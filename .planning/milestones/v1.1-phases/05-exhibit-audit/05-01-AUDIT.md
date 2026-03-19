# Exhibit Audit: Content Comparison and Classification

**Audit date:** 2026-03-18
**Auditor:** Claude (Phase 5 executor)
**Scope:** All 15 exhibit detail pages (Exhibit A through Exhibit O)
**Source data:** `src/data/exhibits.ts`, `src/pages/ExhibitDetailPage.vue`, 11ty HTML source (all 15 files fetched), 45 Playwright screenshots (15 exhibits x 3 breakpoints)

---

## Summary of Findings

**Total exhibits audited:** 15 (Exhibit A through Exhibit O)

**Classification breakdown across all rows:**

| Classification | Count | Exhibits |
|---|---|---|
| `intentional` | 7 | A (resolutionTable), A (attribution anomaly row), B, C, E, F–I group, J/K/L group |
| `formatting-inconsistency` | 4 | A (attr anomaly), M, N (contextHeading mismatch), H (minor) |
| `content-gap` | 2 | A (missing contextText), D (missing contextText + second quote) |
| `needs-review` | 2 | isDetailExhibit flag (all exhibits), D (sparse exhibit) |

**Row-level classification (per-exhibit, most significant variation):**

| Classification | Exhibit count |
|---|---|
| `intentional` | 9 |
| `formatting-inconsistency` | 2 (M, N) |
| `content-gap` | 2 (A, D) |
| `needs-review` | 2 (D classification is borderline; isDetailExhibit is cross-cutting) |

**The 4 most important findings:**

1. **investigationReport rendering gap** — The `investigationReport` boolean flag is defined in the `Exhibit` interface and set on 6 of 15 exhibits, but is never rendered anywhere in `ExhibitDetailPage.vue`. Visitors see no indication that Exhibits J, K, L, M, N are investigation reports, and no indication that Exhibit O explicitly is not. This is the highest-priority structural gap feeding into Phase 6 (STRUCT-02).

2. **contextHeading label inconsistency** — Exhibits M and N have `investigationReport: true` but use `contextHeading: "Context"` instead of `"Investigation Summary"`. Exhibits J, K, L correctly use `"Investigation Summary"`. The label should follow the flag. This is a formatting inconsistency directly correctable in Phase 6 (STRUCT-01).

3. **Content gaps in Exhibit A and D** — Exhibit A has extensive background narrative and additional quotes in the 11ty source that are not in `exhibits.ts`. Exhibit D has a second quote and a full background narrative in the 11ty source that are absent from `exhibits.ts`. Both require Dan's content decision before porting (Phase 7 CONT-01).

4. **Exhibit D extreme sparseness** — With only 1 quote and no contextText, Exhibit D renders as the most visually sparse page in the set. The 11ty source has enough content to populate contextText, but adding it is a content decision. Visually, this is the most obvious inconsistency a visitor would notice.

**Phase 6 will address:** Structural normalization — contextHeading label correction (STRUCT-01), investigationReport flag rendering (STRUCT-02), quote attribution standardization (STRUCT-03).

**Phase 7 will address:** Content gap fill — all content-gap items require Dan's explicit approval before any changes to `exhibits.ts` (CONT-01, CONT-02).

---

## Comparison Table

| Exhibit | quotes | contextHeading | contextText | resolutionTable | isDetailExhibit | investigationReport | Classification | Notes |
|---------|--------|----------------|-------------|-----------------|-----------------|---------------------|----------------|-------|
| A | 2 | absent | absent | 5 rows | true | absent | `content-gap` | Only exhibit with resolutionTable; missing contextText despite extensive 11ty background narrative; second quote has empty attribution string |
| B | 2 | "Context" | present | absent | absent | absent | `intentional` | Dual-cascade recognition exhibit; two-quote + context structure is appropriate; no 11ty content gaps |
| C | absent | "Context" | present | absent | true | absent | `intentional` | Internal team recognition exhibit; no quotes appropriate (team recognition email, not direct feedback); 11ty source confirms no gaps |
| D | 1 | absent | absent | absent | absent | absent | `content-gap` | Only quote + impact tags; 11ty source has second quote and full background narrative; most visually sparse exhibit |
| E | absent | "Context" | present | absent | true | absent | `intentional` | Technical architecture exhibit; no quotes appropriate (no external client testimonial); 11ty confirms no quote gap |
| F | 1 | "Context" | present | absent | absent | absent | `intentional` | Structurally complete: quote + context + tags; clean content density; no 11ty gaps |
| G | 1 | "Context" | present | absent | absent | absent | `intentional` | Structurally complete: quote + context + tags; no 11ty gaps |
| H | 1 | "Context" | present | absent | absent | absent | `intentional` | Structurally complete: quote + context + tags; 11ty source has 3 quotes vs 1 in exhibits.ts (combined attribution is correct — single representative quote) |
| I | 1 | "Context" | present | absent | absent | absent | `intentional` | Structurally complete: quote + context + tags; no 11ty gaps |
| J | absent | "Investigation Summary" | present | absent | true | true | `intentional` | Investigation report exhibit; contextHeading correctly matches investigationReport: true; no quotes (no external testimonial available) |
| K | absent | "Investigation Summary" | present | absent | true | true | `intentional` | Investigation report exhibit; contextHeading correctly matches investigationReport: true; no quotes |
| L | absent | "Investigation Summary" | present | absent | true | true | `intentional` | Investigation report exhibit; contextHeading correctly matches investigationReport: true; no quotes |
| M | absent | "Context" | present | absent | true | true | `formatting-inconsistency` | investigationReport: true but contextHeading says "Context" — should be "Investigation Summary" to match J/K/L pattern; STRUCT-01 target |
| N | absent | "Context" | present | absent | true | true | `formatting-inconsistency` | investigationReport: true but contextHeading says "Context" — should be "Investigation Summary" to match J/K/L pattern; STRUCT-01 target |
| O | absent | "Context" | present | absent | true | false | `intentional` | Explicitly investigationReport: false; contextHeading "Context" is correct; integration thread narrative, not forensic report |

---

## Classified Variations

### 3.1 contextHeading Label Split: "Context" vs "Investigation Summary" vs Absent

Three groups exist across 15 exhibits:

**Group 1 — "Context" (10 exhibits):** B, C, E, F, G, H, I, M, N, O

**Group 2 — "Investigation Summary" (3 exhibits):** J, K, L

**Group 3 — Absent (2 exhibits):** A, D

**Classification:**

The "Context" vs "Investigation Summary" split is a `formatting-inconsistency` on Exhibits M and N specifically. The rule should be: when `investigationReport: true`, use "Investigation Summary"; when `investigationReport: false` or absent, use "Context". Exhibits J, K, L apply this rule correctly. Exhibits M and N violate it — they have `investigationReport: true` but use "Context".

For the 10 exhibits using "Context" where `investigationReport` is absent (B, C, E, F, G, H, I) or false (O): "Context" is the correct label. No change needed.

For Exhibit A and D, contextHeading is absent because contextText is absent. If contextText were added (a Phase 7 content decision), contextHeading would need to be assigned. Both A and D have no `investigationReport` flag, so the correct label would be "Context".

**Phase 6 action:** STRUCT-01 — update contextHeading on M and N from "Context" to "Investigation Summary".

### 3.2 contextText Absent on Exhibit A and Exhibit D

**Exhibit A:** Has a `resolutionTable` (5 rows) and 2 quotes, but no `contextText`. The 11ty source for Exhibit A contains extensive background narrative covering a 7-year engagement timeline, cross-domain SCORM architecture, and the root cause analysis. This narrative is not in `exhibits.ts`. The exhibit also has additional quotes in the 11ty source (see Section 5 for details). Classification: `content-gap` — the content exists in source but was not ported. Requires Dan's decision.

**Exhibit D:** Has 1 quote but no `contextText`. The 11ty source for Exhibit D contains a full background narrative (Wells Fargo 100+ course migration, QA methodology, IE/Flash SCORM diagnosis, 223 tracked emails, 6-month engagement, full administrative access) and a second quote ("I can't thank you enough. I know you're working with little heads up right now." — Project Lead, GP Strategies). Neither the narrative nor the second quote is in `exhibits.ts`. Classification: `content-gap` — confirmed gap with specific content identified. Requires Dan's decision.

### 3.3 Quotes Distribution (7 of 15 Exhibits Have Quotes)

**Exhibits with quotes:** A (2), B (2), D (1), F (1), G (1), H (1), I (1) — 7 exhibits

**Exhibits without quotes:** C, E, J, K, L, M, N, O — 8 exhibits

**Classification by exhibit:**

- C, E: No quotes in exhibits.ts; 11ty source confirms no direct feedback quotes available (team recognition email for C; no external testimonial for architecture work on E). Classification: `intentional` — the absence is appropriate to the content type.
- J, K, L, M, N, O: No quotes in exhibits.ts. The 11ty sources for these exhibits contain contextText-focused forensic narratives but no direct testimonial quotes with individual attribution. Classification: `intentional` — these are investigation/architecture exhibits where the evidence is the work product, not the testimonial.
- D: Has 1 quote in exhibits.ts; 11ty source has 2 quotes. The second quote is a content gap. See 3.2.

**Exhibit H note:** The 11ty source for Exhibit H has 3 separate quotes from different respondents. The current exhibits.ts entry uses `attribution: 'GP Strategies (combined from respondents)'` with a single representative quote. This consolidation is a reasonable editorial decision. It could be classified as a content simplification (some detail lost) but is not a gap requiring remediation — the combined attribution is accurate and the quote is representative. Classification: `intentional`.

### 3.4 investigationReport Flag Values

**true (5 exhibits):** J, K, L, M, N — all have forensic investigation narratives

**false (1 exhibit):** O — ContentAIQ integration thread; explicitly not a forensic investigation

**absent (9 exhibits):** A, B, C, D, E, F, G, H, I — standard exhibits without investigation report status

The notable inconsistency: M and N have `investigationReport: true` but use `contextHeading: "Context"` rather than "Investigation Summary". This means visitors cannot distinguish M and N from standard context exhibits even if the rendering gap (Section 4) were fixed. STRUCT-01 and STRUCT-02 both need to address M and N.

### 3.5 isDetailExhibit Flag

**true (9 exhibits):** A, C, E, J, K, L, M, N, O

**absent (6 exhibits):** B, D, F, G, H, I — the field is undefined, not false

`ExhibitDetailPage.vue` does not reference the `isDetailExhibit` flag anywhere in its template. It is never rendered, never used for conditional display, and has no visual consequence under the current implementation.

Classification: `needs-review` — the field exists in the data model but serves no rendered purpose. Dan should decide: (a) does every exhibit need an explicit value? (b) what was the original intended use of this flag? (c) should the rendering layer use it for anything?

The split (true on 9, absent on 6) does not follow an obvious pattern — it is not correlated with the presence of quotes, contextText, or investigationReport. B and D have isDetailExhibit absent but are full exhibits; A has isDetailExhibit: true and is the most content-rich exhibit.

### 3.6 resolutionTable (Exhibit A Only)

Only Exhibit A has a `resolutionTable` (5 rows). No other exhibit has this field.

Classification: `intentional` — the issue/resolution table format is uniquely appropriate to Exhibit A's content. Electric Boat was a multi-issue technical engagement where five distinct SCORM and LMS problems were investigated and resolved. The tabular issue/resolution format documents this explicitly. No other exhibit in the set documents a multi-issue technical remediation in this way. No normalization needed.

### 3.7 Exhibit A Quote Attribution Anomaly

Exhibit A, quote 2: `attribution: ""` (empty string) with `role: "in summary email to EB leadership"`.

This is the only quote across all 15 exhibits where the `attribution` field is present but empty. All other quotes have a non-empty attribution string. The `role` field provides context but the rendered output shows "in summary email to EB leadership" as the sole identifier — there is no named source.

Classification: `formatting-inconsistency` — the attribution field should have a value (the speaker is the EB Chief of Learning Services, as confirmed by the 11ty source which attributes the "Thank you Dan" quote to the EB leadership chain summary). The fix for Phase 6 (STRUCT-03) is to populate the attribution field: `"Chief of Learning Services, Electric Boat"`.

---

## Critical Finding — investigationReport Rendering Gap

**Finding name:** `investigationReport` field declared but never rendered in `ExhibitDetailPage.vue`

**Finding severity:** High — the field's existence implies a future capability that currently has zero visual representation

**Evidence:**

The `investigationReport` boolean field is defined in the `Exhibit` interface in `src/data/exhibits.ts`:

```typescript
interface Exhibit {
  // ... other fields ...
  investigationReport?: boolean  // optional — true: J,K,L,M,N; false: O; absent: A–I
}
```

Six of 15 exhibits have explicit values:
- `investigationReport: true` — J (GM Course Completion), K (Microsoft MCAPS), L (Power Platform Audit), M (SCORM Debugger), N (BP Learning Platform)
- `investigationReport: false` — O (ContentAIQ Integration Thread)

**The `ExhibitDetailPage.vue` template renders the following fields:** `label`, `client`, `date`, `title` (header), `quotes` (v-if="exhibit.quotes?.length"), `contextText` + `contextHeading` (v-if="exhibit.contextText"), `resolutionTable` (v-if="exhibit.resolutionTable?.length"), `impactTags` (always, via TechTags component).

**The template does not reference `investigationReport` anywhere.** There is no `v-if="exhibit.investigationReport"`, no conditional block, no badge, no label, no button, and no rendering path keyed on this flag.

**Consequence:** A visitor navigating to Exhibits J, K, or L cannot distinguish these forensic investigation reports from standard context exhibits. The "Investigation Summary" heading (when correctly set) provides some signal, but:
1. Exhibits M and N have `investigationReport: true` but use `contextHeading: "Context"`, so the heading provides no signal there.
2. The flag's explicit `false` value on Exhibit O (ContentAIQ is explicitly declared not to be an investigation report) is completely invisible.

The SCORM Debugger (Exhibit M) and BP Learning Platform (Exhibit N) are currently labeled as "investigation reports" in the data model but displayed identically to standard context exhibits.

**Phase 6 target:** STRUCT-02 — implement rendering for the `investigationReport` flag. Options include a badge ("Investigation Report" label in the exhibit header), a conditional section heading, or a visual indicator. The rendering must handle all three states: `true` (affirmative display), `false` (negative display or omission), `undefined`/absent (no display). The STRUCT-02 requirement notes an "inverted display logic" concern — this should be resolved during Phase 6 implementation by clearly defining the semantic mapping before building.

---

## 11ty Source Cross-Reference

All 15 11ty source HTML files were fetched and reviewed. Findings are documented below per exhibit.

### Exhibit A
**11ty quotes found:**
1. "This company has one or some courses that they cannot get to work on their Cornerstone LMS..." — Program Manager, GP Strategies (initial contact note, not a testimonial)
2. "That SCORM wrapper does sound intriguing!" — Chief of Learning Services, Electric Boat (June 2018)
3. "I'd consider the last couple days a huge success, and I look forward to working with Dan in the future." — Chief of Learning Services, Electric Boat (August 17, 2018) — **present in exhibits.ts**
4. "I hear you did an AWESOME job onsite! EB really appreciated your support." — Sr. Director, Learning Solutions, GP Strategies — **not in exhibits.ts** (this quote appears in Exhibit B, attributed to a different role)
5. "Thanks for all of the great work you did out there. I heard about your work from several folks across the organization." — Director of Learning Technologies, GP Strategies — **not in exhibits.ts**
6. "Dan's technical expertise is tremendous... with his help, we were able to solve two large technical issues we were having" — Chief of Learning Services, Electric Boat (2019 on-site) — **not in exhibits.ts**
7. "You are so awesome. Thank you very much for your fast and clear response." — Chief of Learning Services, Electric Boat (January 2020) — **not in exhibits.ts**
8. "Thank you Dan for working with us and listening to our ideas and problems!" — second quote in exhibits.ts, appears in EB leadership summary email — **present in exhibits.ts** (with empty attribution)

**11ty context/background:** The 11ty source contains a full 7-year timeline (2017–2022) with dated entries for every major milestone: initial contact (Sept 2017), formal investigation (June 2018), two on-site visits (Aug 2018, March–April 2019), SCORM 2004 development (Aug 2018), Chrome 80 impact analysis (Jan 2020), and final documented engagement (Aug 2022). Total engagement scope: 574 emails across 49 EB personnel.

**Gap assessment:** The 11ty source has 5+ distinct named quotes not in exhibits.ts. The current exhibits.ts captures 2 quotes from the August 2018 on-site. The 2019 on-site quote ("Dan's technical expertise is tremendous...") is arguably stronger evidence than the 2018 quotes. The 7-year timeline and quantified engagement scope (574 emails, 49 personnel) would significantly strengthen the exhibit if added as contextText.

**Classification:** `content-gap` — substantial content exists in the 11ty source that is not in exhibits.ts. Dan must decide: (a) which quotes to include (2 current? add 2019 visit quote? add 2020 quote?), (b) whether to add contextText covering the engagement timeline and scope.

### Exhibit B
**11ty quotes found:** The 11ty source contains two quotes in the main evidence section, which match exactly what is in exhibits.ts. The 11ty additionally contains timeline quotes embedded within the narrative (Aug 2018 cascade: "I hear you did an AWESOME job onsite!" and May 2019 cascade: "Thanks for all of the great work you did out there..."). Both are the same quotes captured in exhibits.ts.

**11ty context/background:** The 11ty source has extensive narrative sections: Personnel (3 paragraphs), Timeline (6 dated entries covering Aug 2018–May 2019), First Cascade analysis (Aug 2018), Second Cascade (April 2019), Pattern Analysis, and Significance. The `contextText` in exhibits.ts provides a 2-sentence summary of the overall pattern.

**Gap assessment:** The exhibits.ts contextText correctly summarizes the core finding. The 11ty's additional narrative (personnel lists, timeline entries, pattern analysis) is explanatory scaffolding that the current contextText format is not designed to hold. No material content gap — the key quotes and the core pattern statement are captured.

**Classification:** No gap — contextText is an accurate summary; additional 11ty narrative is structural, not missing exhibit content.

### Exhibit C
**11ty quotes found:** The 11ty source has two blockquotes: (1) a longer quote about "Dan Novak 'The Fiddler'" describing the automation tool ("resulted in a savings of about 600 hours of labor"), and (2) "Page after page, lesson after lesson, week after week..." describing the team's approach. The exhibits.ts has no quotes.

**11ty context/background:** The 11ty source contextText is aligned with what appears in exhibits.ts — both describe the 1,216-lesson content refresh, Dan's automation role, and the All Hands meeting recognition. The exhibits.ts contextText is a well-condensed summary.

**Gap assessment:** The 11ty has direct testimonial quotes that are not in exhibits.ts. The "600 hours of labor" quote from the Content Team Manager is strong evidence. However, Exhibit C is classified as having no quotes (`contextHeading: "Context"`, no `quotes` field). Whether to add quotes is a content decision.

**Classification:** `needs-review` for quotes — the 11ty has quotable material that could be added. However, the contextText accurately covers the exhibit's core message. Dan should decide whether Exhibit C should have quotes added.

> **Note for audit:** Per the plan's classification schema, this is not strictly a "content-gap" because the current exhibits.ts is not missing content that damages the exhibit's message — it's a question of enrichment. Keeping as `intentional` in the comparison table; noting here for Dan's awareness.

### Exhibit D
**11ty quotes found:**
1. "The client contact reached out to me today to convey her appreciation for the work that you two did to test the WF courses despite seeing issues related to IE..." — Director of Learning Technologies, GP Strategies — **present in exhibits.ts**
2. "I can't thank you enough. I know you're working with little heads up right now." — Project Lead, GP Strategies — **NOT in exhibits.ts**

**11ty context/background:** The 11ty source for Exhibit D is one of the most content-rich pages in the set. It contains:
- Full engagement background: 100+ course migration from legacy formats into Xyleme LCMS, 6-month timeline, 223 tracked emails
- QA budget estimation methodology (interactivity-level multipliers)
- Xyleme SCORM publishing expertise (thin package architecture, prior GPiLEARN experience)
- Cross-browser SCORM failure diagnosis (Flash ActionScript, IE COM SCORM adapter, race condition root cause)
- Client trust indicator: Wells Fargo granted Dan full administrative access to Xyleme Studio
- Detailed findings section (4 technical challenge categories)
- Context section explaining the Flash/IE transitional period

None of this narrative is in exhibits.ts. The current exhibits.ts for Exhibit D has only: 1 quote, impactTags, exhibitLink.

**Gap assessment:** The 11ty source contains the second quote and a full contextText worth of background content. This is the most significant content gap in the set in terms of what's missing vs. what exists. The current exhibit rendering shows only 1 quote and 4 impact tags — the 11ty page has 8+ sections of content.

**Classification:** `content-gap` — specific content identified (second quote: "I can't thank you enough..."; background narrative covering the 100+ course migration, QA methodology, SCORM failure diagnosis). Dan must decide whether to port this content.

### Exhibit E
**11ty quotes found:** No direct testimonial quotes in the 11ty source. The Exhibit E page focuses on the technical architecture and impact metrics (CSBB Dispatch system), with a prominent callout box ("Built in 2011 — five years before Rustici released Content Controller"). No external client quotes are present.

**11ty context/background:** The 11ty source is a full technical exhibit page with 8 sections (Background, Personnel, Sequence of Events, Findings, Probable Cause, Outcome, Naming, Technologies). The contextText in exhibits.ts accurately summarizes the core architecture and the "5 years before Content Controller" claim. The 11ty also names specific clients (FPL, Puget Sound Energy, NRG, Colorado Springs Utilities, Calpine, Exelon, BP) and the full system scale (~2,000 courses, ~20 clients).

**Gap assessment:** The client names and system scale numbers could enrich exhibits.ts but are not strictly absent. The contextText summary is accurate and substantive. No material gap.

**Classification:** No gap — contextText correctly captures the key claim.

### Exhibit F
**11ty quotes found:** One quote: "Thanks so much for your great work making the fixes. HSBC LMS team has approved the updated courseware!" — Project Manager, GP Strategies (HSBC Account). This matches exhibits.ts exactly.

**11ty context/background:** The 11ty source for Exhibit F is extensive: Background (560+ documented interactions, 25 contacts, 5 countries), 3 Technical Contributions subsections (SCORM API Wrapper Bug, Flash Legacy Content Recovery, Global Localization Debugging), Findings, and Significance. The contextText in exhibits.ts ("Tier 1 global banking client across 5 countries. Found a SCORM API wrapper bug...") is a condensed but accurate summary of the three contributions.

**Gap assessment:** No missing quotes. The contextText is a high-quality summary. The 11ty's richer detail (560+ emails, 25 contacts, 7-year engagement) adds depth but the core message is captured.

**Classification:** No gap — contextText and quote are accurate.

### Exhibit G
**11ty quotes found:** One quote: "Thanks for the thorough documentation of the issue and solution. Do you have a figure?" — SunTrust (Client). The exhibits.ts quote is "Thanks for the thorough documentation of the issue and solution." — the 11ty source includes the follow-up "Do you have a figure?" which is omitted from exhibits.ts. The follow-up question is significant (shows the documentation quality directly converted to a pricing inquiry), but the core quote is present.

**11ty context/background:** The 11ty source for Exhibit G is very extensive: full integration architecture description (SCORM-to-API wrapper, 5-phase development lifecycle), key architectural decisions, security/trust indicators (SunTrust employee credentials and laptop issued to Dan), and significance analysis. The contextText in exhibits.ts ("Team investigated and documented the learning platform situation, producing a detailed findings report...") is a reasonable summary.

**Gap assessment:** The "Do you have a figure?" follow-up to the quote is absent from exhibits.ts — this detail demonstrates that Dan's technical documentation directly generated a business development outcome. Not a critical gap, but notable. The contextText is somewhat generic compared to the rich 11ty source.

**Classification:** No material gap — exhibits.ts captures the core quote and context. The missing "Do you have a figure?" is a minor enrichment opportunity.

### Exhibit H
**11ty quotes found:** Three quotes in the 11ty source:
1. "Kudos on finding this solution so promptly!" — GP Strategies
2. "Agreed. Thank you so much. This email was a huge relief." — GP Strategies
3. "Yes, thank you all so very much for your time and diligence on this effort!! Please share this resolution with any other appropriate parties." — GP Strategies

The exhibits.ts has one combined quote: "Kudos on finding this solution so promptly! ... This email was a relief." attributed to "GP Strategies (combined from respondents)". This is a deliberate editorial consolidation.

**11ty context/background:** The 11ty source contextText aligns with exhibits.ts — both describe the same LMS completion tracking failure and same-day root cause fix.

**Gap assessment:** The consolidation of 3 quotes into 1 loses the "please share this resolution with any other appropriate parties" quote, which adds information (cross-organizational visibility). However, the combined quote is accurate and representative. The `attribution: 'GP Strategies (combined from respondents)'` accurately discloses the consolidation.

**Classification:** No gap requiring remediation — editorial consolidation is reasonable.

### Exhibit I
**11ty quotes found:** One quote: "Thank you for all your amazing work!" — Senior Learning Project Manager, GP Strategies. This matches exhibits.ts exactly.

**11ty context/background:** The 11ty source for Exhibit I is extensive: accessibility practice evolution from HSBC through PNC to TD Bank, standards gap analysis, methodology description (GP's formal practice plus Dan's forensic-level ARIA debugging), accessibility scope details (WCAG 2.1 AA, Section 508, JAWS/NVDA), quantified scale (479 accessibility emails in 2022 out of 4,173 total). The contextText in exhibits.ts accurately captures the core: "Most experienced accessibility evaluator on the TD Bank engagement (2021–2024). Contributed to GP's WCAG 2.1 AA evaluation methodology..."

**Gap assessment:** No missing quotes. The contextText is a solid summary. The 11ty's quantitative data (479 emails, 4,173 total correspondence, 4 banking clients) would strengthen the exhibit but is not absent in a way that damages the current message.

**Classification:** No gap.

### Exhibit J
**11ty quotes found:** No direct testimonial quotes in the 11ty source. The exhibit is a forensic investigation report with methodology-focused sections (Background, Personnel, Sequence of Events, Findings, Probable Cause, Outcome). No named individual provided a testimonial.

**11ty context/background:** The 11ty source contextText aligns with exhibits.ts. The "Swiss cheese model" framing and 5 concurrent systemic failures are correctly captured. The 11ty adds detail on the 10,000+ course library scale, the NTSB methodology framing, and the indirect validation (GM later migrated away from the platform).

**Gap assessment:** No missing quotes (none exist in source). The contextText summary is accurate.

**Classification:** No gap.

### Exhibit K
**11ty quotes found:** No direct testimonial quotes. The exhibit documents Dan's architectural contribution (hybrid AI/structured data design) rather than client praise.

**11ty context/background:** The 11ty source describes the declarative agent problem (prompt engineering ceiling), the hybrid architecture breakthrough, and the POC delivery timeline. The contextText in exhibits.ts ("Building on a decade of GP Strategies' embedded work on Microsoft accounts, Dan was brought in to evolve their AI training agent in Copilot Studio...") is accurate. The 11ty adds the named contributor (Max Glick, Lead Developer) and detailed component breakdown.

**Gap assessment:** No missing quotes. contextText is accurate.

**Classification:** No gap.

### Exhibit L
**11ty quotes found:** No direct testimonial quotes. The exhibit is an architectural audit/diagnosis narrative.

**11ty context/background:** The 11ty source covers the year-long Power Platform learning curve, the requirements degradation chain (PPT → Word → Excel → ADO), the forensic methodology (AI-assisted analysis using GitHub Spec Kit after gaining platform fluency), and the 5 foundational findings. The contextText in exhibits.ts accurately captures: "Internal ERP modernization on Power Platform where institutional knowledge was lost through organizational transitions. AI-assisted forensic analysis exposed five foundational gaps..."

**Gap assessment:** No missing quotes. contextText is accurate.

**Classification:** No gap.

### Exhibit M
**11ty quotes found:** No direct testimonial quotes. The SCORM Debugger exhibit documents an internal tool — no external client testimonial exists.

**11ty context/background:** The 11ty source covers the QA pain point (hours per testing cycle), the TASBot/speedrunning inspiration, the Vue.js implementation, and the organizational failure to fully adopt the tool. The contextText in exhibits.ts ("Created a Vue.js SCORM debugging tool inspired by TASBot/speedrunning save states. Reduced QA testing cycles from hours to minutes...") is accurate.

**Gap assessment:** No missing quotes. contextText is accurate. The 11ty adds the "culture-fit diagnostic" framing and the Rustici comparison, which are interesting but not missing from the core message.

**Classification:** No gap in content. The `formatting-inconsistency` classification in the comparison table refers to the contextHeading being "Context" when investigationReport is true — this is a data issue, not a content gap.

### Exhibit N
**11ty quotes found:** No direct testimonial quotes. The BP Learning Platform exhibit documents a development engagement.

**11ty context/background:** The 11ty source covers the multi-tenant rebranding challenge (one week → several months), the Material UI theming discovery process, Cognito troubleshooting, Watershed LRS query analysis, and the pattern recognition observation (CSBB Dispatch 2011 → BP Learning Platform 2024). The contextText in exhibits.ts accurately captures this.

**Gap assessment:** No missing quotes. contextText is accurate. Same `formatting-inconsistency` classification note as M (contextHeading should be "Investigation Summary" given investigationReport: true, though N is more of a development engagement than a forensic investigation — this may warrant Dan's review of the flag value itself).

**Classification:** No gap in content. formatting-inconsistency for contextHeading.

### Exhibit O
**11ty quotes found:** No direct testimonial quotes. ContentAIQ is an integration pattern narrative.

**11ty context/background:** The 11ty source for Exhibit O is the most complex — it covers three sub-projects (BP Learning Platform, AICPA Bridge Adapter, ContentAIQ) with individual sections for each. The contextText in exhibits.ts accurately captures the integration thread and pattern recognition theme.

**Gap assessment:** No missing quotes. The exhibits.ts contextText is a solid summary. The 11ty's detail on the AICPA Bridge Adapter (webhook-driven sync, PostgreSQL state tracking, L3 escalation role) is not in exhibits.ts but is also not central to the exhibit's main claim.

**Classification:** No gap.

---

## Visual Assessment — Best of Breed

After reviewing screenshots of all 15 exhibits at 1280px, 768px, and 375px, the following exhibits serve as the best reference targets for normalization.

### Best of Breed: Exhibits F, G, H, I (The Standard Complete Structure)

**Why selected:** Exhibits F, G, H, and I all share the same structural pattern: one quote + "Context" heading + contextText paragraph + impact tags. At 1280px, each of these exhibits is visually balanced — the quote provides a human testimonial signal in the top section, the context paragraph gives the engagement background, and the impact tags close with scannable keywords. No section feels orphaned or disproportionate.

Exhibits G and I are particularly clean — the contextText is dense enough to fill the section without being overwhelming, and the single quote is concise enough to read quickly. Exhibit F is equally clean. Exhibit H is similar but the attribution "(combined from respondents)" is the only slightly awkward element.

**Recommended use:** F/G/H/I as the structural normalization target for all exhibits that should have the standard structure (quote + context + tags). When normalizing Exhibit D by adding contextText, the result should match this pattern. When deciding how to render `investigationReport`, these exhibits establish the visual baseline to which investigation exhibits should aspire.

### Best of Breed: Exhibit B (The Dual-Quote Variant)

**Why selected:** Exhibit B has two quotes, a Context heading, contextText, and impact tags — the richest standard structure without unique elements. At 1280px, the two-quote layout is visually compelling. The transition from quotes to context to tags feels natural. Exhibit A has two quotes but no context, making B the better reference for the "multiple quotes" variant.

**Recommended use:** If other exhibits gain a second quote through Phase 7 content porting (e.g., Exhibit D if the second quote is added), use Exhibit B as the structural reference for how two quotes render in the current template.

### Best of Breed: Exhibit J/K/L (The Investigation Summary Sub-Reference)

**Why selected:** Exhibits J, K, and L correctly implement the investigation summary pattern — "Investigation Summary" heading + dense contextText + impact tags. At 1280px, J and K in particular have contextText paragraphs that are substantive enough to fill the section well. The absence of quotes is appropriate for this exhibit type; the contextText carries the weight.

**Recommended use:** When implementing STRUCT-02 (investigationReport rendering) and STRUCT-01 (contextHeading fix for M and N), J/K/L represent the target state. M and N should visually match J/K/L once both fixes are applied.

**Exhibits to avoid as reference targets:**

- Exhibit D: Extremely sparse (1 quote + 4 tags, nothing else). The empty space between the quote and the footer is visually awkward. This is the worst-case state, not a reference target.
- Exhibit A: Unique (no context, has resolution table) — not a reference for normalizing other exhibits.
- Exhibit C, E: No quotes — appropriate for their content type but represent a lower-density structure; use only as reference if an exhibit genuinely has no applicable testimonial.

---

## Recommended Actions for Phase 6 and Phase 7

### 7.1 Phase 6 — Structural Normalization

These changes are code-only (no `exhibits.ts` content changes required). They can proceed without Dan's content decision.

**STRUCT-01: Fix contextHeading on Exhibits M and N**

Current state: M and N have `contextHeading: "Context"` despite `investigationReport: true`.
Target state: Change to `contextHeading: "Investigation Summary"` to match J, K, L.

Exhibits affected:
- Exhibit M (SCORM Debugger) — change `"Context"` to `"Investigation Summary"`
- Exhibit N (BP Learning Platform) — change `"Context"` to `"Investigation Summary"`

All other exhibits require no contextHeading change.

**STRUCT-02: Implement investigationReport Flag Rendering**

Current state: The `investigationReport` field is never referenced in `ExhibitDetailPage.vue`.
Target state: Add a visual indicator (badge, label, or conditional heading text) that displays based on the flag value.

Exhibit states to handle:
- `investigationReport: true` (J, K, L, M, N) — affirmative display: "Investigation Report" badge or equivalent
- `investigationReport: false` (O) — Dan must decide: show "Not an Investigation Report" label, or simply no badge (the absence of the affirmative label may be sufficient)
- `investigationReport` absent (A, B, C, D, E, F, G, H, I) — no display

Implementation note: Before coding, confirm the semantic mapping with Dan. The STRUCT-02 requirement mentions a pre-existing "inverted display logic" concern. Since the field is currently not rendered at all, this concern refers to a planned future implementation, not an existing bug. The correct mapping should be defined before the first line of template code is written.

**STRUCT-03: Fix Empty Attribution on Exhibit A, Quote 2**

Current state: `attribution: ""` (empty string); `role: "in summary email to EB leadership"`.
Target state: Populate attribution with the speaker's role. Based on 11ty source context, the speaker is the EB Chief of Learning Services. Suggested value: `"Chief of Learning Services, Electric Boat"`.

Only Exhibit A is affected.

### 7.2 Phase 7 — Content Gap Fill

**CRITICAL: None of the following changes should be made to `exhibits.ts` without Dan's explicit approval of this list (CONT-02 gate).**

**CONT-01: Content Gap List**

| Exhibit | Gap type | Content exists in 11ty source | Dan decision needed |
|---------|----------|-------------------------------|---------------------|
| A | Missing contextText | 7-year engagement timeline (2017–2022); 574 emails, 49 personnel; cross-domain architecture background | Add contextText? Which content to summarize? |
| A | Missing quotes | 2019 on-site: "Dan's technical expertise is tremendous..." (EB Chief); 2020: "You are so awesome..." (EB Chief); 2018 Director: "Thanks for all the great work..." | Which additional quotes to add, if any? |
| D | Missing second quote | "I can't thank you enough. I know you're working with little heads up right now." — Project Lead, GP Strategies | Add second quote? |
| D | Missing contextText | 100+ course migration background; QA estimation methodology; IE/Flash SCORM diagnosis; 223 emails, 6-month engagement; full Xyleme admin access | Add contextText with this background? |
| C | Potential quotes | Content Team Manager quote about "The Fiddler" and 600 hours saved (present in 11ty, not in exhibits.ts) | Add quotes to Exhibit C? |

**Exhibits with NO content gaps (11ty source confirms alignment):** B, E, F, G, H, I, J, K, L, M, N, O

**Note on Exhibit G:** The "Do you have a figure?" follow-up to the SunTrust quote (omitted from exhibits.ts) is a minor enrichment opportunity — it demonstrates the quote's business development impact. Dan may choose to include it as a second quote.

**Note on Exhibit C:** The gap is optional enrichment, not a missing structural element. Exhibit C's current exhibits.ts entry accurately represents the exhibit's core message; the 11ty quotes would add testimonial depth.
