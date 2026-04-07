import type { Influence, InfluenceLink, InfluenceSegment } from '@/types'
import influencesData from './json/influences.json'

export type { Influence, InfluenceLink, InfluenceSegment }
export const influences: Influence[] = influencesData as Influence[]
