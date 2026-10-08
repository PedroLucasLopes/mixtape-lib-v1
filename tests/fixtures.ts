import type { StepperStep } from '../src/components/MxStepper.vue';
import type { TabBarItem } from '../src/components/MxTabBar.vue';
import {
  coverArt,
  mockAlbums,
  mockBadges,
  mockDiscography,
  mockDistribution,
  mockGroupReviewEntries,
  mockQrCode,
  mockRanking,
  mockReviewBody,
  mockSharePayload,
  mockStreamingLinks,
  mockTracks,
  mockUsers,
} from '../src/mocks';

export interface Fixture {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
}

const album = mockAlbums[0]!;
const [ana] = mockUsers;

export const author = (user: (typeof mockUsers)[number]) => ({
  name: user.name,
  username: user.username,
  avatarUrl: user.avatarUrl,
  tier: user.tier,
  tierLabel: user.tierLabel,
  to: `/u/${user.username}`,
});

export const subject = {
  id: album.id,
  kind: 'album' as const,
  title: album.title,
  artist: album.artist,
  cover: album.cover,
  year: album.year,
  to: `/albums/${album.id}`,
};

export const groupEntries = mockGroupReviewEntries.map((entry) => ({
  id: entry.id,
  author: author(mockUsers[entry.user]!),
  rating: entry.rating,
  body: entry.body,
  createdAt: entry.createdAt,
  likes: entry.likes,
  canLike: true,
  to: `/avaliacoes/${entry.id}`,
}));

export const genres = [...new Set(mockAlbums.flatMap((item) => item.genres))].map((genre) => ({
  value: genre,
  label: genre,
  images: mockAlbums.filter((item) => item.genres.includes(genre) && item.cover).map((item) => item.cover!),
}));

export const ranges = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
];

export const steps: StepperStep[] = [
  { key: 'account', label: 'Conta' },
  { key: 'profile', label: 'Perfil' },
  { key: 'styles', label: 'Estilos' },
];

export const tabItems: TabBarItem[] = [
  { key: 'home', label: 'Início', icon: 'mdi-home', to: '/' },
  { key: 'search', label: 'Buscar', icon: 'mdi-magnify', to: '/buscar' },
  { key: 'charts', label: 'Paradas', icon: 'mdi-chart-bar', to: '/paradas' },
  { key: 'profile', label: 'Perfil', icon: 'mdi-account', to: `/u/${ana.username}` },
];

const badge = mockBadges[0]!;

export const FIXTURES: Record<string, Fixture> = {
  MxAdFrame: { props: { variant: 'banner' } },
  MxAppShell: {
    props: { navLabel: 'Navegação principal', tabLabel: 'Atalhos', tabItems, activeTab: 'home' },
    slots: { default: '<p>Conteúdo</p>', brand: '<span>Mixtape</span>' },
  },
  MxAvatar: { props: { name: ana.name, seed: ana.username, tier: ana.tier } },
  MxBadge: {
    props: {
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      tier: badge.tier,
      tierName: badge.tierName,
      value: badge.value,
      next: badge.next,
      progress: badge.progress,
      earnedAt: badge.earnedAt,
    },
  },
  MxBalloonPicker: { props: { modelValue: [genres[0]!.value], options: genres, label: 'Estilos', max: 3 } },
  MxBarList: {
    props: {
      items: mockAlbums.slice(0, 4).map((item) => ({ key: item.id, label: item.title, value: item.listeners, sublabel: item.artist, to: `/albums/${item.id}` })),
      label: 'Mais ouvidos',
    },
  },
  MxBlob: {},
  MxBlobField: {},
  MxBrandIcon: { props: { name: 'spotify', title: 'Spotify' } },
  MxButton: { props: { label: 'Avaliar' } },
  MxChip: { props: { label: 'indie rock' } },
  MxConfirmDialog: { props: { modelValue: true, title: 'Apagar avaliação?', message: 'Essa ação não pode ser desfeita.' } },
  MxConsentBanner: { props: { open: true, title: 'Cookies e anúncios', description: 'Os anúncios usam cookies.', policyTo: '/privacidade' } },
  MxCover: { props: { src: album.cover, title: album.title, seed: album.id } },
  MxDescriptionList: {
    props: {
      items: [
        { term: 'Lançamento', value: album.year },
        { term: 'Página da banda', value: album.artist, href: 'https://example.com/banda-lumen' },
      ],
    },
  },
  MxDialog: { props: { modelValue: true, title: 'Compartilhar' }, slots: { default: '<p>Corpo</p>' } },
  MxDiscProgress: {
    props: {
      tier: 'GOLD',
      label: 'Disco de Ouro',
      reviews: 64,
      next: { tier: 'PLATINUM', label: 'Disco de Platina', minReviews: 100, remaining: 36 },
      progress: 0.64,
    },
  },
  MxDiscTier: { props: { tier: 'GOLD', label: 'Disco de Ouro' } },
  MxEmptyState: { props: { title: 'Nada por aqui', description: 'Avalie um disco para começar.' } },
  MxErrorState: {},
  MxFlag: { props: { region: 'BR' } },
  MxFooter: {
    props: {
      columns: [{ title: 'Mixtape', links: [{ label: 'Sobre', to: '/sobre' }, { label: 'Blog', href: 'https://example.com/blog' }] }],
      label: 'Rodapé',
    },
  },
  MxGlass: { slots: { default: '<p>Vidro</p>' } },
  MxGrid: { slots: { default: '<li>Item</li>' } },
  MxGroupReviewCard: {
    props: { group: { name: 'Galera do Vinil', to: '/galeras/vinil' }, item: subject, rating: 4.5, entries: groupEntries, members: 5, to: '/galeras/vinil/avaliacoes/1' },
  },
  MxIconButton: { props: { icon: 'mdi-heart', label: 'Curtir' } },
  MxImageCredit: {
    props: { author: 'Lia Martins', license: 'CC BY-SA 4.0', licenseUrl: 'https://example.com/licenca', sourceUrl: 'https://example.com/foto' },
  },
  MxItemCard: {
    props: { title: album.title, subtitle: album.artist, cover: album.cover, seed: album.id, to: `/albums/${album.id}`, rating: album.rating, listeners: album.listeners },
  },
  MxLikeButton: { props: { count: 12 } },
  MxLink: { props: { to: `/albums/${album.id}` }, slots: { default: album.title } },
  MxLoadMore: { props: { hasMore: true, auto: false } },
  MxLoader: {},
  MxMarquee: { props: { items: mockAlbums.slice(0, 4).map((item) => item.title) } },
  MxMosaic: { props: { covers: [coverArt('violet'), coverArt('pink', 'blob'), coverArt('navy', 'stripes'), coverArt('lime', 'grid')], seed: 'playlist' } },
  MxPageHero: { props: { title: album.title, eyebrow: album.artist } },
  MxPagedGrid: {
    props: { items: mockDiscography.slice(0, 6), label: 'Discografia' },
    slots: { default: '<template #default="{ item }">{{ item.title }}</template>' },
  },
  MxPasswordField: { props: { label: 'Senha', rules: [{ key: 'length', label: 'Pelo menos 8 caracteres', passed: false }] } },
  MxPodium: {
    props: {
      entries: mockRanking.slice(0, 3).map((user) => ({
        key: user.username,
        position: user.position,
        name: user.name,
        seed: user.username,
        tier: user.tier,
        score: `${user.total} pts`,
        to: `/u/${user.username}`,
      })),
      label: 'Pódio',
    },
  },
  MxProgressBar: { props: { active: true } },
  MxQrCode: { props: { png: mockQrCode, svg: mockQrCode, alt: 'QR code da avaliação' } },
  MxRail: { props: { label: 'Lançamentos' }, slots: { default: '<li>Item</li>' } },
  MxRankRow: {
    props: { position: 1, name: ana.name, username: ana.username, tier: ana.tier, tierLabel: ana.tierLabel, total: 1840, participation: 1100, notoriety: 740, to: `/u/${ana.username}` },
  },
  MxRating: { props: { value: 4.5 } },
  MxRatingHistogram: { props: { distribution: mockDistribution, average: 3.8, total: 164 } },
  MxRatingInput: { props: { modelValue: 3.5 } },
  MxReviewCard: {
    props: { rating: 4.5, body: mockReviewBody, createdAt: '2026-10-05T09:42:00Z', likes: 12, canLike: true, author: author(ana), item: subject, to: '/avaliacoes/1' },
  },
  MxRotator: {
    props: { items: mockAlbums.slice(0, 3), label: 'Outras avaliações' },
    slots: { default: '<template #default="{ item }">{{ item.title }}</template>' },
  },
  MxSearchField: { props: { modelValue: 'neon' } },
  MxSection: { props: { title: 'Em alta', moreTo: '/paradas' }, slots: { default: '<p>Conteúdo</p>' } },
  MxSegmented: { props: { modelValue: 'week', options: ranges, label: 'Período' } },
  MxShareSheet: { props: { modelValue: true, title: 'Compartilhar', payload: mockSharePayload, qr: { png: mockQrCode, alt: 'QR code da avaliação' } } },
  MxSkeleton: {},
  MxSplitBar: {
    props: {
      segments: [
        { label: 'Participação', value: 1100, color: 'var(--mx-primary)' },
        { label: 'Notoriedade', value: 740, color: 'var(--mx-secondary)' },
      ],
    },
  },
  MxStarburst: {},
  MxStat: { props: { value: 64, label: 'Avaliações' } },
  MxStepper: {
    props: { modelValue: 0, steps, label: 'Criar conta', reachable: 1 },
    slots: { account: '<p>Conta</p>', profile: '<p>Perfil</p>', styles: '<p>Estilos</p>' },
  },
  MxStoryCard: { props: { label: 'Disco do ano', value: album.title, sentence: 'Você voltou a ele 42 vezes.' } },
  MxStreamingLinks: { props: { links: mockStreamingLinks } },
  MxTabBar: { props: { items: tabItems, active: 'home', label: 'Atalhos' } },
  MxTextarea: { props: { label: 'Resenha' } },
  MxTextField: { props: { label: 'E-mail', type: 'email' } },
  MxTimeAgo: { props: { date: '2026-10-05T09:42:00Z' } },
  MxToastHost: {},
  MxTopBar: { props: { label: 'Navegação principal' }, slots: { brand: '<span>Mixtape</span>' } },
  MxTrackList: { props: { tracks: mockTracks.map((track) => ({ ...track, to: `/tracks/${track.id}` })), albumArtist: album.artist, label: 'Faixas' } },
  MxUserMenu: {
    props: { name: ana.name, username: ana.username, themeMode: 'system', items: [{ key: 'profile', label: 'Perfil', icon: 'mdi-account', to: `/u/${ana.username}` }] },
  },
  MxVinyl: {},
};
