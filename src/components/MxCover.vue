<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { duotoneFor, initials } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { duotones } from '../theme/tokens';
import MxVinyl from './MxVinyl.vue';

export interface CoverSources {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

const props = withDefaults(
  defineProps<{
    src?: string | null;
    sources?: CoverSources | null;
    title?: string;
    alt?: string;
    seed?: string;
    size?: number | string;
    sizes?: string;
    radius?: 'sm' | 'md' | 'lg' | 'none';
    vinyl?: boolean;
    priority?: boolean;
    transitionName?: string;
    shape?: 'square' | 'circle';
  }>(),
  {
    src: null,
    sources: null,
    title: '',
    alt: '',
    size: '100%',
    sizes: '(max-width: 600px) 45vw, 220px',
    radius: 'md',
    vinyl: false,
    priority: false,
    shape: 'square',
  },
);

const { t } = useMixtapeText();

const failed = ref(false);
const loaded = ref(false);

const url = computed(() => props.src ?? props.sources?.medium ?? props.sources?.large ?? props.sources?.small ?? null);

watch(url, () => {
  failed.value = false;
  loaded.value = false;
});

const srcset = computed(() => {
  const sources = props.sources;
  if (!sources) return undefined;
  const entries = [
    [sources.small, 250],
    [sources.medium, 500],
    [sources.large, 1200],
  ].filter((entry): entry is [string, number] => typeof entry[0] === 'string' && entry[0].length > 0);
  return entries.length > 1 ? entries.map(([source, width]) => `${source} ${width}w`).join(', ') : undefined;
});

const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
const fallback = computed(() => duotones[duotoneFor(props.seed ?? props.title ?? 'mixtape')]);
const showImage = computed(() => Boolean(url.value) && !failed.value);
</script>

<template>
  <span
    data-testid="mx-cover"
    class="mx-cover"
    :class="[`mx-cover--${radius}`, `mx-cover--${shape}`, { 'mx-cover--vinyl': vinyl, 'mx-cover--loaded': loaded || priority }]"
    :style="{ width: dimension }"
  >
    <span v-if="vinyl" class="mx-cover__record" aria-hidden="true">
      <MxVinyl size="100%" :image="showImage ? url : null" :label-color="fallback.background" />
    </span>
    <span class="mx-cover__frame" :style="transitionName ? { viewTransitionName: transitionName } : undefined">
      <img
        v-if="showImage"
        class="mx-cover__image"
        :src="url ?? undefined"
        :srcset="srcset"
        :sizes="srcset ? sizes : undefined"
        :alt="alt"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        width="500"
        height="500"
        @load="loaded = true"
        @error="failed = true"
      />
      <span
        v-else
        class="mx-cover__fallback"
        :style="{ background: fallback.background, color: fallback.ink }"
        role="img"
        :aria-label="alt || (title ? t('cover.missing', { title }) : undefined)"
        :aria-hidden="alt || title ? undefined : 'true'"
      >
        <span class="mx-cover__initials">{{ initials(title || '?') }}</span>
        <svg class="mx-cover__groove" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="78" cy="78" r="34" fill="none" :stroke="fallback.ink" stroke-opacity="0.25" stroke-width="3" />
          <circle cx="78" cy="78" r="22" fill="none" :stroke="fallback.ink" stroke-opacity="0.25" stroke-width="3" />
          <circle cx="78" cy="78" r="9" :fill="fallback.accent" />
        </svg>
      </span>
    </span>
  </span>
</template>

<style scoped>
.mx-cover {
  --mx-cover-radius: var(--mx-radius-sm);
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  aspect-ratio: 1;
  vertical-align: top;
}

.mx-cover--sm { --mx-cover-radius: 8px; }
.mx-cover--lg { --mx-cover-radius: var(--mx-radius-md); }
.mx-cover--none { --mx-cover-radius: 0; }
.mx-cover--circle { --mx-cover-radius: 50%; }

.mx-cover__frame {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--mx-cover-radius);
  background: var(--mx-surface-variant);
  box-shadow: var(--mx-cover-shadow, 0 14px 34px -18px var(--mx-shadow));
}

.mx-cover__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity var(--mx-duration-slow) var(--mx-ease-out),
    transform var(--mx-duration-slower) var(--mx-ease-out);
}

.mx-cover--loaded .mx-cover__image {
  opacity: 1;
  transform: none;
}

.mx-cover__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: start;
  padding: 10%;
}

.mx-cover__initials {
  position: relative;
  z-index: 1;
  font-family: var(--mx-font-display);
  font-size: clamp(1rem, 22cqi, 4rem);
  font-weight: 800;
  font-stretch: 80%;
  letter-spacing: var(--mx-tracking-display);
  line-height: 0.9;
}

.mx-cover {
  container-type: inline-size;
}

.mx-cover__groove {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.mx-cover__record {
  position: absolute;
  top: 4%;
  right: 4%;
  z-index: 0;
  width: 92%;
  height: 92%;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-cover--vinyl:hover .mx-cover__record,
:where(a, button):focus-visible .mx-cover--vinyl .mx-cover__record,
:where(a, button):hover .mx-cover--vinyl .mx-cover__record {
  transform: translateX(34%) rotate(40deg);
}

@media (prefers-reduced-motion: reduce) {
  .mx-cover__image,
  .mx-cover__record {
    transition: none;
  }

  .mx-cover__image {
    opacity: 1;
    transform: none;
  }
}
</style>
