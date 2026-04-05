import type { Tag } from '@/components/TechTags.types'
import type { ExpertiseLevel } from '@/components/ExpertiseBadge.types'

export interface TechCardData {
  name: string
  level: ExpertiseLevel
  summary: string
  dateRange?: string
  tags?: Tag[]
}

export interface TechCategory {
  id: string
  title: string
  intro?: string
  historical?: boolean
  cards: TechCardData[]
}

export const technologies: TechCategory[] = [
  {
    id: 'languages-frameworks',
    title: 'Languages & Frameworks',
    cards: [
      {
        name: 'JavaScript',
        level: 'deep',
        summary: 'Primary language across full career. SCORM runtime APIs, cross-browser debugging, modern ES6+ features, Vue.js component architecture, Node.js tooling. Daily driver for 28 years. jQuery era to modern frameworks.',
        dateRange: '1998–present',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'Hilton', title: 'Hilton Hotels' },
          { label: 'Cigna', title: 'Cigna Healthcare' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
        ],
      },
      {
        name: 'HTML/CSS',
        level: 'deep',
        summary: 'Semantic HTML5, WCAG AA-compliant accessibility implementation, responsive design, CSS Grid/Flexbox, custom properties, dark mode theming. Production sites pass WAVE/axe validation.',
        dateRange: '1998–present',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'HSBC', title: 'HSBC' },
          { label: 'GDEB', title: 'General Dynamics Electric Boat' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'Entergy', title: 'Entergy Corporation' },
        ],
      },
      {
        name: 'Node.js',
        level: 'deep',
        summary: 'Build pipelines, SCORM package assembly, CLI tooling, server-side generation. npm ecosystem expertise. Used across website generation, data processing, and development tooling.',
        dateRange: '~2015–present',
        tags: [
          { label: 'GP Strategies', title: 'GP Strategies Corporation' },
        ],
      },
      {
        name: 'Vue.js',
        level: 'deep',
        summary: 'Preferred framework. Component architecture, state management, reactive data binding. Production experience with complex review apps and data visualization interfaces.',
        dateRange: '~2018–present',
        tags: [
          { label: 'GP Strategies', title: 'GP Strategies Corporation' },
          { label: 'HSBC', title: 'HSBC' },
        ],
      },
      {
        name: 'React',
        level: 'working',
        summary: 'Production experience across BP Learning Platform, ContentAIQ, and AICPA projects. Component development, hooks, state management, Material UI theming. Solid contributor with growing architectural ownership.',
        dateRange: '2022–2025',
        tags: [
          { label: 'BP', title: 'BP (British Petroleum)' },
          { label: 'AICPA', title: 'AICPA (American Institute of CPAs)' },
          { label: 'ContentAIQ', title: 'ContentAIQ' },
        ],
      },
      {
        name: 'TypeScript',
        level: 'deep',
        summary: 'Core production language for all modern projects. Full type system fluency: generics, discriminated unions, strict mode. BP Learning Platform, ContentAIQ, and portfolio site all TypeScript-first.',
        dateRange: '2022–present',
        tags: [
          { label: 'BP', title: 'BP (British Petroleum)' },
          { label: 'ContentAIQ', title: 'ContentAIQ' },
        ],
      },
      {
        name: 'Python',
        level: 'working',
        summary: 'Data pipelines, DB operations, website generators, CLI tools. sqlite3, Click framework, structured data processing. Current project\'s primary scripting language.',
      },
      {
        name: 'Bash/Shell',
        level: 'working',
        summary: 'WSL2/Linux daily use. Build automation, git workflows, system administration. Comfortable with piping, regex, and common Unix utilities.',
      },
      {
        name: 'C#/.NET',
        level: 'aware',
        summary: 'Exposure through platform work and legacy system integration. Familiar with .NET ecosystem and ASP.NET patterns.',
        dateRange: '2009–2016',
        tags: [
          { label: 'SunTrust', title: 'SunTrust Bank' },
          { label: 'GP Strategies', title: 'GP Strategies Corporation' },
        ],
      },
      {
        name: 'GraphQL',
        level: 'aware',
        summary: 'Exposure through BP Learning Platform, which uses Apollo Federation for its GraphQL API layer.',
        dateRange: '2022–2025',
        tags: [
          { label: 'BP', title: 'BP (British Petroleum)' },
        ],
      },
      {
        name: 'Material UI',
        level: 'working',
        summary: 'Component library used in BP Learning Platform. Theming, custom component composition, and responsive layout implementation in a production React codebase.',
        dateRange: '2022–2025',
        tags: [
          { label: 'BP', title: 'BP (British Petroleum)' },
        ],
      },
      {
        name: 'Tailwind CSS',
        level: 'working',
        summary: 'Utility-first CSS framework used in ContentAIQ project. Responsive design, custom configuration, and component styling in a production Next.js codebase.',
        dateRange: '2024–2025',
        tags: [
          { label: 'ContentAIQ', title: 'ContentAIQ' },
        ],
      },
      {
        name: 'Next.js',
        level: 'aware',
        summary: 'Application framework underlying the ContentAIQ project. Familiar with file-based routing, API routes, and server-side rendering patterns.',
        dateRange: '2024–2025',
        tags: [
          { label: 'ContentAIQ', title: 'ContentAIQ' },
        ],
      },
    ],
  },
  {
    id: 'data-apis',
    title: 'Data & APIs',
    cards: [
      {
        name: 'SQLite',
        level: 'deep',
        summary: 'Extensive deep work on relational schema design, complex joins, migration patterns, data integrity constraints. Current project uses SQLite as the primary data store with 6,600+ records.',
        dateRange: '2024–present',
      },
      {
        name: 'SQL',
        level: 'deep',
        summary: 'SQL Server, Oracle, and other relational databases. Complex queries, performance optimization, stored procedures, indexing strategies. Production experience across multiple DB platforms.',
        dateRange: '~2000–present',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'SunTrust', title: 'SunTrust Bank' },
          { label: 'GDEB', title: 'General Dynamics Electric Boat' },
        ],
      },
      {
        name: 'XML',
        level: 'deep',
        summary: 'SCORM manifests (imsmanifest.xml), AICC HACP packets, legacy data formats. Schema validation, transformation, and debugging.',
        dateRange: '2009–2020',
        tags: [
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Exelon', title: 'Exelon Corporation' },
        ],
      },
      {
        name: 'Regular Expressions',
        level: 'working',
        summary: 'Diagnostic tool for SCORM debugging, data extraction, and text processing. Complex pattern matching, capture groups, lookaheads across JavaScript, Python, and shell workflows.',
      },
      {
        name: 'REST APIs',
        level: 'deep',
        summary: 'API design, reverse-engineering, and integration across LMS and enterprise platforms. Xyleme LCMS API analysis, SunTrust platform API consultation, SCORM Cloud API automation, and Microsoft Graph API integration. HTTP debugging with Fiddler as a core diagnostic skill applied across client engagements.',
        dateRange: '2010–present',
        tags: [
          { label: 'SunTrust', title: 'SunTrust Bank' },
        ],
      },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    cards: [
      {
        name: 'Claude Code',
        level: 'deep',
        summary: 'Primary AI development tool. Full project execution with Claude: architecture, implementation, testing, documentation. Current project built 95% with AI assistance.',
      },
      {
        name: 'GitHub Copilot',
        level: 'working',
        summary: 'Supplementary AI tool for inline code completions and boilerplate generation. Used alongside Claude Code for complementary strengths.',
      },
      {
        name: 'Power Platform',
        level: 'deep',
        summary: 'Year-long production development on model-driven apps and Dataverse. Self-taught under production conditions with no onboarding. Developed sufficient platform fluency to conduct forensic architecture audit identifying 5 foundational gaps. Power Apps (model-driven, canvas), Dataverse, Power Automate, PowerFX, solution architecture.',
        dateRange: '2024–2025',
        tags: [
          { label: 'Microsoft', title: 'Microsoft (MCAPS)' },
          { label: 'Enterprise Client', title: 'Enterprise Client (Confidential)' },
        ],
      },
      {
        name: 'Copilot Studio',
        level: 'deep',
        summary: 'Designed hybrid AI/structured-data architecture for Microsoft training agent. Separated deterministic operations (JSON state) from intelligence operations (LLM). Zero to functional POC in ~4 weeks. Reusable pattern for stateful AI workflows.',
        dateRange: '2024',
        tags: [
          { label: 'Microsoft', title: 'Microsoft (MCAPS)' },
        ],
      },
      {
        name: 'Dataverse',
        level: 'working',
        summary: 'Production experience with table structure, entity relationships, and schema design patterns. Identified ad-hoc table creation and missing data model as critical architectural gaps during forensic audit.',
        dateRange: '2025',
        tags: [
          { label: 'Enterprise Client', title: 'Enterprise Client (Confidential)' },
        ],
      },
    ],
  },
  {
    id: 'diagnostic-analysis',
    title: 'Diagnostic & Analysis',
    intro: 'Forensic debugging mindset\u2014not just tools, but methodology for solving complex technical issues.',
    cards: [
      {
        name: 'Fiddler',
        level: 'deep',
        summary: 'HTTP traffic analysis, API debugging, performance profiling. Essential tool for SCORM/AICC communication diagnostics. Deep expertise in request/response inspection and manipulation.',
        dateRange: '2011–2022',
        tags: [
          { label: 'Exelon', title: 'Exelon Corporation' },
          { label: 'SunTrust', title: 'SunTrust Bank' },
          { label: 'Hilton', title: 'Hilton Hotels' },
          { label: 'GDEB', title: 'General Dynamics Electric Boat' },
          { label: 'AEP', title: 'American Electric Power' },
        ],
      },
      {
        name: 'SCORM Cloud',
        level: 'deep',
        summary: 'Primary diagnostic platform for eLearning content validation. Reference implementation testing, conformance verification, cross-LMS comparison.',
        dateRange: '2011–2022',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'Exelon', title: 'Exelon Corporation' },
          { label: 'HSBC', title: 'HSBC' },
        ],
      },
      {
        name: 'Chrome DevTools',
        level: 'deep',
        summary: 'Core diagnostic tool. Network panel, console debugging, Elements inspector, Performance profiling, Application storage. Daily debugging workflow.',
      },
      {
        name: 'Postman',
        level: 'working',
        summary: 'API testing and exploration. Request building, environment variables, test scripting. Used for LMS API integration work.',
      },
    ],
  },
  {
    id: 'platforms-devops',
    title: 'Platforms & DevOps',
    cards: [
      {
        name: 'Git/GitHub',
        level: 'deep',
        summary: 'Core workflow tool across entire career. Branching strategies, PR workflows, conflict resolution, and CI/CD with GitHub Actions. Current projects use advanced git workflows including worktrees and automated commit conventions. Over two decades of version-controlled shipping across every professional engagement.',
        dateRange: '~2000–present',
        tags: [
          { label: 'HSBC', title: 'HSBC' },
        ],
      },
      {
        name: 'Azure DevOps',
        level: 'working',
        summary: 'Work item tracking, source control, build pipeline coordination. Team collaboration on enterprise projects.',
        dateRange: '2020–2025',
        tags: [
          { label: 'GP Strategies', title: 'GP Strategies Corporation' },
        ],
      },
      {
        name: 'Docker',
        level: 'aware',
        summary: 'Development environment containerization. Running and configuring containers, basic docker-compose. Used for local development tooling.',
      },
      {
        name: 'SharePoint',
        level: 'working',
        summary: 'Collaboration platform administration, document library management, workflow automation. Enterprise content management.',
        dateRange: '2010–2022',
      },
      {
        name: 'Linux',
        level: 'working',
        summary: 'WSL2 daily use, command-line fluency, system administration basics, shell scripting, package management.',
      },
      {
        name: 'npm',
        level: 'working',
        summary: 'Package management ecosystem. Dependency management, script automation, version resolution, package.json configuration.',
      },
      {
        name: 'AWS',
        level: 'working',
        summary: 'Cloud platform for LMS and application hosting. S3 storage, EC2 instances, Cognito authentication (BP project). Infrastructure exposure across PNC, HSBC, and TD Bank client environments.',
        dateRange: '2020–2025',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'Microsoft HUP', title: 'Microsoft (HUP Program)' },
          { label: 'TD Bank', title: 'TD Bank' },
          { label: 'HSBC', title: 'HSBC' },
        ],
      },
      {
        name: 'Apache',
        level: 'aware',
        summary: 'Web server configuration and troubleshooting. .htaccess rules, virtual hosts, SSL setup.',
        dateRange: '2010–2019',
        tags: [
          { label: 'Hilton', title: 'Hilton Hotels' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'GP Strategies', title: 'GP Strategies Corporation' },
        ],
      },
      {
        name: 'Oracle',
        level: 'working',
        summary: 'Underlying database and LMS platform across several enterprise clients. Oracle SQL familiarity, PL/SQL patterns, Oracle iLearn/Saba administration. Platform-level troubleshooting, not deep DBA work.',
        dateRange: '2010–2022',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'HSBC', title: 'HSBC' },
          { label: 'UOB', title: 'United Overseas Bank' },
        ],
      },
      {
        name: 'Webpack',
        level: 'working',
        summary: 'Module bundler configured and maintained across multiple projects. Build pipeline setup, loader configuration, and optimization for production eLearning and web application builds.',
      },
      {
        name: 'Jira',
        level: 'working',
        summary: 'Daily project management and issue tracking tool across client engagements. Sprint planning, backlog management, and workflow configuration in enterprise environments.',
        dateRange: '2010–2025',
      },
    ],
  },
  {
    id: 'practices',
    title: 'Practices & Competencies',
    cards: [
      {
        name: 'WCAG/Accessibility',
        level: 'deep',
        summary: 'Developed enterprise accessibility testing methodology for interactive eLearning where no established standards existed. WCAG 2.1 AA and Section 508 compliance across 4 banking clients (PNC, HSBC, TD Bank, UOB). JAWS and NVDA screen reader testing, ARIA implementation, and reusable testing templates used as reference across subsequent client engagements.',
        dateRange: '2021–present',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'HSBC', title: 'HSBC' },
          { label: 'TD Bank', title: 'TD Bank' },
          { label: 'UOB', title: 'United Overseas Bank' },
        ],
      },
      {
        name: 'Technical Writing',
        level: 'deep',
        summary: 'Defining professional skill spanning entire career. 14 documented case studies, enterprise methodology documentation, API specifications, and troubleshooting guides. Career-long pattern of turning complex technical work into structured, reusable documentation that becomes organizational reference material.',
      },
    ],
  },
  {
    id: 'elearning-domain',
    title: 'eLearning Domain Expertise',
    intro: '20+ years deep in eLearning standards, platforms, and authoring tools. This domain knowledge differentiates from general web development.',
    cards: [
      {
        name: 'SCORM',
        level: 'deep',
        summary: 'Primary technical authority on SCORM 1.2 and 2004. API implementation, manifest construction, sequencing and navigation, cross-platform troubleshooting. Recognized expert.',
        dateRange: '2002–present',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'HSBC', title: 'HSBC' },
          { label: 'Cigna', title: 'Cigna Healthcare' },
          { label: 'UOB', title: 'United Overseas Bank' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
        ],
      },
      {
        name: 'AICC',
        level: 'deep',
        summary: 'Deep understanding of HACP protocol. Led Chrome 80 SameSite cookie impact analysis. Key advisor on AICC-to-SCORM migration strategies.',
        dateRange: '2009–2022',
        tags: [
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Exelon', title: 'Exelon Corporation' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'FPL', title: 'Florida Power & Light' },
        ],
      },
      {
        name: 'xAPI (Tin Can)',
        level: 'working',
        summary: 'Next-generation learning standard. Evaluated for VR/non-traditional learning environments. Statement design, LRS integration patterns.',
        dateRange: '2015–present',
      },
      {
        name: 'GPiLEARN',
        level: 'deep',
        summary: 'Custom SCORM-to-AICC wrapper platform. Deep involvement in architecture, troubleshooting, and client implementations.',
        dateRange: '2009–2020',
        tags: [
          { label: 'FPL', title: 'Florida Power & Light' },
          { label: 'Entergy', title: 'Entergy Corporation' },
          { label: 'NRG', title: 'NRG Energy' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
        ],
      },
      {
        name: 'Cornerstone OnDemand',
        level: 'deep',
        summary: 'SCORM/AICC integration expert. Deep knowledge of platform APIs, content import workflows, and troubleshooting common issues.',
        dateRange: '2010–2022',
        tags: [
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'GDEB', title: 'General Dynamics Electric Boat' },
          { label: 'NRG', title: 'NRG Energy' },
        ],
      },
      {
        name: 'SuccessFactors',
        level: 'deep',
        summary: 'SAP SuccessFactors Learning (including legacy Plateau). Platform configuration, content integration, SCORM troubleshooting.',
        dateRange: '2012–2022',
      },
      {
        name: 'Saba/SumTotal',
        level: 'working',
        summary: 'Platform integration and troubleshooting across multiple client deployments. Content upload workflows, SCORM compatibility testing, vendor coordination.',
        dateRange: '2009–2022',
      },
      {
        name: 'Articulate Storyline',
        level: 'deep',
        summary: 'Package internals, JavaScript customization, SCORM implementation details. Storyline 1, 2, 3, 360, and legacy Articulate \'09. Troubleshooting expert.',
        dateRange: '2009–2022',
        tags: [
          { label: 'HSBC', title: 'HSBC' },
          { label: 'PNC', title: 'PNC Financial Services' },
          { label: 'Cigna', title: 'Cigna Healthcare' },
          { label: 'MetLife', title: 'MetLife, Inc.' },
        ],
      },
      {
        name: 'Adobe Captivate',
        level: 'working',
        summary: 'SCORM completion tracking, quiz results processing, package structure analysis. Troubleshooting and customization work.',
        dateRange: '2009–2022',
      },
      {
        name: 'Xyleme',
        level: 'deep',
        summary: 'Deep platform expertise: API reverse-engineering, R2R-to-XML conversion pipelines, content mapping, LCMS evaluation. 280 project touchpoints across content authoring and publishing workflows. Exhibit G documents 1,216-lesson content operation using Xyleme pipeline automation.',
        dateRange: '2010–2020',
        tags: [
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Exelon', title: 'Exelon Corporation' },
        ],
      },
      {
        name: 'Ready2Role',
        level: 'deep',
        summary: 'LCMS platform maintained at deep level. Custom development, system administration, client support. Early career through recent years.',
        dateRange: '2009–2019',
        tags: [
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'Entergy', title: 'Entergy Corporation' },
        ],
      },
      {
        name: 'QuickBase',
        level: 'working',
        summary: 'Production applications for project tracking and data management across multiple clients. Custom app development, workflow automation, reporting dashboards.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Hilton', title: 'Hilton Hotels' },
          { label: 'BASF', title: 'BASF Corporation' },
          { label: 'FPL', title: 'Florida Power & Light' },
        ],
      },
      {
        name: 'Lectora',
        level: 'working',
        summary: 'eLearning authoring tool with significant project footprint. SCORM package troubleshooting, content customization, and cross-LMS compatibility testing across enterprise client deployments.',
        dateRange: '2009–2022',
      },
    ],
  },
  {
    id: 'historical',
    title: 'Historical Technologies',
    historical: true,
    intro: 'Technologies from earlier career phases, no longer in active use but part of the professional foundation.',
    cards: [
      {
        name: 'Flash/ActionScript',
        level: 'deep',
        summary: 'Led Flash-to-HTML5 transition projects. ActionScript debugging, Flash content package troubleshooting. Legacy platform expertise.',
        dateRange: '~2002–2020',
        tags: [
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Entergy', title: 'Entergy Corporation' },
        ],
      },
      {
        name: 'XAML',
        level: 'working',
        summary: 'Microsoft UI markup language from earlier era. WPF and Silverlight experience.',
        dateRange: '2009–2016',
      },
      {
        name: 'Java',
        level: 'aware',
        summary: 'Exposure through Java-based LMS platform work. Familiar with J2EE patterns and deployment.',
        dateRange: '2010–2022',
      },
      {
        name: 'EasyXDM',
        level: 'deep',
        summary: 'Cross-domain messaging library that was core to the CSBB Dispatch Framework (Exhibit E). Enabled secure iframe-to-parent communication for SCORM content delivery across domain boundaries. 197 career graph mentions reflecting central role in the GPiLEARN platform architecture.',
        dateRange: '~2009–2016',
        tags: [
          { label: 'FPL', title: 'Florida Power & Light' },
          { label: 'Entergy', title: 'Entergy Corporation' },
          { label: 'NRG', title: 'NRG Energy' },
        ],
      },
      {
        name: 'jQuery',
        level: 'working',
        summary: 'Foundational JavaScript library used extensively in pre-framework era. DOM manipulation, AJAX patterns, and plugin ecosystem across eLearning and enterprise web projects. Superseded by modern frameworks but 231 career graph mentions reflect its ubiquity in earlier work.',
        dateRange: '~2007–2018',
      },
    ],
  },
]
