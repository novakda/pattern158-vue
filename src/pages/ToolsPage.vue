<script setup lang="ts">
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import HeroMinimal from '@/components/HeroMinimal.vue'

useBodyClass('page-tools')
useSeo({
  title: 'Tools | Pattern 158 - Dan Novak',
  description: 'Side projects and tools built by Dan Novak.',
  path: '/tools',
})
</script>

<template>
  <HeroMinimal title="Tools" subtitle="Side projects and utilities">
    <p class="hero-intro">Small apps and experiments built outside of client work.</p>
  </HeroMinimal>

  <section class="tools-grid">
    <div class="container">
      <div class="tools-cards">
        <a href="/tools/bunco/" class="tool-card">
          <div class="tool-card__header">
            <h2 class="tool-card__title">Bunco Scorecard</h2>
            <span class="tool-card__tag">Vue 3</span>
          </div>
          <p class="tool-card__desc">A clean, round-by-round scorecard for Bunco. Tracks scores and wins for up to six teams across six rounds.</p>
          <span class="tool-card__cta">Open app →</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tools-grid {
  padding: var(--section-padding, 4rem 0);
}

.tools-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
  border-color: var(--color-accent, #3b82f6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tool-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tool-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.tool-card__tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: var(--color-tag-bg, #f3f4f6);
  color: var(--color-tag-text, #6b7280);
  white-space: nowrap;
}

.tool-card__desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-muted, #6b7280);
  margin: 0;
  flex: 1;
}

.tool-card__cta {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-accent, #3b82f6);
}
</style>
