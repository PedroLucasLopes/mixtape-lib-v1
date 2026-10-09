<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { prefersCoarsePointer, prefersReducedMotion } from '../motion/reducedMotion';
import MxButton from './MxButton.vue';
import MxCover, { type CoverSources } from './MxCover.vue';
import MxIconButton from './MxIconButton.vue';

export interface CrateRecord {
  key: string;
  title: string;
  subtitle?: string | null;
  cover?: string | null;
  sources?: CoverSources | null;
  seed?: string;
}

type RecordState = 'pulled' | 'gone' | 'front' | 'behind';

const props = withDefaults(
  defineProps<{
    records: readonly CrateRecord[];
    label: string;
    depth?: number;
    compact?: boolean;
    open?: boolean;
  }>(),
  { depth: 9, compact: false, open: false },
);

const current = defineModel<number>({ default: 0 });
const pulled = defineModel<string | null>('pulled', { default: null });

defineSlots<{
  pulled?(props: { record: CrateRecord; index: number; close: () => void }): unknown;
}>();

const GONE_SHOWN = 2;
const SCRUB_STEP_PX = 26;
const SWIPE_MIN_PX = 40;

const { t } = useMixtapeText();
const id = useId();
const hintId = `${id}-hint`;
const pile = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const coarse = prefersCoarsePointer();
let pointerType = 'mouse';
let anchor: { index: number; y: number } | null = null;
let scrubbed: number | null = null;
let swipeStart: { x: number; y: number } | null = null;
let swiped = false;

const total = computed(() => props.records.length);
const clamp = (index: number) => Math.min(Math.max(index, 0), Math.max(total.value - 1, 0));
const front = computed(() => clamp(current.value));
const pulledIndex = computed(() => (pulled.value === null ? -1 : props.records.findIndex((record) => record.key === pulled.value)));
const pulledRecord = computed(() => (pulledIndex.value >= 0 ? props.records[pulledIndex.value]! : null));
const panelIndex = computed(() => {
  if (props.compact) return -1;
  if (props.open) return total.value > 0 ? front.value : -1;
  return pulledIndex.value;
});
const panelRecord = computed(() => (panelIndex.value >= 0 ? props.records[panelIndex.value]! : null));
const optionId = (index: number) => `${id}-record-${index}`;

const visible = computed(() => {
  const start = Math.max(0, front.value - GONE_SHOWN);
  const end = Math.min(total.value, front.value + props.depth + 1);
  return props.records.slice(start, end).map((record, offset) => ({ record, index: start + offset }));
});

const hint = computed(() => {
  if (props.open) return coarse ? t('crate.hintBrowseTouch') : t('crate.hintBrowse');
  return coarse ? t('crate.hintTouch') : t('crate.hint');
});

const status = computed(() => {
  const record = props.records[front.value];
  return record ? t('crate.status', { index: front.value + 1, total: total.value, title: record.title }) : '';
});

const hashOf = (key: string) => {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash);
};

const stateOf = (index: number): RecordState => {
  if (index === pulledIndex.value) return 'pulled';
  if (index < front.value) return 'gone';
  return index === front.value ? 'front' : 'behind';
};

const styleOf = (index: number, key: string) => {
  const state = stateOf(index);
  const depth = index - front.value;
  const hash = hashOf(key);
  let zIndex = 100 - depth;
  if (state === 'pulled') zIndex = 400;
  else if (state === 'gone') zIndex = 200 + depth;
  return {
    '--mx-crate-d': Math.max(depth, 0),
    '--mx-crate-tilt': `${((hash % 7) - 3) * 0.25}deg`,
    '--mx-crate-shift': `${((hash >> 3) % 9) - 4}px`,
    zIndex,
  };
};

const labelOf = (record: CrateRecord) => (record.subtitle ? `${record.title}, ${record.subtitle}` : record.title);

const show = (index: number) => {
  anchor = null;
  pulled.value = null;
  current.value = clamp(index);
};

const move = (step: number) => show(front.value + step);

const pull = (index: number) => {
  const record = props.records[index];
  if (!record || props.open) return;
  anchor = null;
  current.value = index;
  pulled.value = record.key;
  void nextTick(() => {
    panel.value?.focus({ preventScroll: true });
    panel.value?.scrollIntoView?.({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
};

const close = () => {
  if (pulled.value === null) return;
  pulled.value = null;
  void nextTick(() => pile.value?.focus({ preventScroll: true }));
};

const onEnter = (event: PointerEvent) => {
  pointerType = event.pointerType || 'mouse';
  anchor = pointerType === 'mouse' ? { index: front.value, y: event.clientY } : null;
};

const onMove = (event: PointerEvent) => {
  if ((event.pointerType || 'mouse') !== 'mouse' || pulledRecord.value || total.value === 0) return;
  if (!anchor) {
    anchor = { index: front.value, y: event.clientY };
    return;
  }
  const target = anchor.index + Math.trunc((anchor.y - event.clientY) / SCRUB_STEP_PX);
  const next = clamp(target);
  if (next !== target) anchor = { index: next, y: event.clientY };
  if (next === front.value) return;
  scrubbed = next;
  current.value = next;
};

const onLeave = () => {
  anchor = null;
};

const onPointerDown = (event: PointerEvent) => {
  pointerType = event.pointerType || 'mouse';
  swiped = false;
  swipeStart = pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
};

const onPointerUp = (event: PointerEvent) => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
  swiped = true;
  move(dx < 0 ? 1 : -1);
};

const onClick = () => {
  if (swiped) {
    swiped = false;
    return;
  }
  if (props.open) return;
  if (pulledRecord.value) close();
  else pull(front.value);
};

const onKeydown = (event: KeyboardEvent) => {
  const actions: Record<string, () => void> = {
    ArrowDown: () => move(1),
    ArrowRight: () => move(1),
    ArrowUp: () => move(-1),
    ArrowLeft: () => move(-1),
    PageDown: () => move(props.depth),
    PageUp: () => move(-props.depth),
    Home: () => show(0),
    End: () => show(total.value - 1),
    Enter: () => pull(front.value),
    ' ': () => pull(front.value),
    Escape: () => close(),
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
};

watch(current, (value) => {
  if (value !== scrubbed) anchor = null;
  scrubbed = null;
});

watch(
  () => props.records[0]?.key,
  () => {
    anchor = null;
    current.value = 0;
  },
);

watch(
  () => props.records.map((record) => record.key).join('\n'),
  () => {
    if (current.value > total.value - 1) current.value = clamp(current.value);
    if (pulled.value !== null && pulledIndex.value < 0) pulled.value = null;
  },
);
</script>

<template>
  <div
    data-testid="mx-crate"
    class="mx-crate"
    :class="{ 'mx-crate--pulled': pulledRecord, 'mx-crate--panel': panelRecord, 'mx-crate--compact': compact }"
    :style="{ '--mx-crate-depth': depth }"
  >
    <div class="mx-crate__layout">
      <div class="mx-crate__stage">
        <div
          ref="pile"
          data-testid="mx-crate-pile"
          class="mx-crate__pile"
          role="listbox"
          tabindex="0"
          :aria-label="label"
          :aria-describedby="hintId"
          :aria-activedescendant="total > 0 ? optionId(front) : undefined"
          @keydown="onKeydown"
          @pointerenter="onEnter"
          @pointermove="onMove"
          @pointerleave="onLeave"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @click="onClick"
        >
          <div
            v-for="entry in visible"
            :id="optionId(entry.index)"
            :key="entry.record.key"
            data-testid="mx-crate-record"
            class="mx-crate__record"
            :class="`mx-crate__record--${stateOf(entry.index)}`"
            :style="styleOf(entry.index, entry.record.key)"
            role="option"
            :aria-selected="entry.index === front"
            :aria-posinset="entry.index + 1"
            :aria-setsize="total"
            :aria-label="labelOf(entry.record)"
            :data-index="entry.index"
          >
            <MxCover
              :src="entry.record.cover ?? null"
              :sources="entry.record.sources ?? null"
              :title="entry.record.title"
              :seed="entry.record.seed ?? entry.record.key"
              radius="sm"
              :sizes="compact ? '112px' : '(max-width: 600px) 46vw, 248px'"
            />
            <span class="mx-crate__shade" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div
        v-if="panelRecord"
        ref="panel"
        data-testid="mx-crate-pulled"
        class="mx-crate__pulled"
        role="group"
        tabindex="-1"
        :aria-label="open ? t('crate.current', { title: panelRecord.title }) : t('crate.pulled', { title: panelRecord.title })"
        @keydown.esc.stop="close"
      >
        <div :key="panelRecord.key" class="mx-crate__panel-content">
          <slot name="pulled" :record="panelRecord" :index="panelIndex" :close="close">
            <p class="mx-crate__title">{{ panelRecord.title }}</p>
            <p v-if="panelRecord.subtitle" class="mx-crate__subtitle">{{ panelRecord.subtitle }}</p>
          </slot>
        </div>
        <MxButton
          v-if="!open"
          data-testid="mx-crate-put-back"
          class="mx-crate__put-back"
          icon="mdi-arrow-down"
          :label="t('crate.putBack')"
          size="sm"
          variant="ghost"
          @click="close"
        />
      </div>
    </div>

    <div v-if="total > 0 && !compact" class="mx-crate__controls">
      <MxIconButton
        data-testid="mx-crate-previous"
        icon="mdi-chevron-left"
        :label="t('crate.previous')"
        size="sm"
        :disabled="front === 0"
        @click="move(-1)"
      />
      <span class="mx-crate__counter" aria-hidden="true">{{ t('crate.position', { index: front + 1, total }) }}</span>
      <MxIconButton
        data-testid="mx-crate-next"
        icon="mdi-chevron-right"
        :label="t('crate.next')"
        size="sm"
        :disabled="front >= total - 1"
        @click="move(1)"
      />
      <MxButton
        v-if="!open"
        data-testid="mx-crate-pull"
        icon="mdi-arrow-up"
        :label="t('crate.pull')"
        size="sm"
        variant="tonal"
        @click="pull(front)"
      />
    </div>

    <p :id="hintId" class="mx-crate__hint" :class="{ 'mx-sr-only': compact }">{{ hint }}</p>
    <p class="mx-sr-only" aria-live="polite">{{ status }}</p>
  </div>
</template>

<style scoped>
.mx-crate {
  --mx-crate-size: clamp(168px, 46vw, 248px);
  --mx-crate-step: clamp(10px, 2.4vw, 14px);
  container-type: inline-size;
  display: grid;
  gap: 12px;
  min-width: 0;
}

.mx-crate--compact {
  --mx-crate-size: clamp(88px, 24vw, 112px);
  --mx-crate-step: 6px;
  gap: 0;
}

.mx-crate__layout {
  display: grid;
  gap: 18px;
  min-width: 0;
}

@container (min-width: 700px) {
  .mx-crate--panel .mx-crate__layout {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
    align-items: center;
  }
}

.mx-crate__stage {
  position: relative;
  isolation: isolate;
  min-width: 0;
  height: calc(var(--mx-crate-size) + var(--mx-crate-step) * var(--mx-crate-depth) + 40px);
}

.mx-crate--compact .mx-crate__stage {
  height: calc(var(--mx-crate-size) + var(--mx-crate-step) * var(--mx-crate-depth) + 24px);
}

.mx-crate--compact .mx-crate__stage::after {
  bottom: 2px;
  height: 18px;
}

.mx-crate__stage::after {
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: calc(var(--mx-crate-size) * 1.2);
  height: 28px;
  content: '';
  pointer-events: none;
  background: radial-gradient(closest-side, var(--mx-shadow), transparent);
  transform: translateX(-50%);
}

.mx-crate__pile {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
  border-radius: var(--mx-radius-lg);
  outline: none;
  touch-action: pan-y;
}

.mx-crate__pile:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 4px;
}

.mx-crate__record {
  position: absolute;
  bottom: 20px;
  left: calc(50% - var(--mx-crate-size) / 2);
  width: var(--mx-crate-size);
  aspect-ratio: 1;
  border-radius: var(--mx-radius-sm);
  box-shadow:
    0 -10px 18px -14px var(--mx-shadow),
    0 18px 30px -20px var(--mx-shadow);
  transform-origin: 50% 100%;
  transform: translate3d(var(--mx-crate-shift), calc(var(--mx-crate-d) * var(--mx-crate-step) * -1), 0) rotate(var(--mx-crate-tilt))
    scale(calc(1 - var(--mx-crate-d) * 0.02));
  transition:
    transform var(--mx-duration-normal) var(--mx-ease-out),
    opacity var(--mx-duration-normal) var(--mx-ease-out);
  animation: mx-crate-in var(--mx-duration-normal) var(--mx-ease-out) both;
}

.mx-crate__record::after {
  position: absolute;
  inset: 0;
  z-index: 5;
  content: '';
  pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--mx-on-surface) 30%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--mx-on-surface) 8%, transparent);
}

.mx-crate__record :deep(.mx-cover) {
  width: 100%;
}

.mx-crate--compact .mx-crate__record {
  bottom: 10px;
}

.mx-crate__record--gone {
  opacity: 0;
  transform: translate3d(0, 16%, 0) scale(1.06);
}

.mx-crate__record--pulled {
  box-shadow: 0 30px 50px -22px var(--mx-shadow);
  transform: translate3d(0, calc(var(--mx-crate-step) * -3), 0) rotate(-2deg) scale(1.03);
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-crate__shade {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: var(--mx-scrim);
  border-radius: inherit;
  opacity: min(calc(var(--mx-crate-d) * 0.08), 0.6);
  transition: opacity var(--mx-duration-fast) var(--mx-ease-out);
}

.mx-crate--pulled .mx-crate__record:not(.mx-crate__record--pulled) .mx-crate__shade {
  opacity: 0.7;
}

.mx-crate__pulled {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 18px;
  background: var(--mx-surface);
  border-radius: var(--mx-radius-lg);
  outline: none;
  animation: mx-crate-panel-in var(--mx-duration-normal) var(--mx-ease-out) both;
}

.mx-crate__pulled:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 3px;
}

.mx-crate__panel-content {
  display: grid;
  gap: 12px;
  min-width: 0;
  animation: mx-crate-swap var(--mx-duration-fast) var(--mx-ease-out) both;
}

.mx-crate__title {
  margin: 0;
  font-family: var(--mx-font-display);
  font-size: var(--mx-text-h3);
  font-weight: 800;
  letter-spacing: var(--mx-tracking-title);
  line-height: 1.1;
}

.mx-crate__subtitle {
  margin: 0;
  font-weight: 600;
  color: var(--mx-on-surface-muted);
}

.mx-crate__put-back {
  justify-self: start;
}

.mx-crate__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mx-crate__counter {
  min-width: 72px;
  font-size: 0.875rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--mx-on-surface-muted);
}

.mx-crate__hint {
  margin: 0;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--mx-on-surface-muted);
}

@keyframes mx-crate-in {
  from {
    opacity: 0;
  }
}

@keyframes mx-crate-panel-in {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0);
  }
}

@keyframes mx-crate-swap {
  from {
    opacity: 0;
    transform: translate3d(0, 6px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mx-crate__record,
  .mx-crate__record--pulled,
  .mx-crate__shade {
    transition: none;
  }

  .mx-crate__record,
  .mx-crate__pulled,
  .mx-crate__panel-content {
    animation: none;
  }
}
</style>
