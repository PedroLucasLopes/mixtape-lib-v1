<script setup lang="ts">
import { computed } from 'vue';
import { formatDate, relativeTime } from '../format';
import { useMixtapeText } from '../i18n/useMixtapeText';

const props = withDefaults(defineProps<{ date: string; absolute?: boolean }>(), { absolute: false });

const { locale } = useMixtapeText();

const full = computed(() => formatDate(props.date, locale.value, { dateStyle: 'long', timeStyle: 'short' }));
const text = computed(() => (props.absolute ? formatDate(props.date, locale.value) : relativeTime(props.date, locale.value)));
</script>

<template>
  <time class="mx-time-ago" :datetime="date" :title="full">{{ text }}</time>
</template>

<style scoped>
.mx-time-ago {
  white-space: nowrap;
}
</style>
