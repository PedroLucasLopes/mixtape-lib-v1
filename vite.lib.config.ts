import { posix } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin } from 'vite';
import Vuetify from 'vite-plugin-vuetify';

const EMPTY_CSS_PLACEHOLDER = /\/\* empty css\s*\*\//g;

function restoreCssImports(): Plugin {
  return {
    name: 'mixtape-restore-css-imports',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;
        const css = [...(chunk.viteMetadata?.importedCss ?? [])];
        const placeholders = chunk.code.match(EMPTY_CSS_PLACEHOLDER)?.length ?? 0;
        if (css.length !== placeholders) {
          this.error(`${chunk.fileName}: ${css.length} arquivo(s) de CSS para ${placeholders} import(s) removido(s)`);
        }
        let index = 0;
        chunk.code = chunk.code.replace(EMPTY_CSS_PLACEHOLDER, () => {
          const path = posix.relative(posix.dirname(chunk.fileName), css[index++]!);
          return `import '${path.startsWith('.') ? path : `./${path}`}';`;
        });
      }
    },
  };
}

const PREFIXED_ONLY = /-webkit-backdrop-filter:/;
const STANDARD = /(^|[^-])backdrop-filter:/;

function assertStandardBackdrop(): Plugin {
  return {
    name: 'mixtape-assert-standard-backdrop',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) continue;
        const css = typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source);
        if (PREFIXED_ONLY.test(css) && !STANDARD.test(css)) {
          this.error(`${asset.fileName}: -webkit-backdrop-filter sem backdrop-filter (o Chrome fica sem desfoque)`);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [Vue(), Vuetify({ autoImport: true, styles: 'none' }), restoreCssImports(), assertStandardBackdrop()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    cssCodeSplit: true,
    rolldownOptions: {
      external: [/^vue($|\/)/, /^vue-i18n($|\/)/, /^vuetify($|\/)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
