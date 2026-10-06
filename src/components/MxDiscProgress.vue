<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatNumber } from '../format';
import { metalForTier } from '../gamification/tiers';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { useInView } from '../motion/useInView';
import { metals } from '../theme/tokens';
import MxDiscTier from './MxDiscTier.vue';

export interface NextDisc {
  tier: string;
  label: string;
  minReviews: number;
  remaining: number;
}

const props = withDefaults(
  defineProps<{
    tier: string;
    label: string;
    reviews: number;
    next: NextDisc | null;
    progress: number;
    compact?: boolean;
  }>(),
  { compact: false },
);

const { t, locale } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const nextMetal = computed(() => metals[metalForTier(props.next?.tier ?? props.tier)]);
const percent = computed(() => Math.round(Math.max(0, Math.min(1, props.progress)) * 100));
</script>

<template>
  <div ref="root" class="mx-disc-progress" :class="{ 'mx-disc-progress--shown': inView, 'mx-disc-progress--compact': compact }">
    <MxDiscTier :tier="tier" :label="label" :size="compact ? 40 : 64" spinning />
    <div class="mx-disc-progress__body">
      <div
        class="mx-disc-progress__track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="percent"
        :aria-label="next ? t('gamification.progressTo', { next: next.label }) : t('gamification.maxTier')"
      >
        <span
          class="mx-disc-progress__fill"
          :style="{
            '--mx-progress': `${percent}%`,
            background: `linear-gradient(90deg, ${nextMetal[0]}, ${nextMetal[1]}, ${nextMetal[2]})`,
          }"
        />
      </div>
      <p class="mx-disc-progress__text">
        <template v-if="next">
          {{ t('gamification.remaining', { count: next.remaining, formatted: formatNumber(next.remaining, locale), next: next.label }) }}
        </template>
        <template v-else>{{ t('gamification.maxTier') }}</template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.mx-disc-progress {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.mx-disc-progress__body {
  display: grid;
  flex: 1;
  gap: 8px;
  min-width: 0;
}

.mx-disc-progress__track {
  position: relative;
  height: 14px;
  overflow: hidden;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
  box-shadow: inset 0 0 0 1px var(--mx-outline);
}

.mx-disc-progress--compact .mx-disc-progress__track {
  height: 10px;
}

.mx-disc-progress__fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--mx-progress);
  border-radius: inherit;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1100ms var(--mx-ease-out) 150ms;
}

.mx-disc-progress__fill::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  animation: mx-sheen 2.6s var(--mx-ease-in) 1.4s infinite;
}

.mx-disc-progress--shown .mx-disc-progress__fill {
  transform: scaleX(1);
}

.mx-disc-progress__text {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--mx-on-surface-muted);
}

@media (prefers-reduced-motion: reduce) {
  .mx-disc-progress__fill {
    transform: none;
    transition: none;
  }

  .mx-disc-progress__fill::after {
    animation: none;
  }
}
</style>
