<script setup lang="ts">
import { computed } from 'vue';
import { duotoneFor } from '../format';
import { duotones } from '../theme/tokens';
import MxCover, { type CoverSources } from './MxCover.vue';

const props = withDefaults(
  defineProps<{
    count: number;
    label: string;
    src?: string | null;
    sources?: CoverSources | null;
    title?: string;
    seed?: string;
    sizes?: string;
    priority?: boolean;
    icon?: string;
  }>(),
  {
    src: null,
    sources: null,
    title: '',
    sizes: '(max-width: 600px) 45vw, 220px',
    priority: false,
    icon: 'mdi-layers-outline',
  },
);

const expanded = defineModel<boolean>('expanded', { default: false });

const sleeves = computed(() =>
  Array.from({ length: Math.min(Math.max(props.count, 0), 2) }, (_, index) => {
    return duotones[duotoneFor(`${props.seed ?? props.title}-${index + 1}`)].background;
  }),
);
</script>

<template>
  <button
    data-testid="mx-cover-stack"
    type="button"
    class="mx-cover-stack"
    :class="{ 'mx-cover-stack--expanded': expanded }"
    :aria-expanded="expanded"
    :aria-label="label"
    @click="expanded = !expanded"
  >
    <span
      v-for="(color, index) in sleeves"
      :key="index"
      data-testid="mx-cover-stack-sleeve"
      class="mx-cover-stack__sleeve"
      :class="`mx-cover-stack__sleeve--${index + 1}`"
      :style="{ background: color }"
      aria-hidden="true"
    />
    <span class="mx-cover-stack__front">
      <MxCover :src="src" :sources="sources" :title="title" :seed="seed" :sizes="sizes" :priority="priority" />
    </span>
    <span data-testid="mx-cover-stack-count" class="mx-cover-stack__count" aria-hidden="true">
      <VIcon :icon="expanded ? 'mdi-chevron-up' : icon" size="16" />
      <span v-if="!expanded">{{ count }}</span>
    </span>
  </button>
</template>

<style scoped>
.mx-cover-stack {
  --mx-cover-stack-front: 0.88;
  --mx-cover-stack-step: 6%;
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  color: inherit;
  font: inherit;
  background: none;
  border: 0;
  border-radius: var(--mx-radius-sm);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mx-cover-stack:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
}

.mx-cover-stack__front,
.mx-cover-stack__sleeve {
  position: absolute;
  inset: 0;
  transform-origin: 0 100%;
  transition:
    transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth),
    opacity var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-cover-stack__front {
  z-index: 2;
  display: block;
  transform: scale(var(--mx-cover-stack-front));
}

.mx-cover-stack__front > :deep(.mx-cover) {
  display: block;
}

.mx-cover-stack__sleeve {
  border-radius: var(--mx-radius-sm);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.1),
    0 10px 24px -16px var(--mx-shadow);
}

.mx-cover-stack__sleeve--1 {
  z-index: 1;
  transform: translate(var(--mx-cover-stack-step), calc(-1 * var(--mx-cover-stack-step))) scale(var(--mx-cover-stack-front));
}

.mx-cover-stack__sleeve--2 {
  z-index: 0;
  transform: translate(calc(2 * var(--mx-cover-stack-step)), calc(-2 * var(--mx-cover-stack-step))) scale(var(--mx-cover-stack-front));
}

.mx-cover-stack__sleeve--2::after {
  position: absolute;
  inset: 0;
  content: '';
  background: rgb(0 0 0 / 0.16);
  border-radius: inherit;
}

@media (hover: hover) {
  .mx-cover-stack:not(.mx-cover-stack--expanded):hover {
    --mx-cover-stack-step: 7.5%;
  }
}

.mx-cover-stack:not(.mx-cover-stack--expanded):focus-visible {
  --mx-cover-stack-step: 7.5%;
}

.mx-cover-stack--expanded .mx-cover-stack__front {
  transform: none;
}

.mx-cover-stack--expanded .mx-cover-stack__sleeve {
  opacity: 0;
  transform: scale(var(--mx-cover-stack-front));
}

.mx-cover-stack__count {
  position: absolute;
  bottom: 8px;
  left: 8px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 26px;
  padding: 0 9px 0 6px;
  font-size: 0.8125rem;
  font-weight: 800;
  line-height: 1;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-radius: var(--mx-radius-pill);
  box-shadow: 0 6px 16px -8px var(--mx-shadow);
}

.mx-cover-stack--expanded .mx-cover-stack__count {
  padding: 0 5px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-cover-stack__front,
  .mx-cover-stack__sleeve {
    transition: none;
  }
}
</style>
