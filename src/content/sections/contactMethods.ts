export interface ContactLink {
  label: string
  href: string
  display: string
  external: boolean
  copyable?: boolean
}

export const contactMethods = {
  heading: 'Let\u2019s Talk',
  intro: 'If this sounds like your team, I\u2019d like to hear from you.',
  links: [
    {
      label: 'Email',
      href: 'mailto:dan@pattern158.solutions',
      display: 'dan@pattern158.solutions',
      external: false,
      copyable: true,
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/pattern158',
      display: 'linkedin.com/in/pattern158',
      external: true,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/novakda',
      display: 'github.com/novakda',
      external: true,
    },
    {
      label: 'Case Files',
      href: '/case-files',
      display: 'pattern158.solutions/case-files',
      external: false,
    },
  ] satisfies ContactLink[],
  guidance:
    'When reaching out, the most useful thing you can include is: what does the role actually look like day-to-day? Job descriptions are marketing. I want to know what I\u2019d be building, who I\u2019d be building it with, and what problem the team is trying to solve.',
}
