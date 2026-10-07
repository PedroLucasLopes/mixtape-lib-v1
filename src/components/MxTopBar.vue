<script setup lang="ts">
import { useScrollState } from '../motion/useScrollState';

defineProps<{ label?: string }>();

const { scrolled } = useScrollState(24);
</script>

<template>
  <header class="mx-top-bar" :class="{ 'mx-top-bar--scrolled': scrolled }">
    <div class="mx-top-bar__surface">
      <div class="mx-top-bar__brand">
        <slot name="brand" />
      </div>
      <nav v-if="$slots.nav" class="mx-top-bar__nav" :aria-label="label">
        <slot name="nav" />
      </nav>
      <div v-if="$slots.search" class="mx-top-bar__search">
        <slot name="search" />
      </div>
      <div class="mx-top-bar__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.mx-top-bar {
  position: sticky;
  top: 0;
  z-index: var(--mx-z-bars);
  padding: 12px clamp(10px, 2vw, 20px) 0;
  pointer-events: none;
  transition: padding var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-top-bar--scrolled {
  padding-top: 8px;
}

.mx-top-bar__surface {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.6vw, 18px);
  max-width: calc(var(--mx-content-max) + 32px);
  min-height: 64px;
  margin: 0 auto;
  padding: 8px 10px 8px 18px;
  pointer-events: auto;
  background: color-mix(in srgb, var(--mx-glass) 60%, transparent);
  border: 1px solid transparent;
  border-radius: var(--mx-radius-pill);
  transition:
    background-color var(--mx-duration-normal) var(--mx-ease-out),
    border-color var(--mx-duration-normal) var(--mx-ease-out),
    box-shadow var(--mx-duration-normal) var(--mx-ease-out),
    min-height var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
  backdrop-filter: blur(var(--mx-blur-bar)) saturate(170%);
}

.mx-top-bar--scrolled .mx-top-bar__surface {
  min-height: 56px;
  background: var(--mx-glass);
  border-color: var(--mx-glass-border);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 18px 44px -22px var(--mx-shadow);
}

.mx-top-bar__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.mx-top-bar__nav {
  display: none;
  align-items: center;
  gap: 2px;
}

@media (min-width: 1145px) {
  .mx-top-bar__nav {
    display: flex;
  }
}

.mx-top-bar__search {
  display: none;
  flex: 1;
  min-width: 0;
  max-width: 420px;
  margin-inline-start: auto;
}

.mx-top-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: auto;
}

@media (min-width: 840px) {
  .mx-top-bar__search {
    display: block;
  }

  .mx-top-bar__search + .mx-top-bar__actions {
    margin-inline-start: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-top-bar,
  .mx-top-bar__surface {
    transition: none;
  }
}
</style>
