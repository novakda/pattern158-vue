<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import HeroMinimal from '@/components/HeroMinimal.vue'

useSeo({
  title: 'Technologies | Pattern 158 - Dan Novak',
  description: 'Technology expertise spanning 28+ years — from legacy system rescue to modern AI implementation.',
  path: '/technologies',
})
</script>

<template>
  <div class="page-technologies">
    <HeroMinimal title="Technologies" subtitle="Production-proven expertise across modern engineering and eLearning systems">
      <p class="hero-intro">Curated expertise spanning modern software development and deep domain knowledge in
        eLearning platforms. Each technology below reflects real production work—not aspirational skills. Proficiency
        levels (Deep/Working/Aware) are honest self-assessments based on actual engagement depth, not marketing speak.
        Project counts and client tags come from verified email archive data.</p>
    </HeroMinimal>
    <main id="main-content" aria-label="Main content">

    <!-- TECHNOLOGIES_PAGE_START -->
    <!-- Hero Section -->


    <section class="tech-category" aria-labelledby="languages-frameworks-heading">
      <div class="container">

        <h2 id="languages-frameworks-heading">Languages &amp; Frameworks</h2>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">JavaScript</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Primary language across full career. SCORM runtime APIs, cross-browser debugging,
              modern ES6+ features, Vue.js component architecture, Node.js tooling. Daily driver for 20+ years. jQuery
              era to modern frameworks.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">HTML/CSS</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Semantic HTML5, WCAG AA-compliant accessibility implementation, responsive design,
              CSS Grid/Flexbox, custom properties, dark mode theming. Production sites pass WAVE/axe validation.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Entergy Corporation">Entergy</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Node.js</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Build pipelines, SCORM package assembly, CLI tooling, server-side generation. npm
              ecosystem expertise. Used across website generation, data processing, and development tooling.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Vue.js</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Preferred framework. Component architecture, state management, reactive data
              binding. Production experience with complex review apps and data visualization interfaces.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">React</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Production work on BP, AICPA, and ContentAIQ projects. Component development, hooks,
              state management. No greenfield project experience, but solid contributor on existing codebases.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">TypeScript</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Type-safe JavaScript for larger projects. Interface definitions, generics, strict
              type checking. Growing usage in modern tooling and applications.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Python</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Data pipelines, DB operations, website generators, CLI tools. sqlite3, Click
              framework, structured data processing. Current project's primary scripting language.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Bash/Shell</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">WSL2/Linux daily use. Build automation, git workflows, system administration.
              Comfortable with piping, regex, and common Unix utilities.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">C#/.NET</h3>
              <span class="expertise-badge badge-aware">Aware</span>
            </div>
            <p class="tech-summary">Exposure through platform work and legacy system integration. Familiar with .NET
              ecosystem and ASP.NET patterns.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="data-apis-heading">
      <div class="container">

        <h2 id="data-apis-heading">Data &amp; APIs</h2>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SQLite</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Extensive deep work on relational schema design, complex joins, migration patterns,
              data integrity constraints. Current project uses SQLite as the primary data store with 6,600+ records.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SQL</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">SQL Server, Oracle, and other relational databases. Complex queries, performance
              optimization, stored procedures, indexing strategies. Production experience across multiple DB platforms.
            </p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">JSON</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Core data format for configs, APIs, and data exchange. Deep understanding of schema
              design, validation, and transformation patterns.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">XML</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">SCORM manifests (imsmanifest.xml), AICC HACP packets, legacy data formats. Schema
              validation, transformation, and debugging.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Regular Expressions</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Diagnostic power tool for SCORM debugging, data extraction, and text processing.
              Complex pattern matching, capture groups, lookaheads.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">REST APIs</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">API design, integration, and debugging. HTTP methods, status codes, authentication
              patterns. Production work with LMS and platform APIs.</p>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="ai-automation-heading">
      <div class="container">

        <h2 id="ai-automation-heading">AI &amp; Automation</h2>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Claude Code</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Primary AI development tool. Full project execution with Claude: architecture,
              implementation, testing, documentation. Current project built 95% with AI assistance.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">GitHub Copilot</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Supplementary AI tool for inline code completions and boilerplate generation. Used
              alongside Claude Code for complementary strengths.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Power Platform</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Full suite expertise: Power Automate flows, Power Apps (canvas and model-driven),
              governance and administration. Enterprise-scale deployments.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Copilot Studio</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">From one deep project with Teams integration. Bot design, conversation flows,
              knowledge base integration. Enterprise chatbot deployment.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Dataverse</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Part of Power Platform ecosystem. Data modeling, relationships, security roles. Used
              for app backend storage and integration.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="diagnostic-analysis-heading">
      <div class="container">

        <h2 id="diagnostic-analysis-heading">Diagnostic &amp; Analysis</h2>

        <p class="category-intro">Forensic debugging mindset—not just tools, but methodology for solving complex
          technical issues.</p>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Fiddler</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">HTTP traffic analysis, API debugging, performance profiling. Essential tool for
              SCORM/AICC communication diagnostics. Deep expertise in request/response inspection and manipulation.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SCORM Cloud</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Primary diagnostic platform for eLearning content validation. Reference
              implementation testing, conformance verification, cross-LMS comparison.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Chrome DevTools</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Core diagnostic tool. Network panel, console debugging, Elements inspector,
              Performance profiling, Application storage. Daily debugging workflow.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Postman</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">API testing and exploration. Request building, environment variables, test
              scripting. Used for LMS API integration work.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="platforms-devops-heading">
      <div class="container">

        <h2 id="platforms-devops-heading">Platforms &amp; DevOps</h2>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Git/GitHub</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Active daily use. Branching strategies, PR workflows, conflict resolution, commit
              history management. GitHub Actions for CI/CD.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Azure DevOps</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Work item tracking, source control, build pipeline coordination. Team collaboration
              on enterprise projects.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Docker</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Running containers, docker-compose orchestration, Dockerfile creation. Development
              environment standardization.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SharePoint</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Collaboration platform administration, document library management, workflow
              automation. Enterprise content management.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Linux</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">WSL2 daily use, command-line fluency, system administration basics, shell scripting,
              package management.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">npm</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Package management ecosystem. Dependency management, script automation, version
              resolution, package.json configuration.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">AWS</h3>
              <span class="expertise-badge badge-aware">Aware</span>
            </div>
            <p class="tech-summary">Cloud platform exposure through project work. Familiar with S3, EC2, and basic
              deployment patterns.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Microsoft (HUP Program)">Microsoft HUP</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Apache</h3>
              <span class="expertise-badge badge-aware">Aware</span>
            </div>
            <p class="tech-summary">Web server configuration and troubleshooting. .htaccess rules, virtual hosts, SSL
              setup.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Oracle</h3>
              <span class="expertise-badge badge-aware">Aware</span>
            </div>
            <p class="tech-summary">Underlying platform for several LMS systems. Familiar with Oracle SQL and PL/SQL
              patterns, but not deep database administration.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="practices-heading">
      <div class="container">

        <h2 id="practices-heading">Practices &amp; Competencies</h2>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">WCAG/Accessibility</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">WCAG AA compliance implementation. Semantic HTML, ARIA labels, keyboard navigation,
              screen reader testing. Current site passes WAVE/axe validation.</p>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Technical Writing</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Extensive documentation experience. Technical specifications, troubleshooting
              guides, API documentation, process documentation.</p>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category" aria-labelledby="elearning-domain-heading">
      <div class="container">

        <h2 id="elearning-domain-heading">eLearning Domain Expertise</h2>

        <p class="category-intro">20+ years deep in eLearning standards, platforms, and authoring tools. This domain
          knowledge differentiates from general web development.</p>

        <div class="tech-cards">

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SCORM</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Primary technical authority on SCORM 1.2 and 2004. API implementation, manifest
              construction, sequencing and navigation, cross-platform troubleshooting. Recognized expert.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="PNC Financial Services">PNC</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">AICC</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Deep understanding of HACP protocol. Led Chrome 80 SameSite cookie impact analysis.
              Key advisor on AICC-to-SCORM migration strategies.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">xAPI (Tin Can)</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Next-generation learning standard. Evaluated for VR/non-traditional learning
              environments. Statement design, LRS integration patterns.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">GPiLEARN</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Custom SCORM-to-AICC wrapper platform. Deep involvement in architecture,
              troubleshooting, and client implementations.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Cornerstone OnDemand</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">SCORM/AICC integration expert. Deep knowledge of platform APIs, content import
              workflows, and troubleshooting common issues.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">SuccessFactors</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">SAP SuccessFactors Learning (including legacy Plateau). Platform configuration,
              content integration, SCORM troubleshooting.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Saba/SumTotal</h3>
              <span class="expertise-badge badge-aware">Aware</span>
            </div>
            <p class="tech-summary">Exposure to platform through client projects. Familiar with content integration
              patterns.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Articulate Storyline</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">Package internals, JavaScript customization, SCORM implementation details. Storyline
              1, 2, 3, 360, and legacy Articulate '09. Troubleshooting expert.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="MetLife, Inc.">MetLife</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Adobe Captivate</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">SCORM completion tracking, quiz results processing, package structure analysis.
              Troubleshooting and customization work.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Xyleme</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Content lifecycle management through GPiLEARN. XML-based content authoring,
              publishing workflows.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="Exelon Corporation">Exelon</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">Ready2Role</h3>
              <span class="expertise-badge badge-deep">Deep</span>
            </div>
            <p class="tech-summary">LCMS platform maintained at deep level. Custom development, system administration,
              client support. Early career through recent years.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

          <div class="tech-card">
            <div class="tech-card-header">
              <h3 class="tech-name">QuickBase</h3>
              <span class="expertise-badge badge-working">Working</span>
            </div>
            <p class="tech-summary">Low-code database platform. Custom applications, workflow automation, reporting.
              Production use for project tracking and data management.</p>

            <p class="tech-data-line">2009–2022</p>

            <div class="tech-tags">

              <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

              <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

              <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

              <span class="impact-tag" title="American Electric Power">AEP</span>

              <span class="impact-tag" title="NASA">NASA</span>

            </div>

          </div>

        </div>

      </div>
    </section>

    <section class="tech-category tech-historical" aria-labelledby="historical-heading">
      <div class="container">

        <details>
          <summary>
            <h2 id="historical-heading">Historical Technologies</h2>
          </summary>

          <p class="category-intro">Technologies from earlier career phases, no longer in active use but part of the
            professional foundation.</p>

          <div class="tech-cards">

            <div class="tech-card">
              <div class="tech-card-header">
                <h3 class="tech-name">Flash/ActionScript</h3>
                <span class="expertise-badge badge-deep">Deep</span>
              </div>
              <p class="tech-summary">Led Flash-to-HTML5 transition projects. ActionScript debugging, Flash content
                package troubleshooting. Legacy platform expertise.</p>

              <p class="tech-data-line">2009–2022</p>

              <div class="tech-tags">

                <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

                <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

                <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

                <span class="impact-tag" title="American Electric Power">AEP</span>

                <span class="impact-tag" title="Entergy Corporation">Entergy</span>

              </div>

            </div>

            <div class="tech-card">
              <div class="tech-card-header">
                <h3 class="tech-name">XAML</h3>
                <span class="expertise-badge badge-working">Working</span>
              </div>
              <p class="tech-summary">Microsoft UI markup language from earlier era. WPF and Silverlight experience.</p>

              <p class="tech-data-line">2009–2022</p>

              <div class="tech-tags">

                <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

                <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

                <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

                <span class="impact-tag" title="American Electric Power">AEP</span>

                <span class="impact-tag" title="NASA">NASA</span>

              </div>

            </div>

            <div class="tech-card">
              <div class="tech-card-header">
                <h3 class="tech-name">Java</h3>
                <span class="expertise-badge badge-aware">Aware</span>
              </div>
              <p class="tech-summary">Exposure through Java-based LMS platform work. Familiar with J2EE patterns and
                deployment.</p>

              <p class="tech-data-line">2009–2022</p>

              <div class="tech-tags">

                <span class="impact-tag" title="Sikorsky Aircraft (Lockheed Martin)">Sikorsky</span>

                <span class="impact-tag" title="Bristol-Myers Squibb">BMS</span>

                <span class="impact-tag" title="Nalco (Ecolab)">Nalco</span>

                <span class="impact-tag" title="American Electric Power">AEP</span>

                <span class="impact-tag" title="NASA">NASA</span>

              </div>

            </div>

          </div>

        </details>

      </div>
    </section>

    <!-- TECHNOLOGIES_PAGE_END -->

    </main>
  </div>
</template>
