<script setup lang="ts">
import { computed } from 'vue';
import { formatCompactNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { vTilt } from '../motion/vTilt';
import MxCover, { type CoverSources } from './MxCover.vue';
import MxLink from './MxLink.vue';
import MxRating from './MxRating.vue';

export type ItemKind = 'album' | 'track' | 'artist';

const props = withDefaults(
  defineProps<{
    kind?: ItemKind;
    title: string;
    subtitle?: string | null;
    meta?: string | null;
    cover?: string | null;
    sources?: CoverSources | null;
    seed?: string;
    to?: LinkTarget;
    rating?: number | null;
    listeners?: number | null;
    position?: number | null;
    badge?: string | null;
    layout?: 'tile' | 'row' | 'chart';
    priority?: boolean;
    transitionName?: string;
    headingLevel?: 2 | 3 | 4;
  }>(),
  {
    kind: 'album',
    subtitle: null,
    meta: null,
    cover: null,
    sources: null,
    rating: null,
    listeners: null,
    position: null,
    badge: null,
    layout: 'tile',
    priority: false,
    headingLevel: 3,
  },
);

const { t, locale } = useMixtapeText();

const heading = computed(() => `h${props.headingLevel}`);
const listenersText = computed(() =>
  props.listeners === null
    ? null
    : t('media.listeners', { count: props.listeners, formatted: formatCompactNumber(props.listeners, locale.value) }),
);
</script>

<template>
  <article class="mx-item-card" :class="[`mx-item-card--${layout}`, `mx-item-card--${kind}`]">
    <div v-tilt="layout === 'tile' ? { max: 7, glare: true } : false" class="mx-item-card__media">
      <span v-if="position !== null && layout !== 'row'" class="mx-item-card__position" aria-hidden="true">{{ position }}</span>
      <MxCover
        :src="cover"
        :sources="sources"
        :title="title"
        :seed="seed ?? title"
        :shape="kind === 'artist' ? 'circle' : 'square'"
        :radius="layout === 'row' ? 'sm' : 'md'"
        :vinyl="kind === 'album' && layout === 'tile'"
        :priority="priority"
        :transition-name="transitionName"
        :sizes="layout === 'row' ? '72px' : '(max-width: 600px) 45vw, 240px'"
      />
      <span v-if="badge" class="mx-item-card__badge">{{ badge }}</span>
    </div>
    <div class="mx-item-card__body">
      <component :is="heading" class="mx-item-card__title">
        <MxLink v-if="to !== undefined" :to="to" class="mx-item-card__link">
          <span v-if="position !== null && layout === 'row'" class="mx-item-card__inline-position">{{ position }}</span>
          {{ title }}
        </MxLink>
        <template v-else>{{ title }}</template>
      </component>
      <p v-if="subtitle" class="mx-item-card__subtitle">{{ subtitle }}</p>
      <p v-if="meta || listenersText || rating !== null" class="mx-item-card__meta">
        <MxRating v-if="rating !== null" :value="rating" size="xs" show-value />
        <span v-if="meta">{{ meta }}</span>
        <span v-if="listenersText" class="mx-item-card__listeners">
          <VIcon icon="mdi-headphones" size="14" aria-hidden="true" />
          {{ listenersText }}
        </span>
      </p>
    </div>
    <div v-if="$slots.actions" class="mx-item-card__actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.mx-item-card {
  position: relative;
  display: grid;
  gap: 12px;
  min-width: 0;
  color: var(--mx-on-surface);
}

.mx-item-card__media {
  position: relative;
  border-radius: var(--mx-radius-md);
}

.mx-item-card--artist .mx-item-card__media {
  border-radius: 50%;
}

.mx-item-card__media :deep(.mx-cover) {
  width: 100%;
}

.mx-item-card__position {
  position: absolute;
  bottom: -0.18em;
  left: -0.08em;
  z-index: 3;
  font-family: var(--mx-font-display);
  font-size: clamp(3.5rem, 9vw, 5.5rem);
  font-weight: 800;
  font-stretch: 75%;
  letter-spacing: var(--mx-tracking-numeral);
  line-height: 0.8;
  color: var(--mx-cta);
  -webkit-text-stroke: 3px var(--mx-background);
  paint-order: stroke fill;
  pointer-events: none;
}

.mx-item-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  padding: 4px 10px;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border: 2px solid var(--mx-cta-outline);
  border-radius: var(--mx-radius-pill);
  transform: rotate(-6deg);
}

.mx-item-card__body {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.mx-item-card__title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-family: var(--mx-font-body);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.mx-item-card__link {
  color: inherit;
  text-decoration: none;
}

.mx-item-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--mx-radius-md);
}

.mx-item-card__link:focus-visible {
  outline: none;
}

.mx-item-card__link:focus-visible::after {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
}

.mx-item-card:hover .mx-item-card__link {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.mx-item-card__inline-position {
  margin-inline-end: 6px;
  font-family: var(--mx-font-display);
  color: var(--mx-on-surface-muted);
}

.mx-item-card__subtitle {
  margin: 0;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--mx-on-surface-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-item-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 2px 0 0;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-item-card__listeners {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.mx-item-card__actions {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 6px;
}

.mx-item-card--tile .mx-item-card__actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-out),
    transform var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-item-card--tile:hover .mx-item-card__actions,
.mx-item-card--tile:focus-within .mx-item-card__actions {
  opacity: 1;
  transform: none;
}

@media (hover: none) {
  .mx-item-card--tile .mx-item-card__actions {
    opacity: 1;
    transform: none;
  }
}

.mx-item-card--row {
  grid-template-columns: 64px minmax(0, 1fr) auto;
  align-items: center;
  padding: 8px;
  border-radius: var(--mx-radius-md);
  transition: background-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-item-card--row:hover {
  background: var(--mx-surface-variant);
}

.mx-item-card--row .mx-item-card__title {
  -webkit-line-clamp: 1;
}

.mx-item-card--chart {
  padding-left: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-item-card--tile .mx-item-card__actions {
    transition: none;
  }
}
</style>
