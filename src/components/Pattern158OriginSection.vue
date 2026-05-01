<script setup lang="ts">
import { pattern158Origin } from '@/content/sections/pattern158Origin'
</script>

<template>
  <section id="pattern158-origin" class="content-section">
    <h2>{{ pattern158Origin.heading }}</h2>
    <div class="origin-story">
      <p v-for="(para, i) in pattern158Origin.paragraphs" :key="i">{{ para }}</p>
    </div>
  </section>
</template>
