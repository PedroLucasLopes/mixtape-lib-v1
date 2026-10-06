<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { formatRatingValue } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useInView } from '../motion/useInView';

const props = withDefaults(
  defineProps<{
    value: number | null | undefined;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showValue?: boolean;
    animated?: boolean;
    tone?: 'primary' | 'cta' | 'ink';
  }>(),
  { size: 'md', showValue: false, animated: true, tone: 'primary' },
);

const { t, locale } = useMixtapeText();
const id = useId();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const fills = computed(() =>
  [0, 1, 2, 3, 4].map((index) => {
    const value = props.value ?? 0;
    return Math.max(0, Math.min(1, value - index));
  }),
);

const label = computed(() =>
  props.value === null || props.value === undefined
    ? t('rating.none')
    : t('rating.label', { value: formatRatingValue(props.value, locale.value) }),
);

const shown = computed(() => !props.animated || inView.value);
</script>

<template>
  <span
    ref="root"
    class="mx-rating"
    :class="[`mx-rating--${size}`, `mx-rating--${tone}`, { 'mx-rating--shown': shown, 'mx-rating--empty': value === null || value === undefined }]"
    role="img"
    :aria-label="label"
  >
    <svg v-for="(fill, index) in fills" :key="index" class="mx-rating__disc" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="`${id}-${index}`">
          <rect x="0" y="0" height="24" :width="24 * fill" />
        </clipPath>
      </defs>
      <circle class="mx-rating__empty" cx="12" cy="12" r="10.5" />
      <g :clip-path="`url(#${id}-${index})`">
        <g class="mx-rating__spin" :style="{ transitionDelay: `${index * 90}ms` }">
          <circle class="mx-rating__fill" cx="12" cy="12" r="11" />
          <circle class="mx-rating__groove" cx="12" cy="12" r="7.5" />
          <circle class="mx-rating__label" cx="12" cy="12" r="3.6" />
        </g>
      </g>
      <circle class="mx-rating__hole" cx="12" cy="12" r="1.1" />
    </svg>
    <span v-if="showValue" class="mx-rating__value" aria-hidden="true">
      {{ value === null || value === undefined ? '—' : formatRatingValue(value, locale) }}
    </span>
  </span>
</template>

<style scoped>
.mx-rating {
  --mx-rating-size: 18px;
  --mx-rating-fill: var(--mx-primary);
  --mx-rating-ink: var(--mx-on-primary);

  display: inline-flex;
  align-items: center;
  gap: calc(var(--mx-rating-size) * 0.16);
  line-height: 1;
}

.mx-rating--xs { --mx-rating-size: 12px; }
.mx-rating--sm { --mx-rating-size: 15px; }
.mx-rating--lg { --mx-rating-size: 26px; }
.mx-rating--xl { --mx-rating-size: 40px; }

.mx-rating--cta {
  --mx-rating-fill: var(--mx-cta);
  --mx-rating-ink: var(--mx-on-cta);
}

.mx-rating--ink {
  --mx-rating-fill: currentColor;
  --mx-rating-ink: transparent;
}

.mx-rating__disc {
  width: var(--mx-rating-size);
  height: var(--mx-rating-size);
  flex-shrink: 0;
  overflow: visible;
}

.mx-rating__empty {
  fill: none;
  stroke: var(--mx-outline-strong);
  stroke-width: 1.6;
}

.mx-rating--ink .mx-rating__empty {
  stroke: currentColor;
  stroke-opacity: 0.35;
}

.mx-rating__fill {
  fill: var(--mx-rating-fill);
}

.mx-rating__groove {
  fill: none;
  stroke: var(--mx-rating-ink);
  stroke-opacity: 0.28;
  stroke-width: 1;
}

.mx-rating__label {
  fill: var(--mx-rating-ink);
  fill-opacity: 0.35;
}

.mx-rating__hole {
  fill: var(--mx-background);
}

.mx-rating__spin {
  opacity: 0;
  transform: scale(0.35) rotate(-120deg);
  transform-box: fill-box;
  transform-origin: center;
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-out),
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-rating--shown .mx-rating__spin {
  opacity: 1;
  transform: none;
}

.mx-rating__value {
  margin-inline-start: 4px;
  font-family: var(--mx-font-display);
  font-size: calc(var(--mx-rating-size) * 0.95);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .mx-rating__spin {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
