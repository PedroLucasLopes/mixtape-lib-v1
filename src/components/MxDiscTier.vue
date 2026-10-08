<script setup lang="ts">
import { computed } from 'vue';
import { metalForTier } from '../gamification/tiers';
import { metals } from '../theme/tokens';
import MxVinyl from './MxVinyl.vue';

const props = withDefaults(
  defineProps<{
    tier: string;
    label?: string;
    size?: number;
    showLabel?: boolean;
    spinning?: boolean;
  }>(),
  { size: 56, showLabel: true, spinning: false },
);

const metal = computed(() => metalForTier(props.tier));
const labelColor = computed(() => metals[metal.value][0]);
</script>

<template>
  <span data-testid="mx-disc-tier" class="mx-disc-tier" :class="[`mx-disc-tier--${metal}`, { 'mx-disc-tier--spinning': spinning }]">
    <span class="mx-disc-tier__record">
      <MxVinyl :size="size" :finish="metal" :label-color="labelColor" :spinning="spinning" :speed="3.2" />
    </span>
    <span v-if="showLabel && label" class="mx-disc-tier__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.mx-disc-tier {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.mx-disc-tier__record {
  display: inline-flex;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-disc-tier:hover .mx-disc-tier__record {
  transform: rotate(140deg) scale(1.06);
}

.mx-disc-tier__label {
  font-family: var(--mx-font-display);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
}

@media (prefers-reduced-motion: reduce) {
  .mx-disc-tier__record {
    transition: none;
  }

  .mx-disc-tier:hover .mx-disc-tier__record {
    transform: none;
  }
}
</style>
