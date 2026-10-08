<script setup lang="ts">
import type { LinkTarget } from '../links/links';
import MxLink from './MxLink.vue';

export interface FooterLink {
  label: string;
  to?: LinkTarget;
  href?: string;
}

export interface FooterColumn {
  title: string;
  links: readonly FooterLink[];
}

defineProps<{ columns: readonly FooterColumn[]; label: string }>();
</script>

<template>
  <div data-testid="mx-footer" class="mx-footer">
    <div class="mx-footer__inner">
      <div class="mx-footer__brand">
        <slot name="brand" />
      </div>
      <nav class="mx-footer__columns" :aria-label="label">
        <div v-for="column in columns" :key="column.title" class="mx-footer__column">
          <p class="mx-footer__title">{{ column.title }}</p>
          <ul class="mx-footer__links">
            <li v-for="link in column.links" :key="link.label">
              <MxLink :to="link.to" :href="link.href" data-testid="mx-footer-link" class="mx-footer__link">{{ link.label }}</MxLink>
            </li>
          </ul>
        </div>
      </nav>
      <div v-if="$slots.default" class="mx-footer__legal">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mx-footer {
  margin-top: clamp(32px, 6vw, 72px);
  padding: clamp(32px, 5vw, 56px) clamp(16px, 4vw, 40px);
  color: var(--mx-on-surface);
  background: var(--mx-background-alt);
  border-top: 1px solid var(--mx-outline);
}

.mx-footer__inner {
  display: grid;
  gap: 32px;
  max-width: var(--mx-content-max);
  margin: 0 auto;
}

@media (min-width: 840px) {
  .mx-footer__inner {
    grid-template-columns: minmax(200px, 1fr) 2fr;
  }

  .mx-footer__legal {
    grid-column: 1 / -1;
  }
}

.mx-footer__columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 24px;
}

.mx-footer__title {
  margin: 0 0 10px;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-footer__links {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-footer__link {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}

.mx-footer__link:hover {
  color: var(--mx-link);
  text-decoration: underline;
}

.mx-footer__link:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

.mx-footer__legal {
  padding-top: 24px;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--mx-on-surface-muted);
  border-top: 1px solid var(--mx-outline);
}

.mx-footer__legal :deep(a) {
  color: var(--mx-link);
}
</style>
