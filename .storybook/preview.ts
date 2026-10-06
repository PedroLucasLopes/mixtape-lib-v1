import { type Preview, setup } from '@storybook/vue3-vite';
import { watchEffect } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/figtree';
import 'vuetify/styles/core';
import '../src/styles/base.css';
import { mixtapeIcons } from '../src/icons/iconSet';
import { createMixtapeLocale } from '../src/i18n/createMixtapeLocale';
import { languageName } from '../src/i18n/languages';
import { appMessages } from '../src/mocks/locales';
import { applyThemeVariables } from '../src/theme/useTheme';
import { THEME_DARK, THEME_LIGHT, vuetifyOptions } from '../src/theme/vuetify';
import './preview.css';
import { STORY_ICON_PATHS } from './story-icons.generated';

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'pt-BR', messages: appMessages });

const vuetify = createVuetify({
  ...vuetifyOptions,
  icons: mixtapeIcons(STORY_ICON_PATHS),
  locale: createMixtapeLocale({ i18n, useI18n }),
  components,
  directives,
});

setup((app) => {
  app.use(i18n);
  app.use(vuetify);
});

type AppLocale = typeof i18n.global.locale.value;

let appliedLocale: string | null = null;

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema da interface',
      toolbar: {
        title: 'Tema',
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Escuro', icon: 'moon' },
          { value: 'light', title: 'Claro', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Língua da interface',
      toolbar: {
        title: 'Língua',
        icon: 'globe',
        items: i18n.global.availableLocales.map((code) => ({ value: code, title: languageName(code) })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark', locale: 'pt-BR' },
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$|At$/i } },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Fundação', 'Ações', 'Formulário', 'Música', 'Gamificação', 'Layout', 'Feedback', 'Compartilhar e anúncios'],
      },
    },
  },
  decorators: [
    (story, context) => ({
      components: { story },
      setup() {
        watchEffect(() => {
          const dark = context.globals['theme'] !== 'light';
          vuetify.theme.change(dark ? THEME_DARK : THEME_LIGHT);
          applyThemeVariables(dark);
          document.body.style.background = 'var(--mx-background)';
          document.body.style.color = 'var(--mx-on-surface)';
        });

        const requested = context.globals['locale'] as AppLocale | undefined;
        if (requested && requested !== appliedLocale) {
          appliedLocale = requested;
          i18n.global.locale.value = requested;
        }

        return {};
      },
      template: '<div class="mx-root mx-preview"><story /></div>',
    }),
  ],
};

export default preview;
