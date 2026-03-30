import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ExhibitCard from './ExhibitCard.vue'

const meta = {
  title: 'Components/ExhibitCard',
  component: ExhibitCard,
} satisfies Meta<typeof ExhibitCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    exhibit: {
      label: 'Exhibit A',
      client: 'General Dynamics Electric Boat',
      date: '2015\u20132022',
      title: 'Cross-Domain SCORM Resolution & Embedded Technical Advisory',
      quotes: [
        {
          text: 'I\u2019d consider the last couple days a success, and I look forward to working with Dan in the future.',
          attribution: 'Chief of Learning Services, Metrics, Processes & Technology, Electric Boat',
        },
      ],
      resolutionTable: [
        { issue: 'SCORM courses dependent on unreliable Cornerstone network player', resolution: 'Provided cross-domain SCORM wrapper eliminating player dependency' },
        { issue: 'HTML5 courses failing under AICC protocol', resolution: 'Converted AICC to SCORM HTML5 with improved performance' },
      ],
      impactTags: ['Client-Facing', 'SCORM', 'Cornerstone LMS', 'Cross-Domain', 'Tooling'],
      exhibitLink: '/exhibits/exhibit-a',
      exhibitType: 'engineering-brief' as const,
    },
  },
}

export const WithCustomSlots: Story = {
  render: (args) => ({
    components: { ExhibitCard },
    setup() {
      return { args };
    },
    template: `
      <ExhibitCard v-bind="args">
        <template #quote>
          <blockquote class="exhibit-quote"><p>Custom quote content demonstrating named slot override.</p></blockquote>
        </template>
        <template #actions>
          <p>Custom actions section &mdash; slot composition example (COMP-04)</p>
        </template>
      </ExhibitCard>
    `,
  }),
  args: {
    exhibit: {
      label: 'Exhibit A',
      client: 'General Dynamics Electric Boat',
      date: '2015\u20132022',
      title: 'Cross-Domain SCORM Resolution & Embedded Technical Advisory',
      impactTags: ['SCORM', 'Cross-Domain'],
      exhibitLink: '/exhibits/exhibit-a',
      exhibitType: 'engineering-brief' as const,
    },
  },
}

export const WithoutLink: Story = {
  args: {
    exhibit: {
      label: 'Exhibit B',
      client: 'GP Strategies Leadership',
      date: '2018\u20132019',
      title: 'Leadership Recognition Chain: A Repeatable Pattern',
      quotes: [
        {
          text: 'Great work on this Dan, leadership is very happy with the results.',
          attribution: 'Program Manager',
          role: 'in follow-up email',
        },
      ],
      contextHeading: 'Context',
      contextText: 'GP Strategies needed a scalable recognition pattern that could be replicated across clients without custom engineering each time.',
      impactTags: ['Pattern Design', 'Leadership', 'Repeatable'],
      exhibitLink: '/exhibits/exhibit-b',
      exhibitType: 'engineering-brief' as const,
    },
  },
}

export const InvestigationReport: Story = {
  args: {
    exhibit: {
      label: 'Exhibit J',
      client: 'General Motors',
      date: '2019',
      title: 'GM Leadership Development Program: Cross-Functional Competency Framework',
      impactTags: ['Leadership', 'Competency Framework', 'Cross-Functional'],
      exhibitLink: '/exhibits/exhibit-j',
      exhibitType: 'investigation-report' as const,
    },
  },
}

export const StandardExhibit: Story = {
  args: {
    exhibit: {
      label: 'Exhibit O',
      client: 'ContentAIQ',
      date: '2024',
      title: 'AI-Augmented Content Architecture',
      impactTags: ['AI', 'Content Architecture'],
      exhibitLink: '/exhibits/exhibit-o',
      exhibitType: 'engineering-brief' as const,
    },
  },
}
