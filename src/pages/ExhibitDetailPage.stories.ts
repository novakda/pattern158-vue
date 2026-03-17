import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createRouter, createWebHashHistory } from 'vue-router'
import ExhibitDetailPage from './ExhibitDetailPage.vue'

function makeExhibitRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/exhibits/:slug',
        component: ExhibitDetailPage,
        name: 'exhibit-detail',
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: { template: '<div>Not Found</div>' },
      },
    ],
  })
  router.push('/exhibits/exhibit-a')
  return router
}

const meta = {
  title: 'Pages/ExhibitDetailPage',
  component: ExhibitDetailPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (story: any) => ({
      components: { story },
      setup() {
        return { router: makeExhibitRouter() }
      },
      template: '<router-view v-if="false" /><story />',
    }),
  ],
} satisfies Meta<typeof ExhibitDetailPage>

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
