import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CultureFitSection from './CultureFitSection.vue'

const meta = {
  title: 'Components/CultureFitSection',
  component: CultureFitSection,
} satisfies Meta<typeof CultureFitSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
