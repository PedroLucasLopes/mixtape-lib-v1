<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';

defineProps<{
  author?: string | null;
  license?: string | null;
  licenseUrl?: string | null;
  sourceUrl: string;
}>();

const { t } = useMixtapeText();
</script>

<template>
  <VMenu location="top end" :close-on-content-click="false">
    <template #activator="{ props: activator }">
      <button v-bind="activator" type="button" class="mx-image-credit" :aria-label="t('media.credits')">
        <VIcon icon="mdi-copyright" aria-hidden="true" />
      </button>
    </template>
    <div class="mx-image-credit__card mx-glass">
      <p v-if="author" class="mx-image-credit__line">{{ t('media.photoBy', { author }) }}</p>
      <p v-if="license" class="mx-image-credit__line">
        <a v-if="licenseUrl" :href="licenseUrl" target="_blank" rel="noopener noreferrer">{{ t('media.license', { license }) }}</a>
        <span v-else>{{ t('media.license', { license }) }}</span>
      </p>
      <a class="mx-image-credit__source" :href="sourceUrl" target="_blank" rel="noopener noreferrer">
        {{ t('media.source') }}
        <VIcon icon="mdi-arrow-top-right" size="16" aria-hidden="true" />
      </a>
    </div>
  </VMenu>
</template>

<style scoped>
.mx-image-credit {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background: rgba(11, 10, 18, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(8px);
}

.mx-image-credit:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-image-credit__card {
  display: grid;
  gap: 6px;
  max-width: 280px;
  padding: 14px 16px;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--mx-on-surface);
  border-radius: var(--mx-radius-md);
}

.mx-image-credit__line {
  margin: 0;
  overflow-wrap: anywhere;
}

.mx-image-credit__card a {
  color: var(--mx-link);
  font-weight: 700;
}

.mx-image-credit__source {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
