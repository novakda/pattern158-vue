<script setup lang="ts">
import type { Finding } from '@/data/findings'
import TechTags from '@/components/TechTags.vue'

defineProps<{
  finding: Finding
}>()
</script>

<template>
  <article class="finding-card">
    <div class="finding-header">
      <span class="finding-label">&#x26A0; FINDING {{ finding.number }}</span>
      <h3 class="finding-title">{{ finding.title }}</h3>
    </div>
    <p class="finding-meta">{{ finding.meta }}</p>

    <div class="finding-section">
      <h4>Analysis</h4>
      <p>{{ finding.analysis }}</p>
    </div>

    <div class="finding-section">
      <h4>Solution</h4>
      <p>{{ finding.solution }}</p>
    </div>

    <div class="finding-section">
      <h4>Outcome</h4>
      <p>
        {{ finding.outcome }}
        <router-link v-if="finding.link" :to="finding.link" class="link-primary">
          Full investigation report &#x2192;
        </router-link>
      </p>
    </div>

    <TechTags :tags="finding.tags" />
  </article>
</template>
