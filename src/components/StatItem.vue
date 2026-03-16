<script setup lang="ts">
defineProps<{
  number: string
  label: string
}>()
</script>

<template>
  <div class="stat-item">
    <span class="stat-number">{{ number }}</span>
    <span class="stat-label">{{ label }}</span>
  </div>
</template>
