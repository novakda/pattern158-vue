import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PersonnelCard from './PersonnelCard.vue'

const meta = {
  title: 'Components/PersonnelCard',
  component: PersonnelCard,
} satisfies Meta<typeof PersonnelCard>

export default meta
type Story = StoryObj<typeof meta>

export const NamedPerson: Story = {
  args: {
    personnel: [
      {
        name: 'Jane Smith',
        title: 'Program Manager',
        organization: 'Client Corp',
        role: 'Project oversight',
      },
      {
        name: 'Robert Chen',
        title: 'Senior Developer',
        organization: 'Acme Technologies',
        role: 'Technical implementation',
      },
    ],
  },
}

export const AnonymousPerson: Story = {
  args: {
    personnel: [
      {
        title: 'Program Manager',
        organization: 'GP Strategies',
        role: 'Coordinated engagement',
      },
      {
        title: 'Quality Analyst',
        organization: 'Client Corp',
      },
    ],
  },
}

export const SelfHighlighted: Story = {
  args: {
    personnel: [
      {
        name: 'Dan Novak',
        title: 'Technical Lead',
        organization: 'GP Strategies',
        isSelf: true,
      },
      {
        name: 'Jane Smith',
        title: 'Program Manager',
        organization: 'Client Corp',
      },
    ],
  },
}
