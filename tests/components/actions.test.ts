import { mount, RouterLinkStub } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MxButton from '../../src/components/MxButton.vue';
import MxChip from '../../src/components/MxChip.vue';
import MxIconButton from '../../src/components/MxIconButton.vue';
import MxLikeButton from '../../src/components/MxLikeButton.vue';
import MxLink from '../../src/components/MxLink.vue';
import { MIXTAPE_LINK_KEY } from '../../src/links/links';
import { attached, getByTestId, queryByTestId } from '../dom';

afterEach(() => {
  vi.useRealTimers();
});

describe('MxButton', () => {
  it('is a button that reports clicks', async () => {
    const wrapper = mount(MxButton, { props: { label: 'Salvar' }, ...attached });
    const button = getByTestId('mx-button');
    expect(button.element.tagName).toBe('BUTTON');
    expect(button.attributes('type')).toBe('button');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('becomes a link when it has a destination', () => {
    mount(MxButton, { props: { label: 'Ver álbum', to: '/albums/a1' }, ...attached });
    const link = getByTestId('mx-button');
    expect(link.element.tagName).toBe('A');
    expect(link.attributes('href')).toBe('/albums/a1');
  });

  it('ignores clicks while loading and shows the spinner only after the delay', async () => {
    vi.useFakeTimers();
    const wrapper = mount(MxButton, { props: { label: 'Salvar', loading: true }, ...attached });
    const button = getByTestId('mx-button');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(button.attributes('aria-busy')).toBe('true');
    expect(queryByTestId('mx-button-spinner')).toBeNull();
    await vi.advanceTimersByTimeAsync(220);
    expect(queryByTestId('mx-button-spinner')).not.toBeNull();
  });
});

describe('MxLink', () => {
  it('opens external addresses in a new tab and says so', () => {
    mount(MxLink, { props: { href: 'https://example.com/banda' }, slots: { default: 'Site da banda' }, ...attached });
    const link = getByTestId('mx-link');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
    expect(link.text()).toContain('Site da banda');
  });

  it('uses the link component the application provides', () => {
    const wrapper = mount(MxLink, {
      props: { to: '/albums/a1' },
      slots: { default: 'Neon na Garagem' },
      global: { provide: { [MIXTAPE_LINK_KEY]: RouterLinkStub } },
      ...attached,
    });
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/albums/a1');
    expect(getByTestId('mx-link').text()).toBe('Neon na Garagem');
  });
});

describe('MxIconButton', () => {
  it('is named by its label and reports clicks', async () => {
    const wrapper = mount(MxIconButton, { props: { icon: 'mdi-heart', label: 'Curtir', tooltip: false }, ...attached });
    const button = getByTestId('mx-icon-button');
    expect(button.attributes('aria-label')).toBe('Curtir');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});

describe('MxLikeButton', () => {
  it('asks for the next state', async () => {
    const wrapper = mount(MxLikeButton, { props: { count: 3 }, ...attached });
    const button = getByTestId('mx-like-button');
    expect(button.attributes('aria-pressed')).toBe('false');
    await button.trigger('click');
    expect(wrapper.emitted('toggle')).toEqual([[true]]);
  });

  it('waits while the previous like is being saved', async () => {
    const wrapper = mount(MxLikeButton, { props: { count: 3, liked: true, pending: true }, ...attached });
    const button = getByTestId('mx-like-button');
    expect(button.attributes('disabled')).toBeDefined();
    await button.trigger('click');
    expect(wrapper.emitted('toggle')).toBeUndefined();
  });

  it('is only a counter when it cannot be liked', () => {
    mount(MxLikeButton, { props: { count: 3, interactive: false }, ...attached });
    const counter = getByTestId('mx-like-button');
    expect(counter.element.tagName).toBe('SPAN');
    expect(counter.attributes('aria-pressed')).toBeUndefined();
  });
});

describe('MxChip', () => {
  it('can be removed', async () => {
    const wrapper = mount(MxChip, { props: { label: 'indie rock', removable: true }, ...attached });
    await getByTestId('mx-chip-remove').trigger('click');
    expect(wrapper.emitted('remove')).toHaveLength(1);
  });

  it('works as a toggle when selectable', async () => {
    const wrapper = mount(MxChip, { props: { label: 'indie rock', selectable: true, selected: true }, ...attached });
    const chip = getByTestId('mx-chip');
    expect(chip.attributes('aria-pressed')).toBe('true');
    await chip.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
