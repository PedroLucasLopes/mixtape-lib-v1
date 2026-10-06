<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ region: string | null; size?: number }>(), { size: 20 });

const code = computed(() => props.region?.toUpperCase() ?? '');
const height = computed(() => Math.round((props.size * 2) / 3));
</script>

<template>
  <svg
    v-if="code === 'BR'"
    class="mx-flag"
    viewBox="0 0 30 20"
    :width="size"
    :height="height"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="30" height="20" fill="#009C3B" />
    <path d="M15 2.6 27 10 15 17.4 3 10Z" fill="#FFDF00" />
    <circle cx="15" cy="10" r="4.4" fill="#002776" />
    <path d="M10.8 9.2c2.9-.6 6.1.1 8.4 1.8" stroke="#fff" stroke-width=".8" fill="none" />
  </svg>
  <svg
    v-else-if="code === 'US'"
    class="mx-flag"
    viewBox="0 0 30 20"
    :width="size"
    :height="height"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="30" height="20" fill="#B22234" />
    <path
      d="M0 1.54h30M0 4.62h30M0 7.69h30M0 10.77h30M0 13.85h30M0 16.92h30"
      stroke="#fff"
      stroke-width="1.54"
    />
    <rect width="12" height="10.77" fill="#3C3B6E" />
  </svg>
  <svg
    v-else-if="code === 'ES'"
    class="mx-flag"
    viewBox="0 0 30 20"
    :width="size"
    :height="height"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
  <span v-else class="mx-flag mx-flag--code" aria-hidden="true">{{ code }}</span>
</template>

<style scoped>
.mx-flag {
  flex-shrink: 0;
  border-radius: 3px;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--mx-on-surface) 18%, transparent);
}

.mx-flag--code {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  padding: 0 3px;
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  background: var(--mx-surface-variant);
}
</style>
