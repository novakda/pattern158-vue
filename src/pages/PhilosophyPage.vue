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
  description: 'How Dan Novak thinks about engineering problems \u2014 the methodology, the influences, and the origin of Pattern 158.',
  path: '/philosophy',
})
</script>

<template>
  <HeroMinimal title="Philosophy" subtitle="How I think about engineering problems" />

  <Pattern158OriginSection />

  <section id="design-thinking" class="content-section">
    <h2>This Is What Design Thinking Looks Like When It's a Personality, Not a Process</h2>
    <div class="origin-story">
      <p>Design thinking was invented to teach people who don't naturally do certain things to do them systematically. Empathize before you solve. Define the real problem before you build. Iterate through failure without shame.</p>
      <p>I didn't learn this from a framework. I absorbed it from air crash investigators, speedrunners, and a Three Stooges short from 1938.</p>
      <p>The result is the same disposition &mdash; but without the scaffolding, because the scaffolding was never load-bearing for me. The fish doesn't have a water strategy.</p>
      <p>What I do have is a three-step pattern that has repeated across every significant project in 28 years:</p>
    </div>
  </section>

  <HowIWorkSection />

  <section id="moral-spine" class="content-section">
    <h2>The Moral Spine</h2>
    <div class="origin-story">
      <p>The three-step pattern is <em>how</em> I work. This is <em>why</em>:</p>
      <blockquote>
        <p>&ldquo;You want to cheat, cheat fair &mdash; anything I hate is a crookin' crook.&rdquo;</p>
        <cite>&mdash; Moe Howard, <em>Healthy, Wealthy and Dumb</em>, 1938</cite>
      </blockquote>
      <p>Every tool I build is a cheat. Automating a manual process is cheating. Jumping to any course state in seconds instead of clicking through every section is cheating. Building a framework that eliminates a class of problem is cheating.</p>
      <p>But cheating fair means the output is proper, documented, and maintainable. It means you could hand it to another engineer and they could understand, extend, and improve it. Hoarding a clever solution &mdash; keeping the elegant shortcut to yourself &mdash; is the real dishonesty. The knowledge isn't yours. It came from everyone who documented the problem before you, and it belongs to everyone who'll encounter it after you.</p>
      <p>Clever shortcuts and corner-cutting look identical from the outside. The difference is in the craftsmanship.</p>
    </div>
  </section>

  <section id="influences" class="content-section">
    <h2>Five Sources That Shaped the Method</h2>
    <p class="section-intro">These aren't abstract inspirations. They're specific sources I can point to and say: <em>this changed how I solve problems.</em></p>
    <InfluenceArticle v-for="inf in philosophyInfluences" :key="inf.title" :influence="inf" />
  </section>

  <AiClaritySection />

  <section id="brand-elements" class="content-section">
    <h2>The Six Brand Elements</h2>
    <p class="section-intro">Six patterns extracted from 28 years of actual work &mdash; not marketing slogans, but recurring themes from real projects.</p>
    <dl class="brand-elements-list">
      <BrandElement v-for="b in brandElements" :key="b.title" :element="b" />
    </dl>
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

  <p class="content-section" style="text-align: center; font-style: italic;">Pattern 158: I cheat, but I cheat fair.</p>
</template>
