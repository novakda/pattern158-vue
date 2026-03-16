<script setup lang="ts">
import PatternVisual from '@/components/PatternVisual.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-index')
useSeo({
  title: 'Pattern 158 | Dan Novak - Systems Architect',
  description: 'Dan Novak - Systems architect with 28+ years rescuing enterprise systems. Specializing in legacy system integration, cross-platform solutions, and AI implementation.',
  path: '/',
})
</script>

<template>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <p class="hero-brand">PATTERN 158</p>
        <h1>Dan Novak</h1>
        <p class="hero-subtitle">Senior Software Engineer | Systems Architect</p>
        <p class="hero-availability">Available for new opportunities</p>

        <!-- Tech Pills (DB-generated) -->
        <!-- TECH_PILLS_START -->
        <div class="hero-tech-pills">
          <span class="tech-pill">JavaScript</span>
          <span class="tech-pill">Node.js</span>
          <span class="tech-pill">Vue.js</span>
          <span class="tech-pill">TypeScript</span>
          <span class="tech-pill">SQL</span>
          <span class="tech-pill">REST APIs</span>
          <span class="tech-pill">AI Integration</span>
          <span class="tech-pill">Power Platform</span>
        </div>
        <!-- TECH_PILLS_END -->

        <!-- Pattern Visual (558 representation) -->
        <PatternVisual />

        <p class="tagline">I cheat, but I cheat fair.</p>

        <div class="cta-buttons">
          <a href="/contact.html" class="btn btn-primary">Get in Touch</a>
          <a href="/portfolio.html" class="btn btn-secondary">View My Work</a>
        </div>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="intro">
      <div class="container">
        <h2>I Reverse-Engineer Chaos Into Clarity</h2>
        <p>After 28 years building and rescuing enterprise systems, I've learned that the best solutions aren't always
          the obvious ones—they're the elegant shortcuts that work properly.</p>

        <div class="specialties">
          <div class="specialty-card">
            <h3>Legacy System Rescue</h3>
            <p>Forensic reverse-engineering of "black box" systems. Making undocumented legacy systems work when
              documentation doesn't exist.</p>
          </div>
          <div class="specialty-card">
            <h3>Cross-Platform Integration</h3>
            <p>Building bridges between systems that weren't designed to talk. SCORM, xAPI, AICC protocol expertise.</p>
          </div>
          <div class="specialty-card">
            <h3>AI Implementation</h3>
            <p>Thoughtful AI/LLM application. Understanding when to use generative AI vs. structured data for production
              systems.</p>
          </div>
          <div class="specialty-card">
            <h3>Systems Architecture</h3>
            <p>Building foundational systems that harmonize—like the diapason register that gives a pipe organ its
              character.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section (DB-generated) -->
    <section class="stats-section" aria-label="Career statistics">
      <div class="container">
        <!-- STATS_SECTION_START -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-number">28+</span>
            <span class="stat-label">Years</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">5,200+</span>
            <span class="stat-label">Projects</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">40+</span>
            <span class="stat-label">Clients</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">930+</span>
            <span class="stat-label">Testimonials</span>
          </div>
        </div>
        <!-- STATS_SECTION_END -->
      </div>
    </section>

    <!-- Five Core Influences -->
    <section class="content-section influences-compact">
      <div class="container">
        <h2>Five Core Influences</h2>
        <p class="section-subtitle">Not abstract inspirations &mdash; specific sources that shaped how I solve problems.
          <a href="/philosophy.html#influences" class="link-primary">Full details &rarr;</a>
        </p>

        <dl class="influences-list">
          <dt>1. Air Crash Investigation</dt>
          <dd>Applied to the
            <a href="/exhibits/exhibit-j.html" class="link-primary">GM course completion investigation</a>: a 4x spike
            in incomplete rates traced to fragile LMS architecture, misleading navigation, and mismatched real-world
            usage patterns.
          </dd>

          <dt>2. Speedrunning / TASBot</dt>
          <dd>Applied to build a
            <a href="/exhibits/exhibit-m.html" class="link-primary">SCORM debugging tool</a>
            that reduced QA cycles from hours to minutes using emulator save-state methodology.
          </dd>

          <dt>3. &ldquo;You want to cheat, cheat fair &mdash; anything I hate is a crookin&rsquo; crook.&rdquo;</dt>
          <dd>&mdash; Moe Howard, &ldquo;Healthy, Wealthy and Dumb&rdquo; (1938). The source of the tagline. If
            you&rsquo;ve found an elegant shortcut, document it, share it, build it properly. Hoarding a clever solution
            is the real dishonesty.
            <a href="/philosophy.html#influences" class="link-primary">Full philosophy &rarr;</a>
          </dd>

          <dt>4. Mentour Pilot</dt>
          <dd>The model for AI as a force multiplier: domain expert + AI assistant = better analysis than either alone.
          </dd>

          <dt>5. &ldquo;I seek knowledge not for gain, but to better understand myself&rdquo;</dt>
          <dd>A line from a Harry Potter fanfic that stuck. The motivation behind every deep investigation:
            understanding the system, not padding the resume.</dd>
        </dl>
      </div>
    </section>

    <!-- Featured Projects (NTSB Style) -->
    <section class="findings" id="work">
      <div class="container">
        <h2>Featured Projects</h2>

        <!-- Finding 1: Cross-Domain SCORM Framework -->
        <article class="finding-card">
          <div class="finding-header">
            <span class="finding-label">⚠ FINDING 1</span>
            <h3 class="finding-title">Cross-Domain SCORM Framework</h3>
          </div>
          <p class="finding-meta">2011-2016 | Status: 10+ years in production</p>

          <div class="finding-section">
            <h4>Analysis</h4>
            <p>Energy utilities needed cross-domain SCORM delivery before browsers or LMS vendors supported it.
              Same-origin policy blocked the obvious solutions.</p>
          </div>

          <div class="finding-section">
            <h4>Solution</h4>
            <p>Engineered cross-domain communication using EasyXDM. Built SCORM API proxy for transparent AICC/SCORM
              protocol translation. Created automated package generation tooling.</p>
          </div>

          <div class="finding-section">
            <h4>Outcome</h4>
            <p>System served ~20 energy utilities (each drawing a curated subset from a ~2,000 course central library).
              Remained in production 10+ years. Built in 2011 &mdash; five years before Rustici released Content
              Controller.
              <a href="/exhibits/exhibit-e.html" class="link-primary">Full investigation report &rarr;</a>
            </p>
          </div>

          <div class="tech-stack">
            <span class="tech-tag">JavaScript</span>
            <span class="tech-tag">EasyXDM</span>
            <span class="tech-tag">SCORM</span>
            <span class="tech-tag">AICC</span>
            <span class="tech-tag">Groovy</span>
          </div>
        </article>

        <!-- Finding 2: Legacy CMS Rescue -->
        <article class="finding-card">
          <div class="finding-header">
            <span class="finding-label">⚠ FINDING 2</span>
            <h3 class="finding-title">Legacy Courseware CMS Rescue</h3>
          </div>
          <p class="finding-meta">2004-2016 | Status: Extended system lifespan 10+ years</p>

          <div class="finding-section">
            <h4>Analysis</h4>
            <p>Inherited undocumented courseware CMS on Macromedia JRun platform when original developer left. No
              documentation, no source code access, production system serving clients.</p>
          </div>

          <div class="finding-section">
            <h4>Solution</h4>
            <p>Decompiled Java/JSP packages to understand system behavior. Built JavaScript workarounds where
              server-side refactoring wasn't practical. Maintained critical system beyond expected EOL.</p>
          </div>

          <div class="finding-section">
            <h4>Outcome</h4>
            <p>System remained operational 10+ years. Enabled company to continue serving clients while planning proper
              migration path.</p>
          </div>

          <div class="tech-stack">
            <span class="tech-tag">Java/JSP</span>
            <span class="tech-tag">JavaScript</span>
            <span class="tech-tag">Macromedia JRun</span>
            <span class="tech-tag">Forensic Engineering</span>
          </div>
        </article>

        <!-- Finding 3: Enterprise AI Training Agent -->
        <article class="finding-card">
          <div class="finding-header">
            <span class="finding-label">⚠ FINDING 3</span>
            <h3 class="finding-title">Enterprise AI Training Agent</h3>
          </div>
          <p class="finding-meta">2025-2026 | Status: Production</p>

          <div class="finding-section">
            <h4>Analysis</h4>
            <p>Needed AI instructor agent in Copilot Studio. Prompt engineering alone couldn't establish reliable
              guardrails for progress tracking and navigation.</p>
          </div>

          <div class="finding-section">
            <h4>Solution</h4>
            <p>Built data pipeline converting eLearning course materials into structured JSON. Used AI code interpreter
              for content transformation, structured data for deterministic control. Created adaptive cards for
              navigation and assessments.</p>
          </div>

          <div class="finding-section">
            <h4>Outcome</h4>
            <p>Reliable course navigation and progress tracking. Demonstrated hybrid AI/structured data architecture
              pattern.
              <a href="/exhibits/exhibit-k.html" class="link-primary">Full investigation report &rarr;</a>
            </p>
          </div>

          <div class="tech-stack">
            <span class="tech-tag">Microsoft Copilot Studio</span>
            <span class="tech-tag">Adaptive Cards</span>
            <span class="tech-tag">AI Code Interpreter</span>
            <span class="tech-tag">JSON</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Field Reports Teaser -->
    <section class="field-reports-teaser">
      <div class="container">
        <h2>From the Field</h2>
        <p class="section-subtitle">Direct feedback from engagements spanning 17 years</p>

        <div class="teaser-quotes">
          <blockquote class="teaser-quote">
            <p>Dan's technical expertise is tremendous&hellip; with his help, we were able to solve two large technical
              issues we were having, one that will have a direct impact on the Flash conversion process and save a lot
              of time and money.</p>

          </blockquote>

          <blockquote class="teaser-quote">
            <p>This resulted in a savings of about 600 hours of labor by allowing us to publish large batches of lessons
              unattended.</p>
            <footer>
              <cite>Manager, Content Team</cite>
              <span class="quote-context">On publishing automation built during 1,216-lesson refresh</span>
            </footer>
          </blockquote>
        </div>

        <a href="/testimonials.html" class="btn btn-primary">View All Field Reports</a>
      </div>
    </section>
</template>
