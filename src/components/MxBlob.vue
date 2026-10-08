<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    size?: number | string;
    duration?: number;
    animated?: boolean;
  }>(),
  { color: 'var(--mx-cta)', size: 240, duration: 14, animated: true },
);

const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
</script>

<template>
  <span
    data-testid="mx-blob"
    class="mx-blob"
    :class="{ 'mx-blob--animated': animated }"
    :style="{ width: dimension, background: color, animationDuration: `${duration}s` }"
    aria-hidden="true"
  />
</template>

<style scoped>
.mx-blob {
  display: block;
  flex-shrink: 0;
  aspect-ratio: 1;
  border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%;
  pointer-events: none;
}

.mx-blob--animated {
  animation-name: mx-blob-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
  .mx-blob--animated {
    animation: none;
  }
}
</style>
