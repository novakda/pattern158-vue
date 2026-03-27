import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CompanyFitSection from './CompanyFitSection.vue'

const meta = {
  title: 'Components/CompanyFitSection',
  component: CompanyFitSection,
} satisfies Meta<typeof CompanyFitSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
