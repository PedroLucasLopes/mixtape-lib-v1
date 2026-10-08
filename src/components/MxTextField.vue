<script setup lang="ts">
import { VTextField } from 'vuetify/components';

const model = defineModel<string>({ default: '' });

withDefaults(
  defineProps<{
    label: string;
    type?: 'text' | 'email' | 'url' | 'date' | 'search' | 'tel';
    hint?: string;
    errorMessages?: string | readonly string[];
    autocomplete?: string;
    maxlength?: number;
    counter?: boolean;
    prependIcon?: string;
    prefix?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
    inputmode?: 'text' | 'email' | 'url' | 'numeric' | 'search' | 'tel';
    name?: string;
  }>(),
  { type: 'text', counter: false, required: false, disabled: false, readonly: false, autofocus: false },
);

const emit = defineEmits<{ blur: [] }>();
</script>

<template>
  <VTextField
    v-model="model"
    data-testid="mx-text-field"
    class="mx-text-field"
    :label="label"
    :type="type"
    :hint="hint"
    :persistent-hint="Boolean(hint)"
    :error-messages="errorMessages as string | string[] | undefined"
    :autocomplete="autocomplete"
    :maxlength="maxlength"
    :counter="counter ? maxlength : undefined"
    :prepend-inner-icon="prependIcon"
    :prefix="prefix"
    :required="required"
    :aria-required="required || undefined"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :inputmode="inputmode"
    :name="name"
    @blur="emit('blur')"
  />
</template>

<style scoped>
.mx-text-field :deep(.v-field) {
  border-radius: var(--mx-radius-md);
}

.mx-text-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px var(--mx-focus);
}

.mx-text-field :deep(.v-label) {
  font-weight: 700;
}
</style>
