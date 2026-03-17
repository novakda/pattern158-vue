import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ContactPage from './ContactPage.vue'

const meta = {
  title: 'Pages/ContactPage',
  component: ContactPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile375: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile375',
      viewports: {
        mobile375: { name: 'Mobile 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
}

export const Tablet768: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet768',
      viewports: {
        tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
      },
    },
  },
}

export const Desktop1280: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop1280',
      viewports: {
        desktop1280: { name: 'Desktop 1280', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
}
