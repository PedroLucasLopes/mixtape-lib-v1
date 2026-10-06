import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import MxPasswordField from '../components/MxPasswordField.vue';
import MxRatingInput from '../components/MxRatingInput.vue';
import MxSearchField from '../components/MxSearchField.vue';
import MxSegmented from '../components/MxSegmented.vue';
import MxTextarea from '../components/MxTextarea.vue';
import MxTextField from '../components/MxTextField.vue';

const meta = { title: 'Formulário/Campos' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Busca: Story = {
  render: () => ({
    components: { MxSearchField },
    setup: () => {
      const query = ref('');
      const submitted = ref('');
      return { query, submitted };
    },
    template: `
      <div style="display:grid;gap:16px;max-width:640px">
        <MxSearchField v-model="query" @submit="submitted = $event" />
        <MxSearchField v-model="query" size="lg" :loading="query.length > 3" />
        <p style="margin:0">Enviado: <strong>{{ submitted || '—' }}</strong></p>
      </div>
    `,
  }),
};

export const NotaEmDiscos: Story = {
  name: 'Nota em discos',
  render: () => ({
    components: { MxRatingInput },
    setup: () => ({ value: ref<number | null>(null), filled: ref<number | null>(3.5) }),
    template: `
      <div style="display:grid;gap:32px">
        <MxRatingInput v-model="value" />
        <MxRatingInput v-model="filled" :size="34" />
        <MxRatingInput :model-value="4" disabled />
      </div>
    `,
  }),
};

export const Segmentado: Story = {
  render: () => ({
    components: { MxSegmented },
    setup: () => ({
      period: ref('month'),
      kind: ref('albums'),
      periods: [
        { value: 'week', label: 'Semana' },
        { value: 'month', label: 'Mês' },
        { value: 'year', label: 'Ano' },
        { value: 'all_time', label: 'Sempre' },
      ],
      kinds: [
        { value: 'albums', label: 'Álbuns', icon: 'mdi-album' },
        { value: 'tracks', label: 'Músicas', icon: 'mdi-music-note' },
        { value: 'artists', label: 'Artistas', icon: 'mdi-account-music' },
      ],
    }),
    template: `
      <div style="display:grid;gap:20px;justify-items:start">
        <MxSegmented v-model="period" :options="periods" label="Período" />
        <MxSegmented v-model="kind" :options="kinds" label="Tipo" size="sm" />
        <div style="width:100%;max-width:520px"><MxSegmented v-model="kind" :options="kinds" label="Tipo" block /></div>
      </div>
    `,
  }),
};

export const CadastroComSenha: Story = {
  name: 'Cadastro com senha própria',
  render: () => ({
    components: { MxTextField, MxPasswordField, MxTextarea },
    setup: () => {
      const email = ref('ana@example.com');
      const username = ref('ana.souza');
      const password = ref('');
      const bio = ref('');
      const rules = computed(() => [
        { key: 'length', label: 'Pelo menos 8 caracteres', passed: password.value.length >= 8 },
        { key: 'mix', label: 'Letras e números', passed: /\p{L}/u.test(password.value) && /\p{N}/u.test(password.value) },
        { key: 'personal', label: 'Sem seu e-mail ou usuário', passed: Boolean(password.value) && !password.value.toLowerCase().includes(username.value) },
      ]);
      return { email, username, password, bio, rules };
    },
    template: `
      <div style="display:grid;gap:16px;max-width:520px">
        <MxTextField v-model="email" label="E-mail" type="email" autocomplete="email" />
        <MxTextField v-model="username" label="Nome de usuário" prefix="@" hint="3 a 30 caracteres: letras, números, ponto e sublinhado" />
        <MxPasswordField v-model="password" label="Crie sua senha" autocomplete="new-password" :rules="rules" show-strength />
        <MxTextarea v-model="bio" label="Bio" :maxlength="500" placeholder="Do MPB ao shoegaze…" />
        <MxTextField label="Campo com erro" :error-messages="['Este nome de usuário já está em uso']" />
      </div>
    `,
  }),
};
