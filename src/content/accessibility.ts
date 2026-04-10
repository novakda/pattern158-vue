export interface DefinitionListItem {
  term: string
  description: string
}

export interface LabeledBullet {
  label: string
  body: string
}

export const hero = {
  title: 'Accessibility Statement',
  lead: 'Pattern 158 Solutions is committed to ensuring digital accessibility for all users.',
}

export const commitment = {
  heading: 'Commitment to Accessibility',
  body: 'Pattern 158 Solutions is dedicated to making this website accessible to the widest possible audience, including individuals with disabilities. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard.',
}

export const standards = {
  heading: 'Standards and Conformance',
  intro: 'This website has been designed and tested to meet the following accessibility standards:',
  bullets: [
    { label: 'WCAG 2.1 Level AA', body: 'Web Content Accessibility Guidelines version 2.1, conformance level AA' },
    { label: 'Semantic HTML5', body: 'Proper use of landmark elements, heading hierarchy, and ARIA attributes' },
    { label: 'Keyboard Navigation', body: 'All functionality accessible via keyboard without mouse' },
    { label: 'Screen Reader Compatibility', body: 'Tested for compatibility with common assistive technologies' },
  ] satisfies LabeledBullet[],
}

export const testing = {
  heading: 'Accessibility Testing',
  intro: 'We employ multiple testing methodologies to ensure accessibility compliance:',
  methods: [
    { term: 'Automated Testing', description: 'axe-core automated accessibility engine running on all 22 pages in both light and dark themes. Tests cover WCAG 2.1 Level A and AA success criteria.' },
    { term: 'Manual Testing', description: 'Keyboard navigation testing of all interactive elements. Visual inspection of color contrast, heading hierarchy, and semantic structure.' },
    { term: 'Cross-Browser Validation', description: 'Functional testing on Chromium-based browsers (Chrome, Edge) and Firefox to ensure consistent experience across browsers.' },
    { term: 'Viewport Testing', description: 'Responsive design validated at desktop (1200px) and mobile (375px) viewports with full screenshot evidence.' },
  ] satisfies DefinitionListItem[],
}

export const currentStatus = {
  heading: 'Current Status',
  lastVerifiedLabel: 'Last Verified:',
  lastVerifiedValue: 'February 21, 2026',
  testResultsLabel: 'Test Results:',
  results: [
    'Dark mode: 21/21 pages pass all WCAG 2.1 AA automated tests (100% compliance)',
    'Light mode: Substantially compliant with minor cosmetic exceptions',
    'Semantic structure: 100% compliant across all pages',
    'Keyboard navigation: 100% compliant across all pages',
    'Cross-browser: Validated on Chromium and Firefox',
  ],
}

export const browsers = {
  heading: 'Browsers and Assistive Technologies',
  browsersIntro: 'This website has been tested with the following browsers:',
  browserList: [
    'Chrome (latest version)',
    'Microsoft Edge (latest version)',
    'Firefox (latest version)',
  ],
  assistiveIntro: 'The site is designed to work with assistive technologies including:',
  assistiveList: [
    'Screen readers (NVDA, JAWS, VoiceOver)',
    'Keyboard-only navigation',
    'Voice control software',
    'Browser zoom and text resizing up to 200%',
  ],
}

export const features = {
  heading: 'Accessibility Features',
  intro: 'This website includes the following accessibility features:',
  bullets: [
    { label: 'Skip to main content', body: 'link at the top of every page for keyboard users' },
    { label: 'Semantic HTML landmarks', body: '(header, nav, main, footer) for screen reader navigation' },
    { label: 'Proper heading hierarchy', body: '(h1 \u2192 h2 \u2192 h3) with no skipped levels' },
    { label: 'Alternative text', body: 'for all meaningful images' },
    { label: 'High contrast ratios', body: 'between text and background (minimum 4.5:1 for normal text)' },
    { label: 'Visible focus indicators', body: 'for keyboard navigation (4.5:1 contrast ratio)' },
    { label: 'Dark mode support', body: 'respecting system preferences and manual toggle' },
    { label: 'Responsive design', body: 'that works on mobile devices and tablets' },
    { label: 'Clear link purpose', body: 'with descriptive link text (no \u201Cclick here\u201D)' },
    { label: 'Consistent navigation', body: 'across all pages' },
  ] satisfies LabeledBullet[],
}

export const knownIssues = {
  heading: 'Known Issues',
  intro: 'We continuously work to improve accessibility. Currently identified issues include:',
  issues: [
    'Some decorative badge elements on the Technologies page and select exhibits have color contrast slightly below 4.5:1 in light mode. These are cosmetic elements that do not impact access to core content.',
  ],
  outro: 'These issues are documented and scheduled for remediation.',
}

export const feedback = {
  heading: 'Feedback and Contact',
  intro: 'We welcome feedback on the accessibility of Pattern 158 Solutions. If you encounter accessibility barriers on this website, please contact us:',
  emailLabel: 'Email:',
  emailHref: 'mailto:dan@pattern158.solutions',
  emailDisplay: 'dan@pattern158.solutions',
  contactPageLabel: 'Contact Page:',
  contactPageTo: '/contact',
  contactPageDisplay: 'Contact Dan Novak',
  outro: 'We aim to respond to accessibility feedback within 5 business days.',
}

export const technicalSpecs = {
  heading: 'Technical Specifications',
  intro: 'This website\u2019s accessibility relies on the following technologies:',
  bullets: [
    'HTML5',
    'CSS3',
    'JavaScript (for theme toggle and navigation; core content accessible without JavaScript)',
    'ARIA (Accessible Rich Internet Applications) attributes for enhanced semantics',
  ],
}
