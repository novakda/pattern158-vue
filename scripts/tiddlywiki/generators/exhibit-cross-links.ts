// scripts/tiddlywiki/generators/exhibit-cross-links.ts
// Phase 54 Plan 06 — ATOM-05 producer half.
// Computes the four [[...]] wikitext link arrays an exhibit body needs,
// filtered to entries belonging to the given exhibit. Link targets match the
// exact titles produced by Plans 54-02..05.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type {
  Exhibit,
  PersonnelEntry,
  FindingEntry,
  TechnologyEntry,
  Testimonial,
} from './types.ts'
import {
  truncateAtWordBoundary,
  formatExhibitTitle,
  wikiLink,
} from './helpers.ts'

const FINDING_TRUNCATE_CHARS = 60
const ATTRIBUTION_TRUNCATE_CHARS = 40
const ANONYMOUS_FALLBACK = '(anonymous)'

export interface CrossLinkBundle {
  readonly personnelLinks: readonly string[]
  readonly findingsLinks: readonly string[]
  readonly technologiesLinks: readonly string[]
  readonly testimonialsLinks: readonly string[]
}

export interface ExhibitEntities {
  readonly personnel: readonly PersonnelEntry[]
  readonly findings: readonly FindingEntry[]
  readonly technologies: readonly TechnologyEntry[]
  readonly testimonials: readonly Testimonial[]
}

function personnelTitle(entry: PersonnelEntry): string {
  if (entry.name.trim().length > 0) return entry.name
  return `${entry.role} @ ${entry.organization}`
}

function findingTitle(entry: FindingEntry): string {
  return `${entry.sourceExhibitLabel} Finding: ${truncateAtWordBoundary(entry.finding, FINDING_TRUNCATE_CHARS)}`
}

function testimonialTitle(entry: Testimonial): string {
  if (entry.attribution.trim().length === 0) {
    return `Testimonial: ${ANONYMOUS_FALLBACK}`
  }
  return `Testimonial: ${truncateAtWordBoundary(entry.attribution, ATTRIBUTION_TRUNCATE_CHARS)}`
}

function sortedUniqueLinks(titles: readonly string[]): string[] {
  const unique = new Set<string>()
  for (const t of titles) unique.add(wikiLink(t))
  return Array.from(unique).sort()
}

export function buildExhibitCrossLinks(
  exhibit: Exhibit,
  entities: ExhibitEntities,
): CrossLinkBundle {
  const exhibitTitle = formatExhibitTitle(exhibit.label)

  const personnelTitles: string[] = []
  for (const e of entities.personnel) {
    if (e.sourceExhibitLabel !== exhibit.label) continue
    personnelTitles.push(personnelTitle(e))
  }

  const findingTitles: string[] = []
  for (const e of entities.findings) {
    if (e.sourceExhibitLabel !== exhibit.label) continue
    findingTitles.push(findingTitle(e))
  }

  // Technologies: apply the same case-insensitive merge + first-casing-wins
  // rule that Plan 54-04 uses for its tiddler emission so link targets align.
  const techByKey = new Map<string, string>()
  for (const e of entities.technologies) {
    if (e.sourceExhibitLabel !== exhibit.label) continue
    const key = e.name.toLowerCase().trim()
    if (key.length === 0) continue
    if (!techByKey.has(key)) techByKey.set(key, e.name)
  }
  const technologyTitles: string[] = []
  for (const displayName of techByKey.values()) {
    technologyTitles.push(`Tech: ${displayName}`)
  }

  const testimonialTitles: string[] = []
  for (const e of entities.testimonials) {
    if (e.sourcePageLabel !== exhibitTitle) continue
    testimonialTitles.push(testimonialTitle(e))
  }

  return {
    personnelLinks: sortedUniqueLinks(personnelTitles),
    findingsLinks: sortedUniqueLinks(findingTitles),
    technologiesLinks: sortedUniqueLinks(technologyTitles),
    testimonialsLinks: sortedUniqueLinks(testimonialTitles),
  }
}
