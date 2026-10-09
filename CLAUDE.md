# 💿 @pedrolucaslopes/mixtape-ui

Componentes Vue/Vuetify, tokens de design, primitivas de movimento e Storybook do Mixtape, o
"Letterboxd da música". É o contrato de **interface** do front, do mesmo jeito que a
`@pedrolucaslopes/dotlog-ui` é no ecossistema do rent_dashboard: repositório próprio
(`mixtape-lib-v1`), publicado no GitHub Packages e instalado **pelo npm** no `mixtape-web-v1`. Nenhum
front importa `../ui/src`, nem por alias, nem por `paths`, nem por link de pasta.

```bash
npm run storybook          # localhost:6010
npm run build-storybook
npm run check:contrast     # a paleta inteira contra a WCAG (temas, vidro sobre blobs e duotones)
npm run check:locales      # pt-BR (referência), en e es, e cada chave usada no código
npm run type-check
npm test                   # unidade (formatação) e componentes (jsdom); um só: npm test -- -t MxRotator
npm run test:components    # só os componentes: contrato de cada um e comportamento dos interativos
npm run check:testids      # todo componente com data-testid na raiz e nas partes interativas
npm run build              # dist/: um arquivo por módulo, o CSS de cada componente e as declarações
npm run sync:icons         # regenera o subconjunto de ícones MDI (SVG) usado pelos componentes
npm run check:icons        # falha se algum `mdi-*` do código não estiver no subconjunto
npm run sync:brand-icons   # regenera os ícones de marca a partir do simple-icons
```

---

## 📦 Distribuição

- **Pacote privado no GitHub Packages**, escopo `@pedrolucaslopes` (o dono no GitHub, em minúsculas).
- **Publicar:** `npm version patch` e `git push --follow-tags`. A tag `v*` dispara
  `.github/workflows/publish.yml`, que confere a tag contra a versão, roda auditoria, contraste,
  traduções e Storybook, e publica com o `GITHUB_TOKEN` da execução. O `prepublishOnly` confere
  traduções, contraste, tipos e testes, e compila.
- **Instalar:** `.npmrc` com `@pedrolucaslopes:registry=https://npm.pkg.github.com` e
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`. O token (clássico, `read:packages`) vem do
  ambiente; no Docker, como secret do BuildKit.
- **Antes da primeira publicação:** o `mixtape-web-v1` instala o pacote de `vendor/` (um `npm pack`
  desta pasta). Ver o `CLAUDE.md` do web. Testar mudança antes de publicar segue o mesmo caminho:
  `npm run build`, `npm pack`, e o `.tgz` vai para o `vendor/` do web.
- **Consumir:** `vue`, `vuetify` (e `vue-i18n`, opcional) são `peerDependencies`. A aplicação importa
  **só** `vuetify/styles/core` (o `vuetify/styles` inteiro traz 235 KB de utilitários e 40 KB de
  cores que nenhum componente usa), carrega as fontes **Bricolage Grotesque Variable** (com eixo de
  largura: `standard.css`) e **Figtree Variable**, chama `bindVuetifyTheme()` no `App.vue`, liga a
  língua com `createMixtapeLocale` e fornece o componente de link com
  `app.provide(MIXTAPE_LINK_KEY, RouterLink)`. Não precisa de `@mdi/font`: `vuetifyOptions` já
  registra os ícones em SVG, e a aplicação soma os dela com `icons: mixtapeIcons(SEUS_ICONES)`. O
  subconjunto daqui também sai em `@pedrolucaslopes/mixtape-ui/icons` (só JS, sem CSS), para o script
  de ícones da aplicação gerar apenas os que faltam. Ícone de fora do MDI (outra caixa, como os 512×512 do
  Font Awesome) entra como `IconShape` (`{ path, viewBox }`); o crédito da licença dele fica com a aplicação.
- **Só o que a página usa.** O CSS base (`dist/styles/base.css`) vem com o import do pacote; o CSS de
  cada componente vem com o componente. Como o pacote declara `"sideEffects": ["*.css"]`, componente
  que a aplicação não usa sai do bundle com o CSS dele, e o que ela usa só numa página vai para o
  chunk daquela página. `@pedrolucaslopes/mixtape-ui/styles` continua exportado, para quem quiser
  fixar a ordem do CSS base.

| Vai no pacote | Fica fora |
|---|---|
| `dist/**/*.js` (ESM, um arquivo por módulo, com source map), o CSS de cada componente, `dist/styles/base.css`, declarações `.d.ts` | stories, mocks, testes, `.storybook/`, `scripts/` |

**Como compila.** `vite.lib.config.ts` gera JS e CSS (o nome não é `vite.config.ts` de propósito:
o Storybook mescla o `vite.config.*` da raiz), com `preserveModules`: um arquivo por módulo, que é o
que deixa o bundler da aplicação descartar e dividir. O Vite de biblioteca tira o import do CSS e
deixa um comentário `/* empty css */` no lugar; o plugin `restoreCssImports` devolve o import na
mesma linha (o source map continua certo) e falha o build se a conta de arquivos e comentários não
bater. Vue, Vuetify e vue-i18n ficam externos; o `vite-plugin-vuetify` escreve o import de cada
componente do Vuetify usado; o CSS do Vuetify fica com a aplicação. As declarações saem do
`vue-tsc -p tsconfig.build.json`.

**Versão:** correção é `patch`; prop, evento, variante ou export novo é `minor`; mudar ou remover o
que existe é `major`. **Enquanto a versão começar com `0.`**, o `^` do npm já trata a `minor` como
incompatível (`^0.3.0` não aceita `0.4.0`): mudança que quebra sobe a `minor`, e o resto sobe a
`patch`. A 0.4.0 renomeou `listens` para `listeners` no `MxItemCard` (e a chave `media.listens`
para `media.listeners`). A 0.5.0 seguiu a política nova do produto (avaliação alheia só recebe curtida):
trocou o `MxReactionBar` (gostei/não gostei) pelo `MxLikeButton` (coração), tirou o `MxCommentItem`, trocou
`dislikes`, `comments`, `reaction`, `canReact` e `reactionPending` do `MxReviewCard` por `liked`, `canLike`,
`likePending` e o evento `like`, e criou o `MxGroupReviewCard` (review da galera). Na mesma versão, o conjunto
de ícones passou a aceitar `IconShape` (caminho com a própria `viewBox`) ao lado dos caminhos do MDI.
A 0.6.0 criou o `MxRotator`, fez o `MxBlobField` cobrir qualquer largura, pôs `data-testid` em tudo (com o
`check:testids` e os testes de componente) e mudou onde três componentes põem o que recebem de fora:
`MxIconButton`, `MxImageCredit` e `MxUserMenu` repassam classe, estilo e `data-testid` ao botão (antes iam
para o conteúdo teleportado do menu ou do tooltip). Também passou a abrir link externo do `MxLink` em
nova aba, com `rel="noopener noreferrer"`, mesmo sem `external` (antes, só com ele).
A 0.7.0 criou a `MxCrate` (pilha de discos) e o `listenersSource` do `MxItemCard`: com ele, o número diz de onde
veio ("4,2 mil ouvintes no ListenBrainz"), porque número de ouvintes sem fonte parece audiência do mundo.

---

## 🎨 Paleta: Wrapped, conferida e não escolhida no olho

As cores saíram das referências pedidas e foram **medidas** nas imagens, não estimadas:

| Fonte | O que deu |
|---|---|
| Spotify Wrapped 2022 (apresentação) | o neon da marca: lima `#E7FF4A`, rosa `#FF6FC3`, violeta `#7A2FF0`, verde `#19E266`, laranja `#FF8A1F` |
| Spotify Wrapped 2018 (cartões de artista) | os **duotones**: fundo chapado + tinta contrastante (verde-floresta/menta, vinho/amarelo, rosa-claro/vermelho, azul/rosa…) |
| Redesign do Letterboxd e app do Spotify | a base escura, o carrossel de capas, o FAB central e a barra inferior flutuante |

`src/theme/palette.json` é a **fonte única**: `tokens.ts` lê dele e o `check:contrast` também, então
script e tema nunca divergem. O script confere texto (4,5:1), componente (3:1), **texto sobre vidro
sobre cada blob da marca** (o pior caso do efeito líquido) e a tinta de cada duotone.

- **Tema escuro é a cara do produto, mas o padrão é `system`.** Fundo `#0B0A12` (não preto puro:
  preto puro causa halação em OLED e mata a elevação).
- **O `primary` muda de cor entre os temas.** Lima não passa nem 1,1:1 sobre branco, então no claro o
  `primary` do Vuetify (foco, seleção, notas) é violeta `#5B1FD1`. O **CTA** continua lima nos dois
  temas, com contorno de tinta e sombra "adesivo" no claro (`ctaOutline`, `ctaShadow`).
- **Duotones** pintam heróis e cartões; o duotone de um álbum sai do hash do MBID (`duotoneFor`),
  então cada disco tem "sua" cor sempre igual. Dentro de um duotone, use as variantes **`ink`** e
  **`ink-outline`** de `MxButton` e `ink` de `MxIconButton`: elas leem `--mx-hero-ink`/`--mx-hero-bg`.
- **Metais** (`demo`, `bronze`, `silver`, `gold`, `platinum`, `diamond`) vestem os discos de nível e
  os badges: o vinil de ouro é literalmente dourado.

## ✍️ Tipografia

**Bricolage Grotesque** (display: peso 800, largura 78–88%, entrelinha 0,88) para títulos gigantes no
estilo Wrapped; **Figtree** para texto. As duas são OFL e auto-hospedadas pela aplicação (Fontsource):
a CSP do front não libera Google Fonts. Escala fluida com `clamp()` em `typography.size`.

**Espaçamento entre letras sai dos tokens**, nunca de número solto: `--mx-tracking-display` (-0,01em,
títulos grandes), `--mx-tracking-title` (-0,005em, títulos de seção e diálogo) e `--mx-tracking-numeral`
(-0,025em, números grandes). Na 0.4.2 eles subiram de -0,035 a -0,06em: com a largura condensada, as
letras dos títulos encostavam ("Sua trilha sonora merece nota" ficava difícil de ler). A aplicação usa os
mesmos tokens; só o logotipo tem espaçamento próprio.

---

## 🌊 Movimento: tudo anima, nada obriga

| Primitiva | Para quê |
|---|---|
| `v-reveal` | entrada ao rolar (`up`, `down`, `left`, `right`, `scale`, `blur`, `pop`, `tilt`), com atraso para escalonar; um único `IntersectionObserver` para a página |
| `v-tilt` | inclinação 3D com brilho seguindo o ponteiro; desligado em toque e com movimento reduzido |
| `useCountUp` | números que contam até o valor quando aparecem (o leitor de tela recebe o valor final) |
| `useInView` / `useScrollState` | gatilhos de animação e barras que encolhem ao rolar |
| `startViewTransition` | transição de página com a View Transitions API, com fallback |
| molas em CSS | `--mx-spring-smooth`, `--mx-spring-bouncy` e `--mx-spring-pop`: curvas `linear()` geradas de um oscilador amortecido (overshoot de 0,6%, 12% e 30%) |

- **Toda animação tem contrapartida em `prefers-reduced-motion`.** O estado fica; o movimento sai.
- **O herói não anima opacidade no título.** O `h1` costuma ser o LCP, e o Chrome não conta elemento
  com opacidade 0: as palavras sobem com transformação, visíveis desde o primeiro quadro. Capa com
  `priority` também nasce visível.
- **Vidro líquido** é translucidez com borda de luz e realce especular. O desfoque
  (`backdrop-filter`) fica só no que **flutua** sobre o conteúdo: barras, menus, diálogos, avisos,
  crédito de imagem e `MxGlass` com `blur`. Cada desfoque é uma passada de GPU sobre tudo o que está
  atrás, refeita a cada quadro de rolagem; em botão, chip e cartão, multiplicado pela página, travava
  a rolagem. Sem suporte, o `blur` cai para o vidro forte (opaco).

## ⚡ Desempenho: o que deixou a página leve

| Regra | Por quê |
|---|---|
| Animação de entrada ou em laço só com `transform` e `opacity` | o compositor faz sozinho; `background-position`, `border-radius`, `width` e `filter` repintam a cada quadro. Transição curta de interação (cor no hover, indicador do segmentado) pode usar outras |
| Blob é `radial-gradient`, não `filter: blur()` | cinco blobs de 60 px de desfoque animados repintavam a tela inteira; o gradiente dá a mesma borda macia de graça. No celular, três blobs |
| `will-change` só durante a interação | o `v-tilt` liga com `--active`; deixar fixo prende uma camada de GPU por elemento |
| Sombra em elemento que gira fica num pai parado | `drop-shadow` num vinil girando era recalculado a cada quadro; o `MxVinyl` gira só o disco e a sombra fica no invólucro |
| Esqueleto brilha com um `::after` que translada | e a capa espera parada, com a cor da superfície |
| Barra de progresso escondida não anima | `visibility: hidden` e a animação só com `--visible` |
| Ícones em SVG, só os usados | a fonte MDI eram 403 KB de woff2 e 339 KB de CSS para ~40 ícones; `icons.generated.ts` tem 12 KB |

---

## 🗣️ Texto de tela em três línguas

Os componentes falam **pt-BR (referência)**, en e es, cada língua um JSON em `src/i18n/locales/`, e
seguem a língua da aplicação: `useMixtapeText` lê a língua corrente pelo `useLocale()` do Vuetify e
resolve no catálogo daqui. `createMixtapeLocale({ i18n, useI18n })` liga Vuetify, biblioteca e o
vue-i18n da aplicação à mesma língua e mantém `<html lang>` em dia.

- **Prop de rótulo tem padrão `undefined` e cai na tradução.** Texto de domínio (títulos, frases da
  aplicação) chega por prop: a biblioteca não conhece "álbum do mês".
- `@` literal numa tradução é `{'@'}`; o `check:locales` compila cada mensagem com o compilador do
  vue-i18n e recusa chave faltando, sobrando, parâmetro diferente e plural com outro número de formas.

---

## 🧩 Componentes

| Grupo | Componentes | Decisões |
|---|---|---|
| Base | `MxLink`, `MxButton`, `MxIconButton`, `MxGlass`, `MxChip`, `MxBrandIcon`, `MxFlag` | link real (`<a>`) sempre, via o componente injetado (`MIXTAPE_LINK_KEY`); botão não muda de largura carregando e só mostra o giro depois de 220 ms; botão de ícone exige `label` |
| Formas | `MxVinyl`, `MxBlobField`, `MxBlob`, `MxStarburst`, `MxMarquee` | blobs são decorativos (`aria-hidden`) e param com movimento reduzido; o `MxBlobField` cobre o campo inteiro em qualquer largura (grade estratificada pela semente, posição e diâmetro em % do campo, nada em px; até 600 px, um arranjo próprio de três) e o `MxBlob` aceita tamanho relativo (`clamp(…, 42%, …)`) com `aspect-ratio: 1`; o letreiro lista os itens para leitor de tela uma vez só |
| Mídia | `MxCover`, `MxAvatar`, `MxImageCredit`, `MxMosaic` | capa com `srcset` (250/500/1200), cor de superfície parada até carregar, arte de reserva no duotone do item, vinil que desliza para fora no hover e sombra ajustável por `--mx-cover-shadow` (no lugar de `filter: drop-shadow` num pai que anima); foto de artista com crédito de autor e licença |
| Notas | `MxRating`, `MxRatingInput`, `MxRatingHistogram` | nota de 0 a 5 em **meio disco**; a entrada é um `slider` de verdade (setas, Home/End, PageUp/Down), com botão de **zero** separado (zero é nota válida) e rótulo por nota ("Obra-prima"); histograma com visão de tabela |
| Gamificação | `MxStat`, `MxDiscTier`, `MxDiscProgress`, `MxBadge`, `MxPodium`, `MxRankRow`, `MxSplitBar`, `MxBarList` | o ícone de cada badge vem da aplicação (a biblioteca não conhece códigos de badge); badge bloqueado continua visível, tracejado, com o caminho até o primeiro nível |
| Música | `MxItemCard`, `MxCrate`, `MxTrackList`, `MxReviewCard`, `MxGroupReviewCard`, `MxLikeButton`, `MxStreamingLinks`, `MxTimeAgo`, `MxDescriptionList` | cartão inteiro clicável por **um** link (o do título), ações por cima; texto longo recolhe com "Ler mais"; o número do cartão é de **ouvintes** (`listeners`: pessoas distintas no ListenBrainz), não de execuções, e com `listenersSource` diz a fonte. A `MxCrate` é a pilha de discos (a "caixa de discos" sem caixa: o caixote embaixo foi tirado a pedido do produto): o da frente inteiro e, atrás dele, a borda de cima de cada um, menores e mais escuros conforme a distância, com uma sombra no chão. O mouse folheia pelo **deslocamento vertical** (a cada 26 px para cima, um disco; para baixo, os anteriores voltam), não pela borda debaixo do ponteiro: a pilha se mexe enquanto o mouse anda, e por borda ela fugia do ponteiro e não voltava. Os que ficaram para trás descem e somem. O clique puxa o disco da frente, que sobe um pouco, com o painel ao lado (embaixo, em largura estreita) preenchido pela aplicação no slot `pulled`; clicar de novo devolve. É um `listbox` com `aria-activedescendant` (setas, PageUp/PageDown, Home/End, Enter puxa, Esc devolve); no toque, deslizar para o lado folheia e tocar puxa. Só vão para o DOM os 2 últimos que saíram e `depth` discos atrás da frente (9 por padrão). Com `open`, o painel fica sempre aberto e mostra o disco da frente, trocando enquanto se folheia (sem puxar nem devolver: o clique e o Enter não fazem nada, e somem os botões de puxar e de devolver); é o jeito da pilha da biblioteca. Com `compact`, é só a pilha, com discos de até 112 px, sem botões nem painel (a dica fica só para leitor de tela): cabe num cartão, e quem usa mostra o disco puxado (`v-model:pulled`) onde quiser, como num diálogo. A curtida é um coração com `aria-pressed` (rosa do `secondary` quando curtido): não existe "não gostei" nem comentário em avaliação alheia. O `MxReviewCard` mostra o selo da review da galera (`group`) e um cadeado quando a avaliação não é pública (`visibility`: só a galera ou só o autor). O `MxGroupReviewCard` junta a parte de cada membro num balão (nota, texto, coração), com a média da galera e o progresso ("3 de 5 já deram a nota"), e avisa quando ninguém avaliou ainda |
| Layout | `MxAppShell`, `MxTopBar`, `MxTabBar`, `MxUserMenu`, `MxFooter`, `MxSection`, `MxRail`, `MxGrid`, `MxPagedGrid`, `MxRotator`, `MxPageHero`, `MxStoryCard`, `MxSegmented`, `MxSearchField`, `MxProgressBar` | barra de abas flutuante no celular que encolhe ao rolar para baixo (iOS); carrossel com rolagem por teclado e setas no desktop (a `MxSection` que tem um `MxRail` direto reserva o canto das setas, ao lado do "Ver tudo"); segmentado é `radiogroup` com indicador em mola; o menu do usuário cabe na tela (`min(320px, 100vw - 24px)`, coluna `minmax(0, 1fr)`) e rola por dentro quando a altura não dá. O `MxPagedGrid` é a lista longa sem rolagem infinita: `rows` fileiras (2), colunas pela largura (`minItemWidth`, via `ResizeObserver`), páginas lado a lado com `scroll-snap` (desliza no toque e no trackpad) e números de página com reticências, setas e `aria-current`; mudou a largura, continua no mesmo primeiro item; trocou a lista (filtro), volta para a página 1. O `MxRotator` mostra um item por vez numa caixa só (carrossel WAI-ARIA, troca em fade a cada `interval`, 10 s por padrão): pausa com o ponteiro em cima, com foco dentro, pelo botão, fora da tela e com a aba escondida; com movimento reduzido nasce pausado; os itens fora de cena ficam `inert` e os pontos levam direto a cada um |
| Feedback | `MxToastHost` + `toast`, `MxDialog`, `MxConfirmDialog`, `MxSkeleton`, `MxLoader`, `MxEmptyState`, `MxErrorState`, `MxLoadMore` | erro não some sozinho e vai para `role="alert"`; o resto para `role="status"`; diálogo vira folha inferior no celular; falha de confirmação aparece **dentro** do diálogo |
| Formulário | `MxTextField`, `MxTextarea`, `MxPasswordField`, `MxStepper`, `MxBalloonPicker` | a senha é sempre do usuário: o campo mostra as regras (vindas da aplicação, iguais às da API) e um medidor de força; nunca sugere nem gera senha. O `MxStepper` é um conjunto de **abas** (WAI-ARIA: setas, Home/End) com um painel por etapa em slot nomeado pela `key`; etapa adiante de `reachable` fica `aria-disabled`, a já feita ganha check, a troca é anunciada ("Etapa 2 de 4: …") e, quando o avanço vem de um botão do painel, o foco vai para o painel novo (o botão sumiu). O `MxBalloonPicker` é um grupo de botões `aria-pressed` em forma de balão, com até 3 capas dentro; cor (duotone) e tamanho saem do hash do valor, então cada estilo tem sempre o mesmo balão; com `max`, os outros ficam `aria-disabled` e o contador é `aria-live`; capa que não carrega sai do balão (nada de quadrado vazio). No celular, só a etapa ativa mostra o nome, sem cortar |
| Compartilhar e anúncios | `MxShareSheet`, `MxQrCode`, `MxConsentBanner`, `MxAdFrame` | Instagram usa Web Share API (ou copia o link e explica); anúncio tem altura reservada (sem CLS) e rótulo "Publicidade" |

---

## 🧪 `data-testid` e testes de componente

Todo componente tem `data-testid` para o front (e os testes daqui) acharem cada peça sem depender de
classe, texto traduzido ou estrutura. O `check:testids` (CI e `prepublishOnly`) lê o template de cada
`.vue` com o compilador do Vue e recusa o que sair do padrão.

| Onde | Padrão | Exemplo |
|---|---|---|
| Raiz | `mx-<nome em kebab, sem o Mx>` | `MxRatingInput` → `mx-rating-input` |
| Parte | `<raiz>-<parte>` | `mx-rating-input-zero`, `mx-dialog-close` |
| Item com chave estável | `<raiz>-<parte>-<chave>` (`:data-testid` com template literal) | `mx-segmented-option-week`, `mx-stepper-tab-profile`, `mx-tab-bar-item-charts` |

- **Toda parte interativa tem id**: `button`, `a`, campo, `MxLink`/`MxButton`/`MxIconButton` dentro de
  outro componente, `<component :is>` que pode virar link, elemento com `@click` ou `role` de controle.
- **O id de quem usa ganha.** O atributo que chega de fora entra por último (fallthrough do Vue), então
  `<MxButton data-testid="page-login-submit">` troca o `mx-button` daquele botão. Componente cuja raiz
  é `VMenu` ou `VTooltip` (`MxIconButton`, `MxImageCredit`, `MxUserMenu`) usa `inheritAttrs: false` e
  repassa `$attrs` ao gatilho, com o `data-testid` próprio **antes** do `v-bind` (a ordem decide quem
  ganha). Sem isso, classe e id iam parar no conteúdo teleportado do menu, que nem existe fechado.
- **Diálogos:** o `data-testid` do `MxDialog` (e de quem o usa) fica no `.v-overlay`, que só existe
  aberto e mora no `body`; dentro dele, `mx-dialog-title`, `mx-dialog-body`, `mx-dialog-close`.

**Testes** (`tests/`, fora do `src`: não entram no pacote, no `sync:icons` nem no `check:locales`):

| Arquivo | O que garante |
|---|---|
| `components/contract.test.ts` | cada `.vue` de `src/components` e `src/feedback`, montado sozinho com a fixture de `tests/fixtures.ts`: renderiza o próprio id, repassa o id recebido para **um** elemento e não solta aviso nenhum do Vue ou do Vuetify (prop obrigatória faltando, atributo que não chega à raiz). Componente novo sem fixture falha aqui |
| `components/actions`, `forms`, `feedback`, `music`, `layout` | comportamento dos interativos pelos ids: teclado do `MxRatingInput`, `MxSegmented` e `MxStepper`; limite do `MxBalloonPicker`; troca automática, pausa, pontos e movimento reduzido do `MxRotator`; páginas do `MxPagedGrid`; folhear subindo e voltar descendo, puxar e devolver da `MxCrate` (mouse, teclado e toque); avisos do `MxToastHost`; diálogo de confirmação; menu do usuário; cópia de link do `MxShareSheet`; blobs determinísticos pela semente |

- Ambiente: Vitest com dois projetos (`unit` em Node, `components` em jsdom), `@vue/test-utils` e o
  Vuetify inteiro registrado como no Storybook, em pt-BR. `tests/setup.ts` supre o que o jsdom não tem
  (`ResizeObserver`, `matchMedia`, `visualViewport`, `scrollTo`); `tests/media.ts` liga
  `prefers-reduced-motion` por teste; `tests/console.ts` junta avisos para o contrato.
- **jsdom 29**, não 30: o 30 pede Node 22.22+, e a máquina de desenvolvimento roda 22.14.
- O `@vue/test-utils` troca `Transition` e `TransitionGroup` por versões instantâneas: o teste vê a
  entrada e a saída na hora.
- Montou e já vai clicar? Espere `flushPromises()` antes: o `MxRotator` agenda a troca no `onMounted`
  e o watcher só assume no primeiro ciclo (nenhuma pessoa clica antes disso, o teste sim).

---

## 🚨 Armadilhas já pagas

⚠️ **Storybook 10.6 com Vite 8** (herdado da dotlog-ui): o `@storybook/vue3-vite` não injeta o plugin
do Vue (o `main.ts` injeta à mão) e o `vite-plugin-vuetify` 2.1.3 quebra no `configResolved` (o
`preview.ts` registra todo o Vuetify).

⚠️ **Sem `vuetify/styles` completo, o `base.css` repõe as utilitárias que os componentes do Vuetify
emitem sozinhos:** `rounded-lg`, `rounded-xl` e `rounded-pill` (dos `defaults` de `vuetifyOptions`) e
`elevation-1` (o polegar do `VSlider`/`VRangeSlider`), com os valores do Vuetify. No Vuetify 4 elas
moram na camada `vuetify-utilities`; aqui ficam fora de camada e sem `!important`, então ganham do
CSS dos componentes do Vuetify (como antes) e perdem para o CSS com escopo dos `Mx*`, mais específico
(como antes). Componente novo do Vuetify com `rounded`, `elevation` ou `border` pede conferir esta
lista.

⚠️ **Ícones MDI não vêm do `@mdi/font` nem do `@mdi/js` em tempo de build.** O nome continua
`mdi-album` no código; `npm run sync:icons` varre `src` (sem stories e mocks), pega o caminho SVG de
cada nome no `@mdi/js` e grava só os usados em `src/icons/icons.generated.ts`; os que só as stories
usam vão para `.storybook/story-icons.generated.ts`. O `MxSvgIcon` (em `icons/iconSet.ts`) desenha o
`<svg>` com a classe `v-icon__svg`, então tamanho e cor seguem o `VIcon`. Ícone fora do subconjunto
some sem erro na tela: por isso o `check:icons` roda no CI e no `prepublishOnly`.

⚠️ **Escreva só `backdrop-filter`, sem a linha `-webkit-backdrop-filter`.** O LightningCSS do Vite 8
junta as duas declarações e deixa **só a prefixada**, que o Chrome ignora: o vidro ficou sem
desfoque. Sem a linha manual, ele mesmo gera as duas. O plugin `assertStandardBackdrop` do
`vite.lib.config.ts` falha o build se algum CSS tiver a prefixada sem a padrão.

⚠️ **Raiz em fragmento trava `<Transition mode="out-in">`.** Componente cuja raiz é um `<slot>`
sozinho (ou vários irmãos) nunca termina a saída no Vue 3.5, e a tela fica em branco até recarregar.
O painel do `MxStepper` é um `div` com `key`; páginas que trocam por `Transition` precisam do mesmo
invólucro. Pelo mesmo motivo o `startViewTransition` daqui silencia `ready` e `finished`: transição
pulada rejeita as duas, e a rejeição solta virava erro no console.

⚠️ **Animação em laço de `transform` ganha de qualquer `transform` do mesmo elemento.** O balão
flutua no `.mx-balloon__float`, cresce no `__body` (com origem embaixo, para o barbante não
descolar) e sobe no hover com `translate`, propriedade separada que soma com a animação. O campo
usa `align-items: flex-start`: esticado pela linha do flex, o grid interno repartia a sobra e o
barbante se afastava do nó.

⚠️ **Ícones de marca não vêm do pacote `simple-icons` em tempo de build.** Importar dele levava o
arquivo inteiro (3.400 ícones) para o source map: 6 MB. `npm run sync:brand-icons` grava só os 21
usados em `brand-icons.generated.ts` (CC0). Amazon Music e Qobuz não existem no simple-icons e usam
ícone genérico.

⚠️ **Nada exportado pelo `index.ts` pode depender de `i18n/catalog.ts`.** A declaração dele importa
os JSON de `locales/`, que o `vue-tsc` não copia para o `dist`. Hoje nenhum `.d.ts` exportado chega
nele; mantenha assim.

⚠️ **Separador de linha (U+2028) escrito como ` ` dentro de regex** virou o caractere de verdade
ao ser gravado e quebrou o parser. Monte esses caracteres com `String.fromCharCode`.

⚠️ **Prop booleana ausente chega como `false`, não `undefined`.** O `MxLink` decidia "externo" com
`external ?? isExternalHref(...)`, e o `??` nunca chegava na detecção: link `https://` abria na mesma
aba e sem `rel="noopener noreferrer"`. Boolean que precisa do "não informado" leva `undefined` no
`withDefaults` (`MxLink.external`, `MxIconButton.pressed`). O teste de contrato achou esse.

⚠️ **Ordem de `ref` em `v-for` não é garantida.** O `MxSegmented` usa ref por função com índice
para medir o indicador.

⚠️ **O id da story vem do nome do export**, não do `name`: `CascaDaAplicacao` vira
`layout-páginas--casca-da-aplicacao`. Para listar: `curl -s localhost:6010/index.json`.

---

## 📁 Estrutura

```bash
.github/workflows/      # ci.yml (PR e main) e publish.yml (tag v*)
.storybook/             # main.ts (plugin do Vue à mão), preview.ts (tema, língua, Vuetify inteiro)
scripts/                # check-contrast, check-locales, check-testids, sync-icons, sync-brand-icons
tests/                  # setup do jsdom, fixtures de cada componente e os testes de componente
vite.lib.config.ts      # build do pacote (um arquivo por módulo, CSS por componente)
src/
├─ icons/               # iconSet.ts (MxSvgIcon, mixtapeIcons) e o subconjunto gerado do @mdi/js
├─ theme/               # palette.json (fonte única), tokens.ts, vuetify.ts, useTheme.ts (3 estados)
├─ i18n/                # catálogo pt-BR/en/es, useMixtapeText, createMixtapeLocale, línguas
├─ motion/              # v-reveal, v-tilt, useCountUp, useInView, useScrollState, View Transitions
├─ format/              # números, durações, datas parciais do MusicBrainz, iniciais, duotone por hash
├─ links/               # MIXTAPE_LINK_KEY: a aplicação injeta o RouterLink
├─ gamification/        # discos de nível e metais
├─ feedback/            # toast (estado em módulo) e host
├─ styles/base.css      # keyframes, utilitários de revelar/inclinar, vidro, tipografia display
├─ components/          # Mx*.vue
├─ stories/             # stories por grupo, nos dois temas pela barra do Storybook
└─ mocks/               # dados fictícios das stories (capas geradas em SVG). Nada vai para o pacote
```

## ✅ Invariantes ao alterar

- Componente não escreve hex: usa token (`--mx-*`). Exceções: bandeiras e o QR (preto no branco).
- Código e nomes em inglês, sem comentário no código; o que explica decisão mora aqui.
- Texto de tela não nasce no componente: vai para os três JSON e sai por `useMixtapeText`.
- Mexeu na paleta, rode `npm run check:contrast`; mexeu em tradução, `npm run check:locales`.
- Toda animação tem contrapartida em `prefers-reduced-motion`; animação de entrada ou em laço anima só `transform` e `opacity`.
- `backdrop-filter` só em superfície flutuante (ver Desempenho).
- Usou um `mdi-*` novo, rode `npm run sync:icons` e versione o arquivo gerado.
- Componente novo nasce com story, vista nos dois temas e nas três línguas, com `data-testid` na raiz
  e nas partes interativas (`npm run check:testids`) e com fixture em `tests/fixtures.ts`; se tem
  comportamento (teclado, limite, tempo), ganha teste em `tests/components/`.
- Story usa dado de `src/mocks/` (fictício e plausível), nunca dado real nem Lorem ipsum.
- Export novo entra em `src/index.ts`; o que não está lá não é contrato. Mudou API pública, sobe a
  versão pela regra acima.
