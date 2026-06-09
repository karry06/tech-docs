<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ title: string; url: string; description?: string }>()

const hostname = computed(() => {
  try {
    return new URL(props.url).hostname.replace(/^www\./, '')
  } catch {
    return props.url
  }
})
</script>

<template>
  <a class="link-card" :href="url" target="_blank" rel="noopener noreferrer">
    <span class="link-card-icon">{{ hostname.slice(0, 1).toUpperCase() }}</span>
    <span class="link-card-content">
      <strong>{{ title }}</strong>
      <small v-if="description">{{ description }}</small>
      <span>{{ hostname }}</span>
    </span>
    <span class="link-card-arrow">↗</span>
  </a>
</template>
