<script setup lang="ts">
import { computed } from 'vue';
import { duotones, type DuotoneName } from '../theme/tokens';

const props = withDefaults(
  defineProps<{
    tag?: string;
    variant?: 'panel' | 'card' | 'bar' | 'pill' | 'sheet';
    tint?: DuotoneName | 'cta' | null;
    strong?: boolean;
    interactive?: boolean;
    padded?: boolean;
    blur?: boolean;
  }>(),
  { tag: 'div', variant: 'panel', tint: null, strong: false, interactive: false, padded: true, blur: false },
);

const tintColor = computed(() => {
  if (!props.tint) return null;
  return props.tint === 'cta' ? 'var(--mx-cta)' : duotones[props.tint].background;
});
</script>

<template>
  <component
    :is="tag"
    class="mx-glass-surface"
    :class="[
      `mx-glass-surface--${variant}`,
      {
        'mx-glass-surface--strong': strong,
        'mx-glass-surface--interactive': interactive,
        'mx-glass-surface--padded': padded,
        'mx-glass-surface--blur': blur,
      },
    ]"
    :style="tintColor ? { '--mx-glass-tint': tintColor } : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.mx-glass-surface {
  --mx-glass-tint: transparent;

  position: relative;
  isolation: isolate;
  color: var(--mx-on-surface);
  background:
    linear-gradient(color-mix(in srgb, var(--mx-glass-tint) 14%, transparent), color-mix(in srgb, var(--mx-glass-tint) 14%, transparent)),
    var(--mx-glass);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-lg);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 22px 56px -24px var(--mx-shadow);
}

.mx-glass-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--mx-glass-highlight) 45%, transparent) 0%,
    transparent 38%,
    transparent 70%,
    color-mix(in srgb, var(--mx-glass-highlight) 18%, transparent) 100%
  );
  opacity: 0.55;
}

.mx-glass-surface--blur {
  backdrop-filter: blur(var(--mx-blur-glass)) saturate(175%);
}

.mx-glass-surface--strong {
  background:
    linear-gradient(color-mix(in srgb, var(--mx-glass-tint) 14%, transparent), color-mix(in srgb, var(--mx-glass-tint) 14%, transparent)),
    var(--mx-glass-strong);
}

.mx-glass-surface--padded.mx-glass-surface--panel { padding: clamp(18px, 3vw, 28px); }
.mx-glass-surface--padded.mx-glass-surface--card { padding: 16px; }
.mx-glass-surface--padded.mx-glass-surface--bar { padding: 8px 10px; }
.mx-glass-surface--padded.mx-glass-surface--pill { padding: 6px 8px; }
.mx-glass-surface--padded.mx-glass-surface--sheet { padding: 24px clamp(18px, 4vw, 32px); }

.mx-glass-surface--card { border-radius: var(--mx-radius-md); }
.mx-glass-surface--bar { border-radius: var(--mx-radius-xl); }
.mx-glass-surface--pill { border-radius: var(--mx-radius-pill); }
.mx-glass-surface--sheet { border-radius: var(--mx-radius-xl) var(--mx-radius-xl) 0 0; }

.mx-glass-surface--interactive {
  transition:
    transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth),
    box-shadow var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-glass-surface--interactive:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 30px 70px -26px var(--mx-shadow);
}

@media (prefers-reduced-motion: reduce) {
  .mx-glass-surface--interactive,
  .mx-glass-surface--interactive:hover {
    transition: none;
    transform: none;
  }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .mx-glass-surface--blur {
    background: var(--mx-glass-strong);
  }
}
</style>
