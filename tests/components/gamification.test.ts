import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MxBadge from '../../src/components/MxBadge.vue';
import MxPersonCard from '../../src/components/MxPersonCard.vue';
import { mockBadges } from '../../src/mocks';
import { attached, getByTestId, queryByTestId } from '../dom';

const [gold, , platinum, locked] = mockBadges;

describe('MxBadge', () => {
  it('shows the ring and the way to the next tier by default', async () => {
    mount(MxBadge, { props: { ...gold! }, ...attached });
    await flushPromises();
    expect(queryByTestId('mx-badge-ring')).not.toBeNull();
    expect(getByTestId('mx-badge-next').text()).toContain('Platina');
    expect(getByTestId('mx-badge-tier').text()).toContain('Ouro');
  });

  it('keeps the tier and the date but hides the progress when shown to someone else', async () => {
    mount(MxBadge, { props: { ...gold!, showProgress: false }, ...attached });
    await flushPromises();
    expect(queryByTestId('mx-badge-ring')).toBeNull();
    expect(queryByTestId('mx-badge-next')).toBeNull();
    expect(getByTestId('mx-badge-tier').text()).toContain('Ouro');
    expect(queryByTestId('mx-badge-earned')).not.toBeNull();
  });

  it('does not claim the top tier when the next one is just unknown', async () => {
    const { next: _next, progress: _progress, value: _value, ...earned } = gold!;
    mount(MxBadge, { props: { ...earned, showProgress: false }, ...attached });
    await flushPromises();
    expect(document.body.textContent).not.toContain('máximo');
  });

  it('says so at the top tier, and a locked badge shows the way to the first one', async () => {
    mount(MxBadge, { props: { ...platinum! }, ...attached });
    mount(MxBadge, { props: { ...locked! }, ...attached });
    await flushPromises();
    const texts = [...document.querySelectorAll('[data-testid="mx-badge-next"]')].map((element) => element.textContent ?? '');
    expect(texts).toHaveLength(2);
    expect(texts[1]).toContain('Bronze');
  });
});

describe('MxPersonCard', () => {
  it('is one link to the profile with the name, the username and the disc', async () => {
    mount(MxPersonCard, { props: { name: 'Ana Souza', username: 'ana.souza', tier: 'GOLD', tierLabel: 'Disco de Ouro', to: '/u/ana.souza' }, ...attached });
    await flushPromises();
    const card = getByTestId('mx-person-card');
    expect(card.element.tagName).toBe('A');
    expect(card.attributes('href')).toBe('/u/ana.souza');
    expect(card.text()).toContain('Ana Souza');
    expect(card.text()).toContain('@ana.souza');
    expect(card.text()).toContain('Disco de Ouro');
    expect(document.querySelectorAll('a')).toHaveLength(1);
  });

  it('is not a link without a destination', async () => {
    mount(MxPersonCard, { props: { name: 'Ana Souza', username: 'ana.souza' }, ...attached });
    await flushPromises();
    expect(getByTestId('mx-person-card').element.tagName).toBe('DIV');
    expect(document.querySelector('a')).toBeNull();
  });
});
