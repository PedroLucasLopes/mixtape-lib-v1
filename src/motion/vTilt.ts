import type { Directive } from 'vue';
import { prefersCoarsePointer, prefersReducedMotion } from './reducedMotion';

export interface TiltOptions {
  max?: number;
  glare?: boolean;
  lift?: number;
}

type TiltValue = TiltOptions | false | undefined;

interface TiltState {
  move: (event: PointerEvent) => void;
  leave: () => void;
  frame: number;
}

const states = new WeakMap<HTMLElement, TiltState>();

export const vTilt: Directive<HTMLElement, TiltValue> = {
  mounted(element, binding) {
    if (binding.value === false || prefersReducedMotion() || prefersCoarsePointer()) return;
    const options = binding.value ?? {};
    const max = options.max ?? 8;
    const lift = options.lift ?? 6;

    element.classList.add('mx-tilt');
    if (options.glare) element.classList.add('mx-tilt--glare');

    const state: TiltState = {
      frame: 0,
      move: (event) => {
        cancelAnimationFrame(state.frame);
        state.frame = requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          element.classList.add('mx-tilt--active');
          element.style.setProperty('--mx-tilt-x', `${(-y * max).toFixed(2)}deg`);
          element.style.setProperty('--mx-tilt-y', `${(x * max).toFixed(2)}deg`);
          element.style.setProperty('--mx-tilt-lift', `${-lift}px`);
          element.style.setProperty('--mx-glare-x', `${((x + 0.5) * 100).toFixed(1)}%`);
          element.style.setProperty('--mx-glare-y', `${((y + 0.5) * 100).toFixed(1)}%`);
        });
      },
      leave: () => {
        cancelAnimationFrame(state.frame);
        element.classList.remove('mx-tilt--active');
        element.style.setProperty('--mx-tilt-x', '0deg');
        element.style.setProperty('--mx-tilt-y', '0deg');
        element.style.setProperty('--mx-tilt-lift', '0px');
      },
    };

    states.set(element, state);
    element.addEventListener('pointermove', state.move);
    element.addEventListener('pointerleave', state.leave);
  },
  unmounted(element) {
    const state = states.get(element);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    element.removeEventListener('pointermove', state.move);
    element.removeEventListener('pointerleave', state.leave);
    states.delete(element);
  },
};
