# Phase 24: Findings Backfill - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract NTSB-style diagnostic findings from narrative sections for 4 exhibits (D, F, H, K) and add them as typed findings[] arrays. Findings must be diagnostic discoveries — what was wrong and why — not outcomes, observations, or sales pitches. Include severity where the finding is a technical/process issue. Promote findingsHeading where exhibits have non-default headings.

Exhibit G (SunTrust) skipped — content doesn't fit NTSB-style findings naturally.

</domain>

<decisions>
## Implementation Decisions

### Findings Content (CONT-02 gate — user-approved)

#### Exhibit D (Wells Fargo) — 4 findings
1. finding: "Legacy format incompatibilities", severity: "High", description: "Courses authored in Adobe Presenter and standalone HTML5 required significant structural rework to map into Xyleme's topic-based authoring model. Flash modules needed careful handling to ensure ActionScript interactions functioned when wrapped in Xyleme's SCORM publishing layer."
2. finding: "IE runtime environment failures", severity: "Critical", description: "Wells Fargo's corporate browser standard was Internet Explorer, which introduced SCORM API communication quirks. Flash-based content exhibited completion tracking failures from a race condition in IE's COM SCORM adapter, exacerbated by Xyleme's thin package latency."
3. finding: "High-volume delivery cadence", severity: "High", description: "100+ courses in scope over a six-month timeline required a reliable, repeatable QA process. Dan's interactivity-level-based estimation methodology provided the predictability needed to schedule testing across the full portfolio."
4. finding: "Client relationship pressure", severity: "High", description: "Wells Fargo was explicitly identified as a critical account. Any delays in testing turnaround would cascade into missed course launch deadlines, potentially damaging the strategic relationship."

#### Exhibit F (HSBC) — 3 findings
1. finding: "SCORM API wrapper bug", severity: "Critical", description: "The SCORM API wrapper used across HSBC courseware contained a hardcoded exit value that conflicted with SuccessFactors' completion detection logic. Silent failure — no console errors, no visible indication — persisted undetected across multiple LMS migrations."
2. finding: "Lost Flash source files", severity: "High", description: "Legacy Flash-based courses needed updates but original FLA source files had been lost through vendor project handoffs. Required forensic decompilation of published SWF files to recover assets, ActionScript code, and timeline data."
3. finding: "Cross-region deployment inconsistencies", severity: "High", description: "Localized HTML5 courses failed to deploy correctly across HSBC's global SAP SuccessFactors instance spanning Mexico, India, and the Philippines. Diagnosis required navigating time zones, language barriers, and regional LMS configuration differences."

#### Exhibit H (Metal Additive) — 1 finding
1. finding: "LMS configuration mismatch", severity: "Critical", description: "High-visibility additive manufacturing course was publishing SCORM completion data correctly, but the LMS was not configured to receive it in the expected format. Failure surfaced only in production after the course had already passed QA."

#### Exhibit K (Microsoft MCAPS) — 2 findings
1. finding: "LLM used as data store", severity: "Critical", description: "The original declarative agent architecture treated the LLM as both interface and data store. LLMs are probabilistic — they approximate, hallucinate, and lose context across conversation boundaries. For training applications requiring deterministic progress tracking, this was a fundamental architectural mistake."
2. finding: "No separation of deterministic and probabilistic concerns", severity: "High", description: "Course catalog, progress tracking, assessment scoring, and navigation paths were all handled through prompt engineering rather than structured data. No auto-save, no persisted state, no deterministic sequence enforcement."

### Extraction Approach
- Findings are concise summaries, not verbatim copies of narrative text
- Narrative sections are kept intact — findings array is additive
- Severity added where the finding is a diagnostic/technical issue
- findingsHeading only if exhibit had a non-default findings heading

### Scope Change
- BKFL-03 (Exhibit G / SunTrust) removed — content doesn't fit NTSB-style findings pattern

### Claude's Discretion
- JSON field ordering within each finding object
- Exact placement in exhibits.json relative to other exhibit fields

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/data/json/exhibits.json — target file for all findings additions
- src/types/exhibit.ts — FindingEntry type (updated in Phase 23 with outcome, category)

### Established Patterns
- Findings arrays placed after sections[] or after last typed array in each exhibit
- Severity values use capitalized strings: "Critical", "High"

### Integration Points
- Layout components already render findings — no template changes needed
- Tests may need count updates (exhibits with findings count)

</code_context>

<specifics>
## Specific Ideas

- Findings style: NTSB-style diagnostic discoveries — what was wrong and why
- NOT outcomes, observations, sales pitches, or pattern recognition
- User approved all content verbatim above

</specifics>

<deferred>
## Deferred Ideas

- Exhibit G (SunTrust) findings — skipped, content doesn't fit findings pattern naturally
- Exhibits B, C, I findings — already out of scope per REQUIREMENTS.md

</deferred>
