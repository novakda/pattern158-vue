import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/HomePage.vue') },
  { path: '/philosophy', component: () => import('./pages/PhilosophyPage.vue') },
  { path: '/faq', component: () => import('./pages/FaqPage.vue') },
  { path: '/technologies', component: () => import('./pages/TechnologiesPage.vue') },
  { path: '/case-files', component: () => import('./pages/CaseFilesPage.vue') },
  { path: '/portfolio', redirect: '/case-files' },
  { path: '/testimonials', redirect: '/case-files' },
  { path: '/contact', component: () => import('./pages/ContactPage.vue') },
  { path: '/accessibility', component: () => import('./pages/AccessibilityPage.vue') },
  { path: '/review', component: () => import('./pages/ReviewPage.vue') },
  { path: '/diag/personnel', component: () => import('./pages/PersonnelDiagPage.vue') },
  { path: '/exhibits/:slug', component: () => import('./pages/ExhibitDetailPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
]
