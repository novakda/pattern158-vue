// scripts/tiddlywiki/generators/types.ts
// Phase 54 — shared import surface for the atomic tiddler generators.
// Pure type re-exports: generators produce Tiddler[] (tid-writer shape) from
// extractor entity inputs. No runtime symbols here.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

export type { Tiddler } from '../tid-writer.ts'

export type {
  PersonnelEntry,
  PersonnelEntryType,
  FindingEntry,
  TechnologyEntry,
  Testimonial,
  Exhibit,
  ExhibitSection,
} from '../extractors/types.ts'
