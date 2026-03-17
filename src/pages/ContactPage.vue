<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import ContactMethods from '@/components/ContactMethods.vue'
import ContactGuidance from '@/components/ContactGuidance.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-contact')
useSeo({
  title: 'Contact | Pattern 158 - Dan Novak',
  description: 'Get in touch with Dan Novak for systems architecture, legacy rescue, and AI implementation consulting.',
  path: '/contact',
})
</script>

<template>
  <HeroMinimal title="Get in Touch" subtitle="Let's talk about your project" />
  <ContactMethods />
  <ContactGuidance />
  <section class="testimonial">
    <div class="container">
      <TestimonialQuote
        quote="You have helped us move the bar to better, more accessible courses and helped me learn a ton."
        cite="Program Manager, Microsoft Account"
        context="GP Strategies &mdash; Microsoft accessibility initiative"
      />
      <TestimonialQuote
        quote="Dan is the expert on LMS communication."
        cite="Software Engineer"
        context="GP Strategies &mdash; Enterprise LMS integration"
        variant="secondary"
      />
    </div>
  </section>
</template>
