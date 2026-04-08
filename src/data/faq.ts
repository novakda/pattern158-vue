import type { FaqItem, FaqCategory } from '@/types'
import faqItemsData from './json/faq.json'

export type { FaqItem, FaqCategory }

export const faqCategories = [
  { id: 'hiring' as const, heading: 'Hiring Logistics', intro: 'Availability, rates, and work arrangements' },
  { id: 'expertise' as const, heading: 'Technical Expertise', intro: 'Technologies, specializations, and domain knowledge' },
  { id: 'approach' as const, heading: 'Approach & Methodology', intro: 'How problems get diagnosed, solved, and documented' },
  { id: 'architecture' as const, heading: 'Architecture & Systems', intro: 'System design, integration patterns, and technical strategy' },
  { id: 'legacy' as const, heading: 'Legacy Modernization', intro: 'Rescuing, reverse-engineering, and upgrading aging systems' },
  { id: 'collaboration' as const, heading: 'Collaboration & Communication', intro: 'Working style, distributed teams, and stakeholder engagement' },
  { id: 'ai-tooling' as const, heading: 'AI & Tooling', intro: 'AI-assisted development, automation, and developer tooling' },
] as const satisfies readonly FaqCategory[]

export const faqItems: FaqItem[] = faqItemsData as FaqItem[]
