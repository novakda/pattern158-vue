<script setup lang="ts">
import type { Flagship } from '@/data/portfolioFlagships'
import TechTags from '@/components/TechTags.vue'

defineProps<{
  flagship: Flagship
}>()
</script>

<template>
  <div class="flagship-card">
    <div class="flagship-header">
      <h3 class="flagship-client">{{ flagship.client }}</h3>
      <span class="flagship-title">{{ flagship.title }}</span>
    </div>
    <div class="flagship-meta">
      <span class="flagship-dates">{{ flagship.dates }}</span>
      <span v-if="flagship.emailCount" class="email-badge">{{ flagship.emailCount }}</span>
    </div>
    <p class="flagship-role">{{ flagship.role }}</p>
    <p class="flagship-summary">{{ flagship.summary }}</p>
    <TechTags :tags="flagship.tags" />
    <blockquote v-if="flagship.quote" class="flagship-quote">
      <p>&#x201C;{{ flagship.quote.text }}&#x201D;</p>
    </blockquote>
    <router-link :to="flagship.exhibitLink" class="exhibit-link">Full Investigation Report &#x2192;</router-link>
  </div>
</template>
