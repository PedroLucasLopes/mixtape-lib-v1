import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MxButton from '../components/MxButton.vue';
import MxConfirmDialog from '../components/MxConfirmDialog.vue';
import MxDialog from '../components/MxDialog.vue';
import MxEmptyState from '../components/MxEmptyState.vue';
import MxErrorState from '../components/MxErrorState.vue';
import MxLoader from '../components/MxLoader.vue';
import MxLoadMore from '../components/MxLoadMore.vue';
import MxRatingInput from '../components/MxRatingInput.vue';
import MxSkeleton from '../components/MxSkeleton.vue';
import MxTextarea from '../components/MxTextarea.vue';
import MxToastHost from '../feedback/MxToastHost.vue';
import { toast } from '../feedback/useToast';

const meta = { title: 'Feedback/Avisos, diálogos e carregamento' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Avisos: Story = {
  render: () => ({
    components: { MxButton, MxToastHost },
    setup: () => ({
      success: () => toast.success('Avaliação publicada!'),
      error: () => toast.error('Não deu para salvar agora. Tente de novo em instantes.'),
      undo: () => toast('Item removido da playlist', { action: { label: 'Desfazer', handler: () => toast.info('Item de volta!') } }),
    }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <MxButton label="Sucesso (some sozinho)" @click="success" />
        <MxButton variant="danger" label="Erro (fica até dispensar)" @click="error" />
        <MxButton variant="glass" label="Com desfazer" @click="undo" />
        <MxToastHost />
      </div>
    `,
  }),
};

export const DialogoDeAvaliacao: Story = {
  name: 'Diálogo de avaliação',
  render: () => ({
    components: { MxDialog, MxButton, MxRatingInput, MxTextarea },
    setup: () => ({ open: ref(false), rating: ref<number | null>(null), body: ref('') }),
    template: `
      <div>
        <MxButton label="Avaliar Neon na Garagem" icon="mdi-album" @click="open = true" />
        <MxDialog v-model="open" title="Avaliar Neon na Garagem" description="Banda Lúmen · 2019">
          <div style="display:grid;gap:20px">
            <MxRatingInput v-model="rating" />
            <MxTextarea v-model="body" label="Sua resenha (opcional)" :maxlength="5000" />
          </div>
          <template #actions>
            <MxButton variant="ghost" label="Cancelar" @click="open = false" />
            <MxButton label="Publicar" :disabled="rating === null" @click="open = false" />
          </template>
        </MxDialog>
      </div>
    `,
  }),
};

export const ConfirmacaoComErro: Story = {
  name: 'Confirmação com erro',
  render: () => ({
    components: { MxConfirmDialog, MxButton },
    setup: () => {
      const open = ref(false);
      const loading = ref(false);
      const error = ref<string | null>(null);
      const confirm = () => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          error.value = 'A avaliação já foi removida em outra aba.';
        }, 900);
      };
      return { open, loading, error, confirm };
    },
    template: `
      <div>
        <MxButton variant="danger" label="Excluir avaliação" @click="open = true; error = null" />
        <MxConfirmDialog v-model="open" title="Excluir avaliação?" message="A nota, o texto e os comentários somem para sempre."
          confirm-label="Excluir" destructive :loading="loading" :error="error" @confirm="confirm" />
      </div>
    `,
  }),
};

export const Carregamento: Story = {
  render: () => ({
    components: { MxSkeleton, MxLoader, MxLoadMore },
    setup: () => ({ loading: ref(false) }),
    template: `
      <div style="display:grid;gap:28px;max-width:560px">
        <div style="display:flex;gap:16px;align-items:center">
          <div style="width:96px"><MxSkeleton shape="square" /></div>
          <div style="flex:1"><MxSkeleton shape="text" :lines="3" /></div>
        </div>
        <MxLoader />
        <MxLoadMore :has-more="true" :loading="loading" :auto="false" @load="loading = true" />
        <MxLoadMore :has-more="false" />
      </div>
    `,
  }),
};

export const EstadosVazioEErro: Story = {
  name: 'Estados vazio e de erro',
  render: () => ({
    components: { MxEmptyState, MxErrorState, MxButton },
    template: `
      <div style="display:grid;gap:24px">
        <MxEmptyState title="Sua biblioteca está vazia" description="Busque um álbum que você ama e dê a primeira nota." icon="mdi-bookshelf">
          <MxButton label="Buscar discos" icon="mdi-magnify" />
        </MxEmptyState>
        <MxErrorState description="O catálogo está ocupado. Tente de novo em alguns segundos." />
      </div>
    `,
  }),
};
