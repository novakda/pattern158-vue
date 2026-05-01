export interface LookingForItem {
  name: string
  description: string
}

export const roleFit = {
  heading: 'Where I Do My Best Work',
  intro:
    'I\u2019m a senior individual contributor who builds things. Not a manager, not a consultant billing by the hour, not a contractor who disappears after the sprint.',
  lookingForHeading: 'I\u2019m looking for:',
  lookingFor: [
    {
      name: 'Senior or Staff Full-Stack Engineer',
      description:
        'my primary lane. JavaScript is a 28-year daily driver. Vue.js, React, TypeScript, Node.js, SQL in production. I build the frontend, wire up the backend, and debug the space between them.',
    },
    {
      name: 'Solutions Architect',
      description:
        'my signature pattern. I design systems that make incompatible platforms talk to each other. CSBB Dispatch ran for 10+ years across Fortune 500 energy clients. BP\u2019s federated frontend stitched React and GraphQL across four backend systems that were never designed to coexist.',
    },
    {
      name: 'Senior Frontend Engineer at enterprise scale',
      description:
        'Material UI theming, Tailwind CSS, WCAG 2.1 / Section 508 accessibility with JAWS and NVDA. I\u2019ve built production interfaces for HSBC, PNC Bank, and TD Bank.',
    },
  ] satisfies LookingForItem[],
  notLookingForHeading: 'I\u2019m not looking for:',
  notLookingFor: [
    'Management or non-coding roles',
    'eLearning / Instructional Design (that chapter is closed)',
    '.NET-primary, WordPress, or mobile-only stacks',
    'QA-only or DevOps-only roles',
    'Anything where \u201Csenior\u201D means \u201Cwrites tickets for juniors\u201D',
  ],
}
