import { computed, ref, watch } from 'vue';
import { useTheme as useVuetifyTheme } from 'vuetify';
import { darkColors, lightColors } from './tokens';
import { cssVariables, THEME_DARK, THEME_LIGHT } from './vuetify';

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'mx.theme';

const isMode = (value: unknown): value is ThemeMode => value === 'light' || value === 'dark' || value === 'system';

const readStored = (): ThemeMode | null => {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isMode(raw) ? raw : null;
  } catch {
    return null;
  }
};

const writeStored = (mode: ThemeMode): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    return;
  }
};

const darkQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const mode = ref<ThemeMode>(typeof window === 'undefined' ? 'system' : (readStored() ?? 'system'));
const systemIsDark = ref(darkQuery()?.matches ?? true);

darkQuery()?.addEventListener('change', (event) => {
  systemIsDark.value = event.matches;
});

const resolved = computed<'light' | 'dark'>(() =>
  mode.value === 'system' ? (systemIsDark.value ? 'dark' : 'light') : mode.value,
);

export function applyThemeVariables(dark: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [name, value] of Object.entries(cssVariables(dark ? darkColors : lightColors))) {
    root.style.setProperty(name, value);
  }
  root.dataset.mxTheme = dark ? 'dark' : 'light';
  root.style.colorScheme = dark ? 'dark' : 'light';
}

export function useThemePreference() {
  const setMode = (next: ThemeMode): void => {
    mode.value = next;
    writeStored(next);
  };

  return {
    mode,
    resolved,
    isDark: computed(() => resolved.value === 'dark'),
    setMode,
    toggle: () => setMode(resolved.value === 'dark' ? 'light' : 'dark'),
  };
}

export function bindVuetifyTheme(): void {
  const vuetify = useVuetifyTheme();

  const apply = (): void => {
    const dark = resolved.value === 'dark';
    vuetify.change(dark ? THEME_DARK : THEME_LIGHT);
    applyThemeVariables(dark);
  };

  apply();
  watch(resolved, apply);
}

export function initialThemeIsDark(): boolean {
  return resolved.value === 'dark';
}
