<script setup lang="ts">
import type { Exhibit } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

defineProps<{
  flagship: Exhibit
}>()
</script>

<template>
  <div class="flagship-card">
    <div class="flagship-header">
      <h3 class="flagship-client">{{ flagship.client }}</h3>
      <span class="flagship-title">{{ flagship.title }}</span>
    </div>
    <div class="flagship-meta">
      <span class="flagship-dates">{{ flagship.date }}</span>
      <span v-if="flagship.emailCount" class="email-badge">{{ flagship.emailCount }}</span>
    </div>
    <p class="flagship-role">{{ flagship.role }}</p>
    <p class="flagship-summary">{{ flagship.summary }}</p>
    <TechTags :tags="flagship.impactTags" />
    <blockquote v-if="flagship.quotes?.length" class="flagship-quote">
      <p>&#x201C;{{ flagship.quotes[0].text }}&#x201D;</p>
    </blockquote>
    <router-link :to="flagship.exhibitLink" class="exhibit-link">Full Investigation Report &#x2192;</router-link>
  </div>
</template>
