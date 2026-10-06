<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import MxButton from './MxButton.vue';

const props = withDefaults(
  defineProps<{
    hasMore: boolean;
    loading?: boolean;
    auto?: boolean;
    label?: string;
    doneLabel?: string;
  }>(),
  { loading: false, auto: true },
);

const emit = defineEmits<{ load: [] }>();

const { t } = useMixtapeText();
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const request = () => {
  if (props.hasMore && !props.loading) emit('load');
};

onMounted(() => {
  if (!props.auto || typeof IntersectionObserver === 'undefined' || !sentinel.value) return;
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) request();
  }, { rootMargin: '400px 0px' });
  observer.observe(sentinel.value);
});

watch(
  () => props.hasMore,
  (hasMore) => {
    if (!hasMore) observer?.disconnect();
  },
);

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="sentinel" class="mx-load-more">
    <MxButton v-if="hasMore" variant="glass" icon="mdi-plus" :loading="loading" :label="label ?? t('common.loadMore')" @click="request" />
    <p v-else class="mx-load-more__done">{{ doneLabel ?? t('common.noMore') }}</p>
  </div>
</template>

<style scoped>
.mx-load-more {
  display: grid;
  place-items: center;
  padding: 24px 0 8px;
}

.mx-load-more__done {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--mx-on-surface-muted);
}
</style>
