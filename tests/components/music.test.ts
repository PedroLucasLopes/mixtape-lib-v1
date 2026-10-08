import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import MxGroupReviewCard from '../../src/components/MxGroupReviewCard.vue';
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
