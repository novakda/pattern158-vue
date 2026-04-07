import type { Exhibit, ExhibitQuote, ExhibitResolutionRow, ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection, ExhibitType } from '@/types'
import exhibitsData from './json/exhibits.json'

export type { Exhibit, ExhibitQuote, ExhibitResolutionRow, ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection, ExhibitType }
export const exhibits: Exhibit[] = exhibitsData as Exhibit[]
