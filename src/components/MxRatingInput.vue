<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatRatingValue } from '../format';
import type { MixtapeTextKey } from '../i18n/catalog';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { prefersReducedMotion } from '../motion/reducedMotion';
import { blobColors } from '../theme/tokens';

const model = defineModel<number | null>({ default: null });

const props = withDefaults(
  defineProps<{
    label?: string;
    size?: number;
    disabled?: boolean;
    describe?: boolean;
  }>(),
  { size: 48, disabled: false, describe: true },
);

const emit = defineEmits<{ commit: [value: number] }>();

const { t, locale } = useMixtapeText();

const hover = ref<number | null>(null);
const bursts = ref<Array<{ id: number; disc: number; particles: Array<{ angle: number; color: string; distance: number }> }>>([]);
let burstId = 0;

const shown = computed(() => hover.value ?? model.value);

const fillFor = (index: number) => Math.max(0, Math.min(1, (shown.value ?? 0) - index));

const valueText = computed(() =>
  model.value === null ? t('rating.none') : t('rating.label', { value: formatRatingValue(model.value, locale.value) }),
);

const description = computed(() => {
  const value = shown.value;
  if (value === null) return t('rating.prompt');
  return t(`rating.scale.h${Math.round(value * 2)}` as MixtapeTextKey);
});

const valueAt = (event: PointerEvent, index: number) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const half = event.clientX - rect.left < rect.width / 2;
  return index + (half ? 0.5 : 1);
};

const burst = (value: number) => {
  if (prefersReducedMotion()) return;
  const disc = Math.max(0, Math.ceil(value) - 1);
  const id = ++burstId;
  const particles = Array.from({ length: 10 }, (_, index) => ({
    angle: index * 36 + (index % 2) * 12,
    color: blobColors[index % blobColors.length]!,
    distance: 26 + (index % 3) * 10,
  }));
  bursts.value = [...bursts.value, { id, disc, particles }];
  setTimeout(() => {
    bursts.value = bursts.value.filter((entry) => entry.id !== id);
  }, 700);
};

const set = (value: number) => {
  if (props.disabled) return;
  const next = Math.max(0, Math.min(5, Math.round(value * 2) / 2));
  model.value = next;
  burst(next);
  emit('commit', next);
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;
  const current = model.value ?? 0;
  const steps: Record<string, number> = {
    ArrowRight: current + 0.5,
    ArrowUp: current + 0.5,
    ArrowLeft: current - 0.5,
    ArrowDown: current - 0.5,
    PageUp: current + 1,
    PageDown: current - 1,
    Home: 0,
    End: 5,
  };
  const next = steps[event.key];
  if (next === undefined) return;
  event.preventDefault();
  set(next);
};
</script>

<template>
  <div data-testid="mx-rating-input" class="mx-rating-input" :class="{ 'mx-rating-input--disabled': disabled }" :style="{ '--mx-rating-input-size': `${size}px` }">
    <div class="mx-rating-input__row">
      <button
        type="button"
        data-testid="mx-rating-input-zero"
        class="mx-rating-input__zero"
        :class="{ 'mx-rating-input__zero--active': model === 0 }"
        :aria-pressed="model === 0"
        :disabled="disabled"
        :aria-label="t('rating.zero')"
        @click="set(0)"
      >
        0
      </button>
      <div
        data-testid="mx-rating-input-slider"
        class="mx-rating-input__discs"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-label="label ?? t('rating.input')"
        aria-valuemin="0"
        aria-valuemax="5"
        :aria-valuenow="model ?? undefined"
        :aria-valuetext="valueText"
        :aria-disabled="disabled || undefined"
        @keydown="onKeydown"
        @pointerleave="hover = null"
      >
        <span
          v-for="index in [0, 1, 2, 3, 4]"
          :key="index"
          data-testid="mx-rating-input-disc"
          class="mx-rating-input__disc"
          :class="{ 'mx-rating-input__disc--on': fillFor(index) > 0 }"
          @pointermove="hover = valueAt($event, index)"
          @click="set(valueAt($event as PointerEvent, index))"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle class="mx-rating-input__empty" cx="12" cy="12" r="10.4" />
            <g :style="{ clipPath: `inset(0 ${100 - fillFor(index) * 100}% 0 0)` }" class="mx-rating-input__fill-group">
              <circle class="mx-rating-input__fill" cx="12" cy="12" r="11" />
              <circle class="mx-rating-input__groove" cx="12" cy="12" r="7.6" />
              <circle class="mx-rating-input__groove" cx="12" cy="12" r="5.6" />
              <circle class="mx-rating-input__label" cx="12" cy="12" r="3.5" />
            </g>
            <circle class="mx-rating-input__hole" cx="12" cy="12" r="1.1" />
          </svg>
          <template v-for="entry in bursts" :key="entry.id">
            <template v-if="entry.disc === index">
              <span
                v-for="(particle, particleIndex) in entry.particles"
                :key="particleIndex"
                class="mx-rating-input__particle"
                :style="{ '--mx-burst-angle': `${particle.angle}deg`, '--mx-burst-distance': `-${particle.distance}px`, background: particle.color }"
              />
            </template>
          </template>
        </span>
      </div>
    </div>
    <p v-if="describe" data-testid="mx-rating-input-description" class="mx-rating-input__description" aria-live="polite">
      <strong v-if="shown !== null" class="mx-rating-input__number">{{ formatRatingValue(shown, locale) }}</strong>
      {{ description }}
    </p>
  </div>
</template>

<style scoped>
.mx-rating-input {
  --mx-rating-input-size: 48px;
  display: grid;
  gap: 10px;
  justify-items: start;
}

.mx-rating-input__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mx-rating-input__discs {
  display: flex;
  gap: calc(var(--mx-rating-input-size) * 0.12);
  padding: 6px;
  border-radius: var(--mx-radius-pill);
  touch-action: manipulation;
}

.mx-rating-input__discs:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-rating-input__disc {
  position: relative;
  display: block;
  width: var(--mx-rating-input-size);
  height: var(--mx-rating-input-size);
  cursor: pointer;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-rating-input__disc svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.mx-rating-input__disc:hover {
  transform: scale(1.12) rotate(-8deg);
}

.mx-rating-input__disc--on {
  animation: mx-wiggle 380ms var(--mx-ease-out);
}

.mx-rating-input__empty {
  fill: color-mix(in srgb, var(--mx-on-surface) 5%, transparent);
  stroke: var(--mx-outline-strong);
  stroke-width: 1.4;
}

.mx-rating-input__fill-group {
  transition: clip-path var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-rating-input__fill {
  fill: var(--mx-primary);
}

.mx-rating-input__groove {
  fill: none;
  stroke: var(--mx-on-primary);
  stroke-opacity: 0.22;
  stroke-width: 0.8;
}

.mx-rating-input__label {
  fill: var(--mx-secondary);
}

.mx-rating-input__hole {
  fill: var(--mx-background);
}

.mx-rating-input__zero {
  display: grid;
  place-items: center;
  width: calc(var(--mx-rating-input-size) * 0.72);
  height: calc(var(--mx-rating-input-size) * 0.72);
  padding: 0;
  font-family: var(--mx-font-display);
  font-size: calc(var(--mx-rating-input-size) * 0.32);
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  cursor: pointer;
  background: transparent;
  border: 2px dashed var(--mx-outline-strong);
  border-radius: 50%;
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    background-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-rating-input__zero:hover {
  transform: scale(1.08);
}

.mx-rating-input__zero--active {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-style: solid;
  border-color: var(--mx-cta-outline);
}

.mx-rating-input__zero:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-rating-input__particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  pointer-events: none;
  border-radius: 50%;
  animation: mx-burst 620ms var(--mx-ease-out) forwards;
}

.mx-rating-input__description {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-height: 1.6em;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--mx-on-surface-muted);
}

.mx-rating-input__number {
  font-family: var(--mx-font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--mx-on-surface);
  font-variant-numeric: tabular-nums;
}

.mx-rating-input--disabled {
  opacity: 0.5;
}

.mx-rating-input--disabled .mx-rating-input__disc {
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .mx-rating-input__disc,
  .mx-rating-input__zero,
  .mx-rating-input__fill-group {
    transition: none;
  }

  .mx-rating-input__disc:hover,
  .mx-rating-input__zero:hover {
    transform: none;
  }

  .mx-rating-input__disc--on {
    animation: none;
  }
}
</style>
