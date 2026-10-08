<script setup lang="ts">
import { computed } from 'vue';
import { hashString } from '../format';
import { blobColors } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    colors?: readonly string[];
    count?: number;
    seed?: string;
    intensity?: 'subtle' | 'vivid';
    animated?: boolean;
    fixed?: boolean;
  }>(),
  { colors: () => blobColors, count: 5, seed: 'mixtape', intensity: 'subtle', animated: true, fixed: false },
);

const COMPACT_COUNT = 3;
const SAMPLES = 24;
const VISIBLE_SHARE = 0.9;
const JITTER = 0.35;
const GROWTH = 0.1;

type Point = readonly [number, number];

const random = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const grid = (count: number, next: () => number): Point[] => {
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const points: Point[] = [];
  for (let row = 0; row < rows; row++) {
    const inRow = Math.min(columns, count - row * columns);
    for (let column = 0; column < inRow; column++) {
      points.push([
        (column + 0.5 + (next() - 0.5) * JITTER) / inRow,
        (row + 0.5 + (next() - 0.5) * JITTER) / rows,
      ]);
    }
  }
  return points;
};

const farthestGap = (points: readonly Point[]) => {
  let worst = 0;
  for (let row = 0; row <= SAMPLES; row++) {
    for (let column = 0; column <= SAMPLES; column++) {
      const x = column / SAMPLES;
      const y = row / SAMPLES;
      let nearest = Number.POSITIVE_INFINITY;
      for (const [px, py] of points) nearest = Math.min(nearest, Math.hypot(x - px, y - py));
      worst = Math.max(worst, nearest);
    }
  }
  return worst;
};

const diameterFor = (points: readonly Point[]) => (2 * farthestGap(points)) / VISIBLE_SHARE;

const blobs = computed(() => {
  const next = random(hashString(props.seed));
  const points = grid(props.count, next);
  const compactPoints = grid(Math.min(props.count, COMPACT_COUNT), random(hashString(`${props.seed}:compact`)));
  const full = diameterFor(points);
  const compact = diameterFor(compactPoints);

  return points.map(([x, y], index) => {
    const grow = 1 + next() * GROWTH;
    const [compactX, compactY] = compactPoints[index] ?? [x, y];
    return {
      key: index,
      color: props.colors[index % props.colors.length],
      style: {
        '--mx-blob-x': x.toFixed(4),
        '--mx-blob-y': y.toFixed(4),
        '--mx-blob-size': (full * grow).toFixed(4),
        '--mx-blob-x-compact': compactX.toFixed(4),
        '--mx-blob-y-compact': compactY.toFixed(4),
        '--mx-blob-size-compact': (compact * grow).toFixed(4),
        animationDuration: `${22 + next() * 18}s`,
        animationDelay: `${-next() * 20}s`,
      },
    };
  });
});
</script>

<template>
  <div
    data-testid="mx-blob-field"
    class="mx-blob-field"
    :class="[`mx-blob-field--${intensity}`, { 'mx-blob-field--animated': animated, 'mx-blob-field--fixed': fixed }]"
    aria-hidden="true"
  >
    <span
      v-for="blob in blobs"
      :key="blob.key"
      data-testid="mx-blob-field-blob"
      class="mx-blob-field__blob"
      :style="{ ...blob.style, '--mx-blob-color': blob.color }"
    />
  </div>
</template>

<style scoped>
.mx-blob-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: strict;
}

.mx-blob-field--fixed {
  position: fixed;
}

.mx-blob-field__blob {
  --mx-blob-cx: var(--mx-blob-x);
  --mx-blob-cy: var(--mx-blob-y);
  --mx-blob-scale: var(--mx-blob-size);
  position: absolute;
  left: calc((var(--mx-blob-cx) - var(--mx-blob-scale) / 2) * 100%);
  top: calc((var(--mx-blob-cy) - var(--mx-blob-scale) / 2) * 100%);
  width: calc(var(--mx-blob-scale) * 100%);
  height: calc(var(--mx-blob-scale) * 100%);
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--mx-blob-color) 0%, var(--mx-blob-color) 38%, transparent 100%);
  opacity: 0.2;
}

.mx-blob-field--vivid .mx-blob-field__blob {
  opacity: 0.45;
}

.mx-blob-field--animated .mx-blob-field__blob {
  animation-name: mx-blob-float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  will-change: transform;
}

@media (max-width: 600px) {
  .mx-blob-field__blob {
    --mx-blob-cx: var(--mx-blob-x-compact);
    --mx-blob-cy: var(--mx-blob-y-compact);
    --mx-blob-scale: var(--mx-blob-size-compact);
  }

  .mx-blob-field__blob:nth-child(n + 4) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-blob-field--animated .mx-blob-field__blob {
    animation: none;
  }
}
</style>
