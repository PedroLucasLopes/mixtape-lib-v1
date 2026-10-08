<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    shape?: 'rect' | 'circle' | 'text' | 'square';
    lines?: number;
  }>(),
  { width: '100%', height: '1em', shape: 'rect', lines: 1 },
);
</script>

<template>
  <span v-if="shape === 'text' && lines > 1" data-testid="mx-skeleton" class="mx-skeleton-lines" aria-hidden="true">
    <span
      v-for="line in lines"
      :key="line"
      class="mx-skeleton mx-skeleton--text"
      :style="{ width: line === lines ? '62%' : width, height }"
    />
  </span>
  <span
    v-else
    data-testid="mx-skeleton"
    class="mx-skeleton"
    :class="`mx-skeleton--${shape}`"
    :style="{ width, height: shape === 'circle' || shape === 'square' ? undefined : height }"
    aria-hidden="true"
  />
</template>

<style scoped>
.mx-skeleton-lines {
  display: grid;
  gap: 0.55em;
  width: 100%;
}

.mx-skeleton {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-sm);
}

.mx-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 25%, color-mix(in srgb, var(--mx-on-surface) 9%, transparent) 50%, transparent 75%);
  animation: mx-shimmer 1.4s linear infinite;
}

.mx-skeleton--text {
  border-radius: 6px;
}

.mx-skeleton--circle,
.mx-skeleton--square {
  aspect-ratio: 1;
}

.mx-skeleton--circle {
  border-radius: 50%;
}

.mx-skeleton--square {
  border-radius: var(--mx-radius-md);
}

@media (prefers-reduced-motion: reduce) {
  .mx-skeleton::after {
    animation: none;
  }
}
</style>
