export interface FaqCategory {
  id: 'hiring' | 'expertise' | 'style' | 'process'
  heading: string
  intro: string
}

export type FaqCategoryId = FaqCategory['id']

export interface FaqItem {
  question: string
  answer: string
  category: FaqCategoryId
}
