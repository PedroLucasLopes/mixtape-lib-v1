<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ active: boolean; delay?: number }>(), { delay: 180 });

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.active,
  (active) => {
    clearTimeout(timer);
    if (active) {
      timer = setTimeout(() => {
        visible.value = true;
      }, props.delay);
    } else {
      visible.value = false;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="mx-progress-bar" :class="{ 'mx-progress-bar--visible': visible }" role="progressbar" :aria-hidden="!visible" aria-busy="true">
    <span class="mx-progress-bar__fill" />
  </div>
</template>

<style scoped>
.mx-progress-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--mx-z-toast);
  height: 4px;
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity var(--mx-duration-normal) var(--mx-ease-out),
    visibility 0s linear var(--mx-duration-normal);
}

.mx-progress-bar--visible {
  visibility: visible;
  opacity: 1;
  transition: opacity var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-progress-bar__fill {
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, var(--mx-cta), var(--mx-secondary), var(--mx-primary));
  border-radius: 0 4px 4px 0;
}

.mx-progress-bar--visible .mx-progress-bar__fill {
  animation: mx-progress-slide 1.1s var(--mx-ease-standard) infinite;
}

@keyframes mx-progress-slide {
  from { transform: translateX(-100%); }
  to { transform: translateX(260%); }
}

@media (prefers-reduced-motion: reduce) {
  .mx-progress-bar__fill {
    width: 100%;
    animation: none;
  }
}
</style>
