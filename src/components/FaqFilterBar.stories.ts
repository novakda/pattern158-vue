import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FaqFilterBar from './FaqFilterBar.vue'

const meta = {
  title: 'Components/FaqFilterBar',
  component: FaqFilterBar,
} satisfies Meta<typeof FaqFilterBar>

export default meta
type Story = StoryObj<typeof meta>

const allCategories = [
  { id: 'hiring', heading: 'Hiring Logistics', intro: 'Availability, rates, and work arrangements' },
  { id: 'expertise', heading: 'Technical Expertise', intro: 'Technologies' },
  { id: 'approach', heading: 'Approach & Methodology', intro: 'How problems get solved' },
  { id: 'architecture', heading: 'Architecture & Systems', intro: 'System design' },
  { id: 'legacy', heading: 'Legacy Modernization', intro: 'Rescuing systems' },
  { id: 'collaboration', heading: 'Collaboration & Communication', intro: 'Working style' },
  { id: 'ai-tooling', heading: 'AI & Tooling', intro: 'AI-assisted development' },
]

const sampleCounts: Record<string, number> = {
  hiring: 5,
  expertise: 4,
  approach: 4,
  architecture: 3,
  legacy: 3,
  collaboration: 3,
  'ai-tooling': 2,
}

export const AllSelected: Story = {
  args: {
    categories: allCategories,
    activeFilter: null,
    counts: sampleCounts,
    totalCount: 24,
  },
}

export const CategoryActive: Story = {
  args: {
    categories: allCategories,
    activeFilter: 'expertise',
    counts: sampleCounts,
    totalCount: 24,
  },
}

export const SingleResult: Story = {
  args: {
    categories: allCategories,
    activeFilter: 'ai-tooling',
    counts: { ...sampleCounts, 'ai-tooling': 1 },
    totalCount: 24,
  },
}
