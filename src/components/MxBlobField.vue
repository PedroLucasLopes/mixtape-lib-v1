<script setup lang="ts">
import { computed } from 'vue';
import { hashString } from '../format';
import { blobColors } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    colors?: readonly string[];
    count?: number;
    seed?: string;
    intensity?: 'subtle' | 'vivid';
    animated?: boolean;
    fixed?: boolean;
  }>(),
  { colors: () => blobColors, count: 5, seed: 'mixtape', intensity: 'subtle', animated: true, fixed: false },
);

const random = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const blobs = computed(() => {
  const next = random(hashString(props.seed));
  return Array.from({ length: props.count }, (_, index) => {
    const size = 28 + next() * 34;
    return {
      key: index,
      color: props.colors[index % props.colors.length],
      style: {
        width: `${size}vmax`,
        height: `${size}vmax`,
        left: `${-10 + next() * 90}%`,
        top: `${-15 + next() * 85}%`,
        animationDuration: `${22 + next() * 18}s`,
        animationDelay: `${-next() * 20}s`,
      },
    };
  });
});
</script>

<template>
  <div
    class="mx-blob-field"
    :class="[`mx-blob-field--${intensity}`, { 'mx-blob-field--animated': animated, 'mx-blob-field--fixed': fixed }]"
    aria-hidden="true"
  >
    <span
      v-for="blob in blobs"
      :key="blob.key"
      class="mx-blob-field__blob"
      :style="{ ...blob.style, '--mx-blob-color': blob.color }"
    />
  </div>
</template>

<style scoped>
.mx-blob-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: strict;
}

.mx-blob-field--fixed {
  position: fixed;
}

.mx-blob-field__blob {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--mx-blob-color) 0%, var(--mx-blob-color) 38%, transparent 100%);
  opacity: 0.24;
}

.mx-blob-field--vivid .mx-blob-field__blob {
  opacity: 0.55;
}

.mx-blob-field--animated .mx-blob-field__blob {
  animation-name: mx-blob-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  will-change: transform;
}

@media (max-width: 600px) {
  .mx-blob-field__blob:nth-child(n + 4) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-blob-field--animated .mx-blob-field__blob {
    animation: none;
  }
}
</style>
