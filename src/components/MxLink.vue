<script setup lang="ts">
import { computed } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { isExternalHref, type LinkTarget, useLinkComponent } from '../links/links';

const props = defineProps<{
  to?: LinkTarget;
  href?: string;
  external?: boolean;
}>();

const { t } = useMixtapeText();
const link = useLinkComponent();

const target = computed(() => props.href ?? (typeof props.to === 'string' ? props.to : undefined));
const isExternal = computed(() => props.external ?? (target.value ? isExternalHref(target.value) : false));
const useRouter = computed(() => props.to !== undefined && link !== null && !isExternal.value);
</script>

<template>
  <component :is="link" v-if="useRouter" :to="to">
    <slot />
  </component>
  <a
    v-else
    :href="target"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <span v-if="isExternal" class="mx-sr-only">{{ t('common.newTab') }}</span>
  </a>
</template>
