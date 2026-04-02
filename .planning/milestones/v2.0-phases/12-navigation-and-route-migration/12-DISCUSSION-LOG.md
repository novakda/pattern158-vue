# Phase 12: Navigation and Route Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 12-navigation-and-route-migration
**Areas discussed:** Route URL, NavBar placement, Homepage CTA wording, Contact page link

---

## Route URL

| Option | Description | Selected |
|--------|-------------|----------|
| /case-files | Matches page name exactly. Forensic brand tone. Hyphenated per URL convention. | ✓ |
| /evidence | Shorter, aligns with "evidence-based portfolio" framing. Less literal. | |
| /exhibits | Matches the data model term. Concise, less branded. | |

**User's choice:** /case-files
**Notes:** None — user selected recommended option.

### Redirect Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Vue Router redirect | `redirect: '/case-files'` on old routes. Instant client-side redirect. | ✓ |
| Keep old routes temporarily | Old routes stay functional until Phase 13. Risk of dual paths. | |
| Remove old routes entirely | Delete routes now. Bookmarks break with 404. | |

**User's choice:** Vue Router redirect
**Notes:** None — user selected recommended option.

---

## NavBar Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Replace Portfolio's slot (5th) | Case Files goes where Portfolio was. Field Reports removed. Same position visitors expect. | ✓ |
| Move to end (before Contact) | Case Files 6th, Contact 7th. Groups content pages together. | |
| Replace Field Reports' slot (7th) | Case Files goes where Field Reports was. Portfolio removed. | |

**User's choice:** Replace Portfolio's slot
**Notes:** Final nav order: Home, Philosophy, FAQ, Technologies, Case Files, Contact

---

## Homepage CTA Wording

### Hero CTA

| Option | Description | Selected |
|--------|-------------|----------|
| "View Case Files" | Direct match to page name. Forensic brand tone. | ✓ |
| "View My Work" | Keep current label, update link only. Softer tone. | |
| "Review the Evidence" | Investigation metaphor. More personality, less conventional. | |

**User's choice:** "View Case Files"
**Notes:** None — user selected recommended option.

### Testimonial Section CTA

| Option | Description | Selected |
|--------|-------------|----------|
| "View All Case Files" | Consistent with hero CTA. Both use same page name. | ✓ |
| "Explore the Evidence" | More evocative, differentiates from hero CTA. | |
| "See All Exhibits" | Uses data model term. Technically accurate but less branded. | |

**User's choice:** "View All Case Files"
**Notes:** None — user selected recommended option.

---

## Contact Page Link

| Option | Description | Selected |
|--------|-------------|----------|
| Update both href and text | href="/case-files" with display text "pattern158.solutions/case-files". Accurate. | ✓ |
| Update href only | Link goes to /case-files but text stays "pattern158.solutions/portfolio". Misleading. | |
| Remove the link entirely | Drop the portfolio/case-files link from contact methods. | |

**User's choice:** Update both href and text
**Notes:** None — user selected recommended option.

---

## Claude's Discretion

- Storybook story route references (update to /case-files)
- Test assertion route references (update to match new route)
- Any additional hardcoded references discovered during implementation
- Detail page back-nav link text (D-08 — "Back to Case Files")

## Deferred Ideas

- PortfolioPage.vue and TestimonialsPage.vue file deletion — Phase 13
- FlagshipCard.vue deletion — Phase 13
- Storybook stories for CaseFilesPage — REF-01 (v2.x)
