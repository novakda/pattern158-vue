import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TechTags from './TechTags.vue'

const meta = {
  title: 'Components/TechTags',
  component: TechTags,
} satisfies Meta<typeof TechTags>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tags: [
      { label: 'BMS', title: 'Bristol-Myers Squibb' },
      { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
      { label: 'Nalco', title: 'Nalco (Ecolab)' },
      { label: 'AEP', title: 'American Electric Power' },
      { label: 'NASA', title: 'NASA' },
    ],
  },
}

export const SingleTag: Story = {
  args: {
    tags: [
      { label: 'PNC', title: 'PNC Financial Services' },
    ],
  },
}
