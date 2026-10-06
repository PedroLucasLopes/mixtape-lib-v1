<script setup lang="ts" generic="T extends string | number">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export interface SegmentedOption<V> {
  value: V;
  label: string;
  icon?: string;
}

const model = defineModel<T>({ required: true });

const props = withDefaults(
  defineProps<{
    options: readonly SegmentedOption<T>[];
    label: string;
    size?: 'sm' | 'md';
    block?: boolean;
  }>(),
  { size: 'md', block: false },
);

const buttons = ref<Array<HTMLButtonElement | undefined>>([]);

const setButton = (element: unknown, index: number) => {
  buttons.value[index] = element instanceof HTMLButtonElement ? element : undefined;
};
const indicator = ref({ left: 0, width: 0, ready: false });
let observer: ResizeObserver | null = null;

const measure = () => {
  const index = props.options.findIndex((option) => option.value === model.value);
  const button = buttons.value[index];
  if (!button) return;
  indicator.value = { left: button.offsetLeft, width: button.offsetWidth, ready: true };
};

const select = (value: T) => {
  model.value = value;
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  let next: number | null = null;
  if (event.key in keys) next = (index + keys[event.key]! + props.options.length) % props.options.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = props.options.length - 1;
  if (next === null) return;
  event.preventDefault();
  const option = props.options[next];
  if (!option) return;
  select(option.value);
  void nextTick(() => buttons.value[next!]?.focus());
};

watch([model, () => props.options], () => void nextTick(measure));

onMounted(() => {
  measure();
  if (typeof ResizeObserver !== 'undefined' && buttons.value[0]?.parentElement) {
    observer = new ResizeObserver(measure);
    observer.observe(buttons.value[0].parentElement);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="mx-segmented" :class="[`mx-segmented--${size}`, { 'mx-segmented--block': block }]" role="radiogroup" :aria-label="label">
    <span
      class="mx-segmented__indicator"
      :class="{ 'mx-segmented__indicator--ready': indicator.ready }"
      :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
      aria-hidden="true"
    />
    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      :ref="(element) => setButton(element, index)"
      type="button"
      role="radio"
      class="mx-segmented__option"
      :class="{ 'mx-segmented__option--active': option.value === model }"
      :aria-checked="option.value === model"
      :tabindex="option.value === model ? 0 : -1"
      @click="select(option.value)"
      @keydown="onKeydown($event, index)"
    >
      <VIcon v-if="option.icon" :icon="option.icon" size="18" aria-hidden="true" />
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.mx-segmented {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  padding: 4px;
  overflow-x: auto;
  background: var(--mx-glass);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-pill);
  box-shadow: inset 0 1px 0 var(--mx-glass-highlight);
  scrollbar-width: none;
}

.mx-segmented::-webkit-scrollbar {
  display: none;
}

.mx-segmented--block {
  display: flex;
  width: 100%;
}

.mx-segmented--block .mx-segmented__option {
  flex: 1;
}

.mx-segmented__indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  z-index: 0;
  background: var(--mx-cta);
  border: 2px solid var(--mx-cta-outline);
  border-radius: var(--mx-radius-pill);
  opacity: 0;
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    width var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-segmented__indicator--ready {
  opacity: 1;
}

.mx-segmented__option {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 16px;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--mx-radius-pill);
  transition: color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-segmented--sm .mx-segmented__option {
  min-height: 34px;
  padding: 0 12px;
  font-size: 0.8125rem;
}

.mx-segmented__option:hover {
  color: var(--mx-on-surface);
}

.mx-segmented__option--active,
.mx-segmented__option--active:hover {
  color: var(--mx-on-cta);
}

.mx-segmented__option:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-segmented__indicator {
    transition: none;
  }
}
</style>
