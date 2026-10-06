<script setup lang="ts">
withDefaults(defineProps<{ min?: string; gap?: string; tag?: string; label?: string }>(), {
  min: '170px',
  gap: 'clamp(14px, 2.4vw, 24px)',
  tag: 'ul',
});
</script>

<template>
  <component :is="tag" class="mx-grid" :style="{ '--mx-grid-min': min, '--mx-grid-gap': gap }" :aria-label="label">
    <slot />
  </component>
</template>

<style scoped>
.mx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(var(--mx-grid-min), 100%), 1fr));
  gap: var(--mx-grid-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-grid > :deep(*) {
  min-width: 0;
}
</style>
