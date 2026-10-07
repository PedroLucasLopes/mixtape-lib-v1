import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MxBadge from '../components/MxBadge.vue';
import MxBarList from '../components/MxBarList.vue';
import MxDiscProgress from '../components/MxDiscProgress.vue';
import MxDiscTier from '../components/MxDiscTier.vue';
import MxPodium from '../components/MxPodium.vue';
import MxRankRow from '../components/MxRankRow.vue';
import MxSplitBar from '../components/MxSplitBar.vue';
import MxStat from '../components/MxStat.vue';
import { mockBadges, mockRanking, mockUsers } from '../mocks';

const meta = { title: 'Gamificação/Discos, badges e rankings' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Discos: Story = {
  render: () => ({
    components: { MxDiscTier, MxDiscProgress },
    setup: () => ({ users: mockUsers }),
    template: `
      <div style="display:grid;gap:32px;max-width:640px">
        <div style="display:flex;flex-wrap:wrap;gap:24px">
          <MxDiscTier v-for="user in users" :key="user.username" :tier="user.tier" :label="user.tierLabel" :size="72" />
        </div>
        <MxDiscProgress tier="BRONZE" label="Disco de Bronze" :reviews="62" :next="{ tier: 'SILVER', label: 'Disco de Prata', minReviews: 100, remaining: 38 }" :progress="0.457" />
        <MxDiscProgress tier="DIAMOND" label="Disco de Diamante" :reviews="1204" :next="null" :progress="1" compact />
      </div>
    `,
  }),
};

export const Badges: Story = {
  render: () => ({
    components: { MxBadge },
    setup: () => ({ badges: mockBadges }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
        <MxBadge v-for="badge in badges" :key="badge.code" v-bind="badge" />
      </div>
    `,
  }),
};

export const Ranking: Story = {
  render: () => ({
    components: { MxPodium, MxRankRow, MxSplitBar },
    setup: () => ({
      ranking: mockRanking,
      podium: mockRanking.slice(0, 3).map((entry) => ({
        key: entry.username,
        position: entry.position,
        name: entry.name,
        caption: '@' + entry.username,
        tier: entry.tier,
        score: entry.total.toLocaleString('pt-BR') + ' pts',
        to: '#',
      })),
    }),
    template: `
      <div style="display:grid;gap:32px;max-width:760px">
        <MxPodium :entries="podium" label="Pódio" />
        <ol style="list-style:none;margin:0;padding:0;display:grid;gap:4px">
          <MxRankRow v-for="entry in ranking" :key="entry.username" v-bind="entry" :highlight="entry.username === 'brunolima'" to="#" />
        </ol>
        <MxSplitBar :segments="[{ label: 'Participação', value: 1100, color: 'var(--mx-primary)' }, { label: 'Notoriedade', value: 740, color: 'var(--mx-secondary)' }]" />
      </div>
    `,
  }),
};

export const Numeros: Story = {
  name: 'Números',
  render: () => ({
    components: { MxStat, MxBarList },
    template: `
      <div style="display:grid;gap:32px">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
          <MxStat :value="320" label="Avaliações" duotone="lime" />
          <MxStat :value="4.2" label="Nota média" format="rating" duotone="violet" />
          <MxStat :value="1284000" label="Ouvintes no mundo" format="compact" duotone="pink" />
          <MxStat :value="12" label="Faixas" hint="53 minutos de música" />
        </div>
        <div style="max-width:560px">
          <MxBarList numbered :items="[
            { key: '1', label: 'indie rock', value: 48 },
            { key: '2', label: 'mpb', value: 36 },
            { key: '3', label: 'shoegaze', value: 21 },
            { key: '4', label: 'jazz', value: 12 },
            { key: '5', label: 'samba', value: 9 }
          ]" label="Estilos mais avaliados" />
        </div>
      </div>
    `,
  }),
};
