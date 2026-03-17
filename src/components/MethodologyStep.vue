<script setup lang="ts">
import type { MethodologyStep } from '@/data/methodologySteps'

defineProps<{
  step: MethodologyStep
}>()
</script>

<template>
  <li>
    <h3>{{ step.title }}</h3>
    <p>{{ step.description }}</p>
  </li>
</template>
