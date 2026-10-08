export const mediaQueries = new Map<string, boolean>();

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export const matchMedia = (query: string): MediaQueryList =>
  ({
    matches: mediaQueries.get(query) ?? false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) as MediaQueryList;
