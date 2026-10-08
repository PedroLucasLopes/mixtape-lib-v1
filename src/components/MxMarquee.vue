<script setup lang="ts">
import { computed } from 'vue';
import { duotones, type DuotoneName } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    items: readonly string[];
    duotone?: DuotoneName;
    speed?: number;
    reverse?: boolean;
    size?: 'md' | 'lg' | 'xl';
    tilt?: number;
    label?: string;
  }>(),
  { duotone: 'lime', speed: 32, reverse: false, size: 'lg', tilt: 0 },
);

const colors = computed(() => duotones[props.duotone]);
</script>

<template>
  <div
    data-testid="mx-marquee"
    class="mx-marquee"
    :class="[`mx-marquee--${size}`, { 'mx-marquee--reverse': reverse }]"
    :style="{
      '--mx-marquee-bg': colors.background,
      '--mx-marquee-fg': colors.ink,
      '--mx-marquee-accent': colors.accent,
      '--mx-marquee-speed': `${speed}s`,
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
    }"
    :role="label ? 'region' : undefined"
    :aria-label="label"
  >
    <ul class="mx-sr-only">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
    <div class="mx-marquee__track" aria-hidden="true">
      <span v-for="copy in 2" :key="copy" class="mx-marquee__copy">
        <span v-for="(item, index) in items" :key="`${copy}-${index}`" class="mx-marquee__item">
          {{ item }}
          <svg class="mx-marquee__star" viewBox="0 0 24 24" focusable="false">
            <path d="M12 0l2.6 8.4L24 12l-9.4 3.6L12 24l-2.6-8.4L0 12l9.4-3.6z" />
          </svg>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.mx-marquee {
  --mx-marquee-font: 1.5rem;
  position: relative;
  overflow: hidden;
  padding: 14px 0;
  color: var(--mx-marquee-fg);
  background: var(--mx-marquee-bg);
  border-block: 2px solid var(--mx-marquee-fg);
}

.mx-marquee--md { --mx-marquee-font: 1.125rem; padding: 10px 0; }
.mx-marquee--xl { --mx-marquee-font: clamp(2rem, 5vw, 3.5rem); padding: 18px 0; }

.mx-marquee__track {
  display: flex;
  width: max-content;
  animation: mx-marquee var(--mx-marquee-speed) linear infinite;
}

.mx-marquee--reverse .mx-marquee__track {
  animation-direction: reverse;
}

.mx-marquee:hover .mx-marquee__track {
  animation-play-state: paused;
}

.mx-marquee__copy {
  display: flex;
}

.mx-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  padding-inline-end: 0.6em;
  font-family: var(--mx-font-display);
  font-size: var(--mx-marquee-font);
  font-weight: 800;
  font-stretch: 80%;
  letter-spacing: var(--mx-tracking-display);
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
}

.mx-marquee__star {
  width: 0.8em;
  height: 0.8em;
  fill: var(--mx-marquee-fg);
}

@media (prefers-reduced-motion: reduce) {
  .mx-marquee__track {
    width: auto;
    padding-inline: 16px;
    animation: none;
  }

  .mx-marquee__copy {
    flex-wrap: wrap;
    row-gap: 8px;
  }

  .mx-marquee__copy + .mx-marquee__copy {
    display: none;
  }
}
</style>
