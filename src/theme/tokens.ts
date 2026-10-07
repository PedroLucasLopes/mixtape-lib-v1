import palette from './palette.json';

export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceVariant: string;
  surfaceRaised: string;
  onSurface: string;
  onSurfaceMuted: string;
  outline: string;
  outlineStrong: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  onTertiary: string;
  cta: string;
  onCta: string;
  ctaOutline: string;
  ctaShadow: string;
  link: string;
  success: string;
  warning: string;
  error: string;
  onError: string;
  info: string;
  focus: string;
  glass: string;
  glassStrong: string;
  glassBorder: string;
  glassHighlight: string;
  shadow: string;
  scrim: string;
}

export interface Duotone {
  background: string;
  ink: string;
  accent: string;
}

export type DuotoneName =
  | 'lime'
  | 'violet'
  | 'pink'
  | 'green'
  | 'orange'
  | 'forest'
  | 'burgundy'
  | 'blush'
  | 'navy'
  | 'blue'
  | 'red';

export type MetalName = 'demo' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type BrandColorName = 'ink' | 'paper' | 'lime' | 'pink' | 'violet' | 'green' | 'orange' | 'blue';

export const brand: Readonly<Record<BrandColorName, string>> = palette.brand;

export const darkColors: ThemeColors = palette.themes.dark;

export const lightColors: ThemeColors = palette.themes.light;

export const duotones: Readonly<Record<DuotoneName, Duotone>> = palette.duotones;

export const DUOTONE_NAMES = Object.keys(palette.duotones) as DuotoneName[];

export const metals: Readonly<Record<MetalName, readonly [string, string, string]>> = palette.metals as Record<
  MetalName,
  [string, string, string]
>;

export const blobColors: readonly string[] = [brand.lime, brand.pink, brand.violet, brand.green, brand.orange, brand.blue];

export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '72px',
} as const;

export const radius = {
  xs: '8px',
  sm: '12px',
  md: '18px',
  lg: '26px',
  xl: '36px',
  pill: '999px',
} as const;

export const typography = {
  display: "'Bricolage Grotesque Variable', 'Bricolage Grotesque', 'Figtree Variable', system-ui, sans-serif",
  body: "'Figtree Variable', 'Figtree', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'Cascadia Mono', Menlo, Consolas, monospace",
  size: {
    giant: 'clamp(3.25rem, 11vw, 10.5rem)',
    displayXl: 'clamp(2.75rem, 7.5vw, 6.25rem)',
    displayL: 'clamp(2.25rem, 5vw, 4.25rem)',
    h1: 'clamp(2rem, 4vw, 3.25rem)',
    h2: 'clamp(1.5rem, 2.6vw, 2.25rem)',
    h3: '1.375rem',
    title: '1.125rem',
    body: '1rem',
    small: '0.9375rem',
    caption: '0.8125rem',
    overline: '0.75rem',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900,
  },
  lineHeight: {
    tight: 0.92,
    snug: 1.15,
    normal: 1.5,
    relaxed: 1.65,
  },
  tracking: {
    display: '-0.01em',
    title: '-0.005em',
    numeral: '-0.025em',
  },
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 840,
  lg: 1145,
  xl: 1545,
  xxl: 2138,
} as const;

export const layout = {
  contentMaxWidth: '1280px',
  readingMaxWidth: '68ch',
  topBarHeight: '72px',
  tabBarHeight: '76px',
} as const;

export const blur = {
  glass: '24px',
  bar: '20px',
  blob: '60px',
} as const;

export const elevation = {
  none: 'none',
  low: '0 2px 10px -4px var(--mx-shadow)',
  float: '0 18px 48px -16px var(--mx-shadow)',
  high: '0 32px 80px -24px var(--mx-shadow)',
} as const;

export const motion = {
  instant: '90ms',
  fast: '160ms',
  normal: '260ms',
  slow: '420ms',
  slower: '700ms',
  easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  springSmooth:
    'linear(0, 0.0139 2.2%, 0.0504 4.3%, 0.1026 6.5%, 0.1652 8.7%, 0.2338 10.9%, 0.305 13%, 0.3764 15.2%, 0.4459 17.4%, 0.5122 19.6%, 0.5744 21.7%, 0.6318 23.9%, 0.6843 26.1%, 0.7316 28.3%, 0.7738 30.4%, 0.8112 32.6%, 0.844 34.8%, 0.8724 37%, 0.897 39.1%, 0.9179 41.3%, 0.9356 43.5%, 0.9505 45.7%, 0.9629 47.8%, 0.973 50%, 0.9813 52.2%, 0.9879 54.3%, 0.9932 56.5%, 0.9973 58.7%, 1.0004 60.9%, 1.0043 65.2%, 1.0064 71.7%, 1.0058 80.4%, 1.004 89.1%, 1)',
  springBouncy:
    'linear(0, 0.0205 2.2%, 0.0755 4.3%, 0.1554 6.5%, 0.252 8.7%, 0.3579 10.9%, 0.4669 13%, 0.5741 15.2%, 0.6756 17.4%, 0.7687 19.6%, 0.8514 21.7%, 0.9226 23.9%, 0.9819 26.1%, 1.0295 28.3%, 1.0659 30.4%, 1.0921 32.6%, 1.1091 34.8%, 1.1183 37%, 1.1208 39.1%, 1.1181 41.3%, 1.1112 43.5%, 1.1014 45.7%, 1.0897 47.8%, 1.0768 50%, 1.0637 52.2%, 1.0507 54.3%, 1.0385 56.5%, 1.0273 58.7%, 1.0174 60.9%, 1.0089 63%, 1.0018 65.2%, 0.9962 67.4%, 0.9918 69.6%, 0.9867 73.9%, 0.9854 78.3%, 0.9866 82.6%, 0.9893 87%, 0.9924 91.3%, 0.9954 95.7%, 1)',
  springPop:
    'linear(0, 0.0649 2.2%, 0.2305 4.3%, 0.4521 6.5%, 0.689 8.7%, 0.9081 10.9%, 1.0864 13%, 1.2115 15.2%, 1.2805 17.4%, 1.2983 19.6%, 1.2748 21.7%, 1.2228 23.9%, 1.1555 26.1%, 1.0849 28.3%, 1.0206 30.4%, 0.9691 32.6%, 0.9336 34.8%, 0.9149 37%, 0.9112 39.1%, 0.9194 41.3%, 0.9356 43.5%, 0.956 45.7%, 0.977 47.8%, 0.9958 50%, 1.0107 52.2%, 1.0207 54.3%, 1.0258 56.5%, 1.0264 58.7%, 1.0236 60.9%, 1.0186 63%, 1.0124 65.2%, 1.0062 67.4%, 1.0007 69.6%, 0.9964 71.7%, 0.9922 76.1%, 0.9931 80.4%, 0.9965 84.8%, 1.0012 91.3%, 1.0023 95.7%, 1)',
  springSmoothDuration: '570ms',
  springBouncyDuration: '600ms',
  springPopDuration: '900ms',
} as const;

export const zIndex = {
  base: 0,
  raised: 2,
  sticky: 10,
  bars: 50,
  overlay: 100,
  toast: 200,
} as const;
