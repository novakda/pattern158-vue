<script setup lang="ts">
import { methodologySteps } from '@/content/sections/howIWork'
</script>

<template>
  <section id="how-i-work" class="content-section">
    <ol class="methodology-steps">
      <li v-for="step in methodologySteps" :key="step.heading">
        <h3>{{ step.heading }}</h3>
        <p v-for="(para, i) in step.paragraphs" :key="i">{{ para }}</p>
      </li>
    </ol>
  </section>
</template>
