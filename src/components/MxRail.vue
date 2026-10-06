<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { prefersReducedMotion } from '../motion/reducedMotion';
import MxIconButton from './MxIconButton.vue';

withDefaults(defineProps<{ label: string; itemWidth?: string; gap?: string }>(), {
  itemWidth: 'clamp(150px, 42vw, 220px)',
  gap: '16px',
});

const { t } = useMixtapeText();
const track = ref<HTMLElement | null>(null);
const canPrevious = ref(false);
const canNext = ref(false);
let observer: ResizeObserver | null = null;

const update = () => {
  const element = track.value;
  if (!element) return;
  canPrevious.value = element.scrollLeft > 4;
  canNext.value = element.scrollLeft + element.clientWidth < element.scrollWidth - 4;
};

const scroll = (direction: 1 | -1) => {
  const element = track.value;
  if (!element) return;
  element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

onMounted(async () => {
  await nextTick();
  update();
  if (typeof ResizeObserver !== 'undefined' && track.value) {
    observer = new ResizeObserver(update);
    observer.observe(track.value);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="mx-rail" :style="{ '--mx-rail-item': itemWidth, '--mx-rail-gap': gap }">
    <div class="mx-rail__controls">
      <MxIconButton icon="mdi-chevron-left" :label="t('carousel.previous')" size="sm" :disabled="!canPrevious" @click="scroll(-1)" />
      <MxIconButton icon="mdi-chevron-right" :label="t('carousel.next')" size="sm" :disabled="!canNext" @click="scroll(1)" />
    </div>
    <ul
      ref="track"
      class="mx-rail__track"
      :class="{ 'mx-rail__track--start': !canPrevious, 'mx-rail__track--end': !canNext }"
      :aria-label="label"
      tabindex="0"
      @scroll.passive="update"
    >
      <slot />
    </ul>
  </div>
</template>

<style scoped>
.mx-rail {
  position: relative;
  min-width: 0;
}

.mx-rail__controls {
  position: absolute;
  top: -60px;
  right: 0;
  display: none;
  gap: 8px;
}

@media (min-width: 840px) and (hover: hover) {
  .mx-rail__controls {
    display: flex;
  }
}

.mx-rail__track {
  display: grid;
  grid-auto-columns: var(--mx-rail-item);
  grid-auto-flow: column;
  gap: var(--mx-rail-gap);
  margin: 0;
  padding: 8px 4px 16px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 4px;
  scrollbar-width: none;
  list-style: none;
  mask-image: linear-gradient(90deg, transparent, #000 32px, #000 calc(100% - 32px), transparent);
}

.mx-rail__track::-webkit-scrollbar {
  display: none;
}

.mx-rail__track--start {
  mask-image: linear-gradient(90deg, #000, #000 calc(100% - 32px), transparent);
}

.mx-rail__track--end {
  mask-image: linear-gradient(90deg, transparent, #000 32px, #000);
}

.mx-rail__track--start.mx-rail__track--end {
  mask-image: none;
}

.mx-rail__track:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
  border-radius: var(--mx-radius-md);
}

.mx-rail__track > :deep(*) {
  scroll-snap-align: start;
  min-width: 0;
}
</style>
