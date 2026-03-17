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
      client: 'General Dynamics Electric Boat',
      title: 'Exhibit A: Electric Boat LMS Integration',
      dates: '2015\u20132022',
      emailCount: '574 emails',
      role: 'Cross-domain SCORM architecture, Flash remediation, 7-year embedded technical advisory',
      summary: 'Diagnosed and resolved cross-domain SCORM communication failures caused by Electric Boat\'s split LMS/content server architecture. Deployed custom SCORM wrapper using postMessage to bypass same-origin policy constraints.',
      tags: ['SCORM', 'Cross-Domain', 'easyXDM', 'Cornerstone'],
      quote: {
        text: 'Dan\'s technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues, one that will have a direct impact on the Flash conversion process.',
      },
      exhibitLink: '/exhibits/exhibit-a',
    },
  },
}

export const WithoutQuote: Story = {
  args: {
    flagship: {
      client: 'General Motors',
      title: 'Exhibit J: Course Completion Investigation',
      dates: '2015\u20132019',
      emailCount: '618 emails',
      role: 'NTSB-style forensic analysis \u2014 systems thinking over code debugging',
      summary: 'Investigated 19% course incompletion rate (4x baseline). Multi-angle investigation revealed five concurrent systemic failures including memory cache vulnerability and confusing navigation.',
      tags: ['Forensic Analysis', 'SCORM', 'UX Research', 'Systems Thinking'],
      exhibitLink: '/exhibits/exhibit-j',
    },
  },
}

export const WithoutExhibitLink: Story = {
  args: {
    flagship: {
      client: 'Sample Client',
      title: 'Sample Project Title',
      dates: '2020\u20132021',
      role: 'Technical consulting and system integration',
      summary: 'Example flagship card without an exhibit link to verify layout renders correctly when optional fields are absent.',
      tags: ['Consulting', 'Integration'],
      exhibitLink: '/exhibits/sample',
    },
  },
}
