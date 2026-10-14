<script setup lang="ts">
import type { LinkTarget } from '../links/links';
import MxAvatar from './MxAvatar.vue';
import MxLink from './MxLink.vue';

withDefaults(
  defineProps<{
    name: string;
    username: string;
    avatarUrl?: string | null;
    tier?: string | null;
    tierLabel?: string | null;
    to?: LinkTarget;
  }>(),
  { avatarUrl: null, tier: null, tierLabel: null },
);
</script>

<template>
  <component :is="to ? MxLink : 'div'" :to="to" data-testid="mx-person-card" class="mx-person-card">
    <MxAvatar :name="name" :src="avatarUrl" :seed="username" :tier="tier" :size="56" decorative />
    <span class="mx-person-card__identity">
      <span class="mx-person-card__name">{{ name }}</span>
      <span class="mx-person-card__detail">@{{ username }}</span>
      <span v-if="tierLabel" class="mx-person-card__detail mx-person-card__tier">
        <VIcon icon="mdi-album" size="14" aria-hidden="true" />
        {{ tierLabel }}
      </span>
    </span>
    <VIcon v-if="to" class="mx-person-card__go" icon="mdi-chevron-right" aria-hidden="true" />
  </component>
</template>

<style scoped>
.mx-person-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  color: inherit;
  text-decoration: none;
  background: var(--mx-surface);
  border-radius: var(--mx-radius-lg);
  transition:
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

a.mx-person-card:hover {
  background: var(--mx-surface-variant);
  transform: translateY(-2px);
}

a.mx-person-card:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-person-card__identity {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.mx-person-card__name {
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-person-card__detail {
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-person-card__tier {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.mx-person-card__go {
  color: var(--mx-on-surface-muted);
}

@media (prefers-reduced-motion: reduce) {
  .mx-person-card,
  a.mx-person-card:hover {
    transition: none;
    transform: none;
  }
}
</style>
