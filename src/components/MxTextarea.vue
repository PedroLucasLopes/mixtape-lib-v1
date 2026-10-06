<script setup lang="ts">
import { VTextarea } from 'vuetify/components';

const model = defineModel<string>({ default: '' });

withDefaults(
  defineProps<{
    label: string;
    hint?: string;
    placeholder?: string;
    errorMessages?: string | readonly string[];
    maxlength?: number;
    rows?: number;
    autoGrow?: boolean;
    disabled?: boolean;
    autofocus?: boolean;
  }>(),
  { rows: 4, autoGrow: true, disabled: false, autofocus: false },
);
</script>

<template>
  <VTextarea
    v-model="model"
    class="mx-textarea"
    :label="label"
    :hint="hint"
    :persistent-hint="Boolean(hint)"
    :placeholder="placeholder"
    :error-messages="errorMessages as string | string[] | undefined"
    :maxlength="maxlength"
    :counter="maxlength"
    :rows="rows"
    :auto-grow="autoGrow"
    :disabled="disabled"
    :autofocus="autofocus"
  />
</template>

<style scoped>
.mx-textarea :deep(.v-field) {
  border-radius: var(--mx-radius-md);
}

.mx-textarea :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px var(--mx-focus);
}

.mx-textarea :deep(textarea) {
  line-height: 1.6;
}
</style>
