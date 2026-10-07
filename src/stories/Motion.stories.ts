import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxButton from '../components/MxButton.vue';
import MxCover from '../components/MxCover.vue';
import MxStat from '../components/MxStat.vue';
import { mockAlbums } from '../mocks';
import { vReveal } from '../motion/vReveal';
import { vTilt } from '../motion/vTilt';

const meta = { title: 'Fundação/Movimento' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RevelarAoRolar: Story = {
  name: 'Revelar ao rolar',
  render: () => ({
    directives: { reveal: vReveal },
    setup: () => ({ variants: ['up', 'down', 'left', 'right', 'scale', 'blur', 'pop', 'tilt'] }),
    template: `
      <div>
        <p style="margin:0 0 24px;font-weight:700">Role a página: cada bloco entra quando aparece (e aparece pronto com movimento reduzido).</p>
        <div style="height:60vh;display:grid;place-items:center;border:2px dashed var(--mx-outline);border-radius:26px">↓</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-top:24px">
          <div v-for="(variant, index) in variants" :key="variant" v-reveal="{ variant, delay: index * 80 }"
            style="padding:28px;border-radius:26px;background:var(--mx-cta);color:var(--mx-on-cta);font-weight:900;text-align:center">
            {{ variant }}
          </div>
        </div>
      </div>
    `,
  }),
};

export const InclinarComOPonteiro: Story = {
  name: 'Inclinar com o ponteiro',
  render: () => ({
    components: { MxCover },
    directives: { tilt: vTilt },
    setup: () => ({ albums: mockAlbums.slice(0, 4) }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px">
        <div v-for="album in albums" :key="album.id" v-tilt="{ max: 10, glare: true }" style="border-radius:18px">
          <MxCover :src="album.cover" :title="album.title" :seed="album.id" />
        </div>
      </div>
    `,
  }),
};

export const ContagemEMolas: Story = {
  name: 'Contagem e molas',
  render: () => ({
    components: { MxStat, MxButton },
    setup: () => {
      const value = ref(1284);
      return { value, bump: () => (value.value += Math.round(Math.random() * 5000)) };
    },
    template: `
      <div style="display:grid;gap:24px;justify-items:start">
        <MxStat :value="value" label="Ouvintes" size="xl" duotone="lime" />
        <MxButton label="Somar ouvintes" icon="mdi-plus" @click="bump" />
        <p style="margin:0;color:var(--mx-on-surface-muted)">Os botões usam mola com leve overshoot (CSS linear()) no hover e no clique.</p>
      </div>
    `,
  }),
};
