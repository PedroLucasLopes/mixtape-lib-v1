<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { type Toast, useToasts } from './useToast';

const { toasts, dismiss } = useToasts();
const { t } = useMixtapeText();

const ICONS: Record<Toast['kind'], string> = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  info: 'mdi-information',
  warning: 'mdi-alert',
};

const timers = new Map<number, { remaining: number; started: number; handle: ReturnType<typeof setTimeout> | undefined }>();

const schedule = (toast: Toast, remaining: number) => {
  const handle = setTimeout(() => {
    timers.delete(toast.id);
    dismiss(toast.id);
  }, remaining);
  timers.set(toast.id, { remaining, started: Date.now(), handle });
};

watch(
  toasts,
  (list) => {
    for (const toast of list) {
      if (toast.duration !== null && !timers.has(toast.id)) schedule(toast as Toast, toast.duration);
    }
    for (const id of [...timers.keys()]) {
      if (!list.some((toast) => toast.id === id)) {
        clearTimeout(timers.get(id)?.handle);
        timers.delete(id);
      }
    }
  },
  { immediate: true, deep: true },
);

const pause = (toast: Toast) => {
  const timer = timers.get(toast.id);
  if (!timer?.handle) return;
  clearTimeout(timer.handle);
  timers.set(toast.id, { remaining: Math.max(800, timer.remaining - (Date.now() - timer.started)), started: Date.now(), handle: undefined });
};

const resume = (toast: Toast) => {
  const timer = timers.get(toast.id);
  if (!timer || timer.handle) return;
  schedule(toast, timer.remaining);
};

const runAction = (toast: Toast) => {
  toast.action?.handler();
  dismiss(toast.id);
};

const errors = computed(() => toasts.value.filter((toast) => toast.kind === 'error'));
const others = computed(() => toasts.value.filter((toast) => toast.kind !== 'error'));

onBeforeUnmount(() => {
  for (const timer of timers.values()) clearTimeout(timer.handle);
});
</script>

<template>
  <div class="mx-toast-host">
    <div role="alert" aria-live="assertive" class="mx-toast-host__region">
      <TransitionGroup name="mx-toast">
        <div
          v-for="toast in errors"
          :key="toast.id"
          class="mx-toast mx-toast--error"
          @mouseenter="pause(toast as Toast)"
          @mouseleave="resume(toast as Toast)"
          @focusin="pause(toast as Toast)"
          @focusout="resume(toast as Toast)"
        >
          <VIcon :icon="toast.icon ?? ICONS[toast.kind]" class="mx-toast__icon" aria-hidden="true" />
          <span class="mx-toast__message">{{ toast.message }}</span>
          <button v-if="toast.action" type="button" class="mx-toast__action" @click="runAction(toast as Toast)">{{ toast.action.label }}</button>
          <button type="button" class="mx-toast__close" :aria-label="t('toast.dismiss')" @click="dismiss(toast.id)">
            <VIcon icon="mdi-close" size="18" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
    <div role="status" aria-live="polite" class="mx-toast-host__region">
      <TransitionGroup name="mx-toast">
        <div
          v-for="toast in others"
          :key="toast.id"
          class="mx-toast"
          :class="`mx-toast--${toast.kind}`"
          @mouseenter="pause(toast as Toast)"
          @mouseleave="resume(toast as Toast)"
          @focusin="pause(toast as Toast)"
          @focusout="resume(toast as Toast)"
        >
          <VIcon :icon="toast.icon ?? ICONS[toast.kind]" class="mx-toast__icon" aria-hidden="true" />
          <span class="mx-toast__message">{{ toast.message }}</span>
          <button v-if="toast.action" type="button" class="mx-toast__action" @click="runAction(toast as Toast)">{{ toast.action.label }}</button>
          <button type="button" class="mx-toast__close" :aria-label="t('toast.dismiss')" @click="dismiss(toast.id)">
            <VIcon icon="mdi-close" size="18" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.mx-toast-host {
  position: fixed;
  right: 0;
  bottom: calc(var(--mx-tab-bar-height) + 24px + env(safe-area-inset-bottom));
  left: 0;
  z-index: var(--mx-z-toast);
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 0 12px;
  pointer-events: none;
}

@media (min-width: 840px) {
  .mx-toast-host {
    bottom: 24px;
  }
}

.mx-toast-host__region {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: 100%;
}

.mx-toast {
  --mx-toast-accent: var(--mx-info);
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(100%, 520px);
  min-height: 52px;
  padding: 8px 8px 8px 16px;
  color: var(--mx-on-surface);
  pointer-events: auto;
  background: var(--mx-glass-strong);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-pill);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 24px 50px -20px var(--mx-shadow);
  backdrop-filter: blur(var(--mx-blur-glass)) saturate(180%);
}

.mx-toast--success { --mx-toast-accent: var(--mx-success); }
.mx-toast--warning { --mx-toast-accent: var(--mx-warning); }
.mx-toast--error {
  --mx-toast-accent: var(--mx-error);
  border-color: color-mix(in srgb, var(--mx-error) 55%, transparent);
  border-radius: var(--mx-radius-lg);
}

.mx-toast__icon {
  flex-shrink: 0;
  color: var(--mx-toast-accent);
}

.mx-toast__message {
  flex: 1;
  min-width: 0;
  font-weight: 700;
  line-height: 1.4;
}

.mx-toast__action,
.mx-toast__close {
  flex-shrink: 0;
  min-height: 36px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  border: 0;
  border-radius: var(--mx-radius-pill);
}

.mx-toast__action {
  padding: 0 14px;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
}

.mx-toast__close {
  display: grid;
  place-items: center;
  width: 36px;
  padding: 0;
  color: var(--mx-on-surface-muted);
  background: transparent;
}

.mx-toast__action:focus-visible,
.mx-toast__close:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-toast-enter-active {
  transition:
    opacity var(--mx-duration-normal) var(--mx-ease-out),
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-toast-leave-active {
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-in),
    transform var(--mx-duration-fast) var(--mx-ease-in);
}

.mx-toast-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.92);
}

.mx-toast-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

@media (prefers-reduced-motion: reduce) {
  .mx-toast-enter-active,
  .mx-toast-leave-active {
    transition: opacity 1ms linear;
  }

  .mx-toast-enter-from,
  .mx-toast-leave-to {
    transform: none;
  }
}
</style>
