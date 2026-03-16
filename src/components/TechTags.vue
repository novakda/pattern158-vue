<script setup lang="ts">
export interface Tag {
  label: string
  title: string
}

defineProps<{
  tags: Tag[]
}>()
</script>

<template>
  <div class="tech-tags">
    <span v-for="tag in tags" :key="tag.label" class="impact-tag" :title="tag.title">{{ tag.label }}</span>
  </div>
</template>
