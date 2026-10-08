<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { formatRatingValue } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import MxAvatar from './MxAvatar.vue';
import MxCover from './MxCover.vue';
import MxLink from './MxLink.vue';
import MxLikeButton from './MxLikeButton.vue';
import MxRating from './MxRating.vue';
import MxTimeAgo from './MxTimeAgo.vue';

export interface ReviewAuthor {
  name: string;
  username: string;
  avatarUrl?: string | null;
  tier?: string | null;
  tierLabel?: string | null;
  to?: LinkTarget;
}

export interface ReviewGroupTag {
  name: string;
  to?: LinkTarget;
}

export type ReviewVisibility = 'public' | 'group' | 'private';

export interface ReviewSubject {
  id: string;
  kind: 'album' | 'track' | 'artist';
  title: string;
  artist?: string | null;
  cover?: string | null;
  year?: string | null;
  to?: LinkTarget;
}

const props = withDefaults(
  defineProps<{
    rating: number;
    body?: string | null;
    createdAt: string;
    edited?: boolean;
    likes: number;
    liked?: boolean;
    canLike?: boolean;
    likePending?: boolean;
    author: ReviewAuthor;
    item: ReviewSubject;
    group?: ReviewGroupTag | null;
    visibility?: ReviewVisibility;
    to?: LinkTarget;
    variant?: 'feed' | 'item' | 'full' | 'compact';
    highlight?: boolean;
  }>(),
  {
    body: null,
    edited: false,
    liked: false,
    canLike: false,
    likePending: false,
    group: null,
    visibility: 'public',
    variant: 'feed',
    highlight: false,
  },
);

const emit = defineEmits<{ like: [liked: boolean] }>();

const { t, locale } = useMixtapeText();
const headingId = useId();
const expanded = ref(false);

const clampable = computed(() => props.variant !== 'full' && (props.body?.length ?? 0) > 360);
const showItem = computed(() => props.variant !== 'item');
const ratingText = computed(() => formatRatingValue(props.rating, locale.value));
</script>

<template>
  <article
    class="mx-review"
    :class="[`mx-review--${variant}`, { 'mx-review--highlight': highlight }]"
    :aria-labelledby="headingId"
  >
    <h3 :id="headingId" class="mx-sr-only">
      {{ t('review.heading', { author: author.username, title: item.title, rating: ratingText }) }}
    </h3>

    <header class="mx-review__header">
      <component :is="author.to ? MxLink : 'span'" :to="author.to" class="mx-review__author">
        <MxAvatar :name="author.name" :src="author.avatarUrl" :seed="author.username" :tier="author.tier" :size="variant === 'compact' ? 32 : 40" decorative />
        <span class="mx-review__identity">
          <span class="mx-review__name">{{ author.name }}</span>
          <span class="mx-review__username">@{{ author.username }}<template v-if="author.tierLabel"> · {{ author.tierLabel }}</template></span>
        </span>
      </component>
      <span class="mx-review__date">
        <MxTimeAgo :date="createdAt" />
        <template v-if="edited"> · {{ t('review.edited') }}</template>
      </span>
    </header>

    <div v-if="group || visibility !== 'public'" class="mx-review__tags">
      <component :is="group?.to ? MxLink : 'span'" v-if="group" :to="group?.to" class="mx-review__tag mx-review__tag--group">
        <VIcon icon="mdi-account-group" size="16" aria-hidden="true" />
        {{ t('groupReview.tag', { group: group.name }) }}
      </component>
      <span v-if="visibility !== 'public'" class="mx-review__tag">
        <VIcon icon="mdi-lock-outline" size="14" aria-hidden="true" />
        {{ visibility === 'group' ? t('review.visibility.group') : t('review.visibility.private') }}
      </span>
    </div>

    <div class="mx-review__subject">
      <component :is="item.to && showItem ? MxLink : 'div'" v-if="showItem" :to="item.to" class="mx-review__item">
        <MxCover
          :src="item.cover"
          :title="item.title"
          :seed="item.id"
          :shape="item.kind === 'artist' ? 'circle' : 'square'"
          size="56px"
          radius="sm"
          sizes="56px"
        />
        <span class="mx-review__item-text">
          <span class="mx-review__item-title">{{ item.title }}</span>
          <span v-if="item.artist || item.year" class="mx-review__item-meta">
            {{ [item.artist, item.year].filter(Boolean).join(' · ') }}
          </span>
        </span>
      </component>
      <MxRating :value="rating" :size="variant === 'full' ? 'lg' : 'md'" show-value class="mx-review__rating" />
    </div>

    <div v-if="body" class="mx-review__body-wrap">
      <p class="mx-review__body" :class="{ 'mx-review__body--clamped': clampable && !expanded }">{{ body }}</p>
      <button v-if="clampable" type="button" class="mx-review__more" :aria-expanded="expanded" @click="expanded = !expanded">
        {{ expanded ? t('common.showLess') : t('common.showMore') }}
      </button>
    </div>

    <footer class="mx-review__footer">
      <MxLikeButton
        :count="likes"
        :liked="liked"
        :interactive="canLike"
        :pending="likePending"
        size="sm"
        @toggle="emit('like', $event)"
      />
      <span class="mx-review__actions">
        <MxLink v-if="to && variant !== 'full'" :to="to" class="mx-review__open">
          {{ t('review.open') }}
          <VIcon icon="mdi-arrow-right" size="16" aria-hidden="true" />
        </MxLink>
        <slot name="actions" />
      </span>
    </footer>
  </article>
</template>

<style scoped>
.mx-review {
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
    transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth),
    box-shadow var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-review:hover {
  border-color: var(--mx-outline-strong);
  box-shadow: 0 20px 50px -30px var(--mx-shadow);
}

.mx-review--highlight {
  border-color: var(--mx-primary);
  box-shadow: 0 0 0 2px var(--mx-primary);
}

.mx-review--compact {
  gap: 10px;
  padding: 14px;
}

.mx-review--full {
  padding: clamp(20px, 4vw, 36px);
  border-radius: var(--mx-radius-xl);
}

.mx-review__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mx-review__author {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

a.mx-review__author:hover .mx-review__name {
  text-decoration: underline;
}

a.mx-review__author:focus-visible,
a.mx-review__item:focus-visible,
a.mx-review__tag:focus-visible,
.mx-review__open:focus-visible,
.mx-review__more:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
  border-radius: var(--mx-radius-sm);
}

.mx-review__identity {
  display: grid;
  min-width: 0;
}

.mx-review__name {
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-review__username,
.mx-review__date {
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-review__date {
  flex-shrink: 0;
}

.mx-review__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mx-review__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 26px;
  padding: 0 10px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  text-decoration: none;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
}

.mx-review__tag--group {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
}

a.mx-review__tag--group:hover {
  text-decoration: underline;
}

.mx-review__subject {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mx-review__item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

a.mx-review__item:hover .mx-review__item-title {
  text-decoration: underline;
}

.mx-review__item-text {
  display: grid;
  min-width: 0;
}

.mx-review__item-title {
  overflow: hidden;
  font-family: var(--mx-font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-review__item-meta {
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-review__body {
  margin: 0;
  font-size: 1rem;
  line-height: var(--mx-line-relaxed, 1.65);
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.mx-review--full .mx-review__body {
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
}

.mx-review__body--clamped {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}

.mx-review__more {
  margin-top: 6px;
  padding: 0;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--mx-link);
  cursor: pointer;
  background: none;
  border: 0;
}

.mx-review__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mx-review__actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mx-review__open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--mx-link);
  text-decoration: none;
}

.mx-review__open:hover {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .mx-review {
    transition: none;
  }
}
</style>
