import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MxBlobField from '../../src/components/MxBlobField.vue';
import MxShareSheet from '../../src/components/MxShareSheet.vue';
import MxTabBar from '../../src/components/MxTabBar.vue';
import MxUserMenu from '../../src/components/MxUserMenu.vue';
import { mockSharePayload } from '../../src/mocks';
import { allByTestId, attached, getByTestId } from '../dom';
import { tabItems } from '../fixtures';

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('MxTabBar', () => {
  it('marks the current section', () => {
    mount(MxTabBar, { props: { items: tabItems, active: 'charts', label: 'Atalhos' }, ...attached });
    expect(getByTestId('mx-tab-bar-item-charts').attributes('aria-current')).toBe('page');
    expect(getByTestId('mx-tab-bar-item-home').attributes('aria-current')).toBeUndefined();
    expect(getByTestId('mx-tab-bar-item-home').attributes('href')).toBe('/');
  });
});

describe('MxUserMenu', () => {
  it('opens to change the theme or sign out', async () => {
    const wrapper = mount(MxUserMenu, { props: { name: 'Ana Souza', username: 'ana.souza', themeMode: 'system' }, ...attached });
    const trigger = getByTestId('mx-user-menu');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    await flushPromises();
    expect(getByTestId('mx-user-menu-panel').text()).toContain('@ana.souza');
    expect(getByTestId('mx-user-menu-theme-system').attributes('aria-pressed')).toBe('true');
    await getByTestId('mx-user-menu-theme-dark').trigger('click');
    await getByTestId('mx-user-menu-sign-out').trigger('click');
    expect(wrapper.emitted('update:themeMode')).toEqual([['dark']]);
    expect(wrapper.emitted('signOut')).toHaveLength(1);
  });
});

describe('MxShareSheet', () => {
  it('links each network and copies the link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const wrapper = mount(MxShareSheet, { props: { modelValue: true, title: 'Compartilhar', payload: mockSharePayload }, ...attached });
    await flushPromises();
    expect(getByTestId('mx-share-sheet-target-whatsapp').attributes('href')).toBe('https://example.com/whatsapp');
    expect(getByTestId('mx-share-sheet-target-instagram').element.tagName).toBe('BUTTON');
    await getByTestId('mx-share-sheet-copy').trigger('click');
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith(mockSharePayload.url);
    expect(wrapper.emitted('copied')).toHaveLength(1);
  });
});

describe('MxBlobField', () => {
  const positions = () =>
    allByTestId('mx-blob-field-blob').map((blob) => [blob.element.style.getPropertyValue('--mx-blob-x'), blob.element.style.getPropertyValue('--mx-blob-y')].join());

  it('draws the blobs asked for, the same way for the same seed', () => {
    const first = mount(MxBlobField, { props: { count: 5, seed: 'perfil' }, ...attached });
    const drawn = positions();
    expect(drawn).toHaveLength(5);
    first.unmount();
    mount(MxBlobField, { props: { count: 5, seed: 'perfil' }, ...attached });
    expect(positions()).toEqual(drawn);
  });

  it('changes the layout with the seed', () => {
    const first = mount(MxBlobField, { props: { count: 5, seed: 'perfil' }, ...attached });
    const drawn = positions();
    first.unmount();
    mount(MxBlobField, { props: { count: 5, seed: 'paradas' }, ...attached });
    expect(positions()).not.toEqual(drawn);
  });
});
