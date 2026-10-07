<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';

export interface StepperStep {
  key: string;
  label: string;
  icon?: string;
}

const props = withDefaults(
  defineProps<{
    steps: readonly StepperStep[];
    label: string;
    reachable?: number;
  }>(),
  { reachable: 0 },
);

const model = defineModel<number>({ required: true });

const { t } = useMixtapeText();
const id = useId();
const tabs: HTMLButtonElement[] = [];
const panel = ref<HTMLElement | null>(null);
const direction = ref<'forward' | 'back'>('forward');
let focusPanelAfterEnter = false;

const limit = computed(() => Math.max(props.reachable, model.value));
const current = computed(() => props.steps[model.value]);
const progress = computed(() => (props.steps.length > 1 ? model.value / (props.steps.length - 1) : 1));

watch(model, (next, previous) => {
  direction.value = next >= previous ? 'forward' : 'back';
});

function setTab(element: unknown, index: number): void {
  if (element instanceof HTMLButtonElement) tabs[index] = element;
}

function go(index: number, fromTabs: boolean): void {
  if (index < 0 || index > limit.value || index === model.value) return;
  focusPanelAfterEnter = !fromTabs;
  model.value = index;
  if (fromTabs) void nextTick(() => tabs[index]?.focus());
}

function onKeydown(event: KeyboardEvent, index: number): void {
  const targets: Record<string, number> = {
    ArrowRight: Math.min(index + 1, limit.value),
    ArrowLeft: Math.max(index - 1, 0),
    Home: 0,
    End: limit.value,
  };
  const next = targets[event.key];
  if (next === undefined) return;
  event.preventDefault();
  go(next, true);
}

function afterEnter(): void {
  if (focusPanelAfterEnter) panel.value?.focus({ preventScroll: true });
  focusPanelAfterEnter = false;
}

watch(model, () => {
  if (!focusPanelAfterEnter && document.activeElement && panel.value?.contains(document.activeElement)) {
    focusPanelAfterEnter = true;
  }
}, { flush: 'pre' });
</script>

<template>
  <div class="mx-stepper">
    <div class="mx-stepper__rail" :style="{ '--mx-stepper-count': steps.length }">
      <div class="mx-stepper__track" aria-hidden="true">
        <span class="mx-stepper__fill" :style="{ transform: `scaleX(${progress})` }" />
      </div>
      <div class="mx-stepper__tabs" role="tablist" :aria-label="label">
        <button
          v-for="(step, index) in steps"
          :id="`${id}-tab-${step.key}`"
          :key="step.key"
          :ref="(element) => setTab(element, index)"
          type="button"
          role="tab"
          class="mx-stepper__tab"
          :class="{
            'mx-stepper__tab--active': index === model,
            'mx-stepper__tab--done': index < reachable && index !== model,
            'mx-stepper__tab--locked': index > limit,
          }"
          :aria-controls="`${id}-panel-${step.key}`"
          :aria-selected="index === model"
          :aria-disabled="index > limit ? 'true' : undefined"
          :tabindex="index === model ? 0 : -1"
          @click="go(index, true)"
          @keydown="onKeydown($event, index)"
        >
          <span class="mx-stepper__dot" aria-hidden="true">
            <VIcon v-if="index < reachable && index !== model" icon="mdi-check" size="16" />
            <VIcon v-else-if="step.icon" :icon="step.icon" size="16" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="mx-stepper__label">{{ step.label }}</span>
        </button>
      </div>
    </div>

    <Transition :name="`mx-stepper-${direction}`" mode="out-in" @after-enter="afterEnter">
      <div
        v-if="current"
        :id="`${id}-panel-${current.key}`"
        :key="current.key"
        ref="panel"
        class="mx-stepper__panel"
        role="tabpanel"
        tabindex="-1"
        :aria-labelledby="`${id}-tab-${current.key}`"
      >
        <slot :name="current.key" :step="current" :index="model" />
      </div>
    </Transition>

    <p class="mx-sr-only" aria-live="polite">
      {{ current ? t('stepper.status', { current: model + 1, total: steps.length, label: current.label }) : '' }}
    </p>
  </div>
</template>

<style scoped>
.mx-stepper {
  display: grid;
  gap: 22px;
  min-width: 0;
}

.mx-stepper__rail {
  position: relative;
}

.mx-stepper__track {
  position: absolute;
  top: 19px;
  right: calc(100% / var(--mx-stepper-count, 4) / 2);
  left: calc(100% / var(--mx-stepper-count, 4) / 2);
  height: 4px;
  overflow: hidden;
  background: color-mix(in srgb, var(--mx-on-surface) 12%, transparent);
  border-radius: var(--mx-radius-pill);
}

.mx-stepper__fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--mx-cta), var(--mx-secondary));
  transform-origin: left center;
  transition: transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

.mx-stepper__tabs {
  position: relative;
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
}

.mx-stepper__tab {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 4px;
  font: inherit;
  color: var(--mx-on-surface-muted);
  cursor: pointer;
  background: none;
  border: 0;
}

.mx-stepper__tab--locked {
  cursor: not-allowed;
  opacity: 0.55;
}

.mx-stepper__dot {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  font-weight: 900;
  color: var(--mx-on-surface);
  background: var(--mx-surface);
  border: 2px solid color-mix(in srgb, var(--mx-on-surface) 18%, transparent);
  border-radius: 50%;
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-stepper__tab--done .mx-stepper__dot {
  color: var(--mx-on-secondary);
  background: var(--mx-secondary);
  border-color: var(--mx-secondary);
}

.mx-stepper__tab--active .mx-stepper__dot {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-color: var(--mx-cta-outline, var(--mx-cta));
  transform: scale(1.12);
}

.mx-stepper__tab:not(.mx-stepper__tab--locked):hover .mx-stepper__dot {
  border-color: var(--mx-cta);
}

.mx-stepper__label {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-stepper__tab--active .mx-stepper__label {
  color: var(--mx-on-surface);
}

.mx-stepper__tab:focus-visible {
  outline: none;
}

.mx-stepper__tab:focus-visible .mx-stepper__dot {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-stepper__panel {
  min-width: 0;
  outline: none;
}

@media (max-width: 600px) {
  .mx-stepper__tab:not(.mx-stepper__tab--active) .mx-stepper__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

.mx-stepper-forward-enter-active,
.mx-stepper-forward-leave-active,
.mx-stepper-back-enter-active,
.mx-stepper-back-leave-active {
  transition:
    opacity var(--mx-duration-normal) var(--mx-ease-out),
    transform var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-stepper-forward-enter-from,
.mx-stepper-back-leave-to {
  opacity: 0;
  transform: translate3d(32px, 0, 0);
}

.mx-stepper-forward-leave-to,
.mx-stepper-back-enter-from {
  opacity: 0;
  transform: translate3d(-32px, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .mx-stepper__fill,
  .mx-stepper__dot {
    transition: none;
  }

  .mx-stepper__tab--active .mx-stepper__dot {
    transform: none;
  }

  .mx-stepper-forward-enter-active,
  .mx-stepper-forward-leave-active,
  .mx-stepper-back-enter-active,
  .mx-stepper-back-leave-active {
    transition: opacity 1ms linear;
  }

  .mx-stepper-forward-enter-from,
  .mx-stepper-forward-leave-to,
  .mx-stepper-back-enter-from,
  .mx-stepper-back-leave-to {
    transform: none;
  }
}
</style>
