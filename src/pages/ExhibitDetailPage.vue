<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { exhibits } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

const route = useRoute()
const router = useRouter()

useBodyClass('page-exhibit-detail')

const exhibit = computed(() => {
  const slug = route.params.slug as string
  return exhibits.find(e => e.exhibitLink === `/exhibits/${slug}`) ?? null
})

// Redirect unknown slugs to not-found
if (!exhibit.value) {
  router.replace({ name: 'not-found' })
}

// Dynamic SEO — useHead directly because useSeo takes plain strings, not reactive
useHead(computed(() => ({
  title: exhibit.value
    ? `${exhibit.value.label}: ${exhibit.value.title} | Pattern 158`
    : 'Exhibit | Pattern 158',
  meta: [
    {
      name: 'description',
      content: exhibit.value?.contextText ?? exhibit.value?.title ?? '',
    },
  ],
})))
</script>

<template>
  <div v-if="exhibit" class="exhibit-detail-page">
    <section class="exhibit-detail-header">
      <div class="container">
        <nav class="exhibit-back-nav">
          <router-link to="/portfolio">&larr; Back to Portfolio</router-link>
        </nav>
        <div class="exhibit-meta-header">
          <span class="exhibit-label">{{ exhibit.label }}</span>
          <span class="exhibit-client">{{ exhibit.client }}</span>
          <span class="exhibit-date">{{ exhibit.date }}</span>
        </div>
        <h1 class="exhibit-detail-title">{{ exhibit.title }}</h1>
        <span v-if="exhibit.investigationReport" class="expertise-badge badge-aware exhibit-investigation-badge">Investigation Report</span>
      </div>
    </section>

    <section class="exhibit-detail-body">
      <div class="container">

        <div v-if="exhibit.quotes?.length" class="exhibit-quotes">
          <blockquote v-for="(q, i) in exhibit.quotes" :key="i" class="exhibit-quote">
            <p>{{ q.text }}</p>
            <footer class="attribution">
              <span v-if="q.attribution">{{ q.attribution }}</span>
              <span v-if="q.role" class="role">{{ q.role }}</span>
            </footer>
          </blockquote>
        </div>

        <template v-if="exhibit.sections?.length">
          <div v-for="(section, i) in exhibit.sections" :key="i" class="exhibit-section">
            <h2 v-if="section.heading">{{ section.heading }}</h2>
            <template v-if="section.type === 'text' && section.body">
              <p v-for="(para, pi) in section.body.split('\n\n')" :key="pi">{{ para }}</p>
            </template>
            <template v-if="section.type === 'flow'">
              <div class="exhibit-flow">
                <div v-for="(step, si) in section.steps" :key="si" class="flow-step">
                  <div class="flow-node">
                    <span class="flow-label">{{ step.label }}</span>
                    <span class="flow-detail">{{ step.detail }}</span>
                  </div>
                  <div v-if="si < (section.steps?.length ?? 0) - 1" class="flow-arrow" aria-hidden="true"></div>
                </div>
              </div>
              <template v-if="section.body">
                <p v-for="(para, pi) in section.body.split('\n\n')" :key="'flow-p-' + pi">{{ para }}</p>
              </template>
            </template>
            <template v-if="section.type === 'timeline' && section.entries?.length">
              <div class="exhibit-timeline">
                <div v-for="(entry, ei) in section.entries" :key="ei" class="timeline-entry">
                  <div class="timeline-marker" aria-hidden="true"></div>
                  <div class="timeline-content">
                    <div class="timeline-date">{{ entry.date }}</div>
                    <h3 class="timeline-heading">{{ entry.heading }}</h3>
                    <p class="timeline-body">{{ entry.body }}</p>
                    <blockquote v-if="entry.quote" class="timeline-quote">
                      <p>{{ entry.quote }}</p>
                      <footer v-if="entry.quoteAttribution">{{ entry.quoteAttribution }}</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              <template v-if="section.body">
                <p v-for="(para, pi) in section.body.split('\n\n')" :key="'tl-p-' + pi">{{ para }}</p>
              </template>
            </template>
            <dl v-if="section.type === 'metadata' && section.items?.length" class="exhibit-metadata">
              <div v-for="(item, mi) in section.items" :key="mi" class="metadata-card">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
            <table v-if="section.type === 'table' && section.rows?.length" class="exhibit-table">
              <thead v-if="section.columns?.length">
                <tr>
                  <th v-for="col in section.columns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in section.rows" :key="ri">
                  <td v-for="(cell, ci) in row" :key="ci" :data-label="section.columns?.[ci]">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div v-else-if="exhibit.contextText" class="exhibit-context">
          <h2 v-if="exhibit.contextHeading">{{ exhibit.contextHeading }}</h2>
          <p>{{ exhibit.contextText }}</p>
        </div>

        <div v-if="exhibit.resolutionTable?.length" class="exhibit-resolution">
          <h2>Resolution</h2>
          <table class="resolution-table">
            <thead>
              <tr><th>Issue</th><th>Resolution</th></tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in exhibit.resolutionTable" :key="i">
                <td data-label="Issue">{{ row.issue }}</td>
                <td data-label="Resolution">{{ row.resolution }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="exhibit-impact-tags">
          <h2>Impact &amp; Capabilities</h2>
          <TechTags :tags="exhibit.impactTags" />
        </div>

      </div>
    </section>
  </div>
</template>
