<script setup lang="ts">
import type { FaqItem } from '@/types/faq'

const props = defineProps<{
  item: FaqItem
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()

const answerId = `faq-answer-${props.item.id}`
</script>

<template>
  <div class="faq-accordion-item" :class="{ 'is-open': isOpen }">
    <h3 class="faq-accordion-heading">
      <button
        type="button"
        class="faq-accordion-trigger"
        :aria-expanded="isOpen"
        :aria-controls="answerId"
        @click="$emit('toggle')"
      >
        <span class="faq-accordion-question">{{ item.question }}</span>
        <span class="faq-accordion-icon" aria-hidden="true"></span>
      </button>
    </h3>

    <div class="faq-category-pills">
      <span
        v-for="cat in item.categories"
        :key="cat"
        class="faq-category-pill"
      >{{ cat }}</span>
    </div>

    <div
      :id="answerId"
      role="region"
      class="faq-answer"
      :hidden="!isOpen || undefined"
      :aria-labelledby="`faq-trigger-${item.id}`"
    >
      <p v-for="(paragraph, i) in item.answer.split('\n\n')" :key="i">{{ paragraph }}</p>
    </div>
  </div>
</template>

<style scoped>
.faq-accordion-item {
  border-top: 1px solid var(--color-border, #e2e2e2);
}

.faq-accordion-item:last-child {
  border-bottom: 1px solid var(--color-border, #e2e2e2);
}

.faq-accordion-heading {
  margin: 0;
  font-size: var(--font-size-base);
}

.faq-accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-md) 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  gap: var(--space-md);
}

.faq-accordion-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.faq-accordion-question {
  flex: 1;
}

.faq-accordion-icon {
  flex-shrink: 0;
  font-size: var(--font-size-xl);
  line-height: 1;
  transition: transform 0.2s ease;
}

.faq-accordion-icon::after {
  content: '+';
}

.is-open .faq-accordion-icon {
  transform: rotate(45deg);
}

.faq-category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  padding-bottom: var(--space-sm);
}

.faq-category-pill {
  font-family: var(--font-mono, monospace);
  font-size: var(--font-size-xs);
  padding: 2px var(--space-xs);
  background: var(--color-inverse);
  color: var(--color-inverse-text);
  border-radius: 3px;
}

.faq-answer {
  padding-bottom: var(--space-lg);
}

.faq-answer p {
  margin: 0 0 var(--space-sm) 0;
  line-height: 1.6;
  color: var(--color-text);
}

.faq-answer p:last-child {
  margin-bottom: 0;
}
</style>
