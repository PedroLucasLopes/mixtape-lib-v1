import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxAppShell from '../components/MxAppShell.vue';
import MxButton from '../components/MxButton.vue';
import MxCover from '../components/MxCover.vue';
import MxFooter from '../components/MxFooter.vue';
import MxIconButton from '../components/MxIconButton.vue';
import MxItemCard from '../components/MxItemCard.vue';
import MxPageHero from '../components/MxPageHero.vue';
import MxRail from '../components/MxRail.vue';
import MxRating from '../components/MxRating.vue';
import MxSearchField from '../components/MxSearchField.vue';
import MxSection from '../components/MxSection.vue';
import MxStat from '../components/MxStat.vue';
import MxStoryCard from '../components/MxStoryCard.vue';
import MxUserMenu from '../components/MxUserMenu.vue';
import { artistPhoto, coverArt, mockAlbums } from '../mocks';
import type { ThemeMode } from '../theme/useTheme';

const meta = { title: 'Layout/Páginas' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroDeAlbum: Story = {
  name: 'Herói de álbum',
  render: () => ({
    components: { MxPageHero, MxCover, MxButton, MxIconButton, MxRating, MxStat },
    setup: () => ({ cover: coverArt('violet', 'circle') }),
    template: `
      <MxPageHero title="Neon na Garagem" eyebrow="Álbum · 2019 · indie rock" duotone="lime">
        <template #media><MxCover :src="cover" title="Neon na Garagem" seed="a1" vinyl priority /></template>
        <template #subtitle><a href="#">Banda Lúmen</a></template>
        <template #story>
          Neon na Garagem saiu em 21 de maio de 2019 pela Selo Exemplo: 12 faixas, 53 minutos e 39 edições pelo mundo.
          No Mixtape, 142 pessoas já avaliaram, com média de 4,3 discos.
        </template>
        <template #stats>
          <MxStat :value="4.3" label="Média" format="rating" size="md" />
          <MxStat :value="142" label="Avaliações" size="md" />
          <MxStat :value="1284000" label="Escutas" format="compact" size="md" />
        </template>
        <template #actions>
          <MxButton variant="ink" label="Avaliar" icon="mdi-album" size="lg" />
          <MxIconButton variant="ink" icon="mdi-playlist-plus" label="Adicionar à playlist" size="lg" />
          <MxIconButton variant="ink" icon="mdi-share-variant" label="Compartilhar" size="lg" />
        </template>
      </MxPageHero>
    `,
  }),
};

export const HeroDeArtista: Story = {
  name: 'Herói de artista',
  render: () => ({
    components: { MxPageHero, MxCover },
    setup: () => ({ photo: artistPhoto('pink') }),
    template: `
      <MxPageHero title="Clara Sol" eyebrow="Artista em destaque" duotone="burgundy" layout="overlap" decoration="flower">
        <template #media><MxCover :src="photo" title="Clara Sol" seed="clara" radius="lg" /></template>
        <template #story>Você passou 84 horas com Clara Sol este ano, e o prazer é todo dela.</template>
      </MxPageHero>
    `,
  }),
};

export const CartoesDeHistoria: Story = {
  name: 'Cartões de história',
  render: () => ({
    components: { MxStoryCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px">
        <MxStoryCard label="Faixas" value="12" sentence="Do primeiro acorde ao último eco." duotone="pink" :tilt="-2" icon="mdi-music-note" />
        <MxStoryCard label="Duração" value="53 min" sentence="Cabe certinho num trajeto de ônibus." duotone="green" :tilt="1.5" icon="mdi-timer-outline" />
        <MxStoryCard label="Edições" value="39" sentence="Lançado em CD, vinil e digital." duotone="navy" :tilt="-1" icon="mdi-album" />
        <MxStoryCard label="Escutas" value="1,2 mi" sentence="Registradas no ListenBrainz." duotone="orange" :tilt="2" icon="mdi-headphones" />
      </div>
    `,
  }),
};

export const SecaoComCarrossel: Story = {
  name: 'Seção com carrossel',
  render: () => ({
    components: { MxSection, MxRail, MxItemCard },
    setup: () => ({ albums: mockAlbums }),
    template: `
      <MxSection title="Em alta no Mixtape" eyebrow="Esta semana" description="Os discos mais avaliados nos últimos 7 dias." more-to="#">
        <MxRail label="Em alta no Mixtape">
          <li v-for="album in albums" :key="album.id">
            <MxItemCard :title="album.title" :subtitle="album.artist" :meta="album.year" :cover="album.cover" :seed="album.id" to="#" :rating="album.rating" />
          </li>
        </MxRail>
      </MxSection>
    `,
  }),
};

export const CascaDaAplicacao: Story = {
  name: 'Casca da aplicação',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { MxAppShell, MxSearchField, MxUserMenu, MxButton, MxFooter, MxSection, MxRail, MxItemCard },
    setup: () => {
      const theme = ref<ThemeMode>('system');
      return {
        theme,
        albums: mockAlbums,
        tabs: [
          { key: 'home', label: 'Início', icon: 'mdi-home-outline', activeIcon: 'mdi-home', to: '#' },
          { key: 'search', label: 'Buscar', icon: 'mdi-magnify', to: '#' },
          { key: 'charts', label: 'Paradas', icon: 'mdi-chart-box-outline', activeIcon: 'mdi-chart-box', to: '#' },
          { key: 'profile', label: 'Perfil', icon: 'mdi-account-circle-outline', activeIcon: 'mdi-account-circle', to: '#' },
        ],
        menu: [
          { key: 'profile', label: 'Meu perfil', icon: 'mdi-account-circle-outline', to: '#' },
          { key: 'library', label: 'Minha biblioteca', icon: 'mdi-bookshelf', to: '#' },
          { key: 'settings', label: 'Configurações', icon: 'mdi-cog-outline', to: '#' },
        ],
        columns: [
          { title: 'Explorar', links: [{ label: 'Paradas', href: '#' }, { label: 'Rankings', href: '#' }, { label: 'Awards', href: '#' }] },
          { title: 'Mixtape', links: [{ label: 'Como funciona', href: '#' }, { label: 'Privacidade', href: '#' }] },
        ],
      };
    },
    template: `
      <MxAppShell nav-label="Navegação principal" tab-label="Navegação" :tab-items="tabs" active-tab="home">
        <template #brand><strong class="mx-display" style="font-size:1.6rem">mixtape</strong></template>
        <template #search><MxSearchField /></template>
        <template #actions>
          <MxUserMenu name="Ana Souza" username="ana.souza" tier="GOLD" tier-label="Disco de Ouro" :items="menu" :theme-mode="theme" @update:theme-mode="theme = $event" />
        </template>
        <template #fab><MxButton icon="mdi-plus" label="" aria-label="Avaliar" /></template>
        <MxSection title="Para você" more-to="#">
          <MxRail label="Para você">
            <li v-for="album in albums" :key="album.id">
              <MxItemCard :title="album.title" :subtitle="album.artist" :cover="album.cover" :seed="album.id" to="#" />
            </li>
          </MxRail>
        </MxSection>
        <div style="height:120vh" />
        <template #footer>
          <MxFooter :columns="columns" label="Rodapé">
            <template #brand><strong class="mx-display" style="font-size:2rem">mixtape</strong></template>
            Dados do catálogo: MusicBrainz (CC0) e Cover Art Archive.
          </MxFooter>
        </template>
      </MxAppShell>
    `,
  }),
};
