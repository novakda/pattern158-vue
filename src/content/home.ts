export interface HomeSectionHeading {
  id: string
  title: string
  subtitle?: string
}

export interface HomeTeaserQuote {
  quote: string
  cite?: string
  context?: string
}

export const intro = {
  heading: 'I Reverse-Engineer Chaos Into Clarity',
  body: 'After 28 years building and rescuing enterprise systems, I\u2019ve learned that the best solutions aren\u2019t always the obvious ones\u2014they\u2019re the elegant shortcuts that work properly.',
}

export const featuredProjectsHeading: HomeSectionHeading = {
  id: 'work',
  title: 'Featured Projects',
}

export const fieldReportsHeading: HomeSectionHeading = {
  id: 'field-reports',
  title: 'From the Field',
  subtitle: 'Direct feedback from engagements spanning 17 years',
}

export const teaserQuotes: HomeTeaserQuote[] = [
  {
    quote: 'Dan\u2019s technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues we were having, one that will have a direct impact on the Flash conversion process and save a lot of time and money.',
  },
  {
    quote: 'This resulted in a savings of about 600 hours of labor by allowing us to publish large batches of lessons unattended.',
    cite: 'Manager, Content Team',
    context: 'On publishing automation built during 1,216-lesson refresh',
  },
]
