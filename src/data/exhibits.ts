export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  impactTags: string[]
  exhibitLink: string
  isDetailExhibit?: boolean
}

export const exhibits: Exhibit[] = [
  {
    label: 'Exhibit A',
    client: 'General Dynamics Electric Boat',
    date: '2015\u20132022',
    title: 'Cross-Domain SCORM Resolution & Embedded Technical Advisory',
    impactTags: ['Client-Facing', 'SCORM', 'Cornerstone LMS', 'Cross-Domain', 'Tooling'],
    exhibitLink: '/exhibits/exhibit-a',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit B',
    client: 'GP Strategies Leadership',
    date: '2018\u20132019',
    title: 'Leadership Recognition Chain: A Repeatable Pattern',
    impactTags: ['Repeatable Pattern', 'Multi-Source Corroboration', 'General Dynamics'],
    exhibitLink: '/exhibits/exhibit-b',
  },
  {
    label: 'Exhibit C',
    client: 'GP Strategies \u2014 Content Team',
    date: 'December 2015',
    title: '1,216-Lesson Content Refresh: Automation Saves 600+ Hours',
    impactTags: ['600+ Hours Saved', 'Automation', 'Xyleme', 'Fiddler', '1,216 Lessons'],
    exhibitLink: '/exhibits/exhibit-c',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit D',
    client: 'Wells Fargo',
    date: 'August 2018',
    title: 'Sales Conversion Migration: 100+ Course Technical Lead',
    impactTags: ['Client-Facing', 'Wells Fargo', 'Migration Validation', 'IE Compatibility'],
    exhibitLink: '/exhibits/exhibit-d',
  },
  {
    label: 'Exhibit E',
    client: 'GP Strategies (Energy Utility Clients)',
    date: '2011\u20132016+',
    title: 'CSBB Dispatch: Cross-Domain Content Delivery \u2014 Built 5 Years Before Content Controller',
    impactTags: ['Cross-Domain Architecture', '~20 Clients Served', 'SCORM', 'GPiLEARN', 'Rustici Precursor'],
    exhibitLink: '/exhibits/exhibit-e',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit F',
    client: 'HSBC',
    date: '2015\u20132022',
    title: 'Cross-Platform SCORM Forensics & Legacy Recovery',
    impactTags: ['SCORM Forensics', 'Global Banking', 'Flash Recovery', 'SAP SuccessFactors'],
    exhibitLink: '/exhibits/exhibit-f',
  },
  {
    label: 'Exhibit G',
    client: 'SunTrust (now Truist)',
    date: '2015\u20132018',
    title: 'AWARE Platform: Custom SCORM-to-API Integration',
    impactTags: ['Client-Facing', 'SunTrust', 'Technical Writing', 'Forensic Analysis'],
    exhibitLink: '/exhibits/exhibit-g',
  },
  {
    label: 'Exhibit H',
    client: 'Internal \u2014 Cross-Functional',
    date: 'October 2019',
    title: 'Metal Additive Manufacturing Course: Rapid Diagnosis',
    impactTags: ['Rapid Resolution', 'LMS Troubleshooting', 'SCORM Completion'],
    exhibitLink: '/exhibits/exhibit-h',
  },
  {
    label: 'Exhibit I',
    client: 'TD Bank (via GP Strategies)',
    date: '2021\u20132024',
    title: 'Enterprise Accessibility Initiative: Methodology Creation',
    impactTags: ['Methodology Creation', 'TD Bank', 'WCAG 2.1', 'Accessibility'],
    exhibitLink: '/exhibits/exhibit-i',
  },
  {
    label: 'Exhibit J',
    client: 'General Motors',
    date: '~2017',
    title: 'GM Learning Portal: Course Completion Anomaly Investigation',
    impactTags: ['NTSB Methodology', 'Systems Thinking', 'Forensic Analysis', 'User Research', 'Swiss Cheese Model'],
    exhibitLink: '/exhibits/exhibit-j',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit K',
    client: 'Microsoft (MCAPS)',
    date: '2025\u20132026',
    title: 'Microsoft MCAPS: AI-Led Training Agent',
    impactTags: ['Zero to POC in ~4 Weeks', 'Copilot Studio', 'AI Architecture', 'Hybrid AI/Structured Data', '10-Year Relationship'],
    exhibitLink: '/exhibits/exhibit-k',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit L',
    client: 'Internal',
    date: '2025',
    title: 'Power Platform: Architecture Audit',
    impactTags: ['Forensic Diagnosis', 'Power Platform', 'AI-Assisted Analysis', 'Architecture Audit'],
    exhibitLink: '/exhibits/exhibit-l',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit M',
    client: 'GP Strategies (Internal Tooling)',
    date: '~2019\u20132020',
    title: 'SCORM Debugger: TASBot-Inspired QA Automation',
    impactTags: ['QA Automation', 'Hours to Minutes', 'Vue.js', 'SCORM Testing', 'TASBot Methodology'],
    exhibitLink: '/exhibits/exhibit-m',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit N',
    client: 'BP (via Leo Learning / GP Strategies)',
    date: '2024',
    title: 'BP Learning Platform: Federated System Integration',
    impactTags: ['Rustici Content Controller', 'React/GraphQL', 'Federated Integration', 'Pattern Recognition', 'Material UI'],
    exhibitLink: '/exhibits/exhibit-n',
    isDetailExhibit: true,
  },
]
