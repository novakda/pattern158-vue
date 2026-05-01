import type { Tag } from './tag'
import type { ExpertiseLevel } from './expertiseLevel'

export interface TechCardData {
  name: string
  level: ExpertiseLevel
  summary: string
  dateRange?: string
  tags?: Tag[]
}

export interface TechCategory {
  id: string
  title: string
  intro?: string
  historical?: boolean
  cards: TechCardData[]
}
