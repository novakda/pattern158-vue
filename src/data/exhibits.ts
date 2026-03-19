export interface ExhibitQuote {
  text: string
  attribution: string
  role?: string
}

export interface ExhibitResolutionRow {
  issue: string
  resolution: string
}

export interface ExhibitSection {
  heading?: string
  type: 'text' | 'table'
  body?: string
  columns?: string[]
  rows?: string[][]
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
  sections?: ExhibitSection[]
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
      {
        text: 'Thanks for all of the great work you did out there. I heard about your work from several folks across the organization.',
        attribution: 'Director of Learning Technologies, GP Strategies',
        role: 'recognition relayed independently through three separate contacts',
      },
      {
        text: 'Dan\u2019s technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues we were having, one that will have a direct impact on the Flash conversion process and save a lot of time and money.',
        attribution: 'Chief of Learning Services, Electric Boat',
        role: 'in recognition email to GP leadership',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Seven-year embedded technical advisory relationship with General Dynamics Electric Boat (2017\u20132022), spanning formal investigation, two on-site deployments (August 2018, March\u2013April 2019), and ongoing platform support. Engagement scope: 574 emails across 49 EB personnel.',
    resolutionTable: [
      { issue: 'SCORM courses dependent on unreliable Cornerstone network player', resolution: 'Provided cross-domain SCORM wrapper eliminating player dependency' },
      { issue: 'HTML5 courses failing under AICC protocol', resolution: 'Converted AICC to SCORM HTML5 with improved performance' },
      { issue: 'Quiz bookmarking and reset failures', resolution: 'Implemented SCORM HTML5 course with proper reset and bookmarking' },
      { issue: 'No tools to verify SCORM data flow', resolution: 'Provided LMS simulation tool for troubleshooting and training' },
      { issue: 'Bulk SCORM import not possible', resolution: 'Tested and validated Cornerstone\u2019s new bulk publication tool' },
    ],
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'Seven-year embedded technical advisory relationship with General Dynamics Electric Boat (2017–2022), spanning formal investigation, two on-site deployments (August 2018, March–April 2019), and ongoing platform support. Engagement scope: 574 emails across 49 EB personnel.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist', 'GP Strategies'],
          ['Tracey Nicholson', 'Chief of Learning Services, Metrics, Processes & Technology', 'Electric Boat'],
          ['Quinn Gladu', 'Chief of Learning Services', 'Electric Boat'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['Josh Stoudt', 'Senior Director', 'GP Strategies'],
          ['Chris Emmons', 'LMS Administrator', 'Electric Boat'],
          ['Multiple EB Personnel', '49 contacts across departments', 'Electric Boat'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: 'Cornerstone OnDemand enforces same-origin policy on its internal SCORM player, preventing cross-domain API calls from hosted content. The existing PHP relay script had become unreliable due to server configuration drift. No mechanism existed to verify SCORM data flow without a full LMS test cycle.',
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Issue', 'Resolution'],
        rows: [
          ['SCORM courses dependent on unreliable Cornerstone network player', 'Provided cross-domain SCORM wrapper eliminating player dependency'],
          ['HTML5 courses failing under AICC protocol', 'Converted AICC to SCORM HTML5 with improved performance'],
          ['Quiz bookmarking and reset failures', 'Implemented SCORM HTML5 course with proper reset and bookmarking'],
          ['No tools to verify SCORM data flow', 'Provided LMS simulation tool for troubleshooting and training'],
          ['Bulk SCORM import not possible', "Tested and validated Cornerstone's new bulk publication tool"],
        ],
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Cross-domain SCORM wrappers deployed across affected courses. LMS simulation tool provided for ongoing diagnostics. Bulk import path validated. Recognition propagated independently through three EB contacts and relayed through GP leadership hierarchy.',
      },
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "Two independent recognition cascades — August 2018 and April 2019 — propagated through GP Strategies' leadership hierarchy via unsolicited channels. Three named independent sources confirmed the second cascade.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist', 'GP Strategies'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['Josh Stoudt', 'Senior Director', 'GP Strategies'],
          ['Tracey Nicholson', 'Chief of Learning Services', 'Electric Boat'],
          ['Quinn Gladu', 'Chief of Learning Services', 'Electric Boat'],
        ],
      },
      {
        type: 'text',
        heading: 'First Recognition Cascade — August 2018',
        body: "Following the August 2018 on-site deployment at Electric Boat, unsolicited recognition from EB leadership propagated up through GP Strategies' chain of command. The Director of Learning Technologies reached out independently after hearing from Electric Boat contacts.",
      },
      {
        type: 'text',
        heading: 'Second Recognition Cascade — April 2019',
        body: 'Following the March–April 2019 on-site engagement, a second independent cascade occurred. Three named sources — Chris Sproule, Tracey Nicholson, and Quinn Gladu — independently relayed recognition to GP leadership. The Director confirmed all three by name in a single message.',
      },
      {
        type: 'text',
        heading: 'Pattern Analysis',
        body: 'Both cascades share the same characteristics: unsolicited, cross-level, multi-source, and specific to technical contribution. The repeatability across two separate engagements and the independent corroboration distinguish this from routine positive feedback.',
      },
    ],
    impactTags: ['Repeatable Pattern', 'Multi-Source Corroboration', 'General Dynamics'],
    exhibitLink: '/exhibits/exhibit-b',
  },
  {
    label: 'Exhibit C',
    client: 'GP Strategies \u2014 Content Team',
    date: 'December 2015',
    title: '1,216-Lesson Content Refresh: Automation Saves 600+ Hours',
    quotes: [
      {
        text: 'Dan Novak \u201cThe Fiddler\u201d (Automation) \u2014 Dan gets this name not only because he makes extensive use of the Fiddler application to help us troubleshoot communications errors for customers, but because he fiddles with stuff until we get a tool that makes things\u2026 possible. He also used Fiddler to figure out how to automate the publishing process out of Xyleme. This resulted in a savings of about 600 hours of labor by allowing us to publish large batches of lessons unattended.',
        attribution: 'Manager, Content Team, GP Strategies',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Part of a comprehensive team recognition email celebrating the completion of a 1,216-lesson content refresh. Each of 15 team members received a unique title and individual recognition. Dan\u2019s callout focused on tooling and automation that enabled the project to complete on schedule. The automation tool was also used by a colleague to publish every lesson at least three times during the refresh cycle. Full testimonial details available in the investigation report.',
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "In 2015, GP Strategies undertook a 1,216-lesson content refresh for an energy utility client library. Publishing each lesson through Xyleme's web interface was a manual, attended process — a bottleneck that threatened the project timeline.",
      },
      {
        type: 'text',
        heading: 'Solution',
        body: "Using Fiddler to intercept and analyze Xyleme's HTTP traffic, Dan reverse-engineered the unpublished publishing API. The result was a batch automation tool that could publish large volumes of lessons unattended — saving an estimated 600+ hours of labor and enabling the project to complete on schedule.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist ("The Fiddler")', 'GP Strategies'],
          ['Content Team Manager', 'Manager, Content Team', 'GP Strategies'],
          ['15+ Team Members', 'Content refresh contributors', 'GP Strategies'],
        ],
      },
      {
        type: 'table',
        heading: 'Impact Metrics',
        columns: ['Metric', 'Value'],
        rows: [
          ['Labor hours saved via automation', '600+'],
          ['Lessons in content refresh', '1,216'],
          ['Additional development hours (custom code)', '75+'],
          ['Team members individually recognized', '15+'],
        ],
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "The automation tool was adopted by at least one colleague and used to publish every lesson multiple times during the refresh cycle. Dan's contribution was singled out by name in an all-hands recognition email, receiving the title \"The Fiddler\" — the only team member recognized specifically for tooling and automation.",
      },
    ],
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
        text: 'The client contact reached out to me today to convey her appreciation for the work that you two did in order to test the WF courses in spite of the fact that you were seeing issues related to IE. Thanks for your hard work on this. WF is a critical client and our ability to meet their volume of needs is important to the success of the relationship.',
        attribution: 'Director of Learning Technologies, GP Strategies',
        role: 'relaying direct client feedback from Wells Fargo',
      },
      {
        text: 'I can\u2019t thank you enough. I know you\u2019re working with little heads up right now.',
        attribution: 'Project Lead, GP Strategies',
        role: 'coordinating rapid-turnaround testing requests',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Technical lead for functional QA on a 100+ course sales conversion migration from legacy formats (Adobe Presenter, HTML5, Flash) into Xyleme LCMS, published as SCORM 1.2 for Wells Fargo\u2019s enterprise LMS. Six-month engagement, 223 tracked emails. Developed an interactivity-level multiplier methodology for estimating QA effort across the full course portfolio. Diagnosed SCORM completion failures in Flash-based content caused by a race condition in IE\u2019s COM SCORM adapter, compounded by Xyleme\u2019s thin package architecture. Wells Fargo granted full Xyleme Studio administrative access \u2014 a direct indicator of client trust.',
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "Six-month engagement (2018) as technical lead for functional QA on a 100+ course sales conversion migration from legacy formats (Adobe Presenter, HTML5, Flash) into Xyleme LCMS, published as SCORM 1.2 for Wells Fargo's enterprise LMS. 223 tracked emails across the engagement.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Technical Lead / Senior Learning Technologist', 'GP Strategies'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['QA Lead', 'QA Coordinator', 'GP Strategies'],
          ['Program Manager', 'Project Manager', 'GP Strategies'],
          ['Wells Fargo Contact', 'Learning Technologies Team', 'Wells Fargo'],
        ],
      },
      {
        type: 'text',
        heading: 'Technical Contributions',
        body: "Developed an interactivity-level multiplier methodology for estimating QA effort across the full course portfolio. Diagnosed SCORM completion failures in Flash-based content caused by a race condition in IE's COM SCORM adapter, compounded by Xyleme's thin package architecture. Wells Fargo granted full Xyleme Studio administrative access — a direct indicator of client trust extended to a contractor.",
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "Flash's ActionScript SCORM bridge relied on IE's COM-based SCORM adapter. Under certain timing conditions, the adapter completed initialization after the course had already attempted its first SCORM API call — producing silent failures with no error output. Xyleme's thin package approach (minimal wrapper HTML, course assets served separately) compounded the issue by reducing the time available for adapter initialization.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'SCORM failures diagnosed and resolved across the Flash course portfolio. QA methodology adopted for effort estimation. Wells Fargo client contact independently relayed appreciation to GP Strategies leadership, triggering a recognition relay through the director level.',
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'By 2011, GP Strategies was managing a ~2,000 course central library distributed to ~20 energy utility clients — each requiring a different curated subset. Distribution was handled manually: zip files sent by email, re-uploaded by each client. Version control was nonexistent. A content update required re-sending to every affected client.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Architect / Developer', 'GP Strategies'],
          ['Zach Taylor', 'Project Lead', 'GP Strategies'],
          ['Ron Cyran', 'Account Manager', 'GP Strategies'],
          ['Tom Pizer', 'Director', 'GP Strategies'],
        ],
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Description'],
        rows: [
          ['Cross-domain architecture', 'EasyXDM-based postMessage relay enabled SCORM API calls across domain boundaries — solving the fundamental technical constraint'],
          ['Protocol-agnostic proxy', 'Single dispatch layer supported both SCORM 1.2 and AICC without client-side modification'],
          ['Deployment revolution', 'Stub packages replaced full content distribution — clients received a small launcher; content lived centrally'],
          ['Automation at scale', '~2,000 course library managed through centralized version control; updates propagated instantly to all clients'],
          ['Cross-industry reuse', 'Architecture originally built for energy utility clients was adapted for General Dynamics Electric Boat (defense sector)'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: 'No commercial solution existed in 2011 for centralized SCORM content dispatch across organizational boundaries. The problem was real, the scale was significant, and the only path was to build it. Rustici Software released Content Controller — a commercial product solving the identical problem — in 2016, five years later.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "CSBB Dispatch ran in production for 10+ years serving ~20 energy utility clients. The architecture was later adapted for General Dynamics Electric Boat. The pattern — a centralized dispatch layer with stub packages — is now recognized as the industry standard approach, validated by Rustici's Content Controller.",
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "Nearly decade-long engagement (2015–2024) with GP Strategies' HSBC account across 5 countries. 560+ documented emails, 25 contacts. Scope included SCORM protocol debugging, Flash legacy content recovery, and global localization support across Mexico, India, and the Philippines.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist', 'GP Strategies'],
          ['HSBC Account Project Manager', 'Project Manager', 'GP Strategies (HSBC Account)'],
          ['22+ US Contacts', 'Various stakeholders', 'GP Strategies / HSBC'],
          ['International Teams', 'Localization and LMS contacts', 'HSBC (Mexico, India, Philippines)'],
        ],
      },
      {
        type: 'text',
        heading: 'Technical Contributions',
        body: 'Identified a SCORM API wrapper bug causing silent session termination — the cmi.core.exit value was being set incorrectly, causing the LMS to mark sessions as incomplete regardless of course completion state. Decompiled Flash SWFs using JPEXS to recover lost source files when original assets were unavailable. Coordinated SCORM deployment fixes across three international regions.',
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The SCORM API wrapper used across HSBC courseware contained a hardcoded exit value that conflicted with SuccessFactors' completion detection logic. Because the failure was silent — no console errors, no visible indication — it had persisted undetected across multiple LMS migrations. Flash content recovery was necessitated by vendor project handoffs that did not include source files.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'SCORM completion tracking restored across affected courses. HSBC LMS team approved updated courseware. Flash source recovered and preserved for future maintenance. International localization issues resolved. Engagement spanned nearly a decade across five countries.',
      },
    ],
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
        text: 'Thanks for the thorough documentation of the issue and solution. Do you have a figure?',
        attribution: 'SunTrust (Client)',
      },
    ],
    contextHeading: 'Context',
    contextText: 'Team investigated and documented the learning platform situation, producing a detailed findings report with recommended path forward. Client requested follow-up meeting to discuss implementation options based on the quality of the technical analysis.',
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "SunTrust's AWARE platform was an external learner portal with no traditional LMS — instead, it exposed a proprietary web service API for completion tracking. GP Strategies needed to deliver SCORM-packaged courseware that could communicate with this API instead of a standard SCORM runtime.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Lead Technical Engineer', 'GP Strategies'],
          ['SunTrust Developer', 'Platform Developer', 'SunTrust (now Truist)'],
          ['GP Strategies Team', 'Project team', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'Integration Challenge',
        body: "Standard SCORM packages communicate with an LMS via the SCORM JavaScript API. AWARE had no SCORM runtime — only a REST-based web service. The solution required intercepting SCORM API calls at the wrapper level and translating them to AWARE API calls in real time, while maintaining cross-session persistence without server-side access.",
      },
      {
        type: 'text',
        heading: 'Security and Trust',
        body: 'SunTrust issued employee credentials and provided a dedicated laptop — extraordinary measures for an external contractor. The integration required access to backend systems that SunTrust typically restricted to internal staff. This level of access reflects the trust established through the technical engagement.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Technical findings documented in a detailed report with recommended implementation path. Client\'s immediate response — "Do you have a figure?" — indicated readiness to proceed based on the quality of the analysis alone. The 66-hour integration lifecycle spanned five development phases from requirements through production validation.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'A high-visibility additive manufacturing course was failing to record learner completion in the LMS. Learners were completing the course but not receiving credit. The course had already passed QA and been deployed — the failure surfaced only in production.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist', 'GP Strategies'],
          ['LMS Configuration Specialist', 'LMS Administrator', 'GP Strategies'],
          ['Client Liaison', 'Project Manager', 'GP Strategies / Client'],
        ],
      },
      {
        type: 'text',
        heading: 'Root Cause Analysis',
        body: 'The completion failure was traced to an LMS configuration issue rather than a courseware defect — the course was publishing SCORM completion data correctly, but the LMS was not configured to receive it in the expected format. Diagnosis and fix were completed same day.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Root cause identified and fix deployed within the same business day. Three independent stakeholders responded with relief — "Kudos on finding this solution so promptly!", "This email was a huge relief", and "Thank you all so very much for your time and diligence!" The rapid resolution preserved learner records and prevented a client escalation.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'Enterprise accessibility evaluation engagement with TD Bank via GP Strategies (2021–2024), focused on WCAG 2.1 AA and Section 508 compliance for interactive eLearning courseware. 479 accessibility-related emails out of 4,173 total in a single year — 11.5% of annual correspondence dedicated to accessibility work.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Accessibility Evaluator', 'GP Strategies'],
          ['2 Additional Testers', 'Accessibility Evaluators', 'GP Strategies'],
          ['Senior Learning PM', 'Senior Learning Project Manager', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'The Standards Gap',
        body: 'WCAG 2.1 defines compliance criteria but provides no protocols for testing interactive eLearning — gated branching scenarios, Storyline-specific ARIA behaviors, and screen reader interaction patterns not covered by standard web accessibility guidelines. This gap required developing a methodology from first principles.',
      },
      {
        type: 'text',
        heading: 'Methodology',
        body: "Dan brought forensic-level ARIA debugging, JAWS/NVDA interaction protocols, and Storyline-specific screen reader workarounds developed through prior HSBC and PNC Bank engagements. These were layered onto GP Strategies' existing WCAG evaluation framework, creating a methodology capable of handling the full complexity of interactive courseware accessibility.",
      },
      {
        type: 'table',
        heading: 'Accessibility Testing Scope (TD MIC)',
        columns: ['Test Type', 'Description'],
        rows: [
          ['WCAG 2.1 AA compliance', 'Full criterion-by-criterion evaluation against Level A and AA success criteria'],
          ['Section 508 conformance', 'Federal accessibility standard conformance testing for government-adjacent financial clients'],
          ['Screen reader testing', 'JAWS and NVDA interaction documentation with pass/fail per interaction pattern'],
          ['Keyboard navigation', 'Full keyboard-only navigation paths mapped and validated for all interactive elements'],
        ],
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "Contributed to GP Strategies' WCAG 2.1 AA evaluation methodology as the most experienced accessibility evaluator on the TD Bank engagement. Recognition from Senior Learning PM: \"Thank you for all your amazing work!\" (August 2022). Methodology subsequently applied across additional banking clients.",
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'General Motors reported a 4x spike in incomplete courses after migrating to a new LMS — 19% incomplete against a historical 5% baseline across a 10,000+ course library. Initial assumption was a SCORM tracking bug. Multi-angle forensic investigation identified five concurrent systemic failures.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Role'],
        rows: [
          ['Investigation Lead', 'Director, GP Strategies', 'Investigation leadership and stakeholder communication'],
          ['Dan Novak', 'Senior Learning Technologist', 'Technical forensics, SCORM analysis, DevTools investigation'],
          ['Data Analyst / UX Researcher', 'GP Strategies', 'User research, data analysis, UX pattern identification'],
        ],
      },
      {
        type: 'table',
        heading: 'Findings — Five Concurrent Systemic Failures',
        columns: ['Finding', 'Description'],
        rows: [
          ['Memory cache vulnerability', "Browser cache clearing wiped in-progress SCORM sessions — learners who paused mid-course lost all progress on resume"],
          ['Misleading completion UI', 'A "Congratulations, You\'ve Failed" screen appeared on first incomplete attempt, causing many learners to abandon courses believing they had already failed'],
          ["Confusing vendor navigation", "Third-party vendor navigation patterns conflicted with GM's LMS interface — learners couldn't reliably locate or re-enter in-progress courses"],
          ['Mobile and poor WiFi unsupported', 'Course architecture assumed desktop/broadband; mobile and low-bandwidth learners experienced systematic failures with no fallback'],
          ['Usage pattern mismatch', 'Courses were designed for one-hour sessions; actual learner behavior was 5-minute bursts — the completion model didn\'t accommodate real usage patterns'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: 'No single bug caused the completion rate collapse. Five independent systemic failures aligned simultaneously — each exploiting a gap in the others. The NTSB-style "Swiss cheese model" applied: each layer had holes, and they happened to align. The root cause was a systemic mismatch between how the platform was designed and how people actually worked.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'GM subsequently migrated to SAP SuccessFactors — a platform decision that validated the root cause assessment. The PeopleSoft LMS environment was identified as a contributing factor in several of the systemic failures. The investigation methodology — technical forensics combined with UX analysis and user research — became a reference model for platform migration diagnostics.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "Building on a decade of GP Strategies' embedded work on Microsoft accounts, Dan was brought in to evolve an AI-led training agent in Copilot Studio. Starting with zero Copilot Studio experience, he reached a functional proof-of-concept in approximately four weeks. The core problem: pure prompt engineering couldn't enforce deterministic state — the AI would hallucinate progress, skip steps, or contradict itself across sessions.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Max Glick', 'Lead Developer / Engineering Manager', 'GP Strategies'],
          ['Dan Novak', 'AI Agent Developer', 'GP Strategies'],
          ['Instructional Designer', 'Content Design', 'GP Strategies'],
          ['Project Manager', 'Program Coordination', 'GP Strategies'],
          ['MCAPS Lead', 'Microsoft Account Lead', 'Microsoft'],
        ],
      },
      {
        type: 'text',
        heading: 'The Prompt Engineering Ceiling',
        body: 'Probabilistic LLMs cannot reliably track discrete state — course progress, scores, completion status — across a conversation. The original declarative approach tried to encode all state and logic in the system prompt. This worked in simple demos but broke down under real usage: the AI would lose track of where learners were, contradict earlier responses, or produce different results for identical inputs.',
      },
      {
        type: 'table',
        heading: 'Hybrid Architecture Implementation',
        columns: ['Component', 'Approach'],
        rows: [
          ['Course catalog', 'Structured JSON — deterministic, version-controlled, not subject to AI interpretation'],
          ['Progress tracking', 'State object maintained outside the LLM — AI reads and writes structured data, never infers it'],
          ['Navigation', 'Adaptive Cards — deterministic UI components that enforce interaction boundaries'],
          ['Assessments', 'Adaptive Cards with scoring logic — results written to state object, not interpreted by AI'],
        ],
      },
      {
        type: 'text',
        heading: 'Key Insight',
        body: '"AI is the interface to the data store." The breakthrough was treating the LLM as a natural language layer over structured data — not as the source of truth. Deterministic state lived in JSON; the AI provided conversational access to it. This separated concerns cleanly: AI handled interaction, structured data handled state.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Functional POC delivered in approximately four weeks from zero platform experience. Hybrid architecture resolved the reliability challenges of the original declarative approach. The pattern — separating deterministic state from AI interaction — is now a reference model for Copilot Studio agent development on the account.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "Internal ERP modernization project on Power Platform — model-driven Power Apps over Dataverse. External consultants who built the initial system departed, taking institutional knowledge with them. Dan was assigned as development lead without prior Power Platform experience, inheriting a system with no documentation, no version control, and no clear requirements chain.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Role'],
        rows: [
          ['Dan Novak', 'Development Lead', 'Inherited system ownership; forensic analysis and diagnosis'],
          ['External Consultants', 'Original Developers', 'Departed; no knowledge transfer'],
          ['Lead Developer', 'Internal Staff', 'Ongoing development support'],
          ['Governance Architect', 'Internal Staff', 'Organizational governance oversight'],
        ],
      },
      {
        type: 'table',
        heading: 'Requirements Degradation Chain',
        columns: ['Stage', 'Format', 'Fidelity Loss'],
        rows: [
          ['Original requirements', 'PowerPoint presentations', 'Baseline — visual, contextual, rationale included'],
          ['Intermediate documentation', 'Word documents', 'Rationale stripped; context reduced to summaries'],
          ['Work item backlog', 'Excel spreadsheets', 'Structure lost; items decontextualized'],
          ['Development tickets', 'Azure DevOps work items', 'Atomic tasks with no connecting narrative or user intent'],
        ],
      },
      {
        type: 'table',
        heading: 'Findings — Five Foundational Gaps',
        columns: ['Finding', 'Severity', 'Description'],
        rows: [
          ['No data model', 'Critical', 'Dataverse schema evolved ad hoc with no entity relationship design — relationships implied by naming conventions, not enforced by structure'],
          ['No version control', 'Critical', 'Power Platform Solutions were unmanaged — no branching, no rollback, no audit trail for schema or logic changes'],
          ['Monolithic solution architecture', 'High', 'All components in a single unmanaged solution — no separation of concerns, no ability to promote changes independently'],
          ['Requirements atomization without context', 'High', 'Azure DevOps work items contained implementation tasks with no connection to user intent, business rules, or acceptance criteria'],
          ['No decomposed user stories', 'High', 'Work was defined at the feature level with no user story decomposition — no acceptance criteria, no definition of done'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "Enterprise software practices were never applied because the project was initiated under a citizen-developer model — Power Platform's low-code positioning implied that standard engineering discipline was optional. As scope grew to enterprise scale, the absence of foundational practices compounded. The external consultants' departure removed the only people who held implicit knowledge of the system's design intent.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "AI-assisted forensic analysis after a year of platform immersion produced a structured diagnosis of five foundational gaps. The diagnosis was the deliverable — a clear architectural audit that established what would need to be true before any further development could proceed reliably. The analysis provided the governance team with the first complete picture of the system's technical debt.",
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'Manual SCORM course testing required navigating through every gated interaction from the beginning of a course to reach the state being tested — consuming hours per test cycle across hundreds of courses. Dan recognized the parallel to TASBot and speedrunning emulator save states: the ability to capture and restore arbitrary program state to enable instant reproduction of any scenario.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Architect / Developer', 'GP Strategies'],
          ['Max Glick', 'Engineering Manager', 'GP Strategies'],
        ],
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Description'],
        rows: [
          ['QA time sink', 'Manual course navigation consumed hours per test cycle — multiply by hundreds of courses and dozens of test scenarios per course'],
          ['State management parallel', 'TASBot/speedrunning emulator save states enable instant reproduction of arbitrary game state — the same approach applied to SCORM session data'],
          ['Tool effectiveness', 'State capture and restore reduced targeted test cycles from hours to minutes — any scenario reproducible instantly'],
          ['Adoption barrier', 'Direct-labor billing model made non-billable tool development economically invisible — the tool existed but was never formally deployed team-wide'],
          ["Rustici gap", "Rustici Engine's testing tools address package validation but lack reproducible debug states — the specific capability this tool provided"],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: 'The direct-labor billing model that governs most eLearning production work treats tool development as non-billable overhead. A tool that saves 10 hours of billable QA time has no line item — the savings are invisible to project accounting. This structural constraint prevented formal adoption despite demonstrated effectiveness.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Test cycles dropped from hours to minutes for targeted scenarios. Some adoption occurred informally. The tool was never formally deployed team-wide due to the non-billable tooling constraint. The approach — separating SCORM session state from course navigation — anticipates the debug-state capabilities that commercial testing tools would later address.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'React/GraphQL frontend integrating four backend systems: Rustici Content Controller, PeopleFluent LMS, Watershed LRS, and Amazon Cognito. Engagement began as a rebranding project and revealed a federated integration architecture of significant complexity — undocumented Material UI theming relationships, cross-system debugging requirements, and a Cognito authentication issue that had been open for months.',
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Frontend Developer / Integration Engineer', 'GP Strategies (BP Account)'],
          ['Leo Learning Team', 'Platform Development', 'Leo Learning / GP Strategies'],
        ],
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Description'],
        rows: [
          ['Undocumented theming', 'Material UI component relationships were not documented — visual changes cascaded in unexpected ways, requiring archaeological investigation of the component tree'],
          ['Federated architecture', 'The platform was a facade over four independent systems — no single system owned the learner record; cross-system state management was implicit'],
          ['Familiar pattern', 'The federated integration pattern matched CSBB Dispatch from 2011 — a decade of architectural evolution from custom-built to commercial ecosystem solving the same problem'],
          ['Scope estimation challenge', 'Rebranding scope masked underlying integration complexity — what appeared to be a theming engagement required cross-system debugging across all four backends'],
          ['Cross-system debugging', 'Bugs required tracing across GraphQL queries, backend API responses, LRS xAPI statements, and Cognito authentication flows simultaneously'],
        ],
      },
      {
        type: 'text',
        heading: 'Pattern Recognition',
        body: 'Recognizing the federated integration pattern from CSBB Dispatch — built in 2011 to solve the same centralized content dispatch problem across organizational boundaries — provided immediate architectural context. The commercial ecosystem (Rustici Content Controller, Watershed LRS, PeopleFluent) was solving the same problem that required a custom build a decade earlier. The pattern had evolved; the underlying architecture had not.',
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: 'Delivered theming updates, bug fixes, Cognito authentication resolution, and Watershed LRS debugging. The Cognito issue — open for months before the engagement — was resolved as part of the cross-system investigation. Pattern recognition from CSBB Dispatch provided architectural context that accelerated diagnosis.',
      },
    ],
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
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'Three concurrent GP Strategies projects — BP Learning Platform, AICPA Bridge Adapter, and ContentAIQ — unified by a single thread: integration expertise across system boundaries. The progression demonstrates 13 years of pattern recognition from CSBB Dispatch (2011) through modern multitenant SaaS AI product architecture.',
      },
      {
        type: 'text',
        heading: 'BP Learning Platform',
        body: 'React/GraphQL facade over four backend systems (Rustici Content Controller, PeopleFluent LMS, Watershed LRS, Amazon Cognito). Federated integration pattern recognized from CSBB Dispatch. Delivered theming, bug fixes, Cognito resolution, and Watershed debugging.',
      },
      {
        type: 'text',
        heading: 'AICPA Bridge Adapter',
        body: 'Node.js webhook synchronization pipeline between AirTable and Bridge LMS. Real-time bidirectional sync across organizational boundaries — the same boundary-crossing pattern as CSBB Dispatch, now implemented as a webhook pipeline rather than a SCORM dispatch layer.',
      },
      {
        type: 'text',
        heading: 'ContentAIQ',
        body: 'AI-powered learning content creation platform built on Azure. Inherited codebase stewardship with L3 escalation responsibility. Design-to-code translation from Adobe XD specifications. Cross-system debugging across frontend, AI pipeline, and backend API boundaries.',
      },
      {
        type: 'table',
        heading: 'Technologies Across Three Projects',
        columns: ['Project', 'Frontend', 'Backend / Integration'],
        rows: [
          ['BP Learning Platform', 'React, Material UI', 'GraphQL, Rustici, PeopleFluent, Watershed, Cognito'],
          ['AICPA Bridge', 'N/A (backend service)', 'Node.js, PostgreSQL, AirTable API, Bridge LMS'],
          ['ContentAIQ', 'Next.js, Tailwind CSS', 'Azure, AI pipeline, backend API'],
        ],
      },
      {
        type: 'text',
        heading: 'Pattern Recognition',
        body: 'The integration thread runs from CSBB Dispatch (2011) — a custom cross-domain dispatch layer — through three 2024 projects that solve the same boundary-crossing problem using commercial ecosystems and modern tooling. The architectural insight is identical: federated systems require a coordination layer, and the coordination layer is where the complexity lives.',
      },
    ],
    impactTags: ['AI Product Frontend', 'Multitenant Architecture', 'Design Translation', 'Integration Patterns', 'Pattern Recognition', 'Cross-System Coordination', 'Federated Systems'],
    exhibitLink: '/exhibits/exhibit-o',
    isDetailExhibit: true,
    investigationReport: false,
  },
]
