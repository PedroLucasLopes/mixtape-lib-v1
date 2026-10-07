<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { duotoneFor, initials } from '../format';
import { metalForTier } from '../gamification/tiers';
import { duotones, metals } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    name: string;
    src?: string | null;
    seed?: string;
    size?: number;
    tier?: string | null;
    decorative?: boolean;
  }>(),
  { src: null, size: 44, tier: null, decorative: false },
);

const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

const palette = computed(() => duotones[duotoneFor(props.seed ?? props.name)]);
const ring = computed(() => {
  if (!props.tier) return null;
  const [dark, mid, light] = metals[metalForTier(props.tier)];
  return `conic-gradient(from 210deg, ${light}, ${mid}, ${dark}, ${mid}, ${light})`;
});
const showImage = computed(() => Boolean(props.src) && !failed.value);
</script>

<template>
  <span
    class="mx-avatar"
    :class="{ 'mx-avatar--ring': ring }"
    :style="{ '--mx-avatar-size': `${size}px`, '--mx-avatar-ring': ring ?? 'none' }"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : name"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span class="mx-avatar__inner" :style="{ background: palette.background, color: palette.ink }">
      <img
        v-if="showImage"
        class="mx-avatar__image"
        :src="src ?? undefined"
        alt=""
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @error="failed = true"
      />
      <span v-else class="mx-avatar__initials" aria-hidden="true">{{ initials(name) }}</span>
    </span>
  </span>
</template>

<style scoped>
.mx-avatar {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--mx-avatar-size);
  height: var(--mx-avatar-size);
  border-radius: 50%;
}

.mx-avatar--ring {
  padding: max(2px, calc(var(--mx-avatar-size) * 0.06));
  background: var(--mx-avatar-ring);
}

.mx-avatar__inner {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--mx-background);
}

.mx-avatar:not(.mx-avatar--ring) .mx-avatar__inner {
  box-shadow: none;
}

.mx-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mx-avatar__initials {
  font-family: var(--mx-font-display);
  font-size: calc(var(--mx-avatar-size) * 0.38);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}
</style>
