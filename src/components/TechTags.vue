<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/components/TechTags.types'

export { Tag }

const props = defineProps<{
  tags: (Tag | string)[]
}>()

const normalizedTags = computed<Tag[]>(() =>
  props.tags.map(t => typeof t === 'string' ? { label: t, title: t } : t)
)
</script>

<template>
  <div class="tech-tags">
    <span v-for="tag in normalizedTags" :key="tag.label" class="impact-tag" :title="tag.title">{{ tag.label }}</span>
  </div>
</template>
