<script setup lang="ts">
import { computed, useId } from 'vue';
import { metals, type MetalName } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    size?: number | string;
    finish?: 'black' | MetalName;
    labelColor?: string;
    image?: string | null;
    spinning?: boolean;
    speed?: number;
  }>(),
  { size: 160, finish: 'black', labelColor: 'var(--mx-cta)', image: null, spinning: false, speed: 1.8 },
);

const id = useId();
const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
const metal = computed(() => (props.finish === 'black' ? null : metals[props.finish]));
const grooves = [44, 41, 38, 35, 32, 29, 26];
</script>

<template>
  <span
    class="mx-vinyl"
    :class="{ 'mx-vinyl--spinning': spinning }"
    :style="{ width: dimension, height: dimension, '--mx-vinyl-speed': `${speed}s` }"
    aria-hidden="true"
  >
    <svg class="mx-vinyl__disc" viewBox="0 0 100 100" focusable="false">
      <defs>
        <linearGradient v-if="metal" :id="`${id}-metal`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="metal[2]" />
          <stop offset="35%" :stop-color="metal[1]" />
          <stop offset="62%" :stop-color="metal[0]" />
          <stop offset="82%" :stop-color="metal[1]" />
          <stop offset="100%" :stop-color="metal[2]" />
        </linearGradient>
        <clipPath :id="`${id}-label`">
          <circle cx="50" cy="50" r="17" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" :fill="metal ? `url(#${id}-metal)` : '#0E0D14'" />
      <circle
        v-for="radius in grooves"
        :key="radius"
        cx="50"
        cy="50"
        :r="radius"
        fill="none"
        :stroke="metal ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.07)'"
        stroke-width="0.6"
      />
      <circle cx="50" cy="50" r="17" :fill="labelColor" />
      <image
        v-if="image"
        :href="image"
        x="33"
        y="33"
        width="34"
        height="34"
        preserveAspectRatio="xMidYMid slice"
        :clip-path="`url(#${id}-label)`"
      />
      <path d="M50 35a15 15 0 0 1 13 7.5" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="50" cy="50" r="2.2" fill="#0B0A12" />
    </svg>
    <svg class="mx-vinyl__shine" viewBox="0 0 100 100" focusable="false">
      <defs>
        <radialGradient :id="`${id}-shine`" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32" />
          <stop offset="45%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" :fill="`url(#${id}-shine)`" />
    </svg>
  </span>
</template>

<style scoped>
.mx-vinyl {
  position: relative;
  display: block;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: 0 10px 18px -2px var(--mx-shadow);
}

.mx-vinyl__disc,
.mx-vinyl__shine {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.mx-vinyl--spinning .mx-vinyl__disc {
  animation: mx-spin var(--mx-vinyl-speed, 1.8s) linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .mx-vinyl--spinning .mx-vinyl__disc {
    animation: none;
  }
}
</style>
