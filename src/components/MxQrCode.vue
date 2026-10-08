<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxStarburst from './MxStarburst.vue';

withDefaults(
  defineProps<{
    png: string;
    svg?: string | null;
    alt: string;
    downloadName?: string;
    size?: number;
  }>(),
  { svg: null, downloadName: 'mixtape', size: 200 },
);

const { t } = useMixtapeText();
</script>

<template>
  <figure data-testid="mx-qr-code" class="mx-qr">
    <div class="mx-qr__stage">
      <MxStarburst class="mx-qr__burst" shape="sun" :points="24" color="var(--mx-cta)" :size="size + 90" spin />
      <img data-testid="mx-qr-code-image" class="mx-qr__image" :src="png" :alt="alt" :width="size" :height="size" loading="lazy" decoding="async" />
    </div>
    <figcaption class="mx-qr__actions">
      <a data-testid="mx-qr-code-download-png" class="mx-qr__download" :href="png" :download="`${downloadName}.png`">
        <VIcon icon="mdi-download" size="18" aria-hidden="true" />
        {{ t('share.downloadPng') }}
      </a>
      <a v-if="svg" data-testid="mx-qr-code-download-svg" class="mx-qr__download" :href="svg" :download="`${downloadName}.svg`">
        <VIcon icon="mdi-vector-square" size="18" aria-hidden="true" />
        {{ t('share.downloadSvg') }}
      </a>
    </figcaption>
  </figure>
</template>

<style scoped>
.mx-qr {
  display: grid;
  justify-items: center;
  gap: 18px;
  margin: 0;
}

.mx-qr__stage {
  position: relative;
  display: grid;
  place-items: center;
  padding: 44px;
}

.mx-qr__burst {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
}

.mx-qr__image {
  position: relative;
  padding: 12px;
  background: #ffffff;
  border: 3px solid #15121f;
  border-radius: var(--mx-radius-md);
  box-shadow: 6px 6px 0 #15121f;
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop) both;
}

.mx-qr__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.mx-qr__download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 16px;
  font-weight: 800;
  color: var(--mx-on-surface);
  text-decoration: none;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-qr__download:hover {
  transform: translateY(-2px);
}

.mx-qr__download:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-qr__image {
    animation: none;
  }

  .mx-qr__download {
    transition: none;
  }

  .mx-qr__download:hover {
    transform: none;
  }
}
</style>
