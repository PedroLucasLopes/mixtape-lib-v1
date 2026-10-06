<script setup lang="ts">
import type { LinkTarget } from '../links/links';
import MxLink from './MxLink.vue';

withDefaults(
  defineProps<{
    icon: string;
    label: string;
    variant?: 'glass' | 'ghost' | 'cta' | 'tonal' | 'solid' | 'ink';
    size?: 'sm' | 'md' | 'lg';
    pressed?: boolean;
    disabled?: boolean;
    tooltip?: boolean;
    to?: LinkTarget;
    href?: string;
  }>(),
  { variant: 'glass', size: 'md', pressed: undefined, tooltip: true },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <VTooltip :text="label" :disabled="!tooltip" open-delay="400">
    <template #activator="{ props: activator }">
      <MxLink
        v-if="to !== undefined || href !== undefined"
        v-bind="activator"
        class="mx-icon-button"
        :class="[`mx-icon-button--${variant}`, `mx-icon-button--${size}`]"
        :to="to"
        :href="href"
        :aria-label="label"
      >
        <VIcon :icon="icon" aria-hidden="true" />
      </MxLink>
      <button
        v-else
        v-bind="activator"
        type="button"
        class="mx-icon-button"
        :class="[`mx-icon-button--${variant}`, `mx-icon-button--${size}`, { 'mx-icon-button--pressed': pressed }]"
        :aria-label="label"
        :aria-pressed="pressed"
        :disabled="disabled"
        @click="emit('click', $event)"
      >
        <VIcon :icon="icon" aria-hidden="true" />
      </button>
    </template>
  </VTooltip>
</template>

<style scoped>
.mx-icon-button {
  --mx-icon-button-size: 44px;
  --mx-icon-button-bg: var(--mx-glass);
  --mx-icon-button-fg: var(--mx-on-surface);

  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--mx-icon-button-size);
  height: var(--mx-icon-button-size);
  padding: 0;
  font-size: calc(var(--mx-icon-button-size) * 0.5);
  color: var(--mx-icon-button-fg);
  text-decoration: none;
  cursor: pointer;
  background: var(--mx-icon-button-bg);
  border: 1px solid transparent;
  border-radius: 50%;
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    color var(--mx-duration-fast) var(--mx-ease-out);
  -webkit-tap-highlight-color: transparent;
}

.mx-icon-button--sm { --mx-icon-button-size: 36px; }
.mx-icon-button--lg { --mx-icon-button-size: 56px; }

.mx-icon-button--glass {
  border-color: var(--mx-glass-border);
  box-shadow: inset 0 1px 0 var(--mx-glass-highlight);
}

.mx-icon-button--ghost { --mx-icon-button-bg: transparent; }

.mx-icon-button--cta {
  --mx-icon-button-bg: var(--mx-cta);
  --mx-icon-button-fg: var(--mx-on-cta);
  border: 2px solid var(--mx-cta-outline);
  box-shadow: var(--mx-cta-shadow);
}

.mx-icon-button--tonal {
  --mx-icon-button-bg: color-mix(in srgb, var(--mx-primary) 16%, transparent);
  --mx-icon-button-fg: var(--mx-link);
}

.mx-icon-button--solid {
  --mx-icon-button-bg: var(--mx-surface-variant);
}

.mx-icon-button--ink {
  --mx-icon-button-bg: transparent;
  --mx-icon-button-fg: var(--mx-hero-ink, var(--mx-on-surface));
  border: 2px solid var(--mx-hero-ink, var(--mx-on-surface));
}

.mx-icon-button--ink:hover:not(:disabled) {
  --mx-icon-button-bg: color-mix(in srgb, var(--mx-hero-ink, var(--mx-on-surface)) 14%, transparent);
}

.mx-icon-button--pressed {
  --mx-icon-button-bg: var(--mx-cta);
  --mx-icon-button-fg: var(--mx-on-cta);
}

.mx-icon-button:hover:not(:disabled) {
  transform: scale(1.08);
}

.mx-icon-button--ghost:hover:not(:disabled) {
  --mx-icon-button-bg: var(--mx-surface-variant);
}

.mx-icon-button:active:not(:disabled) {
  transform: scale(0.9);
  transition-duration: 90ms;
}

.mx-icon-button:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

@media (prefers-reduced-motion: reduce) {
  .mx-icon-button {
    transition: none;
  }

  .mx-icon-button:hover:not(:disabled),
  .mx-icon-button:active:not(:disabled) {
    transform: none;
  }
}
</style>
