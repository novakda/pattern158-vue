<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'

const FeedbackCollector = import.meta.env.MODE !== 'production'
  ? defineAsyncComponent(() => import('@/components/feedback/FeedbackCollector.vue'))
  : null
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
  <FeedbackCollector v-if="FeedbackCollector" />
</template>
