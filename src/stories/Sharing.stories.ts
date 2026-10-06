import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxAdFrame from '../components/MxAdFrame.vue';
import MxButton from '../components/MxButton.vue';
import MxConsentBanner from '../components/MxConsentBanner.vue';
import MxQrCode from '../components/MxQrCode.vue';
import MxShareSheet from '../components/MxShareSheet.vue';
import { mockQrCode, mockSharePayload } from '../mocks';

const meta = { title: 'Compartilhar e anúncios/Componentes' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compartilhar: Story = {
  render: () => ({
    components: { MxShareSheet, MxButton },
    setup: () => ({ open: ref(false), payload: mockSharePayload, qr: { png: mockQrCode, svg: mockQrCode, alt: 'QR Code do perfil de @ana.souza', downloadName: 'mixtape-ana' } }),
    template: `
      <div>
        <MxButton variant="glass" icon="mdi-share-variant" label="Compartilhar avaliação" @click="open = true" />
        <MxShareSheet v-model="open" title="Compartilhar" :payload="payload" :qr="qr" />
      </div>
    `,
  }),
};

export const QrCode: Story = {
  name: 'QR Code',
  render: () => ({
    components: { MxQrCode },
    setup: () => ({ qr: mockQrCode }),
    template: `<MxQrCode :png="qr" :svg="qr" alt="QR Code do perfil" download-name="mixtape-ana" />`,
  }),
};

export const Consentimento: Story = {
  render: () => ({
    components: { MxConsentBanner },
    setup: () => ({ open: ref(true) }),
    template: `
      <MxConsentBanner :open="open" title="Cookies e anúncios"
        description="Usamos cookies essenciais para manter sua sessão e, com sua permissão, cookies de anúncios do Google AdSense."
        policy-to="#" @accept="open = false" @reject="open = false" />
    `,
  }),
};

export const EspacoDeAnuncio: Story = {
  name: 'Espaço de anúncio',
  render: () => ({
    components: { MxAdFrame },
    template: `
      <div style="display:grid;gap:24px;max-width:760px">
        <MxAdFrame variant="banner" />
        <div style="max-width:320px"><MxAdFrame variant="rectangle" /></div>
      </div>
    `,
  }),
};
