import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InfluenceArticle from './InfluenceArticle.vue'

const meta = {
  title: 'Components/InfluenceArticle',
  component: InfluenceArticle,
} satisfies Meta<typeof InfluenceArticle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    influence: {
      title: '1. Air Crash Investigation Methodology',
      sources: 'Mayday (Air Crash Investigation TV), Mentour Pilot (YouTube), 74 Gear (YouTube)',
      lesson: 'Never blame the human first \u2014 look at system design. The Swiss cheese model: disasters require contributing factors aligning. Root cause vs. proximate cause.',
      applicationParts: [
        'The ',
        { to: '/exhibits/exhibit-j', text: 'GM course completion investigation' },
        ' is the textbook example. GM reported a 4x spike in incomplete courses and assumed a tracking bug. I ran an NTSB-style investigation \u2014 the root cause wasn\u2019t a single bug; fragile architecture, confusing navigation, and sales reps on poor WiFi aligned to create the failure pattern.',
      ],
    },
  },
}

export const TextOnly: Story = {
  args: {
    influence: {
      title: '3. Forensic Engineering Mindset',
      sources: 'NTSB accident reports, IEEE failure analysis papers',
      lesson: 'Systematic investigation reveals root causes that surface-level debugging misses. Document findings; the next investigator benefits from your trail.',
      applicationParts: [
        'Applied across all client engagements \u2014 every investigation produces a documented trail that outlasts the immediate fix.',
      ],
    },
  },
}
