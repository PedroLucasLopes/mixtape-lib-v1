import { type Component, inject, type InjectionKey } from 'vue';

export type LinkTarget = string | object;

export const MIXTAPE_LINK_KEY: InjectionKey<Component> = Symbol('mixtape-link');

export function useLinkComponent(): Component | null {
  return inject(MIXTAPE_LINK_KEY, null);
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:');
}
