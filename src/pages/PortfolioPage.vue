<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-portfolio')
useSeo({
  title: 'Portfolio | Pattern 158 - Dan Novak',
  description: '38 client engagements spanning 28 years of documented project work. Case studies and project investigations.',
  path: '/portfolio',
})
</script>

<template>
  <HeroMinimal
    title="Portfolio"
    subtitle="38 client engagements spanning 28 years of documented project work"
  />

  <!-- Positioning Narratives -->
  <section class="portfolio-narratives" aria-labelledby="narratives-heading">
    <div class="container">
      <h2 id="narratives-heading">Three Lenses</h2>
      <p class="section-subtitle">The same career, three ways to read it</p>

      <div class="narrative-cards">
        <div class="narrative-card">
          <h3>Enterprise Integration Architect</h3>
          <p>Complex multi-system integrations where nothing was designed to work together. Cross-domain SCORM dispatch, federated platform facades, protocol translation layers.</p>
          <span class="narrative-clients">GDEB &middot; HSBC &middot; GM &middot; Wells Fargo &middot; BP &middot; SunTrust</span>
        </div>
        <div class="narrative-card">
          <h3>AI-Driven Legacy Modernization</h3>
          <p>Forensic engineering amplified by AI tooling. Using LLMs to pressure-test analysis, generate baselines, and surface gaps that manual review misses.</p>
          <span class="narrative-clients">Microsoft MCAPS &middot; Power Platform &middot; GitHub Spec Kit &middot; Copilot Studio</span>
        </div>
        <div class="narrative-card">
          <h3>Learning Systems Expert</h3>
          <p>Deep eLearning standards knowledge &mdash; SCORM, xAPI, AICC at the protocol level. LMS architecture, accessibility methodology, cross-platform content delivery.</p>
          <span class="narrative-clients">Rustici integration &middot; SCORM Debugger &middot; CSBB Dispatch &middot; TD Bank a11y</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Engagements -->
  <section class="portfolio-flagships" aria-labelledby="flagships-heading">
    <div class="container">
      <h2 id="flagships-heading">Featured Engagements</h2>
      <p class="section-subtitle">Probable cause summaries — each links to full investigation report</p>

      <!-- 1. Electric Boat (Exhibit A) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">General Dynamics Electric Boat</h3>
          <span class="flagship-title">Exhibit A: Electric Boat LMS Integration</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2015&ndash;2022</span>
          <span class="email-badge">574 emails</span>
        </div>
        <p class="flagship-role">Cross-domain SCORM architecture, Flash remediation, 7-year embedded technical advisory</p>
        <p class="flagship-summary">Diagnosed and resolved cross-domain SCORM communication failures caused by Electric Boat's split LMS/content server architecture. Deployed custom SCORM wrapper using postMessage to bypass same-origin policy constraints, eliminating dependency on Cornerstone Network Player. Engagement evolved from a "quick win" troubleshooting request into a 7-year embedded advisory role spanning Flash remediation, Chrome 80 impact analysis, and SCORM 2004 extensions across 574 emails and 49 personnel.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">Cross-Domain</span>
          <span class="impact-tag">easyXDM</span>
          <span class="impact-tag">Cornerstone</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;Dan's technical expertise is tremendous&hellip; with his help, we were able to solve two large technical issues, one that will have a direct impact on the Flash conversion process and save a lot of time and money.&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-a" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 2. GM (Exhibit J) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">General Motors</h3>
          <span class="flagship-title">Exhibit J: Course Completion Investigation</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2015&ndash;2019</span>
          <span class="email-badge">618 emails</span>
        </div>
        <p class="flagship-role">NTSB-style forensic analysis — systems thinking over code debugging</p>
        <p class="flagship-summary">Investigated 19% course incompletion rate (4x baseline) initially framed as tracking bug. Multi-angle investigation revealed five concurrent systemic failures: memory cache vulnerability with no auto-save, "Congratulations You Failed" UX pattern, confusing navigation, mobile workforce on poor WiFi, and short-burst usage pattern conflicting with hour-long desktop design. Platform eventually abandoned — indirect validation of findings.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Forensic Analysis</span>
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">UX Research</span>
          <span class="impact-tag">Systems Thinking</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;I'm reviewing this now. Looks fantastic, great work.&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-j" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 3. Power Platform (Exhibit L) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">Enterprise Client (Confidential)</h3>
          <span class="flagship-title">Exhibit L: Power Platform Architecture Audit</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2025</span>
          <span class="email-badge">Recent engagement</span>
        </div>
        <p class="flagship-role">Forensic architecture audit using AI-assisted analysis — diagnosis as deliverable</p>
        <p class="flagship-summary">Diagnosed enterprise-scale architectural failures after vendor departure and knowledge loss. AI-assisted methodology (GitHub Spec Kit baseline + convergent validation) surfaced five critical gaps: no data model, no version control, monolithic solution architecture, requirements degradation chain, and no decomposed user stories. Tool misuse at scale — citizen-developer methodology applied to enterprise platform. Findings validated through convergence: practical pain + Microsoft docs + AI analysis.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Power Platform</span>
          <span class="impact-tag">AI-Assisted</span>
          <span class="impact-tag">Architecture Audit</span>
          <span class="impact-tag">Forensic Analysis</span>
        </div>
        <router-link to="/exhibits/exhibit-l" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 4. Microsoft MCAPS (Exhibit K) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">Microsoft</h3>
          <span class="flagship-title">Exhibit K: MCAPS AI Training Agent</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">Dec 2025&ndash;Jan 2026</span>
          <span class="email-badge">Recent engagement</span>
        </div>
        <p class="flagship-role">Hybrid AI architecture innovation — zero to POC in ~4 weeks</p>
        <p class="flagship-summary">Architectural breakthrough on Microsoft Copilot Studio project: structured data for state (JSON), AI for interaction (LLM). Pure prompt engineering cannot enforce deterministic state — LLMs are probabilistic. Solution: catalog/progress/scores in structured data (deterministic), AI transforms content and manages conversation (intelligence). Pattern applicable beyond training: any domain requiring both intelligence and reliability.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Copilot Studio</span>
          <span class="impact-tag">Hybrid AI</span>
          <span class="impact-tag">Architecture</span>
          <span class="impact-tag">Microsoft</span>
        </div>
        <router-link to="/exhibits/exhibit-k" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 5. GPiLEARN (Exhibit C) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">GP Strategies (Internal)</h3>
          <span class="flagship-title">Exhibit C: GPiLEARN Platform Engineering</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2011&ndash;2020</span>
          <span class="email-badge">2,554 emails</span>
        </div>
        <p class="flagship-role">Core platform developer — 9-year foundation work across power and energy sector</p>
        <p class="flagship-summary">Long-term technical architect for proprietary LMS platform serving energy utilities (BP, Calpine, FPL, Exelon, BASF). Custom content server (CSBB), SCORM-to-AICC wrapper development, course packaging automation. Reverse-engineered Xyleme publishing API using Fiddler network analysis, saved 600+ hours through batch automation. 2,554 emails document sustained platform engineering across hundreds of courses and client deployments.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Platform Engineering</span>
          <span class="impact-tag">SCORM/AICC</span>
          <span class="impact-tag">Automation</span>
          <span class="impact-tag">API Integration</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;We appreciate your information and troubleshooting help when problems occur.&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-c" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 6. CSBB Dispatch (Exhibit E) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">GP Strategies (Energy Sector)</h3>
          <span class="flagship-title">Exhibit E: CSBB Dispatch &mdash; Cross-Domain Content Delivery</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2011&ndash;2016+</span>
          <span class="email-badge">10+ years in production</span>
        </div>
        <p class="flagship-role">Architect &mdash; built in 2011, five years before Rustici Content Controller</p>
        <p class="flagship-summary">Centralized cross-domain content delivery: lightweight stub packages (kilobytes) deployed to client LMS platforms, actual content served from GP servers. EasyXDM cross-domain communication layer with transparent SCORM/AICC protocol translation. Package generation tooling (Groovy, Access, Windows Forms) automated global deployments across ~20 energy utility clients. ~2,000 course library (curated subsets per client), 10+ years in production. Architecture later adapted for General Dynamics Electric Boat defense sector.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Cross-Domain</span>
          <span class="impact-tag">SCORM/AICC</span>
          <span class="impact-tag">EasyXDM</span>
          <span class="impact-tag">Content Dispatch</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;Built in 2011 &mdash; five years before Rustici released Content Controller to solve the same problem.&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-e" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 7. ContentAIQ Integration Arc (Exhibit O) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">GP Strategies (Internal Product)</h3>
          <span class="flagship-title">Exhibit O: ContentAIQ &mdash; Integration to AI Product</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2024&ndash;2025</span>
          <span class="email-badge">AI product work</span>
        </div>
        <p class="flagship-role">Full-stack evolution across three GP projects &mdash; integration expertise as the organic path to AI product work</p>
        <p class="flagship-summary">Pattern recognition across a three-project arc: BP Learning Platform (federated React/GraphQL facade), AICPA Bridge Adapter (webhook sync pipeline), and ContentAIQ (AI-powered content creation platform). Dan was one of several frontend developers building the Next.js interface surfacing LLM capabilities &mdash; not the AI pipeline itself, but the UX users interact with. Same integration thread across all three, evolving from Material UI to Tailwind CSS, React to Next.js. Pilot-stage product work with rapid iteration cycles, design-to-code translation from Adobe XD mockups, and enterprise-scale multitenant SaaS architecture.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Next.js</span>
          <span class="impact-tag">AI Integration</span>
          <span class="impact-tag">React</span>
          <span class="impact-tag">TypeScript</span>
          <span class="impact-tag">Tailwind CSS</span>
        </div>
        <router-link to="/exhibits/exhibit-o" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 8. BP Learning Platform (Exhibit N) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">BP</h3>
          <span class="flagship-title">Exhibit N: BP Learning Platform &mdash; Federated System Integration</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2024</span>
          <span class="email-badge">Recent engagement</span>
        </div>
        <p class="flagship-role">Rebranding lead / troubleshooter &mdash; direct Rustici Content Controller integration experience</p>
        <p class="flagship-summary">Existing React/GraphQL platform acting as a federated facade over Rustici Content Controller, PeopleFluent LMS, Watershed LRS (xAPI), and Amazon Cognito. Dan&rsquo;s primary work: large-scale multi-tenant rebranding navigating an undocumented Material UI theming system &mdash; scoped as one week, expanded to months as interrelated style dependencies emerged. Also: bug fixes, Cognito troubleshooting via log analysis, reverse-engineering Watershed LRS queries. Same federated integration pattern Dan built independently as CSBB Dispatch a decade earlier.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">React</span>
          <span class="impact-tag">Rustici</span>
          <span class="impact-tag">GraphQL</span>
          <span class="impact-tag">Federated Architecture</span>
        </div>
        <router-link to="/exhibits/exhibit-n" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 9. SCORM Debugger (Exhibit M) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">GP Strategies (Internal Tooling)</h3>
          <span class="flagship-title">Exhibit M: SCORM Debugger &mdash; TASBot for eLearning</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">~2019&ndash;2020</span>
          <span class="email-badge">Developer tooling</span>
        </div>
        <p class="flagship-role">Creator &mdash; speedrunning methodology applied to eLearning QA</p>
        <p class="flagship-summary">Vue.js wrapper with fake SCORM API providing emulator save-state functionality for eLearning QA: save course state at any point, restore instantly, edit SCORM values directly, jump to any section. Reduced testing cycles from hours to minutes for gated content. Addresses a gap in commercial SCORM tools &mdash; reproducible debug states and session state inspection are not first-class features in SCORM Cloud or SCORM Engine.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Vue.js</span>
          <span class="impact-tag">SCORM API</span>
          <span class="impact-tag">Developer Tooling</span>
          <span class="impact-tag">TASBot</span>
        </div>
        <router-link to="/exhibits/exhibit-m" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 10. TD Bank (Exhibit I) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">TD Bank</h3>
          <span class="flagship-title">Exhibit I: Enterprise Accessibility Methodology</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2022&ndash;2024</span>
          <span class="email-badge">479 emails (2022)</span>
        </div>
        <p class="flagship-role">Accessibility methodology refined across 4 banking clients, solo execution</p>
        <p class="flagship-summary">Built enterprise accessibility testing practice through successive banking engagements — originating with HSBC Simple Learning courses, maturing through PNC Bank and TD Bank Storyline testing. Created WCAG 2.1 evaluation protocols for non-deterministic screen reader behavior (JAWS/NVDA) in interactive eLearning where no industry standards existed. Methodology refined across four major banking clients: HSBC, PNC, TD Bank, UOB. Solo execution on TD MIC project — entire accessibility evaluation conducted independently.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">WCAG 2.1</span>
          <span class="impact-tag">Methodology Creation</span>
          <span class="impact-tag">Banking Compliance</span>
          <span class="impact-tag">Screen Readers</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;Thank you for all your amazing work!&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-i" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 11. Wells Fargo (Exhibit D) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">Wells Fargo</h3>
          <span class="flagship-title">Exhibit D: Sales Conversion Migration</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2018</span>
          <span class="email-badge">223 emails</span>
        </div>
        <p class="flagship-role">Technical lead — migration validation, SCORM troubleshooting, Xyleme advisor</p>
        <p class="flagship-summary">Migrated 100+ courses from legacy formats (Adobe Presenter, Flash, HTML5) to Xyleme LCMS for Wells Fargo LMS deployment. Root-caused cross-browser SCORM failures: Flash ActionScript-to-JavaScript bridge issues, IE compatibility bugs, Xyleme thin package latency. Created QA estimation methodology based on interactivity-level multipliers. Full administrative access to Wells Fargo Xyleme instance — rare trust level for external contractor in financial services.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Xyleme LCMS</span>
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">Migration</span>
          <span class="impact-tag">Financial Services</span>
        </div>
        <blockquote class="flagship-quote">
          <p>&ldquo;I can't thank you enough. I know you're working with little heads up right now.&rdquo;</p>
        </blockquote>
        <router-link to="/exhibits/exhibit-d" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 12. HSBC (Exhibit F) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">HSBC Bank</h3>
          <span class="flagship-title">Exhibit F: Global Protocol Forensics</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2015&ndash;2022</span>
          <span class="email-badge">560 emails</span>
        </div>
        <p class="flagship-role">7-year Tier 1 engagement — protocol-level debugging across 5 countries</p>
        <p class="flagship-summary">Long-running technical support across globally distributed team (US, UK, Mexico, India, Philippines). Discovered SCORM API wrapper bug setting incorrect cmi.core.exit value — vendor-built wrapper flaw invisible to content developers and QA. Flash SWF decompilation for lost source file recovery. SAP SuccessFactors migration advisory across international HSBC teams. Protocol-level debugging requiring deep SCORM specification knowledge — Tier 3 diagnostic skill.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">SCORM Forensics</span>
          <span class="impact-tag">Global Team</span>
          <span class="impact-tag">SAP SuccessFactors</span>
          <span class="impact-tag">Flash Recovery</span>
        </div>
        <router-link to="/exhibits/exhibit-f" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 13. SunTrust (Exhibit G) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">SunTrust Bank</h3>
          <span class="flagship-title">Exhibit G: AWARE Platform Integration</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2015&ndash;2018</span>
          <span class="email-badge">Multi-year</span>
        </div>
        <p class="flagship-role">Custom integration architecture — SCORM-to-REST API wrapper</p>
        <p class="flagship-summary">Developed custom JavaScript wrapper bypassing traditional LMS infrastructure to connect SCORM courseware directly to proprietary REST API. Shaped API definition through consultation before development began. Cross-browser compatibility engineering (IE8/IE10 to Chrome/Firefox). SunTrust granted employee credentials and dedicated laptop to external contractor — exceptional trust level for financial services security environment.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Custom Integration</span>
          <span class="impact-tag">SCORM Wrapper</span>
          <span class="impact-tag">REST API</span>
          <span class="impact-tag">Financial Services</span>
        </div>
        <router-link to="/exhibits/exhibit-g" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 14. Multi-Level Recognition (Exhibit B) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">GP Strategies</h3>
          <span class="flagship-title">Exhibit B: Multi-Level Recognition Pattern</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2015&ndash;2022</span>
          <span class="email-badge">Pattern analysis</span>
        </div>
        <p class="flagship-role">Pattern analysis — recognition cascades as diagnostic signal</p>
        <p class="flagship-summary">Meta-investigation documenting recognition pattern where technical solutions trigger acknowledgment cascades at three organizational levels: immediate team, executive leadership, and client senior management. Two case studies: Electric Boat SCORM wrapper (Flash remediation breakthrough) and Entergy content remediation strategy. Pattern repeats when single technical intervention solves systemic pain across organizational hierarchy — diagnostic signal of high-leverage work.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Pattern Analysis</span>
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">Flash Remediation</span>
          <span class="impact-tag">Strategic Impact</span>
        </div>
        <router-link to="/exhibits/exhibit-b" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>

      <!-- 15. Metal Additive Manufacturing (Exhibit H) -->
      <div class="flagship-card">
        <div class="flagship-header">
          <h3 class="flagship-client">Undisclosed Client</h3>
          <span class="flagship-title">Exhibit H: Rapid Diagnosis Under Pressure</span>
        </div>
        <div class="flagship-meta">
          <span class="flagship-dates">2022</span>
          <span class="email-badge">Same-day resolution</span>
        </div>
        <p class="flagship-role">Rapid response — LMS configuration issue affecting compliance tracking</p>
        <p class="flagship-summary">Live course failing to record completions for metal additive manufacturing training. High-visibility compliance tracking issue with pressure from team members, project managers, and end-client stakeholders. LMS configuration issue identified and resolved same day. Three independent expressions of relief documented in correspondence — weight of situation revealed through "huge relief" and "This email was a relief" responses. Cross-functional collaboration under time pressure.</p>
        <div class="flagship-tags impact-tags">
          <span class="impact-tag">Rapid Diagnosis</span>
          <span class="impact-tag">LMS Config</span>
          <span class="impact-tag">Compliance</span>
          <span class="impact-tag">Time-Pressure</span>
        </div>
        <router-link to="/exhibits/exhibit-h" class="exhibit-link">Full Investigation Report &rarr;</router-link>
      </div>
    </div>
  </section>

  <!-- Project Directory -->
  <section class="portfolio-directory" aria-labelledby="directory-heading">
    <div class="container">
      <h2 id="directory-heading">Complete Project Directory</h2>
      <p class="section-subtitle">All documented client engagements organized by industry</p>

      <!-- Financial Services -->
      <h3 class="directory-industry">Financial Services</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">Bank of America</td>
              <td data-label="Project">Lectora Course LMS Troubleshooting</td>
              <td data-label="Dates">2018</td>
              <td data-label="Role">LMS Troubleshooting Lead</td>
            </tr>
            <tr>
              <td data-label="Client">SunTrust Bank</td>
              <td data-label="Project">AWARE Onboarding &amp; eLearning Platform</td>
              <td data-label="Dates">2015&ndash;2018</td>
              <td data-label="Role">Lead Technical Engineer</td>
            </tr>
            <tr>
              <td data-label="Client">Horizon BCBS NJ</td>
              <td data-label="Project">FWA and Compliance Training</td>
              <td data-label="Dates">2018</td>
              <td data-label="Role">Technical Engineer</td>
            </tr>
            <tr>
              <td data-label="Client">MetLife</td>
              <td data-label="Project">Home Hail Damage VR</td>
              <td data-label="Dates">2018&ndash;2020</td>
              <td data-label="Role">SCORM Expert / Technical Team Member</td>
            </tr>
            <tr>
              <td data-label="Client">SAP SuccessFactors</td>
              <td data-label="Project">LMS Client Engagements</td>
              <td data-label="Dates">2015&ndash;2018</td>
              <td data-label="Role">eLearning Content Integration Specialist</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pharmaceutical / Healthcare -->
      <h3 class="directory-industry">Pharmaceutical &amp; Healthcare</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">Eli Lilly</td>
              <td data-label="Project">eLearning Platform Integration &amp; AICC Wrapper</td>
              <td data-label="Dates">2015&ndash;2020</td>
              <td data-label="Role">AICC/LMS Integration Specialist</td>
            </tr>
            <tr>
              <td data-label="Client">Bayer AG</td>
              <td data-label="Project">eLearning Course Development &amp; LMS Integration</td>
              <td data-label="Dates">2012</td>
              <td data-label="Role">LMS Integration Specialist</td>
            </tr>
            <tr>
              <td data-label="Client">Weill Cornell Medicine</td>
              <td data-label="Project">LMS Readiness &amp; Course Troubleshooting</td>
              <td data-label="Dates">2017&ndash;2018</td>
              <td data-label="Role">Lead Technical Investigator</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Aerospace / Defense -->
      <h3 class="directory-industry">Aerospace &amp; Defense</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">General Dynamics</td>
              <td data-label="Project">eLearning Development &amp; Technical Validation</td>
              <td data-label="Dates">2011&ndash;2020</td>
              <td data-label="Role">Technical Validation Lead</td>
            </tr>
            <tr>
              <td data-label="Client">Gulfstream Aerospace</td>
              <td data-label="Project">Leading Edge eLearning Program</td>
              <td data-label="Dates">2017&ndash;2020</td>
              <td data-label="Role">Technical Troubleshooting Lead</td>
            </tr>
            <tr>
              <td data-label="Client">United Technologies</td>
              <td data-label="Project">Legacy Branding &amp; eLearning Content Audit</td>
              <td data-label="Dates">2018&ndash;2020</td>
              <td data-label="Role">Technical Lead (Content Audit Tooling)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Energy / Utilities -->
      <h3 class="directory-industry">Energy &amp; Utilities</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">Exelon Corporation</td>
              <td data-label="Project">eLearning &amp; LMS Support</td>
              <td data-label="Dates">2015&ndash;2017</td>
              <td data-label="Role">AICC/SCORM Troubleshooter</td>
            </tr>
            <tr>
              <td data-label="Client">National Grid</td>
              <td data-label="Project">LMS &amp; eLearning Support</td>
              <td data-label="Dates">2019&ndash;2020</td>
              <td data-label="Role">Technical Consultant</td>
            </tr>
            <tr>
              <td data-label="Client">Portland General Electric</td>
              <td data-label="Project">Energy Education Center LMS</td>
              <td data-label="Dates">2013&ndash;2016</td>
              <td data-label="Role">Learning Systems Engineer</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Technology -->
      <h3 class="directory-industry">Technology</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">Microsoft</td>
              <td data-label="Project">eLearning Windows 10 Training</td>
              <td data-label="Dates">2015&ndash;2019</td>
              <td data-label="Role">Learning Systems Engineer</td>
            </tr>
            <tr>
              <td data-label="Client">CSC</td>
              <td data-label="Project">University Online Learning Modules</td>
              <td data-label="Dates">2014</td>
              <td data-label="Role">Web Developer / SCORM Integration</td>
            </tr>
            <tr>
              <td data-label="Client">CDK Global</td>
              <td data-label="Project">LMS Health Check &amp; LinkedIn Learning Integration</td>
              <td data-label="Dates">2019</td>
              <td data-label="Role">LMS/AICC Integration Troubleshooter</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Consumer / Manufacturing -->
      <h3 class="directory-industry">Consumer &amp; Manufacturing</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">Nike</td>
              <td data-label="Project">eLearning Accessibility Evaluation &amp; Remediation</td>
              <td data-label="Dates">2018</td>
              <td data-label="Role">Accessibility Technical Advisor</td>
            </tr>
            <tr>
              <td data-label="Client">Luxottica</td>
              <td data-label="Project">LMS Optimization Assessment</td>
              <td data-label="Dates">2015</td>
              <td data-label="Role">Technical Expert / Content Analyst</td>
            </tr>
            <tr>
              <td data-label="Client">Mondelez International</td>
              <td data-label="Project">eLearning Support</td>
              <td data-label="Dates">2015&ndash;2018</td>
              <td data-label="Role">SCORM Technical Expert</td>
            </tr>
            <tr>
              <td data-label="Client">Corning Incorporated</td>
              <td data-label="Project">eLearning Support</td>
              <td data-label="Dates">2018&ndash;2020</td>
              <td data-label="Role">SCORM/LMS Technical Specialist</td>
            </tr>
            <tr>
              <td data-label="Client">Pella Corporation</td>
              <td data-label="Project">eLearning Platform &amp; Course Development</td>
              <td data-label="Dates">2014&ndash;2016</td>
              <td data-label="Role">LMS/SCORM Integration Engineer</td>
            </tr>
            <tr>
              <td data-label="Client">Keurig Dr Pepper</td>
              <td data-label="Project">SuccessFactors SCORM Integration</td>
              <td data-label="Dates">2018</td>
              <td data-label="Role">Lead SCORM Troubleshooting Expert</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Government / Professional Services / Other -->
      <h3 class="directory-industry">Government, Professional Services &amp; Other</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Dates</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Client">U.S. Dept. of Justice</td>
              <td data-label="Project">Civil Division Flash Content Conversion</td>
              <td data-label="Dates">2019</td>
              <td data-label="Role">Technical Lead (Assessment)</td>
            </tr>
            <tr>
              <td data-label="Client">Hilton Hotels</td>
              <td data-label="Project">Legacy LMS Content Conversion</td>
              <td data-label="Dates">2013</td>
              <td data-label="Role">Technical Lead (SCORM Packaging)</td>
            </tr>
            <tr>
              <td data-label="Client">Boston Consulting Group</td>
              <td data-label="Project">Content Support &amp; Flash Readiness</td>
              <td data-label="Dates">2018&ndash;2019</td>
              <td data-label="Role">Technical Lead (Content Analysis)</td>
            </tr>
            <tr>
              <td data-label="Client">GP Strategies (Internal)</td>
              <td data-label="Project">Technical Consulting</td>
              <td data-label="Dates">2021</td>
              <td data-label="Role">Internal SME / Technical Consultant</td>
            </tr>
            <tr>
              <td data-label="Client">GP Strategies (GPU)</td>
              <td data-label="Project">GP University LMS</td>
              <td data-label="Dates">2018&ndash;2020</td>
              <td data-label="Role">SCORM/LMS Troubleshooting Specialist</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <section class="portfolio-stats" aria-label="Portfolio statistics">
    <div class="container">
      <div class="stats-bar">
        <StatItem number="38" label="Projects Documented" />
        <StatItem number="6,000+" label="Archived Emails" />
        <StatItem number="15+" label="Industries" />
      </div>
    </div>
  </section>
</template>
