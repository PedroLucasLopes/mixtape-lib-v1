<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { LinkTarget } from '../links/links';
import MxLink from './MxLink.vue';

export type ButtonVariant = 'cta' | 'primary' | 'tonal' | 'glass' | 'ghost' | 'outline' | 'danger' | 'ink' | 'ink-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    appendIcon?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    type?: 'button' | 'submit' | 'reset';
    to?: LinkTarget;
    href?: string;
    spinnerDelay?: number;
  }>(),
  { variant: 'cta', size: 'md', type: 'button', spinnerDelay: 220 },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const showSpinner = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.loading,
  (loading) => {
    clearTimeout(timer);
    if (!loading) {
      showSpinner.value = false;
      return;
    }
    timer = setTimeout(() => {
      showSpinner.value = true;
    }, props.spinnerDelay);
  },
  { immediate: true },
);

onBeforeUnmount(() => clearTimeout(timer));

const slots = defineSlots<{ default?: () => unknown }>();

const isLink = computed(() => props.to !== undefined || props.href !== undefined);
const locked = computed(() => props.loading || props.disabled);
const iconOnly = computed(() => !props.label && !!props.icon && !slots.default);

const classes = computed(() => [
  'mx-button',
  `mx-button--${props.variant}`,
  `mx-button--${props.size}`,
  { 'mx-button--block': props.block, 'mx-button--busy': showSpinner.value, 'mx-button--icon-only': iconOnly.value },
]);

const onClick = (event: MouseEvent) => {
  if (locked.value) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};
</script>

<template>
  <MxLink
    v-if="isLink"
    :class="classes"
    :to="to"
    :href="href"
    :aria-disabled="locked || undefined"
    @click="onClick"
  >
    <span class="mx-button__content">
      <VIcon v-if="icon" :icon="icon" class="mx-button__icon" />
      <slot>{{ label }}</slot>
      <VIcon v-if="appendIcon" :icon="appendIcon" class="mx-button__icon mx-button__icon--append" />
    </span>
  </MxLink>
  <button
    v-else
    :class="classes"
    :type="type"
    :disabled="disabled"
    :aria-disabled="loading || undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span class="mx-button__content">
      <VIcon v-if="icon" :icon="icon" class="mx-button__icon" />
      <slot>{{ label }}</slot>
      <VIcon v-if="appendIcon" :icon="appendIcon" class="mx-button__icon mx-button__icon--append" />
    </span>
    <Transition name="mx-button-spinner">
      <span v-if="showSpinner" class="mx-button__spinner" aria-hidden="true">
        <span class="mx-button__disc" />
      </span>
    </Transition>
  </button>
</template>

<style scoped>
.mx-button {
  --mx-button-bg: var(--mx-cta);
  --mx-button-fg: var(--mx-on-cta);
  --mx-button-border: transparent;
  --mx-button-shadow: none;
  --mx-button-height: 46px;
  --mx-button-pad: 22px;
  --mx-button-font: 1rem;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--mx-button-height);
  padding: 0 var(--mx-button-pad);
  font-family: var(--mx-font-body);
  font-size: var(--mx-button-font);
  font-weight: 800;
  letter-spacing: -0.005em;
  line-height: 1;
  color: var(--mx-button-fg);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background: var(--mx-button-bg);
  border: 2px solid var(--mx-button-border);
  border-radius: var(--mx-radius-pill);
  box-shadow: var(--mx-button-shadow);
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    box-shadow var(--mx-duration-normal) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    color var(--mx-duration-fast) var(--mx-ease-out),
    opacity var(--mx-duration-fast) var(--mx-ease-out);
  -webkit-tap-highlight-color: transparent;
}

.mx-button--sm {
  --mx-button-height: 36px;
  --mx-button-pad: 14px;
  --mx-button-font: 0.875rem;
}

.mx-button--lg {
  --mx-button-height: 58px;
  --mx-button-pad: 30px;
  --mx-button-font: 1.0625rem;
}

.mx-button--block {
  display: flex;
  width: 100%;
}

.mx-button--icon-only {
  width: var(--mx-button-height);
  padding: 0;
}

.mx-button--cta {
  --mx-button-border: var(--mx-cta-outline);
  --mx-button-shadow: var(--mx-cta-shadow);
}

.mx-button--primary {
  --mx-button-bg: var(--mx-primary);
  --mx-button-fg: var(--mx-on-primary);
}

.mx-button--tonal {
  --mx-button-bg: color-mix(in srgb, var(--mx-primary) 16%, transparent);
  --mx-button-fg: var(--mx-link);
}

.mx-button--glass {
  --mx-button-bg: var(--mx-glass);
  --mx-button-fg: var(--mx-on-surface);
  --mx-button-border: var(--mx-glass-border);
  --mx-button-shadow: inset 0 1px 0 var(--mx-glass-highlight);
}

.mx-button--ghost {
  --mx-button-bg: transparent;
  --mx-button-fg: var(--mx-on-surface);
}

.mx-button--outline {
  --mx-button-bg: transparent;
  --mx-button-fg: var(--mx-on-surface);
  --mx-button-border: var(--mx-outline-strong);
}

.mx-button--danger {
  --mx-button-bg: var(--mx-error);
  --mx-button-fg: var(--mx-on-error);
}

.mx-button--ink {
  --mx-button-bg: var(--mx-hero-ink, var(--mx-on-surface));
  --mx-button-fg: var(--mx-hero-bg, var(--mx-surface));
  --mx-button-border: var(--mx-hero-ink, var(--mx-on-surface));
}

.mx-button--ink-outline {
  --mx-button-bg: transparent;
  --mx-button-fg: var(--mx-hero-ink, var(--mx-on-surface));
  --mx-button-border: var(--mx-hero-ink, var(--mx-on-surface));
}

.mx-button--ink-outline:hover:not(:disabled) {
  --mx-button-bg: color-mix(in srgb, var(--mx-hero-ink, var(--mx-on-surface)) 12%, transparent);
}

.mx-button:hover:not(:disabled):not([aria-disabled='true']) {
  transform: translateY(-2px);
}

.mx-button--ghost:hover:not(:disabled),
.mx-button--outline:hover:not(:disabled) {
  --mx-button-bg: var(--mx-surface-variant);
}

.mx-button:active:not(:disabled):not([aria-disabled='true']) {
  transform: translateY(0) scale(0.96);
  transition-duration: 90ms;
}

.mx-button:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-button:disabled,
.mx-button[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.45;
}

.mx-button--busy {
  cursor: progress;
  opacity: 1;
}

.mx-button__content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-button__icon {
  font-size: 1.25em;
  flex-shrink: 0;
}

.mx-button--busy .mx-button__content {
  opacity: 0;
}

.mx-button__spinner {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.mx-button__disc {
  width: 1.35em;
  height: 1.35em;
  border-radius: 50%;
  background:
    radial-gradient(circle, currentColor 0 18%, transparent 19% 32%, currentColor 33% 36%, transparent 37%),
    conic-gradient(from 0deg, currentColor 0 22%, transparent 22% 50%, currentColor 50% 72%, transparent 72%);
  opacity: 0.9;
  animation: mx-spin 700ms linear infinite;
}

.mx-button-spinner-enter-active,
.mx-button-spinner-leave-active {
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-out),
    transform var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-button-spinner-enter-from,
.mx-button-spinner-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

@media (prefers-reduced-motion: reduce) {
  .mx-button,
  .mx-button__content {
    transition: none;
  }

  .mx-button:hover:not(:disabled),
  .mx-button:active:not(:disabled) {
    transform: none;
  }

  .mx-button__disc {
    animation-duration: 2s;
  }
}
</style>
