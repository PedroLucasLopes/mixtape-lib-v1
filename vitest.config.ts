import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'components',
          include: ['tests/**/*.test.ts'],
          environment: 'jsdom',
          setupFiles: ['tests/setup.ts'],
          server: { deps: { inline: ['vuetify'] } },
        },
      },
    ],
  },
});
