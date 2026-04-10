<script setup lang="ts">
import { aiClarity } from '@/content/sections/aiClarity'
</script>

<template>
  <section id="ai-and-clarity" class="content-section">
    <h2>{{ aiClarity.heading }}</h2>
    <p class="section-intro">{{ aiClarity.intro }}</p>
    <div class="origin-story">
      <p v-for="(para, i) in aiClarity.paragraphs" :key="i">{{ para }}</p>
      <p class="methodology-note">{{ aiClarity.methodologyNote }}</p>
    </div>
  </section>
</template>
