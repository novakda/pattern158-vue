export interface ColleagueQuote {
  quote: string
  cite?: string
  context?: string
  variant?: 'secondary'
}

export const hero = {
  title: 'Frequently Asked Questions',
  subtitle: 'Common questions about working with Dan Novak',
}

export const colleagueQuotesHeading = 'What Colleagues Say'

export const colleagueQuotes: ColleagueQuote[] = [
  {
    quote: 'It\u2019s always so nice working with you and having you send these notes so that the developer can get going is helpful and appreciated.',
  },
  {
    quote: 'Thank you so much for your efforts in preparing this proposal. It looks fantastic.',
    cite: 'Director, Accessibility Practice',
    context: 'GP Strategies \u2014 on an accessibility initiative proposal',
    variant: 'secondary',
  },
]
