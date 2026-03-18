export interface ExhibitQuote {
  text: string
  attribution: string
  role?: string
}

export interface ExhibitResolutionRow {
  issue: string
  resolution: string
}

export interface Exhibit {
  label: string
  client: string
  date: string
  title: string
  quotes?: ExhibitQuote[]
  contextHeading?: string
  contextText?: string
  resolutionTable?: ExhibitResolutionRow[]
  impactTags: string[]
  exhibitLink: string
  isDetailExhibit?: boolean
  investigationReport?: boolean
}

export const exhibits: Exhibit[] = [
  {
    label: 'Exhibit A',
    client: 'General Dynamics Electric Boat',
    date: '2015\u20132022',
    title: 'Cross-Domain SCORM Resolution & Embedded Technical Advisory',
    quotes: [
      {
        text: 'I\u2019d consider the last couple days a success, and I look forward to working with Dan in the future.',
        attribution: 'Chief of Learning Services, Metrics, Processes & Technology, Electric Boat',
      },
      {
        text: 'Thank you Dan for working with us and listening to our ideas and problems!',
        attribution: 'Chief of Learning Services, Electric Boat',
        role: 'in summary email to EB leadership',
      },
    ],
    resolutionTable: [
      { issue: 'SCORM courses dependent on unreliable Cornerstone network player', resolution: 'Provided cross-domain SCORM wrapper eliminating player dependency' },
      { issue: 'HTML5 courses failing under AICC protocol', resolution: 'Converted AICC to SCORM HTML5 with improved performance' },
      { issue: 'Quiz bookmarking and reset failures', resolution: 'Implemented SCORM HTML5 course with proper reset and bookmarking' },
      { issue: 'No tools to verify SCORM data flow', resolution: 'Provided LMS simulation tool for troubleshooting and training' },
      { issue: 'Bulk SCORM import not possible', resolution: 'Tested and validated Cornerstone\u2019s new bulk publication tool' },
    ],
    impactTags: ['Client-Facing', 'SCORM', 'Cornerstone LMS', 'Cross-Domain', 'Tooling'],
    exhibitLink: '/exhibits/exhibit-a',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit B',
    client: 'GP Strategies Leadership',
    date: '2018\u20132019',
    title: 'Leadership Recognition Chain: A Repeatable Pattern',
    quotes: [
      {
        text: 'I hear you did an AWESOME job onsite! EB appreciated your support. Thank you for making the trip and doing all the great work!',
        attribution: 'Director of Learning Technologies, GP Strategies',
      },
      {
        text: 'Thanks for all the great work you did out there. I heard about your work from Chris Sproule, Tracey Nicholson, and Quinn Gladu.',
        attribution: 'Director of Learning Technologies, GP Strategies',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Two independent recognition cascades \u2014 August 2018 and April 2019 \u2014 propagated through GP Strategies\u2019 leadership hierarchy via unsolicited channels. Three named independent sources confirmed the second cascade.',
    impactTags: ['Repeatable Pattern', 'Multi-Source Corroboration', 'General Dynamics'],
    exhibitLink: '/exhibits/exhibit-b',
  },
  {
    label: 'Exhibit C',
    client: 'GP Strategies \u2014 Content Team',
    date: 'December 2015',
    title: '1,216-Lesson Content Refresh: Automation Saves 600+ Hours',
    contextHeading: 'Context',
    contextText: 'Part of a comprehensive team recognition email celebrating the completion of a 1,216-lesson content refresh. Each of 15 team members received a unique title and individual recognition. Dan\u2019s callout focused on tooling and automation that enabled the project to complete on schedule. The automation tool was also used by a colleague to publish every lesson at least three times during the refresh cycle. Full testimonial details available in the investigation report.',
    impactTags: ['600+ Hours Saved', 'Automation', 'Xyleme', 'Fiddler', '1,216 Lessons'],
    exhibitLink: '/exhibits/exhibit-c',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit D',
    client: 'Wells Fargo',
    date: 'August 2018',
    title: 'Sales Conversion Migration: 100+ Course Technical Lead',
    quotes: [
      {
        text: 'The client contact reached out to me today to convey her appreciation for the work that you two did to test the WF courses despite seeing issues related to IE. Thanks for your hard work on this. WF is a critical client and our ability to meet their volume of needs is important to the success of the relationship.',
        attribution: 'Director of Learning Technologies',
        role: '\u2014 relaying client feedback from Wells Fargo',
      },
    ],
    impactTags: ['Client-Facing', 'Wells Fargo', 'Migration Validation', 'IE Compatibility'],
    exhibitLink: '/exhibits/exhibit-d',
  },
  {
    label: 'Exhibit E',
    client: 'GP Strategies (Energy Utility Clients)',
    date: '2011\u20132016+',
    title: 'CSBB Dispatch: Cross-Domain Content Delivery \u2014 Built 5 Years Before Content Controller',
    contextHeading: 'Context',
    contextText: 'Architected a cross-domain content delivery system serving ~20 energy utility clients through a centralized SCORM dispatch layer \u2014 each drawing a curated subset from a ~2,000 course central library. Eliminated the manual zip-and-email deployment cycle. Built in 2011 \u2014 five years before Rustici released Content Controller to solve the same problem.',
    impactTags: ['Cross-Domain Architecture', '~20 Clients Served', 'SCORM', 'GPiLEARN', 'Rustici Precursor'],
    exhibitLink: '/exhibits/exhibit-e',
    isDetailExhibit: true,
  },
  {
    label: 'Exhibit F',
    client: 'HSBC',
    date: '2015\u20132022',
    title: 'Cross-Platform SCORM Forensics & Legacy Recovery',
    quotes: [
      {
        text: 'Thanks so much for your great work making the fixes. HSBC LMS team has approved the updated courseware!',
        attribution: 'Project Manager, GP Strategies (HSBC Account)',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Tier 1 global banking client across 5 countries. Found a SCORM API wrapper bug causing silent session termination, decompiled Flash SWFs to recover lost source files, and coordinated SCORM deployment fixes across Mexico, India, and the Philippines.',
    impactTags: ['SCORM Forensics', 'Global Banking', 'Flash Recovery', 'SAP SuccessFactors'],
    exhibitLink: '/exhibits/exhibit-f',
  },
  {
    label: 'Exhibit G',
    client: 'SunTrust (now Truist)',
    date: '2015\u20132018',
    title: 'AWARE Platform: Custom SCORM-to-API Integration',
    quotes: [
      {
        text: 'Thanks for the thorough documentation of the issue and solution.',
        attribution: 'SunTrust (Client)',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Team investigated and documented the learning platform situation, producing a detailed findings report with recommended path forward. Client requested follow-up meeting to discuss implementation options based on the quality of the technical analysis.',
    impactTags: ['Client-Facing', 'SunTrust', 'Technical Writing', 'Forensic Analysis'],
    exhibitLink: '/exhibits/exhibit-g',
  },
  {
    label: 'Exhibit H',
    client: 'Internal \u2014 Cross-Functional',
    date: 'October 2019',
    title: 'Metal Additive Manufacturing Course: Rapid Diagnosis',
    quotes: [
      {
        text: 'Kudos on finding this solution so promptly! \u2026 This email was a relief.',
        attribution: 'GP Strategies (combined from respondents)',
      },
    ],
    contextHeading: 'Context',
    contextText: 'SCORM completion tracking failure on a high-visibility additive manufacturing course. Root cause identified and fix deployed same day, prompting relief across stakeholders.',
    impactTags: ['Rapid Resolution', 'LMS Troubleshooting', 'SCORM Completion'],
    exhibitLink: '/exhibits/exhibit-h',
  },
  {
    label: 'Exhibit I',
    client: 'TD Bank (via GP Strategies)',
    date: '2021\u20132024',
    title: 'Enterprise Accessibility Initiative: Methodology Creation',
    quotes: [
      {
        text: 'Thank you for all your amazing work!',
        attribution: 'Senior Learning Project Manager, GP Strategies',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Most experienced accessibility evaluator on the TD Bank engagement (2021\u20132024). Contributed to GP\u2019s WCAG 2.1 AA evaluation methodology and brought forensic-level ARIA debugging, JAWS/NVDA interaction protocols, and Storyline-specific screen reader workarounds developed through prior HSBC and PNC Bank engagements.',
    impactTags: ['Methodology Creation', 'TD Bank', 'WCAG 2.1', 'Accessibility'],
    exhibitLink: '/exhibits/exhibit-i',
  },
  {
    label: 'Exhibit J',
    client: 'General Motors',
    date: '~2017',
    title: 'GM Learning Portal: Course Completion Anomaly Investigation',
    contextHeading: 'Investigation Summary',
    contextText: 'GM reported a 4x spike in incomplete courses after migrating to a new LMS. Initial assumption: tracking bug. Multi-angle forensic investigation \u2014 technical forensics, UX analysis, and user research \u2014 identified five concurrent systemic failures aligned in a \u201cSwiss cheese model.\u201d The root cause wasn\u2019t a single bug; it was a systemic mismatch between how the platform was designed and how people actually worked.',
    impactTags: ['NTSB Methodology', 'Systems Thinking', 'Forensic Analysis', 'User Research', 'Swiss Cheese Model'],
    exhibitLink: '/exhibits/exhibit-j',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit K',
    client: 'Microsoft (MCAPS)',
    date: '2025\u20132026',
    title: 'Microsoft MCAPS: AI-Led Training Agent',
    contextHeading: 'Investigation Summary',
    contextText: 'Building on a decade of GP Strategies\u2019 embedded work on Microsoft accounts, Dan was brought in to evolve their AI training agent in Copilot Studio. Zero platform experience to functional POC in ~4 weeks. The breakthrough: separating deterministic state (structured JSON) from AI interaction (content delivery), creating a hybrid architecture that solved the reliability challenges of the original declarative approach.',
    impactTags: ['Zero to POC in ~4 Weeks', 'Copilot Studio', 'AI Architecture', 'Hybrid AI/Structured Data', '10-Year Relationship'],
    exhibitLink: '/exhibits/exhibit-k',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit L',
    client: 'Internal',
    date: '2025',
    title: 'Power Platform: Architecture Audit',
    contextHeading: 'Investigation Summary',
    contextText: 'Internal ERP modernization on Power Platform where institutional knowledge was lost through organizational transitions. AI-assisted forensic analysis exposed five foundational gaps: no data model, no version control, monolithic architecture, atomized requirements without context, and no decomposed user stories. The diagnosis was the deliverable.',
    impactTags: ['Forensic Diagnosis', 'Power Platform', 'AI-Assisted Analysis', 'Architecture Audit'],
    exhibitLink: '/exhibits/exhibit-l',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit M',
    client: 'GP Strategies (Internal Tooling)',
    date: '~2019\u20132020',
    title: 'SCORM Debugger: TASBot-Inspired QA Automation',
    contextHeading: 'Investigation Summary',
    contextText: 'Created a Vue.js SCORM debugging tool inspired by TASBot/speedrunning save states. Reduced QA testing cycles from hours to minutes by enabling instant state capture and restore across gated eLearning courses. The approach that Rustici Engine\u2019s testing tools would later address commercially.',
    impactTags: ['QA Automation', 'Hours to Minutes', 'Vue.js', 'SCORM Testing', 'TASBot Methodology'],
    exhibitLink: '/exhibits/exhibit-m',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit N',
    client: 'BP (via Leo Learning / GP Strategies)',
    date: '2024',
    title: 'BP Learning Platform: Federated System Integration',
    contextHeading: 'Investigation Summary',
    contextText: 'Worked on BP\u2019s React/GraphQL learning platform integrating Rustici Content Controller, PeopleFluent LMS, Watershed LRS, and Amazon Cognito. Recognized the federated integration pattern from CSBB Dispatch \u2014 a decade of pattern evolution from custom-built to commercial ecosystem.',
    impactTags: ['Rustici Content Controller', 'React/GraphQL', 'Federated Integration', 'Pattern Recognition', 'Material UI'],
    exhibitLink: '/exhibits/exhibit-n',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit O',
    client: 'GP Strategies (Internal Product)',
    date: '2024\u20132025',
    title: 'ContentAIQ \u2014 The Integration Thread: Pattern Recognition Across Three Projects',
    contextHeading: 'Context',
    contextText: 'Integration expertise forms the connective thread across three GP Strategies projects spanning federated LMS facades, webhook sync pipelines, and AI product interfaces. The progression demonstrates pattern recognition across thirteen years, from CSBB Dispatch (2011) through modern multitenant SaaS architecture. All three projects required coordinating across system boundaries and debugging failures spanning multiple platforms.',
    impactTags: ['AI Product Frontend', 'Multitenant Architecture', 'Design Translation', 'Integration Patterns', 'Pattern Recognition', 'Cross-System Coordination', 'Federated Systems'],
    exhibitLink: '/exhibits/exhibit-o',
    isDetailExhibit: true,
    investigationReport: false,
  },
]
