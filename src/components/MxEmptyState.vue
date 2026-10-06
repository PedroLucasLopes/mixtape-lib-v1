<script setup lang="ts">
import { computed } from 'vue';
import { duotones, type DuotoneName } from '../theme/tokens';
import MxStarburst from './MxStarburst.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    icon?: string;
    duotone?: DuotoneName;
    compact?: boolean;
    headingLevel?: 2 | 3;
  }>(),
  { icon: 'mdi-album', duotone: 'lime', compact: false, headingLevel: 2 },
);

const colors = computed(() => duotones[props.duotone]);
</script>

<template>
  <section class="mx-empty" :class="{ 'mx-empty--compact': compact }">
    <MxStarburst shape="flower" :points="8" :color="colors.background" :ink="colors.ink" :size="compact ? 72 : 104" class="mx-empty__art">
      <VIcon :icon="icon" :size="compact ? 28 : 40" aria-hidden="true" />
    </MxStarburst>
    <component :is="`h${headingLevel}`" class="mx-empty__title">{{ title }}</component>
    <p v-if="description" class="mx-empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="mx-empty__actions">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.mx-empty {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: clamp(32px, 6vw, 64px) 16px;
  text-align: center;
  animation: mx-rise var(--mx-duration-slow) var(--mx-ease-out) both;
}

.mx-empty--compact {
  padding: 24px 12px;
}

.mx-empty__art {
  margin-bottom: 8px;
  animation: mx-float 5s ease-in-out infinite;
}

.mx-empty__title {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.mx-empty__description {
  max-width: 46ch;
  margin: 0;
  line-height: 1.55;
  color: var(--mx-on-surface-muted);
}

.mx-empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-empty,
  .mx-empty__art {
    animation: none;
  }
}
</style>
