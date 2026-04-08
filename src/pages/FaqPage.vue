<script setup lang="ts">
import { ref, computed } from 'vue'
import HeroMinimal from '@/components/HeroMinimal.vue'
import FaqAccordionItem from '@/components/FaqAccordionItem.vue'
import FaqFilterBar from '@/components/FaqFilterBar.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { faqItems, faqCategories } from '@/data/faq'
import type { FaqCategory } from '@/types/faq'

useBodyClass('page-faq')
useSeo({
  title: 'FAQ | Pattern 158 - Dan Novak',
  description: 'Frequently asked questions about hiring Dan Novak. Covers availability, technical expertise, working style, rates, and engagement process for consulting work.',
  path: '/faq',
})

const openItems = ref<Set<string>>(new Set())
const activeFilter = ref<string | null>(null)

function toggleItem(id: string) {
  const next = new Set(openItems.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  openItems.value = next
}

function handleFilterChange(value: string | null) {
  activeFilter.value = value
}

const filteredItems = computed(() => {
  if (activeFilter.value === null) return faqItems
  return faqItems.filter(item => item.categories.includes(activeFilter.value!))
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const cat of faqCategories) {
    counts[cat.id] = faqItems.filter(item => item.categories.includes(cat.id)).length
  }
  return counts
})
</script>

<template>
  <HeroMinimal
    title="Frequently Asked Questions"
    subtitle="Common questions about working with Dan Novak"
  />

  <section class="faq-section" aria-label="FAQ list">
    <div class="faq-container">
      <FaqFilterBar
        :categories="(faqCategories as unknown as FaqCategory[])"
        :active-filter="activeFilter"
        :counts="categoryCounts"
        :total-count="faqItems.length"
        @filter-change="handleFilterChange"
      />

      <div class="faq-list">
        <FaqAccordionItem
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-open="openItems.has(item.id)"
          @toggle="toggleItem(item.id)"
        >
          <div
            v-if="item.exhibitNote"
            class="exhibit-callout"
          >
            <component
              :is="item.exhibitUrl ? 'router-link' : 'span'"
              v-bind="item.exhibitUrl ? { to: item.exhibitUrl } : {}"
              class="exhibit-callout-content"
              :class="{ 'exhibit-callout-link': !!item.exhibitUrl }"
            >
              <span aria-hidden="true">&rarr;</span> {{ item.exhibitNote }}
            </component>
          </div>
        </FaqAccordionItem>
      </div>
    </div>
  </section>

  <section class="testimonial testimonial-divider">
    <div class="container">
      <h2 class="section-heading-styled">What Colleagues Say</h2>
      <TestimonialQuote
        quote="It's always so nice working with you and having you send these notes so that the developer can get going is helpful and appreciated."
      />
      <TestimonialQuote
        quote="Thank you so much for your efforts in preparing this proposal. It looks fantastic."
        cite="Director, Accessibility Practice"
        context="GP Strategies — on an accessibility initiative proposal"
        variant="secondary"
      />
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  padding: var(--space-xl) var(--space-md);
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-list {
  margin-top: var(--space-lg);
}

.exhibit-callout {
  margin-top: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--color-accent, #8f6d00);
  background: var(--color-primary-subtle, rgba(14, 124, 140, 0.08));
  border-radius: 0 3px 3px 0;
}

.exhibit-callout-content {
  font-size: var(--font-size-sm);
  color: var(--color-accent, #8f6d00);
  font-family: var(--font-mono, monospace);
  line-height: 1.5;
}

.exhibit-callout-link {
  text-decoration: none;
  display: block;
}

.exhibit-callout-link:hover {
  text-decoration: underline;
}

.exhibit-callout-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
