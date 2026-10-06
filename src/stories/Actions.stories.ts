import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { BRANDS } from '../components/brands';
import MxBrandIcon from '../components/MxBrandIcon.vue';
import MxButton from '../components/MxButton.vue';
import MxChip from '../components/MxChip.vue';
import MxIconButton from '../components/MxIconButton.vue';
import MxStreamingLinks from '../components/MxStreamingLinks.vue';
import { mockStreamingLinks } from '../mocks';

const meta = {
  title: 'Ações/Botões e chips',
  component: MxButton,
  tags: ['autodocs'],
  args: { label: 'Avaliar este álbum', icon: 'mdi-album', variant: 'cta', size: 'md', loading: false, disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['cta', 'primary', 'tonal', 'glass', 'ghost', 'outline', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof MxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Botao: Story = { name: 'Botão' };

export const Variantes: Story = {
  render: () => ({
    components: { MxButton },
    setup: () => {
      const loading = ref(false);
      return { loading, run: () => { loading.value = true; setTimeout(() => (loading.value = false), 1600); } };
    },
    template: `
      <div style="display:grid;gap:20px">
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <MxButton label="CTA" icon="mdi-album" />
          <MxButton variant="primary" label="Primário" />
          <MxButton variant="tonal" label="Tonal" icon="mdi-playlist-plus" />
          <MxButton variant="glass" label="Vidro" icon="mdi-share-variant" />
          <MxButton variant="ghost" label="Fantasma" />
          <MxButton variant="outline" label="Contorno" />
          <MxButton variant="danger" label="Excluir" icon="mdi-delete" />
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <MxButton size="sm" label="Pequeno" />
          <MxButton size="md" label="Médio" />
          <MxButton size="lg" label="Grande" append-icon="mdi-arrow-right" />
          <MxButton label="Salvando…" :loading="loading" @click="run" />
          <MxButton label="Desabilitado" disabled />
          <MxButton href="#" variant="glass" label="Como link" icon="mdi-link" />
        </div>
      </div>
    `,
  }),
};

export const BotoesDeIcone: Story = {
  name: 'Botões de ícone',
  render: () => ({
    components: { MxIconButton },
    setup: () => ({ pressed: ref(false) }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <MxIconButton icon="mdi-share-variant" label="Compartilhar" />
        <MxIconButton icon="mdi-playlist-plus" label="Adicionar à playlist" variant="tonal" />
        <MxIconButton icon="mdi-plus" label="Avaliar" variant="cta" size="lg" />
        <MxIconButton icon="mdi-dots-horizontal" label="Mais ações" variant="ghost" />
        <MxIconButton icon="mdi-bookmark-outline" label="Salvar" :pressed="pressed" @click="pressed = !pressed" />
      </div>
    `,
  }),
};

export const Chips: Story = {
  render: () => ({
    components: { MxChip },
    setup: () => {
      const genres = ['indie rock', 'mpb', 'shoegaze', 'funk', 'jazz', 'samba'];
      const selected = ref<string[]>(['mpb']);
      const toggle = (genre: string) => {
        selected.value = selected.value.includes(genre) ? selected.value.filter((item) => item !== genre) : [...selected.value, genre];
      };
      return { genres, selected, toggle };
    },
    template: `
      <div style="display:grid;gap:18px">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <MxChip v-for="genre in genres" :key="genre" :label="genre" selectable :selected="selected.includes(genre)" @click="toggle(genre)" />
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <MxChip label="Contorno" />
          <MxChip label="Preenchido" variant="filled" icon="mdi-music" />
          <MxChip label="Vidro" variant="glass" />
          <MxChip label="Duotone lima" variant="duotone" duotone="lime" />
          <MxChip label="Duotone violeta" variant="duotone" duotone="violet" size="lg" />
          <MxChip label="Removível" variant="filled" removable />
          <MxChip label="Link" href="#" icon="mdi-link" />
        </div>
      </div>
    `,
  }),
};

export const IconesDeMarca: Story = {
  name: 'Ícones de marca e streaming',
  render: () => ({
    components: { MxBrandIcon, MxStreamingLinks },
    setup: () => ({ names: Object.keys(BRANDS), links: mockStreamingLinks }),
    template: `
      <div style="display:grid;gap:24px">
        <div style="display:flex;flex-wrap:wrap;gap:16px">
          <span v-for="name in names" :key="name" style="display:grid;justify-items:center;gap:6px;width:92px;font-size:.75rem;font-weight:700">
            <MxBrandIcon :name="name" :size="28" colored />{{ name }}
          </span>
        </div>
        <MxStreamingLinks :links="links" />
        <MxStreamingLinks :links="links" compact />
      </div>
    `,
  }),
};
