<script setup lang="ts">
import { ref } from 'vue';
import { formatCompactNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { prefersReducedMotion } from '../motion/reducedMotion';
import MxLink from './MxLink.vue';

export type Reaction = 'LIKE' | 'DISLIKE';

const props = withDefaults(
  defineProps<{
    likes: number;
    dislikes: number;
    reaction?: Reaction | null;
    interactive?: boolean;
    pending?: boolean;
    comments?: number | null;
    commentsTo?: LinkTarget;
    size?: 'sm' | 'md';
  }>(),
  { reaction: null, interactive: true, pending: false, comments: null, size: 'md' },
);

const emit = defineEmits<{ react: [reaction: Reaction | null] }>();

const { t, locale } = useMixtapeText();
const popping = ref<Reaction | null>(null);

const toggle = (reaction: Reaction) => {
  if (!props.interactive || props.pending) return;
  const next = props.reaction === reaction ? null : reaction;
  if (next && !prefersReducedMotion()) {
    popping.value = next;
    setTimeout(() => {
      popping.value = null;
    }, 600);
  }
  emit('react', next);
};
</script>

<template>
  <div class="mx-reactions" :class="`mx-reactions--${size}`">
    <component
      :is="interactive ? 'button' : 'span'"
      :type="interactive ? 'button' : undefined"
      class="mx-reactions__item mx-reactions__item--like"
      :class="{ 'mx-reactions__item--active': reaction === 'LIKE', 'mx-reactions__item--pop': popping === 'LIKE' }"
      :aria-pressed="interactive ? reaction === 'LIKE' : undefined"
      :aria-label="t('reactions.likeCount', { count: likes, formatted: formatCompactNumber(likes, locale) })"
      :disabled="interactive && pending ? true : undefined"
      @click="toggle('LIKE')"
    >
      <VIcon :icon="reaction === 'LIKE' ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'" aria-hidden="true" />
      <span class="mx-reactions__count" aria-hidden="true">{{ formatCompactNumber(likes, locale) }}</span>
      <span v-if="popping === 'LIKE'" class="mx-reactions__burst" aria-hidden="true"><i v-for="n in 8" :key="n" :style="{ '--mx-burst-angle': `${n * 45}deg` }" /></span>
    </component>
    <component
      :is="interactive ? 'button' : 'span'"
      :type="interactive ? 'button' : undefined"
      class="mx-reactions__item mx-reactions__item--dislike"
      :class="{ 'mx-reactions__item--active': reaction === 'DISLIKE', 'mx-reactions__item--pop': popping === 'DISLIKE' }"
      :aria-pressed="interactive ? reaction === 'DISLIKE' : undefined"
      :aria-label="t('reactions.dislikeCount', { count: dislikes, formatted: formatCompactNumber(dislikes, locale) })"
      :disabled="interactive && pending ? true : undefined"
      @click="toggle('DISLIKE')"
    >
      <VIcon :icon="reaction === 'DISLIKE' ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'" aria-hidden="true" />
      <span class="mx-reactions__count" aria-hidden="true">{{ formatCompactNumber(dislikes, locale) }}</span>
    </component>
    <component
      :is="commentsTo !== undefined ? MxLink : 'span'"
      v-if="comments !== null"
      :to="commentsTo"
      class="mx-reactions__item mx-reactions__item--comments"
      :aria-label="t('reactions.comments', { count: comments, formatted: formatCompactNumber(comments, locale) })"
    >
      <VIcon icon="mdi-comment-outline" aria-hidden="true" />
      <span class="mx-reactions__count" aria-hidden="true">{{ formatCompactNumber(comments, locale) }}</span>
    </component>
  </div>
</template>

<style scoped>
.mx-reactions {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.mx-reactions__item {
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
  text-decoration: none;
  background: transparent;
  border: 2px solid var(--mx-outline);
  border-radius: var(--mx-radius-pill);
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    color var(--mx-duration-fast) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-reactions--sm .mx-reactions__item {
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.8125rem;
}

span.mx-reactions__item {
  border-color: transparent;
  padding-inline: 4px;
}

button.mx-reactions__item,
a.mx-reactions__item {
  cursor: pointer;
}

button.mx-reactions__item:hover:not(:disabled),
a.mx-reactions__item:hover {
  color: var(--mx-on-surface);
  border-color: var(--mx-outline-strong);
  transform: translateY(-2px);
}

button.mx-reactions__item:active:not(:disabled) {
  transform: scale(0.92);
}

.mx-reactions__item:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-reactions__item--like.mx-reactions__item--active {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-color: var(--mx-cta-outline);
}

.mx-reactions__item--dislike.mx-reactions__item--active {
  color: var(--mx-on-secondary);
  background: var(--mx-secondary);
  border-color: var(--mx-secondary);
}

.mx-reactions__item:disabled {
  cursor: progress;
}

.mx-reactions__item--pop {
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop);
}

.mx-reactions__count {
  font-variant-numeric: tabular-nums;
}

.mx-reactions__burst {
  position: absolute;
  top: 50%;
  left: 22px;
  pointer-events: none;
}

.mx-reactions__burst i {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: var(--mx-cta);
  border-radius: 50%;
  animation: mx-burst 560ms var(--mx-ease-out) forwards;
}

.mx-reactions__burst i:nth-child(even) {
  background: var(--mx-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .mx-reactions__item {
    transition: none;
  }

  .mx-reactions__item--pop,
  .mx-reactions__burst i {
    animation: none;
  }

  button.mx-reactions__item:hover:not(:disabled),
  button.mx-reactions__item:active:not(:disabled) {
    transform: none;
  }
}
</style>
