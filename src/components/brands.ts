import { BRAND_ICONS } from './brand-icons.generated';

export type BrandName =
  | 'spotify'
  | 'appleMusic'
  | 'deezer'
  | 'youtubeMusic'
  | 'youtube'
  | 'tidal'
  | 'amazonMusic'
  | 'soundcloud'
  | 'bandcamp'
  | 'qobuz'
  | 'whatsapp'
  | 'telegram'
  | 'x'
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'threads'
  | 'bluesky'
  | 'tiktok'
  | 'wikipedia'
  | 'wikidata'
  | 'lastfm'
  | 'discogs'
  | 'musicbrainz'
  | 'official';

export interface Brand {
  title: string;
  path: string | null;
  color: string | null;
  fallbackIcon: string;
}

const NEUTRAL_HEX = new Set(['000000', '333333', '414141']);

const icon = (data: { title: string; path: string; hex: string }, fallbackIcon = 'mdi-music-circle'): Brand => ({
  title: data.title,
  path: data.path,
  color: NEUTRAL_HEX.has(data.hex.toUpperCase()) ? null : `#${data.hex}`,
  fallbackIcon,
});

export const BRANDS: Readonly<Record<BrandName, Brand>> = {
  spotify: icon(BRAND_ICONS.spotify),
  appleMusic: icon(BRAND_ICONS.appleMusic),
  deezer: icon(BRAND_ICONS.deezer),
  youtubeMusic: icon(BRAND_ICONS.youtubeMusic),
  youtube: icon(BRAND_ICONS.youtube),
  tidal: icon(BRAND_ICONS.tidal),
  amazonMusic: { title: 'Amazon Music', path: null, color: null, fallbackIcon: 'mdi-music-circle' },
  soundcloud: icon(BRAND_ICONS.soundcloud),
  bandcamp: icon(BRAND_ICONS.bandcamp),
  qobuz: { title: 'Qobuz', path: null, color: null, fallbackIcon: 'mdi-music-circle' },
  whatsapp: icon(BRAND_ICONS.whatsapp),
  telegram: icon(BRAND_ICONS.telegram),
  x: icon(BRAND_ICONS.x),
  twitter: icon(BRAND_ICONS.x),
  facebook: icon(BRAND_ICONS.facebook),
  instagram: icon(BRAND_ICONS.instagram),
  threads: icon(BRAND_ICONS.threads),
  bluesky: icon(BRAND_ICONS.bluesky),
  tiktok: icon(BRAND_ICONS.tiktok),
  wikipedia: icon(BRAND_ICONS.wikipedia),
  wikidata: icon(BRAND_ICONS.wikidata),
  lastfm: icon(BRAND_ICONS.lastfm),
  discogs: icon(BRAND_ICONS.discogs),
  musicbrainz: icon(BRAND_ICONS.musicbrainz),
  official: { title: '', path: null, color: null, fallbackIcon: 'mdi-web' },
};

export const isBrandName = (value: string): value is BrandName => Object.hasOwn(BRANDS, value);
