<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) {
    closeMenu()
  }
}

function onResize() {
  if (window.innerWidth > 768) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEscape)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEscape)
  window.removeEventListener('resize', onResize)
})

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/philosophy', label: 'Philosophy' },
  { to: '/faq', label: 'FAQ' },
  { to: '/technologies', label: 'Technologies' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/case-files', label: 'Case Files' },
  { to: '/tools', label: 'Tools' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <nav aria-label="Main navigation">
    <div class="container">
      <router-link to="/" class="logo-link">
        <img
          src="/assets/images/logos/pattern158_logo_3pipes_detailed.png"
          alt="Pattern 158 - Provider of Clarity"
          class="logo-img"
          width="88"
          height="48"
        >
      </router-link>

      <button
        class="hamburger"
        :class="{ 'is-active': menuOpen }"
        type="button"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="nav-menu"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>

      <ul id="nav-menu" class="nav-menu" :class="{ 'is-open': menuOpen }">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            :aria-current="route.path === link.to ? 'page' : undefined"
            @click="closeMenu"
          >
            {{ link.label }}
          </router-link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </div>
  </nav>
</template>
