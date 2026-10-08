<script setup lang="ts">
import { computed } from 'vue';
import { BRANDS, type BrandName } from './brands';

const props = withDefaults(
  defineProps<{
    name: BrandName;
    size?: number | string;
    colored?: boolean;
    title?: string;
  }>(),
  { size: 20, colored: false },
);

const brand = computed(() => BRANDS[props.name]);
const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
const fill = computed(() => (props.colored && brand.value.color ? brand.value.color : 'currentColor'));
</script>

<template>
  <svg
    v-if="brand.path"
    data-testid="mx-brand-icon"
    class="mx-brand-icon"
    viewBox="0 0 24 24"
    :width="dimension"
    :height="dimension"
    :role="title ? 'img' : undefined"
    :aria-label="title"
    :aria-hidden="title ? undefined : 'true'"
    focusable="false"
  >
    <path :d="brand.path" :fill="fill" />
  </svg>
  <VIcon v-else data-testid="mx-brand-icon" :icon="brand.fallbackIcon" :size="dimension" :aria-label="title" :aria-hidden="title ? undefined : 'true'" />
</template>

<style scoped>
.mx-brand-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
