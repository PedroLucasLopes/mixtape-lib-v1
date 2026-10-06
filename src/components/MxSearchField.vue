<script setup lang="ts">
import { ref, useId } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';

const model = defineModel<string>({ default: '' });

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    size?: 'md' | 'lg';
    loading?: boolean;
    autofocus?: boolean;
    maxlength?: number;
  }>(),
  { size: 'md', loading: false, autofocus: false, maxlength: 200 },
);

const emit = defineEmits<{ submit: [query: string] }>();

const { t } = useMixtapeText();
const input = ref<HTMLInputElement | null>(null);
const inputId = useId();

const submit = () => {
  const query = model.value.trim();
  if (query) emit('submit', query);
};

const clear = () => {
  model.value = '';
  input.value?.focus();
};

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <form class="mx-search" :class="`mx-search--${size}`" role="search" @submit.prevent="submit">
    <label class="mx-sr-only" :for="inputId">{{ label ?? t('common.search') }}</label>
    <VIcon class="mx-search__icon" icon="mdi-magnify" aria-hidden="true" />
    <input
      :id="inputId"
      ref="input"
      v-model="model"
      class="mx-search__input"
      type="search"
      inputmode="search"
      enterkeyhint="search"
      autocomplete="off"
      :maxlength="maxlength"
      :placeholder="placeholder ?? t('common.searchPlaceholder')"
      :autofocus="autofocus"
      @keydown.esc="clear"
    />
    <button v-if="model" type="button" class="mx-search__clear" :aria-label="t('common.clear')" @click="clear">
      <VIcon icon="mdi-close" aria-hidden="true" />
    </button>
    <button type="submit" class="mx-search__submit" :aria-label="t('common.search')" :aria-busy="loading || undefined">
      <span v-if="loading" class="mx-search__spinner" aria-hidden="true" />
      <VIcon v-else icon="mdi-arrow-right" aria-hidden="true" />
    </button>
  </form>
</template>

<style scoped>
.mx-search {
  --mx-search-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: var(--mx-search-height);
  padding: 0 5px 0 16px;
  background: var(--mx-glass);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-pill);
  box-shadow: inset 0 1px 0 var(--mx-glass-highlight);
  transition:
    box-shadow var(--mx-duration-fast) var(--mx-ease-out),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-search--lg {
  --mx-search-height: 64px;
  padding-left: 22px;
  font-size: 1.125rem;
}

.mx-search:focus-within {
  border-color: var(--mx-focus);
  box-shadow:
    inset 0 1px 0 var(--mx-glass-highlight),
    0 0 0 3px color-mix(in srgb, var(--mx-focus) 35%, transparent);
}

.mx-search__icon {
  flex-shrink: 0;
  color: var(--mx-on-surface-muted);
}

.mx-search__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 10px;
  font: inherit;
  font-weight: 600;
  color: var(--mx-on-surface);
  background: transparent;
  border: 0;
  outline: none;
}

.mx-search__input::placeholder {
  color: var(--mx-on-surface-muted);
  opacity: 1;
}

.mx-search__input::-webkit-search-cancel-button {
  display: none;
}

.mx-search__clear,
.mx-search__submit {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;
  border: 0;
  border-radius: 50%;
}

.mx-search__clear {
  width: 32px;
  height: 32px;
  color: var(--mx-on-surface-muted);
  background: transparent;
}

.mx-search__submit {
  width: calc(var(--mx-search-height) - 10px);
  height: calc(var(--mx-search-height) - 10px);
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-search__submit:hover {
  transform: scale(1.06) rotate(-8deg);
}

.mx-search__clear:focus-visible,
.mx-search__submit:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-search__spinner {
  width: 18px;
  height: 18px;
  border: 3px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: mx-spin 700ms linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .mx-search__submit {
    transition: none;
  }

  .mx-search__submit:hover {
    transform: none;
  }
}
</style>
