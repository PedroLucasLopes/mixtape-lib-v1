<script setup lang="ts">
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxBlobField from './MxBlobField.vue';
import MxProgressBar from './MxProgressBar.vue';
import MxTabBar, { type TabBarItem } from './MxTabBar.vue';
import MxTopBar from './MxTopBar.vue';

withDefaults(
  defineProps<{
    loading?: boolean;
    tabItems?: readonly TabBarItem[];
    activeTab?: string | null;
    navLabel: string;
    tabLabel: string;
    blobs?: boolean;
    mainId?: string;
  }>(),
  { loading: false, tabItems: () => [], activeTab: null, blobs: true, mainId: 'main-content' },
);

const { t } = useMixtapeText();
</script>

<template>
  <div data-testid="mx-app-shell" class="mx-app-shell mx-root">
    <a data-testid="mx-app-shell-skip" class="mx-app-shell__skip" :href="`#${mainId}`">{{ t('common.skipToContent') }}</a>
    <MxProgressBar :active="loading" />
    <MxBlobField v-if="blobs" fixed :count="5" intensity="subtle" seed="mixtape-shell" />

    <MxTopBar :label="navLabel">
      <template #brand><slot name="brand" /></template>
      <template v-if="$slots.nav" #nav><slot name="nav" /></template>
      <template v-if="$slots.search" #search><slot name="search" /></template>
      <template #actions><slot name="actions" /></template>
    </MxTopBar>

    <main :id="mainId" data-testid="mx-app-shell-main" class="mx-app-shell__main" tabindex="-1">
      <slot />
    </main>

    <footer v-if="$slots.footer" data-testid="mx-app-shell-footer" class="mx-app-shell__footer">
      <slot name="footer" />
    </footer>

    <MxTabBar v-if="tabItems.length" :items="tabItems" :active="activeTab" :label="tabLabel">
      <template v-if="$slots.fab" #action><slot name="fab" /></template>
    </MxTabBar>

    <slot name="overlays" />
  </div>
</template>

<style scoped>
.mx-app-shell {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}

.mx-app-shell__skip {
  position: fixed;
  top: 0;
  left: 12px;
  z-index: var(--mx-z-toast);
  padding: 10px 16px;
  font-weight: 800;
  color: var(--mx-on-cta);
  text-decoration: none;
  background: var(--mx-cta);
  border-radius: var(--mx-radius-pill);
  transform: translateY(-120%);
  transition: transform var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-app-shell__skip:focus {
  transform: translateY(12px);
}

.mx-app-shell__main {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: calc(var(--mx-content-max) + 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
  padding: clamp(16px, 3vw, 32px) clamp(16px, 4vw, 40px) calc(var(--mx-tab-bar-height) + 48px);
  outline: none;
}

@media (min-width: 840px) {
  .mx-app-shell__main {
    padding-bottom: 64px;
  }
}

.mx-app-shell__footer {
  position: relative;
  z-index: 1;
  padding-bottom: calc(var(--mx-tab-bar-height) + 24px);
}

@media (min-width: 840px) {
  .mx-app-shell__footer {
    padding-bottom: 0;
  }
}
</style>
