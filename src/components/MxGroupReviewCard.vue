<script setup lang="ts">
import { computed, useId } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import MxAvatar from './MxAvatar.vue';
import MxCover from './MxCover.vue';
import MxLikeButton from './MxLikeButton.vue';
import MxLink from './MxLink.vue';
import MxRating from './MxRating.vue';
import type { ReviewAuthor, ReviewGroupTag, ReviewSubject } from './MxReviewCard.vue';
import MxTimeAgo from './MxTimeAgo.vue';

export interface GroupReviewEntry {
  id: string;
  author: ReviewAuthor;
  rating: number;
  body?: string | null;
  createdAt: string;
  likes: number;
  liked?: boolean;
  canLike?: boolean;
  pending?: boolean;
  to?: LinkTarget;
}

const props = withDefaults(
  defineProps<{
    group: ReviewGroupTag;
    item: ReviewSubject;
    rating: number | null;
    entries: GroupReviewEntry[];
    members?: number | null;
    proposer?: string | null;
    visibility?: 'public' | 'group';
    to?: LinkTarget;
    variant?: 'card' | 'full';
    highlightId?: string | null;
  }>(),
  { members: null, proposer: null, visibility: 'public', variant: 'card', highlightId: null },
);

const emit = defineEmits<{ like: [entryId: string, liked: boolean] }>();

const { t } = useMixtapeText();
const headingId = useId();

const full = computed(() => props.variant === 'full');
const summary = computed(() =>
  [
    props.members && props.entries.length ? t('groupReview.progress', { count: props.entries.length, members: props.members }) : null,
    props.proposer ? t('groupReview.proposedBy', { username: props.proposer }) : null,
  ]
    .filter(Boolean)
    .join(' · '),
);
</script>

<template>
  <article data-testid="mx-group-review-card" class="mx-galera" :class="`mx-galera--${variant}`" :aria-labelledby="headingId">
    <h3 :id="headingId" class="mx-sr-only">{{ t('groupReview.heading', { group: group.name, title: item.title }) }}</h3>

    <header class="mx-galera__header">
      <span class="mx-galera__flag">
        <VIcon icon="mdi-account-group" size="18" aria-hidden="true" />
        {{ t('groupReview.flag') }}
      </span>
      <component :is="group.to ? MxLink : 'span'" :to="group.to" data-testid="mx-group-review-card-group" class="mx-galera__group">{{ group.name }}</component>
      <span v-if="visibility === 'group'" class="mx-galera__lock">
        <VIcon icon="mdi-lock-outline" size="14" aria-hidden="true" />
        {{ t('review.visibility.group') }}
      </span>
    </header>

    <div class="mx-galera__subject">
      <component :is="item.to ? MxLink : 'div'" :to="item.to" data-testid="mx-group-review-card-item" class="mx-galera__item">
        <MxCover
          :src="item.cover"
          :title="item.title"
          :seed="item.id"
          :shape="item.kind === 'artist' ? 'circle' : 'square'"
          :size="full ? '112px' : '72px'"
          radius="sm"
          :sizes="full ? '112px' : '72px'"
        />
        <span class="mx-galera__item-text">
          <span class="mx-galera__title">{{ item.title }}</span>
          <span v-if="item.artist || item.year" class="mx-galera__meta">{{ [item.artist, item.year].filter(Boolean).join(' · ') }}</span>
        </span>
      </component>

      <div class="mx-galera__average">
        <MxRating :value="rating" :size="full ? 'lg' : 'md'" show-value />
        <span class="mx-galera__average-label">{{ t('groupReview.average') }}</span>
      </div>
    </div>

    <p v-if="summary" class="mx-galera__summary">{{ summary }}</p>

    <ol v-if="entries.length" class="mx-galera__entries">
      <li
        v-for="(entry, index) in entries"
        :key="entry.id"
        data-testid="mx-group-review-card-entry"
        class="mx-galera__entry"
        :class="{ 'mx-galera__entry--highlight': entry.id === highlightId }"
        :style="{ '--mx-entry-index': index }"
      >
        <MxAvatar :name="entry.author.name" :src="entry.author.avatarUrl" :seed="entry.author.username" :tier="entry.author.tier" :size="36" decorative />
        <div class="mx-galera__bubble">
          <div class="mx-galera__entry-header">
            <component :is="entry.author.to ? MxLink : 'span'" data-testid="mx-group-review-card-author" :to="entry.author.to" class="mx-galera__author">
              {{ entry.author.name }}
              <span class="mx-galera__username">@{{ entry.author.username }}</span>
            </component>
            <MxRating :value="entry.rating" size="sm" show-value />
          </div>
          <p v-if="entry.body" class="mx-galera__body" :class="{ 'mx-galera__body--clamped': !full }">{{ entry.body }}</p>
          <div class="mx-galera__entry-footer">
            <MxLikeButton
              data-testid="mx-group-review-card-like"
              :count="entry.likes"
              :liked="entry.liked"
              :interactive="entry.canLike"
              :pending="entry.pending"
              size="sm"
              @toggle="emit('like', entry.id, $event)"
            />
            <span class="mx-galera__entry-meta">
              <MxTimeAgo :date="entry.createdAt" />
              <MxLink v-if="entry.to" :to="entry.to" data-testid="mx-group-review-card-entry-link" class="mx-galera__entry-link">{{ t('review.open') }}</MxLink>
            </span>
          </div>
        </div>
      </li>
    </ol>

    <p v-else data-testid="mx-group-review-card-empty" class="mx-galera__empty">
      <slot name="empty">{{ t('groupReview.empty') }}</slot>
    </p>

    <footer v-if="(to && !full) || $slots.actions" class="mx-galera__footer">
      <span class="mx-galera__actions"><slot name="actions" /></span>
      <MxLink v-if="to && !full" :to="to" data-testid="mx-group-review-card-open" class="mx-galera__open">
        {{ t('groupReview.open') }}
        <VIcon icon="mdi-arrow-right" size="16" aria-hidden="true" />
      </MxLink>
    </footer>
  </article>
</template>

<style scoped>
.mx-galera {
  display: grid;
  gap: 14px;
  min-width: 0;
  padding: clamp(16px, 2.6vw, 22px);
  color: var(--mx-on-surface);
  background: var(--mx-surface);
  border: 1px solid var(--mx-outline);
  border-radius: var(--mx-radius-lg);
  transition:
    border-color var(--mx-duration-fast) var(--mx-ease-out),
    box-shadow var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-galera:hover {
  border-color: var(--mx-outline-strong);
  box-shadow: 0 20px 50px -30px var(--mx-shadow);
}

.mx-galera--full {
  gap: 18px;
  padding: clamp(20px, 4vw, 36px);
  border-radius: var(--mx-radius-xl);
}

.mx-galera__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.mx-galera__flag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-radius: var(--mx-radius-pill);
}

.mx-galera__group {
  font-family: var(--mx-font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: var(--mx-tracking-title);
  color: inherit;
  text-decoration: none;
}

a.mx-galera__group:hover {
  text-decoration: underline;
}

.mx-galera__lock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 26px;
  padding: 0 10px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
}

.mx-galera__subject {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
}

.mx-galera__item {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

a.mx-galera__item:hover .mx-galera__title {
  text-decoration: underline;
}

.mx-galera__item-text {
  display: grid;
  min-width: 0;
}

.mx-galera__title {
  overflow: hidden;
  font-family: var(--mx-font-display);
  font-size: 1.1875rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: var(--mx-tracking-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-galera--full .mx-galera__title {
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  white-space: normal;
}

.mx-galera__meta,
.mx-galera__summary,
.mx-galera__average-label {
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-galera__average {
  display: grid;
  justify-items: end;
  gap: 2px;
}

.mx-galera__summary {
  margin: -4px 0 0;
  font-weight: 700;
}

.mx-galera__entries {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-galera__entry {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) calc(var(--mx-entry-index, 0) * 60ms) both;
}

.mx-galera__bubble {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 12px 14px;
  background: var(--mx-surface-variant);
  border: 2px solid transparent;
  border-radius: 6px var(--mx-radius-md) var(--mx-radius-md) var(--mx-radius-md);
}

.mx-galera__entry--highlight .mx-galera__bubble {
  border-color: var(--mx-primary);
}

.mx-galera__entry-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 10px;
}

.mx-galera__author {
  min-width: 0;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
}

a.mx-galera__author:hover {
  text-decoration: underline;
}

.mx-galera__username {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--mx-on-surface-muted);
}

.mx-galera__body {
  margin: 0;
  line-height: 1.55;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.mx-galera__body--clamped {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.mx-galera__entry-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mx-galera__entry-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-galera__entry-link,
.mx-galera__open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 800;
  color: var(--mx-link);
  text-decoration: none;
}

.mx-galera__entry-link:hover,
.mx-galera__open:hover {
  text-decoration: underline;
}

.mx-galera__empty {
  margin: 0;
  padding: 14px;
  font-weight: 700;
  color: var(--mx-on-surface-muted);
  text-align: center;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-md);
}

.mx-galera__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mx-galera__actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

a.mx-galera__group:focus-visible,
a.mx-galera__item:focus-visible,
a.mx-galera__author:focus-visible,
.mx-galera__entry-link:focus-visible,
.mx-galera__open:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
  border-radius: var(--mx-radius-sm);
}

@media (prefers-reduced-motion: reduce) {
  .mx-galera {
    transition: none;
  }

  .mx-galera__entry {
    animation: none;
  }
}
</style>
