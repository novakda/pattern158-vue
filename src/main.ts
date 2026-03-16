import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import { routes } from './router'
import './assets/css/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

const app = createApp(App)
app.use(router)
app.use(createHead())
app.mount('#app')
