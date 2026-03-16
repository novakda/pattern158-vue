<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'theme'
const THEME_ATTR = 'data-theme'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.getAttribute(THEME_ATTR) === 'dark'

  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return
    const dark = e.newValue === 'dark'
    isDark.value = dark
    applyTheme(dark)
  })

  // System preference change (respects manual override)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try { if (localStorage.getItem(STORAGE_KEY) !== null) return } catch {}
    isDark.value = e.matches
    applyTheme(e.matches)
  })
})

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute(THEME_ATTR, 'dark')
  } else {
    document.documentElement.removeAttribute(THEME_ATTR)
  }
}

function toggle() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  try { localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light') } catch {}
}
</script>

<template>
  <button
    id="theme-toggle"
    class="theme-toggle"
    type="button"
    aria-label="Toggle dark mode"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggle"
  >
    <svg class="icon-sun" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="icon-moon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <span class="sr-only">Toggle dark mode</span>
  </button>
</template>
