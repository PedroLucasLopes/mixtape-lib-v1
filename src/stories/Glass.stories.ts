import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MxBlob from '../components/MxBlob.vue';
import MxBlobField from '../components/MxBlobField.vue';
import MxButton from '../components/MxButton.vue';
import MxGlass from '../components/MxGlass.vue';
import MxMarquee from '../components/MxMarquee.vue';
import MxStarburst from '../components/MxStarburst.vue';
import MxVinyl from '../components/MxVinyl.vue';
import { coverArt } from '../mocks';

const meta = { title: 'Fundação/Vidro, blobs e formas' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const VidroSobreBlobs: Story = {
  name: 'Vidro sobre blobs',
  render: () => ({
    components: { MxBlobField, MxGlass, MxButton },
    template: `
      <div style="position:relative;min-height:520px;border-radius:36px;overflow:hidden;display:grid;place-items:center;padding:24px">
        <MxBlobField :count="6" intensity="vivid" seed="story" />
        <div style="position:relative;display:grid;gap:16px;width:min(100%,520px)">
          <MxGlass variant="panel" blur>
            <h2 class="mx-display" style="font-size:2.25rem;margin:0 0 8px">Vidro líquido</h2>
            <p style="margin:0 0 16px;line-height:1.5">Painel translúcido com desfoque e brilho na borda, como os controles do iOS atual. O desfoque (blur) é para o que flutua sobre o conteúdo.</p>
            <MxButton label="Avaliar agora" icon="mdi-album" />
          </MxGlass>
          <MxGlass variant="pill" tint="pink"><span style="padding:0 12px;font-weight:800">Pílula com tinta rosa, sem desfoque</span></MxGlass>
          <MxGlass variant="card" strong interactive>Cartão forte e interativo (passe o mouse)</MxGlass>
        </div>
      </div>
    `,
  }),
};

export const Formas: Story = {
  render: () => ({
    components: { MxStarburst, MxBlob, MxVinyl },
    setup: () => ({ cover: coverArt('violet', 'circle') }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:center">
        <MxStarburst shape="star" :size="160" color="var(--mx-cta)" ink="var(--mx-on-cta)" spin><span style="font-size:2rem">4,5</span></MxStarburst>
        <MxStarburst shape="flower" :points="9" :size="160" color="#FF6FC3" ink="#2A0B3D"><span style="font-size:1.25rem">Novo!</span></MxStarburst>
        <MxStarburst shape="sun" :size="160" color="#19E266" ink="#06301A" outline><span>#1</span></MxStarburst>
        <MxBlob color="#7A2FF0" :size="160" />
        <MxVinyl :size="170" :image="cover" spinning />
        <MxVinyl :size="140" finish="gold" />
        <MxVinyl :size="140" finish="diamond" spinning />
      </div>
    `,
  }),
};

export const Letreiro: Story = {
  render: () => ({
    components: { MxMarquee },
    template: `
      <div style="display:grid;gap:24px;overflow:hidden;padding:24px 0">
        <MxMarquee :items="['indie rock', 'mpb', 'shoegaze', 'funk', 'jazz', 'samba', 'hip hop']" duotone="lime" label="Estilos em alta" />
        <MxMarquee :items="['Avalie', 'Resenhe', 'Compartilhe', 'Suba no ranking']" duotone="violet" size="xl" reverse :tilt="-2" />
      </div>
    `,
  }),
};
