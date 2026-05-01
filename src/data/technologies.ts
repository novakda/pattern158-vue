import data from './json/technologies.json'
import type { TechCategory, TechCardData } from '@/types'

export const technologies: TechCategory[] = data as TechCategory[]
export type { TechCategory, TechCardData }
