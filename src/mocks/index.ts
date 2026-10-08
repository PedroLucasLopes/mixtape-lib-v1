import { brand, duotones, type DuotoneName } from '../theme/tokens';

const svg = (markup: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

export function coverArt(seed: DuotoneName, shape: 'circle' | 'stripes' | 'blob' | 'grid' = 'circle'): string {
  const { background, ink, accent } = duotones[seed];
  const shapes = {
    circle: `<circle cx="300" cy="260" r="170" fill="${accent}"/><circle cx="300" cy="260" r="70" fill="${ink}"/>`,
    stripes: Array.from({ length: 6 }, (_, index) => `<rect x="0" y="${index * 100 + 20}" width="600" height="46" fill="${index % 2 ? accent : ink}" opacity="0.85"/>`).join(''),
    blob: `<path d="M120 320C80 180 220 60 350 110s200 170 120 290-270 60-350-80Z" fill="${accent}"/><circle cx="420" cy="170" r="54" fill="${ink}"/>`,
    grid: Array.from({ length: 16 }, (_, index) => `<rect x="${(index % 4) * 150 + 18}" y="${Math.floor(index / 4) * 150 + 18}" width="114" height="114" rx="57" fill="${index % 3 ? accent : ink}"/>`).join(''),
  };
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="${background}"/>${shapes[shape]}</svg>`);
}

export function artistPhoto(seed: DuotoneName): string {
  const { background, ink, accent } = duotones[seed];
  return svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="${background}"/><circle cx="300" cy="240" r="120" fill="${ink}"/><path d="M90 600c20-150 110-230 210-230s190 80 210 230Z" fill="${ink}"/><circle cx="470" cy="110" r="60" fill="${accent}"/></svg>`,
  );
}

export const mockAlbums = [
  { id: 'a1', title: 'Neon na Garagem', artist: 'Banda Lúmen', year: '2019', type: 'Álbum', cover: coverArt('violet', 'circle'), rating: 4.5, listeners: 1_284_000, genres: ['indie rock', 'synth-pop'] },
  { id: 'a2', title: 'Maré Alta', artist: 'Clara Sol', year: '2022', type: 'Álbum', cover: coverArt('pink', 'blob'), rating: 4, listeners: 482_300, genres: ['mpb', 'bossa nova'] },
  { id: 'a3', title: 'Ruído Branco', artist: 'Os Satélites', year: '2015', type: 'EP', cover: coverArt('navy', 'stripes'), rating: 3.5, listeners: 96_120, genres: ['shoegaze', 'dream pop'] },
  { id: 'a4', title: 'Cidade Acesa', artist: 'Duo Fluxo', year: '2024', type: 'Single', cover: coverArt('lime', 'grid'), rating: 5, listeners: 3_904_000, genres: ['funk', 'electronic'] },
  { id: 'a5', title: 'Fita Cassete', artist: 'Rádio Vinil', year: '2008', type: 'Coletânea', cover: null, rating: 2.5, listeners: 18_400, genres: ['pop rock'] },
  { id: 'a6', title: 'Horizonte Vertical', artist: 'Marina Prado', year: '2021', type: 'Álbum', cover: coverArt('forest', 'circle'), rating: 4, listeners: 210_000, genres: ['jazz'] },
  { id: 'a7', title: 'Concreto & Céu', artist: 'Coletivo Norte', year: '2017', type: 'Álbum', cover: coverArt('orange', 'blob'), rating: 3, listeners: 640_200, genres: ['hip hop'] },
  { id: 'a8', title: 'Dias de Sol', artist: 'Tom Rios', year: '2013', type: 'Álbum', cover: coverArt('burgundy', 'stripes'), rating: 4.5, listeners: 75_800, genres: ['samba'] },
];

export const mockTracks = [
  { id: 't1', title: 'Luz de Garagem', number: '1', disc: 1, durationMs: 213_000, artistCredit: 'Banda Lúmen' },
  { id: 't2', title: 'Fios Desencapados', number: '2', disc: 1, durationMs: 247_500, artistCredit: 'Banda Lúmen' },
  { id: 't3', title: 'Ondas Curtas (feat. Clara Sol)', number: '3', disc: 1, durationMs: 301_200, artistCredit: 'Banda Lúmen feat. Clara Sol' },
  { id: 't4', title: 'Interlúdio', number: '4', disc: 1, durationMs: 62_000, artistCredit: 'Banda Lúmen' },
  { id: 't5', title: 'Neon', number: '1', disc: 2, durationMs: 384_000, artistCredit: 'Banda Lúmen' },
  { id: 't6', title: 'Fim de Festa', number: '2', disc: 2, durationMs: 275_900, artistCredit: 'Banda Lúmen' },
];

export const mockUsers = [
  { name: 'Ana Souza', username: 'ana.souza', tier: 'GOLD', tierLabel: 'Disco de Ouro', avatarUrl: null },
  { name: 'Bruno Lima', username: 'brunolima', tier: 'SILVER', tierLabel: 'Disco de Prata', avatarUrl: null },
  { name: 'Carla Dias', username: 'carla.dias', tier: 'PLATINUM', tierLabel: 'Disco de Platina', avatarUrl: null },
  { name: 'Diego Alves', username: 'diegoalves', tier: 'BRONZE', tierLabel: 'Disco de Bronze', avatarUrl: null },
  { name: 'Eva Ramos', username: 'eva', tier: 'DIAMOND', tierLabel: 'Disco de Diamante', avatarUrl: null },
  { name: 'Felipe Costa', username: 'felipec', tier: 'DEMO', tierLabel: 'Fita Demo', avatarUrl: null },
] as const;

export const mockReviewBody =
  'Um disco que acende devagar: os sintetizadores de "Luz de Garagem" puxam para a pista, mas é no lado B que a banda se arrisca. ' +
  '"Neon" tem seis minutos que passam voando, e a participação da Clara Sol em "Ondas Curtas" é o momento mais bonito do ano. ' +
  'Só o interlúdio parece sobra de estúdio. Voltei três vezes no mesmo dia, o que diz muito.';

export const mockGroupReviewEntries = [
  { id: 'g1', user: 0, rating: 4.5, likes: 12, body: 'O lado B salvou a noite: "Neon" tocou três vezes seguidas na casa da Eva.', createdAt: '2026-10-04T21:10:00Z' },
  { id: 'g2', user: 1, rating: 4, likes: 3, body: 'Concordo com a nota, mas o interlúdio podia ter ficado na gaveta.', createdAt: '2026-10-05T09:42:00Z' },
  { id: 'g3', user: 4, rating: 5, likes: 7, body: null, createdAt: '2026-10-05T18:05:00Z' },
] as const;

export const mockDistribution = [
  { rating: 0, count: 2 },
  { rating: 0.5, count: 1 },
  { rating: 1, count: 3 },
  { rating: 1.5, count: 2 },
  { rating: 2, count: 6 },
  { rating: 2.5, count: 9 },
  { rating: 3, count: 18 },
  { rating: 3.5, count: 27 },
  { rating: 4, count: 41 },
  { rating: 4.5, count: 33 },
  { rating: 5, count: 22 },
];

export const mockBadges = [
  { code: 'CRITIC', name: 'Crítico', icon: 'mdi-feather', description: 'Escreva resenhas', tier: 3, tierName: 'Ouro', value: 64, next: { tier: 4, tierName: 'Platina', threshold: 200 }, progress: 0.32, earnedAt: '2026-08-14T12:00:00Z' },
  { code: 'CROWD_FAVORITE', name: 'Queridinho do Público', icon: 'mdi-heart-multiple', description: 'Receba "gostei"', tier: 2, tierName: 'Prata', value: 140, next: { tier: 3, tierName: 'Ouro', threshold: 500 }, progress: 0.28, earnedAt: '2026-07-02T12:00:00Z' },
  { code: 'PIONEER', name: 'Pioneiro', icon: 'mdi-flag-variant', description: 'Seja o primeiro a avaliar', tier: 4, tierName: 'Platina', value: 230, next: null, progress: 1, earnedAt: '2026-09-21T12:00:00Z' },
  { code: 'CURATOR', name: 'Curador', icon: 'mdi-playlist-star', description: 'Crie playlists', tier: 0, tierName: null, value: 0, next: { tier: 1, tierName: 'Bronze', threshold: 1 }, progress: 0, earnedAt: null },
];

export const mockRanking = mockUsers.map((user, index) => ({
  ...user,
  position: index + 1,
  total: 1_840 - index * 230,
  participation: 1_100 - index * 120,
  notoriety: 740 - index * 110,
}));

export const mockStreamingLinks = {
  spotify: 'https://example.com/spotify',
  appleMusic: 'https://example.com/apple-music',
  deezer: 'https://example.com/deezer',
  youtubeMusic: 'https://example.com/youtube-music',
  tidal: 'https://example.com/tidal',
  bandcamp: 'https://example.com/bandcamp',
  amazonMusic: 'https://example.com/amazon-music',
};

export const mockSharePayload = {
  url: 'https://example.com/reviews/123',
  title: 'Neon na Garagem — avaliação de @ana.souza',
  text: '@ana.souza deu 💿 4,5/5 para "Neon na Garagem", de Banda Lúmen no Mixtape',
  imageUrl: null,
  targets: [
    { network: 'whatsapp', label: 'WhatsApp', method: 'LINK' as const, url: 'https://example.com/whatsapp' },
    { network: 'telegram', label: 'Telegram', method: 'LINK' as const, url: 'https://example.com/telegram' },
    { network: 'x', label: 'X (Twitter)', method: 'LINK' as const, url: 'https://example.com/x' },
    { network: 'facebook', label: 'Facebook', method: 'LINK' as const, url: 'https://example.com/facebook' },
    { network: 'instagram', label: 'Instagram', method: 'WEB_SHARE_API' as const, url: null },
    { network: 'spotify', label: 'Ouvir no Spotify', method: 'LINK' as const, url: 'https://example.com/spotify' },
  ],
};

export const mockQrCode = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/>${Array.from(
    { length: 29 * 29 },
    (_, index) => {
      const x = index % 29;
      const y = Math.floor(index / 29);
      const finder = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
      const on = finder ? x % 6 === 0 || y % 6 === 0 || (x % 22 > 1 && x % 22 < 5 && y % 22 > 1 && y % 22 < 5) : (x * 7 + y * 13 + x * y) % 3 === 0;
      return on ? `<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>` : '';
    },
  ).join('')}</svg>`,
);

export const mockBrandColors = brand;
