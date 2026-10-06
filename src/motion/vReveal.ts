import type { Directive, DirectiveBinding } from 'vue';
import { prefersReducedMotion } from './reducedMotion';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'pop' | 'tilt';

export interface RevealOptions {
  delay?: number;
  variant?: RevealVariant;
}

type RevealValue = number | RevealOptions | false | undefined;

const VISIBLE = 'mx-reveal--in';

let observer: IntersectionObserver | null = null;

const getObserver = (): IntersectionObserver | null => {
  if (typeof IntersectionObserver === 'undefined') return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(VISIBLE);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  );
  return observer;
};

const options = (binding: DirectiveBinding<RevealValue>): Required<RevealOptions> => {
  const value = binding.value === false ? undefined : binding.value;
  if (typeof value === 'number') return { delay: value, variant: 'up' };
  return { delay: value?.delay ?? 0, variant: value?.variant ?? 'up' };
};

export const vReveal: Directive<HTMLElement, RevealValue> = {
  mounted(element, binding) {
    if (binding.value === false) return;
    const { delay, variant } = options(binding);
    element.classList.add('mx-reveal', `mx-reveal--${variant}`);
    element.style.setProperty('--mx-reveal-delay', `${delay}ms`);

    const io = getObserver();
    if (!io || prefersReducedMotion()) {
      element.classList.add(VISIBLE);
      return;
    }
    io.observe(element);
  },
  unmounted(element) {
    observer?.unobserve(element);
  },
};
