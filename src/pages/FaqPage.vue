<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import FaqItem from '@/components/FaqItem.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { faqItems, faqCategories } from '@/data/faq'

useBodyClass('page-faq')
useSeo({
  title: 'FAQ | Pattern 158 - Dan Novak',
  description: 'Frequently asked questions about hiring Dan Novak. Covers availability, technical expertise, working style, rates, and engagement process for consulting work.',
  path: '/faq',
})
</script>

<template>
  <HeroMinimal
    title="Frequently Asked Questions"
    subtitle="Common questions about working with Dan Novak"
  />

  <section
    v-for="cat in faqCategories"
    :key="cat.id"
    class="faq-category"
    :aria-labelledby="`${cat.id}-heading`"
  >
    <h2 :id="`${cat.id}-heading`">{{ cat.heading }}</h2>
    <p class="category-intro">{{ cat.intro }}</p>
    <FaqItem
      v-for="item in faqItems.filter(i => i.categories.includes(cat.id))"
      :key="item.question"
      :question="item.question"
      :answer="item.answer"
    />
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
