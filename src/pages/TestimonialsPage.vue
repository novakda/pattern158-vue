<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-testimonials')
useSeo({
  title: 'Field Reports | Pattern 158 - Dan Novak',
  description: 'Field reports and case studies from Dan Novak\'s 28+ year career. Evidence from Electric Boat, Wells Fargo, HSBC, SunTrust, TD Bank, and more.',
  path: '/testimonials',
})
</script>

<template>
  <HeroMinimal title="FIELD REPORTS" subtitle="Documented evidence from incident sites across 28+ years of engineering work">
    <span class="classification">Corroborated &middot; Primary Sources &middot; 2005&ndash;2022</span>
  </HeroMinimal>

  <!-- Summary Stats -->
  <section class="summary">
    <div class="container">
      <h2>Executive Summary</h2>
      <p>The following exhibits are drawn from professional correspondence spanning 17 years across enterprise clients including General Dynamics Electric Boat, HSBC, Wells Fargo, SunTrust, and TD Bank. Each citation is sourced from professional correspondence.</p>

      <div class="stats-bar">
        <StatItem number="17" label="Years Documented" />
        <StatItem number="600+" label="Labor Hours Saved (Single Project)" />
        <StatItem number="5" label="Critical Issues Resolved (2-Day Onsite)" />
        <StatItem number="1,216" label="Lessons Refreshed (Content Overhaul)" />
      </div>
    </div>
  </section>

  <!-- Exhibits -->
  <section class="exhibits" id="exhibits">
    <div class="container">
      <h2>Exhibits</h2>
      <p class="section-subtitle">Direct quotations from primary sources, organized by engagement</p>

      <!-- ===== EXHIBIT A: Electric Boat ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit A</span>
          <span class="exhibit-client">General Dynamics Electric Boat</span>
          <span class="exhibit-date">2015&ndash;2022</span>
        </div>
        <h3 class="exhibit-title">Cross-Domain SCORM Resolution &amp; Embedded Technical Advisory</h3>

        <blockquote>
          I'd consider the last couple days a success, and I look forward to working with Dan in the future.
          <div class="attribution">
            Chief of Learning Services, Metrics, Processes &amp; Technology, Electric Boat
          </div>
        </blockquote>

        <blockquote>
          Thank you Dan for working with us and listening to our ideas and problems!
          <div class="attribution">
            <span class="role">in summary email to EB leadership</span>
          </div>
        </blockquote>

        <table class="resolution-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Issue">SCORM courses dependent on unreliable Cornerstone network player</td>
              <td data-label="Resolution">Provided cross-domain SCORM wrapper eliminating player dependency</td>
            </tr>
            <tr>
              <td data-label="Issue">HTML5 courses failing under AICC protocol</td>
              <td data-label="Resolution">Converted AICC to SCORM HTML5 with improved performance</td>
            </tr>
            <tr>
              <td data-label="Issue">Quiz bookmarking and reset failures</td>
              <td data-label="Resolution">Implemented SCORM HTML5 course with proper reset and bookmarking</td>
            </tr>
            <tr>
              <td data-label="Issue">No tools to verify SCORM data flow</td>
              <td data-label="Resolution">Provided LMS simulation tool for troubleshooting and training</td>
            </tr>
            <tr>
              <td data-label="Issue">Bulk SCORM import not possible</td>
              <td data-label="Resolution">Tested and validated Cornerstone's new bulk publication tool</td>
            </tr>
          </tbody>
        </table>

        <div class="impact-tags">
          <span class="impact-tag highlight">Client-Facing</span>
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">Cornerstone LMS</span>
          <span class="impact-tag">Cross-Domain</span>
          <span class="impact-tag">Tooling</span>
        </div>

        <router-link to="/exhibits/exhibit-a" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT B: Leadership Recognition of EB Visit ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit B</span>
          <span class="exhibit-client">GP Strategies Leadership</span>
          <span class="exhibit-date">2018&ndash;2019</span>
        </div>
        <h3 class="exhibit-title">Leadership Recognition Chain: A Repeatable Pattern</h3>

        <blockquote>
          I hear you did an AWESOME job onsite! EB appreciated your support. Thank you for making the trip and doing all the great work!
          <div class="attribution">
            Director of Learning Technologies, GP Strategies
          </div>
        </blockquote>

        <blockquote>
          Thanks for all the great work you did out there. I heard about your work from Chris Sproule, Tracey Nicholson, and Quinn Gladu.
          <div class="attribution">
            Director of Learning Technologies, GP Strategies
          </div>
        </blockquote>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Two independent recognition cascades &mdash; August 2018 and April 2019 &mdash; propagated through GP Strategies' leadership hierarchy via unsolicited channels. Three named independent sources confirmed the second cascade.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Repeatable Pattern</span>
          <span class="impact-tag highlight">Multi-Source Corroboration</span>
          <span class="impact-tag">General Dynamics</span>
        </div>

        <router-link to="/exhibits/exhibit-b" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT C: Content Refresh / Automation ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit C</span>
          <span class="exhibit-client">GP Strategies &mdash; Content Team</span>
          <span class="exhibit-date">December 2015</span>
        </div>
        <h3 class="exhibit-title">1,216-Lesson Content Refresh: Automation Saves 600+ Hours</h3>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Part of a comprehensive team recognition email celebrating the completion of a 1,216-lesson content refresh. Each of 15 team members received a unique title and individual recognition. Dan's callout focused on tooling and automation that enabled the project to complete on schedule. The automation tool was also used by a colleague to publish every lesson at least three times during the refresh cycle. Full testimonial details available in the investigation report.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">600+ Hours Saved</span>
          <span class="impact-tag">Automation</span>
          <span class="impact-tag">Xyleme</span>
          <span class="impact-tag">Fiddler</span>
          <span class="impact-tag">1,216 Lessons</span>
        </div>

        <router-link to="/exhibits/exhibit-c" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT D: Wells Fargo ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit D</span>
          <span class="exhibit-client">Wells Fargo</span>
          <span class="exhibit-date">August 2018</span>
        </div>
        <h3 class="exhibit-title">Sales Conversion Migration: 100+ Course Technical Lead</h3>

        <blockquote>
          The client contact reached out to me today to convey her appreciation for the work that you two did to test the WF courses despite seeing issues related to IE. Thanks for your hard work on this. WF is a critical client and our ability to meet their volume of needs is important to the success of the relationship.
          <div class="attribution">
            Director of Learning Technologies
            <span class="role">&mdash; relaying client feedback from Wells Fargo</span>
          </div>
        </blockquote>

        <div class="impact-tags">
          <span class="impact-tag highlight">Client-Facing</span>
          <span class="impact-tag">Wells Fargo</span>
          <span class="impact-tag">Migration Validation</span>
          <span class="impact-tag">IE Compatibility</span>
        </div>

        <router-link to="/exhibits/exhibit-d" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT E: CSBB Dispatch ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit E</span>
          <span class="exhibit-client">GP Strategies (Energy Utility Clients)</span>
          <span class="exhibit-date">2011&ndash;2016+</span>
        </div>
        <h3 class="exhibit-title">CSBB Dispatch: Cross-Domain Content Delivery &mdash; Built 5 Years Before Content Controller</h3>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Architected a cross-domain content delivery system serving ~20 energy utility clients through a centralized SCORM dispatch layer — each drawing a curated subset from a ~2,000 course central library. Eliminated the manual zip-and-email deployment cycle. Built in 2011 &mdash; five years before Rustici released Content Controller to solve the same problem.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Cross-Domain Architecture</span>
          <span class="impact-tag">~20 Clients Served</span>
          <span class="impact-tag">SCORM</span>
          <span class="impact-tag">GPiLEARN</span>
          <span class="impact-tag">Rustici Precursor</span>
        </div>

        <router-link to="/exhibits/exhibit-e" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT F: HSBC ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit F</span>
          <span class="exhibit-client">HSBC</span>
          <span class="exhibit-date">2015&ndash;2022</span>
        </div>
        <h3 class="exhibit-title">Cross-Platform SCORM Forensics &amp; Legacy Recovery</h3>

        <blockquote>
          Thanks so much for your great work making the fixes. HSBC LMS team has approved the updated courseware!
          <div class="attribution">
            Project Manager, GP Strategies (HSBC Account)
          </div>
        </blockquote>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Tier 1 global banking client across 5 countries. Found a SCORM API wrapper bug causing silent session termination, decompiled Flash SWFs to recover lost source files, and coordinated SCORM deployment fixes across Mexico, India, and the Philippines.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">SCORM Forensics</span>
          <span class="impact-tag highlight">Global Banking</span>
          <span class="impact-tag">Flash Recovery</span>
          <span class="impact-tag">SAP SuccessFactors</span>
        </div>

        <router-link to="/exhibits/exhibit-f" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT G: SunTrust Learning Platform ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit G</span>
          <span class="exhibit-client">SunTrust (now Truist)</span>
          <span class="exhibit-date">2015&ndash;2018</span>
        </div>
        <h3 class="exhibit-title">AWARE Platform: Custom SCORM-to-API Integration</h3>

        <blockquote>
          Thanks for the thorough documentation of the issue and solution.
          <div class="attribution">
            SunTrust (Client)
          </div>
        </blockquote>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Team investigated and documented the learning platform situation, producing a detailed findings report with recommended path forward. Client requested follow-up meeting to discuss implementation options based on the quality of the technical analysis.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Client-Facing</span>
          <span class="impact-tag">SunTrust</span>
          <span class="impact-tag">Technical Writing</span>
          <span class="impact-tag">Forensic Analysis</span>
        </div>

        <router-link to="/exhibits/exhibit-g" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT H: Additive Manufacturing Fix ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit H</span>
          <span class="exhibit-client">Internal &mdash; Cross-Functional</span>
          <span class="exhibit-date">October 2019</span>
        </div>
        <h3 class="exhibit-title">Metal Additive Manufacturing Course: Rapid Diagnosis</h3>

        <blockquote>
          Kudos on finding this solution so promptly! &hellip; This email was a relief.
          <div class="attribution">
            GP Strategies (combined from respondents)
          </div>
        </blockquote>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>SCORM completion tracking failure on a high-visibility additive manufacturing course. Root cause identified and fix deployed same day, prompting relief across stakeholders.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Rapid Resolution</span>
          <span class="impact-tag">LMS Troubleshooting</span>
          <span class="impact-tag">SCORM Completion</span>
        </div>

        <router-link to="/exhibits/exhibit-h" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT I: TD Compliance Training ===== -->
      <div class="exhibit-card">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit I</span>
          <span class="exhibit-client">TD Bank (via GP Strategies)</span>
          <span class="exhibit-date">2021&ndash;2024</span>
        </div>
        <h3 class="exhibit-title">Enterprise Accessibility Initiative: Methodology Creation</h3>

        <blockquote>
          Thank you for all your amazing work!
          <div class="attribution">
            Senior Learning Project Manager, GP Strategies
          </div>
        </blockquote>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Most experienced accessibility evaluator on the TD Bank engagement (2021&ndash;2024). Contributed to GP&rsquo;s WCAG 2.1 AA evaluation methodology and brought forensic-level ARIA debugging, JAWS/NVDA interaction protocols, and Storyline-specific screen reader workarounds developed through prior HSBC and PNC Bank engagements.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Methodology Creation</span>
          <span class="impact-tag">TD Bank</span>
          <span class="impact-tag">WCAG 2.1</span>
          <span class="impact-tag">Accessibility</span>
        </div>

        <router-link to="/exhibits/exhibit-i" class="exhibit-link">View Full Investigation Report</router-link>
      </div>

      <!-- Investigation Reports Subsection -->
      <div class="investigation-reports-heading">
        <h2>Investigation Reports</h2>
        <p class="section-subtitle">Methodology-driven case studies: the investigation is the deliverable</p>
      </div>

      <!-- ===== EXHIBIT J: GM Course Completion Investigation ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit J</span>
          <span class="exhibit-client">General Motors</span>
          <span class="exhibit-date">~2017</span>
        </div>
        <h3 class="exhibit-title">GM Learning Portal: Course Completion Anomaly Investigation</h3>

        <div class="exhibit-context">
          <h4>Investigation Summary</h4>
          <p>GM reported a 4x spike in incomplete courses after migrating to a new LMS. Initial assumption: tracking bug. Multi-angle forensic investigation &mdash; technical forensics, UX analysis, and user research &mdash; identified five concurrent systemic failures aligned in a &ldquo;Swiss cheese model.&rdquo; The root cause wasn&rsquo;t a single bug; it was a systemic mismatch between how the platform was designed and how people actually worked.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">NTSB Methodology</span>
          <span class="impact-tag">Systems Thinking</span>
          <span class="impact-tag">Forensic Analysis</span>
          <span class="impact-tag">User Research</span>
          <span class="impact-tag">Swiss Cheese Model</span>
        </div>

        <router-link to="/exhibits/exhibit-j" class="exhibit-link">View Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT K: Microsoft MCAPS AILT ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit K</span>
          <span class="exhibit-client">Microsoft (MCAPS)</span>
          <span class="exhibit-date">2025&ndash;2026</span>
        </div>
        <h3 class="exhibit-title">Microsoft MCAPS: AI-Led Training Agent</h3>

        <div class="exhibit-context">
          <h4>Investigation Summary</h4>
          <p>Building on a decade of GP Strategies&rsquo; embedded work on Microsoft accounts, Dan was brought in to evolve their AI training agent in Copilot Studio. Zero platform experience to functional POC in ~4 weeks. The breakthrough: separating deterministic state (structured JSON) from AI interaction (content delivery), creating a hybrid architecture that solved the reliability challenges of the original declarative approach.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Zero to POC in ~4 Weeks</span>
          <span class="impact-tag">Copilot Studio</span>
          <span class="impact-tag">AI Architecture</span>
          <span class="impact-tag">Hybrid AI/Structured Data</span>
          <span class="impact-tag">10-Year Relationship</span>
        </div>

        <router-link to="/exhibits/exhibit-k" class="exhibit-link">View Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT L: Power Platform Audit ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit L</span>
          <span class="exhibit-client">Internal</span>
          <span class="exhibit-date">2025</span>
        </div>
        <h3 class="exhibit-title">Power Platform: Architecture Audit</h3>

        <div class="exhibit-context">
          <h4>Investigation Summary</h4>
          <p>Internal ERP modernization on Power Platform where institutional knowledge was lost through organizational transitions. AI-assisted forensic analysis exposed five foundational gaps: no data model, no version control, monolithic architecture, atomized requirements without context, and no decomposed user stories. The diagnosis was the deliverable.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Forensic Diagnosis</span>
          <span class="impact-tag">Power Platform</span>
          <span class="impact-tag">AI-Assisted Analysis</span>
          <span class="impact-tag">Architecture Audit</span>
        </div>

        <router-link to="/exhibits/exhibit-l" class="exhibit-link">View Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT M: SCORM Debugger ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit M</span>
          <span class="exhibit-client">GP Strategies (Internal Tooling)</span>
          <span class="exhibit-date">~2019&ndash;2020</span>
        </div>
        <h3 class="exhibit-title">SCORM Debugger: TASBot-Inspired QA Automation</h3>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Created a Vue.js SCORM debugging tool inspired by TASBot/speedrunning save states. Reduced QA testing cycles from hours to minutes by enabling instant state capture and restore across gated eLearning courses. The approach that Rustici Engine&rsquo;s testing tools would later address commercially.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">QA Automation</span>
          <span class="impact-tag">Hours to Minutes</span>
          <span class="impact-tag">Vue.js</span>
          <span class="impact-tag">SCORM Testing</span>
          <span class="impact-tag">TASBot Methodology</span>
        </div>

        <router-link to="/exhibits/exhibit-m" class="exhibit-link">View Investigation Report</router-link>
      </div>

      <!-- ===== EXHIBIT N: BP Learning Platform ===== -->
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit N</span>
          <span class="exhibit-client">BP (via Leo Learning / GP Strategies)</span>
          <span class="exhibit-date">2024</span>
        </div>
        <h3 class="exhibit-title">BP Learning Platform: Federated System Integration</h3>

        <div class="exhibit-context">
          <h4>Context</h4>
          <p>Worked on BP&rsquo;s React/GraphQL learning platform integrating Rustici Content Controller, PeopleFluent LMS, Watershed LRS, and Amazon Cognito. Recognized the federated integration pattern from CSBB Dispatch &mdash; a decade of pattern evolution from custom-built to commercial ecosystem.</p>
        </div>

        <div class="impact-tags">
          <span class="impact-tag highlight">Rustici Content Controller</span>
          <span class="impact-tag">React/GraphQL</span>
          <span class="impact-tag">Federated Integration</span>
          <span class="impact-tag">Pattern Recognition</span>
          <span class="impact-tag">Material UI</span>
        </div>

        <router-link to="/exhibits/exhibit-n" class="exhibit-link">View Investigation Report</router-link>
      </div>
    </div>
  </section>

  <!-- Metrics Section -->
  <section class="metrics">
    <div class="container">
      <h2>Recurring Patterns in the Record</h2>

      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Tooling &amp; Automation</h3>
          <ul>
            <li>Built publishing automation saving 600+ labor hours</li>
            <li>Created cross-domain SCORM wrappers used across enterprise clients</li>
            <li>Developed LMS simulation tools adopted by client teams</li>
            <li>Recognized as someone who "fiddles until we get a tool that makes solutions possible"</li>
          </ul>
        </div>

        <div class="metric-card">
          <h3>Client Impact</h3>
          <ul>
            <li>Work praised independently by 3+ contacts at Electric Boat</li>
            <li>Microsoft program manager credited team with "moving the bar" on accessible courses</li>
            <li>Wells Fargo account manager relayed direct client appreciation</li>
            <li>HSBC LMS team approved fixes under compliance deadline</li>
          </ul>
        </div>

        <div class="metric-card">
          <h3>Problem-Solving Speed</h3>
          <ul>
            <li>5 critical issues resolved in a 2-day on-site (Electric Boat)</li>
            <li>Course completion fix described as "a relief"</li>
            <li>Solutions delivered under tight security compliance windows</li>
            <li>Cross-domain SCORM 2004 wrapper prototyped within a week of request</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
