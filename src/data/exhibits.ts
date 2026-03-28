export interface ExhibitQuote {
  text: string
  attribution: string
  role?: string
}

export interface ExhibitResolutionRow {
  issue: string
  resolution: string
}

export interface ExhibitFlowStep {
  label: string
  detail: string
}

export interface ExhibitTimelineEntry {
  date: string
  heading: string
  body: string
  quote?: string
  quoteAttribution?: string
}

export interface ExhibitSection {
  heading?: string
  type: 'text' | 'table' | 'flow' | 'timeline'
  body?: string
  columns?: string[]
  rows?: string[][]
  steps?: ExhibitFlowStep[]
  entries?: ExhibitTimelineEntry[]
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
        body: "Electric Boat, a division of General Dynamics, has been the primary submarine builder for the United States Navy for over 120 years. Located in Groton, Connecticut, EB designs, builds, and maintains nuclear submarines including the Virginia-class attack submarine and the Columbia-class ballistic missile submarine. With a significant percentage of its workforce approaching retirement within 10 years, recruitment and onboarding became paramount to maintaining institutional knowledge and operational readiness.\n\nEB used Cornerstone OnDemand as their Learning Management System, with course content hosted on separate internal EB servers \u2014 a cross-domain architecture that caused persistent training delivery failures. The LMS was hosted externally by Cornerstone, while EB's content resided on internal EB network servers. This split created a same-origin policy conflict that broke standard LMS-to-course communication protocols.\n\nGP Strategies Corporation provided learning solutions to General Dynamics/Electric Boat as a major client. GP maintained an on-site training support team at EB. The Senior Vice President of Learning Solutions flagged the engagement opportunity and directed the technical team to pursue resolution.",
      },
      {
        type: 'text',
        heading: 'Personnel',
        body: "Dan Novak served as lead investigator and solution architect. On the GP Strategies side, the engagement was sponsored by a Senior Vice President who initiated the opportunity, authorized by a Sr. Director of Learning Solutions, and coordinated by a Program Manager. A co-investigator assisted with testing.\n\nOn the Electric Boat side, the Chief of Learning Services, Metrics, Processes & Technology served as the primary technical counterpart. Two curriculum developers and a training analyst specialist collaborated on testing and provided technical data throughout the engagement.",
      },
      {
        type: 'table',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Lead Investigator / Solution Architect', 'GP Strategies'],
          ['Tracey Nicholson', 'Chief of Learning Services, Metrics, Processes & Technology', 'Electric Boat'],
          ['Quinn Gladu', 'Chief of Learning Services', 'Electric Boat'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['Josh Stoudt', 'Senior Director, Learning Solutions', 'GP Strategies'],
          ['Chris Emmons', 'LMS Administrator', 'Electric Boat'],
          ['Multiple EB Personnel', '49 contacts across departments', 'Electric Boat'],
        ],
      },
      {
        type: 'timeline',
        heading: 'Sequence of Events',
        entries: [
          {
            date: 'September 5, 2017',
            heading: 'Initial Contact',
            body: 'Dan notes: "I have worked with General Dynamics before and am familiar with their issues with SuccessFactors."',
            quote: "This company has one or some courses that they cannot get to work on their Cornerstone LMS. The SVP would like us to jump on troubleshooting so we can have a 'quick win' with this client.",
            quoteAttribution: 'Program Manager, GP Strategies',
          },
          {
            date: 'June 13, 2018',
            heading: 'Formal Investigation Begins',
            body: 'EB reports HTML5 AICC courses failing to record completions. Issue began May 21, 2018. Formal investigation assigned.',
          },
          {
            date: 'June 18, 2018',
            heading: 'Root Cause Analysis',
            body: "The Chief of Learning Services provides Fiddler traces. Dan identifies the Articulate-provided PHP relay script as having no error checking \u2014 silently failing on all cross-domain requests.",
            quote: "The Confined Spaces log has interesting results. It is posting to the 'proxlet' included for cross-domain AICC, but isn't getting any response.",
            quoteAttribution: 'Dan Novak, identifying silent failure in PHP relay script',
          },
          {
            date: 'June 20, 2018',
            heading: 'Proof of Concept Delivered',
            body: 'Dan uploads three SCORM 1.2 test packages with cross-domain wrappers from the enterprise course library. Provides detailed 6-step testing protocol.',
            quote: 'That SCORM wrapper does sound intriguing! We do more SCORM 2004 here than 1.2, but having both options would be very helpful!',
            quoteAttribution: 'Chief of Learning Services, Electric Boat',
          },
          {
            date: 'June 21, 2018',
            heading: 'Cross-Domain Architecture Confirmed',
            body: 'EB confirms the fundamental constraint that necessitates a cross-domain solution.',
            quote: "Our LMS and our content server are definitely on different domains... we can't put content up on our Cornerstone server.",
            quoteAttribution: 'Chief of Learning Services, Electric Boat',
          },
        ],
      },
      {
        type: 'timeline',
        heading: 'On-Site Resolution \u2014 August 2018',
        body: "The Sr. Director authorized travel to Groton, CT for on-site troubleshooting and solution deployment at Electric Boat's facility. Dan worked directly with the EB team over two days (August 15\u201316, 2018). Five critical issues resolved during the engagement.",
        entries: [
          {
            date: 'August 17, 2018',
            heading: 'Client Summary Report',
            body: 'The Chief of Learning Services emails the EB leadership chain with a detailed summary of the engagement outcomes.',
            quote: "I'd consider the last couple days a huge success, and I look forward to working with Dan in the future.",
            quoteAttribution: 'Chief of Learning Services, Electric Boat, in summary email to EB leadership',
          },
          {
            date: 'August 20\u201321, 2018',
            heading: 'Executive Recognition',
            body: 'Recognition propagates through GP Strategies leadership hierarchy independently.',
            quote: 'I hear you did an AWESOME job onsite! EB really appreciated your support.',
            quoteAttribution: 'Sr. Director, Learning Solutions, GP Strategies',
          },
          {
            date: 'August 22, 2018',
            heading: 'SCORM 2004 Prototype Breakthrough',
            body: 'Dan reports SCORM 2004 cross-domain wrapper prototype working.',
            quote: 'That is fantastic news! One of our more regular SCORM 2004 customers is very excited about not needing the Cornerstone player any more.',
            quoteAttribution: 'Chief of Learning Services, Electric Boat',
          },
        ],
      },
      {
        type: 'timeline',
        heading: 'Second On-Site Visit \u2014 March\u2013April 2019',
        body: 'Dan returns to Groton, CT with a GP Strategies course developer for an extended 12-day engagement (March 25 \u2013 April 5, 2019). Primary focus: Flash-to-HTML5 conversion strategy and ESM course remediation. The team rewrote the JavaScript communication layer (content.js) in legacy Flash courses to restore completion tracking on Cornerstone.',
        entries: [
          {
            date: 'April 10, 2019',
            heading: 'Client Recognition',
            body: 'The Chief of Learning Services emails GP leadership praising the technical impact.',
            quote: "Dan's technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues we were having, one that will have a direct impact on the Flash conversion process and save a lot of time and money.",
            quoteAttribution: 'Chief of Learning Services, Electric Boat, in recognition email to GP leadership',
          },
          {
            date: 'April 19, 2019',
            heading: 'Leadership Response',
            body: 'GP leadership affirms the on-site team selection.',
            quote: "I believed from the beginning that we were sending the A team out there to support so I appreciate your validation of the team's skill and dedication.",
            quoteAttribution: 'Sr. Director, Learning Solutions, GP Strategies',
          },
        ],
      },
      {
        type: 'timeline',
        heading: 'Continued Engagement (2019\u20132022)',
        body: "What began as a cross-domain SCORM troubleshooting engagement evolved into a 7-year embedded technical advisory role. After the August 2018 on-site visit, the relationship intensified rather than concluded. Dan became the Chief of Learning Services' primary escalation resource for complex LMS and courseware issues across the Electric Boat training organization. 2019 was the peak engagement year with 287 emails \u2014 nearly 5x the 2018 volume.",
        entries: [
          {
            date: 'January 2020',
            heading: 'SCORM 2004 & Chrome 80 Impact Analysis',
            body: "EB requests SCORM 2004 interaction-tracking implementation. Dan also provides impact analysis for Chrome 80's deprecation of synchronous XHR \u2014 a change that threatened to break AICC communication across EB's entire course catalog.",
            quote: 'You are so awesome. Thank you very much for your fast and clear response. We really appreciate you. When are you visiting again? I owe you lunch at least.',
            quoteAttribution: 'Chief of Learning Services, Electric Boat',
          },
          {
            date: 'August 2022',
            heading: 'Final Documented Engagement',
            body: "Last documented correspondence addresses third-party cookie policy changes and their impact on EB's cross-domain wrapper architecture. The relationship continued through EB Trades courseware edits and LMS administration support. Total engagement: 574 emails across 49 EB personnel over 7 years.",
          },
        ],
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Background', 'Resolution'],
        rows: [
          ['SCORM courses dependent on Cornerstone Network Player', 'SCORM requires a player to communicate between the course and the LMS. If the Cornerstone Network Player went down, all SCORM courses stopped functioning. AICC was used as a workaround but had significant limitations.', 'Dan provided a cross-domain SCORM wrapper that eliminates dependency on the Cornerstone Network Player entirely. A SCORM 2004 version was prototyped within one week of the on-site visit.'],
          ['HTML5 courses failing under AICC protocol', "HTML5 is the modern publishing format replacing Flash. EB's HTML5 AICC courses threw errors at launch and could not communicate with the LMS, preventing completion recording.", 'Converted AICC courses to SCORM HTML5 using the cross-domain wrapper. Courses performed better than they had under the previous AICC configuration.'],
          ['Quiz bookmarking and reset failures', "AICC could not properly reset quizzes for multiple attempts. Bookmarking was unreliable, limiting course design options for EB's curriculum development team.", 'SCORM HTML5 with the cross-domain wrapper properly supports bookmarking, reset, and multiple quiz attempts. Curriculum developers gained new design freedom previously unavailable under AICC constraints.'],
          ['No tools to verify SCORM data flow', "EB's IT department was disabling troubleshooting tools (Inspect Element) on workstations. There was no way to observe data moving between courses and the LMS during testing or debugging.", 'Dan provided an LMS simulation tool that captures and displays all course-to-LMS communication. The tool was also usable for training EB staff on SCORM data concepts and troubleshooting methodology.'],
          ['Bulk SCORM import not available', "Cornerstone only allowed single-course uploads. GP's enterprise course library (1,000+ courses) could not be practically migrated to EB's LMS using the one-at-a-time upload process.", "The team tested Cornerstone's new bulk Course Publication tool with 7 SCORM courses from the enterprise course library. Successfully validated the migration path for future large-scale course library deployment."],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The investigation determined that the root cause was Electric Boat's cross-domain architecture: the Cornerstone LMS (hosted externally by Cornerstone OnDemand) and EB's content servers (hosted on the internal EB network) resided on different domains. The browser's same-origin policy blocked JavaScript LMS API calls between the course content and the LMS runtime. The Articulate-provided PHP relay script \u2014 intended to bridge this gap via AICC \u2014 had no error handling and was silently failing on all cross-domain POST requests.\n\nThe solution bypassed the AICC/relay architecture entirely by deploying a custom SCORM cross-domain wrapper that transparently proxied LMS API calls using postMessage and an intermediary iframe hosted on the LMS domain. This approach eliminated the single point of failure (Cornerstone Network Player) and restored reliable bidirectional communication between course content and the LMS.",
      },
      {
        type: 'text',
        heading: 'Recommendations Implemented',
        body: "Cross-domain SCORM 1.2 wrapper deployed \u2014 replacing the unreliable AICC/PHP relay architecture and eliminating dependency on the Cornerstone Network Player. SCORM 2004 wrapper prototyped \u2014 development path established for EB's SCORM 2004 course catalog, with first successful cross-domain API call achieved within one week of the on-site visit.\n\nLMS simulation/troubleshooting tool provided to EB team \u2014 enabling self-service diagnostics and SCORM data education for curriculum developers and training analysts. Bulk course import path validated \u2014 Cornerstone's Course Publication tool tested with 7 enterprise course library SCORM courses, establishing a viable migration path for the 1,000+ course library.\n\nGDAIS cross-pollination opportunity identified \u2014 The investigation identified that the General Dynamics Advanced Information Systems (GDAIS) group, which also uses Cornerstone OnDemand, could benefit from the same cross-domain solutions deployed at Electric Boat.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "The cross-domain SCORM wrapper originally deployed in 2018 remained the foundation of EB's course delivery architecture throughout the 7-year engagement. By the numbers: 574 documented emails, 49 EB personnel contacts, peak year 2019 (287 emails), 2 on-site visits to Groton CT, engagement continued through August 2022.\n\nThe scope expanded well beyond SCORM wrappers: Flash remediation (2019) \u2014 rewrote the JavaScript communication layer in legacy ESM courses. Chrome 80 impact analysis (2020) \u2014 assessed the threat of synchronous XHR deprecation. SCORM 2004 interaction tracking (2020) \u2014 extended the wrapper for detailed assessment reporting. EB Trades courseware (2022) \u2014 continued support for specialized training content. Cross-domain architecture maintenance (2022) \u2014 advised on third-party cookie policy changes.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['eLearning Protocols', 'SCORM 1.2, SCORM 2004, AICC, cross-domain communication (postMessage, EasyXDM), same-origin policy workarounds'],
          ['LMS Platforms', 'Cornerstone OnDemand'],
          ['Authoring & Legacy', 'Adobe Flash/ActionScript, HTML5, Articulate Storyline'],
          ['Development & Debugging', 'JavaScript, PHP, Fiddler (network analysis), browser DevTools, Chrome, IE compatibility, synchronous XHR deprecation'],
          ['Content Engineering', 'Flash-to-HTML5 migration, ESM course JavaScript rewrites, bulk course import tooling'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Defense & Aerospace'],
          ['Duration', '7 years'],
          ['Personnel Involved', '49 individuals'],
          ['Evidence Trail', '574 emails analyzed'],
          ['Related', 'Exhibit B (Multi-Level Recognition), Exhibit D (Wells Fargo Migration)'],
        ],
      },
    ],
    impactTags: ['Client-Facing', 'SCORM', 'Cornerstone LMS', 'Cross-Domain', 'Tooling', 'Defense & Aerospace', 'Flash-to-HTML5', '7-Year Engagement'],
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
        body: "This exhibit documents two independent recognition cascades that followed Dan Novak's on-site technical engagements at General Dynamics Electric Boat \u2014 the first in August 2018, the second in April 2019.\n\nIn both cases, recognition propagated through GP Strategies' leadership hierarchy via multiple independent channels, unsolicited, before formal trip reports were filed. The fact that the same pattern repeated eight months apart \u2014 from a different set of triggers, through different intermediaries \u2014 indicates genuine impact rather than procedural courtesy.\n\nFor the technical details of the Electric Boat engagement, see Exhibit A.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Technical Consultant (subject of both cascades)', 'GP Strategies'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['Josh Stoudt', 'Sr. Director of Learning Solutions (15+ years GP leadership)', 'GP Strategies'],
          ['Senior Vice President', 'SVP of Learning Solutions (initiated EB engagement Sept 2017)', 'GP Strategies'],
          ['Tracey Nicholson', 'Chief of Learning Services, Metrics, Processes & Technology', 'Electric Boat'],
          ['Quinn Gladu', 'Chief of Learning Services', 'Electric Boat'],
          ['GP On-Site EB Team', '3 members who independently relayed feedback (April 2019)', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'First Recognition Cascade \u2014 August 2018',
        body: "Following a 2-day on-site visit to resolve cross-domain SCORM communication failures, recognition propagated through GP Strategies' hierarchy before the formal trip report was filed.\n\nAugust 17, 2018 \u2014 The EB client contact (Chief of Learning Services) emails his internal EB leadership chain, summarizing visit outcomes.\n\nAugust 21, 2018 \u2014 The Director of Learning Technologies hears from multiple sources and emails Dan directly to relay the feedback.\n\nSame week \u2014 The Sr. Director reaches out independently, without prompting from Dan's management chain.\n\n\"I hear you did an AWESOME job onsite! EB really appreciated your support. Thank you for making the trip and doing all the great things you do!\" \u2014 Director of Learning Technologies, GP Strategies (August 21, 2018)",
      },
      {
        type: 'text',
        heading: 'Second Recognition Cascade \u2014 April 2019',
        body: "Eight months later, a 12-day on-site engagement produced the same pattern \u2014 recognition propagating through the hierarchy via independent channels, with named corroborating sources.\n\nApril 10, 2019 \u2014 The EB Chief of Learning Services emails GP leadership praising Dan's technical expertise and its direct impact on Flash conversion timelines.\n\nApril 19, 2019 \u2014 A senior GP team member responds, affirming the decision to send Dan and his colleague as \"the A team.\"\n\nMay 8, 2019 \u2014 The Director of Learning Technologies forwards the recognition thread, citing three named sources \u2014 Chris Sproule, Tracey Nicholson, and Quinn Gladu \u2014 who independently relayed positive feedback.\n\n\"Thanks for all of the great work you did out there. I heard about your work from several folks including Chris Sproule, Tracey Nicholson, and Quinn Gladu. Thanks for your hard work!\" \u2014 Director of Learning Technologies, GP Strategies (May 8, 2019)",
      },
      {
        type: 'text',
        heading: 'Pattern Analysis',
        body: "Both cascades share structural characteristics that distinguish genuine impact from procedural courtesy: Speed \u2014 Recognition emerged within days of each visit, not weeks. Independence \u2014 Multiple channels activated without coordination or solicitation. Cross-level propagation \u2014 Feedback traveled from client (EB) through senior leadership (SVP, Sr. Director) to direct management (Director). Specificity \u2014 Named sources, named outcomes, and specific technical contributions cited. Repeatability \u2014 The same pattern emerged from two different engagements, eight months apart.",
      },
      {
        type: 'text',
        heading: 'Significance',
        body: "A single recognition event can be attributed to politics, timing, or courtesy. Two independent cascades \u2014 through different intermediaries, triggered by different technical outcomes, eight months apart \u2014 constitute a pattern. The Director of Learning Technologies cited independent sources in both instances, confirming that recognition was not solicited or coordinated.",
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Defense & Aerospace'],
          ['Duration', '2 years'],
          ['Personnel Involved', '8 individuals'],
          ['Outcome', 'Demonstrated repeatable pattern of multi-level, unsolicited recognition through independent channels following technical excellence'],
          ['Related', 'Exhibit A (Electric Boat LMS Integration), Exhibit D (Wells Fargo Migration)'],
        ],
      },
    ],
    impactTags: ['Repeatable Pattern', 'Multi-Source Corroboration', 'General Dynamics', 'SVP-Level Praise', 'Cross-Level Propagation', 'Named Independent Sources'],
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
        body: "In 2015, GP Strategies undertook a massive content refresh of their enterprise course library. A total of 1,216 lessons needed to be verified, fixed, and republished through the Xyleme content authoring platform. The project involved 15+ team members over several months and represented one of the largest single content operations in the team's history.",
      },
      {
        type: 'text',
        heading: 'The Problem',
        body: "Publishing lessons from Xyleme was a manual, time-consuming process. Each lesson had to be individually published through the Xyleme interface \u2014 selecting the lesson, configuring output parameters, initiating the publish, and waiting for confirmation. With 1,216 lessons needing multiple publish cycles, the labor cost was enormous.\n\nThe team collectively needed to verify that all content in every lesson matched what was currently being served to customers. This meant each lesson went through multiple rounds of verification and republishing, compounding the manual effort exponentially.",
      },
      {
        type: 'text',
        heading: 'The Solution',
        body: "Dan Novak used the Fiddler network debugging tool to analyze and integrate with Xyleme's publishing API. By capturing and analyzing the HTTP traffic between the browser and Xyleme's servers, he identified the exact sequence of API requests needed to trigger a publish operation.\n\nHe then built an automation tool that could batch-publish lessons unattended \u2014 eliminating the need for a human to manually click through each lesson's publish workflow. This saved an estimated 600+ hours of manual labor across the project.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Senior Learning Technologist ("The Fiddler")', 'GP Strategies'],
          ['Content Team Manager', 'Manager, Content Team (led the overall refresh project)', 'GP Strategies'],
          ['Colleague ("The Slacker")', 'Used automation tool to publish every lesson 3x; built auto-integration of custom code (saving 75+ additional hours)', 'GP Strategies'],
          ['15+ Team Members', 'Content refresh contributors (each recognized with unique nicknames)', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'Primary Source Testimony',
        body: "\"Page after page, lesson after lesson, week after week, the team took the task at hand and worked it until it was done \u2014 and then asked for more. Relentless forward motion towards our goal.\" \u2014 Manager, Content Team, GP Strategies, describing the team's approach in the recognition email.",
      },
      {
        type: 'table',
        heading: 'Impact Metrics',
        columns: ['Metric', 'Value'],
        rows: [
          ['Labor hours saved via automation', '600+'],
          ['Lessons refreshed & verified', '1,216'],
          ['Additional hours saved (custom code)', '75+'],
          ['Team members individually recognized', '15+'],
        ],
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "The automation tool was adopted by at least one colleague and used to publish every lesson multiple times during the refresh cycle. Dan's contribution was singled out by name in an all-hands recognition email, receiving the title \"The Fiddler\" \u2014 the only team member recognized specifically for tooling and automation.\n\nThe recognition email gave each of 15 team members a unique nickname highlighting their specific contribution. The Director of Learning Technologies highlighted this as a kudos during the All Hands meeting, elevating the team's work to division-wide visibility.\n\nThe team collectively verified that all of the content in 1,216 lessons matched the content currently being served to customers. The content delivery framework library was fully refreshed for all clients including the enterprise course library.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Reverse Engineering & Analysis', 'Fiddler (HTTP traffic capture and analysis), browser DevTools, Xyleme API inspection'],
          ['Authoring Platform', 'Xyleme LCMS (Learning Content Management System), XML-based content storage, multi-channel publishing'],
          ['Automation Development', 'Batch publishing scripts, API integration, unattended publishing workflows, custom code auto-integration'],
          ['Content Delivery', 'Responsive skin development, HTML5 output, content delivery framework, enterprise course library management'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Learning & Development'],
          ['Duration', '1 year'],
          ['Personnel Involved', '15 individuals'],
          ['Outcome', 'Automated batch publishing of 1,216 lessons, saving 600+ hours of manual labor through Fiddler-based API reverse engineering'],
        ],
      },
    ],
    impactTags: ['600+ Hours Saved', 'Automation', 'Xyleme', 'Fiddler', '1,216 Lessons', 'API Reverse Engineering', 'Enterprise Course Library'],
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
        body: "Wells Fargo engaged GP Strategies in 2018 to execute a large-scale content migration project: transferring over 100 sales and conversion eLearning courses from legacy formats (Adobe Presenter, standalone HTML5, and aging Flash-based modules) into the Xyleme Learning Content Management System (LCMS). The migrated content would then be published as SCORM 1.2 packages for deployment to the Wells Fargo enterprise LMS.\n\nDan Novak was assigned as the technical lead for functional quality assurance. The engagement lasted approximately six months and generated 223 emails of technical coordination. Wells Fargo was classified as a critical account for GP Strategies; reliable turnaround on the high volume of deliverables was essential to maintaining the relationship.\n\nDan brought prior hands-on experience with Xyleme from his work on the GPiLEARN platform, giving him institutional knowledge of Xyleme's SCORM publishing behavior, its \"thin package\" architecture, and its interaction quirks with legacy browser environments. Wells Fargo granted Dan full administrative access to their Xyleme Studio instance to facilitate troubleshooting and validation.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Computer Programmer / Technical Lead for Functional QA', 'GP Strategies'],
          ['Chris Sproule', 'Director of Learning Technologies', 'GP Strategies'],
          ['QA Lead', 'QA Coordinator (close collaborator on functional testing)', 'GP Strategies'],
          ['Program Manager', 'Engagement coordination and client relationships', 'GP Strategies'],
          ['Project Lead', 'Coordinated rapid-turnaround testing requests with Dan', 'GP Strategies'],
          ['Wells Fargo Contacts', 'Subject matter experts and content owners', 'Wells Fargo'],
        ],
      },
      {
        type: 'text',
        heading: 'Technical Contributions',
        body: "QA Budget Estimation Methodology: Dan developed a structured approach to estimating QA effort based on interactivity-level multipliers. This methodology allowed the project team to forecast testing time accurately across the 100+ course portfolio, accounting for complexity variance between simple click-through content and highly interactive simulation-based modules. The estimation framework became a repeatable asset for future migration projects.\n\nXyleme SCORM Publishing Expertise: Drawing on his prior work with Xyleme during the GPiLEARN platform development (2012\u20132013), Dan provided critical technical guidance on Xyleme's SCORM publishing behavior. He understood Xyleme's \"thin package\" approach \u2014 where SCORM content is published as a minimal wrapper that loads the bulk of its assets from a centralized Xyleme server rather than bundling everything into the SCORM ZIP. This architecture had specific implications for LMS integration, caching, and cross-domain security policies that required specialized knowledge to troubleshoot.\n\nCross-Browser SCORM Failure Diagnosis: Dan diagnosed persistent SCORM completion tracking and bookmarking failures in Flash-based legacy content when tested in Internet Explorer. The issue stemmed from ActionScript's interaction with IE's COM-based SCORM API adapter, compounded by Xyleme's thin package architecture introducing additional latency into the API call sequence.\n\nFull Administrative Access: Wells Fargo granted Dan full administrative access to their Xyleme Studio instance \u2014 a level of trust rarely extended to vendor contractors in a financial services environment. This access enabled Dan to validate content structure, inspect publishing settings, and troubleshoot issues directly within the client's production authoring environment.",
      },
      {
        type: 'text',
        heading: 'Findings',
        body: "Legacy Format Incompatibilities: Courses authored in Adobe Presenter (PowerPoint-based) and standalone HTML5 frameworks required significant structural rework to map cleanly into Xyleme's topic-based authoring model. Flash modules needed careful handling to ensure ActionScript-based interactions would continue to function when wrapped in Xyleme's SCORM publishing layer.\n\nInternet Explorer Runtime Environment: Wells Fargo's corporate browser standard was Internet Explorer, which introduced rendering inconsistencies, JavaScript compatibility issues, and SCORM API communication quirks not present in modern browsers. Testing under IE revealed completion tracking failures in Flash-based content, where the ActionScript-to-JavaScript bridge would intermittently fail to commit learner progress data to the LMS. Dan identified the root cause as a race condition in IE's COM SCORM adapter, exacerbated by Xyleme's thin package latency.\n\nHigh-Volume Delivery Cadence: With over 100 courses in scope and a six-month timeline, the project required a reliable, repeatable QA process. Dan's interactivity-level-based estimation methodology provided the predictability needed to schedule testing across the full course portfolio.\n\nClient Relationship Pressure: Wells Fargo was explicitly identified by GP Strategies leadership as a critical account. Any delays in testing turnaround would cascade into missed course launch deadlines, potentially damaging the strategic relationship. Dan and the QA team maintained the testing schedule despite IE compatibility obstacles.",
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "Flash's ActionScript SCORM bridge relied on IE's COM-based SCORM adapter. Under certain timing conditions, the adapter completed initialization after the course had already attempted its first SCORM API call \u2014 producing silent failures with no error output. Xyleme's thin package approach (minimal wrapper HTML, course assets served separately) compounded the issue by reducing the time available for adapter initialization.",
      },
      {
        type: 'text',
        heading: 'Context',
        body: "The Wells Fargo engagement occurred during a transitional period in enterprise eLearning technology. Financial services institutions were migrating away from Flash-based content (Adobe had announced Flash's end-of-life in 2017) while still operating under corporate browser mandates that required Internet Explorer support. This created a narrow compatibility window where content had to function in a legacy browser environment while being architected for a post-Flash future.\n\nXyleme represented a modern LCMS approach: topic-based authoring, XML content storage, and multi-channel publishing (SCORM, xAPI, web, mobile). However, Xyleme's thin package SCORM architecture \u2014 designed for centralized asset management and version control \u2014 introduced integration challenges in environments with strict cross-domain security policies or limited network connectivity. Dan's prior hands-on experience with Xyleme from the GPiLEARN platform gave him the institutional knowledge needed to navigate these architectural constraints.",
      },
      {
        type: 'text',
        heading: 'Significance',
        body: "This exhibit demonstrates Dan's ability to serve as a technical lead on enterprise-scale migration projects for critical financial services clients. Key indicators: Platform Expertise Leveraged \u2014 Prior Xyleme experience from GPiLEARN directly applied to troubleshooting Wells Fargo's SCORM publishing issues. Methodology Development \u2014 Created reusable QA estimation framework based on interactivity-level analysis. Diagnostic Depth \u2014 Root-caused cross-browser SCORM failures involving Flash ActionScript, IE COM adapters, and Xyleme's thin package latency. Client Trust \u2014 Granted full administrative access to Wells Fargo's Xyleme production environment \u2014 rare for external contractors in financial services. Client-Initiated Feedback \u2014 Wells Fargo contact reached out unprompted to GP Strategies management to express appreciation. Delivery Under Pressure \u2014 Maintained high-volume testing cadence for critical account despite known technical obstacles.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "SCORM failures diagnosed and resolved across the Flash course portfolio. QA methodology adopted for effort estimation. Wells Fargo client contact independently relayed appreciation to GP Strategies leadership, triggering a recognition relay through the director level. The scale of the migration (100+ courses) and the client's strategic importance created a high-pressure environment where technical obstacles could not be allowed to disrupt delivery timelines.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['LCMS & Authoring', 'Xyleme Studio (LCMS), Xyleme \"thin package\" SCORM architecture, XML content storage, topic-based authoring'],
          ['Legacy Formats', 'Adobe Presenter (PowerPoint-based), Flash/ActionScript, standalone HTML5 frameworks'],
          ['eLearning Standards', 'SCORM 1.2, LMS API integration, completion tracking, bookmarking, quiz reset functionality'],
          ['Cross-Browser Diagnostics', "Internet Explorer COM SCORM adapter, Flash-to-JavaScript bridge debugging, ActionScript runtime environment"],
          ['QA Methodology', 'Interactivity-level estimation framework, functional testing, regression testing, cross-platform validation'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Financial Services'],
          ['Duration', '6 months'],
          ['Personnel Involved', '6 individuals'],
          ['Evidence Trail', '223 emails analyzed'],
          ['Related', 'Exhibit A (Electric Boat LMS Integration), Exhibit E (CSBB Dispatch)'],
        ],
      },
    ],
    impactTags: ['Client-Facing', 'Wells Fargo', 'Migration Validation', 'IE Compatibility', 'Technical Leadership', '100+ Courses', 'Xyleme LCMS', 'QA Methodology', 'Financial Services'],
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
        body: "Version control nightmare: every course update required emailing zip files to ~20 energy utility clients for manual re-upload to their respective LMS platforms. Different versions of the same content running on different client systems, with no centralized control over what was deployed where. A single course update could take days to propagate across all client deployments.\n\nThe problem wasn't just logistics \u2014 it was architectural. Each client's LMS enforced same-origin security policies, making direct cross-domain content hosting impossible with standard approaches. The content needed to live on GP Strategies' servers for centralized control, but execute inside each client's LMS domain for SCORM communication. No commercial product existed to solve this problem in 2011.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Role'],
        rows: [
          ['Dan Novak', 'Architect / Developer', 'System architecture, cross-domain communication layer, SCORM API proxy, package generation tooling'],
          ['Zach Taylor', 'Primary Development Collaborator', 'GPiLEARN platform engineering'],
          ['Ron Cyran', 'Program Manager', 'GPiLEARN program management and client coordination'],
          ['Tom Pizer', 'Director of Learning Technologies', 'Technical direction and hosting infrastructure'],
        ],
      },
      {
        type: 'timeline',
        heading: 'Sequence of Events',
        entries: [
          {
            date: 'The Problem',
            heading: 'Version Control Nightmare',
            body: 'Course updates require emailing zip files to ~20 energy clients for manual re-upload. Version chaos across deployments.',
          },
          {
            date: 'Architecture Design',
            heading: 'Centralized Hosting with Stub Packages',
            body: "Dan designs centralized content hosting on GP servers with lightweight \"stub\" packages deployed to client LMS platforms. Stubs are kilobytes, not megabytes.",
          },
          {
            date: 'Cross-Domain Bridge',
            heading: 'EasyXDM Communication Layer',
            body: "JavaScript/CORS communication layer using EasyXDM to bridge the cross-domain gap between GP's content servers and client LMS domains.",
          },
          {
            date: 'Protocol Translation',
            heading: 'SCORM API Proxy',
            body: 'SCORM API proxy with transparent AICC/SCORM protocol translation \u2014 the same content works regardless of whether the client LMS speaks SCORM or AICC.',
          },
          {
            date: 'CSBB Generator',
            heading: 'Automated Package Generation',
            body: 'Package generation tooling (Groovy, Access, Windows Forms) automating the creation and deployment of stub packages. Global deployments without touching individual client systems.',
          },
          {
            date: 'Scale',
            heading: 'Multi-Client Deployment',
            body: 'Deployed across ~20 energy utility clients including FPL, Puget Sound Energy, NRG, Colorado Springs Utilities, Calpine, Exelon, BP. ~2,000 courses in the central library \u2014 each client drawing a curated subset.',
          },
          {
            date: 'Defense Adaptation',
            heading: 'Cross-Industry Reuse',
            body: 'Architecture later adapted for General Dynamics Electric Boat defense sector deployment, proving the pattern was reusable across industries.',
          },
          {
            date: 'Validation',
            heading: 'Market Catches Up',
            body: 'System remained in production for 10+ years. In 2016, Rustici Software released Content Controller to solve the same centralized dispatch problem commercially.',
          },
        ],
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Description'],
        rows: [
          ['Cross-domain architecture', 'EasyXDM-based communication layer bridged same-origin policy constraints between GP content servers and client LMS domains \u2014 transparent to both content and LMS'],
          ['Protocol agnostic', 'SCORM API proxy provided transparent AICC/SCORM protocol translation \u2014 identical content packages worked across LMS platforms regardless of protocol dialect'],
          ['Deployment revolution', 'Stub packages (kilobytes) replaced full content packages (megabytes) on client LMS. Course updates deployed centrally, propagated instantly to all clients'],
          ['Automation at scale', 'CSBB Generator tooling (Groovy, Access, Windows Forms) automated package creation for a ~2,000 course library across ~20 clients \u2014 global deployments without touching individual systems'],
          ['Cross-industry reuse', 'Architecture originally built for energy utilities was successfully adapted for defense sector (General Dynamics Electric Boat) \u2014 proving the pattern was reusable, not domain-specific'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "CSBB Dispatch solved a problem that had no commercial solution in 2011: centralized cross-domain content delivery with transparent protocol translation. The architecture \u2014 lightweight stubs on client LMS platforms communicating with centralized content servers via EasyXDM \u2014 eliminated the version control nightmare of distributing zip files to multiple clients and enabled instant, centralized updates across all deployments.\n\nFive years later, in 2016, Rustici Software released Content Controller to address the same centralized dispatch problem. CSBB was built five years before the commercial solution existed.",
      },
      {
        type: 'text',
        heading: 'Naming',
        body: "The system was called CSBB \u2014 Content Server Black Box \u2014 internally, reflecting its function: a black box mediating between GP's content servers and client LMS platforms. The \"Dispatch\" descriptor was adopted informally after Rustici released SCORM Dispatch as part of SCORM Cloud, because it more accurately described what the thin-package architecture was doing.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "The system served ~20 energy utility clients including FPL, Puget Sound Energy, NRG, Colorado Springs Utilities, Calpine, Exelon, and BP \u2014 each drawing a curated subset from a ~2,000 course central library. It remained operational for 10+ years \u2014 outlasting most of the projects it was built to support.\n\nThe architecture proved reusable when adapted for General Dynamics Electric Boat's defense sector deployment, demonstrating that the cross-domain dispatch pattern wasn't a one-off solution but a generalizable approach to multi-tenant content delivery.\n\nDan encountered the same architectural pattern a decade later on the BP Learning Platform (2024) \u2014 a federated integration layer (React/GraphQL) stitching together Rustici Content Controller, PeopleFluent LMS, Watershed LRS, and Amazon Cognito. He didn't build that platform, but he recognized the architecture immediately because he'd invented his own version of it in 2011.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Core Languages', 'JavaScript (ES5), HTML5'],
          ['Cross-Domain Communication', 'EasyXDM (cross-domain messaging library), CORS, postMessage'],
          ['eLearning Standards', 'SCORM 1.2, AICC (HACP protocol), SCORM-to-AICC protocol translation'],
          ['Package Generation', 'Groovy (scripting), Microsoft Access (database/UI), Windows Forms (tooling UI)'],
          ['Infrastructure', 'SQL (content metadata), GP Strategies content servers, client LMS platforms'],
          ['Client Deployments', 'FPL, Puget Sound Energy, NRG, Colorado Springs Utilities, Calpine, Exelon, BP, General Dynamics Electric Boat'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Energy & Utilities'],
          ['Duration', '10 years'],
          ['Personnel Involved', '4 individuals'],
          ['Outcome', 'Architected cross-domain content delivery platform serving ~2,000 courses to ~20 energy utility clients. Built 5 years before Rustici Content Controller'],
          ['Related', 'Exhibit A (Electric Boat LMS Integration), Exhibit D (Wells Fargo Migration)'],
        ],
      },
    ],
    impactTags: ['Cross-Domain Architecture', '~20 Clients Served', 'SCORM', 'GPiLEARN', 'Rustici Precursor', '10+ Years in Production', 'Protocol Translation'],
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
        body: "HSBC was a Tier 1 client of GP Strategies spanning nearly a decade (2015\u20132024) with 560+ documented email interactions across 25 contacts in 5 countries. The engagement encompassed LMS migration advisory, legacy content recovery, SCORM protocol debugging, global deployment support, accessibility compliance, and Vue.js application development.\n\nThe technical challenges were concentrated at the protocol level \u2014 SCORM communication failures, legacy Flash asset recovery, and cross-region LMS deployment inconsistencies on HSBC's global SAP SuccessFactors instance.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'SCORM/LMS Integration Specialist', 'GP Strategies'],
          ['Director of Learning Technologies', 'Management chain and technical oversight', 'GP Strategies'],
          ['HSBC Account PM/BA', 'Engagement coordination, client relationship management', 'GP Strategies'],
          ['Lead Developer', 'HSBC deliverables development', 'GP Strategies'],
          ['Performance Consultant (Mexico)', 'Localized deployments', 'GP Strategies'],
          ['Learning Consultant (UK)', 'HSBC global operations', 'GP Strategies'],
          ['22+ US Contacts', 'Plus regional representatives', 'HSBC (US, UK, Mexico, India, Philippines)'],
        ],
      },
      {
        type: 'text',
        heading: 'SCORM API Wrapper Bug Discovery',
        body: "While debugging course completion failures on HSBC's SuccessFactors instance, Dan traced the root cause to a bug in the vendor-built SCORM_API_wrapper.js. The wrapper was setting an incorrect cmi.core.exit value, causing the LMS to improperly terminate user sessions. This was not a content issue \u2014 it was a platform-level bug embedded in the communication layer between courses and the LMS. The fix restored reliable completion tracking across HSBC's entire course catalog.",
      },
      {
        type: 'text',
        heading: 'Flash Legacy Content Recovery',
        body: "When HSBC needed to update legacy Flash-based courses but the original FLA source files had been lost, Dan decompiled the published SWF files to recover the source content. This forensic recovery process extracted assets, ActionScript code, and timeline data from compiled binaries \u2014 enabling course updates that would otherwise have required complete rebuilds from scratch.",
      },
      {
        type: 'text',
        heading: 'Global Localization Debugging',
        body: "A localized HTML5 Sales Suitability course was failing to deploy correctly on HSBC's global SAP SuccessFactors instance. The deployment spanned teams in Mexico, India, and the Philippines. Dan diagnosed the SCORM deployment issues and coordinated the fix across international stakeholders, navigating time zones, language barriers, and regional LMS configuration differences.",
      },
      {
        type: 'text',
        heading: 'Findings',
        body: "The HSBC engagement demonstrates three recurring capabilities:\n\nProtocol-level debugging \u2014 The SCORM API wrapper bug was invisible to content developers and QA testers. It required understanding the SCORM specification deeply enough to identify an incorrect exit value in the communication layer \u2014 a Tier 3 diagnostic skill.\n\nForensic asset recovery \u2014 Decompiling Flash SWF files to recover lost source content requires specialized tooling and deep understanding of the Flash compilation process. This capability prevented costly course rebuilds.\n\nInternational coordination \u2014 Debugging SCORM deployment across 5 countries on a global LMS instance required clear technical communication with stakeholders who had varying levels of SCORM expertise.",
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The SCORM API wrapper used across HSBC courseware contained a hardcoded exit value that conflicted with SuccessFactors' completion detection logic. Because the failure was silent \u2014 no console errors, no visible indication \u2014 it had persisted undetected across multiple LMS migrations. Flash content recovery was necessitated by vendor project handoffs that did not include source files.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "SCORM completion tracking restored across affected courses. HSBC LMS team approved updated courseware. Flash source recovered and preserved for future maintenance. International localization issues resolved. Engagement spanned nearly a decade across five countries.\n\nBy the numbers: 560+ documented interactions, 25 HSBC contacts across 5 countries, 7+ year engagement (2015\u20132022).",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['eLearning Protocols', 'SCORM 1.2, SCORM 2004, AICC, xAPI (Tin Can), cmi.core.exit debugging, LMS API integration'],
          ['LMS Platforms', 'SAP SuccessFactors (global instance), SumTotal, multi-region LMS deployment'],
          ['Forensic Recovery', 'Flash/SWF decompilation, ActionScript source extraction, timeline data recovery, asset extraction from compiled binaries'],
          ['Development', 'JavaScript, HTML5, Vue.js application development, responsive design'],
          ['Accessibility & Compliance', 'WCAG 2.1, Section 508, financial services compliance standards, security/credential management (IDAM training)'],
          ['International Coordination', 'Multi-region deployment (US, UK, Mexico, India, Philippines), localization debugging'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Global Banking'],
          ['Duration', '7 years'],
          ['Personnel Involved', '25 individuals'],
          ['Evidence Trail', '560 emails analyzed'],
          ['Related', 'Exhibit G (SunTrust AWARE Platform), Exhibit I (TD Bank Accessibility), Exhibit A (Electric Boat LMS Integration)'],
        ],
      },
    ],
    impactTags: ['SCORM Forensics', 'Global Banking', 'Flash Recovery', 'SAP SuccessFactors', 'Security/Compliance', 'International Deployment', '5 Countries'],
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
        body: "SunTrust Bank (now Truist Financial, formed from the SunTrust/BB&T merger in 2019) required a specialized compliance and onboarding training platform for external learners \u2014 individuals who were not SunTrust employees but required bank-certified training to conduct business with the institution.\n\nThe AWARE platform could not use SunTrust's standard internal LMS infrastructure. External learners operated outside the corporate network and identity management systems, yet required the same rigorous compliance tracking and completion verification as internal staff. This created a unique architectural challenge: deliver SCORM-based courseware through a proprietary web application without a traditional Learning Management System.\n\nThe solution required building a custom integration layer that would translate between SCORM courseware (Lectora, Adobe Captivate) and SunTrust's proprietary web service API \u2014 replacing the entire LMS stack with a purpose-built wrapper that handled status tracking, score reporting, and bookmark/state persistence through direct API calls.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Lead Technical Engineer (integration architecture)', 'GP Strategies'],
          ['SunTrust Developer', 'API and backend development', 'SunTrust (now Truist)'],
          ['Project Manager/Account Lead', 'SunTrust account management and engagement coordination', 'GP Strategies'],
          ['Director of Learning Technologies', 'Technical leadership and oversight', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'The Integration Challenge',
        body: "Standard SCORM courseware expects to communicate with an LMS through the SCORM API adapter (JavaScript runtime). The LMS tracks learner progress, stores scores, manages bookmarks, and handles completion status. Removing the LMS from this equation meant rebuilding that entire communication layer.\n\nThe custom SCORM-to-API wrapper needed to: Intercept SCORM Runtime Calls \u2014 Capture LMSInitialize, LMSSetValue, LMSGetValue, LMSCommit, and LMSFinish calls from Lectora/Captivate courseware. Translate to REST API \u2014 Convert SCORM data model elements to SunTrust's proprietary web service endpoints. Persist State \u2014 Handle cross-session resume functionality using SunTrust's backend storage rather than LMS session management. Cross-Computer Resume \u2014 Enable learners to start training on one machine and resume on another, requiring server-side state management instead of local browser storage. Fallback Mechanism \u2014 Implement cookie-based fallback for scenarios where API connectivity was degraded. Browser Expansion \u2014 Support modern browsers (Chrome, Firefox) in addition to legacy IE8/IE10 requirements.",
      },
      {
        type: 'text',
        heading: 'Security and Trust',
        body: "The integration required such deep access to SunTrust's systems that Dan was issued a dedicated SunTrust laptop and employee credentials (Daniel.A.Novak@SunTrust.com) \u2014 extraordinary measures for an external contractor. This level of trust reflected both the sensitivity of the banking institution's systems and the confidence in Dan's ability to operate within those constraints responsibly.",
      },
      {
        type: 'text',
        heading: 'Technical Approach',
        body: "Dan scoped a 66-hour integration lifecycle covering the full development process. The approach built on GP Strategies' existing SCORM-to-AICC wrapper technology, adapted for SunTrust's proprietary REST API.\n\nFive-Phase Integration Lifecycle: (1) API Development Consultation \u2014 Work directly with SunTrust's backend developer during API design phase to ensure endpoints could handle SCORM data model requirements. (2) API Definition Agreement \u2014 Formalize endpoint contracts, authentication mechanisms, error handling protocols, and data format specifications. (3) Direct API Testing (Fiddler) \u2014 Use HTTP debugging tools to test raw API calls independent of courseware. (4) SCORM Call Monitoring \u2014 Instrument Lectora lessons to capture actual SCORM runtime behavior. (5) Wrapper Adaptation \u2014 Modify GP's existing SCORM-to-AICC bridge to route calls through SunTrust's API.\n\nDuring the scoping phase, Dan raised critical questions that directly influenced the final architecture: cross-computer resume requirements that mandated server-side state storage, security implications of exposing training data through web services, and the need for proper dev/test/prod environment separation.",
      },
      {
        type: 'text',
        heading: 'Evidence Analysis',
        body: "The client's immediate follow-up requesting pricing (\"Do you have a figure?\") indicates the quality of the technical analysis built sufficient confidence to move directly to implementation. This response pattern \u2014 reading a technical investigation document and immediately asking for a quote rather than requesting clarification \u2014 signals that the documentation was clear, actionable, and trustworthy enough to justify budget allocation.\n\nIn client-facing technical work, the ability to translate complex integration challenges into business-ready recommendations is what converts technical expertise into revenue. The SunTrust response demonstrates that Dan's documentation achieved that conversion.",
      },
      {
        type: 'text',
        heading: 'Significance',
        body: "This engagement demonstrates several key capabilities: Architectural Leadership \u2014 Dan shaped the API definition through consultation, identified security and cross-computer resume implications before development began, and scoped the full 66-hour integration lifecycle. Deep Client Trust \u2014 SunTrust issued employee credentials and a dedicated laptop \u2014 extraordinary measures for an external contractor working with a banking institution's internal systems. Technology Adaptation \u2014 Rather than building from scratch, Dan adapted GP's existing SCORM-to-AICC wrapper technology for SunTrust's proprietary REST API. Multi-Year Engagement Stability \u2014 133 emails spanning 2015\u20132018 indicate sustained involvement and ongoing value delivery.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['eLearning Standards', 'SCORM 1.2 (JavaScript API adapter, data model mapping), AICC (reference implementation for HTTP-based patterns)'],
          ['Custom Integration', 'SCORM-to-API translation layer, REST API client, authentication, state persistence'],
          ['Courseware Authoring', 'Lectora (SCORM output analysis), Adobe Captivate (compatibility testing)'],
          ['Development & Debugging', 'JavaScript (custom wrapper), Fiddler (HTTP traffic analysis, API endpoint testing), browser DevTools'],
          ['Browser Compatibility', 'Internet Explorer 8, Internet Explorer 10, Chrome, Firefox'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Banking / Financial Services'],
          ['Duration', '3 years'],
          ['Personnel Involved', '5 individuals'],
          ['Evidence Trail', '133 emails analyzed'],
          ['Outcome', "Architected custom SCORM-to-API wrapper bypassing traditional LMS. Issued SunTrust employee credentials reflecting extraordinary client trust."],
          ['Related', 'Exhibit F (HSBC Global Banking), Exhibit A (Electric Boat LMS Integration)'],
        ],
      },
    ],
    impactTags: ['Client-Facing', 'SunTrust', 'Technical Writing', 'Forensic Analysis', 'Custom Integration Architecture', 'SCORM-to-API Wrapper', 'API Design Consultation', 'Enterprise Security'],
    exhibitLink: '/exhibits/exhibit-g',
  },
  {
    label: 'Exhibit H',
    client: 'Internal \u2014 Cross-Functional',
    date: 'October 2019',
    title: 'Metal Additive Manufacturing Course: Rapid Diagnosis',
    quotes: [
      {
        text: 'Kudos on finding this solution so promptly!',
        attribution: 'GP Strategies',
      },
      {
        text: 'Agreed. Thank you so much. This email was a huge relief.',
        attribution: 'GP Strategies',
      },
      {
        text: 'Yes, thank you all so very much for your time and diligence on this effort!! Please share this resolution with any other appropriate parties.',
        attribution: 'GP Strategies',
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
        body: "Root cause identified and fix deployed within the same business day. Three independent expressions of relief and gratitude indicate the pressure the team was under and the quality of the resolution. The word \"relief\" from one team member is particularly telling \u2014 it reveals the weight of the situation before the fix was found.\n\nThe directive to \"share this resolution with any other appropriate parties\" and \"close the loop\" indicates this was not a minor issue but one with visibility across multiple stakeholder groups. The issue was isolated to the LMS configuration layer rather than the courseware itself, which meant the fix could be applied without republishing the course content \u2014 a critical distinction under time pressure.",
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Advanced Manufacturing'],
          ['Duration', 'Same-day resolution'],
          ['Personnel Involved', '4 individuals'],
          ['Evidence Trail', '15 emails analyzed'],
          ['Related', 'Exhibit A (Electric Boat), Exhibit F (HSBC), Exhibit J (GM Course Completion)'],
        ],
      },
    ],
    impactTags: ['Rapid Resolution', 'LMS Troubleshooting', 'SCORM Completion', '3 Independent Testimonials', 'Cross-Functional'],
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
        body: "Dan Novak's accessibility practice evolved organically through client engagements rather than a top-down directive. The practice originated with HSBC's Simple Learning courses, where accessibility requirements first surfaced in the context of compliance eLearning. As GP Strategies' banking portfolio expanded, the methodology matured through accessibility testing for PNC Bank and TD Bank Articulate Storyline courses \u2014 interactive content that demanded testing protocols beyond anything standard resources provided.\n\nThe TD Bank engagement (2022\u20132024) represented the practice at full maturity. TD MIC (Mutual Investment Counsellor) training courses required WCAG 2.1 and Section 508 compliance testing for Articulate Storyline content. Dan executed the entire accessibility evaluation independently, applying the methodology refined across prior banking engagements.\n\nThe initiative peaked in 2022 with 479 accessibility-related emails out of 4,173 total professional correspondence \u2014 reflecting the scale of the practice Dan built across multiple banking clients.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Organization'],
        rows: [
          ['Dan Novak', 'Most experienced accessibility evaluator on the team; forensic-level Storyline debugging, ARIA patterns, screen reader workarounds', 'GP Strategies'],
          ['2 Additional Testers', 'GP Accessibility Testing Team for TD MIC', 'GP Strategies'],
          ['Senior Learning PM', 'TD MIC project coordination and program oversight', 'GP Strategies'],
        ],
      },
      {
        type: 'text',
        heading: 'The Standards Gap',
        body: "The core challenge Dan solved: \"How do you test something with no standard?\"\n\nInteractive eLearning content \u2014 particularly Articulate Storyline courses with custom navigation, gamification, and dynamic state management \u2014 exhibited non-deterministic screen reader behavior. Unlike static web content, where WCAG guidelines provide clear success criteria, interactive courseware lacked established testing protocols.\n\nExisting accessibility resources (WebAIM, The A11Y Project) provided foundational knowledge for static HTML but offered no guidance for testing screen reader interactions with authoring tool output, branching scenarios, or custom JavaScript-driven navigation patterns. The industry gap was not in standards themselves (WCAG 2.1 / Section 508) but in applying those standards to complex interactive content.",
      },
      {
        type: 'text',
        heading: "GP's Formal Practice",
        body: "GP had developed formal accessibility reporting templates and confirmation statement formats before TD MIC began \u2014 a structured framework for delivering accessibility evaluations to banking clients. Dan had contributed to establishing these practices across the broader banking accessibility engagement portfolio. For TD MIC, this framework provided the reporting and triage structure: accessibility confirmation statement templates, issue triage categories (critical / major / minor) aligned with WCAG conformance levels, and remediation recommendation documentation translating technical WCAG violations into actionable instructional design guidance.",
      },
      {
        type: 'text',
        heading: 'What Dan Brought from HSBC and PNC',
        body: "The formal framework handled structure and reporting. What it couldn't provide was forensic depth:\n\nARIA Patterns and Practices \u2014 Understanding how ARIA roles, states, and properties behave in screen readers, and how Articulate Storyline's HTML output maps (and frequently fails to map) to those patterns.\n\nForensic Storyline Debugging \u2014 The ability to diagnose not just that a screen reader interaction was failing, but why \u2014 tracing failures to specific Storyline output patterns, JavaScript-driven state changes, or focus management gaps.\n\nScreen Reader Workarounds \u2014 Accumulated knowledge of what actually makes screen readers behave gracefully with authored courseware, including Storyline-specific implementation fixes not documented anywhere in WCAG or the ARIA spec.",
      },
      {
        type: 'text',
        heading: 'Testing Protocol',
        body: "Keyboard navigation testing across all interactive elements (tab order, focus management, keyboard traps). Screen reader compatibility verification (JAWS and NVDA) with focus on announcement clarity and navigation logic. Cross-browser testing to identify browser-specific ARIA implementation inconsistencies. Sprint-based workflow integration (SCRUM: TD MIC meetings) to align accessibility verification with development cycles.\n\nThe methodology was refined through deployment across four major banking clients: HSBC (origin), PNC Bank, TD Bank, and UOB.",
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
          ['Remediation guidance', 'Specific Articulate Storyline implementation guidance for each identified issue'],
        ],
      },
      {
        type: 'text',
        heading: 'Significance',
        body: "Dan did not simply test for accessibility compliance \u2014 he built the testing practice through successive client engagements. The challenge was methodological: creating a repeatable, scalable protocol for evaluating non-deterministic screen reader behavior in interactive eLearning where no industry standards existed.\n\nFor financial institutions, WCAG compliance is not optional \u2014 it is a legal and regulatory requirement. Dan's methodology directly impacted TD Bank's regulatory compliance posture and provided GP Strategies with a competitive differentiator in the enterprise learning market.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "Contributed to GP Strategies' WCAG 2.1 AA evaluation methodology as the most experienced accessibility evaluator on the TD Bank engagement. Recognition from Senior Learning PM: \"Thank you for all your amazing work!\" (August 2022). Methodology subsequently applied across four major banking clients (HSBC, PNC Bank, TD Bank, UOB).\n\nThe 479 accessibility emails in 2022 (11.5% of annual correspondence) reflect sustained execution, not a one-time deliverable.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Accessibility Standards', 'WCAG 2.1 (Level A and AA), Section 508, ARIA Authoring Practices'],
          ['Screen Readers', 'JAWS (Job Access With Speech), NVDA (NonVisual Desktop Access)'],
          ['eLearning Authoring', 'Articulate Storyline (HTML output analysis, ARIA patterns, custom navigation)'],
          ['Testing Methodology', 'Keyboard navigation, cross-browser ARIA testing, issue triage (critical/major/minor), sprint integration (SCRUM)'],
          ['Banking Clients', 'TD Bank, HSBC, PNC Bank, UOB (4 major financial institutions)'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Banking / Financial Services'],
          ['Duration', '2 years'],
          ['Personnel Involved', '5 individuals'],
          ['Evidence Trail', '479 accessibility emails analyzed (2022)'],
          ['Related', 'Exhibit F (HSBC Global Banking), Exhibit G (SunTrust AWARE Platform)'],
        ],
      },
    ],
    impactTags: ['Methodology Creation', 'TD Bank', 'WCAG 2.1', 'Accessibility', 'ARIA Authoring Practices', 'JAWS/NVDA', 'Articulate Storyline', 'Multi-Client Deployment', '479 Emails (2022)'],
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
        body: "General Motors reported that 19% of launched lessons were not being marked completed or passed \u2014 nearly four times their historical baseline of ~5%. The spike coincided with a migration to a new LMS platform six months prior. Completion of training had direct financial impact on GM dealerships, making this a high-priority investigation.\n\nWith over 10,000 courses in the library, reviewing every course was impractical. The team relied on data reports to identify candidate courses for analysis. GM's initial framing assumed a tracking bug. The investigation was designed to test that assumption \u2014 and look deeper if the evidence pointed elsewhere.",
      },
      {
        type: 'text',
        heading: 'Investigation Methodology',
        body: "A small team was assembled to conduct a multi-angle forensic investigation modeled on air crash investigation methodology \u2014 the same approach the NTSB uses when an aircraft goes down. The core principle: never blame the user first \u2014 investigate the system design. Three independent investigation tracks ran in parallel, each examining the problem from a different angle:\n\nAngle 1 \u2014 Technical Forensics: Fiddler network traces and browser debugging to analyze course-to-LMS communication at the protocol level.\n\nAngle 2 \u2014 UX Analysis: Course navigation and completion flow review to identify design patterns that could mislead users.\n\nAngle 3 \u2014 User Research: Interviews with actual GM sales reps to understand real-world usage patterns and environmental conditions.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Name', 'Title', 'Role'],
        rows: [
          ['Investigation Lead', 'Director, GP Strategies', 'Project authorization, stakeholder management, investigation oversight'],
          ['Dan Novak', 'Senior Learning Technologist', 'Technical forensics: Fiddler traces, browser debugging, code analysis, architecture review'],
          ['Data Analyst / UX Researcher', 'GP Strategies', 'Data analysis, UX evaluation, user interviews, behavioral research'],
        ],
      },
      {
        type: 'timeline',
        heading: 'Sequence of Events',
        entries: [
          {
            date: 'Initial Report',
            heading: 'Anomalous Completion Rates Flagged',
            body: 'GM reports ~19% of launched lessons not being marked completed \u2014 nearly 4x the historical baseline of ~5%. Investigation authorized.',
          },
          {
            date: 'Initial Review',
            heading: 'Root Cause Not Found',
            body: 'An initial investigation is conducted but cannot identify the root cause. The problem persists and escalates.',
          },
          {
            date: 'Team Assignment',
            heading: 'Dedicated Investigation Team Assembled',
            body: 'The director assembles a dedicated team: Dan Novak for technical forensics, and a data analyst for UX evaluation and user research.',
          },
          {
            date: 'Milestone',
            heading: 'Technical Forensics \u2014 Architecture Vulnerability Discovered',
            body: "Dan uses Fiddler and browser debugging to trace course-to-LMS communication. Discovers that the LMS holds all course state in memory cache and only persists to the database via form submit when the course closes properly. No periodic auto-save. No graceful degradation for connection loss.",
          },
          {
            date: 'Milestone',
            heading: 'UX Analysis \u2014 "Congratulations You Failed" Discovery',
            body: "The team reviews courses built with the vendor's authoring tool. Courses display \"Congratulations! You're done!\" after the final assessment \u2014 but that isn't the last page. Users must navigate to one more slide to trigger SCORM completion. The UI actively misleads learners into closing before completion registers.",
          },
          {
            date: 'Milestone',
            heading: 'User Research Breakthrough \u2014 Mobile Workforce Discovery',
            body: 'Interviews with actual GM sales reps reveal the critical insight: they are always on the road, working on poor WiFi, taking training in short bursts between customer meetings \u2014 not the hour-long desktop sessions the system was designed for. This reframes the entire investigation.',
          },
          {
            date: 'Synthesis',
            heading: 'Five Concurrent Failures Identified',
            body: "All investigation tracks converge: fragile architecture, misleading UX, confusing navigation, mobile usage patterns, and poor connectivity align to produce a \"perfect storm\" \u2014 a systemic mismatch between how the system was designed and how people actually work.",
          },
        ],
      },
      {
        type: 'table',
        heading: 'Findings \u2014 Five Concurrent Systemic Failures (Swiss Cheese Model)',
        columns: ['Finding', 'Description'],
        rows: [
          ['Memory cache vulnerability', 'The LMS held all course state in memory cache. Only saved to database via form submit when the course closed properly. No auto-save, no graceful degradation. Browser crash, tab close, or connection drop = all progress lost.'],
          ['"Congratulations You Failed" UX', "Courses displayed a completion message after the final assessment \u2014 but that wasn't the last page. Users had to navigate to one more slide to trigger SCORM completion. The UI actively misled learners into closing before completion registered."],
          ['Confusing navigation', "The vendor's authoring tool produced courses with unintuitive navigation controls. Even expert users with deep courseware experience struggled to use the interface \u2014 average GM sales reps with no eLearning background had no chance."],
          ['Mobile workforce / poor WiFi', "GM sales reps were always on the road, working on intermittent WiFi connections. The system had no recovery mechanism for connection drops, making every session a gamble."],
          ['Short-burst usage pattern', 'System was designed for hour-long desktop sessions. Actual users took training in 5-minute bursts between customer meetings. Each improper close triggered the cache vulnerability, dumping all progress.'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The investigation determined that the root cause was not a single tracking bug but a systemic mismatch between how the platform was designed and how people actually worked. Five concurrent failures aligned in a Swiss cheese model: fragile memory-cache architecture with no auto-save (F-01), a completion UI that actively misled users (F-02), navigation so confusing that even experts struggled (F-03), a mobile workforce on unreliable WiFi (F-04), and a short-burst usage pattern that triggered the cache vulnerability repeatedly (F-05).\n\nNo single failure would have caused a 4x degradation in completion rates. Together, they created a \"perfect storm\" where the system design set users up to fail \u2014 then the metrics blamed the users for failing.",
      },
      {
        type: 'text',
        heading: 'Outcome & Validation',
        body: "The comprehensive report was delivered documenting all findings. Not all stakeholders agreed with the technical assessment \u2014 the memory cache vulnerability couldn't be conclusively reproduced in a controlled environment. Dan documented this uncertainty honestly, presenting evidence-based hypotheses while acknowledging what couldn't be proven.\n\nYears later, GM abandoned the platform entirely and migrated to SAP SuccessFactors. The systemic architecture and UX failures identified in this investigation would not follow to a properly designed platform \u2014 a mere tracking bug would have. The platform migration itself served as indirect validation of the findings.",
      },
      {
        type: 'text',
        heading: 'What This Demonstrated',
        body: "This exhibit showcases forensic methodology and systems thinking \u2014 not debugging skill. The distinction matters. A debugger would have searched for the tracking bug GM assumed existed. This investigation ran three independent tracks in parallel (technical forensics, UX analysis, user research), synthesized findings across disciplines, and identified a systemic mismatch that no single track could have found alone. Intellectual honesty under organizational pressure \u2014 documenting what couldn't be conclusively proven alongside what could \u2014 is central to the approach.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['LMS Platform', 'PeopleSoft-based Enterprise LMS, memory cache architecture, form-based state persistence'],
          ['Authoring Tools', 'Third-party vendor authoring platform (custom navigation, assessment flows, completion triggers)'],
          ['Forensic Analysis', 'Fiddler (HTTP traffic capture, course-to-LMS communication tracing), browser DevTools'],
          ['Investigation Methodology', 'NTSB air crash investigation model, Swiss cheese model, multi-angle forensic investigation, systems thinking'],
          ['UX Research', 'Course navigation analysis, user interviews (GM sales reps), mobile usage pattern discovery, WiFi connectivity assessment'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Automotive / Dealership Training'],
          ['Duration', '6 months'],
          ['Personnel Involved', '3 individuals'],
          ['Evidence Trail', '25 emails analyzed'],
          ['Outcome', 'Conducted NTSB-style investigation identifying 5 concurrent systemic failures causing 4x spike in course incompletion. Validated years later when GM migrated to SAP SuccessFactors.'],
          ['Related', 'Exhibit H (Metal Additive Manufacturing), Exhibit A (Electric Boat), Exhibit F (HSBC)'],
        ],
      },
    ],
    impactTags: ['NTSB Methodology', 'Systems Thinking', 'Forensic Analysis', 'User Research', 'Swiss Cheese Model', '4x Completion Spike', 'General Motors'],
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
        body: "The core challenge: pure prompt engineering cannot reliably enforce deterministic state. A declarative agent can be told \"track which lessons the user has completed,\" but LLMs are probabilistic \u2014 they approximate, hallucinate, and lose context across conversation boundaries. For a training application, this is catastrophic:\n\nProgress tracking must be deterministic, not approximate. Course sequence must be enforced, not suggested. Assessment scores must be persisted, not remembered. State must survive across conversation boundaries.\n\nDeclarative agents and topic-based conversation design alone couldn't solve this. The LLM was being asked to serve as both the interface and the data store \u2014 a fundamental architectural mistake.",
      },
      {
        type: 'table',
        heading: 'Hybrid Architecture Implementation',
        columns: ['Component', 'Approach', 'Rationale'],
        rows: [
          ['Course catalog', 'Structured JSON', 'Deterministic course structure, sequence, and metadata. No hallucination risk for course content or ordering.'],
          ['Progress tracking', 'JSON state object', 'Persists across conversation boundaries. Exact completion status, not LLM approximation.'],
          ['Navigation', 'Adaptive Cards', 'Structured UI buttons enforce valid navigation paths. Users can\'t accidentally skip or repeat lessons.'],
          ['Assessments', 'Adaptive Cards + scoring', 'Deterministic scoring with structured answer validation. No LLM interpretation of whether an answer is "close enough."'],
          ['Content delivery', 'Copilot Studio topic flow', 'AI code interpreter transforms structured content into natural conversation. The AI handles presentation; the data handles truth.'],
        ],
      },
      {
        type: 'text',
        heading: 'Key Insight',
        body: "\"The mistake is treating AI as the data store. AI is the interface to the data store.\"\n\nWhen you separate what needs to be deterministic (state, progress, scores) from what benefits from intelligence (content presentation, adaptive interaction, natural language), you get a system that's both smarter and more reliable than either approach alone.\n\nThis pattern isn't specific to training \u2014 any application requiring deterministic state management (onboarding flows, compliance workflows, sequential processes) benefits from the same separation of concerns.",
      },
      {
        type: 'text',
        heading: 'Architectural Pattern',
        body: "The hybrid AI/structured-data pattern separated three tiers: Deterministic Operations (JSON) \u2014 Course catalog, progress tracking, assessment scoring, navigation paths. Anything requiring exact, repeatable results. Intelligence Operations (AI) \u2014 Content transformation, natural language interaction, adaptive response generation. Where LLM capabilities add value without risking data integrity. Orchestration Layer (Copilot Studio) \u2014 Topic flows enforce conversation guardrails, prevent LLM drift, and ensure users can't accidentally skip required content.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "Functional proof of concept delivered in ~4 weeks \u2014 from zero Copilot Studio experience to a working hybrid agent that resolved the reliability and deterministic behavior challenges of the original declarative approach. The proof of concept was in active development when the engagement concluded.\n\nThe architecture pattern demonstrated a reusable principle: hybrid AI/structured-data beats pure LLM for stateful workflows.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Microsoft AI Platform', 'Microsoft Copilot Studio (topic-based conversation design, AI code interpreter), Azure OpenAI Service, Microsoft Teams'],
          ['Data Architecture', 'Structured JSON (course catalog, progress tracking, state persistence), deterministic state management'],
          ['User Interface', 'Adaptive Cards (navigation UI, assessment forms, structured learner interactions)'],
          ['AI Integration', 'Hybrid AI/structured-data architecture, LLM guardrails (topic flow constraints, deterministic navigation enforcement)'],
          ['Microsoft History', '10-year relationship: Windows 10 eLearning, SCORM integration, accessibility initiative'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Technology / Enterprise Software'],
          ['Duration', '~4 weeks (POC)'],
          ['Personnel Involved', '5 individuals'],
          ['Outcome', 'Functional POC demonstrating hybrid AI/structured-data architecture for reliable stateful training workflows'],
        ],
      },
    ],
    impactTags: ['Zero to POC in ~4 Weeks', 'Copilot Studio', 'AI Architecture', 'Hybrid AI/Structured Data', '10-Year Relationship', 'Adaptive Cards', 'Deterministic State'],
    exhibitLink: '/exhibits/exhibit-k',
    isDetailExhibit: true,
    investigationReport: true,
  },
  {
    label: 'Exhibit L',
    client: 'Enterprise Client (Confidential)',
    date: '2025',
    title: 'Power Platform: Forensic Architecture Audit',
    contextHeading: 'Investigation Summary',
    contextText: 'An enterprise ERP modernization on Microsoft Power Platform where institutional knowledge was lost through organizational transitions. AI-assisted forensic analysis exposed five foundational gaps: no data model, no version control, monolithic architecture, atomized requirements without context, and no decomposed user stories. The diagnosis was the deliverable.',
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: "An enterprise organization initiated an ERP modernization effort on Microsoft Power Platform. Through organizational transitions, institutional knowledge was lost and the project's original architectural vision became disconnected from its execution.\n\nAn external Power Platform consultancy had been brought in to architect the solution. They produced high-level requirements documents and recommended that experienced Power Platform developers were essential to succeed. That recommendation was not followed. Domain expertise left the project, and development continued without architectural review or adherence to Microsoft best practices.\n\nDan was brought in as development lead on a module with no prior Power Platform experience \u2014 only 28 years of software engineering instincts that mapped poorly to the platform's conventions. Power Platform operates on its own paradigms: no one-to-one relationships in Dataverse, business logic implemented through plugins and Power Automate flows rather than database triggers and well-factored schemas, PowerFX as the formula language \u2014 closer to Excel than to a programming language, and notoriously difficult to refactor or debug.\n\nThat distinction \u2014 between \"this platform is genuinely strange\" and \"this project is genuinely broken\" \u2014 took a year to develop.",
      },
      {
        type: 'text',
        heading: 'The Learning Curve',
        body: "Over the following year, Dan taught himself Power Platform by building on it under production conditions \u2014 no overlap with the original architects, no onboarding, no documentation of design intent. He was constantly aware that something felt wrong, but lacked the platform fluency to articulate it or trust his own instincts. Early in the learning curve, that uncertainty cuts both ways: experienced engineers know enough to recognize the smell of bad architecture, but not yet enough to distinguish inherent platform constraints from avoidable project decisions. Every friction point was data. Every deployment problem narrowed the gap.\n\nThe deployment experience was where ambiguity collapsed into certainty. Tasked with deploying his module to a test environment, Dan discovered there was no established process \u2014 no source control, no deployment pipeline, no clean solution boundary. He had to manually identify dependencies, reconstruct a deployable solution from scratch, and navigate a monolithic architecture that had never been designed for deployment by anyone other than its original author. A well-architected system doesn't make deployment feel like archaeology. By that point, he knew enough to know the difference.",
      },
      {
        type: 'table',
        heading: 'Personnel',
        columns: ['Role', 'Involvement'],
        rows: [
          ['Dan Novak \u2014 Development Lead', 'Brought in to build model-driven apps on Power Platform with no prior platform experience. Spent a year teaching himself the platform under production conditions, identifying foundational gaps through accumulated firsthand friction, and ultimately conducting AI-assisted forensic analysis to document and deliver the architectural findings.'],
          ['External Power Platform Consultancy', 'Original architects. Produced high-level requirements and recommended experienced Power Platform developers. Left the project before development began.'],
          ['Lead Developer (anonymized)', 'Primary developer on the existing Power Platform solution. Maintained solution exports as the sole versioning mechanism.'],
          ['Governance Architect (anonymized)', 'Recipient of the findings deliverable. Responsible for architectural oversight across the organization.'],
        ],
      },
      {
        type: 'flow',
        heading: 'The Requirements Degradation Chain',
        body: "Requirements degraded through multiple format conversions, each losing fidelity. By the time requirements reached Azure DevOps, individual tickets looked actionable but had lost all architectural context. Each conversion lost fidelity. High-level summaries were treated as actionable work items when they were all epic-level at best. No decomposition into user stories with acceptance criteria ever happened. The requirements looked like a backlog but functioned as a wish list.",
        steps: [
          { label: 'PowerPoint', detail: 'Vendor decks \u2014 visual, contextual, rationale included' },
          { label: 'Word', detail: 'Document conversion \u2014 rationale stripped, context reduced to summaries' },
          { label: 'Excel', detail: 'Spreadsheet conversion \u2014 structure lost, items decontextualized' },
          { label: 'Azure DevOps', detail: 'CSV import \u2014 atomic tasks with no connecting narrative or user intent' },
        ],
      },
      {
        type: 'text',
        heading: 'Forensic Methodology',
        body: "The AI-assisted analysis came last, not first \u2014 and it only became possible once Dan knew enough to use it.\n\nFor most of the year, the problem had no clean shape. There was persistent friction, a constant low-level sense that the foundation was wrong, but not enough platform fluency to distinguish inherent Power Platform constraints from avoidable architectural failures. This is the uncomfortable middle of any steep learning curve: enough experience to recognize that something is wrong, not enough to prove it \u2014 even to yourself.\n\nThe AI analysis resolved that. Once Dan had sufficient platform knowledge to frame the right questions, he used GitHub Spec Kit to generate a baseline from his understanding of what the applications should do, then compared that baseline against the project's reality. What came back wasn't a surprise \u2014 it was confirmation.\n\nThis is an important distinction: the AI didn't find the problems. A year of platform immersion found the problems. The AI transformed hard-won frustration into a defensible deliverable \u2014 and gave Dan the external confirmation needed to trust what his engineering instincts had been signaling all along.\n\nThe findings were confirmed through convergence: practical deployment pain experienced firsthand, Microsoft documentation comparison showing platform best practices absent from the project, and AI-assisted analysis providing systematic gap enumeration. Three independent methods, same five findings.",
      },
      {
        type: 'table',
        heading: 'Findings \u2014 Five Foundational Gaps',
        columns: ['Finding', 'Severity', 'Description'],
        rows: [
          ['No data model', 'Critical', 'No fully defined data model existed. Dataverse tables were being created ad hoc during development without a schema design phase. Entity relationships, data types, and constraints were improvised.'],
          ['No version control', 'Critical', 'No git, no source control of any kind. The only method of versioning was solution exports kept by the lead developer. No rollback capability, no change tracking, no collaborative development safety net.'],
          ['Monolithic solution architecture', 'High', 'One large solution for the entire system instead of a modular core with separate solutions per model-driven app. Deployment required manually identifying dependencies and copying components to a new fresh solution.'],
          ['Requirements atomization without context', 'High', 'Requirements degraded through PPT \u2192 Word \u2192 Excel \u2192 ADO conversion chain. Individual tickets looked actionable but had lost architectural context. Epic-level summaries treated as stories.'],
          ['No decomposed user stories', 'High', 'No user stories with acceptance criteria. No definition of done. No way to verify whether built features matched business intent.'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The project did not fail because of Power Platform's limitations. Power Platform is designed for citizen developer tools, departmental apps, and lightweight automation. The project failed because enterprise-scale architectural practices were never applied.\n\nThe domain experts were removed. Requirements were never decomposed. Architecture was never reviewed against Microsoft best practices. The result was a system being built at enterprise scale with citizen-developer methodology \u2014 tool misuse, not a tool problem.\n\nThe diagnosis was the deliverable. Dan could have kept building, but his instinct was to step back and verify the foundation first. The AI-assisted analysis confirmed what engineering intuition suspected: the problems were not in the code, they were in the architecture that the code was being built on.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "Findings were shared with management and the governance architect via a documented deliverable \u2014 a private repo containing findings, prompts, and annotated analysis. This case demonstrates how forensic engineering methodology, augmented by AI-assisted analysis, can surface foundational gaps early \u2014 before they become production failures. The earlier these methods are applied, the more costly the problems they prevent.\n\nThe analysis provided the governance team with the first complete picture of the system's technical debt.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Microsoft Power Platform', 'Power Apps (model-driven, canvas), Dataverse (table structure, entity relationships), Power Automate, Power Platform Solutions'],
          ['Development Practices', 'Solution architecture (monolithic vs modular core), version control (git, source control best practices), Azure DevOps'],
          ['AI-Assisted Analysis', 'GitHub Spec Kit (AI-assisted requirements analysis, baseline generation, gap detection), convergence validation'],
          ['Forensic Methodology', 'Architecture audit protocols, gap analysis, Microsoft best practices comparison'],
          ['Requirements Engineering', 'Requirement degradation chain analysis, user story decomposition, epic vs story-level distinction'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Enterprise'],
          ['Duration', '1 year'],
          ['Personnel Involved', '4 individuals'],
          ['Outcome', 'Five foundational gaps identified through convergent evidence. Findings delivered to governance architect as documented repository with prompts and annotated analysis.'],
        ],
      },
    ],
    impactTags: ['Forensic Diagnosis', 'Power Platform', 'AI-Assisted Analysis', 'Architecture Audit', 'Diagnosis as Deliverable', '5 Foundational Gaps', 'GitHub Spec Kit'],
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
        body: 'Test cycles dropped from hours to minutes for targeted scenarios. Some adoption occurred informally. The tool was never formally deployed team-wide due to the non-billable tooling constraint. The approach \u2014 separating SCORM session state from course navigation \u2014 anticipates the debug-state capabilities that commercial testing tools would later address.',
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Learning & Development'],
          ['Duration', '~1 year'],
          ['Personnel Involved', '2 individuals'],
          ['Outcome', 'Reduced targeted QA test cycles from hours to minutes through TASBot-inspired SCORM state capture and restore'],
        ],
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
        heading: 'Scope Challenge',
        body: "Dan's central challenge was a multi-tenant rebranding through Material UI's largely undocumented theming system \u2014 initially scoped as one week, it expanded to several months as deeply interrelated style dependencies revealed themselves. But the architectural signal is more significant: Dan recognized this federated facade pattern because he'd invented his own version as CSBB Dispatch in 2011. Different authors, same pattern. In 2011, it was EasyXDM bridging SCORM content servers; in 2024, it was React/GraphQL bridging enterprise backend services.",
      },
      {
        type: 'text',
        heading: 'Outcome',
        body: "Delivered theming updates, bug fixes, Cognito authentication resolution, and Watershed LRS debugging. The Cognito issue \u2014 open for months before the engagement \u2014 was resolved as part of the cross-system investigation. Pattern recognition from CSBB Dispatch provided architectural context that accelerated diagnosis.",
      },
      {
        type: 'table',
        heading: 'Technologies',
        columns: ['Category', 'Technologies & Tools'],
        rows: [
          ['Frontend', 'React, Material UI, GraphQL'],
          ['Backend Systems', 'Rustici Content Controller, PeopleFluent LMS, Watershed LRS, Amazon Cognito'],
          ['Architecture', 'Federated facade pattern, cross-system state management, multi-tenant theming'],
          ['Debugging', 'GraphQL query tracing, xAPI statement debugging, Cognito authentication flow analysis'],
        ],
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'Energy / Enterprise Learning'],
          ['Duration', 'Several months'],
          ['Outcome', 'Delivered theming, bug fixes, Cognito resolution, and Watershed debugging for federated learning platform'],
          ['Related', 'Exhibit E (CSBB Dispatch), Exhibit O (ContentAIQ Integration Thread)'],
        ],
      },
    ],
    impactTags: ['Rustici Content Controller', 'React/GraphQL', 'Federated Integration', 'Pattern Recognition', 'Material UI', 'Amazon Cognito', 'Cross-System Debugging'],
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
        body: "Three concurrent GP Strategies projects \u2014 BP Learning Platform, AICPA Bridge Adapter, and ContentAIQ \u2014 unified by a single thread: integration expertise across system boundaries. The progression demonstrates 13 years of pattern recognition from CSBB Dispatch (2011) through modern multitenant SaaS AI product architecture.\n\nThe thread connecting all three projects is integration expertise \u2014 making multiple systems work together, whether that's SCORM content servers, LMS platforms, AirTable data, or AI agents. This thread naturally led to AI product work because AI products are fundamentally integration challenges: the frontend surfaces capabilities generated by backend AI pipelines, requiring the same cross-system coordination and debugging skills honed on traditional integrations.",
      },
      {
        type: 'text',
        heading: 'BP Learning Platform \u2014 Federated Facade',
        body: "React/GraphQL facade over four backend systems (Rustici Content Controller, PeopleFluent LMS, Watershed LRS, Amazon Cognito). Dan's central challenge was a multi-tenant rebranding through Material UI's largely undocumented theming system \u2014 initially scoped as one week, it expanded to several months as deeply interrelated style dependencies revealed themselves.\n\nThe architectural signal is more significant: Dan recognized this federated facade pattern because he'd invented his own version as CSBB Dispatch in 2011. Different authors, same pattern. In 2011, it was EasyXDM bridging SCORM content servers; in 2024, it was React/GraphQL bridging enterprise backend services. (Full details in Exhibit N.)",
      },
      {
        type: 'text',
        heading: 'AICPA Bridge Adapter \u2014 Webhook Sync Pipeline',
        body: "A Node.js plugin syncing curriculum and registration data between AirTable (AICPA's source of truth) and Bridge LMS (course delivery platform), using webhooks to trigger sync operations and PostgreSQL to track state across subaccounts.\n\nData flow: AirTable fires webhook \u2192 Node.js receives webhook and pulls full record via AirTable API \u2192 PostgreSQL tracks sync state \u2192 Node.js builds and executes Bridge REST API calls to create/update curricula, courses, enrollments. The PostgreSQL layer compensates for the Bridge API's inability to track what's been synced where per subaccount.\n\nDan was one of two developers supporting the original senior engineer who built the integration \u2014 inherited code stewardship as a team. He served as an L3 escalation point when complex failures escalated through support tiers, and worked on the React/Material UI admin dashboard component.",
      },
      {
        type: 'text',
        heading: 'ContentAIQ \u2014 AI Product Frontend',
        body: "ContentAIQ is GP Strategies' AI-powered learning content creation platform \u2014 a cloud-based, multitenant SaaS product that generates course outlines, scripts, assessments, metadata, and gamification elements using AI agents with built-in instructional design expertise.\n\nDan was one of several frontend developers in the engineering group building the UX: implementing new React components and pages from Adobe XD designs, modifying UX flows across the multitenant architecture. The technical architecture is a Turborepo monorepo built with Next.js, React, TypeScript, and Tailwind CSS, deployed on Azure.\n\nDesign translation challenge: UX was designed by a graphic artist using Adobe XD (not a UX/interaction designer), which created translation challenges from static layouts to interactive components. The designs often didn't account for interactive states, responsive behavior, or component reusability \u2014 the engineering team had to translate visual mockups into pragmatic React implementations.\n\nProduct stage: Early-stage product in pilot program with select clients. UX in heavy flux, designs changing frequently, rapid iteration toward production.",
      },
      {
        type: 'table',
        heading: 'Findings',
        columns: ['Finding', 'Description'],
        rows: [
          ['Pattern recognition', 'Same architectural pattern across contexts: CSBB Dispatch (2011) \u2192 BP Learning Platform (2024) \u2014 federated integration layers making multiple systems behave as one. Dan recognized the 2024 version because he\'d built his own in 2011'],
          ['Organic evolution', "Integration expertise naturally leading to AI product work \u2014 not deliberate career planning, but organic evolution where the skill thread was real"],
          ['Inherited code stewardship', 'AICPA Bridge Adapter demonstrated the ability to step into complex codebases built by others, becoming an L3 escalation point \u2014 system co-ownership without original authorship'],
          ['Design-to-code pragmatism', 'ContentAIQ required translating Adobe XD mockups from a graphic artist into interactive React components, navigating the gap between static visual design and functional UI implementation'],
          ['Cross-system debugging', 'All three projects required tracing issues across system boundaries: GraphQL \u2192 backend services, webhook \u2192 database \u2192 REST API, frontend \u2192 AI pipeline'],
        ],
      },
      {
        type: 'table',
        heading: 'Technologies Across Three Projects',
        columns: ['Project', 'Frontend', 'Backend / Integration'],
        rows: [
          ['BP Learning Platform', 'React, Material UI', 'GraphQL, Rustici, PeopleFluent, Watershed, Cognito'],
          ['AICPA Bridge', 'React, Material UI (admin dashboard)', 'Node.js, PostgreSQL, AirTable API, Bridge LMS REST API, Webhooks'],
          ['ContentAIQ', 'Next.js, React, TypeScript, Tailwind CSS', 'Azure, AI/LLM integration, Turborepo monorepo, multitenant SaaS'],
        ],
      },
      {
        type: 'text',
        heading: 'Probable Cause',
        body: "The thread connecting BP Learning Platform, AICPA Bridge Adapter, and ContentAIQ is integration expertise \u2014 the ability to make multiple systems work together as a coherent whole. Whether that's SCORM content servers and LMS platforms, AirTable data and Bridge LMS, or AI agents and frontend interfaces, the underlying challenge is the same: coordinating across boundaries, debugging failures that span systems, and building layers that unify disparate components.\n\nThe progression wasn't deliberate career planning \u2014 these were assignments from the same employer, not a pre-planned trajectory. But the skill thread was real, and pattern recognition mattered: Dan recognized the BP Learning Platform's federated facade because he'd built his own version a decade earlier. The same patterns, expressed in increasingly sophisticated contexts.",
      },
      {
        type: 'text',
        heading: 'Pattern Recognition',
        body: "The integration thread runs from CSBB Dispatch (2011) \u2014 a custom cross-domain dispatch layer \u2014 through three 2024 projects that solve the same boundary-crossing problem using commercial ecosystems and modern tooling. The architectural insight is identical: federated systems require a coordination layer, and the coordination layer is where the complexity lives.",
      },
      {
        type: 'table',
        heading: 'Engagement Metadata',
        columns: ['Field', 'Value'],
        rows: [
          ['Industry', 'eLearning / EdTech / AI'],
          ['Duration', '6 months'],
          ['Outcome', 'Contributed to ContentAIQ AI product frontend. Recognized integration pattern thread across 13 years from CSBB Dispatch to modern federated systems.'],
          ['Related', 'Exhibit N (BP Learning Platform), Exhibit E (CSBB Dispatch)'],
        ],
      },
    ],
    impactTags: ['AI Product Frontend', 'Multitenant Architecture', 'Design Translation', 'Integration Patterns', 'Pattern Recognition', 'Cross-System Coordination', 'Federated Systems'],
    exhibitLink: '/exhibits/exhibit-o',
    isDetailExhibit: true,
    investigationReport: false,
  },
]
