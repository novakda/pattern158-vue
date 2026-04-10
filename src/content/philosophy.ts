export interface PhilosophyQuote {
  text: string
  cite: string
}

export const designThinking = {
  heading: 'This Is What Design Thinking Looks Like When It\u2019s a Personality, Not a Process',
  paragraphs: [
    'Design thinking was invented to teach people who don\u2019t naturally do certain things to do them systematically. Empathize before you solve. Define the real problem before you build. Iterate through failure without shame.',
    'I didn\u2019t learn this from a framework. I absorbed it from air crash investigators, speedrunners, and a Three Stooges short from 1938.',
    'The result is the same disposition \u2014 but without the scaffolding, because the scaffolding was never load-bearing for me. The fish doesn\u2019t have a water strategy.',
    'What I do have is a three-step pattern that has repeated across every significant project in 28 years:',
  ],
}

export const moralSpine = {
  heading: 'The Moral Spine',
  intro: 'The three-step pattern is how I work. This is why:',
  quote: {
    text: '\u201CYou want to cheat, cheat fair \u2014 anything I hate is a crookin\u2019 crook.\u201D',
    cite: '\u2014 Moe Howard, Healthy, Wealthy and Dumb, 1938',
  } satisfies PhilosophyQuote,
  paragraphs: [
    'Every tool I build is a cheat. Automating a manual process is cheating. Jumping to any course state in seconds instead of clicking through every section is cheating. Building a framework that eliminates a class of problem is cheating.',
    'But cheating fair means the output is proper, documented, and maintainable. It means you could hand it to another engineer and they could understand, extend, and improve it. Hoarding a clever solution \u2014 keeping the elegant shortcut to yourself \u2014 is the real dishonesty. The knowledge isn\u2019t yours. It came from everyone who documented the problem before you, and it belongs to everyone who\u2019ll encounter it after you.',
    'Clever shortcuts and corner-cutting look identical from the outside. The difference is in the craftsmanship.',
  ],
}

export const influencesHeading = {
  heading: 'Five Sources That Shaped the Method',
  intro: 'These aren\u2019t abstract inspirations. They\u2019re specific sources I can point to and say: this changed how I solve problems.',
}

export const brandElementsHeading = {
  heading: 'The Six Brand Elements',
  intro: 'Six patterns extracted from 28 years of actual work \u2014 not marketing slogans, but recurring themes from real projects.',
}

export interface ColleagueQuote {
  quote: string
  cite?: string
  context?: string
  variant?: 'secondary'
}

export const colleagueQuotes: ColleagueQuote[] = [
  {
    quote: 'Thank you so much for Dan for putting time into thinking this through and writing it up.',
    cite: 'Program Manager, Microsoft Account',
    context: 'GP Strategies \u2014 on a SCORM architecture analysis document',
  },
  {
    quote: 'Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise.',
    cite: 'Account Manager, GP Strategies',
    context: 'Entergy engagement \u2014 on cross-team collaboration',
    variant: 'secondary',
  },
]

export const colleagueQuotesHeading = 'What Colleagues Say'

export const closingLine = 'Pattern 158: I cheat, but I cheat fair.'
