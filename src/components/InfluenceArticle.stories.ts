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
      title: 'Air Crash Investigation',
      sources: 'Mayday / Air Crash Investigation (TV), Mentour Pilot (YouTube), 74 Gear (YouTube)',
      paragraphs: [
        'The NTSB doesn\u2019t arrive at a crash site and blame the pilot. They reconstruct the full causal chain \u2014 what the system allowed, what the design encouraged, what the training didn\u2019t cover, what the weather added.',
        'I run every significant investigation the same way. The GM course completion spike looked like a tracking bug. It wasn\u2019t. Three contributing factors had to align for the failure to occur.',
        'The method: reconstruct before you diagnose. Diagnose before you fix.',
      ],
    },
  },
}

export const TextOnly: Story = {
  args: {
    influence: {
      title: '\u201cI Seek Knowledge Not for Gain, But to Better Understand Myself\u201d',
      sources: 'Harry Potter fanfic \u2014 password to the Department of Mysteries',
      paragraphs: [
        'I don\u2019t reverse-engineer a legacy CMS to fix bugs. I do it to understand the mind of the engineer who built it.',
        'The knowledge isn\u2019t the goal. The understanding is.',
      ],
    },
  },
}
