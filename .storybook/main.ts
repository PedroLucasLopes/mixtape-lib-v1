import type { StorybookConfig } from '@storybook/vue3-vite';
import Vue from '@vitejs/plugin-vue';

/**
 * Duas armadilhas já pagas no components_storybook-v1 (dotlog-ui) e repetidas aqui:
 *
 * - O `@storybook/vue3-vite` 10.6 não injeta o `@vitejs/plugin-vue` com Vite 8: sem ele, todo `.vue`
 *   cai no parser de JavaScript. O plugin entra à mão, conferindo antes se já está lá.
 * - Sem `vite-plugin-vuetify`: a 2.1.3 quebra com Vite 8 no `configResolved`. O `preview.ts`
 *   registra todos os componentes do Vuetify de uma vez.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = viteConfig.plugins ?? [];
    const names = new Set(
      viteConfig.plugins
        .flat()
        .map((plugin) => (plugin && typeof plugin === 'object' && 'name' in plugin ? String(plugin.name) : '')),
    );
    if (!names.has('vite:vue')) viteConfig.plugins.push(Vue());
    return viteConfig;
  },
};

export default config;
