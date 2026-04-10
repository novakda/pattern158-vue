<script setup lang="ts">
import { roleFit } from '@/content/sections/roleFit'
</script>

<template>
  <section class="role-fit">
    <div class="container">
      <h2>{{ roleFit.heading }}</h2>
      <p class="section-intro">{{ roleFit.intro }}</p>

      <div class="fit-columns">
        <div class="fit-looking-for">
          <h3>{{ roleFit.lookingForHeading }}</h3>
          <ul>
            <li v-for="item in roleFit.lookingFor" :key="item.name">
              <strong>{{ item.name }}</strong> &mdash; {{ item.description }}
            </li>
          </ul>
        </div>

        <div class="fit-not-looking-for">
          <h3>{{ roleFit.notLookingForHeading }}</h3>
          <ul>
            <li v-for="bullet in roleFit.notLookingFor" :key="bullet">{{ bullet }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
