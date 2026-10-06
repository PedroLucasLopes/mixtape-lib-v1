# @pedrolucaslopes/mixtape-ui

Design system do Mixtape: componentes Vue 3 + Vuetify 4, paleta neon no estilo Spotify Wrapped,
vidro líquido, blobs, molas em CSS e Storybook. Todo componente nasce aqui, com story nos dois
temas e nas três línguas, e só depois é consumido pelo front (`mixtape-web-v1`).

As decisões de desenho, a conferência de contraste e as armadilhas já pagas estão em
[`CLAUDE.md`](CLAUDE.md).

## Storybook

```bash
npm ci
npm run storybook        # localhost:6010
```

O tema (escuro/claro) e a língua (pt-BR, en, es) ficam na barra do Storybook.

## Instalação

O pacote é **privado** no GitHub Packages. `.npmrc` da aplicação, versionado:

```ini
@pedrolucaslopes:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm i @pedrolucaslopes/mixtape-ui vue vuetify vue-i18n @fontsource-variable/bricolage-grotesque @fontsource-variable/figtree
```

## Uso

```ts
// plugins/vuetify.ts
import { createMixtapeLocale, mixtapeIcons, vuetifyOptions } from '@pedrolucaslopes/mixtape-ui'
import { useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { APP_ICON_PATHS } from './icons.generated'
import { i18n } from './i18n'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/figtree'
import 'vuetify/styles/core'
import '@pedrolucaslopes/mixtape-ui/styles'

export default createVuetify({
  ...vuetifyOptions,
  icons: mixtapeIcons(APP_ICON_PATHS),
  locale: createMixtapeLocale({ i18n, useI18n }),
})
```

Só `vuetify/styles/core`: os utilitários e as cores do `vuetify/styles` completo não são usados. Os
ícones são SVG; `APP_ICON_PATHS` é o mapa `nome → caminho` dos `mdi-*` que a aplicação usa além dos
da biblioteca (gerado a partir do `@mdi/js`, como o `sync:icons` daqui). O pacote é um arquivo por
módulo e cada componente importa o próprio CSS: o bundle da aplicação leva só o que ela usa.

```ts
// main.ts: links de verdade (<a href>) com navegação do vue-router
import { MIXTAPE_LINK_KEY } from '@pedrolucaslopes/mixtape-ui'
import { RouterLink } from 'vue-router'

app.provide(MIXTAPE_LINK_KEY, RouterLink)
```

```vue
<!-- App.vue -->
<script setup lang="ts">
  import { bindVuetifyTheme, MxToastHost } from '@pedrolucaslopes/mixtape-ui'

  bindVuetifyTheme()
</script>

<template>
  <VApp>
    <RouterView />
    <MxToastHost />
  </VApp>
</template>
```

## Conferir e publicar

```bash
npm run check:icons && npm run check:contrast && npm run check:locales && npm run type-check && npm test && npm run build
npm version patch
git push --follow-tags
```

A tag `v*` dispara `.github/workflows/publish.yml`, que publica com o `GITHUB_TOKEN` da execução.
