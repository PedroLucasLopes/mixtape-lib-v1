<script setup lang="ts" generic="T extends { id: string | number }">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { usePrefersReducedMotion } from '../motion/reducedMotion';
import { useInView } from '../motion/useInView';
import MxIconButton from './MxIconButton.vue';

const props = withDefaults(
  defineProps<{
    items: readonly T[];
    label: string;
    interval?: number;
  }>(),
  { interval: 10_000 },
);

defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const { t } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root, { once: false, rootMargin: '0px' });
const reduced = usePrefersReducedMotion();
const current = ref(0);
const paused = ref(reduced.value);
const hovering = ref(false);
const focused = ref(false);
const pageVisible = ref(true);
const cycle = ref(0);
let timer: ReturnType<typeof setTimeout> | undefined;

const total = computed(() => props.items.length);
const running = computed(
  () => total.value > 1 && !paused.value && !hovering.value && !focused.value && inView.value && pageVisible.value,
);

const show = (index: number) => {
  if (total.value === 0) return;
  current.value = (index + total.value) % total.value;
};

const schedule = () => {
  clearTimeout(timer);
  if (!running.value) return;
  cycle.value += 1;
  timer = setTimeout(() => show(current.value + 1), props.interval);
};

const onVisibility = () => {
  pageVisible.value = document.visibilityState !== 'hidden';
};

const onFocusOut = (event: FocusEvent) => {
  if (!root.value?.contains(event.relatedTarget as Node | null)) focused.value = false;
};

watch([running, current], schedule);
watch(
  () => props.items,
  () => {
    if (current.value >= total.value) current.value = 0;
  },
);

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility);
  schedule();
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  document.removeEventListener('visibilitychange', onVisibility);
});
</script>

<template>
  <section
    ref="root"
    class="mx-rotator"
    :class="{ 'mx-rotator--running': running }"
    :style="{ '--mx-rotator-interval': `${interval}ms` }"
    aria-roledescription="carousel"
    :aria-label="label"
    data-testid="mx-rotator"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="focused = true"
    @focusout="onFocusOut"
  >
    <div class="mx-rotator__stage" :aria-live="running ? 'off' : 'polite'">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="mx-rotator__slide"
        :class="{ 'mx-rotator__slide--current': index === current }"
        role="group"
        aria-roledescription="slide"
        :aria-label="t('rotator.slide', { index: index + 1, total })"
        :inert="index === current ? undefined : true"
        data-testid="mx-rotator-slide"
        :data-current="index === current"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>

    <div v-if="total > 1" class="mx-rotator__controls">
      <MxIconButton
        :icon="paused ? 'mdi-play' : 'mdi-pause'"
        :label="paused ? t('rotator.play') : t('rotator.pause')"
        size="sm"
        data-testid="mx-rotator-toggle"
        @click="paused = !paused"
      />

      <div class="mx-rotator__dots">
        <button
          v-for="(item, index) in items"
          :key="item.id"
          type="button"
          class="mx-rotator__dot"
          :class="{ 'mx-rotator__dot--current': index === current }"
          :aria-label="t('rotator.goTo', { index: index + 1 })"
          :aria-current="index === current ? 'true' : undefined"
          data-testid="mx-rotator-dot"
          @click="show(index)"
        >
          <span v-if="index === current" :key="cycle" class="mx-rotator__fill" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mx-rotator {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.mx-rotator__stage {
  display: grid;
  min-width: 0;
}

.mx-rotator__slide {
  grid-area: 1 / 1;
  min-width: 0;
  visibility: hidden;
  opacity: 0;
  transform: translate3d(0, 10px, 0);
  transition:
    opacity 600ms var(--mx-ease-out),
    transform 600ms var(--mx-ease-out),
    visibility 0s linear 600ms;
}

.mx-rotator__slide--current {
  visibility: visible;
  opacity: 1;
  transform: none;
  transition:
    opacity 600ms var(--mx-ease-out) 150ms,
    transform 600ms var(--mx-ease-out) 150ms,
    visibility 0s linear 0s;
}

.mx-rotator__controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mx-rotator__dots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.mx-rotator__dot {
  position: relative;
  width: 10px;
  height: 10px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: var(--mx-outline-strong);
  border: 0;
  border-radius: var(--mx-radius-pill);
  transition:
    width var(--mx-duration-fast) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-rotator__dot::before {
  position: absolute;
  inset: -12px;
  content: '';
}

.mx-rotator__dot--current {
  width: 34px;
  background: color-mix(in srgb, var(--mx-cta) 35%, transparent);
}

.mx-rotator__dot:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-rotator__fill {
  position: absolute;
  inset: 0;
  background: var(--mx-cta);
  transform-origin: left center;
  transform: scaleX(1);
}

.mx-rotator--running .mx-rotator__fill {
  animation: mx-rotator-fill var(--mx-rotator-interval) linear both;
}

@keyframes mx-rotator-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .mx-rotator__slide,
  .mx-rotator__slide--current {
    transform: none;
    transition: none;
  }

  .mx-rotator__dot {
    transition: none;
  }

  .mx-rotator--running .mx-rotator__fill {
    animation: none;
  }
}
</style>
