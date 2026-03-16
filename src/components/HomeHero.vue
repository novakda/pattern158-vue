<script setup lang="ts">
import PatternVisual from '@/components/PatternVisual.vue'
import CtaButtons from '@/components/CtaButtons.vue'

defineProps<{
  techPills: string[]
}>()
</script>

<template>
  <section class="hero">
    <div class="container">
      <p class="hero-brand">PATTERN 158</p>
      <h1>Dan Novak</h1>
      <p class="hero-subtitle">Senior Software Engineer | Systems Architect</p>
      <p class="hero-availability">Available for new opportunities</p>

      <div class="hero-tech-pills">
        <span v-for="pill in techPills" :key="pill" class="tech-pill">{{ pill }}</span>
      </div>

      <PatternVisual />

      <p class="tagline">I cheat, but I cheat fair.</p>

      <CtaButtons
        primary-label="Get in Touch"
        primary-to="/contact"
        secondary-label="View My Work"
        secondary-to="/portfolio"
      />
    </div>
  </section>
</template>
