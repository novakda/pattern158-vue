<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>
    <NavBar />
  </header>
  <main id="main-content" aria-label="Main content">
    <router-view />
  </main>
  <FooterBar />
</template>
