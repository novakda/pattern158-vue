<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import {
  hero,
  commitment,
  standards,
  testing,
  currentStatus,
  browsers,
  features,
  knownIssues,
  feedback,
  technicalSpecs,
} from '@/content/accessibility'

useBodyClass('page-accessibility')
useSeo({
  title: 'Accessibility | Pattern 158 - Dan Novak',
  description: 'Accessibility statement for pattern158.solutions.',
  path: '/accessibility',
})
</script>

<template>
  <HeroMinimal :title="hero.title">
    <p class="lead">{{ hero.lead }}</p>
  </HeroMinimal>

  <section class="content-section">
    <div class="container">
      <h2>{{ commitment.heading }}</h2>
      <p>{{ commitment.body }}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ standards.heading }}</h2>
      <p>{{ standards.intro }}</p>
      <ul>
        <li v-for="b in standards.bullets" :key="b.label"><strong>{{ b.label }}</strong> &mdash; {{ b.body }}</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ testing.heading }}</h2>
      <p>{{ testing.intro }}</p>
      <dl class="definition-list">
        <template v-for="m in testing.methods" :key="m.term">
          <dt>{{ m.term }}</dt>
          <dd>{{ m.description }}</dd>
        </template>
      </dl>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ currentStatus.heading }}</h2>
      <p><strong>{{ currentStatus.lastVerifiedLabel }}</strong> {{ currentStatus.lastVerifiedValue }}</p>
      <p><strong>{{ currentStatus.testResultsLabel }}</strong></p>
      <ul>
        <li v-for="r in currentStatus.results" :key="r">{{ r }}</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ browsers.heading }}</h2>
      <p>{{ browsers.browsersIntro }}</p>
      <ul>
        <li v-for="b in browsers.browserList" :key="b">{{ b }}</li>
      </ul>
      <p>{{ browsers.assistiveIntro }}</p>
      <ul>
        <li v-for="a in browsers.assistiveList" :key="a">{{ a }}</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ features.heading }}</h2>
      <p>{{ features.intro }}</p>
      <ul>
        <li v-for="f in features.bullets" :key="f.label"><strong>{{ f.label }}</strong> {{ f.body }}</li>
      </ul>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ knownIssues.heading }}</h2>
      <p>{{ knownIssues.intro }}</p>
      <ul>
        <li v-for="i in knownIssues.issues" :key="i">{{ i }}</li>
      </ul>
      <p>{{ knownIssues.outro }}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ feedback.heading }}</h2>
      <p>{{ feedback.intro }}</p>
      <ul>
        <li><strong>{{ feedback.emailLabel }}</strong> <a :href="feedback.emailHref">{{ feedback.emailDisplay }}</a></li>
        <li><strong>{{ feedback.contactPageLabel }}</strong> <router-link :to="feedback.contactPageTo">{{ feedback.contactPageDisplay }}</router-link></li>
      </ul>
      <p>{{ feedback.outro }}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>{{ technicalSpecs.heading }}</h2>
      <p>{{ technicalSpecs.intro }}</p>
      <ul>
        <li v-for="s in technicalSpecs.bullets" :key="s">{{ s }}</li>
      </ul>
    </div>
  </section>
</template>
