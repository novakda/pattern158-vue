<script setup lang="ts">
import type { PhilosophyInfluence } from '@/data/philosophyInfluences'

defineProps<{
  influence: PhilosophyInfluence
}>()
</script>

<template>
  <article class="influence">
    <h3>{{ influence.title }}</h3>
    <p><em>Sources: {{ influence.sources }}</em></p>
    <p v-for="(para, i) in influence.paragraphs" :key="i">{{ para }}</p>
  </article>
</template>
