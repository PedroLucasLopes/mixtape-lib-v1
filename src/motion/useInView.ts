import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useInView(target: Ref<HTMLElement | null | undefined>, options: { once?: boolean; rootMargin?: string } = {}) {
  const inView = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const element = target.value;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      inView.value = true;
      return;
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = entry?.isIntersecting ?? false;
        if (inView.value && options.once !== false) observer?.disconnect();
      },
      { rootMargin: options.rootMargin ?? '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(element);
  });

  onBeforeUnmount(() => observer?.disconnect());

  return inView;
}
