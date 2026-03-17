<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-faq')
useSeo({
  title: 'FAQ | Pattern 158 - Dan Novak',
  description: 'Frequently asked questions about hiring Dan Novak. Covers availability, technical expertise, working style, rates, and engagement process for consulting work.',
  path: '/faq',
})
</script>

<template>
  <HeroMinimal
    title="Frequently Asked Questions"
    subtitle="Common questions about working with Dan Novak"
  />

  <!-- FAQ-01: Hiring Logistics -->
  <section class="faq-category" aria-labelledby="hiring-heading">
    <h2 id="hiring-heading">Hiring Logistics</h2>
    <p class="category-intro">Availability, rates, and work arrangements</p>

    <div class="faq-item">
      <h3 class="faq-question">Are you available for new projects?</h3>
      <div class="faq-answer">
        <p>Yes, I'm available for contract, contract-to-hire, or full-time positions. I was laid off from GP Strategies in January 2026 and am actively seeking new opportunities.</p>
        <p>I'm interested in roles involving legacy system modernization, LMS/SCORM integration, enterprise system architecture, accessibility remediation (WCAG 2.1 AA+), and AI-assisted development tooling.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">What's your work arrangement preference?</h3>
      <div class="faq-answer">
        <p>Remote is ideal. I'm also open to hybrid arrangements in the Portland, OR area (Vancouver, WA specifically). I have 28+ years of experience working effectively with distributed teams across time zones.</p>
        <p>I'm comfortable with async communication (email, Slack, documentation) and sync collaboration (video calls, pair programming) depending on what the project needs.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">What are your contract rates?</h3>
      <div class="faq-answer">
        <p>For contract work, rates vary based on project scope, duration, and technical complexity. Let's discuss your specific needs — <router-link to="/contact">contact me</router-link> with project details and we can work out terms that make sense for both of us.</p>
      </div>
    </div>
  </section>

  <!-- FAQ-02: Technical Expertise -->
  <section class="faq-category" aria-labelledby="expertise-heading">
    <h2 id="expertise-heading">Technical Expertise</h2>
    <p class="category-intro">Technologies, specializations, and domain knowledge</p>

    <div class="faq-item">
      <h3 class="faq-question">What technologies do you specialize in?</h3>
      <div class="faq-answer">
        <p><strong>Primary stack:</strong> JavaScript, TypeScript, Vue.js, Node.js, HTML5/CSS3, SQL</p>
        <p><strong>Specialized domains:</strong> Learning Management Systems (LMS), SCORM/AICC/xAPI, eLearning technologies, accessibility remediation (WCAG 2.1 AA/AAA)</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">Do you work with legacy systems?</h3>
      <div class="faq-answer">
        <p>Yes, legacy system modernization is a core specialty. I've rescued undocumented systems, reverse-engineered abandoned codebases, and integrated legacy platforms with modern architectures.</p>
        <p>See the <router-link to="/portfolio">portfolio</router-link> for examples like the legacy CMS rescue and cross-domain SCORM framework.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">Are you experienced with AI and automation?</h3>
      <div class="faq-answer">
        <p>Yes. I've designed agentic workflows using GitHub Spec Kit, built Copilot Studio agents for enterprise clients, and use AI-assisted development extensively (GitHub Copilot, Claude Code).</p>
        <p>I focus on practical applications - tools that solve real problems, not hype. AI is most valuable for documentation generation, code review, and rapid prototyping.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">What industries have you worked in?</h3>
      <div class="faq-answer">
        <p>Banking (PNC, JPMorgan Chase, Kmart Credit), Defense (GDEB Electric Boat), Energy (7+ utilities including FPL, NRG, Exelon), Retail (GM, Kmart), Healthcare (Cornell Medical), and Enterprise software (Microsoft, BP).</p>
        <p>This cross-industry experience helps me recognize patterns and apply solutions from one domain to another.</p>
      </div>
    </div>
  </section>

  <!-- FAQ-03: Working Style -->
  <section class="faq-category" aria-labelledby="style-heading">
    <h2 id="style-heading">Working Style</h2>
    <p class="category-intro">Communication, collaboration, and approach</p>

    <div class="faq-item">
      <h3 class="faq-question">How do you handle communication?</h3>
      <div class="faq-answer">
        <p>I provide clear, documented communication. I'm comfortable with async (email, Slack, documentation) and sync (video calls, pair programming) depending on what the project needs.</p>
        <p>I'm in US Pacific timezone (Portland, OR). I respond to messages during business hours and document key decisions so distributed teams can stay aligned.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">Do you work well with distributed teams?</h3>
      <div class="faq-answer">
        <p>Yes. I've spent 28 years working with distributed teams across time zones. I understand the importance of documentation, clear handoffs, and async-first workflows.</p>
        <p>I'm experienced with collaborative tools (Jira, Confluence, GitHub, Teams, Slack) and know how to keep projects moving when team members are in different locations.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">What's your approach to unclear requirements?</h3>
      <div class="faq-answer">
        <p>I treat it as a forensic investigation. When requirements are undefined or contradictory, I document what exists, map the gaps, and propose solutions grounded in evidence.</p>
        <p>See the <router-link to="/portfolio">featured projects</router-link> for examples of how I approach undocumented systems and rebuild them systematically. If you have an unclear situation, <router-link to="/contact">let's talk</router-link> — this is the kind of problem I'm good at solving.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">Are you comfortable working independently?</h3>
      <div class="faq-answer">
        <p>Yes. I've often been "the engineer" on projects — the one who figures problems out, builds the tool, and hands off documentation. I'm self-directed but also collaborate well when the project calls for it.</p>
        <p>I thrive in situations where requirements are unclear, documentation is missing, or the problem hasn't been solved before. Give me a complex puzzle and I'll map it, solve it, and document it.</p>
      </div>
    </div>
  </section>

  <!-- FAQ-04: Process & Methodology -->
  <section class="faq-category" aria-labelledby="process-heading">
    <h2 id="process-heading">Process &amp; Methodology</h2>
    <p class="category-intro">How Dan works in practice</p>

    <div class="faq-item">
      <h3 class="faq-question">What's your typical workflow?</h3>
      <div class="faq-answer">
        <p>The pattern repeats across my career:</p>
        <ol>
          <li><strong>Deconstruct the Chaos:</strong> Forensic investigation to understand the system — map dependencies, identify patterns, document what exists</li>
          <li><strong>Build the Tool:</strong> Create reusable frameworks to solve root causes, not symptoms — automate repetitive tasks, standardize processes</li>
          <li><strong>Empower the User:</strong> Hand off robust, documented tools that make complex processes simple — clear READMEs, inline comments, training materials</li>
        </ol>
        <p>This pattern shows up whether I'm debugging SCORM packages, reverse-engineering legacy systems, or building automation tools.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">How do you approach troubleshooting?</h3>
      <div class="faq-answer">
        <p>Systems thinking first. I look for patterns, examine different angles (technical, UX, user behavior), and verify hypotheses with evidence. I document findings clearly so others can follow the reasoning.</p>
        <p>I'm methodical: reproduce the issue, isolate variables, test hypotheses, fix root cause (not symptoms), verify the fix, and document for future reference.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">Do you write documentation?</h3>
      <div class="faq-answer">
        <p>Yes, extensively. I believe tools are as good as their documentation. I write clear READMEs, inline code comments, architecture decision records (ADRs), and handoff guides.</p>
        <p>Documentation isn't an afterthought — it's part of the deliverable. If I build it, I document it so the next person (or future me) can understand and maintain it.</p>
      </div>
    </div>

    <div class="faq-item">
      <h3 class="faq-question">What's your philosophy on tool selection?</h3>
      <div class="faq-answer">
        <p>"Right tool for the job." I'm pragmatic — native solutions over frameworks when possible, established libraries over hand-rolled, simple over clever.</p>
        <p>I assess tools based on: Does it solve the actual problem? Will the team be able to maintain it? Is it overengineered? I'd rather use a boring, reliable solution than chase the latest trend. See the <router-link to="/philosophy">philosophy page</router-link> for more on this approach.</p>
      </div>
    </div>
  </section>

  <!-- Testimonial Section -->
  <section class="testimonial testimonial-divider">
    <div class="container">
      <h2 class="section-heading-styled">What Colleagues Say</h2>
      <TestimonialQuote
        quote="It's always so nice working with you and having you send these notes so that the developer can get going is helpful and appreciated."
      />
      <TestimonialQuote
        quote="Thank you so much for your efforts in preparing this proposal. It looks fantastic."
        cite="Director, Accessibility Practice"
        context="GP Strategies — on an accessibility initiative proposal"
        variant="secondary"
      />
    </div>
  </section>
</template>
