<script setup lang="ts" generic="T extends { id: string | number }">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { prefersReducedMotion } from '../motion/reducedMotion';
import MxIconButton from './MxIconButton.vue';

const props = withDefaults(
  defineProps<{
    items: T[];
    label: string;
    rows?: number;
    minItemWidth?: number;
    gap?: number;
  }>(),
  { rows: 2, minItemWidth: 160, gap: 20 },
);

defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const NUMBERS_WITHOUT_GAPS = 7;

const { t } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const columns = ref(1);
const current = ref(0);
let observer: ResizeObserver | null = null;

const perPage = computed(() => Math.max(1, columns.value * props.rows));

const pages = computed(() => {
  const result: { index: number; entries: { item: T; index: number }[] }[] = [];
  for (let start = 0; start < props.items.length; start += perPage.value) {
    result.push({
      index: result.length,
      entries: props.items.slice(start, start + perPage.value).map((item, offset) => ({ item, index: start + offset })),
    });
  }
  return result;
});

const total = computed(() => pages.value.length);

const numbers = computed<Array<number | null>>(() => {
  const count = total.value;
  if (count <= NUMBERS_WITHOUT_GAPS) return Array.from({ length: count }, (_, page) => page);
  const near = new Set([0, count - 1, current.value - 1, current.value, current.value + 1]);
  if (current.value <= 2) [1, 2, 3].forEach((page) => near.add(page));
  if (current.value >= count - 3) [count - 4, count - 3, count - 2].forEach((page) => near.add(page));
  const sorted = [...near].filter((page) => page >= 0 && page < count).sort((a, b) => a - b);
  return sorted.flatMap((page, position) => (position > 0 && page - sorted[position - 1]! > 1 ? [null, page] : [page]));
});

const stride = () => (track.value ? track.value.clientWidth + props.gap : 1);

const goTo = (page: number, smooth = true) => {
  const element = track.value;
  if (!element) return;
  const target = Math.min(Math.max(page, 0), Math.max(total.value - 1, 0));
  current.value = target;
  element.scrollTo({ left: target * stride(), behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
};

const onScroll = () => {
  const element = track.value;
  if (!element || element.clientWidth === 0) return;
  current.value = Math.min(Math.max(Math.round(element.scrollLeft / stride()), 0), Math.max(total.value - 1, 0));
};

const measure = () => {
  const width = root.value?.clientWidth ?? 0;
  if (width === 0) return;
  const next = Math.max(1, Math.floor((width + props.gap) / (props.minItemWidth + props.gap)));
  if (next === columns.value) return;
  const firstVisible = current.value * perPage.value;
  columns.value = next;
  void nextTick(() => goTo(Math.floor(firstVisible / perPage.value), false));
};

watch(
  () => props.items,
  () => {
    current.value = 0;
    if (track.value) track.value.scrollLeft = 0;
  },
);

onMounted(() => {
  measure();
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(measure);
    observer.observe(root.value);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="root" class="mx-paged-grid" :style="{ '--mx-paged-columns': columns, '--mx-paged-gap': `${gap}px` }">
    <div ref="track" class="mx-paged-grid__track" role="group" :aria-label="label" @scroll.passive="onScroll">
      <ul
        v-for="page in pages"
        :key="page.index"
        class="mx-paged-grid__page"
        :aria-label="t('pager.page', { page: page.index + 1, total })"
      >
        <li v-for="entry in page.entries" :key="entry.item.id" class="mx-paged-grid__item">
          <slot :item="entry.item" :index="entry.index" />
        </li>
      </ul>
    </div>

    <nav v-if="total > 1" class="mx-paged-grid__pager" :aria-label="t('pager.label', { label })">
      <MxIconButton icon="mdi-chevron-left" :label="t('pager.previous')" size="sm" :disabled="current === 0" @click="goTo(current - 1)" />
      <ol class="mx-paged-grid__numbers">
        <li v-for="(page, position) in numbers" :key="page ?? `gap-${position}`">
          <span v-if="page === null" class="mx-paged-grid__gap" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            class="mx-paged-grid__number"
            :class="{ 'mx-paged-grid__number--current': page === current }"
            :aria-current="page === current ? 'page' : undefined"
            :aria-label="t('pager.goTo', { page: page + 1 })"
            @click="goTo(page)"
          >
            {{ page + 1 }}
          </button>
        </li>
      </ol>
      <MxIconButton
        icon="mdi-chevron-right"
        :label="t('pager.next')"
        size="sm"
        :disabled="current >= total - 1"
        @click="goTo(current + 1)"
      />
    </nav>

    <p class="mx-sr-only" aria-live="polite">{{ total > 1 ? t('pager.page', { page: current + 1, total }) : '' }}</p>
  </div>
</template>

<style scoped>
.mx-paged-grid {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.mx-paged-grid__track {
  display: flex;
  gap: var(--mx-paged-gap);
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.mx-paged-grid__track::-webkit-scrollbar {
  display: none;
}

.mx-paged-grid__page {
  box-sizing: border-box;
  display: grid;
  flex: 0 0 100%;
  grid-template-columns: repeat(var(--mx-paged-columns), minmax(0, 1fr));
  align-content: start;
  gap: var(--mx-paged-gap);
  margin: 0;
  padding: 8px 4px 16px;
  list-style: none;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.mx-paged-grid__item {
  min-width: 0;
}

.mx-paged-grid__pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.mx-paged-grid__numbers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-paged-grid__number {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--mx-on-surface-muted);
  cursor: pointer;
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--mx-radius-pill);
  transition:
    color var(--mx-duration-fast) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-paged-grid__number:hover {
  color: var(--mx-on-surface);
  border-color: var(--mx-outline-strong);
}

.mx-paged-grid__number--current,
.mx-paged-grid__number--current:hover {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-color: var(--mx-cta-outline);
}

.mx-paged-grid__number:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-paged-grid__gap {
  padding: 0 4px;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
}

@media (prefers-reduced-motion: reduce) {
  .mx-paged-grid__number {
    transition: none;
  }
}
</style>
