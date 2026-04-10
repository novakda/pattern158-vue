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
import {
  designThinking,
  moralSpine,
  influencesHeading,
  brandElementsHeading,
  colleagueQuotes,
  colleagueQuotesHeading,
  closingLine,
} from '@/content/philosophy'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-philosophy')
useSeo({
  title: 'Philosophy | Pattern 158 - Dan Novak',
  description: 'How Dan Novak thinks about engineering problems \u2014 the methodology, the influences, and the origin of Pattern 158.',
  path: '/philosophy',
})
</script>

<template>
  <HeroMinimal title="Philosophy" subtitle="How I think about engineering problems" />

  <Pattern158OriginSection />

  <section id="design-thinking" class="content-section">
    <h2>{{ designThinking.heading }}</h2>
    <div class="origin-story">
      <p v-for="(para, i) in designThinking.paragraphs" :key="i">{{ para }}</p>
    </div>
  </section>

  <HowIWorkSection />

  <section id="moral-spine" class="content-section">
    <h2>{{ moralSpine.heading }}</h2>
    <div class="origin-story">
      <p>{{ moralSpine.intro }}</p>
      <blockquote>
        <p>{{ moralSpine.quote.text }}</p>
        <cite>{{ moralSpine.quote.cite }}</cite>
      </blockquote>
      <p v-for="(para, i) in moralSpine.paragraphs" :key="i">{{ para }}</p>
    </div>
  </section>

  <section id="influences" class="content-section">
    <h2>{{ influencesHeading.heading }}</h2>
    <p class="section-intro">{{ influencesHeading.intro }}</p>
    <InfluenceArticle v-for="inf in philosophyInfluences" :key="inf.title" :influence="inf" />
  </section>

  <AiClaritySection />

  <section id="brand-elements" class="content-section">
    <h2>{{ brandElementsHeading.heading }}</h2>
    <p class="section-intro">{{ brandElementsHeading.intro }}</p>
    <dl class="brand-elements-list">
      <BrandElement v-for="b in brandElements" :key="b.title" :element="b" />
    </dl>
  </section>

  <section class="testimonial testimonial-divider">
    <div class="container">
      <h2 class="section-heading-styled">{{ colleagueQuotesHeading }}</h2>
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

  <p class="content-section" style="text-align: center; font-style: italic;">{{ closingLine }}</p>
</template>
