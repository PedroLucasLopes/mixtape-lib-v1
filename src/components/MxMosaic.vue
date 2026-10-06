<script setup lang="ts">
import { computed } from 'vue';
import { duotoneFor } from '../format';
import { duotones } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    covers: readonly string[];
    seed: string;
    size?: number | string;
    icon?: string;
  }>(),
  { size: '100%', icon: 'mdi-playlist-music' },
);

const tiles = computed(() => props.covers.filter(Boolean).slice(0, 4));
const palette = computed(() => duotones[duotoneFor(props.seed)]);
const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
</script>

<template>
  <span class="mx-mosaic" :class="`mx-mosaic--${tiles.length >= 4 ? 4 : tiles.length >= 1 ? 1 : 0}`" :style="{ width: dimension }" aria-hidden="true">
    <template v-if="tiles.length >= 4">
      <img v-for="cover in tiles" :key="cover" class="mx-mosaic__tile" :src="cover" alt="" loading="lazy" decoding="async" />
    </template>
    <img v-else-if="tiles.length >= 1" class="mx-mosaic__tile" :src="tiles[0]" alt="" loading="lazy" decoding="async" />
    <span v-else class="mx-mosaic__empty" :style="{ background: palette.background, color: palette.ink }">
      <VIcon :icon="icon" size="40%" />
    </span>
  </span>
</template>

<style scoped>
.mx-mosaic {
  display: grid;
  flex-shrink: 0;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-sm);
  box-shadow: 0 14px 34px -18px var(--mx-shadow);
}

.mx-mosaic--4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.mx-mosaic__tile {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mx-mosaic__empty {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}
</style>
