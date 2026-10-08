<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { formatDate, formatNumber } from '../format';
import { BADGE_TIER_METAL } from '../gamification/tiers';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useInView } from '../motion/useInView';
import { metals } from '../theme/tokens';

export interface BadgeNextTier {
  tier: number;
  tierName: string;
  threshold: number;
}

const props = withDefaults(
  defineProps<{
    name: string;
    description?: string;
    icon: string;
    tier: number;
    tierName?: string | null;
    value?: number;
    next?: BadgeNextTier | null;
    progress?: number;
    earnedAt?: string | null;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { description: '', tierName: null, value: 0, next: null, progress: 0, earnedAt: null, size: 'md' },
);

const { t, locale } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const locked = computed(() => props.tier <= 0);
const metal = computed(() => metals[BADGE_TIER_METAL[Math.max(0, Math.min(4, props.tier))] ?? 'demo']);
const ring = computed(() => Math.max(0, Math.min(1, props.progress)));
const circumference = 2 * Math.PI * 46;
const gradientId = `mx-badge-${useId()}`;
</script>

<template>
  <article
    ref="root"
    data-testid="mx-badge"
    class="mx-badge"
    :class="[`mx-badge--${size}`, { 'mx-badge--locked': locked, 'mx-badge--shown': inView }]"
  >
    <div class="mx-badge__medal" aria-hidden="true">
      <svg viewBox="0 0 100 100" class="mx-badge__svg">
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" :stop-color="metal[2]" />
            <stop offset="45%" :stop-color="metal[1]" />
            <stop offset="100%" :stop-color="metal[0]" />
          </linearGradient>
        </defs>
        <circle class="mx-badge__ring-track" cx="50" cy="50" r="46" />
        <circle
          v-if="next"
          class="mx-badge__ring"
          cx="50"
          cy="50"
          r="46"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference * (1 - ring)"
        />
        <path
          class="mx-badge__hex"
          d="M50 10 84.6 30v40L50 90 15.4 70V30Z"
          :fill="locked ? 'none' : `url(#${gradientId})`"
        />
      </svg>
      <span class="mx-badge__shine" />
      <VIcon class="mx-badge__icon" :icon="locked ? 'mdi-lock-outline' : icon" />
    </div>
    <div class="mx-badge__body">
      <h3 class="mx-badge__name">{{ name }}</h3>
      <p v-if="tierName && !locked" class="mx-badge__tier">
        <span class="mx-badge__dot" :style="{ background: metal[1] }" />
        {{ tierName }}
      </p>
      <p v-else-if="locked" class="mx-badge__tier">{{ t('gamification.locked') }}</p>
      <p v-if="description" class="mx-badge__description">{{ description }}</p>
      <p v-if="next" class="mx-badge__next">
        {{ t('gamification.badgeNext', { value: formatNumber(value, locale), threshold: formatNumber(next.threshold, locale), next: next.tierName }) }}
      </p>
      <p v-else-if="!locked" class="mx-badge__next">{{ t('gamification.maxTier') }}</p>
      <p v-if="earnedAt" class="mx-badge__earned">
        {{ t('gamification.earnedOn', { date: formatDate(earnedAt, locale) }) }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.mx-badge {
  --mx-badge-size: 88px;
  display: grid;
  grid-template-columns: var(--mx-badge-size) 1fr;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.mx-badge--sm { --mx-badge-size: 60px; }
.mx-badge--lg { --mx-badge-size: 112px; }

.mx-badge__medal {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--mx-badge-size);
  height: var(--mx-badge-size);
  overflow: hidden;
  border-radius: 50%;
  transform: scale(0.7) rotate(-20deg);
  opacity: 0;
  transition:
    transform var(--mx-spring-pop-duration) var(--mx-spring-pop),
    opacity var(--mx-duration-normal) var(--mx-ease-out);
}

.mx-badge--shown .mx-badge__medal {
  transform: none;
  opacity: 1;
}

.mx-badge__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.mx-badge__ring-track {
  fill: none;
  stroke: var(--mx-outline);
  stroke-width: 4;
}

.mx-badge__ring {
  fill: none;
  stroke: var(--mx-primary);
  stroke-width: 4;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 1200ms var(--mx-ease-out) 300ms;
}

.mx-badge__hex {
  stroke: color-mix(in srgb, var(--mx-on-surface) 25%, transparent);
  stroke-width: 1.5;
  stroke-linejoin: round;
}

.mx-badge--locked .mx-badge__hex {
  stroke: var(--mx-outline-strong);
  stroke-dasharray: 5 4;
}

.mx-badge__icon {
  position: relative;
  font-size: calc(var(--mx-badge-size) * 0.32);
  color: #15121f;
}

.mx-badge--locked .mx-badge__icon {
  color: var(--mx-on-surface-muted);
}

.mx-badge__shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-120%) skewX(-18deg);
}

.mx-badge:not(.mx-badge--locked):hover .mx-badge__shine {
  animation: mx-sheen 900ms var(--mx-ease-out);
}

.mx-badge__body {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.mx-badge__name {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  line-height: 1.2;
}

.mx-badge__tier {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-badge__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--mx-on-surface) 30%, transparent);
}

.mx-badge__description,
.mx-badge__next,
.mx-badge__earned {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--mx-on-surface-muted);
}

.mx-badge__next {
  font-weight: 700;
  color: var(--mx-on-surface);
}

@media (prefers-reduced-motion: reduce) {
  .mx-badge__medal,
  .mx-badge__ring {
    transform: none;
    opacity: 1;
    transition: none;
  }

  .mx-badge__ring {
    transform: rotate(-90deg);
  }

  .mx-badge:not(.mx-badge--locked):hover .mx-badge__shine {
    animation: none;
  }
}
</style>
