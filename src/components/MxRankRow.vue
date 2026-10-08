<script setup lang="ts">
import { computed } from 'vue';
import { formatNumber } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { metals } from '../theme/tokens';
import MxAvatar from './MxAvatar.vue';
import MxLink from './MxLink.vue';
import MxSplitBar from './MxSplitBar.vue';

const props = withDefaults(
  defineProps<{
    position: number;
    name: string;
    username: string;
    avatarUrl?: string | null;
    tier?: string | null;
    tierLabel?: string | null;
    total: number;
    participation: number;
    notoriety: number;
    highlight?: boolean;
    to?: LinkTarget;
  }>(),
  { avatarUrl: null, tier: null, tierLabel: null, highlight: false },
);

const { t, locale } = useMixtapeText();

const medal = computed(() => (props.position === 1 ? 'gold' : props.position === 2 ? 'silver' : props.position === 3 ? 'bronze' : null));
const medalGradient = computed(() => {
  if (!medal.value) return undefined;
  const [dark, mid, light] = metals[medal.value];
  return `linear-gradient(135deg, ${light}, ${mid}, ${dark})`;
});
</script>

<template>
  <li data-testid="mx-rank-row" class="mx-rank-row" :class="{ 'mx-rank-row--highlight': highlight, 'mx-rank-row--podium': medal }">
    <span class="mx-rank-row__position" :style="medalGradient ? { background: medalGradient } : undefined">
      <span class="mx-sr-only">{{ t('rank.position', { position }) }}</span>
      <span aria-hidden="true">{{ position }}</span>
    </span>
    <component :is="to ? MxLink : 'div'" :to="to" data-testid="mx-rank-row-person" class="mx-rank-row__person">
      <MxAvatar :name="name" :src="avatarUrl" :seed="username" :tier="tier" :size="44" decorative />
      <span class="mx-rank-row__identity">
        <span class="mx-rank-row__name">{{ name }}</span>
        <span class="mx-rank-row__username">@{{ username }}<template v-if="tierLabel"> · {{ tierLabel }}</template></span>
      </span>
    </component>
    <div class="mx-rank-row__split">
      <MxSplitBar
        :segments="[
          { label: t('rank.participation'), value: participation, color: 'var(--mx-primary)' },
          { label: t('rank.notoriety'), value: notoriety, color: 'var(--mx-secondary)' },
        ]"
        :legend="false"
        :height="8"
      />
    </div>
    <span class="mx-rank-row__total">
      <strong>{{ formatNumber(total, locale) }}</strong>
      <span>{{ t('rank.points', { count: total }) }}</span>
    </span>
  </li>
</template>

<style scoped>
.mx-rank-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(80px, 160px) auto;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: var(--mx-radius-md);
  transition:
    background-color var(--mx-duration-fast) var(--mx-ease-out),
    transform var(--mx-spring-smooth-duration) var(--mx-spring-smooth);
}

.mx-rank-row:hover {
  background: var(--mx-surface-variant);
  transform: translateX(4px);
}

.mx-rank-row--highlight {
  background: color-mix(in srgb, var(--mx-primary) 14%, transparent);
  box-shadow: inset 0 0 0 2px var(--mx-primary);
}

.mx-rank-row__position {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  font-family: var(--mx-font-display);
  font-size: 1.125rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--mx-on-surface);
  background: var(--mx-surface-variant);
  border-radius: 50%;
}

.mx-rank-row--podium .mx-rank-row__position {
  color: #15121f;
}

.mx-rank-row__person {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

a.mx-rank-row__person:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
  border-radius: var(--mx-radius-sm);
}

.mx-rank-row__identity {
  display: grid;
  min-width: 0;
}

.mx-rank-row__name {
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-rank-row__username {
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-rank-row__total {
  display: grid;
  justify-items: end;
  font-size: 0.75rem;
  color: var(--mx-on-surface-muted);
}

.mx-rank-row__total strong {
  font-family: var(--mx-font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--mx-on-surface);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 600px) {
  .mx-rank-row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .mx-rank-row__split {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-rank-row,
  .mx-rank-row:hover {
    transition: none;
    transform: none;
  }
}
</style>
