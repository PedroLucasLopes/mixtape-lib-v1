<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxVinyl from './MxVinyl.vue';

withDefaults(defineProps<{ label?: string; size?: number; inline?: boolean }>(), { size: 72, inline: false });

const { t } = useMixtapeText();
</script>

<template>
  <div class="mx-loader" :class="{ 'mx-loader--inline': inline }" role="status">
    <MxVinyl :size="size" spinning :speed="1.2" />
    <span :class="inline ? 'mx-sr-only' : 'mx-loader__label'">{{ label ?? t('common.loading') }}</span>
  </div>
</template>

<style scoped>
.mx-loader {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 32px 16px;
  animation: mx-pop-in var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-loader--inline {
  display: inline-grid;
  padding: 0;
}

.mx-loader__label {
  font-weight: 700;
  color: var(--mx-on-surface-muted);
}

@media (prefers-reduced-motion: reduce) {
  .mx-loader {
    animation: none;
  }
}
</style>
