<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    shape?: 'star' | 'flower' | 'sun';
    points?: number;
    color?: string;
    ink?: string;
    size?: number | string;
    spin?: boolean;
    outline?: boolean;
  }>(),
  { shape: 'star', points: 12, color: 'var(--mx-cta)', ink: 'var(--mx-on-cta)', size: 120, spin: false, outline: false },
);

const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));

const path = computed(() => {
  const center = 50;
  if (props.shape === 'flower') {
    const steps = props.points * 24;
    const coordinates = Array.from({ length: steps }, (_, index) => {
      const angle = (index / steps) * Math.PI * 2;
      const radius = 42 + 6 * Math.cos(props.points * angle);
      return `${(center + radius * Math.cos(angle)).toFixed(2)},${(center + radius * Math.sin(angle)).toFixed(2)}`;
    });
    return `M${coordinates.join('L')}Z`;
  }
  const inner = props.shape === 'sun' ? 0.84 : 0.66;
  const count = props.shape === 'sun' ? Math.max(props.points, 20) : props.points;
  const coordinates = Array.from({ length: count * 2 }, (_, index) => {
    const angle = (index / (count * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = index % 2 === 0 ? 48 : 48 * inner;
    return `${(center + radius * Math.cos(angle)).toFixed(2)},${(center + radius * Math.sin(angle)).toFixed(2)}`;
  });
  return `M${coordinates.join('L')}Z`;
});
</script>

<template>
  <span data-testid="mx-starburst" class="mx-starburst" :style="{ width: dimension, height: dimension, color: ink }">
    <svg class="mx-starburst__shape" :class="{ 'mx-starburst__shape--spin': spin }" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        :d="path"
        :fill="color"
        :stroke="outline ? ink : 'none'"
        :stroke-width="outline ? 2.4 : 0"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="$slots.default" class="mx-starburst__content">
      <slot />
    </span>
  </span>
</template>

<style scoped>
.mx-starburst {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.mx-starburst__shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.mx-starburst__shape--spin {
  animation: mx-spin 28s linear infinite;
}

.mx-starburst__content {
  position: relative;
  display: grid;
  place-items: center;
  max-width: 64%;
  font-family: var(--mx-font-display);
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .mx-starburst__shape--spin {
    animation: none;
  }
}
</style>
