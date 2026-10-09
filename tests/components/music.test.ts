import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import MxCrate from '../../src/components/MxCrate.vue';
import MxGroupReviewCard from '../../src/components/MxGroupReviewCard.vue';
import MxItemCard from '../../src/components/MxItemCard.vue';
import MxPagedGrid from '../../src/components/MxPagedGrid.vue';
import MxReviewCard from '../../src/components/MxReviewCard.vue';
import MxRotator from '../../src/components/MxRotator.vue';
import MxStreamingLinks from '../../src/components/MxStreamingLinks.vue';
import MxTrackList from '../../src/components/MxTrackList.vue';
import { mockAlbums, mockDiscography, mockReviewBody, mockTracks, mockUsers } from '../../src/mocks';
import { allByTestId, attached, getByTestId, queryByTestId } from '../dom';
import { author, groupEntries, subject } from '../fixtures';
import { mediaQueries, REDUCED_MOTION } from '../media';

afterEach(() => {
  vi.useRealTimers();
});

describe('MxRotator', () => {
  const items = mockAlbums.slice(0, 3);
  const slots = { default: '<template #default="{ item }">{{ item.title }}</template>' };
  const current = () => allByTestId('mx-rotator-slide').findIndex((slide) => slide.attributes('data-current') === 'true');
  const show = async () => {
    mount(MxRotator, { props: { items, label: 'Outras avaliações', interval: 10_000 }, slots, ...attached });
    await flushPromises();
  };

  it('shows one item at a time and moves on by itself', async () => {
    vi.useFakeTimers();
    await show();
    const slides = allByTestId('mx-rotator-slide');
    expect(slides).toHaveLength(3);
    expect(slides.filter((slide) => slide.attributes('inert') === undefined)).toHaveLength(1);
    expect(current()).toBe(0);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(current()).toBe(1);
  });

  it('stops when paused and jumps with the dots', async () => {
    vi.useFakeTimers();
    await show();
    await getByTestId('mx-rotator-toggle').trigger('click');
    await vi.advanceTimersByTimeAsync(30_000);
    expect(current()).toBe(0);
    await allByTestId('mx-rotator-dot')[2]!.trigger('click');
    expect(current()).toBe(2);
    expect(allByTestId('mx-rotator-dot')[2]!.attributes('aria-current')).toBe('true');
  });

  it('starts paused for people who prefer less motion', async () => {
    vi.useFakeTimers();
    mediaQueries.set(REDUCED_MOTION, true);
    await show();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(current()).toBe(0);
  });
});

describe('MxReviewCard', () => {
  const review = { rating: 4.5, body: mockReviewBody, createdAt: '2026-10-05T09:42:00Z', likes: 12, author: author(mockUsers[0]), item: subject };

  it('can be liked by other people', async () => {
    const wrapper = mount(MxReviewCard, { props: { ...review, canLike: true }, ...attached });
    await getByTestId('mx-review-card-like').trigger('click');
    expect(wrapper.emitted('like')).toEqual([[true]]);
  });

  it('links the author and the subject and marks a private review', () => {
    mount(MxReviewCard, { props: { ...review, visibility: 'private' }, ...attached });
    expect(getByTestId('mx-review-card-author').attributes('href')).toBe('/u/ana.souza');
    expect(getByTestId('mx-review-card-item').attributes('href')).toBe('/albums/a1');
    expect(getByTestId('mx-review-card').text()).toContain('Só você vê');
    expect(getByTestId('mx-review-card-like').element.tagName).toBe('SPAN');
  });
});

describe('MxGroupReviewCard', () => {
  const group = { name: 'Galera do Vinil', to: '/galeras/vinil' };

  it('sends the like with the entry it belongs to', async () => {
    const wrapper = mount(MxGroupReviewCard, { props: { group, item: subject, rating: 4.5, entries: groupEntries }, ...attached });
    expect(allByTestId('mx-group-review-card-entry')).toHaveLength(3);
    await allByTestId('mx-group-review-card-like')[1]!.trigger('click');
    expect(wrapper.emitted('like')).toEqual([['g2', true]]);
  });

  it('says when nobody has rated yet', () => {
    mount(MxGroupReviewCard, { props: { group, item: subject, rating: null, entries: [] }, ...attached });
    expect(getByTestId('mx-group-review-card-empty').exists()).toBe(true);
    expect(queryByTestId('mx-group-review-card-entry')).toBeNull();
  });
});

describe('MxStreamingLinks', () => {
  it('lists the services that have a link, always in the same order', () => {
    mount(MxStreamingLinks, { props: { links: { deezer: 'https://example.com/deezer', spotify: 'https://example.com/spotify', other: 'https://example.com' } }, ...attached });
    const ids = [...document.querySelectorAll('[data-testid^="mx-streaming-links-"]')].map((link) => link.getAttribute('data-testid'));
    expect(ids).toEqual(['mx-streaming-links-spotify', 'mx-streaming-links-deezer']);
    expect(getByTestId('mx-streaming-links-spotify').attributes('target')).toBe('_blank');
  });

  it('renders nothing without links', () => {
    mount(MxStreamingLinks, { props: { links: {} }, ...attached });
    expect(queryByTestId('mx-streaming-links')).toBeNull();
  });
});

describe('MxTrackList', () => {
  it('lists every track and highlights the one asked for', () => {
    mount(MxTrackList, { props: { tracks: mockTracks, albumArtist: 'Banda Lúmen', highlightId: 't5' }, ...attached });
    const tracks = allByTestId('mx-track-list-track');
    expect(tracks).toHaveLength(mockTracks.length);
    expect(tracks[4]!.classes()).toContain('mx-track-list__track--highlight');
    expect(getByTestId('mx-track-list').text()).toContain('Disco 2');
  });
});

describe('MxCrate', () => {
  const records = mockDiscography.map((item) => ({ key: item.id, title: item.title, subtitle: item.artist, cover: item.cover }));
  const slots = { pulled: '<template #pulled="{ record }"><p data-testid="pulled-title">{{ record.title }}</p></template>' };
  const open = () => mount(MxCrate, { props: { records, label: 'Coleção de indie rock', depth: 6 }, slots, ...attached });
  const position = () => getByTestId('mx-crate').text().match(/(\d+) de 30/)?.[1];
  const states = () => allByTestId('mx-crate-record').map((record) => record.classes().find((name) => name.startsWith('mx-crate__record--')));
  const pointer = async (type: string, pointerType: string, clientY: number, clientX = 100) => {
    const event = new MouseEvent(type, { bubbles: type !== 'pointerenter' && type !== 'pointerleave', clientX, clientY });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    getByTestId('mx-crate-pile').element.dispatchEvent(event);
    await nextTick();
  };

  it('shows the record in front and a few edges behind it', () => {
    open();
    expect(allByTestId('mx-crate-record')).toHaveLength(7);
    expect(position()).toBe('1');
    expect(getByTestId('mx-crate-pile').attributes('aria-activedescendant')).toBe(allByTestId('mx-crate-record')[0]!.attributes('id'));
    expect(getByTestId('mx-crate-previous').attributes('disabled')).toBeDefined();
  });

  it('flips through with the buttons and the keyboard', async () => {
    open();
    await getByTestId('mx-crate-next').trigger('click');
    expect(position()).toBe('2');
    await getByTestId('mx-crate-pile').trigger('keydown', { key: 'ArrowDown' });
    expect(position()).toBe('3');
    await getByTestId('mx-crate-pile').trigger('keydown', { key: 'End' });
    expect(position()).toBe('30');
    expect(getByTestId('mx-crate-next').attributes('disabled')).toBeDefined();
  });

  it('moving the mouse up flips through the stack, and moving it down brings the records back', async () => {
    open();
    await pointer('pointerenter', 'mouse', 300);
    await pointer('pointermove', 'mouse', 300 - 26 * 3);
    expect(position()).toBe('4');
    expect(states().slice(0, 4)).toEqual(['mx-crate__record--gone', 'mx-crate__record--gone', 'mx-crate__record--front', 'mx-crate__record--behind']);
    await pointer('pointermove', 'mouse', 300 - 26);
    expect(position()).toBe('2');
    await pointer('pointermove', 'mouse', 400);
    expect(position()).toBe('1');
    await pointer('pointermove', 'mouse', 400 - 26);
    expect(position()).toBe('2');
  });

  it('pulls the record in front with a click and puts it back where it was', async () => {
    const wrapper = open();
    await getByTestId('mx-crate-next').trigger('click');
    await getByTestId('mx-crate-next').trigger('click');
    await getByTestId('mx-crate-pile').trigger('click');
    expect(wrapper.emitted('update:pulled')?.[0]).toEqual([records[2]!.key]);
    expect(getByTestId('pulled-title').text()).toBe(records[2]!.title);
    await getByTestId('mx-crate-put-back').trigger('click');
    expect(queryByTestId('mx-crate-pulled')).toBeNull();
    expect(position()).toBe('3');
  });

  it('pulls the record in front with Enter and puts it back with Escape', async () => {
    open();
    await getByTestId('mx-crate-pile').trigger('keydown', { key: 'Enter' });
    expect(getByTestId('pulled-title').text()).toBe(records[0]!.title);
    await getByTestId('mx-crate-pulled').trigger('keydown', { key: 'Escape' });
    expect(queryByTestId('mx-crate-pulled')).toBeNull();
  });

  it('open: the panel always shows the record in front and follows the stack, with no pulling', async () => {
    const wrapper = mount(MxCrate, { props: { records, label: 'Minha biblioteca', depth: 6, open: true }, slots, ...attached });
    expect(getByTestId('pulled-title').text()).toBe(records[0]!.title);
    expect(queryByTestId('mx-crate-pull')).toBeNull();
    expect(queryByTestId('mx-crate-put-back')).toBeNull();
    await pointer('pointerenter', 'mouse', 300);
    await pointer('pointermove', 'mouse', 300 - 26 * 2);
    expect(getByTestId('pulled-title').text()).toBe(records[2]!.title);
    await getByTestId('mx-crate-pile').trigger('click');
    await getByTestId('mx-crate-pile').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:pulled')).toBeUndefined();
    expect(getByTestId('mx-crate').text()).toContain('Suba o mouse pela pilha para folhear e desça para voltar.');
  });

  it('compact: only the stack, and the pulled record is left to the page to show', async () => {
    const wrapper = mount(MxCrate, { props: { records, label: 'Descubra', depth: 6, compact: true }, ...attached });
    expect(queryByTestId('mx-crate-next')).toBeNull();
    expect(getByTestId('mx-crate').text()).toContain('Disco 1 de 30');
    await getByTestId('mx-crate-pile').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:pulled')?.[0]).toEqual([records[0]!.key]);
    expect(queryByTestId('mx-crate-pulled')).toBeNull();
    expect(states()[0]).toBe('mx-crate__record--pulled');
  });

  it('on a touch screen, a swipe flips through and a tap pulls the record in front', async () => {
    open();
    await pointer('pointerdown', 'touch', 100, 200);
    await pointer('pointerup', 'touch', 104, 120);
    expect(position()).toBe('2');
    await getByTestId('mx-crate-pile').trigger('click');
    expect(queryByTestId('mx-crate-pulled')).toBeNull();
    await pointer('pointerdown', 'touch', 100, 100);
    await getByTestId('mx-crate-pile').trigger('click');
    expect(getByTestId('pulled-title').text()).toBe(records[1]!.title);
  });
});

describe('MxItemCard', () => {
  it('names where the listeners were counted', () => {
    mount(MxItemCard, { props: { title: 'Neon na Garagem', listeners: 4200, listenersSource: 'ListenBrainz' }, ...attached });
    expect(getByTestId('mx-item-card').text()).toMatch(/4,2\smil ouvintes no ListenBrainz/);
  });
});

describe('MxPagedGrid', () => {
  it('fills pages to the width and moves with the pager', async () => {
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400);
    mount(MxPagedGrid, {
      props: { items: mockDiscography.slice(0, 6), label: 'Discografia', rows: 2, minItemWidth: 160, gap: 20 },
      slots: { default: '<template #default="{ item }">{{ item.title }}</template>' },
      ...attached,
    });
    await nextTick();
    expect(allByTestId('mx-paged-grid-page')).toHaveLength(2);
    expect(allByTestId('mx-paged-grid-item')).toHaveLength(6);
    expect(getByTestId('mx-paged-grid-previous').attributes('disabled')).toBeDefined();
    await getByTestId('mx-paged-grid-next').trigger('click');
    expect(allByTestId('mx-paged-grid-number').map((number) => number.attributes('aria-current'))).toEqual([undefined, 'page']);
  });
});
