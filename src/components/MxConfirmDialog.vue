<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxButton from './MxButton.vue';
import MxDialog from './MxDialog.vue';

const open = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    error?: string | null;
  }>(),
  { destructive: false, loading: false, error: null },
);

const emit = defineEmits<{ confirm: [] }>();

const { t } = useMixtapeText();
</script>

<template>
  <MxDialog v-model="open" :title="title" :width="440" :persistent="loading">
    <p class="mx-confirm__message">{{ message }}</p>
    <p v-if="error" class="mx-confirm__error" role="alert">
      <VIcon icon="mdi-alert-circle" size="18" aria-hidden="true" />
      {{ error }}
    </p>
    <template #actions>
      <MxButton variant="ghost" :label="cancelLabel ?? t('common.cancel')" :disabled="loading" @click="open = false" />
      <MxButton
        :variant="destructive ? 'danger' : 'cta'"
        :label="confirmLabel ?? t('common.confirm')"
        :loading="loading"
        @click="emit('confirm')"
      />
    </template>
  </MxDialog>
</template>

<style scoped>
.mx-confirm__message {
  margin: 0;
  line-height: 1.55;
}

.mx-confirm__error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 14px 0 0;
  padding: 10px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--mx-on-surface);
  background: color-mix(in srgb, var(--mx-error) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--mx-error) 45%, transparent);
  border-radius: var(--mx-radius-sm);
}

.mx-confirm__error :deep(.v-icon) {
  color: var(--mx-error);
}
</style>
