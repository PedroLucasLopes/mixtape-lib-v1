<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatCompactNumber, formatNumber, formatRatingValue } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useCountUp } from '../motion/useCountUp';
import { useInView } from '../motion/useInView';
import { duotones, type DuotoneName } from '../theme/tokens';

export type StatFormat = 'number' | 'compact' | 'rating' | 'percent';

const props = withDefaults(
  defineProps<{
    value: number | string | null | undefined;
    label: string;
    hint?: string;
    icon?: string;
    format?: StatFormat;
    duotone?: DuotoneName | null;
    size?: 'md' | 'lg' | 'xl';
    animated?: boolean;
  }>(),
  { format: 'number', duotone: null, size: 'lg', animated: true },
);

const { locale } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const numeric = computed(() => (typeof props.value === 'number' ? props.value : null));
const counted = useCountUp(numeric, { enabled: computed(() => props.animated && inView.value) });

const render = (value: number): string => {
  if (props.format === 'compact') return formatCompactNumber(value, locale.value);
  if (props.format === 'rating') return formatRatingValue(Math.round(value * 10) / 10, locale.value);
  if (props.format === 'percent') return new Intl.NumberFormat(locale.value, { style: 'percent', maximumFractionDigits: 0 }).format(value);
  return formatNumber(Math.round(value), locale.value);
};

const finalText = computed(() => {
  if (props.value === null || props.value === undefined) return '—';
  return typeof props.value === 'number' ? render(props.value) : props.value;
});

const visibleText = computed(() => (numeric.value !== null && counted.value !== null ? render(counted.value) : finalText.value));

const style = computed(() =>
  props.duotone
    ? { '--mx-stat-bg': duotones[props.duotone].background, '--mx-stat-fg': duotones[props.duotone].ink, '--mx-stat-accent': duotones[props.duotone].accent }
    : undefined,
);
</script>

<template>
  <div ref="root" data-testid="mx-stat" class="mx-stat" :class="[`mx-stat--${size}`, { 'mx-stat--duotone': duotone }]" :style="style">
    <span class="mx-stat__label">
      <VIcon v-if="icon" :icon="icon" size="18" aria-hidden="true" />
      {{ label }}
    </span>
    <span class="mx-stat__value">
      <span aria-hidden="true">{{ visibleText }}</span>
      <span class="mx-sr-only">{{ finalText }}</span>
    </span>
    <span v-if="hint" class="mx-stat__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.mx-stat {
  --mx-stat-bg: transparent;
  --mx-stat-fg: currentColor;
  --mx-stat-value: clamp(2.25rem, 5vw, 3.5rem);

  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
  color: var(--mx-stat-fg);
}

.mx-stat--md { --mx-stat-value: clamp(1.75rem, 3.5vw, 2.25rem); }
.mx-stat--xl { --mx-stat-value: clamp(3rem, 9vw, 6.5rem); }

.mx-stat--duotone {
  padding: 18px 20px;
  background: var(--mx-stat-bg);
  border-radius: var(--mx-radius-lg);
}

.mx-stat__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--mx-text-overline);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
}

.mx-stat__value {
  font-family: var(--mx-font-display);
  font-size: var(--mx-stat-value);
  font-weight: 800;
  font-stretch: 82%;
  letter-spacing: var(--mx-tracking-numeral);
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.mx-stat__hint {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.8;
}
</style>
