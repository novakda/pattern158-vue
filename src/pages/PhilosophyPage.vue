<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import BrandElement from '@/components/BrandElement.vue'
import InfluenceArticle from '@/components/InfluenceArticle.vue'
import AiClaritySection from '@/components/AiClaritySection.vue'
import Pattern158OriginSection from '@/components/Pattern158OriginSection.vue'
import HowIWorkSection from '@/components/HowIWorkSection.vue'
import { brandElements } from '@/data/brandElements'
import { philosophyInfluences } from '@/data/philosophyInfluences'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-philosophy')
useSeo({
  title: 'Philosophy | Pattern 158 - Dan Novak',
  description: 'The philosophy behind Pattern 158 Solutions. How Dan Novak approaches complex system challenges with investigation-driven methodology and five core influences.',
  path: '/philosophy',
})
</script>

<template>
  <HeroMinimal title="Philosophy" subtitle="How I think about engineering problems" />

  <section id="brand-elements" class="content-section">
    <h2>The Brand Elements</h2>
    <p class="section-intro">Six patterns extracted from 28+ years of actual work &mdash; not marketing slogans, but recurring themes from real projects.</p>
    <dl class="brand-elements-list">
      <BrandElement v-for="b in brandElements" :key="b.title" :element="b" />
    </dl>
  </section>

  <HowIWorkSection />
  <AiClaritySection />
  <Pattern158OriginSection />

  <section id="influences" class="content-section">
    <h2>Five Core Influences</h2>
    <p class="section-intro">These aren't abstract inspirations &mdash; they're specific sources that shaped how I think about engineering problems.</p>
    <InfluenceArticle v-for="inf in philosophyInfluences" :key="inf.title" :influence="inf" />
  </section>

  <section class="testimonial testimonial-divider">
    <div class="container">
      <h2 class="section-heading-styled">What Colleagues Say</h2>
      <TestimonialQuote
        quote="Thank you so much for Dan for putting time into thinking this through and writing it up."
        cite="Program Manager, Microsoft Account"
        context="GP Strategies &mdash; on a SCORM architecture analysis document"
      />
      <TestimonialQuote
        quote="Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise."
        cite="Account Manager, GP Strategies"
        context="Entergy engagement &mdash; on cross-team collaboration"
        variant="secondary"
      />
    </div>
  </section>
</template>
