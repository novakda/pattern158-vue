<script setup lang="ts">
import type { BrandElement } from '@/data/brandElements'

defineProps<{
  element: BrandElement
}>()
</script>

<template>
  <dt>{{ element.title }}</dt>
  <dd>
    <p><strong>{{ element.label }}</strong> {{ element.description }}</p>
    <p v-if="element.sourceNote" class="source-note">{{ element.sourceNote }}</p>
  </dd>
</template>
