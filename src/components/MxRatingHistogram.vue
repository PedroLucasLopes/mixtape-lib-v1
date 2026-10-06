<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatNumber, formatRatingValue } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useInView } from '../motion/useInView';

export interface RatingBucket {
  rating: number;
  count: number;
}

const props = withDefaults(
  defineProps<{
    distribution: readonly RatingBucket[];
    average?: number | null;
    total?: number | null;
    highlight?: number | null;
    title?: string;
    compact?: boolean;
  }>(),
  { average: null, total: null, highlight: null, compact: false },
);

const { t, locale } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);
const asTable = ref(false);

const buckets = computed(() => {
  const counts = new Map(props.distribution.map((bucket) => [Math.round(bucket.rating * 2), bucket.count]));
  return Array.from({ length: 11 }, (_, index) => ({ rating: index / 2, count: counts.get(index) ?? 0 }));
});

const max = computed(() => Math.max(1, ...buckets.value.map((bucket) => bucket.count)));
const total = computed(() => props.total ?? buckets.value.reduce((sum, bucket) => sum + bucket.count, 0));
const averagePosition = computed(() => (props.average === null ? null : (props.average / 5) * 100));
</script>

<template>
  <figure ref="root" class="mx-histogram" :class="{ 'mx-histogram--shown': inView, 'mx-histogram--compact': compact }">
    <figcaption class="mx-histogram__caption">
      <span class="mx-histogram__title">{{ title ?? t('rating.distribution') }}</span>
      <span class="mx-histogram__summary">
        <strong v-if="average !== null" class="mx-histogram__average">{{ formatRatingValue(average, locale) }}</strong>
        <span class="mx-histogram__total">{{ t('rating.count', { count: total, formatted: formatNumber(total, locale) }) }}</span>
      </span>
    </figcaption>

    <div v-if="!asTable" class="mx-histogram__chart" aria-hidden="true">
      <div class="mx-histogram__bars">
        <span
          v-for="(bucket, index) in buckets"
          :key="bucket.rating"
          class="mx-histogram__bar"
          :class="{ 'mx-histogram__bar--highlight': highlight !== null && Math.round(highlight * 2) === index }"
          :style="{ '--mx-bar-height': `${(bucket.count / max) * 100}%`, '--mx-bar-delay': `${index * 45}ms` }"
          :title="`${formatRatingValue(bucket.rating, locale)}: ${formatNumber(bucket.count, locale)}`"
        />
        <span v-if="averagePosition !== null" class="mx-histogram__marker" :style="{ left: `${averagePosition}%` }" />
      </div>
      <div class="mx-histogram__axis">
        <span v-for="value in [0, 1, 2, 3, 4, 5]" :key="value">{{ value }}</span>
      </div>
    </div>

    <table v-else class="mx-histogram__table">
      <thead>
        <tr>
          <th scope="col">{{ t('rating.tableRating') }}</th>
          <th scope="col">{{ t('rating.tableCount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bucket in buckets" :key="bucket.rating">
          <td>{{ formatRatingValue(bucket.rating, locale) }}</td>
          <td>{{ formatNumber(bucket.count, locale) }}</td>
        </tr>
      </tbody>
    </table>

    <table v-if="!asTable" class="mx-sr-only">
      <caption>{{ title ?? t('rating.distribution') }}</caption>
      <tr v-for="bucket in buckets" :key="bucket.rating">
        <th scope="row">{{ formatRatingValue(bucket.rating, locale) }}</th>
        <td>{{ formatNumber(bucket.count, locale) }}</td>
      </tr>
    </table>

    <button type="button" class="mx-histogram__toggle" @click="asTable = !asTable">
      <VIcon :icon="asTable ? 'mdi-chart-bar' : 'mdi-table'" size="16" aria-hidden="true" />
      {{ asTable ? t('rating.showChart') : t('rating.showTable') }}
    </button>
  </figure>
</template>

<style scoped>
.mx-histogram {
  display: grid;
  gap: 12px;
  margin: 0;
}

.mx-histogram__caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.mx-histogram__title {
  font-size: var(--mx-text-overline);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-histogram__summary {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.mx-histogram__average {
  font-family: var(--mx-font-display);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.mx-histogram__total {
  font-size: 0.875rem;
  color: var(--mx-on-surface-muted);
}

.mx-histogram__chart {
  display: grid;
  gap: 6px;
}

.mx-histogram__bars {
  position: relative;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  align-items: end;
  gap: 4px;
  height: 96px;
}

.mx-histogram--compact .mx-histogram__bars {
  height: 56px;
}

.mx-histogram__bar {
  display: block;
  height: max(var(--mx-bar-height), 3px);
  background: linear-gradient(180deg, var(--mx-secondary), var(--mx-primary));
  border-radius: 6px 6px 3px 3px;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy) var(--mx-bar-delay);
  opacity: 0.85;
}

.mx-histogram__bar--highlight {
  opacity: 1;
  outline: 2px solid var(--mx-on-surface);
  outline-offset: 2px;
}

.mx-histogram--shown .mx-histogram__bar {
  transform: scaleY(1);
}

.mx-histogram__marker {
  position: absolute;
  top: -6px;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--mx-on-surface);
  border-radius: 2px;
  opacity: 0;
  transition: opacity var(--mx-duration-slow) var(--mx-ease-out) 500ms;
}

.mx-histogram__marker::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  background: var(--mx-on-surface);
  border-radius: 50%;
}

.mx-histogram--shown .mx-histogram__marker {
  opacity: 1;
}

.mx-histogram__axis {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--mx-on-surface-muted);
}

.mx-histogram__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.mx-histogram__table th,
.mx-histogram__table td {
  padding: 6px 8px;
  text-align: start;
  border-bottom: 1px solid var(--mx-outline);
}

.mx-histogram__toggle {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--mx-link);
  cursor: pointer;
  background: none;
  border: 0;
}

.mx-histogram__toggle:focus-visible {
  outline: 2px solid var(--mx-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-histogram__bar {
    transform: none;
    transition: none;
  }

  .mx-histogram__marker {
    opacity: 1;
    transition: none;
  }
}
</style>
