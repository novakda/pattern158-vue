<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { exhibits } from '@/data/exhibits'
import InvestigationReportLayout from '@/components/exhibit/InvestigationReportLayout.vue'
import EngineeringBriefLayout from '@/components/exhibit/EngineeringBriefLayout.vue'

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
  <InvestigationReportLayout v-if="exhibit?.exhibitType === 'investigation-report'" :exhibit="exhibit" />
  <EngineeringBriefLayout v-else-if="exhibit" :exhibit="exhibit" />
</template>
