import type { Exhibit, ExhibitQuote, ExhibitResolutionRow, ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection, ExhibitType, PersonnelEntry, TechnologyEntry } from '@/types'
import exhibitsData from './json/exhibits.json'

export type { Exhibit, ExhibitQuote, ExhibitResolutionRow, ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection, ExhibitType, PersonnelEntry, TechnologyEntry }
export const exhibits: Exhibit[] = exhibitsData as Exhibit[]
