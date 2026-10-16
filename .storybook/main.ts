import type { StorybookConfig } from '@storybook/vue3-vite';
import Vue from '@vitejs/plugin-vue';

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
