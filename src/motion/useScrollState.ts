import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useScrollState(threshold = 12) {
  const scrolled = ref(false);
  const direction = ref<'up' | 'down'>('up');
  let last = 0;
  let frame = 0;

  const update = () => {
    const current = window.scrollY;
    scrolled.value = current > threshold;
    if (Math.abs(current - last) > 4) direction.value = current > last ? 'down' : 'up';
    last = current;
  };

  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  onMounted(() => {
    last = window.scrollY;
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
  });

  return { scrolled, direction };
}
