<script setup lang="ts">
import MethodologyStep from '@/components/MethodologyStep.vue'
import { methodologySteps } from '@/data/methodologySteps'
</script>

<template>
  <section id="how-i-work" class="content-section">
    <h2>How I Work</h2>
    <p class="section-intro">The three-step pattern that repeats across every project:</p>
    <ol class="methodology-steps">
      <MethodologyStep v-for="s in methodologySteps" :key="s.title" :step="s" />
    </ol>
    <p class="methodology-note">This isn't marketing copy &mdash; it's the actual pattern from
      <router-link to="/exhibits/exhibit-j" class="link-primary">GM course completion investigation</router-link>,
      <router-link to="/exhibits/exhibit-e" class="link-primary">cross-domain SCORM framework</router-link>,
      <router-link to="/exhibits/exhibit-m" class="link-primary">SCORM Debugger</router-link>,
      legacy CMS rescue, and
      <router-link to="/exhibits/exhibit-l" class="link-primary">Power Platform analysis</router-link>.
    </p>
  </section>
</template>
