<script setup lang="ts">
import { computed } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { BRANDS, type BrandName, isBrandName } from './brands';
import MxBrandIcon from './MxBrandIcon.vue';

const ORDER: readonly BrandName[] = [
  'spotify',
  'appleMusic',
  'youtubeMusic',
  'deezer',
  'tidal',
  'amazonMusic',
  'soundcloud',
  'bandcamp',
  'qobuz',
  'youtube',
  'official',
  'instagram',
  'x',
  'twitter',
  'facebook',
  'tiktok',
  'threads',
  'bluesky',
  'wikipedia',
  'wikidata',
  'lastfm',
  'discogs',
];

const props = withDefaults(
  defineProps<{
    links: Readonly<Record<string, string | undefined>>;
    only?: readonly BrandName[];
    labels?: Readonly<Partial<Record<BrandName, string>>>;
    compact?: boolean;
  }>(),
  { compact: false },
);

const { t } = useMixtapeText();

const entries = computed(() =>
  ORDER.filter((name) => (props.only ? props.only.includes(name) : true))
    .map((name) => ({ name, url: props.links[name] }))
    .filter((entry): entry is { name: BrandName; url: string } => typeof entry.url === 'string' && entry.url.length > 0 && isBrandName(entry.name))
    .map((entry) => ({
      ...entry,
      label: props.labels?.[entry.name] ?? (entry.name === 'official' ? t('media.officialSite') : BRANDS[entry.name].title),
    })),
);
</script>

<template>
  <ul v-if="entries.length" data-testid="mx-streaming-links" class="mx-streaming" :class="{ 'mx-streaming--compact': compact }">
    <li v-for="(entry, index) in entries" :key="entry.name" class="mx-streaming__item" :style="{ animationDelay: `${index * 50}ms` }">
      <a
        :data-testid="`mx-streaming-links-${entry.name}`"
        class="mx-streaming__link"
        :href="entry.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="compact ? t('media.openIn', { service: entry.label }) : undefined"
        :title="compact ? entry.label : undefined"
      >
        <MxBrandIcon :name="entry.name" :size="compact ? 20 : 22" colored />
        <span v-if="!compact" class="mx-streaming__label">{{ entry.label }}</span>
        <span class="mx-sr-only">{{ t('common.newTab') }}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.mx-streaming {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-streaming__item {
  animation: mx-pop-in var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy) both;
}

.mx-streaming__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px 0 12px;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--mx-on-surface);
  text-decoration: none;
  background: var(--mx-glass);
  border: 1px solid var(--mx-glass-border);
  border-radius: var(--mx-radius-pill);
  transition:
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy),
    border-color var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-streaming--compact .mx-streaming__link {
  justify-content: center;
  width: 44px;
  padding: 0;
}

.mx-streaming__link:hover {
  border-color: var(--mx-outline-strong);
  transform: translateY(-3px) rotate(-2deg);
}

.mx-streaming__link:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .mx-streaming__item {
    animation: none;
  }

  .mx-streaming__link,
  .mx-streaming__link:hover {
    transition: none;
    transform: none;
  }
}
</style>
