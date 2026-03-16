<script setup lang="ts">
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import HeroMinimal from '@/components/HeroMinimal.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-contact')
useSeo({
  title: 'Contact | Pattern 158 - Dan Novak',
  description: 'Get in touch with Dan Novak for systems architecture, legacy rescue, and AI implementation consulting.',
  path: '/contact',
})
</script>

<template>
  <HeroMinimal title="Get in Touch" subtitle="Let's talk about your project" />

    <!-- Contact Methods Section -->
    <section class="contact-methods">
      <div class="container">
        <h2>Email</h2>
        <div class="email-container">
          <a href="mailto:dan@pattern158.solutions" class="email-link">dan@pattern158.solutions</a>
          <button id="copy-email" class="copy-btn" aria-label="Copy email address to clipboard">
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <p class="email-note">Primary contact method</p>

        <h2>Connect</h2>
        <div class="social-buttons">
          <a href="https://linkedin.com/in/dan-novak-5692197" class="btn-social" target="_blank"
            rel="noopener noreferrer" aria-label="Connect with Dan on LinkedIn (opens in new tab)">LinkedIn</a>
          <a href="https://github.com/novakda" class="btn-social" target="_blank" rel="noopener noreferrer"
            aria-label="View Dan's GitHub profile (opens in new tab)">GitHub</a>
        </div>
      </div>
    </section>

    <!-- Guidance Section -->
    <section class="guidance">
      <div class="container">
        <h2>What to Include</h2>
        <p class="guidance-intro">I work best when I understand the full context. When reaching out about a project,
          please include:</p>

        <ul class="guidance-list">
          <li>
            <strong>Project scope:</strong>
            What are you trying to build or fix?
          </li>
          <li>
            <strong>Timeline:</strong>
            When do you need it completed?
          </li>
          <li>
            <strong>Budget:</strong>
            What's the allocated budget or rate range?
          </li>
          <li>
            <strong>Tech stack:</strong>
            What technologies are involved?
          </li>
        </ul>

        <div class="timezone-note">
          <strong>Timezone: US Pacific (PT)</strong>
        </div>

        <div class="preferences">
          <h3>Types of Work I'm Open To</h3>
          <ul>
            <li>
              <strong>Contract:</strong>
              Project-based or long-term technical consulting
            </li>
            <li>
              <strong>Contract-to-hire:</strong>
              Evaluate fit while delivering value
            </li>
            <li>
              <strong>Full-time:</strong>
              With technical organizations valuing deep expertise over billable hours
            </li>
          </ul>
          <p>
            <strong>Project interests:</strong>
            Legacy system modernization and rescue, LMS/SCORM integration and troubleshooting, enterprise system
            architecture, accessibility remediation (WCAG 2.1 AA+), AI-assisted development tooling.
          </p>
        </div>

        <div class="exclusions">
          <h3>Not a Good Fit</h3>
          <p>I pass on:</p>
          <ul>
            <li>
              <strong>Direct employment at billable-hours-first consultancies</strong>
              — I optimize for quality of work and capability development, not maximizing utilization metrics
            </li>
            <li>Greenfield mobile app development (iOS/Android native)</li>
            <li>Pure design work (UI/UX without engineering)</li>
            <li>WordPress plugin development</li>
            <li>Course building in authoring tools (Storyline, Captivate, Lectora)</li>
            <li>24/7 on-call support roles</li>
            <li>Keyword-matching commodity roles without technical depth</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial">
      <div class="container">
        <TestimonialQuote
          quote="You have helped us move the bar to better, more accessible courses and helped me learn a ton."
          cite="Program Manager, Microsoft Account"
          context="GP Strategies — Microsoft accessibility initiative"
        />
        <TestimonialQuote
          quote="Dan is the expert on LMS communication."
          cite="Software Engineer"
          context="GP Strategies — Enterprise LMS integration"
          variant="secondary"
        />
      </div>
    </section>
</template>
