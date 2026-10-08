<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatCompactNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { prefersReducedMotion } from '../motion/reducedMotion';

const props = withDefaults(
  defineProps<{
    count: number;
    liked?: boolean;
    interactive?: boolean;
    pending?: boolean;
    size?: 'sm' | 'md';
  }>(),
  { liked: false, interactive: true, pending: false, size: 'md' },
);

const emit = defineEmits<{ toggle: [liked: boolean] }>();

const { t, locale } = useMixtapeText();
const popping = ref(false);

const formatted = computed(() => formatCompactNumber(props.count, locale.value));
const label = computed(() =>
  props.interactive
    ? t('likes.button', { formatted: formatted.value })
    : t('likes.count', { count: props.count, formatted: formatted.value }),
);

const toggle = () => {
  if (!props.interactive || props.pending) return;
  const next = !props.liked;
  if (next && !prefersReducedMotion()) {
    popping.value = true;
    setTimeout(() => {
      popping.value = false;
    }, 600);
  }
  emit('toggle', next);
};
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    data-testid="mx-like-button"
    :type="interactive ? 'button' : undefined"
    class="mx-like"
    :class="[`mx-like--${size}`, { 'mx-like--active': liked, 'mx-like--pop': popping }]"
    :aria-pressed="interactive ? liked : undefined"
    :aria-label="label"
    :disabled="interactive && pending ? true : undefined"
    @click="toggle"
  >
    <VIcon class="mx-like__heart" :icon="liked ? 'mdi-heart' : 'mdi-heart-outline'" aria-hidden="true" />
    <span class="mx-like__count" aria-hidden="true">{{ formatted }}</span>
    <span v-if="popping" class="mx-like__burst" aria-hidden="true"><i v-for="n in 8" :key="n" :style="{ '--mx-burst-angle': `${n * 45}deg` }" /></span>
  </component>
</template>

<style scoped>
.mx-like {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  background: transparent;
  border: 2px solid var(--mx-outline);
  border-radius: var(--mx-radius-pill);
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    color var(--mx-duration-fast) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-like--sm {
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.8125rem;
}

span.mx-like {
  padding-inline: 4px;
  border-color: transparent;
}

button.mx-like {
  cursor: pointer;
}

button.mx-like:hover:not(:disabled) {
  color: var(--mx-on-surface);
  border-color: var(--mx-outline-strong);
  transform: translateY(-2px);
}

button.mx-like:active:not(:disabled) {
  transform: scale(0.92);
}

.mx-like:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-like--active,
button.mx-like--active:hover:not(:disabled) {
  color: var(--mx-on-secondary);
  background: var(--mx-secondary);
  border-color: var(--mx-secondary);
}

span.mx-like--active {
  color: var(--mx-secondary);
  background: transparent;
  border-color: transparent;
}

.mx-like:disabled {
  cursor: progress;
}

.mx-like--pop .mx-like__heart {
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop);
}

.mx-like__count {
  font-variant-numeric: tabular-nums;
}

.mx-like__burst {
  position: absolute;
  top: 50%;
  left: 22px;
  pointer-events: none;
}

.mx-like__burst i {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: var(--mx-secondary);
  border-radius: 50%;
  animation: mx-burst 560ms var(--mx-ease-out) forwards;
}

.mx-like__burst i:nth-child(even) {
  background: var(--mx-cta);
}

@media (prefers-reduced-motion: reduce) {
  .mx-like {
    transition: none;
  }

  .mx-like--pop .mx-like__heart,
  .mx-like__burst i {
    animation: none;
  }

  button.mx-like:hover:not(:disabled),
  button.mx-like:active:not(:disabled) {
    transform: none;
  }
}
</style>
