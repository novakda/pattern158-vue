export interface FaqCategory {
  id: string
  heading: string
  intro: string
}

export type FaqCategoryId = string

export interface FaqItem {
  id: string
  question: string
  answer: string
  categories: string[]
  exhibitNote?: string
}
