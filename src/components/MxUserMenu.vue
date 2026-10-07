<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useLanguages } from '../i18n/useLanguages';
import type { LinkTarget } from '../links/links';
import type { ThemeMode } from '../theme/useTheme';
import MxAvatar from './MxAvatar.vue';
import MxFlag from './MxFlag.vue';
import MxLink from './MxLink.vue';

export interface UserMenuItem {
  key: string;
  label: string;
  icon: string;
  to: LinkTarget;
}

withDefaults(
  defineProps<{
    name: string;
    username: string;
    avatarUrl?: string | null;
    tier?: string | null;
    tierLabel?: string | null;
    items?: readonly UserMenuItem[];
    themeMode: ThemeMode;
    signingOut?: boolean;
  }>(),
  { avatarUrl: null, tier: null, tierLabel: null, items: () => [], signingOut: false },
);

const emit = defineEmits<{ 'update:themeMode': [mode: ThemeMode]; signOut: [] }>();

const { t } = useMixtapeText();
const { languages, locale, setLocale } = useLanguages();

const themes: Array<{ mode: ThemeMode; icon: string }> = [
  { mode: 'system', icon: 'mdi-theme-light-dark' },
  { mode: 'light', icon: 'mdi-white-balance-sunny' },
  { mode: 'dark', icon: 'mdi-weather-night' },
];
</script>

<template>
  <VMenu location="bottom end" :close-on-content-click="false" transition="scale-transition">
    <template #activator="{ props: activator, isActive }">
      <button
        v-bind="activator"
        type="button"
        class="mx-user-menu__trigger"
        :aria-label="t('user.openMenu', { name })"
        :aria-expanded="isActive"
      >
        <MxAvatar :name="name" :src="avatarUrl" :seed="username" :tier="tier" :size="40" decorative />
      </button>
    </template>

    <div class="mx-user-menu mx-glass">
      <div class="mx-user-menu__header">
        <MxAvatar :name="name" :src="avatarUrl" :seed="username" :tier="tier" :size="52" decorative />
        <div class="mx-user-menu__identity">
          <p class="mx-user-menu__name">{{ name }}</p>
          <p class="mx-user-menu__username">@{{ username }}<template v-if="tierLabel"> · {{ tierLabel }}</template></p>
        </div>
      </div>

      <nav v-if="items.length" class="mx-user-menu__nav">
        <MxLink v-for="item in items" :key="item.key" :to="item.to" class="mx-user-menu__item">
          <VIcon :icon="item.icon" size="20" aria-hidden="true" />
          {{ item.label }}
        </MxLink>
      </nav>

      <fieldset class="mx-user-menu__group">
        <legend class="mx-user-menu__legend">{{ t('theme.label') }}</legend>
        <div class="mx-user-menu__themes">
          <button
            v-for="option in themes"
            :key="option.mode"
            type="button"
            class="mx-user-menu__theme"
            :class="{ 'mx-user-menu__theme--active': option.mode === themeMode }"
            :aria-pressed="option.mode === themeMode"
            @click="emit('update:themeMode', option.mode)"
          >
            <VIcon :icon="option.icon" size="18" aria-hidden="true" />
            {{ t(`theme.${option.mode}`) }}
          </button>
        </div>
      </fieldset>

      <fieldset v-if="languages.length > 1" class="mx-user-menu__group">
        <legend class="mx-user-menu__legend">{{ t('language.label') }}</legend>
        <div class="mx-user-menu__languages">
          <button
            v-for="language in languages"
            :key="language.code"
            type="button"
            class="mx-user-menu__language"
            :class="{ 'mx-user-menu__language--active': language.code === locale }"
            :aria-pressed="language.code === locale"
            :lang="language.code"
            @click="setLocale(language.code)"
          >
            <MxFlag :region="language.region" :size="20" />
            {{ language.name }}
          </button>
        </div>
      </fieldset>

      <button type="button" class="mx-user-menu__sign-out" :disabled="signingOut" @click="emit('signOut')">
        <VIcon icon="mdi-logout" size="20" aria-hidden="true" />
        {{ t('user.signOut') }}
      </button>
    </div>
  </VMenu>
</template>

<style scoped>
.mx-user-menu__trigger {
  display: inline-grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: 50%;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-user-menu__trigger:hover {
  transform: scale(1.06) rotate(-4deg);
}

.mx-user-menu__trigger:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-user-menu {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  width: min(320px, calc(100vw - 24px));
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  color: var(--mx-on-surface);
  border-radius: var(--mx-radius-lg);
}

.mx-user-menu__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mx-user-menu__identity {
  min-width: 0;
}

.mx-user-menu__name,
.mx-user-menu__username {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-user-menu__name {
  font-family: var(--mx-font-display);
  font-size: 1.125rem;
  font-weight: 800;
}

.mx-user-menu__username {
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-user-menu__nav {
  display: grid;
  gap: 2px;
}

.mx-user-menu__item,
.mx-user-menu__sign-out {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 12px;
  font: inherit;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: var(--mx-radius-sm);
}

.mx-user-menu__item:hover,
.mx-user-menu__sign-out:hover {
  background: color-mix(in srgb, var(--mx-on-surface) 8%, transparent);
}

.mx-user-menu__item:focus-visible,
.mx-user-menu__sign-out:focus-visible,
.mx-user-menu__theme:focus-visible,
.mx-user-menu__language:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 1px;
}

.mx-user-menu__group {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;
}

.mx-user-menu__legend {
  margin-bottom: 8px;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-user-menu__themes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.mx-user-menu__theme,
.mx-user-menu__language {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 8px;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 750;
  color: inherit;
  cursor: pointer;
  background: color-mix(in srgb, var(--mx-on-surface) 6%, transparent);
  border: 2px solid transparent;
  border-radius: var(--mx-radius-sm);
}

.mx-user-menu__theme {
  flex-direction: column;
  gap: 2px;
  min-height: 56px;
}

.mx-user-menu__languages {
  display: grid;
  gap: 6px;
}

.mx-user-menu__language {
  justify-content: flex-start;
  padding: 0 12px;
}

.mx-user-menu__theme--active,
.mx-user-menu__language--active {
  border-color: var(--mx-primary);
  background: color-mix(in srgb, var(--mx-primary) 14%, transparent);
}

.mx-user-menu__sign-out {
  color: var(--mx-error);
}

.mx-user-menu__sign-out:disabled {
  cursor: progress;
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .mx-user-menu__trigger {
    transition: none;
  }

  .mx-user-menu__trigger:hover {
    transform: none;
  }
}
</style>
