<script setup lang="ts">
import { computed } from 'vue';
import { formatDuration } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { vReveal } from '../motion/vReveal';
import MxLink from './MxLink.vue';

export interface TrackListEntry {
  id: string;
  title: string;
  number: string;
  disc: number;
  durationMs: number | null;
  artistCredit?: string | null;
  to?: LinkTarget;
}

const props = withDefaults(
  defineProps<{
    tracks: readonly TrackListEntry[];
    albumArtist?: string | null;
    highlightId?: string | null;
    label?: string;
  }>(),
  { albumArtist: null, highlightId: null },
);

const { t } = useMixtapeText();

const discs = computed(() => {
  const groups = new Map<number, TrackListEntry[]>();
  for (const track of props.tracks) {
    groups.set(track.disc, [...(groups.get(track.disc) ?? []), track]);
  }
  return [...groups.entries()].map(([disc, tracks]) => ({ disc, tracks }));
});
</script>

<template>
  <div data-testid="mx-track-list" class="mx-track-list">
    <section v-for="group in discs" :key="group.disc" class="mx-track-list__disc">
      <h3 v-if="discs.length > 1" class="mx-track-list__disc-title">
        <VIcon icon="mdi-album" size="18" aria-hidden="true" />
        {{ t('media.disc', { number: group.disc }) }}
      </h3>
      <ol class="mx-track-list__tracks" :aria-label="label">
        <li
          v-for="(track, index) in group.tracks"
          :key="track.id + track.number"
          v-reveal="{ delay: Math.min(index, 12) * 35, variant: 'left' }"
          data-testid="mx-track-list-track"
          class="mx-track-list__track"
          :class="{ 'mx-track-list__track--highlight': track.id === highlightId }"
        >
          <span class="mx-track-list__number" aria-hidden="true">
            <span class="mx-track-list__digits">{{ track.number }}</span>
            <span class="mx-track-list__eq"><i /><i /><i /></span>
          </span>
          <span class="mx-track-list__info">
            <MxLink v-if="track.to !== undefined" :to="track.to" data-testid="mx-track-list-title" class="mx-track-list__title">{{ track.title }}</MxLink>
            <span v-else data-testid="mx-track-list-title" class="mx-track-list__title">{{ track.title }}</span>
            <span v-if="track.artistCredit && track.artistCredit !== albumArtist" class="mx-track-list__artist">{{ track.artistCredit }}</span>
          </span>
          <span v-if="track.durationMs" class="mx-track-list__duration">
            <span class="mx-sr-only">{{ t('media.duration') }}</span>
            {{ formatDuration(track.durationMs) }}
          </span>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.mx-track-list {
  display: grid;
  gap: 18px;
}

.mx-track-list__disc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  font-size: var(--mx-text-overline);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-track-list__tracks {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-track-list__track {
  position: relative;
  display: grid;
  grid-template-columns: 2.4em minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 6px 12px;
  border-radius: var(--mx-radius-sm);
  transition: background-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-track-list__track:hover,
.mx-track-list__track:focus-within {
  background: var(--mx-surface-variant);
}

.mx-track-list__track--highlight {
  background: color-mix(in srgb, var(--mx-primary) 16%, transparent);
}

.mx-track-list__number {
  position: relative;
  display: grid;
  place-items: center;
  font-family: var(--mx-font-display);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--mx-on-surface-muted);
}

.mx-track-list__eq {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-bottom: 4px;
  opacity: 0;
}

.mx-track-list__eq i {
  width: 3px;
  height: 14px;
  background: var(--mx-primary);
  border-radius: 2px;
  transform-origin: bottom;
  animation: mx-track-eq 700ms ease-in-out infinite alternate;
}

.mx-track-list__eq i:nth-child(2) { animation-delay: -250ms; }
.mx-track-list__eq i:nth-child(3) { animation-delay: -450ms; }

.mx-track-list__track:hover .mx-track-list__digits,
.mx-track-list__track:focus-within .mx-track-list__digits {
  opacity: 0;
}

.mx-track-list__track:hover .mx-track-list__eq,
.mx-track-list__track:focus-within .mx-track-list__eq {
  opacity: 1;
}

.mx-track-list__info {
  display: grid;
  min-width: 0;
}

.mx-track-list__title {
  overflow: hidden;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.mx-track-list__title::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--mx-radius-sm);
}

a.mx-track-list__title:focus-visible {
  outline: none;
}

a.mx-track-list__title:focus-visible::after {
  outline: 3px solid var(--mx-focus);
  outline-offset: 1px;
}

.mx-track-list__artist {
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-track-list__duration {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--mx-on-surface-muted);
}

@keyframes mx-track-eq {
  from { transform: scaleY(0.25); }
  to { transform: scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .mx-track-list__eq i {
    animation: none;
  }
}
</style>
