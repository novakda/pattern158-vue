<script setup lang="ts">
import type { PhilosophyInfluence, InfluenceLink } from '@/data/philosophyInfluences'

defineProps<{
  influence: PhilosophyInfluence
}>()

function isLink(part: string | InfluenceLink): part is InfluenceLink {
  return typeof part === 'object'
}
</script>

<template>
  <article class="influence">
    <h3>{{ influence.title }}</h3>
    <p><strong>Sources:</strong> {{ influence.sources }}</p>
    <p><strong>What it taught:</strong> {{ influence.lesson }}</p>
    <p>
      <strong>Career application:</strong>
      <template v-for="(part, i) in influence.applicationParts" :key="i">
        <router-link v-if="isLink(part)" :to="part.to" class="link-primary">{{ part.text }}</router-link>
        <template v-else>{{ part }}</template>
      </template>
    </p>
  </article>
</template>
