import type { FaqItem, FaqCategory } from '@/types'
import faqItemsData from './json/faq.json'

export type { FaqItem, FaqCategory }

export const faqCategories = [
  { id: 'hiring' as const, heading: 'Hiring Logistics', intro: 'Availability, rates, and work arrangements' },
  { id: 'expertise' as const, heading: 'Technical Expertise', intro: 'Technologies, specializations, and domain knowledge' },
  { id: 'style' as const, heading: 'Working Style', intro: 'Communication, collaboration, and approach' },
  { id: 'process' as const, heading: 'Process & Methodology', intro: 'How Dan works in practice' },
] as const satisfies readonly FaqCategory[]

export const faqItems: FaqItem[] = faqItemsData as FaqItem[]
