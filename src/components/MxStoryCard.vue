<script setup lang="ts">
import { computed } from 'vue';
import { duotones, type DuotoneName } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    sentence?: string;
    icon?: string;
    duotone?: DuotoneName;
    tilt?: number;
  }>(),
  { duotone: 'pink', tilt: 0 },
);

const colors = computed(() => duotones[props.duotone]);
</script>

<template>
  <article
    class="mx-story-card"
    :style="{
      '--mx-story-bg': colors.background,
      '--mx-story-ink': colors.ink,
      '--mx-story-accent': colors.accent,
      '--mx-story-tilt': `${tilt}deg`,
    }"
  >
    <p class="mx-story-card__label">
      <VIcon v-if="icon" :icon="icon" size="18" aria-hidden="true" />
      {{ label }}
    </p>
    <p class="mx-story-card__value">{{ value }}</p>
    <p v-if="sentence" class="mx-story-card__sentence">{{ sentence }}</p>
    <slot />
    <span class="mx-story-card__dot" aria-hidden="true" />
  </article>
</template>

<style scoped>
.mx-story-card {
  position: relative;
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
  min-height: 180px;
  padding: 22px;
  overflow: hidden;
  color: var(--mx-story-ink);
  background: var(--mx-story-bg);
  border-radius: var(--mx-radius-lg);
  transform: rotate(var(--mx-story-tilt));
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-story-card:hover {
  transform: rotate(0deg) translateY(-4px) scale(1.02);
}

.mx-story-card__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.mx-story-card__value {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 800;
  font-stretch: 76%;
  letter-spacing: -0.05em;
  line-height: 0.9;
  overflow-wrap: anywhere;
}

.mx-story-card__sentence {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.45;
}

.mx-story-card__dot {
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 110px;
  height: 110px;
  background: var(--mx-story-accent);
  border-radius: 50%;
  opacity: 0.85;
}

@media (prefers-reduced-motion: reduce) {
  .mx-story-card,
  .mx-story-card:hover {
    transition: none;
    transform: none;
  }
}
</style>
