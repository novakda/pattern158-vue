import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CompensationTable from './CompensationTable.vue'

const meta = {
  title: 'Components/CompensationTable',
  component: CompensationTable,
} satisfies Meta<typeof CompensationTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
