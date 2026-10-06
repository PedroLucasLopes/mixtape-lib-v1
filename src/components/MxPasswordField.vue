<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { VTextField } from 'vuetify/components';
import { useMixtapeText } from '../i18n/useMixtapeText';

export interface PasswordRule {
  key: string;
  label: string;
  passed: boolean;
}

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    label: string;
    autocomplete?: 'new-password' | 'current-password';
    rules?: readonly PasswordRule[];
    errorMessages?: string | readonly string[];
    showStrength?: boolean;
    maxlength?: number;
    name?: string;
  }>(),
  { autocomplete: 'current-password', rules: () => [], showStrength: false },
);

const { t } = useMixtapeText();
const visible = ref(false);
const rulesId = useId();

const strength = computed(() => {
  const value = model.value;
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/\p{Ll}/u.test(value) && /\p{Lu}/u.test(value)) score += 1;
  if (/\p{N}/u.test(value)) score += 0.5;
  if (/[^\p{L}\p{N}]/u.test(value)) score += 1;
  if (props.rules.some((rule) => !rule.passed)) score = Math.min(score, 1);
  return Math.max(1, Math.min(4, Math.round(score)));
});

const LEVELS = ['weak', 'weak', 'fair', 'good', 'strong'] as const;
const level = computed(() => LEVELS[strength.value] ?? 'weak');
</script>

<template>
  <div class="mx-password">
    <VTextField
      v-model="model"
      class="mx-password__field"
      :label="label"
      :type="visible ? 'text' : 'password'"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :name="name"
      :error-messages="errorMessages as string | string[] | undefined"
      :aria-describedby="rules.length ? rulesId : undefined"
      spellcheck="false"
      autocapitalize="off"
    >
      <template #append-inner>
        <button
          type="button"
          class="mx-password__toggle"
          :aria-label="visible ? t('password.hide') : t('password.show')"
          :aria-pressed="visible"
          @click="visible = !visible"
        >
          <VIcon :icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" aria-hidden="true" />
        </button>
      </template>
    </VTextField>

    <div v-if="showStrength && model" class="mx-password__strength" :class="`mx-password__strength--${level}`">
      <span v-for="index in 4" :key="index" class="mx-password__bar" :class="{ 'mx-password__bar--on': index <= strength }" />
      <span class="mx-password__level" aria-live="polite">{{ t('password.strength', { level: t(`password.${level}`) }) }}</span>
    </div>

    <ul v-if="rules.length" :id="rulesId" class="mx-password__rules">
      <li v-for="rule in rules" :key="rule.key" class="mx-password__rule" :class="{ 'mx-password__rule--passed': rule.passed }">
        <VIcon :icon="rule.passed ? 'mdi-check-circle' : 'mdi-circle-outline'" size="18" aria-hidden="true" />
        <span>{{ rule.label }}</span>
        <span class="mx-sr-only">{{ rule.passed ? t('password.rulePassed') : t('password.rulePending') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mx-password {
  display: grid;
  gap: 10px;
}

.mx-password__field :deep(.v-field) {
  border-radius: var(--mx-radius-md);
}

.mx-password__field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px var(--mx-focus);
}

.mx-password__toggle {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--mx-on-surface-muted);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
}

.mx-password__toggle:focus-visible {
  outline: 3px solid var(--mx-focus);
}

.mx-password__strength {
  --mx-strength-color: var(--mx-error);
  display: flex;
  align-items: center;
  gap: 6px;
}

.mx-password__strength--fair { --mx-strength-color: var(--mx-warning); }
.mx-password__strength--good { --mx-strength-color: var(--mx-info); }
.mx-password__strength--strong { --mx-strength-color: var(--mx-success); }

.mx-password__bar {
  flex: 1;
  max-width: 64px;
  height: 6px;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
  transition: background-color var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-password__bar--on {
  background: var(--mx-strength-color);
}

.mx-password__level {
  margin-inline-start: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--mx-on-surface-muted);
}

.mx-password__rules {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-password__rule {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--mx-on-surface-muted);
  transition: color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-password__rule--passed {
  color: var(--mx-on-surface);
}

.mx-password__rule--passed :deep(.v-icon) {
  color: var(--mx-success);
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop);
}

@media (prefers-reduced-motion: reduce) {
  .mx-password__rule--passed :deep(.v-icon) {
    animation: none;
  }
}
</style>
