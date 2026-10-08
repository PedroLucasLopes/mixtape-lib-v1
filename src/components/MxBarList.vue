<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatCompactNumber, formatNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { useInView } from '../motion/useInView';
import { blobColors } from '../theme/tokens';
import MxLink from './MxLink.vue';

export interface BarListItem {
  key: string;
  label: string;
  value: number;
  sublabel?: string;
  to?: LinkTarget;
}

const props = withDefaults(
  defineProps<{
    items: readonly BarListItem[];
    compact?: boolean;
    numbered?: boolean;
    colorful?: boolean;
    label?: string;
  }>(),
  { compact: false, numbered: false, colorful: true },
);

const { locale } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)));
const display = (value: number) => (props.compact ? formatCompactNumber(value, locale.value) : formatNumber(value, locale.value));
</script>

<template>
  <ol ref="root" data-testid="mx-bar-list" class="mx-bar-list" :class="{ 'mx-bar-list--shown': inView, 'mx-bar-list--numbered': numbered }" :aria-label="label">
    <li
      v-for="(item, index) in items"
      :key="item.key"
      data-testid="mx-bar-list-item"
      class="mx-bar-list__item"
      :style="{
        '--mx-bar-share': `${(item.value / max) * 100}%`,
        '--mx-bar-color': colorful ? blobColors[index % blobColors.length] : 'var(--mx-primary)',
        '--mx-bar-delay': `${index * 70}ms`,
      }"
    >
      <span v-if="numbered" class="mx-bar-list__rank" aria-hidden="true">{{ index + 1 }}</span>
      <div class="mx-bar-list__body">
        <div class="mx-bar-list__line">
          <component :is="item.to ? MxLink : 'span'" data-testid="mx-bar-list-label" :to="item.to" class="mx-bar-list__label">{{ item.label }}</component>
          <span class="mx-bar-list__value">{{ display(item.value) }}</span>
        </div>
        <span v-if="item.sublabel" class="mx-bar-list__sublabel">{{ item.sublabel }}</span>
        <span class="mx-bar-list__bar" aria-hidden="true" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
.mx-bar-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-bar-list__item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.mx-bar-list__rank {
  flex-shrink: 0;
  width: 1.6em;
  font-family: var(--mx-font-display);
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  font-variant-numeric: tabular-nums;
  color: var(--mx-on-surface-muted);
}

.mx-bar-list__body {
  display: grid;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.mx-bar-list__line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.mx-bar-list__label {
  overflow: hidden;
  font-weight: 750;
  color: inherit;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.mx-bar-list__label:hover {
  text-decoration: underline;
}

a.mx-bar-list__label:focus-visible {
  outline: 2px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-bar-list__value {
  flex-shrink: 0;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.mx-bar-list__sublabel {
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-bar-list__bar {
  display: block;
  width: var(--mx-bar-share);
  height: 8px;
  background: var(--mx-bar-color);
  border-radius: var(--mx-radius-pill);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 900ms var(--mx-ease-out) var(--mx-bar-delay);
}

.mx-bar-list--shown .mx-bar-list__bar {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .mx-bar-list__bar {
    transform: none;
    transition: none;
  }
}
</style>
