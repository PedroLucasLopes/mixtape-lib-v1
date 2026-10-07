import { createVuetify, type ThemeDefinition, type VuetifyOptions } from 'vuetify';
import { mixtapeIcons } from '../icons/iconSet';
import {
  blur,
  breakpoints,
  darkColors,
  layout,
  lightColors,
  motion,
  radius,
  spacing,
  type ThemeColors,
  typography,
  zIndex,
} from './tokens';

export const THEME_LIGHT = 'mixtapeLight';
export const THEME_DARK = 'mixtapeDark';

const toVuetifyTheme = (colors: ThemeColors, dark: boolean): ThemeDefinition => ({
  dark,
  colors: {
    background: colors.background,
    surface: colors.surface,
    'surface-bright': colors.surfaceRaised,
    'surface-light': colors.surfaceVariant,
    'surface-variant': colors.surfaceVariant,
    'on-background': colors.onSurface,
    'on-surface': colors.onSurface,
    'on-surface-variant': colors.onSurfaceMuted,
    primary: colors.primary,
    'on-primary': colors.onPrimary,
    secondary: colors.secondary,
    'on-secondary': colors.onSecondary,
    tertiary: colors.tertiary,
    'on-tertiary': colors.onTertiary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  variables: {
    'border-color': colors.outlineStrong,
    'border-opacity': 0.5,
    'hover-opacity': dark ? 0.08 : 0.05,
    'focus-opacity': dark ? 0.14 : 0.1,
    'selected-opacity': dark ? 0.16 : 0.1,
    'disabled-opacity': 0.4,
    'medium-emphasis-opacity': 1,
    'high-emphasis-opacity': 1,
  },
});

export const lightTheme = toVuetifyTheme(lightColors, false);
export const darkTheme = toVuetifyTheme(darkColors, true);

export const vuetifyOptions: VuetifyOptions = {
  icons: mixtapeIcons(),
  theme: {
    defaultTheme: THEME_DARK,
    themes: {
      [THEME_LIGHT]: lightTheme,
      [THEME_DARK]: darkTheme,
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: { ...breakpoints },
  },
  defaults: {
    global: {
      ripple: false,
    },
    VBtn: {
      variant: 'flat',
      rounded: 'pill',
    },
    VTextField: {
      variant: 'solo-filled',
      flat: true,
      rounded: 'lg',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'solo-filled',
      flat: true,
      rounded: 'lg',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'solo-filled',
      flat: true,
      rounded: 'lg',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      variant: 'solo-filled',
      flat: true,
      rounded: 'lg',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VCard: {
      rounded: 'xl',
      flat: true,
    },
    VMenu: {
      offset: 8,
    },
    VTooltip: {
      location: 'top',
    },
  },
};

export const createMixtapeVuetify = (options: VuetifyOptions = {}) => createVuetify({ ...vuetifyOptions, ...options });

const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const cssVariables = (colors: ThemeColors): Record<string, string> => ({
  ...Object.fromEntries(Object.entries(colors).map(([key, value]) => [`--mx-${kebab(key)}`, value])),

  ...Object.fromEntries(Object.entries(spacing).map(([key, value]) => [`--mx-space-${key}`, value])),
  ...Object.fromEntries(Object.entries(radius).map(([key, value]) => [`--mx-radius-${key}`, value])),
  ...Object.fromEntries(Object.entries(typography.size).map(([key, value]) => [`--mx-text-${kebab(key)}`, value])),
  ...Object.fromEntries(Object.entries(typography.tracking).map(([key, value]) => [`--mx-tracking-${kebab(key)}`, value])),

  '--mx-font-display': typography.display,
  '--mx-font-body': typography.body,
  '--mx-font-mono': typography.mono,

  '--mx-blur-glass': blur.glass,
  '--mx-blur-bar': blur.bar,
  '--mx-blur-blob': blur.blob,

  '--mx-content-max': layout.contentMaxWidth,
  '--mx-reading-max': layout.readingMaxWidth,
  '--mx-top-bar-height': layout.topBarHeight,
  '--mx-tab-bar-height': layout.tabBarHeight,

  '--mx-duration-instant': motion.instant,
  '--mx-duration-fast': motion.fast,
  '--mx-duration-normal': motion.normal,
  '--mx-duration-slow': motion.slow,
  '--mx-duration-slower': motion.slower,
  '--mx-ease-standard': motion.easeStandard,
  '--mx-ease-out': motion.easeOut,
  '--mx-ease-in': motion.easeIn,
  '--mx-spring-smooth': motion.springSmooth,
  '--mx-spring-bouncy': motion.springBouncy,
  '--mx-spring-pop': motion.springPop,
  '--mx-spring-smooth-duration': motion.springSmoothDuration,
  '--mx-spring-bouncy-duration': motion.springBouncyDuration,
  '--mx-spring-pop-duration': motion.springPopDuration,

  '--mx-z-sticky': String(zIndex.sticky),
  '--mx-z-bars': String(zIndex.bars),
  '--mx-z-overlay': String(zIndex.overlay),
  '--mx-z-toast': String(zIndex.toast),
});
