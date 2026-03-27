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

useBodyClass('page-contact')
useSeo({
  title: 'Work With Me | Pattern 158 - Dan Novak',
  description: 'Senior software engineer seeking roles where integration architecture, forensic methodology, and 28+ years of JavaScript depth make the biggest impact. Here\'s what I\'m looking for.',
  path: '/contact',
})
</script>

<template>
  <HeroMinimal title="Work With Me" subtitle="What I'm looking for — and what I'm not." />
  <RoleFitSection />
  <CompanyFitSection />
  <CultureFitSection />
  <CompensationTable />
  <ContactMethods />
  <section class="testimonial">
    <div class="container">
      <TestimonialQuote
        quote="Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise."
        cite="Account Manager, GP Strategies"
      />
      <TestimonialQuote
        quote="You have helped us move the bar to better, more accessible courses and helped me learn a ton."
        cite="Program Manager, Microsoft Account"
        context="GP Strategies — Microsoft accessibility initiative"
        variant="secondary"
      />
    </div>
  </section>
</template>
