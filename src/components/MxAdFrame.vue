<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';

withDefaults(
  defineProps<{
    label?: string;
    variant?: 'banner' | 'rectangle' | 'inline';
  }>(),
  { variant: 'banner' },
);

const { t } = useMixtapeText();
</script>

<template>
  <aside class="mx-ad-frame" :class="`mx-ad-frame--${variant}`" :aria-label="label ?? t('ads.label')">
    <span class="mx-ad-frame__label" aria-hidden="true">{{ label ?? t('ads.label') }}</span>
    <div class="mx-ad-frame__slot">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.mx-ad-frame {
  display: grid;
  gap: 6px;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
}

.mx-ad-frame__label {
  justify-self: center;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-ad-frame__slot {
  display: grid;
  place-items: center;
  overflow: hidden;
  background: color-mix(in srgb, var(--mx-surface-variant) 60%, transparent);
  border: 1px dashed var(--mx-outline);
  border-radius: var(--mx-radius-md);
}

.mx-ad-frame--banner .mx-ad-frame__slot {
  min-height: 100px;
}

.mx-ad-frame--rectangle .mx-ad-frame__slot {
  min-height: 280px;
}

.mx-ad-frame--inline .mx-ad-frame__slot {
  min-height: 120px;
}

@media (min-width: 840px) {
  .mx-ad-frame--banner .mx-ad-frame__slot {
    min-height: 120px;
  }
}
</style>
