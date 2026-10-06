import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxCommentItem from '../components/MxCommentItem.vue';
import MxCover from '../components/MxCover.vue';
import MxDescriptionList from '../components/MxDescriptionList.vue';
import MxGrid from '../components/MxGrid.vue';
import MxImageCredit from '../components/MxImageCredit.vue';
import MxItemCard from '../components/MxItemCard.vue';
import MxMosaic from '../components/MxMosaic.vue';
import MxRating from '../components/MxRating.vue';
import MxRatingHistogram from '../components/MxRatingHistogram.vue';
import MxReviewCard from '../components/MxReviewCard.vue';
import MxTrackList from '../components/MxTrackList.vue';
import { artistPhoto, coverArt, mockAlbums, mockDistribution, mockReviewBody, mockTracks, mockUsers } from '../mocks';

const meta = { title: 'Música/Conteúdo' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Capas: Story = {
  render: () => ({
    components: { MxCover, MxMosaic, MxImageCredit },
    setup: () => ({ album: mockAlbums[0], covers: mockAlbums.slice(0, 4).map((album) => album.cover ?? ''), photo: artistPhoto('blue') }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start">
        <div style="width:220px"><MxCover :src="album.cover" :title="album.title" :seed="album.id" vinyl /></div>
        <div style="width:220px"><MxCover :src="null" title="Fita Cassete" seed="a5" /></div>
        <div style="width:220px"><MxCover src="https://example.invalid/quebrada.jpg" title="Capa quebrada" seed="x" /></div>
        <div style="width:160px;position:relative"><MxCover :src="photo" title="Banda Lúmen" shape="circle" seed="artist" />
          <span style="position:absolute;right:6px;bottom:6px"><MxImageCredit author="Fotógrafa Exemplo" license="CC BY-SA 4.0" license-url="https://example.com/licenca" source-url="https://example.com/arquivo" /></span>
        </div>
        <div style="width:160px"><MxMosaic :covers="covers" seed="playlist-1" /></div>
        <div style="width:160px"><MxMosaic :covers="[]" seed="playlist-2" /></div>
      </div>
    `,
  }),
};

export const Cartoes: Story = {
  name: 'Cartões',
  render: () => ({
    components: { MxItemCard, MxGrid },
    setup: () => ({ albums: mockAlbums }),
    template: `
      <div style="display:grid;gap:40px">
        <MxGrid min="180px" label="Álbuns">
          <li v-for="(album, index) in albums" :key="album.id">
            <MxItemCard :title="album.title" :subtitle="album.artist" :meta="album.year + ' · ' + album.type" :cover="album.cover" :seed="album.id"
              to="#" :rating="album.rating" :listens="album.listens" :badge="index === 3 ? 'Em alta' : null" />
          </li>
        </MxGrid>
        <MxGrid min="200px" label="Parada">
          <li v-for="(album, index) in albums.slice(0, 4)" :key="album.id">
            <MxItemCard layout="chart" :position="index + 1" :title="album.title" :subtitle="album.artist" :cover="album.cover" :seed="album.id" to="#" :listens="album.listens" />
          </li>
        </MxGrid>
        <ul style="list-style:none;margin:0;padding:0;display:grid;gap:4px;max-width:560px">
          <li v-for="(album, index) in albums.slice(0, 4)" :key="album.id">
            <MxItemCard layout="row" :position="index + 1" :title="album.title" :subtitle="album.artist" :meta="album.year" :cover="album.cover" :seed="album.id" to="#" />
          </li>
        </ul>
        <MxGrid min="150px" label="Artistas">
          <li v-for="name in ['blue','pink','green']" :key="name">
            <MxItemCard kind="artist" title="Banda Lúmen" subtitle="Grupo · Brasil" :cover="null" :seed="name" to="#" :listens="1284000" />
          </li>
        </MxGrid>
      </div>
    `,
  }),
};

export const Notas: Story = {
  render: () => ({
    components: { MxRating, MxRatingHistogram },
    setup: () => ({ distribution: mockDistribution }),
    template: `
      <div style="display:grid;gap:28px;max-width:520px">
        <div style="display:grid;gap:10px">
          <MxRating :value="5" size="xl" show-value />
          <MxRating :value="3.5" size="lg" show-value />
          <MxRating :value="0.5" show-value />
          <MxRating :value="null" size="sm" show-value />
        </div>
        <MxRatingHistogram :distribution="distribution" :average="3.9" :highlight="4.5" />
      </div>
    `,
  }),
};

export const Faixas: Story = {
  render: () => ({
    components: { MxTrackList, MxDescriptionList },
    setup: () => ({
      tracks: mockTracks.map((track) => ({ ...track, to: '#' })),
      facts: [
        { term: 'Gravadora', value: 'Selo Exemplo' },
        { term: 'Catálogo', value: 'EX-0042', mono: true },
        { term: 'País', value: 'Brasil' },
        { term: 'Formato', value: 'CD · Digital' },
        { term: 'Código de barras', value: '7890000000000', mono: true },
        { term: 'Edições', value: 12 },
      ],
    }),
    template: `
      <div style="display:grid;gap:32px;max-width:720px">
        <MxTrackList :tracks="tracks" album-artist="Banda Lúmen" highlight-id="t3" label="Faixas" />
        <MxDescriptionList :items="facts" />
      </div>
    `,
  }),
};

export const Avaliacoes: Story = {
  name: 'Avaliações e comentários',
  render: () => ({
    components: { MxReviewCard, MxCommentItem },
    setup: () => {
      const reaction = ref<'LIKE' | 'DISLIKE' | null>(null);
      const likes = ref(41);
      const react = (next: 'LIKE' | 'DISLIKE' | null) => {
        if (reaction.value === 'LIKE') likes.value -= 1;
        if (next === 'LIKE') likes.value += 1;
        reaction.value = next;
      };
      return { reaction, likes, react, author: mockUsers[0], other: mockUsers[2], body: mockReviewBody, cover: coverArt('violet', 'circle') };
    },
    template: `
      <div style="display:grid;gap:20px;max-width:720px">
        <MxReviewCard :rating="4.5" :body="body" created-at="2026-10-05T18:20:00Z" :likes="likes" :dislikes="3" :comments="7"
          :reaction="reaction" can-react :author="{ ...author, to: '#' }" to="#" edited
          :item="{ id: 'a1', kind: 'album', title: 'Neon na Garagem', artist: 'Banda Lúmen', year: '2019', cover, to: '#' }" @react="react" />
        <MxReviewCard variant="compact" :rating="2" body="Esperava mais do refrão." created-at="2026-09-12T10:00:00Z" :likes="2" :dislikes="5" :comments="0"
          :author="other" :item="{ id: 't2', kind: 'track', title: 'Fios Desencapados', artist: 'Banda Lúmen', cover }" />
        <MxReviewCard variant="item" :rating="5" created-at="2026-10-01T09:00:00Z" :likes="0" :dislikes="0" :comments="0" :author="author"
          :item="{ id: 'a1', kind: 'album', title: 'Neon na Garagem' }" />
        <ul style="list-style:none;margin:0;padding:0;display:grid;gap:12px">
          <MxCommentItem :author="other" body="Concordo demais com o lado B!" created-at="2026-10-05T19:00:00Z" :likes="4" :dislikes="0" can-react can-delete />
          <MxCommentItem :author="author" body="O interlúdio cresce depois da terceira audição." created-at="2026-10-05T19:30:00Z" :likes="1" :dislikes="1" />
        </ul>
      </div>
    `,
  }),
};
