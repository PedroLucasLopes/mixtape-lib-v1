<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import MxAvatar from './MxAvatar.vue';
import MxLink from './MxLink.vue';
import MxReactionBar, { type Reaction } from './MxReactionBar.vue';
import type { ReviewAuthor } from './MxReviewCard.vue';
import MxTimeAgo from './MxTimeAgo.vue';

withDefaults(
  defineProps<{
    author: ReviewAuthor;
    body: string;
    createdAt: string;
    likes: number;
    dislikes: number;
    reaction?: Reaction | null;
    canReact?: boolean;
    canDelete?: boolean;
    pending?: boolean;
    authorTo?: LinkTarget;
  }>(),
  { reaction: null, canReact: false, canDelete: false, pending: false },
);

const emit = defineEmits<{ react: [reaction: Reaction | null]; delete: [] }>();

const { t } = useMixtapeText();
</script>

<template>
  <li class="mx-comment">
    <MxAvatar :name="author.name" :src="author.avatarUrl" :seed="author.username" :tier="author.tier" :size="36" decorative />
    <div class="mx-comment__bubble">
      <div class="mx-comment__header">
        <component :is="author.to ? MxLink : 'span'" :to="author.to" class="mx-comment__author">
          {{ author.name }}
          <span class="mx-comment__username">@{{ author.username }}</span>
        </component>
        <MxTimeAgo class="mx-comment__date" :date="createdAt" />
      </div>
      <p class="mx-comment__body">{{ body }}</p>
      <div class="mx-comment__footer">
        <MxReactionBar
          :likes="likes"
          :dislikes="dislikes"
          :reaction="reaction"
          :interactive="canReact"
          :pending="pending"
          size="sm"
          @react="emit('react', $event)"
        />
        <button v-if="canDelete" type="button" class="mx-comment__delete" @click="emit('delete')">
          <VIcon icon="mdi-delete-outline" size="16" aria-hidden="true" />
          {{ t('comment.delete') }}
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.mx-comment {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) both;
}

.mx-comment__bubble {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 12px 14px;
  background: var(--mx-surface-variant);
  border-radius: 6px var(--mx-radius-md) var(--mx-radius-md) var(--mx-radius-md);
}

.mx-comment__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 10px;
}

.mx-comment__author {
  font-weight: 800;
  color: inherit;
  text-decoration: none;
}

a.mx-comment__author:hover {
  text-decoration: underline;
}

a.mx-comment__author:focus-visible,
.mx-comment__delete:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

.mx-comment__username,
.mx-comment__date {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--mx-on-surface-muted);
}

.mx-comment__body {
  margin: 0;
  line-height: 1.55;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.mx-comment__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mx-comment__delete {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--mx-error);
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: var(--mx-radius-pill);
}

.mx-comment__delete:hover {
  background: color-mix(in srgb, var(--mx-error) 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .mx-comment {
    animation: none;
  }
}
</style>
