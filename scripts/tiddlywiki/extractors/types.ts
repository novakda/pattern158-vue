// scripts/tiddlywiki/extractors/types.ts
// Phase 53 — shared entity contracts for the DOM-extractor layer.
// SCAF-08 forbidden in this file: wall-clock reads (setTimeout, timers,
// instantiated dates), parallel iteration helpers, randomness.

/// <reference lib="dom" />

import { Window } from 'happy-dom'

// ---------------------------------------------------------------------------
// FAQ (EXTR-01)
// ---------------------------------------------------------------------------

export interface FaqItem {
  readonly id: string
  readonly question: string
  readonly answer: string
  readonly categories: readonly string[]
}

// ---------------------------------------------------------------------------
// Exhibit (EXTR-02)
// ---------------------------------------------------------------------------

export interface ExhibitSubsection {
  readonly heading: string
  readonly text: string
}

export interface ExhibitSection {
  readonly heading: string
  readonly text: string
  readonly subsections: readonly ExhibitSubsection[]
}

export interface Exhibit {
  readonly label: string
  readonly client: string
  readonly date: string
  readonly title: string
  readonly exhibitType: 'investigation-report' | 'engineering-brief'
  readonly contextHeading: string
  readonly contextText: string
  readonly sections: readonly ExhibitSection[]
  readonly impactTags: readonly string[]
  readonly summary: string
  readonly role: string
  readonly emailCount: number
}

// ---------------------------------------------------------------------------
// Personnel (EXTR-03)
// ---------------------------------------------------------------------------

export type PersonnelEntryType = 'individual' | 'group' | 'anonymized'

export interface PersonnelEntry {
  readonly name: string
  readonly title: string
  readonly organization: string
  readonly role: string
  readonly entryType: PersonnelEntryType
  readonly sourceExhibitLabel: string
}

// ---------------------------------------------------------------------------
// Findings (EXTR-04)
// ---------------------------------------------------------------------------

export interface FindingEntry {
  readonly finding: string
  readonly description: string
  readonly resolution: string
  readonly outcome: string
  readonly category: string
  readonly severity: string
  readonly sourceExhibitLabel: string
}

// ---------------------------------------------------------------------------
// Technologies (EXTR-05)
// ---------------------------------------------------------------------------

export interface TechnologyEntry {
  readonly name: string
  readonly context: string
  readonly sourceExhibitLabel: string
}

// ---------------------------------------------------------------------------
// Testimonials (EXTR-06)
// ---------------------------------------------------------------------------

export interface Testimonial {
  readonly text: string
  readonly attribution: string
  readonly role: string
  readonly sourcePageLabel: string
}

// ---------------------------------------------------------------------------
// Pages (EXTR-07)
// ---------------------------------------------------------------------------

export interface PageHeading {
  readonly level: number
  readonly text: string
}

export interface PageSegment {
  readonly heading: PageHeading
  readonly text: string
}

export interface PageContent {
  readonly title: string
  readonly headings: readonly PageHeading[]
  readonly segments: readonly PageSegment[]
}

// ---------------------------------------------------------------------------
// Case Files Index (EXTR-08)
// ---------------------------------------------------------------------------

export interface CaseFilesIndexEntry {
  readonly label: string
  readonly client: string
  readonly date: string
  readonly title: string
  readonly exhibitType: 'investigation-report' | 'engineering-brief'
}

export interface CaseFilesIndex {
  readonly entries: readonly CaseFilesIndexEntry[]
}

// ---------------------------------------------------------------------------
// ExtractorError — thrown by any extractor on structural failure.
// Options-bag constructor mirrors Phase 48 CaptureError pattern.
// ---------------------------------------------------------------------------

export class ExtractorError extends Error {
  readonly extractor?: string
  readonly cause?: unknown
  constructor(
    message: string,
    opts?: { extractor?: string; cause?: unknown },
  ) {
    super(message)
    this.name = 'ExtractorError'
    this.extractor = opts?.extractor
    this.cause = opts?.cause
  }
}

// ---------------------------------------------------------------------------
// parseHtml — shared synchronous DOM parser used by every extractor.
// Each extractor owns its own Window instance (no shared parser state across
// calls); the happy-dom Document is cast to the standard DOM Document because
// the editorial/scripts tsconfig omits the 'dom' lib globally and only
// triple-slash references it file-scoped.
// ---------------------------------------------------------------------------

export function parseHtml(html: string): Document {
  const window = new Window()
  const { document } = window
  document.body.innerHTML = html
  return document as unknown as Document
}
