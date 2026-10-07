import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { typography } from '../theme/tokens';

const meta = { title: 'Fundação/Tipografia' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Escala: Story = {
  render: () => ({
    setup: () => ({ sizes: typography.size }),
    template: `
      <div style="display:grid;gap:28px">
        <p class="mx-overline" style="margin:0;color:var(--mx-link)">Bricolage Grotesque · display · peso 800 · largura 78–88%</p>
        <p class="mx-display" :style="{ fontSize: sizes.giant, margin: 0 }">Mixtape</p>
        <p class="mx-display" :style="{ fontSize: sizes.displayXl, margin: 0 }">Neon na Garagem</p>
        <p class="mx-display" :style="{ fontSize: sizes.displayL, margin: 0 }">Os mais ouvidos do mês</p>
        <h1 class="mx-display" :style="{ fontSize: sizes.h1, margin: 0 }">Título de página (h1)</h1>
        <h2 class="mx-display" :style="{ fontSize: sizes.h2, margin: 0 }">Título de seção (h2)</h2>
        <p class="mx-overline" style="margin:16px 0 0;color:var(--mx-link)">Figtree · texto · 400–900</p>
        <p style="font-size:1.25rem;max-width:62ch;line-height:1.55;margin:0">
          Avalie álbuns e músicas de 0 a 5 discos, escreva resenhas, monte playlists e suba no ranking com os amigos.
          O texto corrido usa Figtree, geométrica e amigável como a do Spotify Wrapped.
        </p>
        <p class="mx-tabular" style="font-size:2rem;font-weight:800;margin:0">1.284.000 ouvintes · 4,5 · 6:23</p>
      </div>
    `,
  }),
};
