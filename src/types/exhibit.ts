export interface ExhibitQuote {
  text: string
  attribution: string
  role?: string
}

export interface ExhibitResolutionRow {
  issue: string
  resolution: string
}

export interface ExhibitFlowStep {
  label: string
  detail: string
}

export interface ExhibitTimelineEntry {
  date: string
  heading: string
  body: string
  quote?: string
  quoteAttribution?: string
}

export interface ExhibitMetadataItem {
  label: string
  value: string
}

export interface PersonnelEntry {
  name?: string
  title?: string
  organization?: string
  role?: string
  involvement?: string
}

export interface TechnologyEntry {
  category: string
  tools: string
}

export interface ExhibitSection {
  heading?: string
  type: 'text' | 'table' | 'flow' | 'timeline' | 'metadata'
  body?: string
  columns?: string[]
  rows?: string[][]
  steps?: ExhibitFlowStep[]
  entries?: ExhibitTimelineEntry[]
  items?: ExhibitMetadataItem[]
}

export type ExhibitType = 'investigation-report' | 'engineering-brief'

export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  exhibitType: ExhibitType
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  personnel?: PersonnelEntry[]
  technologies?: TechnologyEntry[]
  sections?: ExhibitSection[]
  impactTags: string[]
  exhibitLink: string
  isFlagship?: boolean
  summary?: string
  emailCount?: string
  role?: string
}
