import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import '../src/assets/css/main.css'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/philosophy', component: { template: '<div />' } },
    { path: '/faq', component: { template: '<div />' } },
    { path: '/technologies', component: { template: '<div />' } },
    { path: '/portfolio', component: { template: '<div />' } },
    { path: '/contact', component: { template: '<div />' } },
    { path: '/testimonials', component: { template: '<div />' } },
    { path: '/accessibility', component: { template: '<div />' } },
    { path: '/review', component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
  ],
})

setup((app) => {
  app.use(router)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
