<script setup lang="ts">
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import HeroMinimal from '@/components/HeroMinimal.vue'
import TechCard from '@/components/TechCard.vue'
import { technologies } from '@/data/technologies'

useBodyClass('page-technologies')
useSeo({
  title: 'Technologies | Pattern 158 - Dan Novak',
  description: 'Technology expertise spanning 28+ years — from legacy system rescue to modern AI implementation.',
  path: '/technologies',
})
</script>

<template>
  <HeroMinimal title="Technologies"
    subtitle="Production-proven expertise across modern engineering and eLearning systems">
    <p class="hero-intro">Curated expertise spanning modern software development and deep domain knowledge in
      eLearning platforms. Each technology below reflects real production work—not aspirational skills. Proficiency
      levels (Deep/Working/Aware) are honest self-assessments based on actual engagement depth, not marketing speak.
      Project counts and client tags come from verified email archive data.</p>
  </HeroMinimal>

  <template v-for="category in technologies" :key="category.id">

    <section v-if="!category.historical" class="tech-category" :aria-labelledby="`${category.id}-heading`">
      <div class="container">
        <h2 :id="`${category.id}-heading`">{{ category.title }}</h2>
        <p v-if="category.intro" class="category-intro">{{ category.intro }}</p>
        <div class="tech-cards">
          <TechCard v-for="card in category.cards" :key="card.name" v-bind="card" />
        </div>
      </div>
    </section>

    <section v-else class="tech-category tech-historical" :aria-labelledby="`${category.id}-heading`">
      <div class="container">
        <details>
          <summary>
            <h2 :id="`${category.id}-heading`">{{ category.title }}</h2>
          </summary>
          <p v-if="category.intro" class="category-intro">{{ category.intro }}</p>
          <div class="tech-cards">
            <TechCard v-for="card in category.cards" :key="card.name" v-bind="card" />
          </div>
        </details>
      </div>
    </section>

  </template>
</template>
