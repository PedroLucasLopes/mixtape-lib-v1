<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import { useInView } from '../motion/useInView';
import { metals } from '../theme/tokens';
import MxAvatar from './MxAvatar.vue';
import MxLink from './MxLink.vue';

export interface PodiumEntry {
  key: string;
  position: number;
  name: string;
  caption?: string;
  avatarUrl?: string | null;
  seed?: string;
  tier?: string | null;
  score?: string;
  to?: LinkTarget;
}

const props = defineProps<{ entries: readonly PodiumEntry[]; label?: string }>();

const { t } = useMixtapeText();
const root = ref<HTMLElement | null>(null);
const inView = useInView(root);

const MEDALS: Record<number, 'gold' | 'silver' | 'bronze'> = { 1: 'gold', 2: 'silver', 3: 'bronze' };

const ordered = computed(() =>
  [2, 1, 3]
    .map((position) => props.entries.find((entry) => entry.position === position))
    .filter((entry): entry is PodiumEntry => Boolean(entry)),
);

const metal = (position: number) => metals[MEDALS[position] ?? 'bronze'];
</script>

<template>
  <ol ref="root" data-testid="mx-podium" class="mx-podium" :class="{ 'mx-podium--shown': inView }" :aria-label="label">
    <li
      v-for="entry in ordered"
      :key="entry.key"
      :data-testid="`mx-podium-place-${entry.position}`"
      class="mx-podium__place"
      :class="`mx-podium__place--${entry.position}`"
      :style="{ '--mx-podium-metal-light': metal(entry.position)[2], '--mx-podium-metal': metal(entry.position)[1], '--mx-podium-metal-dark': metal(entry.position)[0] }"
    >
      <component :is="entry.to ? MxLink : 'div'" data-testid="mx-podium-person" :to="entry.to" class="mx-podium__person">
        <span class="mx-podium__avatar">
          <MxAvatar :name="entry.name" :src="entry.avatarUrl" :seed="entry.seed" :tier="entry.tier" :size="entry.position === 1 ? 84 : 66" decorative />
          <span class="mx-podium__medal" aria-hidden="true">{{ entry.position }}</span>
        </span>
        <span class="mx-podium__name">{{ entry.name }}</span>
        <span v-if="entry.caption" class="mx-podium__caption">{{ entry.caption }}</span>
      </component>
      <div class="mx-podium__step">
        <span class="mx-sr-only">{{ t('rank.position', { position: entry.position }) }}</span>
        <span v-if="entry.score" class="mx-podium__score">{{ entry.score }}</span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.mx-podium {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: clamp(8px, 2vw, 16px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-podium__place {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-width: 0;
}

.mx-podium__person {
  display: grid;
  justify-items: center;
  gap: 4px;
  min-width: 0;
  max-width: 100%;
  color: inherit;
  text-align: center;
  text-decoration: none;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--mx-duration-slow) var(--mx-ease-out),
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-podium__place--1 .mx-podium__person { transition-delay: 700ms; }
.mx-podium__place--2 .mx-podium__person { transition-delay: 450ms; }
.mx-podium__place--3 .mx-podium__person { transition-delay: 250ms; }

a.mx-podium__person:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
  border-radius: var(--mx-radius-sm);
}

.mx-podium__avatar {
  position: relative;
}

.mx-podium__medal {
  position: absolute;
  right: -6px;
  bottom: -4px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  font-family: var(--mx-font-display);
  font-size: 0.9rem;
  font-weight: 800;
  color: #15121f;
  background: linear-gradient(135deg, var(--mx-podium-metal-light), var(--mx-podium-metal), var(--mx-podium-metal-dark));
  border: 2px solid var(--mx-background);
  border-radius: 50%;
}

.mx-podium__name {
  max-width: 100%;
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-podium__caption {
  font-size: 0.8125rem;
  color: var(--mx-on-surface-muted);
}

.mx-podium__step {
  display: grid;
  place-items: start center;
  width: 100%;
  padding-top: 12px;
  background: linear-gradient(180deg, var(--mx-podium-metal-light), var(--mx-podium-metal) 55%, var(--mx-podium-metal-dark));
  border-radius: var(--mx-radius-md) var(--mx-radius-md) 6px 6px;
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.45);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-podium__place--1 .mx-podium__step { height: 150px; transition-delay: 500ms; }
.mx-podium__place--2 .mx-podium__step { height: 110px; transition-delay: 250ms; }
.mx-podium__place--3 .mx-podium__step { height: 80px; }

.mx-podium__score {
  font-family: var(--mx-font-display);
  font-size: clamp(1rem, 2.4vw, 1.375rem);
  font-weight: 800;
  color: #15121f;
}

.mx-podium--shown .mx-podium__step {
  transform: scaleY(1);
}

.mx-podium--shown .mx-podium__person {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .mx-podium__step,
  .mx-podium__person {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
