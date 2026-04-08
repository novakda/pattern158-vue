<script setup lang="ts">
import type { FaqCategory } from '@/types/faq'

const props = defineProps<{
  categories: FaqCategory[]
  activeFilter: string | null
  counts: Record<string, number>
  totalCount: number
}>()

const emit = defineEmits<{
  'filter-change': [value: string | null]
}>()

function displayCount(): number {
  if (props.activeFilter === null) return props.totalCount
  return props.counts[props.activeFilter] ?? 0
}
</script>

<template>
  <div class="faq-filter-bar" role="group" aria-label="Filter by category">
    <div class="filter-pills">
      <button
        type="button"
        class="filter-pill"
        :class="{ active: activeFilter === null }"
        data-filter="all"
        @click="emit('filter-change', null)"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="filter-pill"
        :class="{ active: activeFilter === cat.id }"
        :data-filter="cat.id"
        @click="emit('filter-change', cat.id)"
      >
        {{ cat.heading }}
      </button>
    </div>
    <p class="filter-count" aria-live="polite">
      {{ displayCount() }} {{ displayCount() === 1 ? 'question' : 'questions' }}
    </p>
  </div>
</template>

<style scoped>
.faq-filter-bar {
  max-width: 800px;
  margin: 0 auto var(--space-lg);
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.filter-pill {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-border, #e2e2e2);
  border-radius: 3px;
  background: none;
  color: var(--color-text);
  font-family: var(--font-mono, monospace);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.filter-pill:hover {
  background: var(--color-surface-hover, #f0f0f0);
}

.filter-pill:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.filter-pill.active {
  background: var(--color-inverse);
  color: var(--color-inverse-text);
  border-color: var(--color-inverse);
}

.filter-count {
  margin: var(--space-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
