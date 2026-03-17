import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InfluencesList from './InfluencesList.vue'

const meta = {
  title: 'Components/InfluencesList',
  component: InfluencesList,
} satisfies Meta<typeof InfluencesList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    influences: [
      {
        term: '1. Air Crash Investigation',
        segments: [
          { text: 'Applied to the ' },
          {
            text: '',
            link: { text: 'GM course completion investigation', to: '/exhibits/exhibit-j' },
          },
          {
            text: ': a 4x spike in incomplete rates traced to fragile LMS architecture, misleading navigation, and mismatched real-world usage patterns.',
          },
        ],
      },
      {
        term: '2. Speedrunning / TASBot',
        segments: [
          { text: 'Applied to build a ' },
          {
            text: '',
            link: { text: 'SCORM debugging tool', to: '/exhibits/exhibit-m' },
          },
          { text: ' that reduced QA cycles from hours to minutes using emulator save-state methodology.' },
        ],
      },
      {
        term: '3. "You want to cheat, cheat fair—anything I hate is a crookin\' crook."',
        segments: [
          {
            text: '—Moe Howard, "Healthy, Wealthy and Dumb" (1938). The source of the tagline. If you\'ve found an elegant shortcut, document it, share it, build it properly. ',
          },
          {
            text: '',
            link: { text: 'Full philosophy →', to: '/philosophy#influences' },
          },
        ],
      },
    ],
  },
}

export const SingleInfluence: Story = {
  args: {
    influences: [
      {
        term: '4. Mentour Pilot',
        segments: [
          {
            text: 'The model for AI as a force multiplier: domain expert + AI assistant = better analysis than either alone.',
          },
        ],
      },
    ],
  },
}
