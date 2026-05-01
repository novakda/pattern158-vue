import type { Meta, StoryObj } from '@storybook/vue3-vite'
import RoleFitSection from './RoleFitSection.vue'

const meta = {
  title: 'Components/RoleFitSection',
  component: RoleFitSection,
} satisfies Meta<typeof RoleFitSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
