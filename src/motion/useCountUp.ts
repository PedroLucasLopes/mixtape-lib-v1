import { onBeforeUnmount, ref, type Ref, watch } from 'vue';
import { prefersReducedMotion } from './reducedMotion';

export interface CountUpOptions {
  duration?: number;
  enabled?: Ref<boolean>;
}

export function useCountUp(target: Ref<number | null | undefined>, options: CountUpOptions = {}) {
  const shown = ref<number | null>(null);
  const duration = options.duration ?? 900;
  let frame = 0;
  let from = 0;

  const run = (next: number) => {
    cancelAnimationFrame(frame);
    if (prefersReducedMotion() || from === next) {
      shown.value = next;
      from = next;
      return;
    }
    const start = performance.now();
    const origin = from;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      shown.value = origin + (next - origin) * eased;
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        from = next;
      }
    };
    frame = requestAnimationFrame(step);
  };

  watch(
    [target, () => options.enabled?.value ?? true],
    ([value, enabled]) => {
      if (typeof value !== 'number') {
        shown.value = null;
        return;
      }
      if (enabled) run(value);
      else if (shown.value === null) shown.value = 0;
    },
    { immediate: true },
  );

  onBeforeUnmount(() => cancelAnimationFrame(frame));

  return shown;
}
