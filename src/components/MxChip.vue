<script setup lang="ts">
import { computed } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { duotones, type DuotoneName } from '../theme/tokens';
import MxLink from './MxLink.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    variant?: 'outline' | 'filled' | 'glass' | 'duotone';
    duotone?: DuotoneName;
    size?: 'sm' | 'md' | 'lg';
    selectable?: boolean;
    selected?: boolean;
    removable?: boolean;
    to?: LinkTarget;
    href?: string;
  }>(),
  { variant: 'outline', duotone: 'lime', size: 'md', selectable: false, selected: false, removable: false },
);

const emit = defineEmits<{ click: [event: MouseEvent]; remove: [] }>();

const { t } = useMixtapeText();

const style = computed(() =>
  props.variant === 'duotone'
    ? { '--mx-chip-bg': duotones[props.duotone].background, '--mx-chip-fg': duotones[props.duotone].ink, '--mx-chip-border': duotones[props.duotone].ink }
    : undefined,
);

const classes = computed(() => [
  'mx-chip',
  `mx-chip--${props.variant}`,
  `mx-chip--${props.size}`,
  { 'mx-chip--selected': props.selectable && props.selected, 'mx-chip--interactive': props.selectable || props.to !== undefined || props.href !== undefined },
]);
</script>

<template>
  <MxLink v-if="to !== undefined || href !== undefined" data-testid="mx-chip" :class="classes" :style="style" :to="to" :href="href">
    <VIcon v-if="icon" :icon="icon" class="mx-chip__icon" aria-hidden="true" />
    <span class="mx-chip__label">{{ label }}</span>
  </MxLink>
  <button
    v-else-if="selectable"
    data-testid="mx-chip"
    type="button"
    :class="classes"
    :style="style"
    :aria-pressed="selected"
    @click="emit('click', $event)"
  >
    <VIcon v-if="selected" icon="mdi-check-bold" class="mx-chip__icon mx-chip__check" aria-hidden="true" />
    <VIcon v-else-if="icon" :icon="icon" class="mx-chip__icon" aria-hidden="true" />
    <span class="mx-chip__label">{{ label }}</span>
  </button>
  <span v-else data-testid="mx-chip" :class="classes" :style="style">
    <VIcon v-if="icon" :icon="icon" class="mx-chip__icon" aria-hidden="true" />
    <span class="mx-chip__label">{{ label }}</span>
    <button v-if="removable" type="button" data-testid="mx-chip-remove" class="mx-chip__remove" :aria-label="t('common.removeItem', { item: label })" @click="emit('remove')">
      <VIcon icon="mdi-close" aria-hidden="true" />
    </button>
  </span>
</template>

<style scoped>
.mx-chip {
  --mx-chip-bg: transparent;
  --mx-chip-fg: var(--mx-on-surface);
  --mx-chip-border: var(--mx-outline-strong);
  --mx-chip-height: 36px;
  --mx-chip-font: 0.875rem;

  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-height: var(--mx-chip-height);
  padding: 0 14px;
  font-family: var(--mx-font-body);
  font-size: var(--mx-chip-font);
  font-weight: 750;
  line-height: 1;
  color: var(--mx-chip-fg);
  text-decoration: none;
  white-space: nowrap;
  background: var(--mx-chip-bg);
  border: 2px solid var(--mx-chip-border);
  border-radius: var(--mx-radius-pill);
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    color var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-chip--sm {
  --mx-chip-height: 28px;
  --mx-chip-font: 0.78rem;
  padding: 0 10px;
}

.mx-chip--lg {
  --mx-chip-height: 46px;
  --mx-chip-font: 1rem;
  padding: 0 20px;
}

.mx-chip--filled {
  --mx-chip-bg: var(--mx-surface-variant);
  --mx-chip-border: transparent;
}

.mx-chip--glass {
  --mx-chip-bg: var(--mx-glass);
  --mx-chip-border: var(--mx-glass-border);
}

.mx-chip--interactive {
  cursor: pointer;
}

.mx-chip--interactive:hover {
  transform: translateY(-2px) rotate(-1.5deg);
  --mx-chip-border: var(--mx-on-surface);
}

.mx-chip--duotone.mx-chip--interactive:hover {
  --mx-chip-border: var(--mx-chip-fg);
}

.mx-chip--interactive:active {
  transform: scale(0.95);
}

.mx-chip--selected {
  --mx-chip-bg: var(--mx-cta);
  --mx-chip-fg: var(--mx-on-cta);
  --mx-chip-border: var(--mx-cta-outline);
}

.mx-chip:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-chip__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.mx-chip__icon {
  font-size: 1.15em;
}

.mx-chip__check {
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop);
}

.mx-chip__remove {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-inline-end: -6px;
  padding: 0;
  color: inherit;
  cursor: pointer;
  background: color-mix(in srgb, currentColor 14%, transparent);
  border: 0;
  border-radius: 50%;
}

.mx-chip__remove:focus-visible {
  outline: 2px solid var(--mx-focus);
}

@media (prefers-reduced-motion: reduce) {
  .mx-chip,
  .mx-chip__check {
    transition: none;
    animation: none;
  }

  .mx-chip--interactive:hover,
  .mx-chip--interactive:active {
    transform: none;
  }
}
</style>
