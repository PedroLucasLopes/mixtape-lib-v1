<script setup lang="ts">
import { useId } from 'vue';
import { useDisplay } from 'vuetify';
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxIconButton from './MxIconButton.vue';

const open = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    width?: number | string;
    persistent?: boolean;
    sheetOnMobile?: boolean;
  }>(),
  { width: 560, persistent: false, sheetOnMobile: true },
);

const { t } = useMixtapeText();
const { smAndDown } = useDisplay();
const titleId = useId();
</script>

<template>
  <VBottomSheet v-if="sheetOnMobile && smAndDown" v-model="open" :persistent="persistent" :aria-labelledby="titleId" scrollable>
    <div class="mx-dialog mx-dialog--sheet">
      <span class="mx-dialog__grabber" aria-hidden="true" />
      <header class="mx-dialog__header">
        <div>
          <h2 :id="titleId" class="mx-dialog__title">{{ title }}</h2>
          <p v-if="description" class="mx-dialog__description">{{ description }}</p>
        </div>
        <MxIconButton v-if="!persistent" icon="mdi-close" :label="t('common.close')" variant="ghost" size="sm" :tooltip="false" @click="open = false" />
      </header>
      <div class="mx-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.actions" class="mx-dialog__actions">
        <slot name="actions" />
      </footer>
    </div>
  </VBottomSheet>
  <VDialog v-else v-model="open" :max-width="width" :persistent="persistent" :aria-labelledby="titleId" scrollable>
    <div class="mx-dialog">
      <header class="mx-dialog__header">
        <div>
          <h2 :id="titleId" class="mx-dialog__title">{{ title }}</h2>
          <p v-if="description" class="mx-dialog__description">{{ description }}</p>
        </div>
        <MxIconButton v-if="!persistent" icon="mdi-close" :label="t('common.close')" variant="ghost" size="sm" :tooltip="false" @click="open = false" />
      </header>
      <div class="mx-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.actions" class="mx-dialog__actions">
        <slot name="actions" />
      </footer>
    </div>
  </VDialog>
</template>

<style scoped>
.mx-dialog {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  max-height: min(88vh, 860px);
  color: var(--mx-on-surface);
  background: var(--mx-glass-strong);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-xl);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 40px 90px -30px var(--mx-shadow);
  backdrop-filter: blur(var(--mx-blur-glass)) saturate(180%);
}

.mx-dialog--sheet {
  max-height: 92dvh;
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: var(--mx-radius-xl) var(--mx-radius-xl) 0 0;
}

.mx-dialog__grabber {
  justify-self: center;
  width: 44px;
  height: 5px;
  margin-top: 10px;
  background: var(--mx-outline-strong);
  border-radius: var(--mx-radius-pill);
}

.mx-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 22px 8px 26px;
}

.mx-dialog__title {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: clamp(1.375rem, 2.6vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.mx-dialog__description {
  margin: 6px 0 0;
  line-height: 1.5;
  color: var(--mx-on-surface-muted);
}

.mx-dialog__body {
  padding: 8px 26px 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.mx-dialog__actions {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 22px 22px;
  border-top: 1px solid var(--mx-outline);
}
</style>
