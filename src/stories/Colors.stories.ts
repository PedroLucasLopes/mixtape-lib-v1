import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MxStoryCard from '../components/MxStoryCard.vue';
import { brand, darkColors, DUOTONE_NAMES, duotones, lightColors, metals, type ThemeColors } from '../theme/tokens';

const luminance = (hex: string) => {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (foreground: string, background: string) => {
  const [high, low] = [luminance(foreground), luminance(background)].sort((a, b) => b - a) as [number, number];
  return ((high + 0.05) / (low + 0.05)).toFixed(2);
};

const pairs = (theme: ThemeColors) => [
  { label: 'Texto / superfície', fg: theme.onSurface, bg: theme.surface, min: 4.5 },
  { label: 'Texto secundário / superfície', fg: theme.onSurfaceMuted, bg: theme.surface, min: 4.5 },
  { label: 'Link / fundo', fg: theme.link, bg: theme.background, min: 4.5 },
  { label: 'CTA', fg: theme.onCta, bg: theme.cta, min: 4.5 },
  { label: 'Primária', fg: theme.onPrimary, bg: theme.primary, min: 4.5 },
  { label: 'Secundária', fg: theme.onSecondary, bg: theme.secondary, min: 4.5 },
  { label: 'Erro', fg: theme.onError, bg: theme.error, min: 4.5 },
].map((pair) => ({ ...pair, ratio: ratio(pair.fg, pair.bg) }));

const meta = {
  title: 'Fundação/Cores',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paleta: Story = {
  render: () => ({
    components: { MxStoryCard },
    setup: () => ({
      brand,
      duotoneNames: DUOTONE_NAMES,
      duotones,
      metals,
      themes: [
        { name: 'Escuro', pairs: pairs(darkColors) },
        { name: 'Claro', pairs: pairs(lightColors) },
      ],
    }),
    template: `
      <div style="display:grid;gap:40px">
        <section>
          <h2 class="mx-display" style="font-size:2.5rem;margin:0 0 16px">Marca (Wrapped 2022)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:12px">
            <div v-for="(value, name) in brand" :key="name" style="display:grid;gap:6px;width:120px">
              <span :style="{ background: value, height: '84px', borderRadius: '18px', border: '1px solid var(--mx-outline)' }" />
              <strong>{{ name }}</strong><code>{{ value }}</code>
            </div>
          </div>
        </section>
        <section>
          <h2 class="mx-display" style="font-size:2.5rem;margin:0 0 16px">Duotones (Wrapped 2018)</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
            <MxStoryCard v-for="(name, index) in duotoneNames" :key="name" :duotone="name" :label="name" :value="String(index + 1)"
              :sentence="'Tinta ' + duotones[name].ink + ' sobre ' + duotones[name].background" />
          </div>
        </section>
        <section>
          <h2 class="mx-display" style="font-size:2.5rem;margin:0 0 16px">Metais dos discos e badges</h2>
          <div style="display:flex;flex-wrap:wrap;gap:12px">
            <div v-for="(stops, name) in metals" :key="name" style="display:grid;gap:6px;width:140px">
              <span :style="{ background: 'linear-gradient(135deg,' + stops[2] + ',' + stops[1] + ',' + stops[0] + ')', height: '84px', borderRadius: '50%', aspectRatio: '1' }" />
              <strong>{{ name }}</strong>
            </div>
          </div>
        </section>
        <section v-for="theme in themes" :key="theme.name">
          <h2 class="mx-display" style="font-size:2rem;margin:0 0 12px">Contraste — tema {{ theme.name }}</h2>
          <table style="border-collapse:collapse;width:100%;max-width:720px">
            <thead><tr><th style="text-align:left;padding:8px">Par</th><th style="text-align:left;padding:8px">Amostra</th><th style="padding:8px">Razão</th><th style="padding:8px">Mínimo</th></tr></thead>
            <tbody>
              <tr v-for="pair in theme.pairs" :key="pair.label" style="border-top:1px solid var(--mx-outline)">
                <td style="padding:8px">{{ pair.label }}</td>
                <td style="padding:8px"><span :style="{ background: pair.bg, color: pair.fg, padding: '6px 12px', borderRadius: '999px', fontWeight: 800 }">Aa Mixtape</span></td>
                <td style="padding:8px;text-align:center;font-weight:800">{{ pair.ratio }}:1</td>
                <td style="padding:8px;text-align:center">{{ pair.min }}:1</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `,
  }),
};
