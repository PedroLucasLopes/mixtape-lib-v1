<script setup lang="ts">
import { computed } from 'vue';
import type { LinkTarget } from '../links/links';
import { useScrollState } from '../motion/useScrollState';
import MxLink from './MxLink.vue';

export interface TabBarItem {
  key: string;
  label: string;
  icon: string;
  activeIcon?: string;
  to: LinkTarget;
}

const props = defineProps<{ items: readonly TabBarItem[]; active?: string | null; label: string }>();

const { scrolled, direction } = useScrollState(80);
const compact = computed(() => scrolled.value && direction.value === 'down');

const half = computed(() => Math.ceil(props.items.length / 2));
</script>

<template>
  <nav data-testid="mx-tab-bar" class="mx-tab-bar" :class="{ 'mx-tab-bar--compact': compact }" :aria-label="label">
    <ul class="mx-tab-bar__list">
      <li v-for="item in items.slice(0, half)" :key="item.key">
        <MxLink :to="item.to" :data-testid="`mx-tab-bar-item-${item.key}`" class="mx-tab-bar__item" :class="{ 'mx-tab-bar__item--active': item.key === active }" :aria-current="item.key === active ? 'page' : undefined">
          <VIcon :icon="item.key === active ? (item.activeIcon ?? item.icon) : item.icon" aria-hidden="true" />
          <span class="mx-tab-bar__label">{{ item.label }}</span>
        </MxLink>
      </li>
      <li v-if="$slots.action" class="mx-tab-bar__action">
        <slot name="action" />
      </li>
      <li v-for="item in items.slice(half)" :key="item.key">
        <MxLink :to="item.to" :data-testid="`mx-tab-bar-item-${item.key}`" class="mx-tab-bar__item" :class="{ 'mx-tab-bar__item--active': item.key === active }" :aria-current="item.key === active ? 'page' : undefined">
          <VIcon :icon="item.key === active ? (item.activeIcon ?? item.icon) : item.icon" aria-hidden="true" />
          <span class="mx-tab-bar__label">{{ item.label }}</span>
        </MxLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.mx-tab-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--mx-z-bars);
  display: flex;
  justify-content: center;
  padding: 0 12px calc(10px + env(safe-area-inset-bottom));
  pointer-events: none;
}

@media (min-width: 840px) {
  .mx-tab-bar {
    display: none;
  }
}

.mx-tab-bar__list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  width: min(100%, 460px);
  margin: 0;
  padding: 6px;
  pointer-events: auto;
  list-style: none;
  background: var(--mx-glass);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-pill);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 20px 50px -18px var(--mx-shadow);
  backdrop-filter: blur(var(--mx-blur-bar)) saturate(180%);
  transition:
    width var(--mx-spring-smooth-duration) var(--mx-spring-smooth),
    padding var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

.mx-tab-bar--compact .mx-tab-bar__list {
  width: min(100%, 340px);
  padding: 4px;
}

.mx-tab-bar__list > li {
  display: flex;
  flex: 1;
  justify-content: center;
}

.mx-tab-bar__item {
  display: grid;
  justify-items: center;
  gap: 2px;
  min-width: 56px;
  min-height: 52px;
  padding: 6px 8px 4px;
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--mx-on-surface-muted);
  text-decoration: none;
  border-radius: var(--mx-radius-pill);
  transition:
    color var(--mx-duration-fast) var(--mx-ease-out),
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    min-height var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

.mx-tab-bar__item :deep(.v-icon) {
  font-size: 24px;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-tab-bar__item--active {
  color: var(--mx-on-surface);
  background: color-mix(in srgb, var(--mx-on-surface) 10%, transparent);
}

.mx-tab-bar__item--active :deep(.v-icon) {
  color: var(--mx-link);
  transform: translateY(-1px) scale(1.08);
}

.mx-tab-bar__item:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 1px;
}

.mx-tab-bar__label {
  max-height: 1.4em;
  overflow: hidden;
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-out),
    max-height var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

.mx-tab-bar--compact .mx-tab-bar__item {
  min-height: 44px;
}

.mx-tab-bar--compact .mx-tab-bar__label {
  max-height: 0;
  opacity: 0;
}

.mx-tab-bar__action {
  flex: 0 0 auto !important;
}

@media (prefers-reduced-motion: reduce) {
  .mx-tab-bar__list,
  .mx-tab-bar__item,
  .mx-tab-bar__label,
  .mx-tab-bar__item :deep(.v-icon) {
    transition: none;
  }
}
</style>
