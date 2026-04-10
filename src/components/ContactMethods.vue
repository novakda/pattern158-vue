<script setup lang="ts">
import { contactMethods } from '@/content/sections/contactMethods'
</script>

<template>
  <section class="contact-methods">
    <div class="container">
      <h2>{{ contactMethods.heading }}</h2>
      <p class="contact-intro">{{ contactMethods.intro }}</p>

      <div class="contact-links">
        <div v-for="link in contactMethods.links" :key="link.label" class="contact-link-item">
          <strong>{{ link.label }}</strong>
          <template v-if="link.copyable">
            <div class="email-container">
              <a :href="link.href" class="email-link">{{ link.display }}</a>
              <button id="copy-email" class="copy-btn" aria-label="Copy email address to clipboard">
                <span class="copy-text">Copy</span>
              </button>
            </div>
          </template>
          <a
            v-else
            :href="link.href"
            class="link-primary"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
          >{{ link.display }}</a>
        </div>
      </div>

      <p class="contact-guidance">{{ contactMethods.guidance }}</p>
    </div>
  </section>
</template>
