<script setup lang="ts">
import { useId } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { vReveal } from '../motion/vReveal';
import MxLink from './MxLink.vue';

withDefaults(
  defineProps<{
    title: string;
    eyebrow?: string;
    description?: string;
    moreTo?: LinkTarget;
    moreLabel?: string;
    headingLevel?: 2 | 3;
    reveal?: boolean;
  }>(),
  { headingLevel: 2, reveal: true },
);

const { t } = useMixtapeText();
const headingId = useId();
</script>

<template>
  <section data-testid="mx-section" class="mx-section" :aria-labelledby="headingId">
    <header v-reveal="reveal ? { variant: 'up' } : false" class="mx-section__header">
      <div class="mx-section__titles">
        <p v-if="eyebrow" class="mx-section__eyebrow">{{ eyebrow }}</p>
        <component :is="`h${headingLevel}`" :id="headingId" data-testid="mx-section-title" class="mx-section__title">{{ title }}</component>
        <p v-if="description" class="mx-section__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions || moreTo !== undefined" class="mx-section__actions">
        <slot name="actions" />
        <MxLink v-if="moreTo !== undefined" :to="moreTo" data-testid="mx-section-more" class="mx-section__more">
          {{ moreLabel ?? t('common.seeAll') }}
          <VIcon icon="mdi-arrow-right" size="18" aria-hidden="true" />
        </MxLink>
      </div>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.mx-section {
  display: grid;
  gap: clamp(16px, 2.4vw, 24px);
  min-width: 0;
}

.mx-section__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
}

.mx-section__titles {
  display: grid;
  gap: 6px;
  max-width: 72ch;
}

.mx-section__eyebrow {
  margin: 0;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mx-link);
}

.mx-section__title {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: var(--mx-text-h2);
  font-weight: 800;
  font-stretch: 88%;
  letter-spacing: var(--mx-tracking-title);
  line-height: 1.02;
}

h3.mx-section__title {
  font-size: var(--mx-text-h3);
}

.mx-section__description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--mx-on-surface-muted);
}

.mx-section__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

@media (min-width: 840px) and (hover: hover) {
  .mx-section:has(> .mx-rail) > .mx-section__header > .mx-section__actions {
    margin-inline-end: 88px;
  }
}

.mx-section__more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  padding: 0 4px;
  font-weight: 800;
  color: var(--mx-link);
  text-decoration: none;
}

.mx-section__more:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.mx-section__more:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
  border-radius: var(--mx-radius-sm);
}
</style>
