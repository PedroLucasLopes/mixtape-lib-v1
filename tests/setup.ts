import { config, enableAutoUnmount } from '@vue/test-utils';
import { afterEach, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { en, es, pt } from 'vuetify/locale';
import { vuetifyOptions } from '../src/theme/vuetify';
import { watchConsole } from './console';
import { matchMedia, mediaQueries } from './media';

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

function scrollTo(this: Element, options?: ScrollToOptions | number, top?: number): void {
  if (typeof options === 'number') {
    this.scrollLeft = options;
    this.scrollTop = top ?? this.scrollTop;
    return;
  }
  if (options?.left !== undefined) this.scrollLeft = options.left;
  if (options?.top !== undefined) this.scrollTop = options.top;
}

const visualViewport = {
  width: window.innerWidth,
  height: window.innerHeight,
  offsetLeft: 0,
  offsetTop: 0,
  pageLeft: 0,
  pageTop: 0,
  scale: 1,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
};

vi.stubGlobal('ResizeObserver', ResizeObserverStub);
vi.stubGlobal('visualViewport', visualViewport);
Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: matchMedia });
Object.defineProperty(window, 'scrollTo', { configurable: true, writable: true, value: () => undefined });
Element.prototype.scrollTo = scrollTo as Element['scrollTo'];
Element.prototype.scrollIntoView = () => undefined;

config.global.plugins = [
  createVuetify({
    ...vuetifyOptions,
    components,
    directives,
    locale: { locale: 'pt-BR', fallback: 'en', messages: { 'pt-BR': pt, en, es } },
  }),
];

enableAutoUnmount(afterEach);
watchConsole();

afterEach(() => {
  mediaQueries.clear();
  document.body.innerHTML = '';
});
