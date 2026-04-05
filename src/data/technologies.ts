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
        summary: 'Primary language across full career. SCORM runtime APIs, cross-browser debugging, modern ES6+ features, Vue.js component architecture, Node.js tooling. Daily driver for 20+ years. jQuery era to modern frameworks.',
        dateRange: '1998–present',
        tags: [
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'Exelon', title: 'Exelon Corporation' },
          { label: 'AEP', title: 'American Electric Power' },
        ],
      },
      {
        name: 'HTML/CSS',
        level: 'deep',
        summary: 'Semantic HTML5, WCAG AA-compliant accessibility implementation, responsive design, CSS Grid/Flexbox, custom properties, dark mode theming. Production sites pass WAVE/axe validation.',
        dateRange: '1998–present',
        tags: [
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Entergy', title: 'Entergy Corporation' },
        ],
      },
      {
        name: 'Node.js',
        level: 'deep',
        summary: 'Build pipelines, SCORM package assembly, CLI tooling, server-side generation. npm ecosystem expertise. Used across website generation, data processing, and development tooling.',
        dateRange: '~2015–present',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Vue.js',
        level: 'deep',
        summary: 'Preferred framework. Component architecture, state management, reactive data binding. Production experience with complex review apps and data visualization interfaces.',
        dateRange: '~2018–present',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'React',
        level: 'working',
        summary: 'Production work on BP, AICPA, and ContentAIQ projects. Component development, hooks, state management. No greenfield project experience, but solid contributor on existing codebases.',
        dateRange: '2022–2025',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'TypeScript',
        level: 'working',
        summary: 'Type-safe JavaScript for larger projects. Interface definitions, generics, strict type checking. Growing usage in modern tooling and applications.',
        dateRange: '2022–present',
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
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
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
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'SQL',
        level: 'deep',
        summary: 'SQL Server, Oracle, and other relational databases. Complex queries, performance optimization, stored procedures, indexing strategies. Production experience across multiple DB platforms.',
        dateRange: '~2000–present',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'JSON',
        level: 'deep',
        summary: 'Core data format for configs, APIs, and data exchange. Deep understanding of schema design, validation, and transformation patterns.',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'XML',
        level: 'deep',
        summary: 'SCORM manifests (imsmanifest.xml), AICC HACP packets, legacy data formats. Schema validation, transformation, and debugging.',
        dateRange: '2009–2020',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Regular Expressions',
        level: 'deep',
        summary: 'Diagnostic power tool for SCORM debugging, data extraction, and text processing. Complex pattern matching, capture groups, lookaheads.',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'REST APIs',
        level: 'working',
        summary: 'API design, integration, and debugging. HTTP methods, status codes, authentication patterns. Production work with LMS and platform APIs.',
        dateRange: '2010–present',
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
        summary: 'Full suite expertise: Power Automate flows, Power Apps (canvas and model-driven), governance and administration. Enterprise-scale deployments.',
        dateRange: '2024–2025',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Copilot Studio',
        level: 'deep',
        summary: 'From one deep project with Teams integration. Bot design, conversation flows, knowledge base integration. Enterprise chatbot deployment.',
        dateRange: '2024',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Dataverse',
        level: 'working',
        summary: 'Part of Power Platform ecosystem. Data modeling, relationships, security roles. Used for app backend storage and integration.',
        dateRange: '2025',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
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
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Exelon', title: 'Exelon Corporation' },
        ],
      },
      {
        name: 'SCORM Cloud',
        level: 'deep',
        summary: 'Primary diagnostic platform for eLearning content validation. Reference implementation testing, conformance verification, cross-LMS comparison.',
        dateRange: '2011–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Exelon', title: 'Exelon Corporation' },
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
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
    ],
  },
  {
    id: 'platforms-devops',
    title: 'Platforms & DevOps',
    cards: [
      {
        name: 'Git/GitHub',
        level: 'working',
        summary: 'Active daily use. Branching strategies, PR workflows, conflict resolution, commit history management. GitHub Actions for CI/CD.',
        dateRange: '~2000–present',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Azure DevOps',
        level: 'working',
        summary: 'Work item tracking, source control, build pipeline coordination. Team collaboration on enterprise projects.',
        dateRange: '2020–2025',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Docker',
        level: 'working',
        summary: 'Running containers, docker-compose orchestration, Dockerfile creation. Development environment standardization.',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'SharePoint',
        level: 'working',
        summary: 'Collaboration platform administration, document library management, workflow automation. Enterprise content management.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
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
        level: 'aware',
        summary: 'Cloud platform exposure through project work. Familiar with S3, EC2, and basic deployment patterns.',
        dateRange: '2020–2025',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Microsoft HUP', title: 'Microsoft (HUP Program)' },
        ],
      },
      {
        name: 'Apache',
        level: 'aware',
        summary: 'Web server configuration and troubleshooting. .htaccess rules, virtual hosts, SSL setup.',
        dateRange: '2010–2019',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Oracle',
        level: 'aware',
        summary: 'Underlying platform for several LMS systems. Familiar with Oracle SQL and PL/SQL patterns, but not deep database administration.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
    ],
  },
  {
    id: 'practices',
    title: 'Practices & Competencies',
    cards: [
      {
        name: 'WCAG/Accessibility',
        level: 'working',
        summary: 'WCAG AA compliance implementation. Semantic HTML, ARIA labels, keyboard navigation, screen reader testing. Current site passes WAVE/axe validation.',
        dateRange: '2021–present',
      },
      {
        name: 'Technical Writing',
        level: 'working',
        summary: 'Extensive documentation experience. Technical specifications, troubleshooting guides, API documentation, process documentation.',
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
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'Exelon', title: 'Exelon Corporation' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
        ],
      },
      {
        name: 'AICC',
        level: 'deep',
        summary: 'Deep understanding of HACP protocol. Led Chrome 80 SameSite cookie impact analysis. Key advisor on AICC-to-SCORM migration strategies.',
        dateRange: '2009–2022',
        tags: [
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Exelon', title: 'Exelon Corporation' },
        ],
      },
      {
        name: 'xAPI (Tin Can)',
        level: 'working',
        summary: 'Next-generation learning standard. Evaluated for VR/non-traditional learning environments. Statement design, LRS integration patterns.',
        dateRange: '2015–present',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'GPiLEARN',
        level: 'deep',
        summary: 'Custom SCORM-to-AICC wrapper platform. Deep involvement in architecture, troubleshooting, and client implementations.',
        dateRange: '2009–2020',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Cornerstone OnDemand',
        level: 'deep',
        summary: 'SCORM/AICC integration expert. Deep knowledge of platform APIs, content import workflows, and troubleshooting common issues.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'SuccessFactors',
        level: 'deep',
        summary: 'SAP SuccessFactors Learning (including legacy Plateau). Platform configuration, content integration, SCORM troubleshooting.',
        dateRange: '2012–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Saba/SumTotal',
        level: 'aware',
        summary: 'Exposure to platform through client projects. Familiar with content integration patterns.',
        dateRange: '2009–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Articulate Storyline',
        level: 'deep',
        summary: 'Package internals, JavaScript customization, SCORM implementation details. Storyline 1, 2, 3, 360, and legacy Articulate \'09. Troubleshooting expert.',
        dateRange: '2009–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'MetLife', title: 'MetLife, Inc.' },
        ],
      },
      {
        name: 'Adobe Captivate',
        level: 'working',
        summary: 'SCORM completion tracking, quiz results processing, package structure analysis. Troubleshooting and customization work.',
        dateRange: '2009–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Xyleme',
        level: 'working',
        summary: 'Content lifecycle management through GPiLEARN. XML-based content authoring, publishing workflows.',
        dateRange: '2010–2020',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Exelon', title: 'Exelon Corporation' },
        ],
      },
      {
        name: 'Ready2Role',
        level: 'deep',
        summary: 'LCMS platform maintained at deep level. Custom development, system administration, client support. Early career through recent years.',
        dateRange: '2009–2019',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'QuickBase',
        level: 'working',
        summary: 'Low-code database platform. Custom applications, workflow automation, reporting. Production use for project tracking and data management.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
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
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'Entergy', title: 'Entergy Corporation' },
        ],
      },
      {
        name: 'XAML',
        level: 'working',
        summary: 'Microsoft UI markup language from earlier era. WPF and Silverlight experience.',
        dateRange: '2009–2016',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
      {
        name: 'Java',
        level: 'aware',
        summary: 'Exposure through Java-based LMS platform work. Familiar with J2EE patterns and deployment.',
        dateRange: '2010–2022',
        tags: [
          { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
          { label: 'BMS', title: 'Bristol-Myers Squibb' },
          { label: 'Nalco', title: 'Nalco (Ecolab)' },
          { label: 'AEP', title: 'American Electric Power' },
          { label: 'NASA', title: 'NASA' },
        ],
      },
    ],
  },
]
