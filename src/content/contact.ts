export interface ColleagueQuote {
  quote: string
  cite?: string
  context?: string
  variant?: 'secondary'
}

export const hero = {
  title: 'Work With Me',
  subtitle: 'What I\u2019m looking for \u2014 and what I\u2019m not.',
}

export const colleagueQuotes: ColleagueQuote[] = [
  {
    quote:
      'Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise.',
    cite: 'Account Manager, GP Strategies',
  },
  {
    quote:
      'You have helped us move the bar to better, more accessible courses and helped me learn a ton.',
    cite: 'Program Manager, Microsoft Account',
    context: 'GP Strategies \u2014 Microsoft accessibility initiative',
    variant: 'secondary',
  },
]
