import { posix } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin } from 'vite';
import Vuetify from 'vite-plugin-vuetify';

const EMPTY_CSS_PLACEHOLDER = /\/\* empty css\s*\*\//g;

/**
 * Cada módulo do pacote passa a importar o próprio CSS. O Vite de biblioteca extrai o CSS e troca o
 * import por um comentário `/* empty css *\/`: sem a referência, a aplicação teria de importar tudo de
 * uma vez. Aqui o comentário volta a ser import, no mesmo lugar e na mesma linha (o source map continua
 * certo e o CSS do componente segue depois do CSS do Vuetify que ele usa). Com a referência, o bundler
 * da aplicação leva para cada página só o CSS dos componentes que ela usa.
 */
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

/**
 * Build da biblioteca: é o que o `npm publish` empacota.
 *
 * O nome não é `vite.config.ts` de propósito: o Storybook carrega sozinho o `vite.config.*` da raiz e
 * mesclaria um `build.lib`, transformando o `build-storybook` em build de pacote.
 *
 * Um arquivo por módulo (`preserveModules`) e CSS por componente: o bundler da aplicação descarta o
 * que ela não usa e divide o resto entre as páginas. Vue, Vuetify e vue-i18n ficam de fora
 * (peerDependencies): duas cópias do Vue na mesma página quebram `inject`, que é por onde tema, língua
 * e o componente de link chegam. O `vite-plugin-vuetify` escreve o import de cada componente do
 * Vuetify usado; o CSS do Vuetify fica com a aplicação.
 */
export default defineConfig({
  plugins: [Vue(), Vuetify({ autoImport: true, styles: 'none' }), restoreCssImports()],
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
