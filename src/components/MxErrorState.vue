<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxButton from './MxButton.vue';
import MxEmptyState from './MxEmptyState.vue';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    retryLabel?: string;
    retrying?: boolean;
    compact?: boolean;
  }>(),
  { retrying: false, compact: false },
);

const emit = defineEmits<{ retry: [] }>();

const { t } = useMixtapeText();
</script>

<template>
  <div data-testid="mx-error-state" role="alert">
    <MxEmptyState
      :title="title ?? t('error.title')"
      :description="description"
      icon="mdi-record-player"
      duotone="pink"
      :compact="compact"
    >
      <MxButton data-testid="mx-error-state-retry" variant="glass" icon="mdi-refresh" :loading="retrying" :label="retryLabel ?? t('common.retry')" @click="emit('retry')" />
      <slot />
    </MxEmptyState>
  </div>
</template>
