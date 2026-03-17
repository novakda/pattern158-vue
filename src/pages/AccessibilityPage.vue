<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-accessibility')
useSeo({
  title: 'Accessibility | Pattern 158 - Dan Novak',
  description: 'Accessibility statement for pattern158.solutions.',
  path: '/accessibility',
})
</script>

<template>
  <HeroMinimal title="Accessibility Statement">
    <p class="lead">Pattern 158 Solutions is committed to ensuring digital accessibility for all users.</p>
  </HeroMinimal>

  <section class="content-section">
    <div class="container">
      <h2>Commitment to Accessibility</h2>
      <p>Pattern 158 Solutions is dedicated to making this website accessible to the widest possible audience, including individuals with disabilities. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Standards and Conformance</h2>
      <p>This website has been designed and tested to meet the following accessibility standards:</p>
      <ul>
        <li><strong>WCAG 2.1 Level AA</strong> — Web Content Accessibility Guidelines version 2.1, conformance level AA</li>
        <li><strong>Semantic HTML5</strong> — Proper use of landmark elements, heading hierarchy, and ARIA attributes</li>
        <li><strong>Keyboard Navigation</strong> — All functionality accessible via keyboard without mouse</li>
        <li><strong>Screen Reader Compatibility</strong> — Tested for compatibility with common assistive technologies</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Accessibility Testing</h2>
      <p>We employ multiple testing methodologies to ensure accessibility compliance:</p>
      <dl class="definition-list">
        <dt>Automated Testing</dt>
        <dd>axe-core automated accessibility engine running on all 22 pages in both light and dark themes. Tests cover WCAG 2.1 Level A and AA success criteria.</dd>
        <dt>Manual Testing</dt>
        <dd>Keyboard navigation testing of all interactive elements. Visual inspection of color contrast, heading hierarchy, and semantic structure.</dd>
        <dt>Cross-Browser Validation</dt>
        <dd>Functional testing on Chromium-based browsers (Chrome, Edge) and Firefox to ensure consistent experience across browsers.</dd>
        <dt>Viewport Testing</dt>
        <dd>Responsive design validated at desktop (1200px) and mobile (375px) viewports with full screenshot evidence.</dd>
      </dl>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Current Status</h2>
      <p><strong>Last Verified:</strong> February 21, 2026</p>
      <p><strong>Test Results:</strong></p>
      <ul>
        <li>Dark mode: 21/21 pages pass all WCAG 2.1 AA automated tests (100% compliance)</li>
        <li>Light mode: Substantially compliant with minor cosmetic exceptions</li>
        <li>Semantic structure: 100% compliant across all pages</li>
        <li>Keyboard navigation: 100% compliant across all pages</li>
        <li>Cross-browser: Validated on Chromium and Firefox</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Browsers and Assistive Technologies</h2>
      <p>This website has been tested with the following browsers:</p>
      <ul>
        <li>Chrome (latest version)</li>
        <li>Microsoft Edge (latest version)</li>
        <li>Firefox (latest version)</li>
      </ul>
      <p>The site is designed to work with assistive technologies including:</p>
      <ul>
        <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
        <li>Keyboard-only navigation</li>
        <li>Voice control software</li>
        <li>Browser zoom and text resizing up to 200%</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Accessibility Features</h2>
      <p>This website includes the following accessibility features:</p>
      <ul>
        <li><strong>Skip to main content</strong> link at the top of every page for keyboard users</li>
        <li><strong>Semantic HTML landmarks</strong> (header, nav, main, footer) for screen reader navigation</li>
        <li><strong>Proper heading hierarchy</strong> (h1 &rarr; h2 &rarr; h3) with no skipped levels</li>
        <li><strong>Alternative text</strong> for all meaningful images</li>
        <li><strong>High contrast ratios</strong> between text and background (minimum 4.5:1 for normal text)</li>
        <li><strong>Visible focus indicators</strong> for keyboard navigation (4.5:1 contrast ratio)</li>
        <li><strong>Dark mode support</strong> respecting system preferences and manual toggle</li>
        <li><strong>Responsive design</strong> that works on mobile devices and tablets</li>
        <li><strong>Clear link purpose</strong> with descriptive link text (no "click here")</li>
        <li><strong>Consistent navigation</strong> across all pages</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Known Issues</h2>
      <p>We continuously work to improve accessibility. Currently identified issues include:</p>
      <ul>
        <li>Some decorative badge elements on the Technologies page and select exhibits have color contrast slightly below 4.5:1 in light mode. These are cosmetic elements that do not impact access to core content.</li>
      </ul>
      <p>These issues are documented and scheduled for remediation.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Feedback and Contact</h2>
      <p>We welcome feedback on the accessibility of Pattern 158 Solutions. If you encounter accessibility barriers on this website, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:dan@pattern158.solutions">dan@pattern158.solutions</a></li>
        <li><strong>Contact Page:</strong> <router-link to="/contact">Contact Dan Novak</router-link></li>
      </ul>
      <p>We aim to respond to accessibility feedback within 5 business days.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Technical Specifications</h2>
      <p>This website's accessibility relies on the following technologies:</p>
      <ul>
        <li>HTML5</li>
        <li>CSS3</li>
        <li>JavaScript (for theme toggle and navigation; core content accessible without JavaScript)</li>
        <li>ARIA (Accessible Rich Internet Applications) attributes for enhanced semantics</li>
      </ul>
    </div>
  </section>
</template>
