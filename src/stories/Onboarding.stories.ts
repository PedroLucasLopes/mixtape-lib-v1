import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxBalloonPicker from '../components/MxBalloonPicker.vue';
import MxButton from '../components/MxButton.vue';
import MxStepper from '../components/MxStepper.vue';
import MxTextField from '../components/MxTextField.vue';
import { coverArt } from '../mocks';

const meta = { title: 'Formulário/Cadastro em etapas' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const genres = [
  { value: 'mpb', label: 'mpb', images: [coverArt('violet', 'circle'), coverArt('pink', 'blob'), coverArt('lime', 'grid')] },
  { value: 'samba', label: 'samba', images: [coverArt('orange', 'stripes'), coverArt('forest', 'circle'), coverArt('navy', 'blob')] },
  { value: 'rock', label: 'rock', images: [coverArt('burgundy', 'grid'), coverArt('blue', 'circle'), coverArt('red', 'stripes')] },
  { value: 'hip hop', label: 'hip hop', images: [coverArt('blush', 'blob'), coverArt('violet', 'stripes')] },
  { value: 'jazz', label: 'jazz', images: [coverArt('navy', 'circle'), coverArt('orange', 'grid'), coverArt('pink', 'circle')] },
  { value: 'electronic', label: 'electronic', images: [coverArt('lime', 'blob'), coverArt('blue', 'grid'), coverArt('forest', 'stripes')] },
  { value: 'bossa nova', label: 'bossa nova', images: [coverArt('forest', 'blob')] },
  { value: 'k-pop', label: 'k-pop', images: [coverArt('pink', 'stripes'), coverArt('red', 'circle'), coverArt('violet', 'grid')] },
];

export const Etapas: Story = {
  render: () => ({
    components: { MxStepper, MxTextField, MxButton },
    setup: () => {
      const step = ref(0);
      const reachable = ref(0);
      const name = ref('');
      const advance = () => {
        step.value += 1;
        reachable.value = Math.max(reachable.value, step.value);
      };
      const steps = [
        { key: 'account', label: 'Conta', icon: 'mdi-account-outline' },
        { key: 'about', label: 'Sobre você', icon: 'mdi-cake-variant-outline' },
        { key: 'taste', label: 'Preferências', icon: 'mdi-music-note' },
        { key: 'done', label: 'Pronto', icon: 'mdi-flag-checkered' },
      ];
      return { step, reachable, name, steps, advance };
    },
    template: `
      <div style="max-width:560px">
        <MxStepper v-model="step" :steps="steps" :reachable="reachable" label="Etapas do cadastro">
          <template #account>
            <div style="display:grid;gap:16px">
              <MxTextField v-model="name" label="Nome de usuário" prefix="@" />
              <MxButton label="Continuar" icon="mdi-arrow-right" @click="advance" />
            </div>
          </template>
          <template #about>
            <div style="display:grid;gap:16px">
              <p style="margin:0">Data de nascimento e nome completo.</p>
              <MxButton label="Continuar" icon="mdi-arrow-right" @click="advance" />
            </div>
          </template>
          <template #taste>
            <div style="display:grid;gap:16px">
              <p style="margin:0">Os balões de estilos ficam aqui.</p>
              <MxButton label="Continuar" icon="mdi-arrow-right" @click="advance" />
            </div>
          </template>
          <template #done>
            <p style="margin:0">Tudo pronto! As etapas anteriores podem ser revistas pelas abas.</p>
          </template>
        </MxStepper>
      </div>
    `,
  }),
};

export const BaloesDeEstilos: Story = {
  name: 'Balões de estilos',
  render: () => ({
    components: { MxBalloonPicker },
    setup: () => ({ genres, picked: ref<string[]>(['mpb']) }),
    template: `<MxBalloonPicker v-model="picked" :options="genres" :max="5" label="Estilos que você curte" />`,
  }),
};

export const BaloesCarregando: Story = {
  name: 'Balões carregando',
  render: () => ({
    components: { MxBalloonPicker },
    setup: () => ({ picked: ref<string[]>([]) }),
    template: `<MxBalloonPicker v-model="picked" :options="[]" loading :skeleton-count="8" label="Estilos que você curte" />`,
  }),
};
