export interface CultureFitItem {
  lead: string
  body: string
}

export const cultureFit = {
  heading: 'What Matters',
  items: [
    {
      lead: 'Remote-first, or remote-real.',
      body: 'Not \u201Cremote but everyone who gets promoted is in the office.\u201D I\u2019m in Portland, Oregon, and this is non-negotiable. Hybrid within the Portland/Vancouver WA metro is fine.',
    },
    {
      lead: 'Autonomy for senior engineers.',
      body: 'I managed myself across 24+ Fortune 500 client engagements over nearly three decades. I don\u2019t need a standup to know what to do next. I need context, access, and trust.',
    },
    {
      lead: 'Craftsmanship over velocity.',
      body: '\u201CQuality over speed\u201D isn\u2019t a platitude for me \u2014 it\u2019s how I\u2019ve worked my entire career. I build things that last. CSBB Dispatch ran 10+ years in production. The systems I leave behind don\u2019t need me to survive. I want a team that cares about getting it right, not just getting it shipped.',
    },
    {
      lead: 'Evidence over credentials.',
      body: 'I don\u2019t have a four-year degree. I don\u2019t have cloud certifications. What I have is 14 documented case studies, 28 years of production code, and a portfolio backed by 34,650 analyzed emails. I need a hiring process that can evaluate demonstrated work \u2014 not one that filters on checkboxes.',
    },
    {
      lead: 'No leetcode.',
      body: 'I evaluate companies the same way I evaluate systems: by their design. A hiring process built on algorithmic puzzles tells me the company optimizes for proximate signals over actual engineering ability. I\u2019m happy to do take-home projects, pair on real problems, or walk through my portfolio. I\u2019m not happy to invert a binary tree on a whiteboard.',
    },
    {
      lead: 'Rising tide.',
      body: 'I build tools that make the whole team better \u2014 the SCORM Debugger, the Xyleme automation suite, build pipeline tooling. I want teammates who think the same way. Collaborative, not competitive. \u201CWe shipped it\u201D over \u201CI shipped it.\u201D',
    },
  ] satisfies CultureFitItem[],
}
