<script setup lang="ts">
import { computed } from 'vue';
import { formatNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';

export interface SplitSegment {
  label: string;
  value: number;
  color: string;
}

const props = withDefaults(defineProps<{ segments: readonly SplitSegment[]; legend?: boolean; height?: number }>(), {
  legend: true,
  height: 10,
});

const { locale } = useMixtapeText();

const total = computed(() => props.segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0));
const parts = computed(() =>
  props.segments.map((segment) => ({ ...segment, share: total.value ? (Math.max(0, segment.value) / total.value) * 100 : 0 })),
);
</script>

<template>
  <div data-testid="mx-split-bar" class="mx-split-bar">
    <div class="mx-split-bar__track" :style="{ height: `${height}px` }" aria-hidden="true">
      <span v-for="part in parts" :key="part.label" class="mx-split-bar__part" :style="{ width: `${part.share}%`, background: part.color }" />
    </div>
    <ul v-if="legend" class="mx-split-bar__legend">
      <li v-for="part in parts" :key="part.label">
        <span class="mx-split-bar__swatch" :style="{ background: part.color }" aria-hidden="true" />
        {{ part.label }}
        <strong>{{ formatNumber(part.value, locale) }}</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mx-split-bar {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.mx-split-bar__track {
  display: flex;
  overflow: hidden;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
}

.mx-split-bar__part {
  display: block;
  height: 100%;
  transition: width var(--mx-duration-slower) var(--mx-ease-out);
}

.mx-split-bar__part + .mx-split-bar__part {
  box-shadow: -2px 0 0 var(--mx-background);
}

.mx-split-bar__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin: 0;
  padding: 0;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
  list-style: none;
}

.mx-split-bar__legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mx-split-bar__legend strong {
  color: var(--mx-on-surface);
  font-variant-numeric: tabular-nums;
}

.mx-split-bar__swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}
</style>
