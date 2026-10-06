<script setup lang="ts">
import { computed } from 'vue';
import { duotones, type DuotoneName } from '../theme/tokens';
import MxStarburst from './MxStarburst.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    duotone?: DuotoneName;
    eyebrow?: string;
    layout?: 'split' | 'overlap' | 'center';
    decoration?: 'star' | 'flower' | 'sun' | 'none';
    compact?: boolean;
  }>(),
  { duotone: 'violet', layout: 'split', decoration: 'star', compact: false },
);

const colors = computed(() => duotones[props.duotone]);

const scale = computed(() => {
  const length = props.title.length;
  if (length <= 9) return 'giant';
  if (length <= 18) return 'xl';
  if (length <= 34) return 'l';
  return 'm';
});

const words = computed(() => props.title.split(/(\s+)/).filter((part) => part.length > 0));
</script>

<template>
  <section
    class="mx-hero"
    :class="[`mx-hero--${layout}`, `mx-hero--${scale}`, { 'mx-hero--compact': compact }]"
    :style="{ '--mx-hero-bg': colors.background, '--mx-hero-ink': colors.ink, '--mx-hero-accent': colors.accent }"
  >
    <div class="mx-hero__wash" aria-hidden="true" />
    <MxStarburst
      v-if="decoration !== 'none'"
      class="mx-hero__decoration"
      :shape="decoration"
      :points="decoration === 'flower' ? 9 : 14"
      :color="colors.accent"
      :ink="colors.ink"
      size="min(46vw, 420px)"
      spin
    />

    <div v-if="$slots.media" class="mx-hero__media">
      <slot name="media" />
    </div>

    <div class="mx-hero__content">
      <p v-if="eyebrow" class="mx-hero__eyebrow">{{ eyebrow }}</p>
      <h1 class="mx-hero__title">
        <span
          v-for="(word, index) in words"
          :key="index"
          class="mx-hero__word"
          :class="{ 'mx-hero__space': /^\s+$/.test(word) }"
          :style="{ animationDelay: `${160 + index * 55}ms` }"
        >{{ word }}</span>
      </h1>
      <div v-if="$slots.subtitle" class="mx-hero__subtitle">
        <slot name="subtitle" />
      </div>
      <div v-if="$slots.story" class="mx-hero__story">
        <slot name="story" />
      </div>
      <div v-if="$slots.stats" class="mx-hero__stats">
        <slot name="stats" />
      </div>
      <div v-if="$slots.actions" class="mx-hero__actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.mx-hero {
  --mx-hero-title: var(--mx-text-display-l);
  position: relative;
  isolation: isolate;
  display: grid;
  gap: clamp(20px, 4vw, 48px);
  min-width: 0;
  padding: clamp(24px, 5vw, 64px);
  overflow: hidden;
  color: var(--mx-hero-ink);
  border-radius: var(--mx-radius-xl);
}

.mx-hero--compact {
  padding: clamp(20px, 4vw, 40px);
}

.mx-hero--giant { --mx-hero-title: var(--mx-text-giant); }
.mx-hero--xl { --mx-hero-title: var(--mx-text-display-xl); }
.mx-hero--l { --mx-hero-title: var(--mx-text-display-l); }
.mx-hero--m { --mx-hero-title: var(--mx-text-h1); }

.mx-hero__wash {
  position: absolute;
  inset: 0;
  z-index: -2;
  background: var(--mx-hero-bg);
  clip-path: circle(0% at 12% 8%);
  animation: mx-hero-wash 650ms var(--mx-ease-out) forwards;
}

.mx-hero__decoration {
  position: absolute;
  bottom: -16%;
  left: -10%;
  z-index: -1;
  opacity: 0.9;
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop) 300ms both;
}

.mx-hero--overlap .mx-hero__decoration,
.mx-hero--center .mx-hero__decoration {
  top: -14%;
  right: -12%;
  bottom: auto;
  left: auto;
}

.mx-hero--split {
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
}

@media (min-width: 840px) {
  .mx-hero--split {
    grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.4fr);
  }

  .mx-hero--overlap {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.75fr);
  }

  .mx-hero--overlap .mx-hero__media {
    grid-column: 2;
    grid-row: 1;
  }

  .mx-hero--overlap .mx-hero__content {
    grid-column: 1 / span 2;
    grid-row: 1;
    align-self: end;
    z-index: 1;
  }
}

.mx-hero--center {
  justify-items: center;
  text-align: center;
}

.mx-hero__media {
  position: relative;
  max-width: min(100%, 420px);
  animation: mx-hero-media var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy) 120ms both;
}

.mx-hero--split .mx-hero__media {
  justify-self: center;
  width: 100%;
}

.mx-hero__content {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.mx-hero__eyebrow {
  margin: 0;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) 120ms both;
}

.mx-hero__title {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: var(--mx-hero-title);
  font-weight: 800;
  font-stretch: 78%;
  letter-spacing: -0.045em;
  line-height: 0.88;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.mx-hero__word {
  display: inline-block;
  animation: mx-hero-word 720ms var(--mx-spring-smooth) both;
}

.mx-hero__space {
  display: inline;
  white-space: pre-wrap;
}

.mx-hero__subtitle {
  font-family: var(--mx-font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  font-weight: 750;
  letter-spacing: -0.015em;
  line-height: 1.15;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) 380ms both;
}

.mx-hero__subtitle :deep(a) {
  color: inherit;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.mx-hero__story {
  max-width: 62ch;
  font-size: clamp(1rem, 1.5vw, 1.1875rem);
  font-weight: 600;
  line-height: 1.55;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) 480ms both;
}

.mx-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) 560ms both;
}

.mx-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) 640ms both;
}

.mx-hero--center .mx-hero__actions,
.mx-hero--center .mx-hero__stats {
  justify-content: center;
}

@keyframes mx-hero-wash {
  to { clip-path: circle(150% at 12% 8%); }
}

@keyframes mx-hero-word {
  from { transform: translate3d(0, 0.42em, 0) skewY(5deg); }
  to { transform: none; }
}

@keyframes mx-hero-media {
  from { transform: translate3d(-8%, 6%, 0) rotate(-8deg) scale(0.86); }
  to { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .mx-hero__wash {
    clip-path: none;
    animation: none;
  }

  .mx-hero__decoration,
  .mx-hero__media,
  .mx-hero__eyebrow,
  .mx-hero__word,
  .mx-hero__subtitle,
  .mx-hero__story,
  .mx-hero__stats,
  .mx-hero__actions {
    animation: none;
  }
}
</style>
