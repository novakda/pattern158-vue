<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import NarrativeCard from '@/components/NarrativeCard.vue'
import FlagshipCard from '@/components/FlagshipCard.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { exhibits } from '@/data/exhibits'

const narratives = [
  {
    title: 'Enterprise Integration Architect',
    description: 'Complex multi-system integrations where nothing was designed to work together. Cross-domain SCORM dispatch, federated platform facades, protocol translation layers.',
    clients: 'GDEB \u00b7 HSBC \u00b7 GM \u00b7 Wells Fargo \u00b7 BP \u00b7 SunTrust',
  },
  {
    title: 'AI-Driven Legacy Modernization',
    description: 'Forensic engineering amplified by AI tooling. Using LLMs to pressure-test analysis, generate baselines, and surface gaps that manual review misses.',
    clients: 'Microsoft MCAPS \u00b7 Power Platform \u00b7 GitHub Spec Kit \u00b7 Copilot Studio',
  },
  {
    title: 'Learning Systems Expert',
    description: 'Deep eLearning standards knowledge \u2014 SCORM, xAPI, AICC at the protocol level. LMS architecture, accessibility methodology, cross-platform content delivery.',
    clients: 'Rustici integration \u00b7 SCORM Debugger \u00b7 CSBB Dispatch \u00b7 TD Bank a11y',
  },
]
const flagships = exhibits.filter(e => e.isFlagship)

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

  <section class="portfolio-narratives" aria-labelledby="narratives-heading">
    <div class="container">
      <h2 id="narratives-heading">Three Lenses</h2>
      <p class="section-subtitle">The same career, three ways to read it</p>
      <div class="narrative-cards">
        <NarrativeCard v-for="narrative in narratives" :key="narrative.title" :narrative="narrative" />
      </div>
    </div>
  </section>

  <section class="portfolio-flagships" aria-labelledby="flagships-heading">
    <div class="container">
      <h2 id="flagships-heading">Featured Engagements</h2>
      <p class="section-subtitle">Probable cause summaries — each links to full investigation report</p>
      <FlagshipCard v-for="flagship in flagships" :key="flagship.exhibitLink" :flagship="flagship" />
    </div>
  </section>

  <!-- Project Directory — structured prose table, kept inline per plan decision -->
  <section class="portfolio-directory" aria-labelledby="directory-heading">
    <div class="container">
      <h2 id="directory-heading">Complete Project Directory</h2>
      <p class="section-subtitle">All documented client engagements organized by industry</p>

      <h3 class="directory-industry">Financial Services</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">Bank of America</td><td data-label="Project">Lectora Course LMS Troubleshooting</td><td data-label="Dates">2018</td><td data-label="Role">LMS Troubleshooting Lead</td></tr>
            <tr><td data-label="Client">SunTrust Bank</td><td data-label="Project">AWARE Onboarding &amp; eLearning Platform</td><td data-label="Dates">2015&ndash;2018</td><td data-label="Role">Lead Technical Engineer</td></tr>
            <tr><td data-label="Client">Horizon BCBS NJ</td><td data-label="Project">FWA and Compliance Training</td><td data-label="Dates">2018</td><td data-label="Role">Technical Engineer</td></tr>
            <tr><td data-label="Client">MetLife</td><td data-label="Project">Home Hail Damage VR</td><td data-label="Dates">2018&ndash;2020</td><td data-label="Role">SCORM Expert / Technical Team Member</td></tr>
            <tr><td data-label="Client">SAP SuccessFactors</td><td data-label="Project">LMS Client Engagements</td><td data-label="Dates">2015&ndash;2018</td><td data-label="Role">eLearning Content Integration Specialist</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Pharmaceutical &amp; Healthcare</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">Eli Lilly</td><td data-label="Project">eLearning Platform Integration &amp; AICC Wrapper</td><td data-label="Dates">2015&ndash;2020</td><td data-label="Role">AICC/LMS Integration Specialist</td></tr>
            <tr><td data-label="Client">Bayer AG</td><td data-label="Project">eLearning Course Development &amp; LMS Integration</td><td data-label="Dates">2012</td><td data-label="Role">LMS Integration Specialist</td></tr>
            <tr><td data-label="Client">Weill Cornell Medicine</td><td data-label="Project">LMS Readiness &amp; Course Troubleshooting</td><td data-label="Dates">2017&ndash;2018</td><td data-label="Role">Lead Technical Investigator</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Aerospace &amp; Defense</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">General Dynamics</td><td data-label="Project">eLearning Development &amp; Technical Validation</td><td data-label="Dates">2011&ndash;2020</td><td data-label="Role">Technical Validation Lead</td></tr>
            <tr><td data-label="Client">Gulfstream Aerospace</td><td data-label="Project">Leading Edge eLearning Program</td><td data-label="Dates">2017&ndash;2020</td><td data-label="Role">Technical Troubleshooting Lead</td></tr>
            <tr><td data-label="Client">United Technologies</td><td data-label="Project">Legacy Branding &amp; eLearning Content Audit</td><td data-label="Dates">2018&ndash;2020</td><td data-label="Role">Technical Lead (Content Audit Tooling)</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Energy &amp; Utilities</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">Exelon Corporation</td><td data-label="Project">eLearning &amp; LMS Support</td><td data-label="Dates">2015&ndash;2017</td><td data-label="Role">AICC/SCORM Troubleshooter</td></tr>
            <tr><td data-label="Client">National Grid</td><td data-label="Project">LMS &amp; eLearning Support</td><td data-label="Dates">2019&ndash;2020</td><td data-label="Role">Technical Consultant</td></tr>
            <tr><td data-label="Client">Portland General Electric</td><td data-label="Project">Energy Education Center LMS</td><td data-label="Dates">2013&ndash;2016</td><td data-label="Role">Learning Systems Engineer</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Technology</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">Microsoft</td><td data-label="Project">eLearning Windows 10 Training</td><td data-label="Dates">2015&ndash;2019</td><td data-label="Role">Learning Systems Engineer</td></tr>
            <tr><td data-label="Client">CSC</td><td data-label="Project">University Online Learning Modules</td><td data-label="Dates">2014</td><td data-label="Role">Web Developer / SCORM Integration</td></tr>
            <tr><td data-label="Client">CDK Global</td><td data-label="Project">LMS Health Check &amp; LinkedIn Learning Integration</td><td data-label="Dates">2019</td><td data-label="Role">LMS/AICC Integration Troubleshooter</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Consumer &amp; Manufacturing</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">Nike</td><td data-label="Project">eLearning Accessibility Evaluation &amp; Remediation</td><td data-label="Dates">2018</td><td data-label="Role">Accessibility Technical Advisor</td></tr>
            <tr><td data-label="Client">Luxottica</td><td data-label="Project">LMS Optimization Assessment</td><td data-label="Dates">2015</td><td data-label="Role">Technical Expert / Content Analyst</td></tr>
            <tr><td data-label="Client">Mondelez International</td><td data-label="Project">eLearning Support</td><td data-label="Dates">2015&ndash;2018</td><td data-label="Role">SCORM Technical Expert</td></tr>
            <tr><td data-label="Client">Corning Incorporated</td><td data-label="Project">eLearning Support</td><td data-label="Dates">2018&ndash;2020</td><td data-label="Role">SCORM/LMS Technical Specialist</td></tr>
            <tr><td data-label="Client">Pella Corporation</td><td data-label="Project">eLearning Platform &amp; Course Development</td><td data-label="Dates">2014&ndash;2016</td><td data-label="Role">LMS/SCORM Integration Engineer</td></tr>
            <tr><td data-label="Client">Keurig Dr Pepper</td><td data-label="Project">SuccessFactors SCORM Integration</td><td data-label="Dates">2018</td><td data-label="Role">Lead SCORM Troubleshooting Expert</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="directory-industry">Government, Professional Services &amp; Other</h3>
      <div class="directory-table-wrap">
        <table class="directory-table">
          <thead><tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td data-label="Client">U.S. Dept. of Justice</td><td data-label="Project">Civil Division Flash Content Conversion</td><td data-label="Dates">2019</td><td data-label="Role">Technical Lead (Assessment)</td></tr>
            <tr><td data-label="Client">Hilton Hotels</td><td data-label="Project">Legacy LMS Content Conversion</td><td data-label="Dates">2013</td><td data-label="Role">Technical Lead (SCORM Packaging)</td></tr>
            <tr><td data-label="Client">Boston Consulting Group</td><td data-label="Project">Content Support &amp; Flash Readiness</td><td data-label="Dates">2018&ndash;2019</td><td data-label="Role">Technical Lead (Content Analysis)</td></tr>
            <tr><td data-label="Client">GP Strategies (Internal)</td><td data-label="Project">Technical Consulting</td><td data-label="Dates">2021</td><td data-label="Role">Internal SME / Technical Consultant</td></tr>
            <tr><td data-label="Client">GP Strategies (GPU)</td><td data-label="Project">GP University LMS</td><td data-label="Dates">2018&ndash;2020</td><td data-label="Role">SCORM/LMS Troubleshooting Specialist</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

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
