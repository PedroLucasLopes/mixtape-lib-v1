import { computed } from 'vue';
import { useLocale } from 'vuetify';
import { type MixtapeTextKey, translate } from './catalog';
import type { MessageParams } from './format';

export function useMixtapeText() {
  const locale = useLocale();
  const current = computed(() => locale.current.value);

  const t = (key: MixtapeTextKey, params?: MessageParams): string => translate(current.value, key, params);

  return { t, locale: current };
}
