import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FlagshipCard from './FlagshipCard.vue'

const meta = {
  title: 'Components/FlagshipCard',
  component: FlagshipCard,
} satisfies Meta<typeof FlagshipCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    flagship: {
      label: 'Exhibit A',
      client: 'General Dynamics Electric Boat',
      title: 'Cross-Domain SCORM Resolution & Embedded Technical Advisory',
      date: '2015\u20132022',
      exhibitType: 'engineering-brief',
      emailCount: '574 emails',
      role: 'Cross-domain SCORM architecture, Flash remediation, 7-year embedded technical advisory',
      summary: 'Diagnosed and resolved cross-domain SCORM communication failures caused by Electric Boat\'s split LMS/content server architecture. Deployed custom SCORM wrapper using postMessage to bypass same-origin policy constraints.',
      impactTags: ['SCORM', 'Cross-Domain', 'easyXDM', 'Cornerstone'],
      quotes: [
        {
          text: 'Dan\'s technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues, one that will have a direct impact on the Flash conversion process.',
          attribution: 'Chief of Learning Services, Electric Boat',
        },
      ],
      exhibitLink: '/exhibits/exhibit-a',
      isFlagship: true,
    },
  },
}

export const WithoutQuote: Story = {
  args: {
    flagship: {
      label: 'Exhibit J',
      client: 'General Motors',
      title: 'Course Completion Investigation',
      date: '2015\u20132019',
      exhibitType: 'investigation-report',
      emailCount: '618 emails',
      role: 'NTSB-style forensic analysis \u2014 systems thinking over code debugging',
      summary: 'Investigated 19% course incompletion rate (4x baseline). Multi-angle investigation revealed five concurrent systemic failures including memory cache vulnerability and confusing navigation.',
      impactTags: ['Forensic Analysis', 'SCORM', 'UX Research', 'Systems Thinking'],
      exhibitLink: '/exhibits/exhibit-j',
      isFlagship: true,
    },
  },
}

export const WithoutExhibitLink: Story = {
  args: {
    flagship: {
      label: 'Sample',
      client: 'Sample Client',
      title: 'Sample Project Title',
      date: '2020\u20132021',
      exhibitType: 'engineering-brief',
      role: 'Technical consulting and system integration',
      summary: 'Example flagship card without an exhibit link to verify layout renders correctly when optional fields are absent.',
      impactTags: ['Consulting', 'Integration'],
      exhibitLink: '/exhibits/sample',
    },
  },
}
