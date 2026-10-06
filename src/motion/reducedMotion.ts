import { onBeforeUnmount, ref } from 'vue';

const QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true;
}

export function usePrefersReducedMotion() {
  const reduced = ref(prefersReducedMotion());
  if (typeof window === 'undefined' || !window.matchMedia) return reduced;

  const query = window.matchMedia(QUERY);
  const update = (event: MediaQueryListEvent) => {
    reduced.value = event.matches;
  };
  query.addEventListener('change', update);
  onBeforeUnmount(() => query.removeEventListener('change', update));
  return reduced;
}

export function prefersCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true;
}
