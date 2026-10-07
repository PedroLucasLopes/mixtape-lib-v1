<script setup lang="ts">
import { computed } from 'vue';
import { duotoneFor, hashString } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { duotones } from '../theme/tokens';

export interface BalloonOption {
  value: string;
  label: string;
  images?: readonly string[];
}

const props = withDefaults(
  defineProps<{
    options: readonly BalloonOption[];
    label: string;
    max?: number | null;
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  { max: null, loading: false, skeletonCount: 12 },
);

const model = defineModel<string[]>({ required: true });

const { t } = useMixtapeText();

const SIZES = ['sm', 'md', 'lg'] as const;

const full = computed(() => props.max !== null && model.value.length >= props.max);

const balloons = computed(() =>
  props.options.map((option, index) => {
    const seed = hashString(option.value);
    const colors = duotones[duotoneFor(option.value)];
    return {
      ...option,
      images: (option.images ?? []).slice(0, 3),
      size: SIZES[seed % 3],
      style: {
        '--balloon-bg': colors.background,
        '--balloon-ink': colors.ink,
        '--balloon-accent': colors.accent,
        '--balloon-delay': `${Math.min(index, 18) * 55}ms`,
        '--balloon-float': `${5.5 + (seed % 7) * 0.45}s`,
        '--balloon-sway': `${seed % 2 === 0 ? 2.5 : -2.5}deg`,
        '--balloon-offset': `${(Math.floor(seed / 3) % 4) * 8}px`,
      },
    };
  }),
);

function selected(value: string): boolean {
  return model.value.includes(value);
}

function toggle(value: string): void {
  if (selected(value)) {
    model.value = model.value.filter((item) => item !== value);
  } else if (!full.value) {
    model.value = [...model.value, value];
  }
}
</script>

<template>
  <div class="mx-balloons">
    <div v-if="loading" class="mx-balloons__field" aria-hidden="true">
      <span
        v-for="index in skeletonCount"
        :key="index"
        class="mx-balloon mx-balloon--skeleton"
        :class="`mx-balloon--${SIZES[(index * 2) % 3]}`"
        :style="{ '--balloon-delay': `${index * 40}ms`, '--balloon-offset': `${(index % 4) * 8}px` }"
      >
        <span class="mx-balloon__float">
          <span class="mx-balloon__body" />
          <svg class="mx-balloon__string" viewBox="0 0 12 44" focusable="false"><path d="M6 0c-5 9 5 15 0 24s4 14 0 20" /></svg>
        </span>
      </span>
    </div>

    <div v-else class="mx-balloons__field" role="group" :aria-label="label">
      <button
        v-for="balloon in balloons"
        :key="balloon.value"
        type="button"
        class="mx-balloon"
        :class="[`mx-balloon--${balloon.size}`, { 'mx-balloon--selected': selected(balloon.value), 'mx-balloon--blocked': full && !selected(balloon.value) }]"
        :style="balloon.style"
        :aria-pressed="selected(balloon.value)"
        :aria-disabled="full && !selected(balloon.value) ? 'true' : undefined"
        @click="toggle(balloon.value)"
      >
        <span class="mx-balloon__float">
          <span class="mx-balloon__body">
            <span v-if="balloon.images.length" class="mx-balloon__covers" aria-hidden="true">
              <img
                v-for="(image, index) in balloon.images"
                :key="image"
                class="mx-balloon__cover"
                :src="image"
                :style="{ '--cover-index': index }"
                alt=""
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="mx-balloon__label">{{ balloon.label }}</span>
            <span v-if="selected(balloon.value)" class="mx-balloon__check" aria-hidden="true">
              <VIcon icon="mdi-check" size="16" />
            </span>
          </span>
          <svg class="mx-balloon__string" viewBox="0 0 12 44" aria-hidden="true" focusable="false"><path d="M6 0c-5 9 5 15 0 24s4 14 0 20" /></svg>
        </span>
      </button>
    </div>

    <p v-if="!loading" class="mx-balloons__status" aria-live="polite">
      {{ max !== null ? t('balloons.counter', { count: model.length, max }) : t('balloons.selected', { count: model.length }) }}
    </p>
  </div>
</template>

<style scoped>
.mx-balloons {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.mx-balloons__field {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 10px 14px;
  padding: 18px 4px 8px;
}

.mx-balloon {
  --balloon-size: 128px;
  position: relative;
  display: grid;
  align-content: start;
  justify-items: center;
  width: var(--balloon-size);
  margin-top: var(--balloon-offset, 0px);
  padding: 0;
  font: inherit;
  color: var(--balloon-ink);
  cursor: pointer;
  background: none;
  border: 0;
  animation: mx-balloon-rise var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy) var(--balloon-delay, 0ms) both;
  -webkit-tap-highlight-color: transparent;
}

.mx-balloon--sm {
  --balloon-size: 116px;
}

.mx-balloon--lg {
  --balloon-size: 142px;
}

.mx-balloon__body {
  position: relative;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 6px;
  width: var(--balloon-size);
  aspect-ratio: 0.88;
  padding: 14px 10px 18px;
  overflow: visible;
  color: var(--mx-on-surface);
  background:
    radial-gradient(circle at 32% 26%, var(--mx-glass-highlight) 0 14%, transparent 15%),
    color-mix(in srgb, var(--balloon-bg) 22%, var(--mx-surface));
  border: 2px solid color-mix(in srgb, var(--balloon-bg) 70%, transparent);
  border-radius: 50% 50% 47% 53% / 56% 56% 44% 44%;
  box-shadow: inset -10px -14px 22px -12px color-mix(in srgb, var(--balloon-bg) 60%, transparent);
  transform-origin: 50% 100%;
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    background-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-balloon__float {
  display: grid;
  align-content: start;
  justify-items: center;
  transition: translate var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
  animation: mx-balloon-float var(--balloon-float, 6s) ease-in-out var(--balloon-delay, 0ms) infinite alternate;
}

.mx-balloon__body::after {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 50%;
  width: 12px;
  height: 9px;
  background: color-mix(in srgb, var(--balloon-bg) 70%, var(--mx-surface));
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  transform: translateX(-50%);
}

.mx-balloon__string {
  width: 12px;
  height: 44px;
  margin-top: 3px;
  overflow: visible;
  fill: none;
  stroke: color-mix(in srgb, var(--mx-on-surface) 45%, transparent);
  stroke-linecap: round;
  stroke-width: 1.5;
  mask-image: linear-gradient(#000 40%, transparent);
}

.mx-balloon__covers {
  display: flex;
  justify-content: center;
}

.mx-balloon__cover {
  width: 40px;
  height: 40px;
  margin-inline-start: -12px;
  object-fit: cover;
  background: var(--mx-surface-variant);
  border: 2px solid var(--mx-surface);
  border-radius: 8px;
  transform: rotate(calc((var(--cover-index) - 1) * 8deg));
}

.mx-balloon__cover:first-child {
  margin-inline-start: 0;
}

.mx-balloon__label {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-family: var(--mx-font-display);
  font-size: 0.9375rem;
  font-weight: 800;
  line-height: 1.05;
  text-align: center;
  text-transform: lowercase;
}

.mx-balloon__check {
  position: absolute;
  top: 6px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border: 2px solid var(--mx-cta-outline);
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--mx-surface);
}

.mx-balloon--selected .mx-balloon__body {
  color: var(--balloon-ink);
  background:
    radial-gradient(circle at 32% 26%, var(--mx-glass-highlight) 0 14%, transparent 15%),
    var(--balloon-bg);
  border-color: var(--balloon-accent);
  transform: scale(1.08);
}

.mx-balloon--selected .mx-balloon__body::after {
  background: var(--balloon-bg);
}

.mx-balloon--blocked {
  cursor: not-allowed;
  opacity: 0.5;
}

.mx-balloon:not(.mx-balloon--blocked):hover .mx-balloon__float {
  translate: 0 -6px;
}

.mx-balloon:not(.mx-balloon--blocked):hover .mx-balloon__body {
  transform: scale(1.05);
}

.mx-balloon--selected:hover .mx-balloon__body {
  transform: scale(1.1);
}

.mx-balloon:focus-visible {
  outline: none;
}

.mx-balloon:focus-visible .mx-balloon__body {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
}

.mx-balloon--skeleton {
  --balloon-bg: var(--mx-surface-variant);
  cursor: default;
}

.mx-balloon--skeleton .mx-balloon__body {
  background: var(--mx-surface-variant);
  border-color: transparent;
  box-shadow: none;
}

.mx-balloons__status {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  color: var(--mx-on-surface-muted);
}

@keyframes mx-balloon-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 56px, 0) scale(0.7);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes mx-balloon-float {
  from {
    transform: translate3d(0, 0, 0) rotate(calc(var(--balloon-sway) * -1));
  }
  to {
    transform: translate3d(0, -10px, 0) rotate(var(--balloon-sway));
  }
}

@media (max-width: 420px) {
  .mx-balloons__field {
    gap: 6px 8px;
  }

  .mx-balloon {
    --balloon-size: 104px;
  }

  .mx-balloon--sm {
    --balloon-size: 96px;
  }

  .mx-balloon--lg {
    --balloon-size: 112px;
  }

  .mx-balloon__cover {
    width: 34px;
    height: 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-balloon,
  .mx-balloon__float,
  .mx-balloon__body {
    animation: none;
    transition: none;
  }

  .mx-balloon--selected .mx-balloon__body,
  .mx-balloon:hover .mx-balloon__body {
    transform: none;
  }

  .mx-balloon:hover .mx-balloon__float {
    translate: none;
  }
}
</style>
