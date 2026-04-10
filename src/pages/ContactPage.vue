<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import RoleFitSection from '@/components/RoleFitSection.vue'
import CompanyFitSection from '@/components/CompanyFitSection.vue'
import CultureFitSection from '@/components/CultureFitSection.vue'
import CompensationTable from '@/components/CompensationTable.vue'
import ContactMethods from '@/components/ContactMethods.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { hero, colleagueQuotes } from '@/content/contact'

useBodyClass('page-contact')
useSeo({
  title: 'Work With Me | Pattern 158 - Dan Novak',
  description: 'Senior software engineer seeking roles where integration architecture, forensic methodology, and 28+ years of JavaScript depth make the biggest impact. Here\'s what I\'m looking for.',
  path: '/contact',
})
</script>

<template>
  <HeroMinimal :title="hero.title" :subtitle="hero.subtitle" />
  <RoleFitSection />
  <CompanyFitSection />
  <CultureFitSection />
  <CompensationTable />
  <ContactMethods />
  <section class="testimonial">
    <div class="container">
      <TestimonialQuote
        v-for="q in colleagueQuotes"
        :key="q.quote"
        :quote="q.quote"
        :cite="q.cite"
        :context="q.context"
        :variant="q.variant"
      />
    </div>
  </section>
</template>
