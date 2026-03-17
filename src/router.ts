import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/HomePage.vue') },
  { path: '/philosophy', component: () => import('./pages/PhilosophyPage.vue') },
  { path: '/faq', component: () => import('./pages/FaqPage.vue') },
  { path: '/technologies', component: () => import('./pages/TechnologiesPage.vue') },
  { path: '/portfolio', component: () => import('./pages/PortfolioPage.vue') },
  { path: '/contact', component: () => import('./pages/ContactPage.vue') },
  { path: '/testimonials', component: () => import('./pages/TestimonialsPage.vue') },
  { path: '/accessibility', component: () => import('./pages/AccessibilityPage.vue') },
  { path: '/review', component: () => import('./pages/ReviewPage.vue') },
  { path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
]
